import { COLORS, FONT } from '../design/tokens.js';

// 모든 워크북 공통 "가이드 보기 / 작성 예시 보기" 토글 버튼 (모양 통일).
// label에 종류만 넘기면(예: '가이드', '작성 예시') 열림/닫힘 문구를 일관되게 표시한다.
export function ToggleLink({ open, onToggle, label = '작성 예시', style }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        background: 'none', border: 'none', padding: 0, cursor: 'pointer',
        color: COLORS.accent2, fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold,
        fontFamily: 'inherit', whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {open ? '숨기기 ▲' : `${label} 보기 ▼`}
    </button>
  );
}
