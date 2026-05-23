// CareerEngineer Logo (Logo Guide v1.0 · 2026 기반)
// - 마크: 683×620 그리드, 다이아몬드 C 프레임 + 3 horizontal bars
// - 워드마크: "Career" Heritage Navy + "Engineer" Signal Gold (Pretendard 700, -0.028em)
// - 같은 굵기, 색만 다름. ".(점)" 안 씀.

import { COLORS } from '../design/tokens.js';

const NAVY_LIGHT = COLORS.accent;        // #0E2750
const PAPER      = COLORS.cream;         // #F2F1EC
const GOLD       = COLORS.accent2;       // #C9A86A
const GOLD_DEEP  = COLORS.goldDeep;      // #A8853F (Engineer on light)

// 마크 path (Logo Guide §02 정확한 정수 좌표)
const MARK_PATH = 'M 0 310 L 310 0 L 408 98 L 408 166 L 310 68 L 68 310 L 310 552 L 408 454 L 408 522 L 310 620 Z';

export function CEMark({ size = 40, variant = 'light', ariaLabel = 'CareerEngineer' }) {
  const navyFill = variant === 'dark' ? PAPER : NAVY_LIGHT;
  return (
    <svg
      width={size}
      height={size * (620 / 683)}
      viewBox="0 0 683 620"
      shapeRendering="geometricPrecision"
      role="img"
      aria-label={ariaLabel}
      style={{ display: 'block', flexShrink: 0 }}
    >
      <path d={MARK_PATH} fill={navyFill} />
      <rect x="203" y="195" width="352" height="46" fill={navyFill} />
      <rect x="283" y="288" width="350" height="43" fill={GOLD} />
      <rect x="331" y="389" width="352" height="46" fill={navyFill} />
    </svg>
  );
}

// 워드마크 컴포넌트
// "Career" = textColor, "Engineer" = 항상 Gold (light: Gold Deep, dark: Signal Gold)
export function CEWordmark({ size = 30, variant = 'light', as: Tag = 'span' }) {
  const careerColor = variant === 'dark' ? PAPER : NAVY_LIGHT;
  const engineerColor = variant === 'dark' ? GOLD : GOLD_DEEP;
  return (
    <Tag style={{
      fontFamily: '"Pretendard Variable","Pretendard","Noto Sans KR",system-ui,sans-serif',
      fontSize: size,
      fontWeight: 700,
      letterSpacing: '-0.028em',
      lineHeight: 1,
      whiteSpace: 'nowrap',
      color: careerColor,
    }}>
      Career<span style={{ color: engineerColor }}>Engineer</span>
    </Tag>
  );
}

// A · HORIZONTAL Lockup (기본 락업)
// 마크 높이 ≈ 워드마크 cap-height × 1.5
// gap = 마크 너비 × 0.24
export function CELockupA({ markSize = 32, variant = 'light' }) {
  // 마크 viewBox 683×620 → 너비/높이 비율 1.10:1
  // markSize는 높이 기준. 너비 = markSize * (683/620)
  const markWidth = markSize * (683 / 620);
  const gap = Math.round(markWidth * 0.24);
  // 워드마크 cap-height ≈ font-size * 0.7. 마크 높이 = cap × 1.5 → 워드마크 fontSize = markSize / (0.7 * 1.5) ≈ markSize / 1.05
  const wordSize = Math.round(markSize / 1.05);
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap }}>
      <CEMark size={markSize} variant={variant} />
      <CEWordmark size={wordSize} variant={variant} />
    </div>
  );
}

// B · STACKED Lockup (좁은 정사각 영역)
export function CELockupB({ markSize = 48, variant = 'light' }) {
  const wordSize = Math.round(markSize * 0.45);
  const gap = Math.round(markSize * 0.24);
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap }}>
      <CEMark size={markSize} variant={variant} />
      <CEWordmark size={wordSize} variant={variant} />
    </div>
  );
}
