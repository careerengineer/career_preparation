export const MASTER_KEY = 'careerengineer_master_v1';
export const APP_VERSION = '1.0.0';

export const DEFAULT_MASTER = {
  version: 1,
  appVersion: APP_VERSION,
  updatedAt: null,
  createdAt: null,

  // ─── 공통 프로필 (모든 워크북이 읽음) ───
  profile: {
    industry: '',
    position: '',
    company: '',
    persona: '',
    userName: '',
  },

  // ─── STEP 0: 진단 ───
  roadmap: {
    weakestStep: null,
    scores: {},
    completedAt: null,
    quizAnswers: {},
  },

  // ─── STEP 1: 목표 ───
  careergoal: {
    year5: '',
    year3: '',
    year1: '',
    rationale: '',
    completedAt: null,
  },

  // ─── STEP 2: 직무 분석 (허브 #2) ───
  jobAnalysis: {
    company: { vision: '', recent_news: '', culture: '' },
    jd: { main_tasks: [], qualifications: [], preferred: [] },
    keywords: { hard_skills: [], soft_skills: [], domain: [] },
    success_signals: '',
    my_experience_pool: '',
    experience_translation: '',
    connection_sentences: '',
    rawAnswers: {},
    completedAt: null,
  },

  // ─── STEP 2: 경험 풀 (허브 #1) ───
  experiences: [],

  // ─── STEP 3 / STEP 4 / STEP 5: 각 워크북 출력본 ───
  outputs: {
    resume: { finalText: '', answers: {}, completedAt: null },
    career_description: { finalText: '', answers: {}, completedAt: null },
    motivation: { finalText: '', answers: {}, completedAt: null },
    jobcompetency: { finalText: '', answers: {}, completedAt: null },
    personality: { finalText: '', answers: {}, completedAt: null },
    goalachievement: { finalText: '', answers: {}, completedAt: null },
    self_introduction: { finalText: '', keywords: [], answers: {}, completedAt: null },
    interview_new: { answers: {}, completedAt: null },
    interview_career: { answers: {}, completedAt: null },
  },

  // ─── 각 워크북의 legacy storage 원본 (Bridge가 sync) ───
  // 다른 워크북의 ImportPanel에서 raw 값을 참조해 자동 채움 가능
  workbookRaw: {
    career_roadmap: null,
    careergoal: null,
    experience: null,
    job_analysis: null,
    resume: null,
    career_description: null,
    motivation: null,
    jobcompetency: null,
    personality: null,
    goalachievement: null,
    self_introduction: null,
    interview_new: null,
    interview_career: null,
    _docxImport: null,
  },
};

// 전체 워크북 (full 대시보드). variant가 없으면 이 전체가 노출됨.
export const ALL_WORKBOOKS = [
  { key: 'career_roadmap',     step: 0, title: '취업 로드맵',     stepLabel: 'STEP 0 · 방향 설정' },
  { key: 'job_analysis',       step: 1, title: '채용공고·직무 분석', stepLabel: 'STEP 1 · 채용공고 분석' },
  { key: 'experience',         step: 2, title: '경험 정리',       stepLabel: 'STEP 2 · 경험 소재 발굴' },
  { key: 'resume',             step: 3, title: '이력서',          stepLabel: 'STEP 3 · 이력서' },
  { key: 'career_description', step: 3, title: '경력기술서',      stepLabel: 'STEP 3 · 경력기술서' },
  { key: 'motivation',         step: 4, title: '지원동기',        stepLabel: 'STEP 4 · 자소서: 지원동기' },
  { key: 'jobcompetency',      step: 4, title: '직무확보역량',    stepLabel: 'STEP 4 · 자소서: 직무확보역량' },
  { key: 'careergoal',         step: 4, title: '입사후 포부',     stepLabel: 'STEP 4 · 자소서: 입사후 포부' },
  { key: 'personality',        step: 4, title: '성격의 장단점',   stepLabel: 'STEP 4 · 자소서: 성격의 장단점' },
  { key: 'goalachievement',    step: 4, title: '목표수립·달성',   stepLabel: 'STEP 4 · 자소서: 목표수립·달성' },
  { key: 'self_introduction',  step: 5, title: '1분 자기소개',    stepLabel: 'STEP 5 · 면접: 자기소개' },
  { key: 'interview_new',      step: 5, title: '신입 면접',       stepLabel: 'STEP 5 · 면접: 신입' },
  { key: 'interview_career',   step: 5, title: '경력직 면접',     stepLabel: 'STEP 5 · 면접: 경력직' },
];

// 변형(variant)별 노출 워크북 키 + 라벨.
// 빌드 시 VITE_VARIANT 값으로 선택 (예: 변형 브랜치의 .env.production).
// 값이 없거나 모르는 값이면 전체(ALL_WORKBOOKS) 노출.
export const VARIANTS = {
  new_grad: {
    label: '신입 전용',
    keys: ['career_roadmap', 'job_analysis', 'experience', 'resume',
      'motivation', 'jobcompetency', 'careergoal', 'personality', 'goalachievement',
      'self_introduction', 'interview_new'],
  },
  experienced: {
    label: '경력 전용',
    keys: ['career_roadmap', 'job_analysis', 'experience', 'resume', 'career_description',
      'self_introduction', 'interview_career'],
  },
  documents_new_grad: {
    label: '신입 서류 전용',
    keys: ['job_analysis', 'experience', 'resume',
      'motivation', 'jobcompetency', 'careergoal', 'personality', 'goalachievement'],
    notice: {
      title: '서류를 마쳤다면, 다음은 신입 면접입니다',
      body: '서류 통과 후에는 면접이 기다립니다. 1분 자기소개부터 예상 질문 답변까지 「신입 면접」 워크북에서 체계적으로 준비하세요.',
      workbookKey: 'interview_new',
      linkLabel: '신입 면접 워크북 열기',
    },
  },
  documents_experienced: {
    label: '경력 서류 전용',
    keys: ['job_analysis', 'experience', 'resume', 'career_description'],
  },
  interview_new_grad: {
    label: '신입 면접 전용',
    keys: ['experience', 'self_introduction', 'interview_new'],
  },
  interview_experienced: {
    label: '경력 면접 전용',
    keys: ['experience', 'career_description', 'self_introduction', 'interview_career'],
  },
};

const RAW_VARIANT = (typeof import.meta !== 'undefined' && import.meta.env)
  ? import.meta.env.VITE_VARIANT : undefined;
export const VARIANT = (RAW_VARIANT && VARIANTS[RAW_VARIANT]) ? RAW_VARIANT : null;
export const VARIANT_LABEL = VARIANT ? VARIANTS[VARIANT].label : null;
export const VARIANT_NOTICE = (VARIANT && VARIANTS[VARIANT].notice) ? VARIANTS[VARIANT].notice : null;

export const WORKBOOKS = VARIANT
  ? ALL_WORKBOOKS.filter((w) => VARIANTS[VARIANT].keys.includes(w.key))
  : ALL_WORKBOOKS;
