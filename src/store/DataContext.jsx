import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { DEFAULT_MASTER, MASTER_KEY } from './schema';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [master, setMaster] = useState(() => {
    try {
      const saved = localStorage.getItem(MASTER_KEY);
      if (saved) return JSON.parse(saved);
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
    const LEGACY_KEYS = {
      career_roadmap: 'careerengineer_career_roadmap_v1',
      job_analysis: 'careerengineer_job_analysis_v1',
      experience: 'careerengineer_experience_v1',
      resume: 'careerengineer_resume_v1',
      career_description: 'careerengineer_career_description_v1',
      motivation: 'careerengineer_motivation_v1',
      jobcompetency: 'careerengineer_jobcompetency_v1',
      personality: 'careerengineer_personality_v1',
      goalachievement: 'careerengineer_goalachievement_v1',
      careergoal: 'careerengineer_careergoal_v1',
      self_introduction: 'careerengineer_self_introduction_v1',
      interview_new: 'careerengineer_interview_new_v1',
      interview_career: 'careerengineer_interview_career_v1',
    };
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
    const ALL_LEGACY = [
      'careerengineer_career_roadmap_v1', 'careerengineer_job_analysis_v1', 'careerengineer_experience_v1',
      'careerengineer_resume_v1', 'careerengineer_career_description_v1', 'careerengineer_motivation_v1',
      'careerengineer_jobcompetency_v1', 'careerengineer_personality_v1', 'careerengineer_goalachievement_v1',
      'careerengineer_careergoal_v1', 'careerengineer_self_introduction_v1', 'careerengineer_interview_new_v1',
      'careerengineer_interview_career_v1',
    ];
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

    // 워크북별 localStorage도 함께 비움 (경험·로드맵 제외)
    const KEYS_TO_CLEAR = [
      'careerengineer_job_analysis_v1',
      'careerengineer_resume_v1',
      'careerengineer_career_description_v1',
      'careerengineer_motivation_v1',
      'careerengineer_jobcompetency_v1',
      'careerengineer_personality_v1',
      'careerengineer_goalachievement_v1',
      'careerengineer_careergoal_v1',
      'careerengineer_self_introduction_v1',
      'careerengineer_interview_new_v1',
      'careerengineer_interview_career_v1',
    ];
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
    setMaster({ ...slot.master, updatedAt: new Date().toISOString() });
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
