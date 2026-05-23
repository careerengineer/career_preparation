import { useEffect, useRef } from 'react';
import { useDataStore } from '../../store/DataContext.jsx';
import { WorkbookShell } from '../../shared/components/WorkbookShell.jsx';
import ExperienceWorkbook from './legacy.jsx';

const LEGACY_KEY = 'careerengineer_experience_v1';

// master ↔ legacy localStorage 양방향 동기화 어댑터
function ExperienceBridge() {
  const { master, updateSlice, replaceMaster } = useDataStore();
  const lastSyncedRef = useRef('');

  // 마운트 시: master → legacy storage priming
  useEffect(() => {
    try {
      const existing = localStorage.getItem(LEGACY_KEY);
      const data = existing ? JSON.parse(existing) : {};
      const primed = {
        ...data,
        basicInfo: {
          industry: master.profile.industry || data.basicInfo?.industry || '',
          position: master.profile.position || data.basicInfo?.position || '',
          target: master.profile.company || data.basicInfo?.target || '',
        },
        experiences: master.experiences?.length > 0 ? master.experiences : (data.experiences || []),
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(LEGACY_KEY, JSON.stringify(primed));
      lastSyncedRef.current = JSON.stringify(primed);
    } catch (e) {
      console.warn('priming failed:', e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 1초마다 legacy storage → master로 push back
  useEffect(() => {
    const id = setInterval(() => {
      try {
        const raw = localStorage.getItem(LEGACY_KEY);
        if (!raw || raw === lastSyncedRef.current) return;
        lastSyncedRef.current = raw;
        const data = JSON.parse(raw);
        if (data.basicInfo) {
          const profilePatch = {};
          if (data.basicInfo.industry !== master.profile.industry) profilePatch.industry = data.basicInfo.industry;
          if (data.basicInfo.position !== master.profile.position) profilePatch.position = data.basicInfo.position;
          if (data.basicInfo.target !== master.profile.company) profilePatch.company = data.basicInfo.target;
          if (Object.keys(profilePatch).length > 0) updateSlice('profile', profilePatch);
        }
        if (Array.isArray(data.experiences) && JSON.stringify(data.experiences) !== JSON.stringify(master.experiences)) {
          replaceMaster({ ...master, experiences: data.experiences });
        }
      } catch (e) {
        console.warn('sync back failed:', e);
      }
    }, 1500);
    return () => clearInterval(id);
  }, [master, updateSlice, replaceMaster]);

  return <ExperienceWorkbook />;
}

export default function ExperiencePage() {
  return (
    <WorkbookShell
      workbookKey="experience"
      title="경험 정리"
      stepLabel="STEP 2 · 경험 정리"
      mentoringType="cover_letter"
      relatedKeys={['job_analysis', 'resume', 'motivation', 'self_introduction']}
    >
      <ExperienceBridge />
    </WorkbookShell>
  );
}
