import { COLORS, FONT, SPACING, MENTORING_URLS } from '../design/tokens.js';

const LABELS = {
  consulting: '1-Hour 1:1 취업 컨설팅',
  resume: '서류 합격 멘토링',
  career_consulting: '이직 컨설팅',
  cover_letter: '자소서 멘토링',
  interview: '면접 멘토링',
};

export function MentoringBox({ type = 'consulting', message }) {
  const url = MENTORING_URLS[type] || MENTORING_URLS.consulting;

  return (
    <div style={{
      background: COLORS.bg,
      borderLeft: `3px solid ${COLORS.accent2}`,
      borderRadius: 8,
      padding: SPACING.md,
      marginTop: SPACING.lg,
    }}>
      <p style={{
        fontSize: 20,
        fontWeight: FONT.weight.semibold,
        color: COLORS.accent2,
        margin: 0, marginBottom: SPACING.sm,
        letterSpacing: 0.5, textTransform: 'uppercase',
      }}>
        MENTORING · 멘토링 안내
      </p>
      <p style={{ fontSize: 20, color: COLORS.accent, margin: 0, lineHeight: FONT.lineHeight.base }}>
        {message || '혼자 작성이 막막하다면 1:1 멘토링으로 빠르게 완성하세요. '}
        <a href={url} target="_blank" rel="noopener noreferrer"
          style={{ color: COLORS.accent2, fontWeight: FONT.weight.semibold, textDecoration: 'underline' }}>
          {LABELS[type]}
        </a>
      </p>
    </div>
  );
}
