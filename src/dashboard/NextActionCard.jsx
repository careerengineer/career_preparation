import { Link } from 'react-router-dom';
import { useDataStore } from '../store/DataContext.jsx';
import { getNextRecommendation } from '../store/selectors.js';
import { COLORS, FONT, SPACING, RADIUS } from '../shared/design/tokens.js';

export default function NextActionCard() {
  const { master } = useDataStore();
  const rec = getNextRecommendation(master);

  const inner = (
    <>
      <span style={{
        fontSize: FONT.size.xs, color: COLORS.accent2,
        fontWeight: FONT.weight.semibold,
        letterSpacing: 2, textTransform: 'uppercase',
      }}>
        NEXT · 다음에 할 일
      </span>
      <p style={{
        margin: '6px 0 0', fontSize: FONT.size.lg,
        fontWeight: FONT.weight.semibold, color: COLORS.ink,
      }}>
        {rec.label}
      </p>
    </>
  );

  const style = {
    display: 'block',
    background: COLORS.white,
    borderLeft: `3px solid ${COLORS.accent}`,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    textDecoration: 'none',
    color: 'inherit',
  };

  if (rec.kind === 'workbook') {
    return <Link to={`/workbook/${rec.workbookKey}`} style={style}>{inner}</Link>;
  }
  return <div style={style}>{inner}</div>;
}
