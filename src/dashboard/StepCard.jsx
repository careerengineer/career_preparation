import { Link } from 'react-router-dom';
import { COLORS, FONT, SPACING, RULE } from '../shared/design/tokens.js';

function progressBadge(progress) {
  if (progress >= 100) return { label: '완료', bg: COLORS.accent, color: COLORS.white };
  if (progress >= 80)  return { label: '거의 완성', bg: COLORS.bgAlt, color: COLORS.accent };
  if (progress >= 50)  return { label: '작성 중', bg: COLORS.bgAlt, color: COLORS.goldDeep };
  if (progress >= 20)  return { label: '시작함', bg: COLORS.cream, color: COLORS.goldDeep };
  if (progress > 0)    return { label: '진행 시작', bg: COLORS.cream, color: COLORS.sub };
  return { label: '시작 전', bg: COLORS.cream, color: COLORS.sub };
}

export default function StepCard({ workbook, progress }) {
  const badge = progressBadge(progress);
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
      <p style={{
        margin: 0,
        fontSize: 22,
        fontWeight: FONT.weight.bold,
        color: COLORS.ink,
        lineHeight: 1.3,
        letterSpacing: '-0.3px',
        flex: 1,
      }}>
        {workbook.title}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.sm, flexWrap: 'wrap' }}>
        <span style={{
          background: badge.bg, color: badge.color,
          fontSize: 16, fontWeight: FONT.weight.semibold,
          padding: '4px 10px',
          letterSpacing: 1, textTransform: 'uppercase',
        }}>
          {badge.label}
        </span>
        {progress > 0 && (
          <span style={{ fontSize: 16, color: COLORS.sub, fontWeight: FONT.weight.semibold }}>
            {progress}%
          </span>
        )}
      </div>
      {/* 진행률 바 */}
      <div style={{
        height: 4, background: COLORS.cream,
        overflow: 'hidden', marginTop: 4,
      }}>
        <div style={{
          height: '100%', width: `${progress}%`,
          background: progress >= 100 ? COLORS.accent : COLORS.accent2,
          transition: 'width 0.4s ease',
        }} />
      </div>
    </Link>
  );
}
