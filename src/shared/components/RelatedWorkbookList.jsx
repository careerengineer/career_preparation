import { Link } from 'react-router-dom';
import { WORKBOOKS } from '../../store/schema.js';
import { COLORS, FONT, SPACING, RADIUS } from '../design/tokens.js';

export function RelatedWorkbookList({ keys = [] }) {
  const items = keys
    .map((k) => WORKBOOKS.find((w) => w.key === k))
    .filter(Boolean)
    .slice(0, 5);

  if (items.length === 0) return null;

  return (
    <div style={{ marginTop: SPACING.lg }}>
      <p style={{
        fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold,
        color: COLORS.accent, margin: 0, marginBottom: SPACING.sm,
      }}>
        함께 보면 좋은 워크북
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.sm }}>
        {items.map((wb) => (
          <Link key={wb.key} to={`/workbook/${wb.key}`}
            style={{
              display: 'block',
              background: COLORS.white,
              border: `1px solid ${COLORS.line}`,
              borderRadius: RADIUS.md,
              padding: SPACING.base,
              textDecoration: 'none',
              color: COLORS.accent,
            }}>
            <span style={{ fontSize: FONT.size.xs, color: COLORS.sub }}>{wb.stepLabel}</span>
            <p style={{ margin: 0, fontWeight: FONT.weight.semibold }}>{wb.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
