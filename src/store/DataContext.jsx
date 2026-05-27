import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { DEFAULT_MASTER, MASTER_KEY, mergeWithDefaults } from './schema';
import { LEGACY_KEYS } from './legacySync.js';
import { loadSnapshots, pushSnapshot, deleteSnapshot } from './snapshots.js';

// 자동 백업(스냅샷) 적재 주기: 5분에 1개(변경 시) + 페이지 이탈 시 즉시.
const SNAPSHOT_MIN_GAP = 5 * 60 * 1000;

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [master, setMaster] = useState(() => {
    try {
      const saved = localStorage.getItem(MASTER_KEY);
      if (saved) {
        return mergeWithDefaults(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('load failed:', e);
    }
    return { ...DEFAULT_MASTER, createdAt: new Date().toISOString() };
  });

  // 자동 저장 (debounce 1초)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(
          MASTER_KEY,
          JSON.stringify({ ...master, updatedAt: new Date().toISOString() })
        );
      } catch (e) {
        console.warn('save failed:', e);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [master]);

  // ─── 자동 백업(롤링 스냅샷) ───────────────────────────────
  // 최신 master를 ref로 들고 있다가, 5분 주기·변경 시·페이지 이탈 시 적재한다.
  const masterRef = useRef(master);
  useEffect(() => { masterRef.current = master; }, [master]);
  const lastSnapAtRef = useRef(0);
  const [snapshotsVersion, setSnapshotsVersion] = useState(0);

  const captureSnapshot = useCallback((force = false) => {
    const now = Date.now();
    if (!force && now - lastSnapAtRef.current < SNAPSHOT_MIN_GAP) return false;
    const { added } = pushSnapshot(masterRef.current);
    if (added) { lastSnapAtRef.current = now; setSnapshotsVersion((v) => v + 1); }
    return added;
  }, []);

  // 변경 시: 저장(debounce 1초) 직후 시도 — 단, 5분 스로틀이 걸려 과다 적재를 막는다.
  useEffect(() => {
    const t = setTimeout(() => captureSnapshot(false), 1500);
    return () => clearTimeout(t);
  }, [master, captureSnapshot]);

  // 5분 주기
  useEffect(() => {
    const id = setInterval(() => captureSnapshot(false), SNAPSHOT_MIN_GAP);
    return () => clearInterval(id);
  }, [captureSnapshot]);

  // 페이지를 벗어날 때: 5분 스로틀을 무시하고 변경분을 즉시 적재(중복은 자동 스킵)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onHide = () => { if (document.visibilityState === 'hidden') captureSnapshot(true); };
    const onUnload = () => captureSnapshot(true);
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('beforeunload', onUnload);
    return () => {
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('beforeunload', onUnload);
    };
  }, [captureSnapshot]);

  const getSnapshots = useCallback(() => loadSnapshots(), []);
  const deleteSnapshotAt = useCallback((at) => { deleteSnapshot(at); setSnapshotsVersion((v) => v + 1); }, []);

  const updateSlice = useCallback((slice, patch) => {
    setMaster((m) => ({ ...m, [slice]: { ...m[slice], ...patch } }));
  }, []);

  const replaceMaster = useCallback((newMaster) => {
    setMaster({ ...newMaster, updatedAt: new Date().toISOString() });
  }, []);

  // 단일 워크북만 리셋 (해당 워크북의 모든 데이터 + localStorage 삭제)
  const resetSingleWorkbook = useCallback((workbookKey) => {
    setMaster((m) => {
      const next = { ...m, updatedAt: new Date().toISOString() };
      // workbookRaw 해당 키만 null
      next.workbookRaw = { ...m.workbookRaw, [workbookKey]: null };
      // outputs 해당 키 초기화 (있을 경우)
      if (m.outputs?.[workbookKey] !== undefined) {
        next.outputs = { ...m.outputs, [workbookKey]: { ...DEFAULT_MASTER.outputs[workbookKey] } };
      }
      // 특수 슬라이스 (워크북별)
      if (workbookKey === 'career_roadmap') next.roadmap = { ...DEFAULT_MASTER.roadmap };
      if (workbookKey === 'careergoal')     next.careergoal = { ...DEFAULT_MASTER.careergoal };
      if (workbookKey === 'job_analysis')   next.jobAnalysis = { ...DEFAULT_MASTER.jobAnalysis };
      if (workbookKey === 'experience')     next.experiences = [];
      // debounce(1초) 자동 저장 전에 reload 되면 옛 master가 그대로 돌아오므로 즉시 동기 저장
      try { localStorage.setItem(MASTER_KEY, JSON.stringify(next)); } catch (e) { console.warn('reset save failed:', e); }
      return next;
    });
    // 워크북 자체 localStorage 키 삭제
    try { if (LEGACY_KEYS[workbookKey]) localStorage.removeItem(LEGACY_KEYS[workbookKey]); } catch {}
  }, []);

  // 전체 데이터 리셋 (모든 워크북 + 프로필 + 경험) — 회사별 저장본(슬롯)은 보존
  const resetAllData = useCallback(() => {
    const fresh = JSON.parse(JSON.stringify(DEFAULT_MASTER));
    fresh.createdAt = new Date().toISOString();
    fresh.updatedAt = new Date().toISOString();
    setMaster(fresh);
    // debounce 저장 전에 reload 되어도 옛 master가 안 돌아오도록 즉시 동기 저장
    try { localStorage.setItem(MASTER_KEY, JSON.stringify(fresh)); } catch (e) { console.warn('reset-all save failed:', e); }
    // 워크북 legacy 키는 LEGACY_KEYS 단일 소스에서 파생 (새 워크북 자동 포함)
    const ALL_LEGACY = Object.values(LEGACY_KEYS);
    try { ALL_LEGACY.forEach((k) => localStorage.removeItem(k)); } catch {}
  }, []);

  // 회사·직무 관련 데이터만 리셋 (experience, career_roadmap은 유지)
  const resetCompanyRelated = useCallback(() => {
    setMaster((m) => {
      const next = {
        ...m,
        profile: { ...DEFAULT_MASTER.profile, userName: m.profile.userName },
        jobAnalysis: { ...DEFAULT_MASTER.jobAnalysis },
        careergoal: { ...DEFAULT_MASTER.careergoal },
        outputs: { ...DEFAULT_MASTER.outputs },
        workbookRaw: {
          ...DEFAULT_MASTER.workbookRaw,
          experience: m.workbookRaw?.experience || null,
          career_roadmap: m.workbookRaw?.career_roadmap || null,
        },
        updatedAt: new Date().toISOString(),
      };
      // debounce 저장 전 reload 되어도 옛 데이터가 돌아오지 않도록 즉시 동기 저장
      try { localStorage.setItem(MASTER_KEY, JSON.stringify(next)); } catch (e) { console.warn('reset-company save failed:', e); }
      return next;
    });

    // 워크북별 localStorage도 함께 비움 (경험·로드맵 제외) — LEGACY_KEYS에서 파생
    const KEYS_TO_CLEAR = Object.values(LEGACY_KEYS).filter(
      (k) => k !== LEGACY_KEYS.experience && k !== LEGACY_KEYS.career_roadmap
    );
    try { KEYS_TO_CLEAR.forEach((k) => localStorage.removeItem(k)); } catch {}
  }, []);

  // ─── 회사별 슬롯 저장/복원 ────────────────────────────────
  // localStorage에 별도 키로 회사별 스냅샷 보관
  const SLOTS_KEY = 'careerengineer_company_slots_v1';

  const readSlots = useCallback(() => {
    try { return JSON.parse(localStorage.getItem(SLOTS_KEY) || '{}'); } catch { return {}; }
  }, []);
  const writeSlots = useCallback((slots) => {
    try { localStorage.setItem(SLOTS_KEY, JSON.stringify(slots)); return true; } catch (e) { console.warn(e); return false; }
  }, []);

  const saveCompanySlot = useCallback((slotName) => {
    if (!slotName || !slotName.trim()) return false;
    const slots = readSlots();
    slots[slotName.trim()] = {
      master,
      savedAt: new Date().toISOString(),
    };
    return writeSlots(slots);  // 저장 성공 여부 반환(쿼터 초과 시 false)
  }, [master, readSlots, writeSlots]);

  const loadCompanySlot = useCallback((slotName) => {
    const slots = readSlots();
    const slot = slots[slotName];
    if (!slot?.master) throw new Error('해당 슬롯이 없습니다.');
    setMaster({ ...mergeWithDefaults(slot.master), updatedAt: new Date().toISOString() });
  }, [readSlots]);

  const deleteCompanySlot = useCallback((slotName) => {
    const slots = readSlots();
    delete slots[slotName];
    writeSlots(slots);
  }, [readSlots, writeSlots]);

  const listCompanySlots = useCallback(() => {
    const slots = readSlots();
    return Object.entries(slots).map(([name, v]) => ({
      name, savedAt: v.savedAt,
      industry: v.master?.profile?.industry || '',
      position: v.master?.profile?.position || '',
      company: v.master?.profile?.company || '',
    })).sort((a, b) => (b.savedAt || '').localeCompare(a.savedAt || ''));
  }, [readSlots]);

  // 모든 슬롯 객체 반환 (전체 저장본 .zip 백업 빌더에 전달)
  const getAllSlots = useCallback(() => readSlots(), [readSlots]);

  // 단일 슬롯의 master 스냅샷 반환 (docx+xlsx 내보내기에 사용)
  const getCompanySlotMaster = useCallback((slotName) => {
    const slots = readSlots();
    const slot = slots[slotName];
    if (!slot?.master) throw new Error('해당 슬롯이 없습니다.');
    return slot.master;
  }, [readSlots]);

  // 전체 슬롯 import (병합/덮어쓰기) — 파싱된 slots 객체를 받는다
  const importAllSlots = useCallback((slotsObj, mode = 'merge') => {
    if (!slotsObj || typeof slotsObj !== 'object') throw new Error('복원할 저장본 데이터가 없습니다.');
    const current = mode === 'replace' ? {} : readSlots();
    const merged = { ...current, ...slotsObj };
    writeSlots(merged);
    return { count: Object.keys(slotsObj).length, total: Object.keys(merged).length };
  }, [readSlots, writeSlots]);

  return (
    <DataContext.Provider
      value={{
        master,
        updateSlice,
        replaceMaster,
        resetSingleWorkbook,
        resetAllData,
        resetCompanyRelated,
        saveCompanySlot,
        loadCompanySlot,
        deleteCompanySlot,
        listCompanySlots,
        getCompanySlotMaster,
        getAllSlots,
        importAllSlots,
        getSnapshots,
        deleteSnapshotAt,
        captureSnapshot,
        snapshotsVersion,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useDataStore = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useDataStore must be inside DataProvider');
  return ctx;
};
