import { Link } from 'react-router-dom';
import { COLORS, FONT, SPACING, RADIUS } from '../shared/design/tokens.js';

const BADGE = {
  0: { label: '시작 전', bg: COLORS.bgAlt, color: COLORS.sub },
  50: { label: '작성 중', bg: COLORS.yellowBg, color: COLORS.yellow },
  100: { label: '완료', bg: COLORS.greenBg, color: COLORS.green },
};

export default function StepCard({ workbook, progress }) {
  const badge = BADGE[progress] || BADGE[0];
  return (
    <Link
      to={`/workbook/${workbook.key}`}
      style={{
        display: 'block',
        background: COLORS.white,
        borderLeft: `3px solid ${COLORS.accent2}`,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        textDecoration: 'none',
        color: 'inherit',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      <span style={{
        fontSize: FONT.size.xs, color: COLORS.sub,
        letterSpacing: 2, textTransform: 'uppercase',
      }}>
        {workbook.stepLabel}
      </span>
      <p style={{
        margin: '6px 0 8px',
        fontSize: FONT.size.base,
        fontWeight: FONT.weight.semibold,
        color: COLORS.ink,
      }}>
        {workbook.title}
      </p>
      <span style={{
        display: 'inline-block',
        background: badge.bg,
        color: badge.color,
        fontSize: FONT.size.xs,
        fontWeight: FONT.weight.semibold,
        padding: '3px 10px',
        borderRadius: RADIUS.pill,
      }}>
        {badge.label}
      </span>
    </Link>
  );
}
