import { useEffect, useRef, useState } from 'react';
import { useDataStore } from '../../store/DataContext.jsx';
import { WorkbookShell } from '../../shared/components/WorkbookShell.jsx';
import LegacyWorkbook from './legacy.jsx';

const LEGACY_KEY = 'careerengineer_experience_v1';
const WORKBOOK_KEY = 'experience';

function Bridge() {
  const { master, updateSlice, replaceMaster } = useDataStore();
  const lastRef = useRef('');

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
      };
      const experiences = (Array.isArray(data.experiences) && data.experiences.length > 0)
        ? data.experiences
        : (master.experiences || []);
      const primed = { ...data, basicInfo, experiences, savedAt: data.savedAt || new Date().toISOString() };
      localStorage.setItem(LEGACY_KEY, JSON.stringify(primed));
      lastRef.current = JSON.stringify(primed);
    } catch (e) {
      console.warn('[experience] priming failed:', e);
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

        if (data.basicInfo) {
          const patch = {};
          const co = data.basicInfo.company || data.basicInfo.target || '';
          if (data.basicInfo.industry !== undefined && data.basicInfo.industry !== master.profile.industry) patch.industry = data.basicInfo.industry;
          if (data.basicInfo.position !== undefined && data.basicInfo.position !== master.profile.position) patch.position = data.basicInfo.position;
          if (co !== master.profile.company) patch.company = co;
          if (Object.keys(patch).length > 0) updateSlice('profile', patch);
        }

        if (Array.isArray(data.experiences) && JSON.stringify(data.experiences) !== JSON.stringify(master.experiences)) {
          replaceMaster({ ...master, experiences: data.experiences });
        }

        updateSlice('workbookRaw', { experience: { ...data, savedAt: new Date().toISOString() } });
      } catch (e) {
        console.warn('[experience] sync back failed:', e);
      }
    }, 1500);
    return () => clearInterval(id);
  }, [master, updateSlice, replaceMaster]);

  return <LegacyWorkbook />;
}

export default function ExperiencePage() {
  return (
    <WorkbookShell
      workbookKey="experience"
      mentoringType="cover_letter"
    >
      <Bridge />
    </WorkbookShell>
  );
}
