// 워크북별 docx 본문 빌더 (워크북 자체 저장 = 전체 백업이 동일 디자인이 되도록 공용화).
// dx = docx 라이브러리 클래스 묶음 ({ Paragraph, TextRun, AlignmentType, BorderStyle, ExternalHyperlink }).
// 각 빌더는 "본문 children 배열"을 반환한다 (저작권 머리말/백업 꼬리말은 호출측에서 부여).
import { QUESTION_LABELS } from './questionLabels.js';

export function makeDocxHelpers(dx) {
  const { Paragraph, TextRun, AlignmentType, BorderStyle, ExternalHyperlink } = dx;
  const today = new Date().toISOString().slice(0, 10);
  return {
    today,
    dateP: () => new Paragraph({ children: [new TextRun({ text: '작성일 · ' + today, size: 20, font: '맑은 고딕', color: '6E7A8F' })], alignment: AlignmentType.RIGHT, spacing: { after: 80 } }),
    titleP: (t) => new Paragraph({ children: [new TextRun({ text: t, bold: true, size: 44, font: '맑은 고딕', color: '0E2750', characterSpacing: 200 })], alignment: AlignmentType.CENTER, spacing: { before: 200, after: 240 }, border: { bottom: { style: BorderStyle.SINGLE, size: 24, color: '0E2750', space: 6 } } }),
    subtitleP: (t) => new Paragraph({ children: [new TextRun({ text: t, bold: true, size: 24, font: '맑은 고딕', color: '1B3A6B' })], alignment: AlignmentType.CENTER, spacing: { before: 200, after: 480 } }),
    bodyP: (t) => new Paragraph({ children: String(t).split('\n').flatMap((line, i) => i === 0 ? [new TextRun({ text: line, size: 22, font: '맑은 고딕', color: '0E2750' })] : [new TextRun({ break: 1, text: line, size: 22, font: '맑은 고딕', color: '0E2750' })]), spacing: { before: 100, after: 280, line: 400 }, alignment: AlignmentType.JUSTIFIED }),
    sectionH: (t) => new Paragraph({ children: [new TextRun({ text: t, bold: true, size: 28, font: '맑은 고딕', color: '0E2750' })], spacing: { before: 480, after: 200 }, border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: '0E2750', space: 4 } } }),
    subH: (t) => new Paragraph({ children: [new TextRun({ text: t, bold: true, size: 24, font: '맑은 고딕', color: '1B3A6B' })], spacing: { before: 360, after: 120 }, border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '1B3A6B', space: 4 } } }),
    labelP: (t) => new Paragraph({ children: [new TextRun({ text: t, bold: true, size: 22, font: '맑은 고딕', color: '1B3A6B' })], spacing: { before: 200, after: 80 }, border: { left: { style: BorderStyle.SINGLE, size: 24, color: 'C9A86A', space: 8 } }, indent: { left: 200 } }),
    labelBodyP: (t) => new Paragraph({ children: String(t).split('\n').flatMap((line, i) => i === 0 ? [new TextRun({ text: line, size: 22, font: '맑은 고딕', color: '0E2750' })] : [new TextRun({ break: 1, text: line, size: 22, font: '맑은 고딕', color: '0E2750' })]), spacing: { before: 0, after: 160, line: 360 }, indent: { left: 360 } }),
    placeholderP: (t) => new Paragraph({ children: [new TextRun({ text: t, italic: true, size: 22, font: '맑은 고딕', color: '6E7A8F' })], spacing: { before: 0, after: 160, line: 360 }, indent: { left: 360 } }),
    linkP: (label, url, options = {}) => new Paragraph({ children: [new TextRun({ text: options.prefix || '', size: 22, font: '맑은 고딕', color: '1B3A6B' }), new ExternalHyperlink({ link: url, children: [new TextRun({ text: label, size: 22, font: '맑은 고딕', color: '0563C1', underline: { type: 'single', color: '0563C1' } })] })], spacing: { before: options.before || 60, after: options.after || 60, line: 340 }, indent: { left: options.indent || 240 } }),
    plain: (text, opts = {}) => new Paragraph({ children: [new TextRun({ text, italic: !!opts.italic, bold: !!opts.bold, size: opts.size || 20, font: '맑은 고딕', color: opts.color || '6E7A8F' })], spacing: opts.spacing || { before: 80, after: 160 }, ...(opts.extra || {}) }),
    pageBreak: () => new Paragraph({ children: [new TextRun({ text: '', size: 22 })], pageBreakBefore: true }),
  };
}

// CareerEngineer 자료/멘토링 안내 블록 (워크북 docx 본문 끝 공통)
function mentoringBlock(h, dx) {
  const { Paragraph, TextRun, BorderStyle } = dx;
  return [
    h.sectionH('CareerEngineer 자료 — 다음 단계로'),
    h.plain('이 워크북을 완성한 후 다음 단계로 나아가는 데 도움이 되는 자료들입니다.', { italic: true, spacing: { before: 80, after: 160 } }),
    h.linkP('자소서 작성 전자책 시리즈 (5대 항목 전체)', 'https://www.latpeed.com/products/dfdMW'),
    h.linkP('자소서 멘토링 — 실제 글을 함께 다듬는 1:1 멘토링', 'https://www.latpeed.com/products/fKnUV'),
    h.linkP('1:1 취업 컨설팅 — 방향 설정부터 함께', 'https://www.latpeed.com/products/S92cP'),
    h.linkP('CareerEngineer 카카오톡 상담', 'https://open.kakao.com/me/careerengineer'),
    new Paragraph({ children: [new TextRun({ text: '', size: 22, font: '맑은 고딕' })], spacing: { before: 240, after: 60 } }),
    new Paragraph({ children: [new TextRun({ text: 'CareerEngineer 전자책 / 멘토링 전체 안내', bold: true, size: 22, font: '맑은 고딕', color: '0E2750' })], spacing: { before: 160, after: 80 }, shading: { fill: 'F2F1EC' }, border: { left: { style: BorderStyle.SINGLE, size: 24, color: '1B3A6B', space: 8 } }, indent: { left: 240 } }),
    new Paragraph({ children: [new TextRun({ text: 'CareerEngineer는 취업·이직 준비의 모든 단계를 지원하는 전자책과 멘토링을 운영합니다. 자소서 작성, 경력기술서, 면접 답변집 등 단계별 가이드와 1:1 멘토링이 있으며, 모든 자료는 공학박사 멘토의 실제 합격 사례 기반으로 설계되어 있습니다.', size: 20, font: '맑은 고딕', color: '0E2750' })], spacing: { before: 0, after: 120, line: 360 }, indent: { left: 240 } }),
    h.linkP('전체 상품 보기 (클릭)', 'https://www.latpeed.com/stores/eqxhZ', { before: 80, after: 160, indent: 240 }),
  ];
}

// 자소서 5종 docx 구성 — { docx 제목, 본문 placeholder, 작성노트 섹션(단계 제목 + 질문 id) }
// 섹션 순서·제목·질문 id는 각 워크북 round1Steps/round3Questions와 동일하게 맞춤.
const ESSAY_CONFIGS = {
  motivation: {
    title: '지 원 동 기',
    placeholder: '[지원동기 본문이 여기에 들어갑니다.]',
    sections: [
      { title: 'Q1: 왜 이 직무인가', ids: ['q1_1', 'q1_2', 'q1_3'] },
      { title: 'Q2: 왜 이 회사인가', ids: ['q2_1', 'q2_2'] },
      { title: 'Q3: 무엇을 왜 준비했는가', ids: ['q3_1', 'q3_2', 'q3_3'] },
      { title: 'Q4: 어떻게 기여할 수 있는가', ids: ['q4_1', 'q4_2'] },
      { title: '연결 문장', ids: ['connect_q1q2', 'connect_q2q3', 'connect_q3q4'] },
    ],
  },
  jobcompetency: {
    title: '직 무 역 량',
    placeholder: '[직무역량 본문이 여기에 들어갑니다.]',
    sections: [
      { title: 'Q1: 이 직무에서 무엇이 요구되는가', ids: ['q1_1', 'q1_2', 'q1_3'] },
      { title: 'Q2: 이 역량을 어떻게 갖게 됐고 어떻게 쌓아왔는가', ids: ['q2_1', 'q2_2', 'q2_3'] },
      { title: 'Q3: 이 역량으로 무엇을 해냈는가', ids: ['q3_1', 'q3_2', 'q3_3'] },
      { title: 'Q4: 이 역량이 이 직무에서 어떻게 작동하는가', ids: ['q4_1', 'q4_2', 'q4_3'] },
      { title: '연결 문장', ids: ['connect_para1', 'connect_para2', 'connect_para3', 'connect_para4'] },
    ],
  },
  personality: {
    title: '성격 장단점',
    placeholder: '[성격 장단점 본문이 여기에 들어갑니다.]',
    sections: [
      { title: 'Q1: 장점', ids: ['q1_1', 'q1_2', 'q1_3', 'q1_4', 'q1_5', 'q1_6', 'q1_7'] },
      { title: 'Q2: 단점', ids: ['q2_1', 'q2_2', 'q2_3', 'q2_4'] },
      { title: '연결 문장', ids: ['connect_adv_core', 'connect_adv_evidence', 'connect_adv_contribution', 'connect_dis_recognition', 'connect_dis_growth'] },
    ],
  },
  goalachievement: {
    title: '목표수립 및 달성',
    placeholder: '[목표수립·달성 본문이 여기에 들어갑니다.]',
    sections: [
      { title: 'Q1: 목표 정의', ids: ['q1_1_1', 'q1_1_2', 'q1_1_3'] },
      { title: 'Q2: 계획 수립', ids: ['q1_2_1', 'q1_2_2'] },
      { title: 'Q3: 실행과 극복', ids: ['q1_3_1', 'q1_3_2'] },
      { title: 'Q4: 결과와 임팩트', ids: ['q1_4_1', 'q1_4_2', 'q1_4_3'] },
      { title: 'Q5: 노력 과정', ids: ['q1_5_1', 'q1_5_2'] },
      { title: 'Q6: 배움과 기여', ids: ['q1_6_1', 'q1_6_2', 'q1_6_3'] },
      { title: '연결 문장', ids: ['connect_q1q2', 'connect_q2q3', 'connect_q3q4', 'connect_q4q6', 'connect_full'] },
    ],
  },
  careergoal: {
    title: '입 사 후 포 부',
    placeholder: '[입사후 포부 본문이 여기에 들어갑니다.]',
    sections: [
      { title: 'Q1: 이 직무에서 진짜 중요한 것', ids: ['q1_1_1', 'q1_1_2', 'q1_1_3'] },
      { title: 'Q2: 지금 나는 어디에 있는가', ids: ['q1_2_1', 'q1_2_2', 'q1_2_3'] },
      { title: 'Q3: 무엇을 어떻게 준비하고 어떻게 확장할 것인가', ids: ['q1_3_1', 'q1_3_2', 'q1_3_3'] },
      { title: 'Q4: 성장하면 어디로 — 다음 단계와 큰 그림', ids: ['q1_q4_1', 'q1_q4_2'] },
      { title: '연결 문장', ids: ['connect_q1', 'connect_q2', 'connect_q3', 'connect_q4'] },
    ],
  },
};

// 자소서 docx 본문 children (5종 공통)
export function buildEssayDocxChildren(workbookKey, { basicInfo = {}, finalText = '', answers = {} }, dx, { includeMentoring = true } = {}) {
  const cfg = ESSAY_CONFIGS[workbookKey];
  if (!cfg) return [];
  const h = makeDocxHelpers(dx);
  const labels = QUESTION_LABELS[workbookKey] || {};
  const children = [h.dateP(), h.titleP(cfg.title)];

  if (basicInfo.company || basicInfo.position) {
    const sub = (basicInfo.company || '') + (basicInfo.company && basicInfo.position ? ' · ' : '') + (basicInfo.position ? basicInfo.position + ' 지원' : '');
    children.push(h.subtitleP(sub));
  }
  if (finalText && finalText.trim()) {
    finalText.split('\n\n').filter((x) => x.trim()).forEach((para) => children.push(h.bodyP(para)));
  } else {
    children.push(h.placeholderP(cfg.placeholder));
  }

  children.push(h.pageBreak());
  children.push(new dx.Paragraph({ children: [new dx.TextRun({ text: '작성 노트 — 단계별 답변', bold: true, size: 28, font: '맑은 고딕', color: '0E2750' })], spacing: { before: 0, after: 100 }, border: { bottom: { style: dx.BorderStyle.SINGLE, size: 12, color: '0E2750', space: 4 } } }));
  children.push(h.plain('아래는 자소서 작성 과정에서 정리한 모든 답변입니다. 다음에 이어 작업하거나 다른 자소서에 활용할 때 참고하세요.', { italic: true, spacing: { before: 0, after: 280 } }));

  cfg.sections.forEach((sec) => {
    children.push(h.subH(sec.title));
    sec.ids.forEach((id) => {
      children.push(h.labelP(labels[id] || id));
      const ans = answers[id];
      children.push(ans && String(ans).trim() ? h.labelBodyP(ans) : h.placeholderP('[작성 전]'));
    });
  });

  if (includeMentoring) children.push(...mentoringBlock(h, dx));
  return children;
}

// 지원동기 (motivation 컴포넌트 호환용 래퍼)
export function buildMotivationDocxChildren(data, dx, opts) {
  return buildEssayDocxChildren('motivation', data, dx, opts);
}

// 이력서(resume) docx 본문 children — 워크북 고유 디자인(한줄소개/경력·경험/프로젝트/스킬/교육/직무분석)
export function buildResumeDocxChildren({ answers = {}, expCount = 3, projCount = 1 }, dx, { includeMentoring = true } = {}) {
  const { Paragraph, TextRun, BorderStyle } = dx;
  const h = makeDocxHelpers(dx);
  const a = (k) => (answers[k] || '').toString();
  const has = () => true;
  const expH = (name, role, period) => {
    const runs = [new TextRun({ text: name, bold: true, size: 24, font: '맑은 고딕', color: '0E2750' })];
    if (role) { runs.push(new TextRun({ text: '   |   ', size: 22, font: '맑은 고딕', color: '6E7A8F' })); runs.push(new TextRun({ text: role, bold: true, size: 22, font: '맑은 고딕', color: '1B3A6B' })); }
    if (period) runs.push(new TextRun({ text: '   ' + period, size: 20, font: '맑은 고딕', color: '6E7A8F' }));
    return new Paragraph({ children: runs, spacing: { before: 360, after: 120 }, border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: '1B3A6B', space: 4 } } });
  };
  const bulletP = (t) => new Paragraph({ children: [new TextRun({ text: '▪  ', size: 22, font: '맑은 고딕', color: '1B3A6B' }), new TextRun({ text: t, size: 22, font: '맑은 고딕', color: '0E2750' })], spacing: { before: 60, after: 60, line: 340 }, indent: { left: 240, hanging: 240 } });
  const resultP = (t) => new Paragraph({ children: [new TextRun({ text: '▸  ', size: 22, font: '맑은 고딕', color: '1B3A6B', bold: true }), new TextRun({ text: t, size: 22, font: '맑은 고딕', color: '0E2750', bold: true })], spacing: { before: 80, after: 160, line: 340 }, indent: { left: 240, hanging: 240 } });
  const highlightP = (t) => new Paragraph({ children: String(t).split('\n').flatMap((line, i) => i === 0 ? [new TextRun({ text: line, size: 22, font: '맑은 고딕', color: '0E2750' })] : [new TextRun({ break: 1, text: line, size: 22, font: '맑은 고딕', color: '0E2750' })]), spacing: { before: 100, after: 200, line: 360 }, shading: { fill: 'F2F1EC' }, border: { left: { style: BorderStyle.SINGLE, size: 24, color: '1B3A6B', space: 8 } }, indent: { left: 240 } });
  const metaP = (label, value) => new Paragraph({ children: [new TextRun({ text: label + '\t', bold: true, size: 22, font: '맑은 고딕', color: '1B3A6B' }), new TextRun({ text: value, size: 22, font: '맑은 고딕', color: '0E2750' })], spacing: { before: 100, after: 100 }, border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'E8E5DD', space: 4 } } });
  const noteP = (label, value) => new Paragraph({ children: [new TextRun({ text: label + ': ', bold: true, size: 20, font: '맑은 고딕', color: '1B3A6B' }), new TextRun({ text: value, size: 20, font: '맑은 고딕', color: '0E2750' })], spacing: { before: 80, after: 80 } });
  const renderBullets = (text) => String(text).split('\n').filter((x) => x.trim()).map((x) => bulletP(x.replace(/^[•\-*·▪]\s*/, '').trim()));

  const children = [h.dateP(), h.titleP('이  력  서')];
  if (a('company') || a('position')) {
    const sub = (a('company') || '') + (a('company') && a('position') ? ' · ' : '') + (a('position') ? a('position') + ' 지원' : '');
    children.push(h.subtitleP(sub));
  }
  const oneline = a('oneline_final') || a('oneline_draft');
  if (oneline) {
    children.push(h.sectionH('한 줄 소개'));
    children.push(highlightP(oneline));
    if (has('oneline_kw')) children.push(new Paragraph({ children: [new TextRun({ text: '핵심 키워드  |  ', bold: true, size: 22, font: '맑은 고딕', color: '1B3A6B' }), new TextRun({ text: a('oneline_kw'), size: 22, font: '맑은 고딕', color: '0E2750' })], spacing: { before: 120, after: 120 } }));
  }
  const hasExp = Array.from({ length: expCount }, (_, i) => i + 1).some((n) => has(`exp${n}_name`));
  if (hasExp) {
    children.push(h.sectionH('경력 / 경험'));
    for (let n = 1; n <= expCount; n++) {
      if (!has(`exp${n}_name`)) continue;
      children.push(expH(a(`exp${n}_name`), a(`exp${n}_role`), a(`exp${n}_period`)));
      if (has(`exp${n}_detail`)) children.push(...renderBullets(a(`exp${n}_detail`)));
      if (has(`exp${n}_result`)) children.push(resultP(a(`exp${n}_result`)));
    }
    if (has('career_depth')) children.push(noteP('가장 깊이 있게 다룬 경력', a('career_depth')));
    if (has('career_gap')) children.push(noteP('경력 공백 설명', a('career_gap')));
  }
  const hasProj = Array.from({ length: projCount }, (_, i) => i + 1).some((p) => has(`proj${p}_name`));
  if (hasProj) {
    children.push(h.sectionH('프로젝트'));
    for (let p = 1; p <= projCount; p++) {
      if (!has(`proj${p}_name`)) continue;
      children.push(expH(a(`proj${p}_name`), a(`proj${p}_org`), a(`proj${p}_period`)));
      if (has(`proj${p}_role`)) children.push(new Paragraph({ children: [new TextRun({ text: '담당 역할 · ' + a(`proj${p}_role`), bold: true, size: 22, font: '맑은 고딕', color: '1B3A6B' })], spacing: { before: 80, after: 120 } }));
      if (has(`proj${p}_detail`)) children.push(...renderBullets(a(`proj${p}_detail`)));
    }
  }
  if (has('skills')) { children.push(h.sectionH('스킬 · 자격증')); children.push(...renderBullets(a('skills'))); }
  if (has('edu_extra')) { children.push(h.sectionH('교육 · 부트캠프')); children.push(...renderBullets(a('edu_extra'))); }
  if (has('jd_core') || has('jd_tools') || has('jd_nice') || has('priority_reason')) {
    children.push(h.sectionH('직무 분석'));
    if (has('jd_core')) children.push(metaP('핵심 역량 키워드', a('jd_core')));
    if (has('jd_tools')) children.push(metaP('도구·기술 키워드', a('jd_tools')));
    if (has('jd_nice')) children.push(metaP('우대 사항', a('jd_nice')));
    if (has('priority_reason')) children.push(metaP('우선순위 결정 근거', a('priority_reason')));
  }
  if (includeMentoring) {
    children.push(h.sectionH('CareerEngineer 자료 — 다음 단계로'));
    children.push(h.plain('이 워크북을 완성한 후 다음 단계로 나아가는 데 도움이 되는 자료들입니다.', { italic: true, spacing: { before: 80, after: 160 } }));
    children.push(h.linkP('이력서 작성 가이드북 — 한줄소개부터 경력 정리까지', 'https://www.latpeed.com/products/F8JkO'));
    children.push(h.linkP('경력기술서 작성 가이드북 (경력직)', 'https://www.latpeed.com/products/AkBH-'));
    children.push(h.linkP('1:1 취업 컨설팅 — 이력서 검토와 방향 잡기', 'https://www.latpeed.com/products/S92cP'));
    children.push(h.linkP('CareerEngineer 카카오톡 상담', 'https://open.kakao.com/me/careerengineer'));
    children.push(new Paragraph({ children: [new TextRun({ text: '', size: 22, font: '맑은 고딕' })], spacing: { before: 240, after: 60 } }));
    children.push(new Paragraph({ children: [new TextRun({ text: 'CareerEngineer 전자책 / 멘토링 전체 안내', bold: true, size: 22, font: '맑은 고딕', color: '0E2750' })], spacing: { before: 160, after: 80 }, shading: { fill: 'F2F1EC' }, border: { left: { style: BorderStyle.SINGLE, size: 24, color: '1B3A6B', space: 8 } }, indent: { left: 240 } }));
    children.push(new Paragraph({ children: [new TextRun({ text: 'CareerEngineer는 취업·이직 준비의 모든 단계를 지원하는 전자책과 멘토링을 운영합니다. 자소서 작성, 경력기술서, 면접 답변집 등 단계별 가이드와 1:1 멘토링이 있으며, 모든 자료는 공학박사 멘토의 실제 합격 사례 기반으로 설계되어 있습니다.', size: 20, font: '맑은 고딕', color: '0E2750' })], spacing: { before: 0, after: 120, line: 360 }, indent: { left: 240 } }));
    children.push(h.linkP('전체 상품 보기 (클릭)', 'https://www.latpeed.com/stores/eqxhZ', { before: 80, after: 160, indent: 240 }));
  }
  return children;
}

// 경력기술서(career_description) docx 본문 children — 워크북 고유 디자인
export function buildCareerDescDocxChildren({ ans = {}, companyCount = 2, perfCounts = { 1: 2, 2: 1 } }, dx, { includeMentoring = true } = {}) {
  const { Paragraph, TextRun, AlignmentType, BorderStyle } = dx;
  const today = new Date().toISOString().slice(0, 10);
  const v = (k) => (ans[k] || '').toString();
  const has = () => true;
  const titleP = (t) => new Paragraph({ children: [new TextRun({ text: t, bold: true, size: 44, font: '맑은 고딕', color: '0E2750', characterSpacing: 200 })], alignment: AlignmentType.CENTER, spacing: { before: 200, after: 240 }, border: { bottom: { style: BorderStyle.SINGLE, size: 24, color: '0E2750', space: 6 } } });
  const sectionH = (t) => new Paragraph({ children: [new TextRun({ text: t, bold: true, size: 28, font: '맑은 고딕', color: '0E2750' })], spacing: { before: 480, after: 200 }, border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: '0E2750', space: 4 } } });
  const companyH = (company, period) => new Paragraph({ children: [new TextRun({ text: company, bold: true, size: 24, font: '맑은 고딕', color: '0E2750' }), ...(period ? [new TextRun({ text: '   ' + period, size: 20, font: '맑은 고딕', color: '6E7A8F' })] : [])], spacing: { before: 360, after: 120 }, border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: '1B3A6B', space: 4 } } });
  const bodyP = (t, opts = {}) => new Paragraph({ children: String(t).split('\n').flatMap((line, i) => i === 0 ? [new TextRun({ text: line, size: 22, font: '맑은 고딕', color: '0E2750', ...opts })] : [new TextRun({ break: 1, text: line, size: 22, font: '맑은 고딕', color: '0E2750', ...opts })]), spacing: { before: 100, after: 160, line: 360 }, alignment: AlignmentType.JUSTIFIED });
  const linkP = (label, url, options = {}) => new Paragraph({ children: [new TextRun({ text: options.prefix || '', size: 22, font: '맑은 고딕', color: '1B3A6B' }), new dx.ExternalHyperlink({ link: url, children: [new TextRun({ text: label, size: 22, font: '맑은 고딕', color: '0563C1', underline: { type: 'single', color: '0563C1' } })] })], spacing: { before: options.before || 60, after: options.after || 60, line: 340 }, indent: { left: options.indent || 240 } });
  const highlightP = (t) => new Paragraph({ children: String(t).split('\n').flatMap((line, i) => i === 0 ? [new TextRun({ text: line, size: 22, font: '맑은 고딕', color: '0E2750' })] : [new TextRun({ break: 1, text: line, size: 22, font: '맑은 고딕', color: '0E2750' })]), spacing: { before: 100, after: 200, line: 360 }, shading: { fill: 'F2F1EC' }, border: { left: { style: BorderStyle.SINGLE, size: 24, color: '1B3A6B', space: 8 } }, indent: { left: 240 } });
  const perfTitleP = (t) => new Paragraph({ children: [new TextRun({ text: t, bold: true, size: 22, font: '맑은 고딕', color: '0E2750' })], spacing: { before: 280, after: 120, line: 320 }, border: { left: { style: BorderStyle.SINGLE, size: 24, color: '1B3A6B', space: 8 } }, indent: { left: 240 } });
  const resultP = (t, bold = true) => new Paragraph({ children: [new TextRun({ text: '▸ ', size: 22, font: '맑은 고딕', color: '1B3A6B', bold: true }), new TextRun({ text: t, size: 22, font: '맑은 고딕', color: '0E2750', bold })], spacing: { before: 80, after: 80, line: 340 }, indent: { left: 360 } });
  const labelP = (t) => new Paragraph({ children: [new TextRun({ text: t, bold: true, size: 22, font: '맑은 고딕', color: '1B3A6B' })], spacing: { before: 200, after: 80 }, border: { left: { style: BorderStyle.SINGLE, size: 24, color: 'C9A86A', space: 8 } }, indent: { left: 200 } });
  const labelBodyP = (t) => new Paragraph({ children: String(t).split('\n').flatMap((line, i) => i === 0 ? [new TextRun({ text: line, size: 22, font: '맑은 고딕', color: '0E2750' })] : [new TextRun({ break: 1, text: line, size: 22, font: '맑은 고딕', color: '0E2750' })]), spacing: { before: 0, after: 160, line: 360 }, indent: { left: 360 } });
  const dateP = () => new Paragraph({ children: [new TextRun({ text: '작성일 · ' + today, size: 20, font: '맑은 고딕', color: '6E7A8F' })], alignment: AlignmentType.RIGHT, spacing: { after: 80 } });
  const metaP = (label, value) => new Paragraph({ children: [new TextRun({ text: label + '\t', bold: true, size: 22, font: '맑은 고딕', color: '1B3A6B' }), new TextRun({ text: value, size: 22, font: '맑은 고딕', color: '0E2750' })], spacing: { before: 100, after: 100 }, border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'E8E5DD', space: 4 } } });

  const children = [dateP(), titleP('경 력 기 술 서')];
  if (has('company') || has('position') || has('type')) {
    if (has('company')) children.push(metaP('지원 회사', v('company')));
    if (has('position')) children.push(metaP('지원 직무', v('position')));
    if (has('type')) children.push(metaP('지원 유형', v('type')));
    children.push(metaP('작성일', today));
  }
  if (has('story_one')) { children.push(sectionH('경력 한 문장')); children.push(highlightP(v('story_one'))); }
  if (has('summary')) { children.push(sectionH('경력 요약')); children.push(bodyP(v('summary'))); }
  if (has('highlight_2line') || has('highlight_3keyword') || has('str1') || has('str2') || has('str3')) {
    children.push(sectionH('강점 하이라이트'));
    if (has('highlight_2line')) children.push(highlightP(v('highlight_2line')));
    if (has('highlight_3keyword')) children.push(new Paragraph({ children: [new TextRun({ text: '▪ 핵심 키워드: ', bold: true, size: 22, font: '맑은 고딕', color: '1B3A6B' }), new TextRun({ text: v('highlight_3keyword'), size: 22, font: '맑은 고딕', color: '0E2750' })], spacing: { before: 120, after: 120 } }));
    [1, 2, 3].filter((n) => has(`str${n}`)).forEach((n) => children.push(new Paragraph({ children: [new TextRun({ text: '0' + n + '\t', bold: true, size: 20, font: '맑은 고딕', color: '1B3A6B' }), new TextRun({ text: v(`str${n}`), size: 22, font: '맑은 고딕', color: '0E2750' })], spacing: { before: 100, after: 100 }, border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'E8E5DD', space: 4 } } })));
  }
  const hasCareer = Array.from({ length: companyCount }, (_, i) => i + 1).some((c) => has(`c${c}_company`));
  if (hasCareer) {
    children.push(sectionH('경력 사항'));
    for (let c = 1; c <= companyCount; c++) {
      if (!has(`c${c}_company`)) continue;
      children.push(companyH(v(`c${c}_company`), v(`c${c}_period`)));
      const metaParts = [];
      if (has(`c${c}_title`)) metaParts.push({ text: v(`c${c}_title`), bold: true });
      if (has(`c${c}_scope`)) metaParts.push({ text: v(`c${c}_scope`), bold: false });
      if (metaParts.length > 0) {
        const runs = [];
        metaParts.forEach((p, i) => { if (i > 0) runs.push(new TextRun({ text: '   |   ', size: 22, font: '맑은 고딕', color: '6E7A8F' })); runs.push(new TextRun({ text: p.text, size: 22, font: '맑은 고딕', color: p.bold ? '1B3A6B' : '0E2750', bold: p.bold })); });
        children.push(new Paragraph({ children: runs, spacing: { before: 80, after: 200 } }));
      }
      const perfCount = perfCounts[c] || 1;
      for (let p = 1; p <= perfCount; p++) {
        if (!has(`c${c}_s${p}_title`)) continue;
        children.push(perfTitleP(v(`c${c}_s${p}_title`)));
        if (has(`c${c}_s${p}_bg`)) children.push(bodyP(v(`c${c}_s${p}_bg`)));
        if (has(`c${c}_s${p}_role`)) children.push(bodyP(v(`c${c}_s${p}_role`)));
        if (has(`c${c}_s${p}_action`)) children.push(bodyP(v(`c${c}_s${p}_action`)));
        if (has(`c${c}_s${p}_result`)) children.push(resultP(v(`c${c}_s${p}_result`), true));
        if (has(`c${c}_s${p}_ripple`)) children.push(resultP(v(`c${c}_s${p}_ripple`), false));
      }
    }
  }
  if (has('lead_team') || has('decision') || has('cross')) {
    children.push(sectionH('관리 · 리더십'));
    if (has('lead_team')) { children.push(labelP('▪ 팀 관리')); children.push(labelBodyP(v('lead_team'))); }
    if (has('decision')) { children.push(labelP('▪ 의사결정')); children.push(labelBodyP(v('decision'))); }
    if (has('cross')) { children.push(labelP('▪ 크로스펑셔널 협업')); children.push(labelBodyP(v('cross'))); }
  }
  if (has('trans_why') || has('bridge')) {
    children.push(sectionH('직무 전환'));
    if (has('trans_why')) { children.push(labelP('▪ 전환 이유')); children.push(labelBodyP(v('trans_why'))); }
    if (has('bridge')) { children.push(labelP('▪ 연결 역량')); children.push(labelBodyP(v('bridge'))); }
  }
  if (has('hard_skills') || has('soft_skills') || has('certs')) {
    children.push(sectionH('핵심 역량'));
    if (has('hard_skills')) children.push(metaP('하드 스킬', v('hard_skills')));
    if (has('soft_skills')) children.push(metaP('소프트 스킬', v('soft_skills')));
    if (has('certs')) children.push(metaP('자격증 · 인증', v('certs')));
  }
  if (includeMentoring) {
    children.push(sectionH('CareerEngineer 자료 — 다음 단계로'));
    children.push(new Paragraph({ children: [new TextRun({ text: '이 워크북을 완성한 후 다음 단계로 나아가는 데 도움이 되는 자료들입니다.', italic: true, size: 20, font: '맑은 고딕', color: '6E7A8F' })], spacing: { before: 80, after: 160 } }));
    children.push(linkP('경력기술서 작성 가이드북', 'https://www.latpeed.com/products/AkBH-'));
    children.push(linkP('이력서 작성 가이드북', 'https://www.latpeed.com/products/F8JkO'));
    children.push(linkP('이직 컨설팅 — 경력자 전용 1:1 컨설팅', 'https://www.latpeed.com/products/LimF9'));
    children.push(linkP('CareerEngineer 카카오톡 상담', 'https://open.kakao.com/me/careerengineer'));
    children.push(new Paragraph({ children: [new TextRun({ text: '', size: 22, font: '맑은 고딕' })], spacing: { before: 240, after: 60 } }));
    children.push(new Paragraph({ children: [new TextRun({ text: 'CareerEngineer 전자책 / 멘토링 전체 안내', bold: true, size: 22, font: '맑은 고딕', color: '0E2750' })], spacing: { before: 160, after: 80 }, shading: { fill: 'F2F1EC' }, border: { left: { style: BorderStyle.SINGLE, size: 24, color: '1B3A6B', space: 8 } }, indent: { left: 240 } }));
    children.push(new Paragraph({ children: [new TextRun({ text: 'CareerEngineer는 취업·이직 준비의 모든 단계를 지원하는 전자책과 멘토링을 운영합니다. 자소서 작성, 경력기술서, 면접 답변집 등 단계별 가이드와 1:1 멘토링이 있으며, 모든 자료는 공학박사 멘토의 실제 합격 사례 기반으로 설계되어 있습니다.', size: 20, font: '맑은 고딕', color: '0E2750' })], spacing: { before: 0, after: 120, line: 360 }, indent: { left: 240 } }));
    children.push(linkP('전체 상품 보기 (클릭)', 'https://www.latpeed.com/stores/eqxhZ', { before: 80, after: 160, indent: 240 }));
  }
  return children;
}

// 1분 자기소개(self_introduction) docx 본문 children
const SELF_INTRO_PARTS = [
  { step: 1, title: '직무 분석 — 직무 이해도를 보여준다', labels: ['Q1', 'Q2', 'Q3'] },
  { step: 2, title: '경험 연결 — 즉시 전력화 가능성을 보여준다', labels: ['Q4', 'Q5-a', 'Q5-b', 'Q5-c', 'Q6'] },
  { step: 3, title: '강점 도출 — 함께 일하고 싶은 동료인가를 보여준다', labels: ['Q7', 'Q8'] },
  { step: 4, title: '마무리 — 오래 함께할 수 있는 사람인가를 보여준다', labels: ['Q9', 'Q10'] },
  { step: 5, title: '자기소개 조립 — 키워드 카드 만들기', labels: ['Q11', 'Q12', 'Q13'] },
  { step: 6, title: '연결 — 키워드 사이를 자연스럽게 잇기', labels: ['Q14', 'Q15', 'Q16', 'Q17'] },
  { step: 7, title: '초안 작성 — 키워드를 보고 말한 후, 그대로 적기', labels: ['Q18', 'Q19', 'Q20'] },
];
const SELF_INTRO_CHECKLIST = [
  { label: 'Q21', criteria: '직무 이해도', question: '채용담당자가 "이 사람이 우리 직무의 핵심을 이해하고 있구나"라고 느끼는가?' },
  { label: 'Q22', criteria: '즉시 전력화', question: '채용담당자가 "이 사람이 입사하면 어떤 업무를 할 수 있겠다"를 구체적으로 떠올릴 수 있는가?' },
  { label: 'Q23', criteria: '성과 창출', question: '경험과 성과가 "이 사람은 실제로 결과를 만들어낼 수 있겠다"는 인상을 주는가?' },
  { label: 'Q24', criteria: '함께 일하고 싶은 동료', question: '강점이 "성실함" 같은 범용 표현이 아니라, 직무에서 구체적으로 어떻게 쓰이는지까지 연결되어 있는가?' },
  { label: 'Q25', criteria: '오래 함께할 사람', question: '지원동기와 기여방향이 "어떤 회사에도 쓸 수 있는 말"이 아니라, 이 회사에만 해당되는 구체적 내용인가?' },
  { label: 'Q26', criteria: '전체 흐름', question: '첫 문장부터 마지막까지 자연스럽게 이어지고, 꼬리질문이 나와도 일관성 있게 답할 수 있는가?' },
];
export function buildSelfIntroDocxChildren({ basicInfo = {}, answers = {}, checks = {} }, dx, { includeMentoring = true } = {}) {
  const { Paragraph, TextRun, BorderStyle } = dx;
  const h = makeDocxHelpers(dx);
  const labels = QUESTION_LABELS.self_introduction || {};
  const highlightP = (t) => new Paragraph({ children: String(t).split('\n').flatMap((line, i) => i === 0 ? [new TextRun({ text: line, size: 24, font: '맑은 고딕', color: '0E2750' })] : [new TextRun({ break: 1, text: line, size: 24, font: '맑은 고딕', color: '0E2750' })]), spacing: { before: 100, after: 200, line: 400 }, shading: { fill: 'F2F1EC' }, border: { left: { style: BorderStyle.SINGLE, size: 24, color: '0E2750', space: 8 } }, indent: { left: 240 } });
  const softHighlightP = (t) => new Paragraph({ children: String(t).split('\n').flatMap((line, i) => i === 0 ? [new TextRun({ text: line, size: 22, font: '맑은 고딕', color: '0E2750' })] : [new TextRun({ break: 1, text: line, size: 22, font: '맑은 고딕', color: '0E2750' })]), spacing: { before: 100, after: 200, line: 380 }, shading: { fill: 'FBFAF6' }, border: { left: { style: BorderStyle.SINGLE, size: 24, color: 'C9A86A', space: 8 } }, indent: { left: 240 } });
  const checkP = (checked, criteria, question) => new Paragraph({ children: [new TextRun({ text: (checked ? '✓  ' : '·  '), bold: true, size: 22, font: '맑은 고딕', color: 'C9A86A' }), new TextRun({ text: criteria + '  ', bold: true, size: 20, font: '맑은 고딕', color: '1B3A6B' }), new TextRun({ text: question, size: 20, font: '맑은 고딕', color: '0E2750' })], spacing: { before: 80, after: 80 }, border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'E8E5DD', space: 4 } } });

  const finalAnswer = answers['Q20'] || '';
  const shortAnswer = answers['Q18'] || '';
  const children = [h.dateP(), h.titleP('1 분  자 기 소 개')];
  if (basicInfo.company || basicInfo.position) {
    const sub = (basicInfo.company || '') + (basicInfo.company && basicInfo.position ? ' · ' : '') + (basicInfo.position ? basicInfo.position + ' 지원' : '');
    children.push(h.subtitleP(sub));
  }
  children.push(h.sectionH('1분 자기소개 — 최종 답변'));
  children.push(finalAnswer && finalAnswer.trim() ? highlightP(finalAnswer) : softHighlightP('[1분 자기소개 본 답변이 여기에 들어갑니다.]'));
  children.push(h.sectionH('30초 단축 버전'));
  children.push(shortAnswer && shortAnswer.trim() ? softHighlightP(shortAnswer) : softHighlightP('[30초 단축 버전이 여기에 들어갑니다.]'));
  children.push(h.sectionH('면접 당일 — 키워드 메모'));
  children.push(h.labelP('30초 버전 키워드'));
  children.push(answers['Q12'] ? h.labelBodyP(answers['Q12']) : h.placeholderP('[작성 전]'));
  children.push(h.labelP('1분 버전 키워드'));
  children.push(answers['Q13'] ? h.labelBodyP(answers['Q13']) : h.placeholderP('[작성 전]'));
  children.push(h.sectionH('자가 점검 체크리스트'));
  SELF_INTRO_CHECKLIST.forEach((c) => children.push(checkP(checks[c.label], c.criteria, c.question)));
  children.push(h.pageBreak());
  children.push(new Paragraph({ children: [new TextRun({ text: '전체 작성 내용', bold: true, size: 28, font: '맑은 고딕', color: '0E2750' })], spacing: { before: 0, after: 100 }, border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: '0E2750', space: 4 } } }));
  SELF_INTRO_PARTS.forEach((s) => {
    children.push(h.subH(`PART ${s.step}. ${s.title}`));
    s.labels.forEach((lab) => {
      children.push(h.labelP(`${lab}. ${labels[lab] || ''}`));
      children.push(answers[lab] ? h.labelBodyP(answers[lab]) : h.placeholderP('[작성 전]'));
    });
  });
  if (includeMentoring) {
    children.push(h.sectionH('CareerEngineer 자료 — 다음 단계로'));
    children.push(h.plain('이 워크북을 완성한 후 다음 단계로 나아가는 데 도움이 되는 자료들입니다.', { italic: true, spacing: { before: 80, after: 160 } }));
    children.push(h.linkP('1분 자기소개 가이드 워크북', 'https://www.latpeed.com/products/LObbV'));
    children.push(h.linkP('면접 멘토링 — 모의 면접과 실전 피드백', 'https://www.latpeed.com/products/tZ5xw'));
    children.push(h.linkP('신입 면접 준비 가이드북', 'https://www.latpeed.com/products/H7UHo'));
    children.push(h.linkP('CareerEngineer 카카오톡 상담', 'https://open.kakao.com/me/careerengineer'));
    children.push(new Paragraph({ children: [new TextRun({ text: '', size: 22, font: '맑은 고딕' })], spacing: { before: 240, after: 60 } }));
    children.push(new Paragraph({ children: [new TextRun({ text: 'CareerEngineer 전자책 / 멘토링 전체 안내', bold: true, size: 22, font: '맑은 고딕', color: '0E2750' })], spacing: { before: 160, after: 80 }, shading: { fill: 'F2F1EC' }, border: { left: { style: BorderStyle.SINGLE, size: 24, color: '1B3A6B', space: 8 } }, indent: { left: 240 } }));
    children.push(new Paragraph({ children: [new TextRun({ text: 'CareerEngineer는 취업·이직 준비의 모든 단계를 지원하는 전자책과 멘토링을 운영합니다. 자소서 작성, 경력기술서, 면접 답변집 등 단계별 가이드와 1:1 멘토링이 있으며, 모든 자료는 공학박사 멘토의 실제 합격 사례 기반으로 설계되어 있습니다.', size: 20, font: '맑은 고딕', color: '0E2750' })], spacing: { before: 0, after: 120, line: 360 }, indent: { left: 240 } }));
    children.push(h.linkP('전체 상품 보기 (클릭)', 'https://www.latpeed.com/stores/eqxhZ', { before: 80, after: 160, indent: 240 }));
  }
  return children;
}

const essayFromMaster = (key) => (master, dx, opts) => buildEssayDocxChildren(key, {
  basicInfo: { company: master?.profile?.company || '', position: master?.profile?.position || '' },
  finalText: master?.outputs?.[key]?.finalText || master?.workbookRaw?.[key]?.finalText || '',
  answers: master?.workbookRaw?.[key]?.answers || master?.outputs?.[key]?.answers || {},
}, dx, opts);

// 전체 백업에서 사용할 수 있는 워크북별 빌더 레지스트리 (master → children)
export const WORKBOOK_DOCX_BUILDERS = {
  motivation: essayFromMaster('motivation'),
  jobcompetency: essayFromMaster('jobcompetency'),
  personality: essayFromMaster('personality'),
  goalachievement: essayFromMaster('goalachievement'),
  careergoal: essayFromMaster('careergoal'),
  resume: (master, dx, opts) => buildResumeDocxChildren({
    answers: master?.workbookRaw?.resume?.answers || {},
    expCount: master?.workbookRaw?.resume?.expCount ?? 3,
    projCount: master?.workbookRaw?.resume?.projCount ?? 1,
  }, dx, opts),
  career_description: (master, dx, opts) => buildCareerDescDocxChildren({
    ans: master?.workbookRaw?.career_description?.ans || {},
    companyCount: master?.workbookRaw?.career_description?.companyCount ?? 2,
    perfCounts: master?.workbookRaw?.career_description?.perfCounts ?? { 1: 2, 2: 1 },
  }, dx, opts),
  self_introduction: (master, dx, opts) => buildSelfIntroDocxChildren({
    basicInfo: { company: master?.profile?.company || '', position: master?.profile?.position || '' },
    answers: master?.workbookRaw?.self_introduction?.answers || {},
    checks: master?.workbookRaw?.self_introduction?.checks || {},
  }, dx, opts),
};
