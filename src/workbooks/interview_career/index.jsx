import { useEffect } from 'react';
import { useDataStore } from '../../store/DataContext.jsx';
import { WorkbookShell } from '../../shared/components/WorkbookShell.jsx';
import LegacyWorkbook from './legacy.jsx';

const LEGACY_KEY = "careerengineer_interview_career_v1";

// 마운트 시 master.profile → legacy storage의 basicInfo로 priming.
// 양방향 sync는 통합 흐름 보강 시 추가.
function Bridge() {
  const { master } = useDataStore();
  useEffect(() => {
    try {
      const existing = localStorage.getItem(LEGACY_KEY);
      const data = existing ? JSON.parse(existing) : {};
      const basicInfo = {
        industry: master.profile.industry || data.basicInfo?.industry || '',
        position: master.profile.position || data.basicInfo?.position || '',
        target: master.profile.company || data.basicInfo?.target || '',
        company: master.profile.company || data.basicInfo?.company || '',
      };
      const primed = { ...data, basicInfo, savedAt: new Date().toISOString() };
      localStorage.setItem(LEGACY_KEY, JSON.stringify(primed));
    } catch (e) {
      console.warn('priming failed:', e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <LegacyWorkbook />;
}

export default function InterviewCareerPage() {
  return (
    <WorkbookShell
      workbookKey="interview_career"
      title="경력직 면접"
      stepLabel="STEP 5 · 경력직 면접"
      mentoringType="interview"
      relatedKeys={["self_introduction","career_description","experience"]}
    >
      <Bridge />
    </WorkbookShell>
  );
}
