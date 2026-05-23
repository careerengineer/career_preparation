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

  const updateOutput = useCallback((workbookKey, patch) => {
    setMaster((m) => ({
      ...m,
      outputs: {
        ...m.outputs,
        [workbookKey]: { ...m.outputs[workbookKey], ...patch },
      },
    }));
  }, []);

  const addExperience = useCallback((exp) => {
    setMaster((m) => ({ ...m, experiences: [...m.experiences, exp] }));
  }, []);

  const updateExperience = useCallback((id, patch) => {
    setMaster((m) => ({
      ...m,
      experiences: m.experiences.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }));
  }, []);

  const removeExperience = useCallback((id) => {
    setMaster((m) => ({ ...m, experiences: m.experiences.filter((e) => e.id !== id) }));
  }, []);

  const replaceMaster = useCallback((newMaster) => {
    setMaster({ ...newMaster, updatedAt: new Date().toISOString() });
  }, []);

  const resetAll = useCallback(() => {
    setMaster({ ...DEFAULT_MASTER, createdAt: new Date().toISOString() });
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

  return (
    <DataContext.Provider
      value={{
        master,
        updateSlice,
        updateOutput,
        addExperience,
        updateExperience,
        removeExperience,
        replaceMaster,
        resetAll,
        resetCompanyRelated,
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
