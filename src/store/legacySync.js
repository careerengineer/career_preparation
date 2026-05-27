// master → 각 워크북 legacy localStorage 동기화.
// 전체/부분 import, 회사 슬롯 불러오기 직후 호출해야 워크북이 새 데이터로 priming된다.
// (각 워크북 Bridge는 mount 시 legacy storage를 우선으로 읽기 때문)

export const LEGACY_KEYS = {
  career_roadmap: 'careerengineer_career_roadmap_v1',
  job_analysis: 'careerengineer_job_analysis_v1',
  experience: 'careerengineer_experience_v1',
  resume: 'careerengineer_resume_v1',
  career_description: 'careerengineer_career_description_v1',
  motivation: 'careerengineer_motivation_v1',
  jobcompetency: 'careerengineer_jobcompetency_v1',
  personality: 'careerengineer_personality_v1',
  goalachievement: 'careerengineer_goalachievement_v1',
  growth_process: 'careerengineer_growth_process_v1',
  careergoal: 'careerengineer_careergoal_v1',
  self_introduction: 'careerengineer_self_introduction_v1',
  interview_new: 'careerengineer_interview_new_v1',
  interview_career: 'careerengineer_interview_career_v1',
};

// master의 workbookRaw/experiences를 각 워크북 legacy storage에 그대로 기록.
// raw가 비어 있으면 해당 키 제거(빈 상태로 priming).
export function syncLegacyFromMaster(master) {
  if (!master) return;
  const now = new Date().toISOString();
  try {
    for (const [wb, key] of Object.entries(LEGACY_KEYS)) {
      if (wb === 'experience') continue; // 아래서 별도 처리
      const raw = master.workbookRaw?.[wb];
      if (raw && typeof raw === 'object' && Object.keys(raw).length > 0) {
        // savedAt을 최신으로 올려 Bridge priming이 master를 우선 채택하도록
        localStorage.setItem(key, JSON.stringify({ ...raw, savedAt: now }));
      } else {
        localStorage.removeItem(key);
      }
    }
    // experience: experiences 배열 + raw. 완료(phase 'complete')는 보존하고, 그 외엔 카드 목록이 보이도록 'list'.
    const expKey = LEGACY_KEYS.experience;
    const expRaw = master.workbookRaw?.experience || {};
    const exps = Array.isArray(master.experiences) ? master.experiences : [];
    if (exps.length > 0 || Object.keys(expRaw).length > 0) {
      const expPhase = (expRaw.phase === 'complete' || expRaw.phase === 'completed') ? expRaw.phase : 'list';
      localStorage.setItem(expKey, JSON.stringify({ ...expRaw, experiences: exps, phase: expPhase, savedAt: now }));
    } else {
      localStorage.removeItem(expKey);
    }
  } catch (e) {
    console.warn('[legacySync] failed:', e);
  }
}
