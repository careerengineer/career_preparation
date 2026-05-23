import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { WORKBOOKS } from './schema.js';

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
        if (e.job_comps) blocks.push(P(`직무 역량: ${Array.isArray(e.job_comps) ? e.job_comps.join(', ') : e.job_comps}`));
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
    blocks.push(H2('답변 정리'));
    Object.entries(raw.answers).forEach(([k, v]) => {
      if (!v || !String(v).trim()) return;
      blocks.push(H3(k));
      String(v).split('\n').forEach((line) => blocks.push(P(line || ' ')));
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

  const doc = new Document({
    creator: 'CareerEngineer',
    title: `${title} - CareerEngineer`,
    sections: [{
      properties: {},
      children: [
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
export async function exportFullDocx(master) {
  const children = [
    new Paragraph({
      children: [new TextRun({ text: 'CAREER ENGINEER', size: 22, color: GOLD, bold: true })],
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      children: [new TextRun({ text: '취업 준비 통합 백업', size: 56, bold: true, color: NAVY })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
    }),
    Sub(`내보낸 시각: ${new Date().toLocaleString('ko-KR')}`),
    ...profileBlock(master),
  ];

  for (const w of WORKBOOKS) {
    children.push(...workbookBlocks(master, w.key, true));
  }

  const doc = new Document({
    creator: 'CareerEngineer',
    title: 'CareerEngineer - 전체 백업',
    sections: [{ properties: {}, children }],
  });

  const blob = await Packer.toBlob(doc);
  const co  = safeName(master.profile.company);
  const ind = safeName(master.profile.industry) || 'backup';
  const ts  = timestampPart();
  const parts = ['careerengineer_전체', co, ind].filter(Boolean);
  const name  = `${parts.join('_')}_${ts}.docx`;
  saveAs(blob, name);
  return name;
}

// ─── experience 전용 .xlsx export ─────────────────────────
const EXP_HEADER = [
  'id', 'category', 'period', 'org', 'role',
  'summary', 'motivation',
  'star_s', 'star_t', 'star_a', 'star_r',
  'learning',
  'job_comps', 'comm_comps', 'att_comps',
  'jd_match', 'usedIn',
];
const EXP_LABEL = {
  id: 'ID', category: '카테고리', period: '기간', org: '소속', role: '역할',
  summary: '요약', motivation: '동기',
  star_s: 'STAR 상황', star_t: 'STAR 과제', star_a: 'STAR 행동', star_r: 'STAR 결과',
  learning: '배운 점',
  job_comps: '직무 역량', comm_comps: '소통 역량', att_comps: '태도 역량',
  jd_match: 'JD 매칭', usedIn: '사용처',
};

export function exportExperiencesXlsx(master) {
  const rows = (master.experiences || []).map((e) => {
    const r = {};
    EXP_HEADER.forEach((k) => {
      const v = e[k];
      r[EXP_LABEL[k]] = Array.isArray(v) ? v.join(', ') : (v ?? '');
    });
    return r;
  });
  if (rows.length === 0) rows.push(EXP_HEADER.reduce((acc, k) => ({ ...acc, [EXP_LABEL[k]]: '' }), {}));

  const ws = XLSX.utils.json_to_sheet(rows, { header: EXP_HEADER.map((k) => EXP_LABEL[k]) });
  ws['!cols'] = EXP_HEADER.map((k) => ({ wch: k === 'id' ? 14 : 24 }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '경험 카드');

  // 메타 시트
  const meta = [
    ['프로필 산업', master.profile.industry || ''],
    ['프로필 직무', master.profile.position || ''],
    ['프로필 회사', master.profile.company || ''],
    ['총 경험 카드', (master.experiences || []).length],
    ['내보낸 시각', new Date().toLocaleString('ko-KR')],
    ['포맷', 'careerengineer-experience-xlsx-v1'],
  ];
  const metaWs = XLSX.utils.aoa_to_sheet(meta);
  XLSX.utils.book_append_sheet(wb, metaWs, '메타');

  const co = safeName(master.profile.company);
  const ts = timestampPart();
  const name = `careerengineer_경험정리_${co ? co + '_' : ''}${ts}.xlsx`;
  XLSX.writeFile(wb, name);
  return name;
}

// ─── experience 전용 .xlsx import ─────────────────────────
export function importExperiencesXlsx(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'array' });
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
