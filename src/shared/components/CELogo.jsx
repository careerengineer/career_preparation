// CE 마크 (브랜드 가이드 §02 GEOMETRIC ANATOMY 기반 단순화 SVG)
// - 다이아몬드형 C가 E의 세 막대를 감싸는 형태
// - 좌표계 683×620 (원본) → viewBox로 비례 유지
// - 바 1 (상단): Navy, w 352/h 46, x 203, y 195
// - 바 2 (중앙): Gold, w 350/h 43, x 283, y 288
// - 바 3 (하단): Navy, w 352/h 46, x 331, y 389
// - 사이드 C: 좌측 꼭짓점 + 상단 꼭짓점 + 우측 블런트(열림)

import { COLORS } from '../design/tokens.js';

export function CEMark({ size = 40, navy = COLORS.accent, gold = COLORS.accent2, ariaLabel = 'CareerEngineer' }) {
  return (
    <svg
      width={size}
      height={size * (620 / 683)}
      viewBox="0 0 683 620"
      role="img"
      aria-label={ariaLabel}
      style={{ display: 'block', flexShrink: 0 }}
    >
      {/* C 마크 - 다이아몬드형 (좌측·상단 꼭짓점, 우측 블런트 열림) */}
      <path
        d="M 30 310 L 341 12 L 652 200 L 652 250 L 341 62 L 80 310 L 341 558 L 652 370 L 652 420 L 341 608 L 30 310 Z"
        fill={navy}
      />
      {/* 바 1 (상단 Navy) */}
      <rect x="203" y="195" width="352" height="46" fill={navy} />
      {/* 바 2 (중앙 Gold) */}
      <rect x="283" y="288" width="350" height="43" fill={gold} />
      {/* 바 3 (하단 Navy) */}
      <rect x="331" y="389" width="352" height="46" fill={navy} />
    </svg>
  );
}

// 가로 락업 (A · HORIZONTAL · LIGHT)
// 심볼 + 워드마크 (Pretendard 700, 자간 -2.8%, 단일 단어)
// 간격: 심볼 높이의 0.24배
export function CELockupA({ size = 32, color = COLORS.accent, gold = COLORS.accent2 }) {
  const gap = Math.round(size * 0.24);
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap,
      fontFamily: '"Pretendard","Noto Sans KR",system-ui,sans-serif',
    }}>
      <CEMark size={size} navy={color} gold={gold} />
      <span style={{
        fontSize: Math.round(size * 0.7),
        fontWeight: 700,
        letterSpacing: '-0.028em',
        color,
        lineHeight: 1,
        whiteSpace: 'nowrap',
      }}>
        CareerEngineer<span style={{ color: gold }}>.</span>
      </span>
    </div>
  );
}
