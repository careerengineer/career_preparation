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
    // ── 워크북 내부 타입 스케일 (최소 16, 위계는 weight + size 조합으로 표현) ──
    // 시각적 위계: 16(본문/캡션) → 18(보조 강조) → 20(소제목) → 24(H3) → 28(H2) → 36(H1)
    // weight 위계  : 400(본문) · 500(라벨/캡션) · 600(소제목) · 700(제목)
    // 색·letter-spacing·대문자(uppercase)로 추가 위계 표현. fontSize 만으로 위계 구분 X.
    xs:   16,  // 캡션·짧은 메타 — 16/500 + uppercase + letter-spacing 으로 구분
    sm:   16,  // 폼 라벨·작은 버튼 — 16/600
    base: 16,  // 본문 — 16/400
    md:   16,  // 본문 별칭
    lg:   18,  // 보조 강조 / 답변 카드 / 인풋 — 18/400 또는 500
    xl:   20,  // 소제목 (subsection title) — 20/600
    xxl:  24,  // H3 (섹션 제목) — 24/700

    // ── 브랜드 가이드 시스템 UI 스케일 (Dashboard 등) ──
    caption: 16,   // CAPTION 16/500
    body:    16,   // BODY 16/400
    bodyL:   20,   // BODY L 20/400
    h3:      24,   // H3 24/700
    h2:      28,   // H2 28/700  (구 32 → 28로 축소: 워크북 헤더와 위계 맞춤)
    h1:      36,   // H1 36/700  (구 48 → 36으로 축소: 본문 24와 사이 36이 더 자연스러움)
    display: 56,   // DISPLAY 56/700  (구 72 → 56로 축소)
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
