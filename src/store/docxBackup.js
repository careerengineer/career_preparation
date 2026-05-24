// 워크북 "결과물 docx"에 복원용 백업(base64 JSON)을 끼워 넣는 공용 헬퍼.
// docExport.js의 extractBackupFromDocx와 동일한 마커/포맷을 사용해 재import 가능하게 한다.
export const MARK_START = 'CE_BACKUP_BEGIN';
export const MARK_END = 'CE_BACKUP_END';

export function utf8ToBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function chunkString(str, n) {
  const out = [];
  for (let i = 0; i < str.length; i += n) out.push(str.slice(i, i + n));
  return out;
}

// DocxLib: 워크북이 로드한 docx 라이브러리(window.docx 또는 import). Paragraph/TextRun(필수), PageBreak(선택).
// payload: { format:'careerengineer-workbook-export', workbookKey, workbookTitle, data:{ workbookKey, raw, ... } }
export function buildWorkbookBackupParagraphs(DocxLib, payload) {
  const { Paragraph, TextRun, PageBreak } = DocxLib || {};
  if (!Paragraph || !TextRun) return [];
  const b64 = utf8ToBase64(JSON.stringify(payload));
  const chunks = chunkString(b64, 3000);
  const muted = (text, opts = {}) => new Paragraph({
    children: [new TextRun({ text, size: 12, color: 'BDBDBD', ...opts })],
    spacing: { after: 20 },
  });
  const lead = PageBreak
    ? new Paragraph({ children: [new PageBreak()] })
    : new Paragraph({ children: [new TextRun({ text: '', size: 12 })], spacing: { before: 400 } });
  return [
    lead,
    muted('— CareerEngineer 백업 데이터 (자동 생성, 수정·삭제 시 다시 불러오기 불가) —', { bold: true }),
    muted(MARK_START),
    ...chunks.map((c) => muted(c)),
    muted(MARK_END),
  ];
}

// 워크북 백업 payload 생성 — 상단 "저장"(exportWorkbookDocx)과 동일 구조로 맞춤.
// raw(워크북 원본) + master의 구조화 슬라이스(profile/output/roadmap/careergoal/jobAnalysis/experiences)까지 담아
// 상단·하단 저장의 복원 결과가 완전히 같아지도록 한다. (모두 localStorage 읽기 전용)
const MASTER_KEY = 'careerengineer_master_v1';
export function buildWorkbookPayload(workbookKey, workbookTitle, legacyKey) {
  let raw = {};
  let master = {};
  try { raw = JSON.parse(localStorage.getItem(legacyKey) || '{}'); } catch { raw = {}; }
  try { master = JSON.parse(localStorage.getItem(MASTER_KEY) || '{}'); } catch { master = {}; }
  return {
    format: 'careerengineer-workbook-export',
    version: 1,
    exportedAt: new Date().toISOString(),
    workbookKey,
    workbookTitle: workbookTitle || workbookKey,
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
}
