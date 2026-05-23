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

  // 회사·직무 관련 데이터만 리셋 (experience, career_roadmap은 유지)
  const resetCompanyRelated = useCallback(() => {
    setMaster((m) => ({
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
    }));

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
    try { localStorage.setItem(SLOTS_KEY, JSON.stringify(slots)); } catch (e) { console.warn(e); }
  }, []);

  const saveCompanySlot = useCallback((slotName) => {
    if (!slotName || !slotName.trim()) return;
    const slots = readSlots();
    slots[slotName.trim()] = {
      master,
      savedAt: new Date().toISOString(),
    };
    writeSlots(slots);
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

  // 모든 슬롯을 한 .json 파일로 export
  const exportAllSlotsFile = useCallback(() => {
    const slots = readSlots();
    const payload = {
      format: 'careerengineer-all-slots',
      version: 1,
      exportedAt: new Date().toISOString(),
      slotCount: Object.keys(slots).length,
      slots,
    };
    const json = JSON.stringify(payload, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const ts = (() => {
      const d = new Date(); const pad = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}`;
    })();
    const filename = `careerengineer_전체슬롯_${ts}.json`;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return filename;
  }, [readSlots]);

  // 단일 슬롯을 .json으로 export
  const exportSingleSlotFile = useCallback((slotName) => {
    const slots = readSlots();
    const slot = slots[slotName];
    if (!slot) throw new Error('해당 슬롯이 없습니다.');
    const payload = {
      format: 'careerengineer-export',
      version: 1,
      exportedAt: new Date().toISOString(),
      data: slot.master,
      slotName,
    };
    const json = JSON.stringify(payload, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const safe = (s) => (s || '').replace(/[^가-힣a-zA-Z0-9]/g, '_').slice(0, 30);
    const ts = (() => {
      const d = new Date(); const pad = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}`;
    })();
    const filename = `careerengineer_슬롯_${safe(slotName)}_${ts}.json`;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return filename;
  }, [readSlots]);

  // 전체 슬롯 import (병합/덮어쓰기)
  const importAllSlotsFile = useCallback((file, mode = 'merge') => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result);
          if (parsed.format !== 'careerengineer-all-slots') {
            return reject(new Error('전체 슬롯 백업 파일이 아닙니다.'));
          }
          const current = mode === 'replace' ? {} : readSlots();
          const merged = { ...current, ...parsed.slots };
          writeSlots(merged);
          resolve({ count: Object.keys(parsed.slots).length, total: Object.keys(merged).length });
        } catch (e) { reject(new Error('파일 파싱 실패: ' + e.message)); }
      };
      reader.onerror = () => reject(new Error('파일을 읽을 수 없습니다.'));
      reader.readAsText(file);
    });
  }, [readSlots, writeSlots]);

  return (
    <DataContext.Provider
      value={{
        master,
        updateSlice,
        replaceMaster,
        resetSingleWorkbook,
        resetCompanyRelated,
        saveCompanySlot,
        loadCompanySlot,
        deleteCompanySlot,
        listCompanySlots,
        exportAllSlotsFile,
        exportSingleSlotFile,
        importAllSlotsFile,
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
