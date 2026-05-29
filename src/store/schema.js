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
    formative_experiences: { finalText: '', answers: {}, completedAt: null },
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
    formative_experiences: null,
    self_introduction: null,
    interview_new: null,
    interview_career: null,
    _docxImport: null,
  },
};

// 구버전/부분 저장본·슬롯에 슬라이스가 없어도 selectors가 크래시하지 않도록
// DEFAULT_MASTER와 슬라이스별로 머지한다. (cold load · 슬롯 복원 · 파일 import 공용)
export function mergeWithDefaults(p) {
  p = p || {};
  return {
    ...DEFAULT_MASTER,
    ...p,
    profile: { ...DEFAULT_MASTER.profile, ...(p.profile || {}) },
    roadmap: { ...DEFAULT_MASTER.roadmap, ...(p.roadmap || {}) },
    careergoal: { ...DEFAULT_MASTER.careergoal, ...(p.careergoal || {}) },
    jobAnalysis: { ...DEFAULT_MASTER.jobAnalysis, ...(p.jobAnalysis || {}) },
    workbookRaw: { ...DEFAULT_MASTER.workbookRaw, ...(p.workbookRaw || {}) },
    outputs: { ...DEFAULT_MASTER.outputs, ...(p.outputs || {}) },
    experiences: Array.isArray(p.experiences) ? p.experiences : DEFAULT_MASTER.experiences,
  };
}

// 전체 워크북 (full 대시보드). variant가 없으면 이 전체가 노출됨.
// ⚠ 용어 위계: 여기 'step'(0~5)·'stepLabel'은 "상위 6단계 취업 여정(STEP)" = 대시보드 단계.
//   워크북 "내부"의 소단계는 STEP이 아니라 PART(코드 변수도 currentPart)로 부른다. 혼동 금지.
//   계층: STEP(여정 0~5) > PART(워크북 내부 섹션) > Q(질문).
export const ALL_WORKBOOKS = [
  { key: 'career_roadmap',     step: 0, title: '취업 로드맵 진단',     stepLabel: 'STEP 0 · 취업 로드맵 진단' },
  { key: 'job_analysis',       step: 1, title: '채용공고 및 직무분석', stepLabel: 'STEP 1 · 채용공고 및 직무분석' },
  { key: 'experience',         step: 2, title: '경험 정리',       stepLabel: 'STEP 2 · 경험 소재 발굴' },
  { key: 'resume',             step: 3, title: '이력서',          stepLabel: 'STEP 3 · 이력서' },
  { key: 'career_description', step: 3, title: '경력기술서',      stepLabel: 'STEP 3 · 경력기술서' },
  { key: 'motivation',         step: 4, title: '지원동기',        stepLabel: 'STEP 4 · 자소서: 지원동기' },
  { key: 'jobcompetency',      step: 4, title: '직무확보역량',    stepLabel: 'STEP 4 · 자소서: 직무확보역량' },
  { key: 'careergoal',         step: 4, title: '입사후 포부',     stepLabel: 'STEP 4 · 자소서: 입사후 포부' },
  { key: 'personality',        step: 4, title: '성격의 장단점',   stepLabel: 'STEP 4 · 자소서: 성격의 장단점' },
  { key: 'goalachievement',    step: 4, title: '목표수립·달성',   stepLabel: 'STEP 4 · 자소서: 목표수립·달성' },
  { key: 'formative_experiences',     step: 4, title: '성장과정',       stepLabel: 'STEP 4 · 자소서: 성장과정' },
  { key: 'self_introduction',  step: 5, title: '1분 자기소개',    stepLabel: 'STEP 5 · 면접: 자기소개' },
  { key: 'interview_new',      step: 5, title: '신입 면접',       stepLabel: 'STEP 5 · 면접: 신입' },
  { key: 'interview_career',   step: 5, title: '경력 면접',       stepLabel: 'STEP 5 · 면접: 경력' },
];

// 변형(variant)별 노출 워크북 키 + 라벨.
// 빌드 시 VITE_VARIANT 값으로 선택 (예: 변형 브랜치의 .env.production).
// 값이 없거나 모르는 값이면 전체(ALL_WORKBOOKS) 노출.
export const VARIANTS = {
  new_grad: {
    label: '신입 멘토링 전용',
    keys: ['career_roadmap', 'job_analysis', 'experience', 'resume',
      'motivation', 'jobcompetency', 'careergoal', 'personality', 'goalachievement', 'formative_experiences',
      'self_introduction', 'interview_new'],
  },
  experienced: {
    label: '경력 컨설팅 전용',
    keys: ['career_roadmap', 'job_analysis', 'resume', 'career_description',
      'self_introduction', 'interview_career'],
  },
  documents_new_grad: {
    label: '신입 서류 멘토링 전용',
    keys: ['career_roadmap', 'job_analysis', 'experience', 'resume',
      'motivation', 'jobcompetency', 'careergoal', 'personality', 'goalachievement', 'formative_experiences'],
    notice: {
      title: '서류를 마쳤다면, 다음은 신입 면접입니다',
      body: '서류 통과 후에는 면접이 기다립니다. 신입 면접 멘토링과 1:1 컨설팅, 가이드 워크북으로 실전까지 대비하세요.',
      links: [
        { label: '신입 면접 멘토링 (PT면접 포함)', url: 'https://www.latpeed.com/products/fKnUV' },
        { label: '1:1 1시간 컨설팅', url: 'https://www.latpeed.com/products/S92cP' },
        { label: '신입 면접 멘토링 가이드 & 워크북', url: 'https://www.latpeed.com/products/H7UHo' },
      ],
    },
  },
  documents_experienced: {
    label: '경력 서류 컨설팅 전용',
    keys: ['career_roadmap', 'job_analysis', 'resume', 'career_description'],
    notice: {
      title: '서류를 마쳤다면, 다음은 경력 면접입니다',
      body: '서류 통과 후에는 면접이 기다립니다. 경력 면접 멘토링과 1:1 컨설팅, 가이드 워크북으로 실전까지 대비하세요.',
      links: [
        { label: '경력 면접 멘토링 (PT면접 포함)', url: 'https://www.latpeed.com/products/LimF9' },
        { label: '1:1 1시간 컨설팅', url: 'https://www.latpeed.com/products/S92cP' },
        { label: '경력 면접 멘토링 가이드 & 워크북', url: 'https://www.latpeed.com/products/j3RfY' },
      ],
    },
  },
  interview_new_grad: {
    label: '신입 면접 멘토링 전용',
    keys: ['experience', 'self_introduction', 'interview_new'],
  },
  interview_experienced: {
    label: '경력 면접 컨설팅 전용',
    keys: ['career_description', 'self_introduction', 'interview_career'],
  },
};

const RAW_VARIANT = (typeof import.meta !== 'undefined' && import.meta.env)
  ? import.meta.env.VITE_VARIANT : undefined;
export const VARIANT = (RAW_VARIANT && VARIANTS[RAW_VARIANT]) ? RAW_VARIANT : null;
export const VARIANT_LABEL = VARIANT ? VARIANTS[VARIANT].label : null;
export const VARIANT_NOTICE = (VARIANT && VARIANTS[VARIANT].notice) ? VARIANTS[VARIANT].notice : null;

// 표시(네비게이터·참고 자료)를 변형 범위로 거를 때 쓰는 순수 헬퍼.
// VARIANT가 없으면(전체 빌드) 항상 true → 기존 동작 그대로. 저장/복원 데이터 경로와는 무관.
export const VARIANT_KEYS = VARIANT ? VARIANTS[VARIANT].keys : null;
export function isWorkbookInVariant(key) { return !VARIANT_KEYS || VARIANT_KEYS.includes(key); }

export const WORKBOOKS = VARIANT
  ? ALL_WORKBOOKS.filter((w) => VARIANTS[VARIANT].keys.includes(w.key))
  : ALL_WORKBOOKS;
