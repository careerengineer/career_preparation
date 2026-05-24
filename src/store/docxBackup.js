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

// 워크북 legacy localStorage 원본을 raw로 담은 단일-워크북 백업 payload 생성
export function buildWorkbookPayload(workbookKey, workbookTitle, legacyKey) {
  let raw = {};
  try { raw = JSON.parse(localStorage.getItem(legacyKey) || '{}'); } catch { raw = {}; }
  return {
    format: 'careerengineer-workbook-export',
    version: 1,
    exportedAt: new Date().toISOString(),
    workbookKey,
    workbookTitle: workbookTitle || workbookKey,
    data: { workbookKey, raw },
  };
}
