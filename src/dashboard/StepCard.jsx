import { Link } from 'react-router-dom';
import { COLORS, FONT, SPACING, RULE } from '../shared/design/tokens.js';

const BADGE = {
  0:   { label: '시작 전', bg: COLORS.cream, color: COLORS.sub },
  50:  { label: '작성 중', bg: COLORS.bgAlt, color: COLORS.goldDeep },
  100: { label: '완료',    bg: COLORS.accent, color: COLORS.white },
};

export default function StepCard({ workbook, progress }) {
  const badge = BADGE[progress] || BADGE[0];
  return (
    <Link
      to={`/workbook/${workbook.key}`}
      style={{
        display: 'flex', flexDirection: 'column', gap: SPACING.sm,
        background: COLORS.white,
        border: RULE,
        borderTop: `2px solid ${COLORS.accent2}`,
        padding: SPACING.md,
        textDecoration: 'none',
        color: 'inherit',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        minHeight: 130,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 14px rgba(14,39,80,0.10)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <span style={{
        fontSize: 20, color: COLORS.sub,
        letterSpacing: 1.6, textTransform: 'uppercase',
        fontWeight: FONT.weight.medium,
      }}>
        {workbook.stepLabel}
      </span>
      <p style={{
        margin: 0,
        fontSize: 20,
        fontWeight: FONT.weight.bold,
        color: COLORS.ink,
        lineHeight: 1.3,
        letterSpacing: '-0.3px',
        flex: 1,
      }}>
        {workbook.title}
      </p>
      <span style={{
        alignSelf: 'flex-start',
        background: badge.bg,
        color: badge.color,
        fontSize: 20,
        fontWeight: FONT.weight.semibold,
        padding: '4px 10px',
        letterSpacing: 1,
        textTransform: 'uppercase',
      }}>
        {badge.label}
      </span>
    </Link>
  );
}
