import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ImportPanel } from './ImportPanel.jsx';
import { MentoringBox } from './MentoringBox.jsx';
import { WORKBOOKS } from '../../store/schema.js';
import { COLORS, FONT, SPACING, RADIUS } from '../design/tokens.js';

export function WorkbookShell({
  workbookKey,
  title,
  stepLabel,
  children,
  mentoringType,
  onImport,
}) {
  // schema 우선, props로 override 가능
  const meta = WORKBOOKS.find((w) => w.key === workbookKey) || {};
  const resolvedTitle = title || meta.title || '';
  const resolvedStepLabel = stepLabel || meta.stepLabel || '';

  // 워크북 진입 시 스크롤 맨 위로
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [workbookKey]);
  return (
    <div style={{ background: COLORS.bg, minHeight: '100vh', fontFamily: FONT.family }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: `${SPACING.lg}px ${SPACING.md}px ${SPACING.xxl}px` }}>
        <div style={{ marginBottom: SPACING.lg }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: COLORS.accent,
              color: COLORS.white,
              textDecoration: 'none',
              fontSize: FONT.size.base,
              fontWeight: FONT.weight.semibold,
              padding: '10px 20px',
              borderRadius: RADIUS.pill,
              boxShadow: '0 2px 8px rgba(14,39,80,0.18)',
              marginBottom: SPACING.md,
            }}
          >
            <span style={{ fontSize: FONT.size.lg, lineHeight: 1 }}>←</span>
            대시보드로 돌아가기
          </Link>
          <p style={{
            fontSize: FONT.size.caption, color: COLORS.sub,
            margin: `${SPACING.sm}px 0 0`,
            letterSpacing: 1.8, textTransform: 'uppercase',
            fontWeight: FONT.weight.medium,
          }}>
            {resolvedStepLabel}
          </p>
          <h1 style={{
            fontSize: FONT.size.h2, fontWeight: FONT.weight.bold,
            color: COLORS.ink, margin: 0,
            lineHeight: FONT.lineHeight.tight,
          }}>
            {resolvedTitle}
          </h1>
        </div>

        {onImport && <ImportPanel workbookKey={workbookKey} onImport={onImport} />}

        {children}

        {mentoringType && <MentoringBox type={mentoringType} />}
      </div>
    </div>
  );
}
