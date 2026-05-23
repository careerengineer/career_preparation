import { WORKBOOKS } from './schema';

// 워크북 진행률 (0 | 50 | 100)
// 100%는 사용자가 워크북 '완료 페이지(complete/completed)'에 도달했을 때만 표시.
// 작성 중간이면 50, 시작 안 했으면 0.

function rawHasContent(raw) {
  if (!raw) return false;
  if (raw.finalText && String(raw.finalText).trim()) return true;
  if (raw.answers && Object.values(raw.answers).some((v) => v && String(v).trim())) return true;
  if (raw.experiences && Array.isArray(raw.experiences) && raw.experiences.length > 0) return true;
  return false;
}

// 워크북이 자체 '완료 페이지'에 도달했는지 (워크북마다 phase 이름이 달라 여러 패턴 체크)
function rawIsCompleted(raw) {
  if (!raw) return false;
  if (raw.completedAt) return true;
  // motivation/jobcompetency 등 자소서: currentPhase === 'completed'
  if (raw.currentPhase === 'completed' || raw.currentPhase === 'complete') return true;
  // experience: phase === 'complete'
  if (raw.phase === 'complete' || raw.phase === 'completed') return true;
  // interview/self_introduction: isCompleted boolean
  if (raw.isCompleted === true) return true;
  return false;
}

// 작성 진도 비율 계산 (0~95) — 작성된 답변 수 기반
function calcProgressFromRaw(raw) {
  if (!raw) return 0;
  if (raw.answers && typeof raw.answers === 'object') {
    const filled = Object.values(raw.answers).filter((v) => v && String(v).trim().length > 3).length;
    if (filled === 0) return 5;       // 시작만 함
    if (filled <= 2) return 20;
    if (filled <= 5) return 40;
    if (filled <= 10) return 60;
    if (filled <= 15) return 75;
    return 90;
  }
  if (raw.experiences && Array.isArray(raw.experiences)) {
    const n = raw.experiences.length;
    if (n === 0) return 5;
    if (n === 1) return 30;
    if (n === 2) return 55;
    return 80;
  }
  return 10;
}

export function getWorkbookProgress(master, workbookKey) {
  const raw = master.workbookRaw?.[workbookKey];

  if (workbookKey === 'experience') {
    if (rawIsCompleted(raw)) return 100;
    if (master.experiences.length > 0) {
      const n = master.experiences.length;
      if (n === 1) return 35;
      if (n === 2) return 55;
      if (n === 3) return 75;
      return 90;
    }
    if (rawHasContent(raw)) return 10;
    return 0;
  }
  if (workbookKey === 'career_roadmap') {
    if (master.roadmap.completedAt || rawIsCompleted(raw)) return 100;
    if (Object.keys(master.roadmap.quizAnswers || {}).length > 0) {
      const n = Object.keys(master.roadmap.quizAnswers).length;
      if (n <= 2) return 25;
      if (n <= 5) return 55;
      return 80;
    }
    if (rawHasContent(raw)) return calcProgressFromRaw(raw);
    return 0;
  }
  if (workbookKey === 'careergoal') {
    if (master.careergoal.completedAt || rawIsCompleted(raw)) return 100;
    const filled = ['year5', 'year3', 'year1', 'rationale'].filter((k) => master.careergoal[k]).length;
    if (filled === 4) return 90;
    if (filled >= 2) return 60;
    if (filled >= 1) return 30;
    if (rawHasContent(raw)) return calcProgressFromRaw(raw);
    return 0;
  }
  if (workbookKey === 'job_analysis') {
    if (master.jobAnalysis.completedAt || rawIsCompleted(raw)) return 100;
    const fields = ['my_experience_pool', 'success_signals', 'connection_sentences', 'experience_translation'];
    const filled = fields.filter((k) => master.jobAnalysis[k]).length;
    if (filled === 4) return 90;
    if (filled >= 2) return 60;
    if (filled >= 1) return 30;
    if (rawHasContent(raw)) return calcProgressFromRaw(raw);
    return 0;
  }
  // 나머지 워크북
  const out = master.outputs[workbookKey];
  if (out?.completedAt || rawIsCompleted(raw)) return 100;
  if (out?.finalText && out.finalText.trim()) return 85;
  if (out?.answers && Object.keys(out.answers).length > 0) {
    return Math.max(30, Math.min(85, Object.keys(out.answers).length * 10));
  }
  if (rawHasContent(raw)) return calcProgressFromRaw(raw);
  return 0;
}

// STEP별 평균 진행률
export function getStepProgress(master, step) {
  const stepWorkbooks = WORKBOOKS.filter((w) => w.step === step);
  if (stepWorkbooks.length === 0) return 0;
  const total = stepWorkbooks.reduce((sum, w) => sum + getWorkbookProgress(master, w.key), 0);
  return Math.round(total / stepWorkbooks.length);
}

// ImportPanel용
export function getImportableItems(master, workbookKey) {
  const items = [];

  if (master.profile.industry || master.profile.position) {
    items.push({
      kind: 'profile',
      label: `기본정보: ${master.profile.industry || '-'} / ${master.profile.position || '-'}`,
      data: master.profile,
    });
  }

  const usesExperience = [
    'resume', 'career_description', 'motivation', 'jobcompetency',
    'personality', 'goalachievement', 'self_introduction',
    'interview_new', 'interview_career', 'job_analysis',
  ];
  if (usesExperience.includes(workbookKey) && master.experiences.length > 0) {
    master.experiences.forEach((exp) => {
      items.push({
        kind: 'experience',
        id: exp.id,
        label: `경험: ${exp.org || '미입력'} - ${exp.role || exp.category || ''}`,
        data: exp,
      });
    });
  }

  const usesJobAnalysis = [
    'resume', 'career_description', 'motivation', 'jobcompetency',
    'self_introduction', 'interview_new', 'interview_career',
  ];
  if (usesJobAnalysis.includes(workbookKey) && master.jobAnalysis.completedAt) {
    items.push({
      kind: 'job_analysis',
      label: '직무 분석 결과',
      data: master.jobAnalysis,
    });
  }

  if (workbookKey === 'interview_new' || workbookKey === 'interview_career') {
    ['motivation', 'jobcompetency', 'personality', 'goalachievement', 'careergoal', 'self_introduction'].forEach((k) => {
      const out = master.outputs[k];
      if (out?.finalText) {
        items.push({ kind: `output_${k}`, label: `자소서: ${k}`, data: out });
      }
    });
  }

  // workbookRaw에서 다른 워크북의 작성 내용 (Bridge가 sync한 legacy storage 그대로)
  // 자소서/면접/이력서 워크북은 careergoal/jobcompetency/motivation 등 raw도 import 가능
  const TITLES = {
    careergoal: '입사후 포부', motivation: '지원동기', jobcompetency: '직무확보역량',
    personality: '성격의 장단점', goalachievement: '목표수립·달성',
    self_introduction: '1분 자기소개', resume: '이력서', career_description: '경력기술서',
    job_analysis: '채용공고·직무 분석', interview_new: '신입 면접', interview_career: '경력직 면접',
  };
  const raws = master.workbookRaw || {};
  Object.entries(raws).forEach(([k, data]) => {
    if (!data || k === workbookKey || k === 'experience' || k === 'profile') return;
    // 이미 outputs.finalText로 추가된 항목은 중복 방지
    if (items.find((i) => i.kind === `output_${k}`)) return;
    // basicInfo 외에 다른 키가 있어야 (실제 작성 내용 있어야) 표시
    const keys = Object.keys(data).filter((x) => x !== 'basicInfo' && x !== 'savedAt');
    if (keys.length === 0) return;
    items.push({
      kind: `raw_${k}`,
      label: `${TITLES[k] || k}: 작성 내용`,
      data: { __raw: true, workbookKey: k, raw: data },
    });
  });

  return items;
}

// NextActionCard용: 다음에 할 일 추천
// 우선순위:
// 1) 프로필 없음 → 입력 안내
// 2) 진행 중(50%) 워크북 있으면 → 이어서 작성 (어디든)
// 3) 약점 STEP 미완료 → 그것
// 4) 작성한 워크북이 하나도 없으면 → STEP 0 진단 (시작점 안내)
// 5) 미시작 워크북 → 다음
// 6) 모두 완료 → done
export function getNextRecommendation(master) {
  if (!master.profile.industry && !master.profile.position && !master.profile.company) {
    return { kind: 'profile', label: '먼저 산업/직무/회사를 입력해주세요' };
  }
  // 진행 중(50%)인 것 이어서 작성이 가장 효율적
  const inProgress = WORKBOOKS.find((w) => getWorkbookProgress(master, w.key) === 50);
  if (inProgress) {
    return { kind: 'workbook', workbookKey: inProgress.key, label: `이어서 작성: ${inProgress.stepLabel} · ${inProgress.title}` };
  }
  // 약점 STEP 안의 미완료 워크북
  if (master.roadmap.weakestStep != null) {
    const stepBooks = WORKBOOKS.filter((w) => w.step === master.roadmap.weakestStep);
    const target = stepBooks.find((w) => getWorkbookProgress(master, w.key) < 100);
    if (target) {
      return { kind: 'workbook', workbookKey: target.key, label: `약점 STEP ${master.roadmap.weakestStep} · ${target.title}` };
    }
  }
  // 아무것도 작성 안 했고 STEP 0 미완료면 시작점으로 안내 (한 번만)
  const anyStarted = WORKBOOKS.some((w) => getWorkbookProgress(master, w.key) > 0);
  if (!anyStarted && getWorkbookProgress(master, 'career_roadmap') < 100) {
    return { kind: 'workbook', workbookKey: 'career_roadmap', label: '먼저 시작하기: STEP 0 · 취업 로드맵 진단' };
  }
  // 미시작 첫 워크북
  const notStarted = WORKBOOKS.find((w) => getWorkbookProgress(master, w.key) === 0);
  if (notStarted) {
    return { kind: 'workbook', workbookKey: notStarted.key, label: `다음: ${notStarted.stepLabel} · ${notStarted.title}` };
  }
  return { kind: 'done', label: '모든 워크북을 완료했습니다' };
}
