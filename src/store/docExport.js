import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreak, BorderStyle, ExternalHyperlink } from 'docx';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { ALL_WORKBOOKS as WORKBOOKS, APP_VERSION } from './schema.js';
import { formatComps } from './comps.js';
import { buildCopyrightParagraphs, COPYRIGHT_TITLE, COPYRIGHT_TEXT, COPYRIGHT_MARK } from './docxBackup.js';
import { LEGACY_KEYS } from './legacySync.js';
import { QUESTION_LABELS } from './questionLabels.js';
import { decodeAnswer } from './answerLabels.js';
import { experienceXlsxBlob } from './experienceXlsx.js';
import { WORKBOOK_DOCX_BUILDERS } from './workbookDocx.js';

// 전체 백업에서 워크북별 전용 docx 빌더에 넘길 docx 클래스 묶음
const DX = { Paragraph, TextRun, AlignmentType, BorderStyle, ExternalHyperlink };

// 본문 끝 부록 영역에 base64로 백업 JSON을 임베드.
// docx 표준 구조 그대로 유지 → Word/한글 정상 표시 + import 시 추출 가능.
const MARK_START = 'CE_BACKUP_BEGIN';
const MARK_END   = 'CE_BACKUP_END';

function utf8ToBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}
function base64ToUtf8(b64) {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}
function chunkString(str, n) {
  const result = [];
  for (let i = 0; i < str.length; i += n) result.push(str.slice(i, i + n));
  return result;
}

function backupBlocks(payload) {
  const b64 = utf8ToBase64(JSON.stringify(payload));
  const chunks = chunkString(b64, 3000);
  const muted = (text, opts = {}) => new Paragraph({
    children: [new TextRun({ text, size: 12, color: 'BDBDBD', ...opts })],
    spacing: { after: 20 },
  });
  return [
    new Paragraph({ children: [new PageBreak()] }),
    muted('— CareerEngineer 백업 데이터 (자동 생성, 수정·삭제 시 import 불가) —', { bold: true }),
    muted(MARK_START),
    ...chunks.map((c) => muted(c)),
    muted(MARK_END),
  ];
}

export async function extractBackupFromDocx(file) {
  const buf = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(buf);
  const docXmlFile = zip.file('word/document.xml');
  if (!docXmlFile) throw new Error('docx 형식이 올바르지 않습니다.');
  const xml = await docXmlFile.async('text');
  // XML 태그 제거하고 텍스트만 추출
  const text = xml.replace(/<[^>]+>/g, ' ');
  const re = new RegExp(`${MARK_START}\\s*([\\s\\S]+?)\\s*${MARK_END}`);
  const m = text.match(re);
  if (!m) throw new Error('이 docx에는 백업 데이터가 포함돼 있지 않습니다. CareerEngineer에서 직접 내보낸 docx만 import 가능합니다.');
  const b64 = m[1].replace(/\s+/g, '');
  const json = base64ToUtf8(b64);
  return JSON.parse(json);
}

// 임베드 없는 일반 docx에서도 본문 텍스트만 추출 → 부분 import
// 워크북 답변 필드로는 자동 매핑 안 함 (사용자가 직접 paste 권장)
// master.workbookRaw._docxImport에 저장 → ReferenceInline/ImportPanel에서 확인 가능
export async function extractTextFromDocx(file) {
  const buf = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(buf);
  const docXmlFile = zip.file('word/document.xml');
  if (!docXmlFile) throw new Error('docx 형식이 올바르지 않습니다.');
  const xml = await docXmlFile.async('text');

  // <w:p>...<w:t>텍스트</w:t>...</w:p> → paragraph별 텍스트 추출
  const paragraphs = [];
  const pRegex = /<w:p[^>]*>([\s\S]*?)<\/w:p>/g;
  let pm;
  while ((pm = pRegex.exec(xml)) !== null) {
    const pBody = pm[1];
    const tRegex = /<w:t[^>]*>([\s\S]*?)<\/w:t>/g;
    let tm, parts = [];
    while ((tm = tRegex.exec(pBody)) !== null) {
      parts.push(
        tm[1]
          .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"').replace(/&apos;/g, "'")
      );
    }
    const line = parts.join('').trim();
    if (line) paragraphs.push(line);
  }

  // 백업 데이터 영역 제거
  const startIdx = paragraphs.findIndex((p) => p.includes(MARK_START));
  const endIdx = paragraphs.findIndex((p) => p.includes(MARK_END));
  const cleaned = (startIdx >= 0 && endIdx >= 0)
    ? paragraphs.slice(0, startIdx).concat(paragraphs.slice(endIdx + 1))
    : paragraphs;

  return {
    fileName: file.name,
    extractedAt: new Date().toISOString(),
    text: cleaned.join('\n'),
    paragraphCount: cleaned.length,
  };
}

function safeName(s) {
  return (s || '').replace(/[^가-힣a-zA-Z0-9]/g, '_').slice(0, 20);
}

function timestampPart() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}`;
}

const NAVY = '0E2750';
const GOLD = 'C9A86A';
const STEEL = '6E7A8F';

function H1(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 36, color: NAVY })],
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
  });
}
function H2(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 28, color: NAVY })],
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 150 },
  });
}
function H3(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 24, color: GOLD })],
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 },
  });
}
function P(text, opts = {}) {
  return new Paragraph({
    children: [new TextRun({ text: String(text ?? ''), size: 22, color: opts.muted ? STEEL : NAVY })],
    spacing: { after: 80, line: 360 },
  });
}
function Sub(text) {
  return new Paragraph({
    children: [new TextRun({ text: String(text ?? ''), size: 18, color: STEEL, italics: true })],
    spacing: { after: 100 },
  });
}
function Spacer() {
  return new Paragraph({ children: [new TextRun({ text: '' })] });
}

function profileBlock(master) {
  return [
    H2('기본 정보'),
    P(`산업: ${master.profile.industry || '-'}`),
    P(`직무: ${master.profile.position || '-'}`),
    P(`회사: ${master.profile.company || '-'}`),
    Spacer(),
  ];
}

function workbookBlocks(master, workbookKey, includeHeading = true) {
  const meta = WORKBOOKS.find((w) => w.key === workbookKey);
  const title = meta?.title || workbookKey;
  const stepLabel = meta?.stepLabel || '';

  const blocks = [];
  if (includeHeading) blocks.push(H1(`${stepLabel} · ${title}`));

  // 슬라이스별 데이터
  if (workbookKey === 'experience') {
    if (master.experiences?.length > 0) {
      blocks.push(H2(`정리한 경험 (${master.experiences.length}개)`));
      master.experiences.forEach((e, idx) => {
        blocks.push(H3(`${idx + 1}. ${e.org || '미입력'} ${e.role ? '· ' + e.role : ''}`));
        if (e.category) blocks.push(P(`카테고리: ${e.category}`));
        if (e.period) blocks.push(P(`기간: ${e.period}`));
        if (e.summary) blocks.push(P(`요약: ${e.summary}`));
        if (e.motivation) blocks.push(P(`동기: ${e.motivation}`));
        blocks.push(Sub('STAR'));
        blocks.push(P(`상황: ${e.star_s || ''}`));
        blocks.push(P(`과제: ${e.star_t || ''}`));
        blocks.push(P(`행동: ${e.star_a || ''}`));
        blocks.push(P(`결과: ${e.star_r || ''}`));
        if (e.learning) blocks.push(P(`배운 점: ${e.learning}`));
        if (formatComps(e.job_comps)) blocks.push(P(`직무 역량: ${formatComps(e.job_comps)}`));
        if (formatComps(e.comm_comps)) blocks.push(P(`소통 역량: ${formatComps(e.comm_comps)}`));
        if (formatComps(e.att_comps)) blocks.push(P(`태도 역량: ${formatComps(e.att_comps)}`));
        blocks.push(Spacer());
      });
    } else {
      blocks.push(P('작성된 경험이 없습니다.', { muted: true }));
    }
  }

  if (workbookKey === 'career_roadmap') {
    const rm = master.roadmap;
    if (rm?.completedAt || Object.keys(rm?.scores || {}).length > 0) {
      blocks.push(H2('진단 결과'));
      if (rm.weakestStep != null) blocks.push(P(`가장 약한 STEP: ${rm.weakestStep}`));
      if (rm.scores) {
        Object.entries(rm.scores).forEach(([k, v]) => blocks.push(P(`${k}: ${v}`)));
      }
    }
  }

  if (workbookKey === 'careergoal') {
    const cg = master.careergoal;
    if (cg && (cg.year1 || cg.year3 || cg.year5)) {
      blocks.push(H2('커리어 목표'));
      if (cg.year1) blocks.push(P(`1년: ${cg.year1}`));
      if (cg.year3) blocks.push(P(`3년: ${cg.year3}`));
      if (cg.year5) blocks.push(P(`5년: ${cg.year5}`));
      if (cg.rationale) blocks.push(P(`근거: ${cg.rationale}`));
    }
  }

  if (workbookKey === 'job_analysis') {
    const ja = master.jobAnalysis;
    if (ja?.success_signals) {
      blocks.push(H2('직무 분석'));
      blocks.push(P(`성공 신호: ${ja.success_signals}`));
      if (ja.my_experience_pool) blocks.push(P(`내 경험 풀: ${ja.my_experience_pool}`));
      if (ja.connection_sentences) blocks.push(P(`연결 문장: ${ja.connection_sentences}`));
    }
  }

  // 모든 워크북 공통: outputs + workbookRaw
  const out = master.outputs?.[workbookKey];
  if (out?.finalText) {
    blocks.push(H2('완성본'));
    String(out.finalText).split('\n').forEach((line) => blocks.push(P(line || ' ')));
    blocks.push(Spacer());
  }

  const raw = master.workbookRaw?.[workbookKey];
  if (raw?.answers && Object.keys(raw.answers).length > 0) {
    blocks.push(H2('작성 답변'));
    const labels = QUESTION_LABELS[workbookKey] || {};
    Object.entries(raw.answers).forEach(([k, v]) => {
      if (v === undefined || v === null || v === '') return;
      // 클릭형 선택지는 코드값 대신 실제 선택 문구로 변환
      const decoded = decodeAnswer(workbookKey, k, v);
      if (!String(decoded).trim()) return;
      blocks.push(H3(labels[k] || k));
      String(decoded).split('\n').forEach((line) => blocks.push(P(line || ' ')));
    });
  }

  // 컨텐츠가 없으면 안내
  const hasContent = blocks.length > (includeHeading ? 1 : 0);
  if (!hasContent) {
    blocks.push(P('아직 작성된 내용이 없습니다.', { muted: true }));
  }

  return blocks;
}

// ─── 워크북 단일 .docx ────────────────────────────────────
export async function exportWorkbookDocx(master, workbookKey, workbookTitle) {
  const meta = WORKBOOKS.find((w) => w.key === workbookKey);
  const title = workbookTitle || meta?.title || workbookKey;

  // master.workbookRaw는 Bridge가 1.5초마다 동기화하므로, 방금 선택/입력한 내용이
  // 아직 반영 안 됐을 수 있다. 저장 시점에 해당 워크북의 legacy localStorage를 직접 읽어
  // 가장 최신 내용(예: 로드맵 ans)을 백업에 담는다.
  let freshRaw = null;
  try {
    const lk = LEGACY_KEYS[workbookKey];
    if (lk) { const v = localStorage.getItem(lk); if (v) freshRaw = JSON.parse(v); }
  } catch { freshRaw = null; }
  const raw = (freshRaw && Object.keys(freshRaw).length > 0)
    ? freshRaw
    : (master.workbookRaw?.[workbookKey] || null);

  const payload = {
    format: 'careerengineer-workbook-export',
    version: 1,
    appVersion: APP_VERSION,
    exportedAt: new Date().toISOString(),
    workbookKey,
    workbookTitle: title,
    data: {
      workbookKey,
      profile: master.profile,
      raw,
      output: master.outputs?.[workbookKey] || null,
      roadmap: workbookKey === 'career_roadmap' ? master.roadmap : undefined,
      careergoal: workbookKey === 'careergoal' ? master.careergoal : undefined,
      jobAnalysis: workbookKey === 'job_analysis' ? master.jobAnalysis : undefined,
      experiences: workbookKey === 'experience' ? master.experiences : undefined,
    },
  };

  const doc = new Document({
    creator: 'CareerEngineer',
    title: `${title} - CareerEngineer`,
    sections: [{
      properties: {},
      children: [
        ...buildCopyrightParagraphs({ Paragraph, TextRun }),
        new Paragraph({
          children: [new TextRun({ text: 'CAREER ENGINEER', size: 18, color: GOLD, bold: true })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [new TextRun({ text: title, size: 48, bold: true, color: NAVY })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        }),
        Sub(`내보낸 시각: ${new Date().toLocaleString('ko-KR')}`),
        ...profileBlock(master),
        ...workbookBlocks(master, workbookKey, false),
        ...backupBlocks(payload),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  const co = safeName(master.profile.company);
  const wb = safeName(title);
  const ts = timestampPart();
  const name = `careerengineer_${[wb, co].filter(Boolean).join('_')}_${ts}.docx`;
  saveAs(blob, name);
  return name;
}

// ─── 전체 .docx ──────────────────────────────────────────
// 단일 master의 docx 본문(프로필 + 워크북 섹션) — 전체 백업/전체 슬롯 백업 공용
function masterDocxSections(master, excludeExperiences) {
  const children = [...profileBlock(master)];
  for (const w of WORKBOOKS) {
    if (excludeExperiences && w.key === 'experience') continue;
    const dedicated = WORKBOOK_DOCX_BUILDERS[w.key];
    const blocks = dedicated
      ? [H1(`${w.stepLabel} · ${w.title}`), ...dedicated(master, DX, { includeMentoring: false })]
      : workbookBlocks(master, w.key, true);
    children.push(new Paragraph({ children: [new PageBreak()] }));
    children.push(...blocks);
  }
  return children;
}

// options.excludeExperiences = true 이면 경험 정리는 본문/임베드 JSON 모두 제외
//   → 별도 .xlsx와 짝으로 다운로드 후 두 파일로 import 가능
export async function buildFullDocxBlob(master, options = {}) {
  const { excludeExperiences = false } = options;

  // 임베드 JSON: 옵션에 따라 experiences 제외
  const dataPayload = excludeExperiences
    ? (() => {
        const { experiences, ...rest } = master;
        // workbookRaw.experience도 제외 (xlsx에서 복원)
        const wbRaw = { ...(rest.workbookRaw || {}) };
        delete wbRaw.experience;
        return { ...rest, experiences: [], workbookRaw: wbRaw };
      })()
    : master;

  const payload = {
    format: 'careerengineer-export',
    version: 1,
    appVersion: APP_VERSION,
    exportedAt: new Date().toISOString(),
    excludesExperiences: !!excludeExperiences,
    data: dataPayload,
  };

  const title = excludeExperiences
    ? '취업 준비 통합 백업 (경험 제외)'
    : '취업 준비 통합 백업';

  const liveUrl = (typeof window !== 'undefined' && window.location?.origin) || '';
  const children = [
    ...buildCopyrightParagraphs({ Paragraph, TextRun }),
    new Paragraph({
      children: [new TextRun({ text: 'CAREER ENGINEER', size: 22, color: GOLD, bold: true })],
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      children: [new TextRun({ text: title, size: 56, bold: true, color: NAVY })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
    }),
    Sub(`내보낸 시각: ${new Date().toLocaleString('ko-KR')}`),
    ...(liveUrl ? [
      new Paragraph({
        children: [new TextRun({ text: `작성 URL: ${liveUrl}`, size: 22, color: NAVY, bold: true })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 100 },
      }),
      new Paragraph({
        children: [new TextRun({ text: '이 문서를 위 URL에서 [기존 내용 불러오기]하면 작성 내용이 그대로 복원됩니다.', size: 18, color: GOLD, italics: true })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      }),
    ] : []),
    ...(excludeExperiences ? [Sub('경험 정리(STAR 카드)는 별도 .xlsx 파일에 포함됩니다.')] : []),
  ];

  children.push(...masterDocxSections(master, excludeExperiences));
  children.push(...backupBlocks(payload));

  const doc = new Document({
    creator: 'CareerEngineer',
    title: `CareerEngineer - ${title}`,
    sections: [{ properties: {}, children }],
  });

  const blob = await Packer.toBlob(doc);
  const co  = safeName(master.profile.company);
  const ind = safeName(master.profile.industry) || 'backup';
  const ts  = timestampPart();
  const tag = excludeExperiences ? '나머지' : '전체';
  const parts = [`careerengineer_${tag}`, co, ind].filter(Boolean);
  const name  = `${parts.join('_')}_${ts}.docx`;
  return { blob, name };
}

export async function exportFullDocx(master, options = {}) {
  const { blob, name } = await buildFullDocxBlob(master, options);
  saveAs(blob, name);
  return name;
}

// ─── 전체 백업을 단일 .zip으로 (.docx + .xlsx 한 파일) ──────
// 브라우저의 다중 다운로드 차단 없이 한 번에 안정적으로 저장된다.
// "가져오기 (.zip)"로 docx(전체)+xlsx(경험)를 함께 복원.
export async function exportFullBackupZip(master) {
  const { blob: docxBlob, name: docxName } = await buildFullDocxBlob(master, { excludeExperiences: true });
  // 경험정리 xlsx는 워크북 자체 저장과 동일한 "예쁜" 다중시트 빌더를 사용
  const { blob: xlsxBlob, name: xlsxName } = await experienceXlsxBlob(master);
  const zip = new JSZip();
  zip.file(docxName, docxBlob);
  zip.file(xlsxName, xlsxBlob);
  const co = safeName(master.profile.company);
  const ts = timestampPart();
  const zipName = `careerengineer_저장본_${co ? co + '_' : ''}${ts}.zip`;
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  saveAs(zipBlob, zipName);
  return { zipName, docxName, xlsxName };
}

// .zip 백업에서 docx(전체 백업 JSON)와 xlsx(경험 카드)를 추출
export async function extractBackupFromZip(file) {
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  let docxPayload = null;
  let experiences = null;
  for (const entry of Object.values(zip.files)) {
    if (entry.dir) continue;
    const n = entry.name.toLowerCase();
    if (n.endsWith('.docx')) {
      const b = await entry.async('blob');
      try { docxPayload = await extractBackupFromDocx(new File([b], entry.name)); } catch { /* 백업 없는 docx 무시 */ }
    } else if (n.endsWith('.xlsx')) {
      const b = await entry.async('blob');
      try { experiences = (await importExperiencesXlsx(new File([b], entry.name))).experiences; } catch { /* 무시 */ }
    }
  }
  return { docxPayload, experiences };
}

// ─── 전체 저장본(모든 회사 슬롯) 백업: 워드 1개 + 엑셀 1개를 .zip 한 파일로 ───
// 워드: 회사별 섹션으로 전부 정리 + 복원용 데이터 내장 / 엑셀: 전 회사 경험정리 표 + 복원용 시트
// 셋 중 무엇(.zip/.docx/.xlsx)을 올려도 모든 회사 저장본이 복원된다.
const ALLSLOTS_MARK = 'CE_ALLSLOTS_BACKUP';
const ALLSLOTS_FORMAT = 'careerengineer-all-slots';

function allSlotsPayload(slots) {
  return {
    format: ALLSLOTS_FORMAT,
    version: 1,
    exportedAt: new Date().toISOString(),
    slotCount: Object.keys(slots || {}).length,
    slots: slots || {},
  };
}

export async function buildAllSlotsDocxBlob(slots) {
  const entries = Object.entries(slots || {});
  const children = [
    ...buildCopyrightParagraphs({ Paragraph, TextRun }),
    new Paragraph({ children: [new TextRun({ text: 'CAREER ENGINEER', size: 22, color: GOLD, bold: true })], alignment: AlignmentType.CENTER }),
    new Paragraph({ children: [new TextRun({ text: '전체 저장본 백업 (모든 회사)', size: 56, bold: true, color: NAVY })], alignment: AlignmentType.CENTER, spacing: { after: 300 } }),
    Sub(`회사(저장본) ${entries.length}개 · 내보낸 시각: ${new Date().toLocaleString('ko-KR')}`),
    Sub('경험 정리(STAR 카드)는 함께 저장된 .xlsx 파일에 모든 회사가 정리돼 있습니다.'),
    Sub('이 파일(또는 함께 묶인 .zip)을 [저장본 백업 불러오기]에 올리면 모든 회사 저장본이 복원됩니다.'),
  ];
  for (const [name, v] of entries) {
    const m = (v && v.master) || {};
    children.push(new Paragraph({ children: [new PageBreak()] }));
    children.push(H1(`■ 저장본: ${name}`));
    children.push(...masterDocxSections(m, true));
  }
  children.push(...backupBlocks(allSlotsPayload(slots)));
  const doc = new Document({
    creator: 'CareerEngineer',
    title: 'CareerEngineer - 전체 저장본 백업',
    sections: [{ properties: {}, children }],
  });
  const blob = await Packer.toBlob(doc);
  return { blob, name: `careerengineer_전체저장본_${timestampPart()}.docx` };
}

function buildAllSlotsWb(slots) {
  const wb = XLSX.utils.book_new();
  const header = ['회사(저장본)', ...EXP_HEADER.map((k) => EXP_LABEL[k] || k)];
  const rows = [header];
  for (const [name, v] of Object.entries(slots || {})) {
    const exps = Array.isArray(v?.master?.experiences) ? v.master.experiences : [];
    for (const e of exps) {
      rows.push([name, ...EXP_HEADER.map((k) => {
        const val = e[k];
        return Array.isArray(val) ? val.join(', ') : (val ?? '');
      })]);
    }
  }
  if (rows.length === 1) rows.push(['(저장된 경험이 없습니다)']);
  const ws = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, '경험정리(전회사)');
  // 복원용 숨은 시트
  const b64 = utf8ToBase64(JSON.stringify(allSlotsPayload(slots)));
  const chunks = chunkString(b64, 32000).map((c) => [c]);
  const bws = XLSX.utils.aoa_to_sheet([[ALLSLOTS_MARK], ...chunks]);
  XLSX.utils.book_append_sheet(wb, bws, '_CE_BACKUP');
  const idx = wb.SheetNames.indexOf('_CE_BACKUP');
  wb.Workbook = { Sheets: wb.SheetNames.map((_, i) => ({ Hidden: i === idx ? 1 : 0 })) };
  return wb;
}

export function buildAllSlotsXlsxBlob(slots) {
  const wb = buildAllSlotsWb(slots);
  const arr = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([arr], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  return { blob, name: `careerengineer_전체경험정리_${timestampPart()}.xlsx` };
}

export async function exportAllSlotsZip(slots) {
  if (!slots || Object.keys(slots).length === 0) throw new Error('백업할 저장본이 없습니다.');
  const { blob: docxBlob, name: docxName } = await buildAllSlotsDocxBlob(slots);
  const { blob: xlsxBlob, name: xlsxName } = buildAllSlotsXlsxBlob(slots);
  const zip = new JSZip();
  zip.file(docxName, docxBlob);
  zip.file(xlsxName, xlsxBlob);
  const zipName = `careerengineer_전체저장본_${timestampPart()}.zip`;
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  saveAs(zipBlob, zipName);
  return { zipName, docxName, xlsxName, count: Object.keys(slots).length };
}

function slotsFromXlsxWb(wb) {
  if (!wb.SheetNames.includes('_CE_BACKUP')) return null;
  try {
    const aoa = XLSX.utils.sheet_to_json(wb.Sheets['_CE_BACKUP'], { header: 1 });
    if (!(aoa[0] && String(aoa[0][0]).includes(ALLSLOTS_MARK))) return null;
    const b64 = aoa.slice(1).map((r) => (r && r[0]) || '').join('');
    const parsed = JSON.parse(base64ToUtf8(b64));
    return parsed.format === ALLSLOTS_FORMAT ? parsed.slots : null;
  } catch { return null; }
}

// .zip/.docx/.xlsx/.json 중 무엇이든 전체 슬롯 백업이면 slots 객체를, 아니면 null 반환
export async function extractAllSlots(file) {
  const lower = file.name.toLowerCase();
  if (lower.endsWith('.json')) {
    try {
      const parsed = JSON.parse(await file.text());
      return parsed.format === ALLSLOTS_FORMAT ? parsed.slots : null;
    } catch { return null; }
  }
  if (lower.endsWith('.docx')) {
    try {
      const payload = await extractBackupFromDocx(file);
      return payload.format === ALLSLOTS_FORMAT ? payload.slots : null;
    } catch { return null; }
  }
  if (lower.endsWith('.xlsx')) {
    try {
      const wb = XLSX.read(new Uint8Array(await file.arrayBuffer()), { type: 'array' });
      return slotsFromXlsxWb(wb);
    } catch { return null; }
  }
  if (lower.endsWith('.zip')) {
    const zip = await JSZip.loadAsync(await file.arrayBuffer());
    for (const entry of Object.values(zip.files)) {
      if (entry.dir || !entry.name.toLowerCase().endsWith('.docx')) continue;
      try {
        const p = await extractBackupFromDocx(new File([await entry.async('blob')], entry.name));
        if (p.format === ALLSLOTS_FORMAT) return p.slots;
      } catch { /* 계속 */ }
    }
    for (const entry of Object.values(zip.files)) {
      if (entry.dir || !entry.name.toLowerCase().endsWith('.xlsx')) continue;
      try {
        const wb = XLSX.read(await entry.async('uint8array'), { type: 'array' });
        const s = slotsFromXlsxWb(wb);
        if (s) return s;
      } catch { /* 계속 */ }
    }
  }
  return null;
}

// ─── experience 전용 .xlsx export ─────────────────────────
const EXP_HEADER = [
  'id', 'category', 'period', 'org', 'role',
  'summary', 'motivation',
  'star_s', 'star_t', 'star_a', 'star_r',
  'difficulty',
  'learning',
  'job_comps', 'comm_comps', 'att_comps',
  'jd_match', 'usedIn',
];
const EXP_LABEL = {
  id: 'ID', category: '카테고리', period: '기간', org: '소속', role: '역할',
  summary: '요약', motivation: '동기',
  star_s: 'STAR 상황', star_t: 'STAR 과제', star_a: 'STAR 행동', star_r: 'STAR 결과',
  difficulty: '객관적 어려움',
  learning: '배운 점',
  job_comps: '직무 역량', comm_comps: '소통 역량', att_comps: '태도 역량',
  jd_match: 'JD 매칭', usedIn: '사용처',
};

function buildExperiencesWb(master) {
  const exps = master.experiences || [];
  const wb = XLSX.utils.book_new();

  // [시트 1] 경험 정리 — 경험별 카드형 블록 (한눈에 읽기 좋게)
  const aoa = [];
  const merges = [];
  const pushTitle = (text) => {
    const r = aoa.length;
    aoa.push([text, '']);
    merges.push({ s: { r, c: 0 }, e: { r, c: 1 } });
  };
  pushTitle('CareerEngineer · 경험 정리');
  pushTitle(`${[master.profile.industry, master.profile.position, master.profile.company].filter(Boolean).join(' / ') || '프로필 미입력'}`);
  pushTitle(`총 ${exps.length}개 경험 · 내보낸 시각 ${new Date().toLocaleString('ko-KR')}`);
  aoa.push([]);

  if (exps.length === 0) {
    aoa.push(['아직 작성된 경험이 없습니다. 경험 정리 워크북에서 경험 카드를 추가해 보세요.']);
  }
  exps.forEach((e, i) => {
    pushTitle(`■ 경험 ${i + 1}.  ${(e.org || e.category || '경험')}${e.role ? '  ·  ' + e.role : ''}`);
    const row = (label, val) => { if (val != null && String(val).trim()) aoa.push([label, String(val)]); };
    row('카테고리', e.category);
    row('기간', e.period);
    row('요약', e.summary);
    row('지원 동기', e.motivation);
    if (e.star_s || e.star_t || e.star_a || e.star_r) aoa.push(['── STAR ──', '']);
    row('상황 (S)', e.star_s);
    row('과제 (T)', e.star_t);
    row('행동 (A)', e.star_a);
    row('결과 (R)', e.star_r);
    row('어려웠던 점', e.difficulty);
    row('배운 점', e.learning);
    row('직무 역량', formatComps(e.job_comps));
    row('소통 역량', formatComps(e.comm_comps));
    row('태도 역량', formatComps(e.att_comps));
    row('직무상세내용 매칭', e.jd_match);
    aoa.push([]); // 경험 사이 빈 줄
  });
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  ws['!cols'] = [{ wch: 18 }, { wch: 95 }];
  if (merges.length) ws['!merges'] = merges;
  XLSX.utils.book_append_sheet(wb, ws, '경험 정리');

  // [시트 2] 메타 (저작권 + 프로필)
  const meta = [
    ['저작권 안내', COPYRIGHT_TEXT],
    ['', ''],
    ['프로필 산업', master.profile.industry || ''],
    ['프로필 직무', master.profile.position || ''],
    ['프로필 회사', master.profile.company || ''],
    ['총 경험', exps.length],
    ['내보낸 시각', new Date().toLocaleString('ko-KR')],
    ['포맷', 'careerengineer-experience-xlsx-v1'],
  ];
  const metaWs = XLSX.utils.aoa_to_sheet(meta);
  metaWs['!cols'] = [{ wch: 14 }, { wch: 110 }];
  XLSX.utils.book_append_sheet(wb, metaWs, '메타');

  // [시트 3] _CE_BACKUP (숨김) — 이 파일을 그대로 다시 가져오면 경험이 완전 복원됨
  try {
    const b64 = utf8ToBase64(JSON.stringify({ format: 'careerengineer-experience-xlsx', version: 1, experiences: exps }));
    const CH = 30000;
    const brows = [['CE_EXPERIENCE_BACKUP']];
    for (let i = 0; i < b64.length; i += CH) brows.push([b64.slice(i, i + CH)]);
    const bws = XLSX.utils.aoa_to_sheet(brows);
    XLSX.utils.book_append_sheet(wb, bws, '_CE_BACKUP');
    const bi = wb.SheetNames.indexOf('_CE_BACKUP');
    if (bi >= 0) { wb.Workbook = wb.Workbook || {}; wb.Workbook.Sheets = wb.Workbook.Sheets || []; wb.Workbook.Sheets[bi] = { Hidden: 1 }; }
  } catch (err) { console.warn('[xlsx] backup sheet skipped:', err); }

  return wb;
}

function experiencesXlsxName(master) {
  const co = safeName(master.profile.company);
  const ts = timestampPart();
  return `careerengineer_경험정리_${co ? co + '_' : ''}${ts}.xlsx`;
}

export function exportExperiencesXlsx(master) {
  const wb = buildExperiencesWb(master);
  const name = experiencesXlsxName(master);
  XLSX.writeFile(wb, name);
  return name;
}

export function buildExperiencesXlsxBlob(master) {
  const wb = buildExperiencesWb(master);
  const arr = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([arr], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  return { blob, name: experiencesXlsxName(master) };
}

// ─── experience 전용 .xlsx import ─────────────────────────
export function importExperiencesXlsx(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'array' });

        // 1순위: 숨은 백업 시트(_CE_BACKUP)에서 전체 경험 복원 (예쁜 다중시트 파일도 완전 복원)
        if (wb.SheetNames.includes('_CE_BACKUP')) {
          try {
            const aoa = XLSX.utils.sheet_to_json(wb.Sheets['_CE_BACKUP'], { header: 1 });
            if (aoa[0] && String(aoa[0][0]).includes('CE_EXPERIENCE_BACKUP')) {
              const b64 = aoa.slice(1).map((r) => (r && r[0]) || '').join('');
              const parsed = JSON.parse(base64ToUtf8(b64));
              if (Array.isArray(parsed.experiences)) { resolve({ experiences: parsed.experiences }); return; }
            }
          } catch (be) { console.warn('백업 시트 복원 실패, 표 파싱으로 폴백:', be); }
        }

        const sheetName = wb.SheetNames.find((n) => n === '경험 카드') || wb.SheetNames[0];
        const ws = wb.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(ws, { defval: '' });

        // 한글 라벨 → 영문 키 역매핑
        const REVERSE = Object.fromEntries(Object.entries(EXP_LABEL).map(([k, v]) => [v, k]));
        const experiences = json
          .filter((row) => Object.values(row).some((v) => v !== '' && v != null))
          .map((row, idx) => {
            const out = {};
            for (const [label, value] of Object.entries(row)) {
              const k = REVERSE[label] || label;
              if (k === 'job_comps' || k === 'comm_comps' || k === 'att_comps') {
                out[k] = String(value || '').split(',').map((s) => s.trim()).filter(Boolean);
              } else {
                out[k] = value;
              }
            }
            if (!out.id) out.id = `exp_${Date.now()}_${idx}`;
            return out;
          });

        resolve({ experiences });
      } catch (err) {
        reject(new Error('xlsx 파싱 실패: ' + err.message));
      }
    };
    reader.onerror = () => reject(new Error('파일을 읽을 수 없습니다.'));
    reader.readAsArrayBuffer(file);
  });
}
