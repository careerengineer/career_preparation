import { WORKBOOKS } from './schema';

// 워크북 진행률 (0 | 50 | 100)
export function getWorkbookProgress(master, workbookKey) {
  if (workbookKey === 'experience') {
    return master.experiences.length > 0 ? 100 : 0;
  }
  if (workbookKey === 'career_roadmap') {
    return master.roadmap.completedAt ? 100 : Object.keys(master.roadmap.quizAnswers || {}).length > 0 ? 50 : 0;
  }
  if (workbookKey === 'careergoal') {
    if (master.careergoal.completedAt) return 100;
    const filled = ['year5', 'year3', 'year1', 'rationale'].some((k) => master.careergoal[k]);
    return filled ? 50 : 0;
  }
  if (workbookKey === 'job_analysis') {
    if (master.jobAnalysis.completedAt) return 100;
    const filled =
      master.jobAnalysis.my_experience_pool ||
      master.jobAnalysis.success_signals ||
      master.jobAnalysis.connection_sentences;
    return filled ? 50 : 0;
  }
  const out = master.outputs[workbookKey];
  if (!out) return 0;
  if (out.completedAt) return 100;
  if (out.finalText || Object.keys(out.answers || {}).length > 0) return 50;
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
export function getNextRecommendation(master) {
  if (!master.profile.industry && !master.profile.position) {
    return { kind: 'profile', label: '먼저 산업/직무/회사를 입력해주세요' };
  }
  if (!master.roadmap.completedAt) {
    return { kind: 'workbook', workbookKey: 'career_roadmap', label: 'STEP 0 진단부터 시작' };
  }
  if (master.roadmap.weakestStep != null) {
    const wk = WORKBOOKS.find((w) => w.step === master.roadmap.weakestStep);
    if (wk && getWorkbookProgress(master, wk.key) < 100) {
      return { kind: 'workbook', workbookKey: wk.key, label: `약점 STEP ${master.roadmap.weakestStep} · ${wk.title}` };
    }
  }
  const next = WORKBOOKS.find((w) => getWorkbookProgress(master, w.key) < 100);
  if (next) {
    return { kind: 'workbook', workbookKey: next.key, label: `다음: ${next.stepLabel} · ${next.title}` };
  }
  return { kind: 'done', label: '모든 워크북을 완료했습니다 🎉' };
}
