// 경험정리 "예쁜" 다중시트 xlsx 빌더 (워크북 저장과 저장본 백업이 동일 파일을 내도록 공용화).
// 경험 워크북과 대시보드(저장본 zip) 양쪽에서 같은 함수를 사용한다.
import * as XLSX from 'xlsx';
import { MENTORING_URLS } from '../shared/design/tokens.js';
import { utf8ToBase64 } from './docxBackup.js';

// xlsx-js-style 동적 로드 (셀 스타일 적용). 실패 시 기본 XLSX(스타일 없음)로 폴백.
export const loadXlsxStyleLib = () => new Promise((resolve) => {
  if (typeof window === 'undefined') return resolve(XLSX);
  if (window.XLSX_STYLE) return resolve(window.XLSX_STYLE);
  const sources = [
    'https://cdn.jsdelivr.net/npm/xlsx-js-style@1.2.0/dist/xlsx.bundle.js',
    'https://unpkg.com/xlsx-js-style@1.2.0/dist/xlsx.bundle.js',
  ];
  let idx = 0;
  const tryNext = () => {
    if (idx >= sources.length) { resolve(null); return; }
    const script = document.createElement('script');
    script.src = sources[idx++];
    script.async = true;
    script.onload = () => { if (window.XLSX) { window.XLSX_STYLE = window.XLSX; resolve(window.XLSX); } else tryNext(); };
    script.onerror = () => tryNext();
    document.head.appendChild(script);
  };
  tryNext();
});

const PERSONA_LABELS = {
  status: { fresh: '신입 취업 준비 중 (재학생/졸업 예정)', fresh_done: '신입 취업 준비 중 (졸업 후)', career: '경력직 이직 준비 중', transfer: '직무/업종 전환 준비 중' },
  experience_count: { many: '5개 이상 — 정리하며 구체화하고 싶다', some: '2~4개 — 깊이 있게 풀어보고 싶다', few: '1개 이하 — 경험 발굴부터 필요하다' },
};

// master → 빌더 입력 데이터
export function experienceXlsxDataFromMaster(master) {
  const er = master?.workbookRaw?.experience || {};
  return {
    experiences: Array.isArray(master?.experiences) ? master.experiences : (er.experiences || []),
    companyLinks: er.companyLinks || {},
    jdKeywords: er.jdKeywords || { core: '', tools: '', soft: '', memo: '' },
    basicInfo: {
      industry: master?.profile?.industry || '',
      position: master?.profile?.position || '',
      target: master?.profile?.company || '',
    },
    personaAnswers: er.personaAnswers || {},
  };
}

// 핵심 빌더 — 워크북/백업 공통. { XLSX_S, wb, fileName } 반환.
export async function buildExperienceXlsx({ experiences = [], companyLinks = {}, jdKeywords = {}, basicInfo = {}, personaAnswers = {} }) {
  const XLSX_S = (await loadXlsxStyleLib()) || XLSX;
  const wb = XLSX_S.utils.book_new();
  const today = new Date().toISOString().slice(0, 10);
  const getPersonaLabel = (qId) => (PERSONA_LABELS[qId] && PERSONA_LABELS[qId][personaAnswers[qId]]) || '';

  const C = {
    NAVY: '0E2750', MID_NAVY: '1B3A6B', GOLD: 'C9A86A', STEEL: '6E7A8F',
    CREAM: 'F2F1EC', IVORY: 'FBFAF6', BORDER: 'E8E5DD', LINK: '0563C1', WHITE: 'FFFFFF',
    STAR_S: 'EBE9DF', STAR_T: 'F2F1EC', STAR_A: 'FBFAF6', STAR_R: 'FFFFFF',
  };
  const FONT = { name: '맑은 고딕' };
  const thinBorder = (color = C.BORDER) => ({
    top: { style: 'thin', color: { rgb: color } }, bottom: { style: 'thin', color: { rgb: color } },
    left: { style: 'thin', color: { rgb: color } }, right: { style: 'thin', color: { rgb: color } },
  });
  const mediumBorder = (color = C.NAVY) => ({
    top: { style: 'medium', color: { rgb: color } }, bottom: { style: 'medium', color: { rgb: color } },
    left: { style: 'medium', color: { rgb: color } }, right: { style: 'medium', color: { rgb: color } },
  });
  const stl = {
    title: { font: { ...FONT, sz: 20, bold: true, color: { rgb: C.NAVY } }, fill: { fgColor: { rgb: C.CREAM } }, alignment: { vertical: 'center', horizontal: 'left', indent: 1 }, border: { bottom: { style: 'medium', color: { rgb: C.NAVY } } } },
    copyright: { font: { ...FONT, sz: 9, color: { rgb: C.STEEL }, italic: true }, fill: { fgColor: { rgb: C.IVORY } }, alignment: { vertical: 'center', horizontal: 'left', wrapText: true, indent: 1 } },
    guide: { font: { ...FONT, sz: 10, color: { rgb: C.NAVY } }, fill: { fgColor: { rgb: C.IVORY } }, alignment: { vertical: 'top', horizontal: 'left', wrapText: true, indent: 1 }, border: { left: { style: 'thick', color: { rgb: C.GOLD } } } },
    sectionH: { font: { ...FONT, sz: 14, bold: true, color: { rgb: C.WHITE } }, fill: { fgColor: { rgb: C.NAVY } }, alignment: { vertical: 'center', horizontal: 'left', indent: 1 }, border: thinBorder(C.NAVY) },
    sectionSub: { font: { ...FONT, sz: 10, color: { rgb: C.STEEL }, italic: true }, fill: { fgColor: { rgb: C.CREAM } }, alignment: { vertical: 'center', horizontal: 'left', wrapText: true, indent: 1 } },
    tableHeader: { font: { ...FONT, sz: 11, bold: true, color: { rgb: C.WHITE } }, fill: { fgColor: { rgb: C.MID_NAVY } }, alignment: { vertical: 'center', horizontal: 'center', wrapText: true }, border: thinBorder(C.NAVY) },
    tableStep: { font: { ...FONT, sz: 10, bold: true, color: { rgb: C.NAVY } }, fill: { fgColor: { rgb: C.IVORY } }, alignment: { vertical: 'center', horizontal: 'left', wrapText: true, indent: 1 }, border: thinBorder() },
    tableLink: { font: { ...FONT, sz: 11, bold: true, color: { rgb: C.LINK }, underline: true }, fill: { fgColor: { rgb: C.WHITE } }, alignment: { vertical: 'center', horizontal: 'left', wrapText: true, indent: 1 }, border: thinBorder() },
    tableText: { font: { ...FONT, sz: 10, color: { rgb: C.NAVY } }, fill: { fgColor: { rgb: C.WHITE } }, alignment: { vertical: 'center', horizontal: 'left', wrapText: true, indent: 1 }, border: thinBorder() },
    tableStatus: { font: { ...FONT, sz: 9, color: { rgb: C.STEEL }, italic: true }, fill: { fgColor: { rgb: C.WHITE } }, alignment: { vertical: 'center', horizontal: 'center' }, border: thinBorder() },
    infoBox: { font: { ...FONT, sz: 10, color: { rgb: C.NAVY } }, fill: { fgColor: { rgb: C.IVORY } }, alignment: { vertical: 'center', horizontal: 'left', wrapText: true, indent: 2 }, border: { left: { style: 'thick', color: { rgb: C.MID_NAVY } } } },
    infoBoxLink: { font: { ...FONT, sz: 11, bold: true, color: { rgb: C.LINK }, underline: true }, fill: { fgColor: { rgb: C.IVORY } }, alignment: { vertical: 'center', horizontal: 'left', wrapText: true, indent: 2 }, border: { left: { style: 'thick', color: { rgb: C.MID_NAVY } } } },
    catHeader: { font: { ...FONT, sz: 12, bold: true, color: { rgb: C.WHITE } }, fill: { fgColor: { rgb: C.MID_NAVY } }, alignment: { vertical: 'center', horizontal: 'left', indent: 1 }, border: mediumBorder(C.NAVY) },
    wbHeader: { font: { ...FONT, sz: 10, bold: true, color: { rgb: C.WHITE } }, fill: { fgColor: { rgb: C.NAVY } }, alignment: { vertical: 'center', horizontal: 'center', wrapText: true }, border: thinBorder(C.NAVY) },
    wbCell: { font: { ...FONT, sz: 10, color: { rgb: C.NAVY } }, fill: { fgColor: { rgb: C.WHITE } }, alignment: { vertical: 'top', horizontal: 'left', wrapText: true, indent: 1 }, border: thinBorder() },
    starS: { font: { ...FONT, sz: 10, color: { rgb: C.NAVY } }, fill: { fgColor: { rgb: C.STAR_S } }, alignment: { vertical: 'top', horizontal: 'left', wrapText: true, indent: 1 }, border: thinBorder() },
    starT: { font: { ...FONT, sz: 10, color: { rgb: C.NAVY } }, fill: { fgColor: { rgb: C.STAR_T } }, alignment: { vertical: 'top', horizontal: 'left', wrapText: true, indent: 1 }, border: thinBorder() },
    starA: { font: { ...FONT, sz: 10, color: { rgb: C.NAVY } }, fill: { fgColor: { rgb: C.STAR_A } }, alignment: { vertical: 'top', horizontal: 'left', wrapText: true, indent: 1 }, border: thinBorder() },
    starR: { font: { ...FONT, sz: 10, color: { rgb: C.NAVY } }, fill: { fgColor: { rgb: C.STAR_R } }, alignment: { vertical: 'top', horizontal: 'left', wrapText: true, indent: 1 }, border: thinBorder() },
    wbCompName: { font: { ...FONT, sz: 10, color: { rgb: C.NAVY } }, fill: { fgColor: { rgb: C.WHITE } }, alignment: { vertical: 'center', horizontal: 'left', wrapText: true, indent: 1 }, border: thinBorder() },
    wbScore: { font: { ...FONT, sz: 11, bold: true, color: { rgb: C.MID_NAVY } }, fill: { fgColor: { rgb: C.CREAM } }, alignment: { vertical: 'center', horizontal: 'center' }, border: thinBorder() },
    wbBlank: { fill: { fgColor: { rgb: C.WHITE } }, border: thinBorder() },
    wbBlankScore: { fill: { fgColor: { rgb: C.IVORY } }, border: thinBorder() },
  };
  const applyStyleToSheet = (ws) => (r, c, style, value) => {
    const addr = XLSX_S.utils.encode_cell({ r, c });
    if (!ws[addr]) ws[addr] = { t: 's', v: value !== undefined ? value : '' };
    else if (value !== undefined) ws[addr].v = value;
    ws[addr].s = style;
  };
  const pad4 = (arr) => {
    const a = (arr || []).filter((c) => c.name).slice(0, 4);
    while (a.length < 4) a.push({ name: '', score: '' });
    return a;
  };
  const blankRow = (n) => Array(n).fill('');

  const COL_COUNT = 14;
  const CATEGORY_ORDER = [
    '학교 활동', '동아리/학회 활동', '인턴/아르바이트 경험',
    '대외활동(공모전, 봉사활동, 서포터즈)', '자격증 / 교육',
    '개인경험 (블로그 운영, 취미 활동, 여행 등)',
    '일상경험 (가족 행사 기획, 친구 모임 주도 등)',
  ];
  const categoryMatch = (expCategory) => {
    if (!expCategory) return null;
    const c = expCategory.trim();
    if (CATEGORY_ORDER.includes(c)) return c;
    if (c.includes('학교') || c.includes('수업') || c.includes('학업') || c.includes('전공')) return '학교 활동';
    if (c.includes('동아리') || c.includes('학회')) return '동아리/학회 활동';
    if (c.includes('인턴') || c.includes('아르바이트') || c.includes('알바')) return '인턴/아르바이트 경험';
    if (c.includes('대외') || c.includes('공모전') || c.includes('봉사') || c.includes('서포터즈')) return '대외활동(공모전, 봉사활동, 서포터즈)';
    if (c.includes('자격') || c.includes('교육') || c.includes('수료') || c.includes('부트캠프')) return '자격증 / 교육';
    if (c.includes('개인') || c.includes('블로그') || c.includes('취미') || c.includes('여행')) return '개인경험 (블로그 운영, 취미 활동, 여행 등)';
    if (c.includes('일상') || c.includes('가족') || c.includes('모임')) return '일상경험 (가족 행사 기획, 친구 모임 주도 등)';
    return c;
  };
  const grouped = {};
  CATEGORY_ORDER.forEach((c) => (grouped[c] = []));
  const otherCategories = {};
  experiences.forEach((e) => {
    const matched = categoryMatch(e.category);
    if (matched && CATEGORY_ORDER.includes(matched)) grouped[matched].push(e);
    else if (matched) { if (!otherCategories[matched]) otherCategories[matched] = []; otherCategories[matched].push(e); }
  });
  const renderExperienceAs4Rows = (e) => {
    const jc = pad4(e.job_comps); const cc = pad4(e.comm_comps); const ac = pad4(e.att_comps);
    return [
      [e.category || '', e.period || '', e.org || '', e.role || '', e.summary || '', e.motivation || '', e.star_s ? 'S (상황): ' + e.star_s : '', e.learning || '', jc[0].name, jc[0].score, cc[0].name, cc[0].score, ac[0].name, ac[0].score],
      ['', '', '', '', '', '', e.star_t ? 'T (과제): ' + e.star_t : '', '', jc[1].name, jc[1].score, cc[1].name, cc[1].score, ac[1].name, ac[1].score],
      ['', '', '', '', '', '', e.star_a ? 'A (행동): ' + e.star_a : '', '', jc[2].name, jc[2].score, cc[2].name, cc[2].score, ac[2].name, ac[2].score],
      ['', '', '', '', '', '', [e.star_r ? 'R (결과): ' + e.star_r : '', e.difficulty ? '[객관적 어려움] ' + e.difficulty : ''].filter(Boolean).join('\n'), '', jc[3].name, jc[3].score, cc[3].name, cc[3].score, ac[3].name, ac[3].score],
    ];
  };
  const tmplRows = [];
  const rowMeta = [];
  const addRow = (data, meta) => { tmplRows.push(data); rowMeta.push(meta || {}); };
  addRow(['경험정리 가이드'], { type: 'title' });
  addRow(['이 문서에 사용된 워크북의 구성·질문·예시 등 모든 콘텐츠의 저작권은 CareerEngineer에게 있습니다. 사전 서면 동의 없이 본 문서 및 워크북의 질문·구성을 복제·배포·공유·게시·2차 가공하거나 외부로 유출할 수 없습니다. 무단 사용·유출 시 관련 법령에 따라 민·형사상 책임을 물을 수 있습니다.'], { type: 'copyright' });
  addRow(['작성 가이드\n경험 인벤토리: 대학생활의 모든 경험을 카테고리별로 정리하세요. 사소해 보이는 경험도 빠짐없이 기록하세요.\nSTAR 분석: 각 경험을 Situation(상황) → Task(과제) → Action(행동) → Result(결과) 순서로 자세히 작성하세요.\n역량 점수: 0-10점 척도로 평가하세요. (0=전혀 없음, 10=전문가 수준)'], { type: 'guide' });
  addRow(blankRow(COL_COUNT), { type: 'gap' });
  addRow(['경험정리 이후 도움이 될 CareerEngineer 자료'], { type: 'sectionH' });
  addRow(['경험정리가 끝났다면 아래 자료들로 다음 단계를 진행해보세요. 추천 자료를 클릭하면 해당 페이지로 이동합니다.'], { type: 'sectionSub' });
  addRow(blankRow(COL_COUNT), { type: 'gap' });
  addRow(['단계', '추천 자료 (클릭)', '왜 도움이 되나요?', '상태'], { type: 'tableHeader' });
  const helpfulRows = [
    { step: 'STEP 1. 자소서 작성', name: '질문에 답하며 완성하는 자소서 작성 전자책 시리즈', why: '정리한 경험을 자소서 항목별 답변으로 발전시킬 수 있습니다', status: '추천', url: MENTORING_URLS.ebook_series },
    { step: 'STEP 2. 1:1 컨설팅', name: '1-Hour 1:1 취업컨설팅', why: '경험 인벤토리를 기반으로 지원 전략을 설계합니다', status: '맞춤', url: MENTORING_URLS.consulting },
    { step: 'STEP 3. 자소서 멘토링', name: '자소서 멘토링', why: '실제 자소서를 함께 다듬으며 합격률을 높입니다', status: '심화', url: MENTORING_URLS.cover_letter },
    { step: 'STEP 4. 면접 멘토링', name: '면접 멘토링', why: '경험 인벤토리로 면접 답변을 사전 점검합니다', status: '실전', url: MENTORING_URLS.interview },
    { step: '(경력자) 이직 컨설팅', name: '이직 컨설팅', why: '경력기술서와 함께 이직 전략을 설계합니다', status: '경력', url: MENTORING_URLS.career_consulting },
    { step: '읽을거리', name: 'CareerEngineeringLab 블로그', why: '공학박사의 취업성공 알고리즘을 매주 업데이트', status: '참고', url: 'https://blog.naver.com/careerengineering' },
    { step: '읽을거리', name: '브런치북: 이번생에 취업할 수 있을까?', why: '취업 성공 사례와 실패담을 통한 학습', status: '참고', url: 'https://brunch.co.kr/@careerengineer' },
  ];
  const helpRowIndices = [];
  helpfulRows.forEach((h) => { helpRowIndices.push({ row: tmplRows.length, url: h.url }); addRow([h.step, h.name, h.why, h.status], { type: 'helpRow' }); });
  addRow(blankRow(COL_COUNT), { type: 'gap' });
  addRow(['CareerEngineer 전자책 / 멘토링 전체 안내'], { type: 'sectionH' });
  addRow(['CareerEngineer는 취업·이직 준비의 모든 단계를 지원하는 전자책과 멘토링을 운영합니다.'], { type: 'infoBox' });
  addRow(['• 전자책: 질문에 답하며 완성하는 자소서 작성, 경력기술서, 면접 답변집 등 단계별 가이드'], { type: 'infoBox' });
  addRow(['• 멘토링: 1:1 취업컨설팅, 자소서 멘토링, 면접 멘토링, 이직 컨설팅 (1회/패키지 선택 가능)'], { type: 'infoBox' });
  addRow(['• 모든 자료는 공학박사 멘토의 실제 합격 사례 기반으로 설계되어 있습니다.'], { type: 'infoBox' });
  const storesRowIdx = tmplRows.length;
  addRow(['전체 상품 보기 (클릭하여 페이지 열기)'], { type: 'infoBoxLink' });
  addRow(blankRow(COL_COUNT), { type: 'gap' });
  addRow(['경험정리 워크북 — 작성 영역'], { type: 'sectionH' });
  addRow(['아래 표에 카테고리별로 경험을 정리하세요. 각 경험은 4행(S/T/A/R)으로 펼쳐지며, 카테고리마다 4행의 추가 작성 공간이 마련되어 있습니다.'], { type: 'sectionSub' });
  addRow(blankRow(COL_COUNT), { type: 'gap' });
  const wbHeaderRowIdx = tmplRows.length;
  addRow(['카테고리', '기간', '활동/단체/기관명', '역할/직책', '주요 활동/업무 내용', '하게 된 이유', 'STAR 분석\n(S: 상황 → T: 과제 → A: 행동 → R: 결과)', '배운점/느낀점', '직무역량', '점수\n[0-10]', '소통역량', '점수\n[0-10]', '임하는 자세 / 가치관', '점수\n[0-10]'], { type: 'wbHeader' });
  const catHeaderIndices = [];
  const starRowIndices = [];
  const renderCategory = (cat, exps) => {
    const expCount = exps.length;
    const headerText = `${cat}` + (expCount > 0 ? `   ·   입력 ${expCount}건` : `   ·   작성 영역`);
    catHeaderIndices.push(tmplRows.length);
    addRow([headerText], { type: 'catHeader' });
    exps.forEach((e, eIdx) => {
      const rows = renderExperienceAs4Rows(e);
      rows.forEach((r, rIdx) => { starRowIndices.push({ row: tmplRows.length, starType: ['S', 'T', 'A', 'R'][rIdx] }); addRow(r, { type: 'expRow', starType: ['S', 'T', 'A', 'R'][rIdx] }); });
      if (eIdx < exps.length - 1) addRow(blankRow(COL_COUNT), { type: 'expGap' });
    });
    for (let i = 0; i < 4; i++) { starRowIndices.push({ row: tmplRows.length, starType: ['S', 'T', 'A', 'R'][i], blank: true }); addRow(blankRow(COL_COUNT), { type: 'expRow', starType: ['S', 'T', 'A', 'R'][i], blank: true }); }
  };
  CATEGORY_ORDER.forEach((cat) => renderCategory(cat, grouped[cat]));
  Object.keys(otherCategories).forEach((cat) => renderCategory(cat, otherCategories[cat]));

  const ws1 = XLSX_S.utils.aoa_to_sheet(tmplRows);
  const apply1 = applyStyleToSheet(ws1);
  ws1['!cols'] = [{ wch: 22 }, { wch: 16 }, { wch: 26 }, { wch: 14 }, { wch: 30 }, { wch: 26 }, { wch: 50 }, { wch: 30 }, { wch: 18 }, { wch: 9 }, { wch: 18 }, { wch: 9 }, { wch: 18 }, { wch: 9 }];
  const rowHeights = [];
  const merges = [];
  rowMeta.forEach((meta, r) => {
    let height = 22;
    switch (meta.type) {
      case 'title': height = 36; merges.push({ s: { r, c: 0 }, e: { r, c: COL_COUNT - 1 } }); break;
      case 'copyright': height = 30; merges.push({ s: { r, c: 0 }, e: { r, c: COL_COUNT - 1 } }); break;
      case 'guide': height = 90; merges.push({ s: { r, c: 0 }, e: { r, c: COL_COUNT - 1 } }); break;
      case 'gap': height = 8; break;
      case 'sectionH': height = 32; merges.push({ s: { r, c: 0 }, e: { r, c: COL_COUNT - 1 } }); break;
      case 'sectionSub': height = 28; merges.push({ s: { r, c: 0 }, e: { r, c: COL_COUNT - 1 } }); break;
      case 'tableHeader': height = 32; break;
      case 'helpRow': height = 38; break;
      case 'infoBox': height = 24; merges.push({ s: { r, c: 0 }, e: { r, c: COL_COUNT - 1 } }); break;
      case 'infoBoxLink': height = 32; merges.push({ s: { r, c: 0 }, e: { r, c: COL_COUNT - 1 } }); break;
      case 'wbHeader': height = 46; break;
      case 'catHeader': height = 28; merges.push({ s: { r, c: 0 }, e: { r, c: COL_COUNT - 1 } }); break;
      case 'expRow': height = 28; break;
      case 'expGap': height = 8; break;
    }
    rowHeights[r] = { hpt: height };
  });
  ws1['!rows'] = rowHeights;
  ws1['!merges'] = merges;
  rowMeta.forEach((meta, r) => {
    switch (meta.type) {
      case 'title': for (let c = 0; c < COL_COUNT; c++) apply1(r, c, stl.title); break;
      case 'copyright': for (let c = 0; c < COL_COUNT; c++) apply1(r, c, stl.copyright); break;
      case 'guide': for (let c = 0; c < COL_COUNT; c++) apply1(r, c, stl.guide); break;
      case 'sectionH': for (let c = 0; c < COL_COUNT; c++) apply1(r, c, stl.sectionH); break;
      case 'sectionSub': for (let c = 0; c < COL_COUNT; c++) apply1(r, c, stl.sectionSub); break;
      case 'tableHeader': for (let c = 0; c <= 3; c++) apply1(r, c, stl.tableHeader); break;
      case 'helpRow': apply1(r, 0, stl.tableStep); apply1(r, 1, stl.tableLink); apply1(r, 2, stl.tableText); apply1(r, 3, stl.tableStatus); break;
      case 'infoBox': for (let c = 0; c < COL_COUNT; c++) apply1(r, c, stl.infoBox); break;
      case 'infoBoxLink': for (let c = 0; c < COL_COUNT; c++) apply1(r, c, stl.infoBoxLink); break;
      case 'wbHeader': for (let c = 0; c < COL_COUNT; c++) apply1(r, c, stl.wbHeader); break;
      case 'catHeader': for (let c = 0; c < COL_COUNT; c++) apply1(r, c, stl.catHeader); break;
      case 'expRow': {
        const starStyle = { S: stl.starS, T: stl.starT, A: stl.starA, R: stl.starR }[meta.starType] || stl.wbCell;
        for (let c = 0; c <= 5; c++) apply1(r, c, meta.blank ? stl.wbBlank : stl.wbCell);
        apply1(r, 6, meta.blank ? stl.wbBlank : starStyle);
        apply1(r, 7, meta.blank ? stl.wbBlank : stl.wbCell);
        [8, 10, 12].forEach((c) => apply1(r, c, meta.blank ? stl.wbBlank : stl.wbCompName));
        [9, 11, 13].forEach((c) => apply1(r, c, meta.blank ? stl.wbBlankScore : stl.wbScore));
        break;
      }
    }
  });
  helpRowIndices.forEach(({ row, url }) => {
    const addr = XLSX_S.utils.encode_cell({ r: row, c: 1 });
    if (ws1[addr] && url) ws1[addr].l = { Target: url, Tooltip: '클릭하여 페이지 이동' };
  });
  const storesAddr = XLSX_S.utils.encode_cell({ r: storesRowIdx, c: 0 });
  if (ws1[storesAddr]) ws1[storesAddr].l = { Target: MENTORING_URLS.stores, Tooltip: 'CareerEngineer 전체 상품 페이지' };
  ws1['!margins'] = { left: 0.4, right: 0.4, top: 0.5, bottom: 0.5, header: 0.3, footer: 0.3 };
  ws1['!pageSetup'] = { orientation: 'landscape', fitToWidth: 1, fitToHeight: 0, paperSize: 9 };
  ws1['!printHeader'] = [wbHeaderRowIdx + 1, wbHeaderRowIdx + 1];
  XLSX_S.utils.book_append_sheet(wb, ws1, '경험정리');

  // [시트 2] 기본정보 · 직무상세내용
  const infoRows = [
    ['기본정보 · 직무상세내용 키워드'],
    ['저작권 안내   © ' + new Date().getFullYear() + ' CareerEngineer   생성일: ' + new Date().toLocaleString('ko-KR')],
    [],
    ['■ 기본 정보'],
    ['지원 산업', basicInfo.industry || '-'],
    ['지원 직무', basicInfo.position || '-'],
    ['대상 회사', basicInfo.target || '-'],
    [],
    ['■ 페르소나 진단'],
    ['현재 상황', getPersonaLabel('status') || '-'],
    ['떠오르는 경험', getPersonaLabel('experience_count') || '-'],
    [],
    ['■ 채용공고 — 직무상세내용 키워드'],
    ['핵심 직무 키워드', jdKeywords.core || '-'],
    ['도구·기술 키워드', jdKeywords.tools || '-'],
    ['소프트스킬 키워드', jdKeywords.soft || '-'],
    ['기타 메모', jdKeywords.memo || '-'],
  ];
  const ws2 = XLSX_S.utils.aoa_to_sheet(infoRows);
  ws2['!cols'] = [{ wch: 26 }, { wch: 80 }];
  const apply2 = applyStyleToSheet(ws2);
  apply2(0, 0, stl.title); apply2(0, 1, stl.title);
  apply2(1, 0, stl.copyright); apply2(1, 1, stl.copyright);
  [3, 8, 12].forEach((r) => { apply2(r, 0, stl.sectionH); apply2(r, 1, stl.sectionH); });
  ws2['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }, { s: { r: 1, c: 0 }, e: { r: 1, c: 1 } },
    { s: { r: 3, c: 0 }, e: { r: 3, c: 1 } }, { s: { r: 8, c: 0 }, e: { r: 8, c: 1 } }, { s: { r: 12, c: 0 }, e: { r: 12, c: 1 } },
  ];
  [4, 5, 6, 9, 10, 13, 14, 15, 16].forEach((r) => { apply2(r, 0, stl.tableStep); apply2(r, 1, stl.tableText); });
  ws2['!rows'] = [{ hpt: 36 }, { hpt: 24 }, { hpt: 10 }, { hpt: 30 }, { hpt: 28 }, { hpt: 28 }, { hpt: 28 }, { hpt: 10 }, { hpt: 30 }, { hpt: 28 }, { hpt: 28 }, { hpt: 10 }, { hpt: 30 }, { hpt: 28 }, { hpt: 28 }, { hpt: 28 }, { hpt: 28 }];
  ws2['!margins'] = { left: 0.5, right: 0.5, top: 0.5, bottom: 0.5, header: 0.3, footer: 0.3 };
  ws2['!pageSetup'] = { orientation: 'portrait', fitToWidth: 1, fitToHeight: 0, paperSize: 9 };
  XLSX_S.utils.book_append_sheet(wb, ws2, '기본정보 · 직무상세내용');

  // [시트 3] 역량 점수 기준표
  const scoreRows = [
    ['역량 점수 기준표 (0-10점 척도)'],
    ['경험정리 시 역량 점수를 매길 때 아래 기준을 참고하세요. 정확한 자기 평가가 자소서와 면접의 설득력을 높입니다.'],
    [],
    ['점수', '수준', '판단 기준', '이런 상태라면 이 점수', '자가 검증 질문'],
    ['1-2', '개념 인지', '수업이나 책으로 개념만 접한 수준. 실제로 해본 적은 없고 용어를 알고 있는 정도.', '예: "SQL이 데이터베이스 질의 언어라는 건 아는데 직접 쿼리를 짜본 적은 없다"', '"이 역량에 대해 1분간 설명할 수 있는가?"'],
    ['3-4', '기초 실습', '수업 과제나 간단한 실습에서 사용해 본 수준. 가이드가 있으면 따라할 수 있는 정도.', '예: "수업 과제로 Python 데이터 분석을 해봤다"', '"이걸 처음부터 끝까지 혼자서 할 수 있는가?"'],
    ['5-6', '프로젝트 적용', '프로젝트에서 실제로 적용한 경험이 있는 수준. 스스로 판단하며 수행한 경험이 있고 결과물이 존재하는 상태.', '예: "캡스톤에서 AutoCAD로 부품을 설계했다"', '"이 역량을 사용해서 만든 결과물이 있는가?"'],
    ['7-8', '반복 성과', '여러 번 반복 적용하여 성과를 낸 수준. 2회 이상 다른 맥락에서 활용했고 수치화할 수 있는 결과가 있는 상태.', '예: "인턴에서 SPC 분석으로 불량률 3% 개선"', '"면접에서 이 역량에 대해 3분간 구체적으로 말할 수 있는가?"'],
    ['9-10', '전문가/리드', '타인에게 가르치거나 리드할 수 있는 수준. 후배를 지도하거나, 팀에서 해당 역량의 전문가로 인정받는 정도.', '예: "이 분야에서 후배들에게 교육을 진행했다"', '"이 역량에 대해 다른 사람을 가르칠 수 있는가?"'],
    [],
    ['점수 매기기 전 반드시 확인하세요'],
    ['1.', '신입 지원자라면 대부분의 역량이 3-6점 범위에 있는 것이 정상입니다. 9-10점은 극히 드뭅니다.'],
    ['2.', '점수를 높게 매기는 것보다 정확하게 매기는 것이 중요합니다.'],
    ['3.', '같은 역량이라도 경험에 따라 점수가 다를 수 있습니다.'],
    ['4.', '실제로 보유하지 않은 역량을 개수 채우기 위해 적지 마세요.'],
    ['5.', '점수가 낮다고 나쁜 것이 아닙니다. 부족한 역량은 입사후포부에서 "성장 계획"으로 활용할 수 있습니다.'],
  ];
  const ws3 = XLSX_S.utils.aoa_to_sheet(scoreRows);
  ws3['!cols'] = [{ wch: 8 }, { wch: 14 }, { wch: 50 }, { wch: 50 }, { wch: 36 }];
  const apply3 = applyStyleToSheet(ws3);
  for (let c = 0; c < 5; c++) { apply3(0, c, stl.title); apply3(1, c, stl.copyright); apply3(3, c, stl.tableHeader); apply3(10, c, stl.sectionH); }
  for (let r = 4; r <= 8; r++) { apply3(r, 0, stl.wbScore); apply3(r, 1, stl.tableStep); apply3(r, 2, stl.tableText); apply3(r, 3, stl.tableText); apply3(r, 4, stl.tableText); }
  for (let r = 11; r <= 15; r++) { apply3(r, 0, stl.tableStep); apply3(r, 1, stl.tableText); }
  ws3['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }, { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } }, { s: { r: 10, c: 0 }, e: { r: 10, c: 4 } },
    { s: { r: 11, c: 1 }, e: { r: 11, c: 4 } }, { s: { r: 12, c: 1 }, e: { r: 12, c: 4 } }, { s: { r: 13, c: 1 }, e: { r: 13, c: 4 } }, { s: { r: 14, c: 1 }, e: { r: 14, c: 4 } }, { s: { r: 15, c: 1 }, e: { r: 15, c: 4 } },
  ];
  ws3['!rows'] = [{ hpt: 36 }, { hpt: 30 }, { hpt: 10 }, { hpt: 36 }, { hpt: 56 }, { hpt: 56 }, { hpt: 56 }, { hpt: 56 }, { hpt: 56 }, { hpt: 10 }, { hpt: 30 }, { hpt: 26 }, { hpt: 26 }, { hpt: 26 }, { hpt: 26 }, { hpt: 26 }];
  ws3['!margins'] = { left: 0.4, right: 0.4, top: 0.5, bottom: 0.5, header: 0.3, footer: 0.3 };
  ws3['!pageSetup'] = { orientation: 'landscape', fitToWidth: 1, fitToHeight: 0, paperSize: 9 };
  XLSX_S.utils.book_append_sheet(wb, ws3, '역량 점수 기준표');

  // [시트 4] 직무상세내용 매칭 (있을 때만)
  if (experiences.some((e) => e.jd_match)) {
    const jdRows = [
      ['경험별 직무상세내용 키워드 연결 메모'],
      ['각 경험이 직무상세내용의 어떤 키워드와 연결되는지 기록한 매칭 메모입니다.'],
      [],
      ['No', '카테고리', '기관/활동명', '역할', '직무상세내용 매칭 메모'],
    ];
    experiences.forEach((e, i) => { if (e.jd_match) jdRows.push([i + 1, e.category, e.org, e.role, e.jd_match]); });
    const ws4 = XLSX_S.utils.aoa_to_sheet(jdRows);
    ws4['!cols'] = [{ wch: 6 }, { wch: 24 }, { wch: 24 }, { wch: 14 }, { wch: 60 }];
    const apply4 = applyStyleToSheet(ws4);
    for (let c = 0; c < 5; c++) { apply4(0, c, stl.title); apply4(1, c, stl.copyright); apply4(3, c, stl.tableHeader); }
    for (let r = 4; r < jdRows.length; r++) { apply4(r, 0, stl.wbScore); for (let c = 1; c < 5; c++) apply4(r, c, stl.tableText); }
    ws4['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }, { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } }];
    const heights = [{ hpt: 36 }, { hpt: 24 }, { hpt: 10 }, { hpt: 36 }];
    for (let r = 4; r < jdRows.length; r++) heights.push({ hpt: 32 });
    ws4['!rows'] = heights;
    ws4['!margins'] = { left: 0.5, right: 0.5, top: 0.5, bottom: 0.5, header: 0.3, footer: 0.3 };
    ws4['!pageSetup'] = { orientation: 'landscape', fitToWidth: 1, fitToHeight: 0, paperSize: 9 };
    XLSX_S.utils.book_append_sheet(wb, ws4, '직무상세내용 매칭');
  }
  // 회사별 직무 연결 시트
  try {
    Object.entries(companyLinks || {}).forEach(([company, data], ci) => {
      const rows = [];
      rows.push(['회사', company]);
      rows.push(['채용공고 키워드', (data && data.keywords) || '']);
      rows.push(['', '']);
      rows.push(['경험', '연결 (충족하는 키워드·요건)']);
      experiences.forEach((e, i) => {
        const note = data && data.links ? data.links[e.id] : '';
        if (note && String(note).trim()) rows.push([e.org || e.category || `경험 ${i + 1}`, note]);
      });
      const cws = XLSX_S.utils.aoa_to_sheet(rows);
      cws['!cols'] = [{ wch: 30 }, { wch: 70 }];
      const safe = ('연결·' + company).replace(/[:\\/?*[\]]/g, '_').slice(0, 28) || ('연결' + (ci + 1));
      XLSX_S.utils.book_append_sheet(wb, cws, safe);
    });
  } catch (e) { console.warn('[experienceXlsx] company link sheets skipped:', e); }
  // 복원용 백업 (숨김 시트)
  try {
    const b64 = utf8ToBase64(JSON.stringify({ format: 'careerengineer-experience-xlsx', version: 1, experiences, companyLinks, jdKeywords, personaAnswers }));
    const CH = 30000;
    const rows = [['CE_EXPERIENCE_BACKUP']];
    for (let i = 0; i < b64.length; i += CH) rows.push([b64.slice(i, i + CH)]);
    const bws = XLSX_S.utils.aoa_to_sheet(rows);
    XLSX_S.utils.book_append_sheet(wb, bws, '_CE_BACKUP');
    const bi = wb.SheetNames.indexOf('_CE_BACKUP');
    if (bi >= 0) { wb.Workbook = wb.Workbook || {}; wb.Workbook.Sheets = wb.Workbook.Sheets || []; wb.Workbook.Sheets[bi] = { Hidden: 1 }; }
  } catch (e) { console.warn('[experienceXlsx] backup sheet skipped:', e); }

  return { XLSX_S, wb, fileName: `CareerEngineer_경험정리_${today}.xlsx` };
}

// 워크북 자체 저장: 파일 다운로드
export async function saveExperienceXlsx(data) {
  const { XLSX_S, wb, fileName } = await buildExperienceXlsx(data);
  XLSX_S.writeFile(wb, fileName);
  return fileName;
}

// 저장본 백업(zip)용: Blob 반환
export async function experienceXlsxBlob(master) {
  const { XLSX_S, wb, fileName } = await buildExperienceXlsx(experienceXlsxDataFromMaster(master));
  const arr = XLSX_S.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([arr], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  return { blob, name: fileName };
}
