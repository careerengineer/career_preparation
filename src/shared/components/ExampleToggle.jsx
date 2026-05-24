import { useState } from 'react';
import { COLORS, FONT, SPACING, RADIUS } from '../design/tokens.js';

// 질문 옆 "작성 예시 보기" 토글 — 직무분석과 동일한 형태로 통일.
// text에 예시(보통 placeholder의 "예: ..." 문구)를 넘기면 펼쳐 보여준다.
export function ExampleToggle({ text, label = '작성 예시 보기' }) {
  const [open, setOpen] = useState(false);
  if (!text || !String(text).trim()) return null;
  return (
    <div style={{ marginBottom: SPACING.sm }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: COLORS.accent2, fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, fontFamily: 'inherit' }}
      >
        {open ? '예시 숨기기 ▲' : `${label} ▼`}
      </button>
      {open && (
        <p style={{ margin: '6px 0 0', padding: SPACING.sm, background: COLORS.yellowBg, borderLeft: `3px solid ${COLORS.yellow}`, borderRadius: RADIUS.base, fontSize: FONT.size.sm, color: COLORS.accent, lineHeight: FONT.lineHeight.base, whiteSpace: 'pre-wrap' }}>
          {String(text).replace(/^예:\s*/, '')}
        </p>
      )}
    </div>
  );
}
