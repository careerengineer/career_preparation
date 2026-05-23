// 워크북 각 질문(question id) → master 데이터의 가장 관련된 필드 매핑
// ReferenceInline이 이것을 활용해 "딱 맞는" 데이터를 인라인 칩/모달로 표시
//
// source 형식:
//   { type: 'experiences', field: 'star_a', label: '각 경험의 행동' }
//   { type: 'jobAnalysis', field: 'success_signals', label: '회사 성공 신호' }
//   { type: 'outputs', workbookKey: 'motivation', field: 'finalText', label: '지원동기 완성본' }
//   { type: 'careergoal', field: 'year5', label: '5년 목표' }

export const QUESTION_MAPPING = {
  // ─── motivation 지원동기 ───
  motivation: {
    q1_1: [{ type: 'experiences', field: 'motivation', label: '각 경험의 동기' }],
    q1_2: [{ type: 'careergoal', field: 'rationale', label: '커리어 목표 근거' }],
    q1_3: [{ type: 'jobAnalysis', field: 'success_signals', label: '직무 성공 신호' }],
    q2_1: [{ type: 'jobAnalysis', field: 'company.vision', label: '회사 비전' }, { type: 'jobAnalysis', field: 'company.recent_news', label: '최근 뉴스' }],
    q2_2: [{ type: 'jobAnalysis', field: 'company.culture', label: '조직 문화' }, { type: 'careergoal', field: 'year5', label: '5년 비전' }],
    q3_1: [{ type: 'jobAnalysis', field: 'keywords.hard_skills', label: '하드 스킬' }, { type: 'jobAnalysis', field: 'keywords.soft_skills', label: '소프트 스킬' }],
    q3_2: [{ type: 'experiences', field: 'star_a', label: '각 경험의 행동' }, { type: 'experiences', field: 'learning', label: '각 경험의 배운점' }],
    q3_3: [{ type: 'experiences', field: 'job_comps', label: '각 경험의 직무 역량' }, { type: 'jobAnalysis', field: 'connection_sentences', label: '연결 문장' }],
    q4_1: [{ type: 'experiences', field: 'star_r', label: '각 경험의 결과' }],
    q4_2: [{ type: 'jobAnalysis', field: 'success_signals', label: '회사 핵심 과제' }],
  },
  // ─── jobcompetency 직무확보역량 ───
  jobcompetency: {
    q1_1: [{ type: 'jobAnalysis', field: 'jd.main_tasks', label: '직무 주요 업무' }],
    q1_2: [{ type: 'jobAnalysis', field: 'keywords.hard_skills', label: '하드 스킬' }],
    q1_3: [{ type: 'experiences', field: 'job_comps', label: '각 경험의 직무 역량' }],
    q2_1: [{ type: 'experiences', field: 'motivation', label: '각 경험의 계기' }],
    q2_2: [{ type: 'experiences', field: 'star_a', label: '각 경험의 행동' }],
    q2_3: [{ type: 'experiences', field: 'learning', label: '각 경험의 배운점' }],
    q3_1: [{ type: 'experiences', field: 'star_r', label: '각 경험의 결과' }],
    q3_2: [{ type: 'experiences', field: 'star_a', label: '각 경험의 행동' }],
    q3_3: [{ type: 'experiences', field: 'job_comps', label: '각 경험의 직무 역량' }],
    q4_1: [{ type: 'jobAnalysis', field: 'keywords.hard_skills', label: '하드 스킬' }, { type: 'jobAnalysis', field: 'keywords.domain', label: '도메인 키워드' }],
    q4_2: [{ type: 'outputs', workbookKey: 'motivation', field: 'finalText', label: '지원동기 완성본' }],
    q4_3: [{ type: 'careergoal', field: 'year1', label: '1년 목표' }, { type: 'careergoal', field: 'year3', label: '3년 목표' }],
  },
  // ─── personality 성격의 장단점 ───
  personality: {
    q1_1: [{ type: 'experiences', field: 'role', label: '각 경험의 역할' }],
    q1_2: [{ type: 'experiences', field: 'comm_comps', label: '소통 역량' }, { type: 'experiences', field: 'att_comps', label: '태도 역량' }],
    q1_3: [{ type: 'experiences', field: 'star_s', label: '각 경험의 상황' }],
    q1_4: [{ type: 'experiences', field: 'star_a', label: '각 경험의 행동' }],
    q1_5: [{ type: 'experiences', field: 'star_r', label: '각 경험의 결과' }],
    q1_6: [{ type: 'jobAnalysis', field: 'jd.main_tasks', label: '직무 주요 업무' }],
    'q1-7': [{ type: 'jobAnalysis', field: 'success_signals', label: '회사 성공 신호' }, { type: 'outputs', workbookKey: 'jobcompetency', field: 'finalText', label: '직무역량 완성본' }],
    q2_1: [{ type: 'experiences', field: 'learning', label: '각 경험의 배운점' }],
    q2_2: [{ type: 'experiences', field: 'star_a', label: '각 경험의 행동' }],
  },
  // ─── goalachievement 목표수립·달성 ───
  goalachievement: {
    q1_1: [{ type: 'experiences', field: 'star_t', label: '각 경험의 과제' }],
    q1_2: [{ type: 'experiences', field: 'motivation', label: '각 경험의 동기' }],
    q2_1: [{ type: 'experiences', field: 'star_a', label: '각 경험의 행동' }],
    q3_1: [{ type: 'experiences', field: 'star_r', label: '각 경험의 결과' }],
    q4_1: [{ type: 'experiences', field: 'learning', label: '각 경험의 배운점' }],
    q5_1: [{ type: 'careergoal', field: 'year1', label: '1년 목표' }, { type: 'careergoal', field: 'year3', label: '3년 목표' }],
    q6_2: [{ type: 'jobAnalysis', field: 'connection_sentences', label: '연결 문장' }],
  },
  // ─── careergoal 입사후 포부 ───
  careergoal: {
    q1_1: [{ type: 'jobAnalysis', field: 'jd.main_tasks', label: '직무 주요 업무' }],
    q1_2: [{ type: 'jobAnalysis', field: 'keywords.hard_skills', label: '핵심 역량' }],
    q1_3: [{ type: 'jobAnalysis', field: 'jd.preferred', label: '우대 사항' }],
    q2_1: [{ type: 'jobAnalysis', field: 'company.vision', label: '회사 비전' }, { type: 'outputs', workbookKey: 'motivation', field: 'finalText', label: '지원동기' }],
    q3_1: [{ type: 'outputs', workbookKey: 'jobcompetency', field: 'finalText', label: '직무역량 완성본' }],
    q4_1: [{ type: 'careergoal', field: 'year1', label: '내 1년 목표' }],
    q4_2: [{ type: 'careergoal', field: 'year3', label: '내 3년 목표' }],
    q5_1: [{ type: 'careergoal', field: 'year5', label: '내 5년 목표' }, { type: 'outputs', workbookKey: 'goalachievement', field: 'finalText', label: '목표달성 완성본' }],
  },
  // ─── self_introduction 1분 자기소개 ───
  self_introduction: {
    Q1: [{ type: 'jobAnalysis', field: 'keywords.hard_skills', label: '하드 스킬' }, { type: 'jobAnalysis', field: 'keywords.soft_skills', label: '소프트 스킬' }],
    Q2: [{ type: 'jobAnalysis', field: 'jd.main_tasks', label: '직무 주요 업무' }],
    Q4: [{ type: 'experiences', field: 'summary', label: '각 경험 요약' }, { type: 'experiences', field: 'org', label: '각 경험 소속' }],
    Q7: [{ type: 'experiences', field: 'comm_comps', label: '소통 역량' }, { type: 'experiences', field: 'att_comps', label: '태도 역량' }],
    Q12: [{ type: 'outputs', workbookKey: 'motivation', field: 'finalText', label: '지원동기 완성본' }],
  },
  // ─── interview 면접 ───
  interview_new: {
    Q1: [{ type: 'outputs', workbookKey: 'self_introduction', field: 'finalText', label: '자기소개 완성본' }],
    Q2: [{ type: 'outputs', workbookKey: 'motivation', field: 'finalText', label: '지원동기 완성본' }],
    Q3: [{ type: 'outputs', workbookKey: 'jobcompetency', field: 'finalText', label: '직무역량 완성본' }],
    Q4: [{ type: 'experiences', field: 'star_a', label: '각 경험의 행동' }, { type: 'experiences', field: 'star_r', label: '각 경험의 결과' }],
  },
  interview_career: {
    Q1: [{ type: 'outputs', workbookKey: 'self_introduction', field: 'finalText', label: '자기소개 완성본' }],
    Q2: [{ type: 'outputs', workbookKey: 'career_description', field: 'finalText', label: '경력기술서 완성본' }],
    Q3: [{ type: 'experiences', field: 'star_a', label: '각 경험의 행동' }, { type: 'experiences', field: 'star_r', label: '각 경험의 결과' }],
  },
};

// master + source 정의 → 실제 데이터 추출
export function resolveMappedData(master, source) {
  if (!source || !master) return null;
  const { type, field, workbookKey, label } = source;

  if (type === 'experiences') {
    const exps = master.experiences || [];
    if (exps.length === 0) return null;
    const values = exps
      .map((e) => {
        const v = e[field];
        if (!v) return null;
        const header = `[${e.org || e.category || '경험'}${e.role ? ' · ' + e.role : ''}]`;
        if (Array.isArray(v)) return `${header} ${v.join(', ')}`;
        return `${header} ${v}`;
      })
      .filter(Boolean);
    if (values.length === 0) return null;
    return { label: label || field, text: values.join('\n\n') };
  }

  if (type === 'jobAnalysis') {
    const ja = master.jobAnalysis;
    if (!ja) return null;
    // nested field 처리 (company.vision)
    const parts = field.split('.');
    let v = ja;
    for (const p of parts) { v = v?.[p]; if (v === undefined) break; }
    if (!v) return null;
    if (Array.isArray(v)) return { label, text: v.join(', ') };
    if (typeof v === 'object') return { label, text: JSON.stringify(v, null, 2) };
    return { label, text: String(v) };
  }

  if (type === 'careergoal') {
    const v = master.careergoal?.[field];
    if (!v) return null;
    return { label, text: String(v) };
  }

  if (type === 'roadmap') {
    const v = master.roadmap?.[field];
    if (!v) return null;
    return { label, text: typeof v === 'string' ? v : JSON.stringify(v) };
  }

  if (type === 'outputs') {
    const out = master.outputs?.[workbookKey];
    if (!out) return null;
    const v = out[field];
    if (!v) return null;
    return { label, text: String(v) };
  }

  return null;
}
