import { useEffect, useRef } from 'react';
import { useDataStore } from '../../store/DataContext.jsx';
import { WorkbookShell } from '../../shared/components/WorkbookShell.jsx';
import LegacyWorkbook from './legacy.jsx';

const LEGACY_KEY = "careerengineer_jobcompetency_v1";
const WORKBOOK_KEY = "jobcompetency";

// master ↔ legacy storage 양방향 sync.
// - 마운트 시: master.profile + master.workbookRaw[key] → storage로 priming.
// - 1.5초마다: storage → master로 push back (profile 변경 + workbookRaw 갱신).
function Bridge() {
  const { master, updateSlice } = useDataStore();
  const lastRef = useRef('');

  useEffect(() => {
    try {
      const existing = localStorage.getItem(LEGACY_KEY);
      let data = existing ? JSON.parse(existing) : {};
      // master.workbookRaw[key]가 있으면 우선 사용 (다른 기기/세션에서 import한 경우)
      const fromMaster = master.workbookRaw?.[WORKBOOK_KEY];
      if (fromMaster && (!existing || (fromMaster.savedAt && (!data.savedAt || fromMaster.savedAt > data.savedAt)))) {
        data = { ...fromMaster, ...data };
      }
      const basicInfo = {
        ...(data.basicInfo || {}),
        industry: master.profile.industry || data.basicInfo?.industry || '',
        position: master.profile.position || data.basicInfo?.position || '',
        target:   master.profile.company  || data.basicInfo?.target   || '',
        company:  master.profile.company  || data.basicInfo?.company  || '',
      };
      const primed = { ...data, basicInfo, savedAt: data.savedAt || new Date().toISOString() };
      localStorage.setItem(LEGACY_KEY, JSON.stringify(primed));
      lastRef.current = JSON.stringify(primed);
    } catch (e) {
      console.warn('[' + WORKBOOK_KEY + '] priming failed:', e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      try {
        const raw = localStorage.getItem(LEGACY_KEY);
        if (!raw || raw === lastRef.current) return;
        lastRef.current = raw;
        const data = JSON.parse(raw);

        // 1) profile sync (basicInfo → master.profile)
        if (data.basicInfo) {
          const patch = {};
          const co = data.basicInfo.company || data.basicInfo.target || '';
          if (data.basicInfo.industry !== undefined && data.basicInfo.industry !== master.profile.industry) patch.industry = data.basicInfo.industry;
          if (data.basicInfo.position !== undefined && data.basicInfo.position !== master.profile.position) patch.position = data.basicInfo.position;
          if (co !== master.profile.company) patch.company = co;
          if (Object.keys(patch).length > 0) updateSlice('profile', patch);
        }

        // 2) 워크북 raw 전체 sync → master.workbookRaw[key]
        updateSlice('workbookRaw', { [WORKBOOK_KEY]: { ...data, savedAt: new Date().toISOString() } });
      } catch (e) {
        console.warn('[' + WORKBOOK_KEY + '] sync back failed:', e);
      }
    }, 1500);
    return () => clearInterval(id);
  }, [master, updateSlice]);

  return <LegacyWorkbook />;
}

export default function JobcompetencyPage() {
  return (
    <WorkbookShell
      workbookKey="jobcompetency"
      mentoringType="cover_letter"
    >
      <Bridge />
    </WorkbookShell>
  );
}
