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
