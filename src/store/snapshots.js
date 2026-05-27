// 클라이언트 전용 자동 백업(롤링 스냅샷).
// 작성 내용(master) 전체를 localStorage에 시점별로 최근 N개 보관한다.
// 실수로 전체삭제/초기화하거나 데이터가 깨져도 이전 시점으로 되돌릴 수 있다. (백엔드 없음)

export const SNAPSHOTS_KEY = 'careerengineer_snapshots_v1';
export const MAX_SNAPSHOTS = 10;

export function loadSnapshots() {
  try {
    const arr = JSON.parse(localStorage.getItem(SNAPSHOTS_KEY) || '[]');
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

// 배열(최신순)을 저장. 용량 초과(QuotaExceededError) 시 가장 오래된 것부터 버리고 재시도.
function writeSnapshots(list) {
  let arr = list.slice(0, MAX_SNAPSHOTS);
  while (arr.length > 0) {
    try {
      localStorage.setItem(SNAPSHOTS_KEY, JSON.stringify(arr));
      return arr;
    } catch {
      arr = arr.slice(0, arr.length - 1); // 최신순이므로 끝(가장 오래된 것) 제거
    }
  }
  try { localStorage.removeItem(SNAPSHOTS_KEY); } catch { /* noop */ }
  return [];
}

// 중복 적재 방지용 싸구려 서명 (내용 길이 + updatedAt)
function signature(master) {
  try {
    return JSON.stringify(master).length + '|' + (master?.updatedAt || '');
  } catch {
    return 'sig_' + Date.now();
  }
}

// 의미 있는 내용이 있는지 (빈/기본 상태는 스냅샷하지 않음)
export function hasContent(master) {
  if (!master || typeof master !== 'object') return false;
  const p = master.profile || {};
  if (p.industry || p.position || p.company || p.userName) return true;
  if (Array.isArray(master.experiences) && master.experiences.length > 0) return true;
  const raws = master.workbookRaw || {};
  for (const k of Object.keys(raws)) {
    const d = raws[k];
    if (d && typeof d === 'object' && Object.keys(d).some((x) => x !== 'basicInfo' && x !== 'savedAt')) return true;
  }
  const outs = master.outputs || {};
  for (const k of Object.keys(outs)) {
    if (outs[k] && String(outs[k].finalText || '').trim()) return true;
  }
  return false;
}

// 작성 요약 (복구 UI 표시용)
function summarize(master) {
  const p = master?.profile || {};
  let filled = 0;
  const raws = master?.workbookRaw || {};
  for (const k of Object.keys(raws)) {
    const d = raws[k];
    if (d && typeof d === 'object' && Object.keys(d).some((x) => x !== 'basicInfo' && x !== 'savedAt')) filled++;
  }
  return {
    company: p.company || '',
    position: p.position || '',
    workbooks: filled,
    experiences: Array.isArray(master?.experiences) ? master.experiences.length : 0,
  };
}

// 스냅샷 적재 (직전과 내용이 같으면 스킵). { list, added } 반환.
export function pushSnapshot(master) {
  const list = loadSnapshots();
  if (!hasContent(master)) return { list, added: false };
  const sig = signature(master);
  if (list[0] && list[0].sig === sig) return { list, added: false };
  const snap = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    at: new Date().toISOString(),
    sig,
    summary: summarize(master),
    master,
  };
  const saved = writeSnapshots([snap, ...list]);
  return { list: saved, added: saved[0] === snap };
}

export function deleteSnapshot(id) {
  const list = loadSnapshots().filter((s) => s.id !== id);
  return writeSnapshots(list);
}

export function clearSnapshots() {
  try { localStorage.removeItem(SNAPSHOTS_KEY); } catch { /* noop */ }
}
