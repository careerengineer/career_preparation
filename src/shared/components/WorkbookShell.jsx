import { Link } from 'react-router-dom';
import { ImportPanel } from './ImportPanel.jsx';
import { MentoringBox } from './MentoringBox.jsx';
import { RelatedWorkbookList } from './RelatedWorkbookList.jsx';
import { COLORS, FONT, SPACING } from '../design/tokens.js';

export function WorkbookShell({
  workbookKey,
  title,
  stepLabel,
  children,
  mentoringType,
  relatedKeys,
  onImport,
}) {
  return (
    <div style={{ background: COLORS.bg, minHeight: '100vh', fontFamily: FONT.family }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: `${SPACING.lg}px ${SPACING.md}px ${SPACING.xxl}px` }}>
        <div style={{ marginBottom: SPACING.lg }}>
          <Link to="/" style={{ color: COLORS.sub, textDecoration: 'none', fontSize: FONT.size.sm }}>
            ← 대시보드
          </Link>
          <p style={{
            fontSize: FONT.size.sm, color: COLORS.sub,
            margin: `${SPACING.sm}px 0 0`,
            letterSpacing: 4, textTransform: 'uppercase',
          }}>
            {stepLabel}
          </p>
          <h1 style={{
            fontSize: FONT.size.h1, fontWeight: FONT.weight.bold,
            color: COLORS.ink, margin: 0,
          }}>
            {title}
          </h1>
        </div>

        {onImport && <ImportPanel workbookKey={workbookKey} onImport={onImport} />}

        {children}

        {mentoringType && <MentoringBox type={mentoringType} />}
        {relatedKeys && <RelatedWorkbookList keys={relatedKeys} />}
      </div>
    </div>
  );
}
