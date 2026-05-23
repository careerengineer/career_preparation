import { useEffect, useRef, useState } from 'react';
import { useDataStore } from '../../store/DataContext.jsx';
import { WorkbookShell } from '../../shared/components/WorkbookShell.jsx';
import LegacyWorkbook from './legacy.jsx';

const LEGACY_KEY = "careerengineer_interview_new_v1";
const WORKBOOK_KEY = "interview_new";

// master ↔ legacy storage 양방향 sync.
// - 동기 priming (useState 초기화): 자식 워크북 mount 전에 storage 채움 → basicInfo 입력 화면 자동 skip.
// - 1.5초마다: storage → master로 push back.
function Bridge() {
  const { master, updateSlice } = useDataStore();
  const lastRef = useRef('');

  // 동기 priming - useState 초기화 함수에서 실행 (워크북 useState보다 먼저 완료)
  useState(() => {
    try {
      const existing = localStorage.getItem(LEGACY_KEY);
      let data = existing ? JSON.parse(existing) : {};
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
    return true;
  });

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

export default function InterviewNewPage() {
  return (
    <WorkbookShell
      workbookKey="interview_new"
      mentoringType="interview"
    >
      <Bridge />
    </WorkbookShell>
  );
}
