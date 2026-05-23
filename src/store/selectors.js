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

export function getWorkbookProgress(master, workbookKey) {
  const raw = master.workbookRaw?.[workbookKey];

  if (workbookKey === 'experience') {
    // 완료 페이지 도달했을 때만 100
    if (rawIsCompleted(raw)) return 100;
    // 카드 1개라도 있거나 작성 흔적 있으면 50
    if (master.experiences.length > 0 || rawHasContent(raw)) return 50;
    return 0;
  }
  if (workbookKey === 'career_roadmap') {
    if (master.roadmap.completedAt || rawIsCompleted(raw)) return 100;
    if (Object.keys(master.roadmap.quizAnswers || {}).length > 0 || rawHasContent(raw)) return 50;
    return 0;
  }
  if (workbookKey === 'careergoal') {
    if (master.careergoal.completedAt || rawIsCompleted(raw)) return 100;
    const filled = ['year5', 'year3', 'year1', 'rationale'].some((k) => master.careergoal[k]);
    if (filled || rawHasContent(raw)) return 50;
    return 0;
  }
  if (workbookKey === 'job_analysis') {
    if (master.jobAnalysis.completedAt || rawIsCompleted(raw)) return 100;
    const filled =
      master.jobAnalysis.my_experience_pool ||
      master.jobAnalysis.success_signals ||
      master.jobAnalysis.connection_sentences;
    if (filled || rawHasContent(raw)) return 50;
    return 0;
  }
  // 나머지 워크북: outputs.completedAt 또는 raw phase 기반
  const out = master.outputs[workbookKey];
  if (out?.completedAt || rawIsCompleted(raw)) return 100;
  if ((out?.finalText && out.finalText.trim()) ||
      (out?.answers && Object.keys(out.answers).length > 0) ||
      rawHasContent(raw)) return 50;
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
