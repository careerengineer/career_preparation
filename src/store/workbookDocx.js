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

// 지원동기(motivation) 단계 구성 — 작성 노트의 그룹/순서
const MOTIVATION_SECTIONS = [
  { title: 'Q1: 왜 이 직무인가', ids: ['q1_1', 'q1_2', 'q1_3'] },
  { title: 'Q2: 왜 이 회사인가', ids: ['q2_1', 'q2_2'] },
  { title: 'Q3: 무엇을 왜 준비했는가', ids: ['q3_1', 'q3_2', 'q3_3'] },
  { title: 'Q4: 어떻게 기여할 수 있는가', ids: ['q4_1', 'q4_2'] },
  { title: '연결 문장', ids: ['connect_q1q2', 'connect_q2q3', 'connect_q3q4'] },
];

// 지원동기 docx 본문 children
export function buildMotivationDocxChildren({ basicInfo = {}, finalText = '', answers = {} }, dx, { includeMentoring = true } = {}) {
  const h = makeDocxHelpers(dx);
  const labels = QUESTION_LABELS.motivation || {};
  const children = [h.dateP(), h.titleP('지 원 동 기')];

  if (basicInfo.company || basicInfo.position) {
    const sub = (basicInfo.company || '') + (basicInfo.company && basicInfo.position ? ' · ' : '') + (basicInfo.position ? basicInfo.position + ' 지원' : '');
    children.push(h.subtitleP(sub));
  }
  if (finalText && finalText.trim()) {
    finalText.split('\n\n').filter((x) => x.trim()).forEach((para) => children.push(h.bodyP(para)));
  } else {
    children.push(h.placeholderP('[지원동기 본문이 여기에 들어갑니다.]'));
  }

  children.push(h.pageBreak());
  children.push(new dx.Paragraph({ children: [new dx.TextRun({ text: '작성 노트 — 단계별 답변', bold: true, size: 28, font: '맑은 고딕', color: '0E2750' })], spacing: { before: 0, after: 100 }, border: { bottom: { style: dx.BorderStyle.SINGLE, size: 12, color: '0E2750', space: 4 } } }));
  children.push(h.plain('아래는 자소서 작성 과정에서 정리한 모든 답변입니다. 다음에 이어 작업하거나 다른 자소서에 활용할 때 참고하세요.', { italic: true, spacing: { before: 0, after: 280 } }));

  MOTIVATION_SECTIONS.forEach((sec) => {
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

// 전체 백업에서 사용할 수 있는 워크북별 빌더 레지스트리 (master → children)
export const WORKBOOK_DOCX_BUILDERS = {
  motivation: (master, dx, opts) => buildMotivationDocxChildren({
    basicInfo: { company: master?.profile?.company || '', position: master?.profile?.position || '' },
    finalText: master?.outputs?.motivation?.finalText || master?.workbookRaw?.motivation?.finalText || '',
    answers: master?.workbookRaw?.motivation?.answers || master?.outputs?.motivation?.answers || {},
  }, dx, opts),
};
