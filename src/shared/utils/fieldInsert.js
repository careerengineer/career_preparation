// 마지막으로 포커스된 입력칸(textarea/input)을 추적해, 참고 내용을 그 칸에 바로 삽입.
// 워크북마다 답변 state가 달라도, React controlled input의 native setter + input 이벤트로
// onChange를 발화시켜 상태가 갱신되고 자동 저장(word/excel)에도 반영된다.

let lastField = null;

function isEditable(el) {
  if (!el) return false;
  if (el.readOnly || el.disabled) return false; // 미리보기(readOnly) textarea 등은 제외
  if (el.tagName === 'TEXTAREA') return true;
  if (el.tagName === 'INPUT') {
    const t = (el.type || 'text').toLowerCase();
    return ['text', 'search', 'url', 'tel', 'email', ''].includes(t);
  }
  return false;
}

if (typeof document !== 'undefined') {
  // 캡처 단계에서 마지막 입력칸 기록 (칩 버튼 클릭으로 포커스가 옮겨가도 직전 칸을 유지)
  document.addEventListener('focusin', (e) => {
    if (isEditable(e.target)) lastField = e.target;
  }, true);
}

// 직전에 포커스됐던 입력칸에 text 삽입. 성공하면 true.
export function insertIntoFocusedField(text) {
  const el = lastField;
  const insert = String(text || '').trim();
  if (!el || !el.isConnected || !isEditable(el) || !insert) return false;

  const val = el.value ?? '';
  let start = el.selectionStart;
  let end = el.selectionEnd;
  if (start == null) start = val.length;
  if (end == null) end = val.length;

  // 커서가 맨 끝이고 기존 내용이 있으면 줄바꿈 후 이어붙임
  const needsNL = start === val.length && val && !val.endsWith('\n');
  const piece = (needsNL ? '\n' : '') + insert;
  const next = val.slice(0, start) + piece + val.slice(end);

  const proto = el.tagName === 'TEXTAREA'
    ? window.HTMLTextAreaElement.prototype
    : window.HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
  if (!setter) return false;
  setter.call(el, next);
  el.dispatchEvent(new Event('input', { bubbles: true }));

  const pos = start + piece.length;
  try { el.focus(); el.setSelectionRange(pos, pos); } catch { /* noop */ }
  return true;
}
