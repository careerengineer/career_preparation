import { useState } from 'react';
import { COLORS, FONT, SPACING, RADIUS } from '../design/tokens.js';
import { ToggleLink } from './ToggleLink.jsx';

// 질문 옆 "작성 예시 보기" 토글 — 모든 워크북 공통 ToggleLink 모양 사용.
// text에 예시(보통 placeholder의 "예: ..." 문구)를 넘기면 펼쳐 보여준다.
export function ExampleToggle({ text, label = '작성 예시' }) {
  const [open, setOpen] = useState(false);
  if (!text || !String(text).trim()) return null;
  return (
    <div style={{ marginBottom: SPACING.sm }}>
      <ToggleLink open={open} onToggle={() => setOpen((o) => !o)} label={label} />
      {open && (
        <p style={{ margin: '6px 0 0', padding: SPACING.sm, background: COLORS.yellowBg, borderLeft: `3px solid ${COLORS.yellow}`, borderRadius: RADIUS.base, fontSize: FONT.size.sm, color: COLORS.accent, lineHeight: FONT.lineHeight.base, whiteSpace: 'pre-wrap' }}>
          {String(text).replace(/^예:\s*/, '')}
        </p>
      )}
    </div>
  );
}
