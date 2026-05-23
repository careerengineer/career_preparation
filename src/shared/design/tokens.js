// CareerEngineer Brand Tokens v1.0
// 참조: CareerEngineer Brand Guidelines (2026, INTERNAL)
// 60-30-10 룰: Cream 60% (베이스) · Navy 30% (구조/텍스트) · Gold 10% (강조)

export const COLORS = {
  // ── PRIMARY ────────────────────────────────────
  accent: '#0E2750',     // Heritage Navy (Primary · Ink)
  accent2: '#C9A86A',    // Signal Gold (Accent)
  ink: '#0E2750',        // 텍스트 기본
  inkDeep: '#0A1A33',    // 진한 텍스트
  sub: '#6E7A8F',        // Steel (메타/뮤트)
  // ── SURFACE ────────────────────────────────────
  white: '#FFFFFF',
  bg: '#FBFAF6',         // Paper
  bgAlt: '#F2F1EC',      // Paper Cream (베이스 60%)
  cream: '#F2F1EC',      // 별칭
  paper: '#FBFAF6',      // 별칭
  // ── EXTENDED ──────────────────────────────────
  navyDeep: '#061328',   // Deep Ink (다크 배경)
  navyMid: '#1B3A6B',    // Mid Navy (서포트)
  goldDeep: '#A8853F',   // Gold Deep (강조 진행)
  // ── 워크북 호환 (legacy.jsx에서 사용) ─────────────
  border: '#6E7A8F33',   // Steel 20% (라인)
  line: '#E5E1D6',       // 옅은 라인
  // ── 상태색 (브랜드 가이드 외 보조) ───────────────────
  blue: '#1B3A6B',     blueBg: '#E8EEF6',
  green: '#2E7D5B',    greenBg: '#E6F1EC',
  yellow: '#B7872E',   yellowBg: '#FBF3DE',
  red: '#9E3B3B',      redBg: '#F7E4E4',
};

export const FONT = {
  family: '"Pretendard Variable","Pretendard","Noto Sans KR","Malgun Gothic",system-ui,sans-serif',
  serif: '"Noto Serif KR","Noto Serif","Source Han Serif KR",serif',  // editorial용
  mono: '"JetBrains Mono","SFMono-Regular",ui-monospace,monospace',
  size: {
    // 브랜드 가이드 타입 스케일
    caption: 16,   // CAPTION 16/500
    body: 16,      // BODY 16/400
    bodyL: 20,     // BODY L 20/400
    h3: 24,        // H3 24/600
    h2: 32,        // H2 32/600
    h1: 48,        // H1 48/700
    display: 72,   // DISPLAY 72/700
    // 워크북 호환 키
    xs: 12, sm: 14, base: 16, md: 16, lg: 18, xl: 20, xxl: 24,
  },
  weight: { regular: 400, medium: 500, semibold: 600, bold: 700 },
  lineHeight: { tight: 1.35, base: 1.6, loose: 1.75, relaxed: 1.7 },
};

// 브랜드 가이드 8pt base spacing
export const SPACING = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 40, xxl: 64, xxxl: 96,
  // 워크북 호환
  base: 12,
};

// 브랜드 가이드: flat by default
export const RADIUS = {
  none: 0,
  soft: 4,
  // 워크북 호환 (기존 둥근 UI 유지)
  sm: 4, base: 10, md: 8, lg: 12, pill: 999,
};

// 브랜드 가이드 rule/shadow
export const RULE = '1px solid rgba(14,39,80,0.13)';
export const SHADOW = '0 1px 0 rgba(0,0,0,0.04)';

export const MENTORING_URLS = {
  consulting: 'https://www.latpeed.com/products/S92cP',
  resume: 'https://www.latpeed.com/products/k6z-h',
  career_consulting: 'https://www.latpeed.com/products/LimF9',
  cover_letter: 'https://www.latpeed.com/products/fKnUV',
  interview: 'https://www.latpeed.com/products/tZ5xw',
};
