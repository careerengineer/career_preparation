import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MentoringBox } from './MentoringBox.jsx';
import { ReferenceInline } from './ReferenceInline.jsx';
import { useDataStore } from '../../store/DataContext.jsx';
import { exportToFile, exportWorkbookToFile } from '../../store/exportImport.js';
import { WORKBOOKS } from '../../store/schema.js';
import { COLORS, FONT, SPACING, RADIUS } from '../design/tokens.js';

export function WorkbookShell({
  workbookKey,
  title,
  stepLabel,
  children,
  mentoringType,
  topReferenceIds,
}) {
  const { master } = useDataStore();
  const meta = WORKBOOKS.find((w) => w.key === workbookKey) || {};
  const resolvedTitle = title || meta.title || '';
  const resolvedStepLabel = stepLabel || meta.stepLabel || '';

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [workbookKey]);

  const handleExportAll = () => {
    const name = exportToFile(master);
    alert(`전체 백업이 다운로드되었습니다.\n파일: ${name}`);
  };
  const handleExportThis = () => {
    const name = exportWorkbookToFile(master, workbookKey, resolvedTitle);
    alert(`${resolvedTitle} 결과가 다운로드되었습니다.\n파일: ${name}`);
  };

  return (
    <div style={{ background: COLORS.bg, minHeight: '100vh', fontFamily: FONT.family }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: `${SPACING.lg}px ${SPACING.md}px ${SPACING.xxl}px` }}>
        {/* 상단 액션 바 */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.md,
        }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: COLORS.accent, color: COLORS.white,
              textDecoration: 'none',
              fontSize: FONT.size.base, fontWeight: FONT.weight.semibold,
              padding: '10px 20px', borderRadius: RADIUS.pill,
              boxShadow: '0 2px 8px rgba(14,39,80,0.18)',
            }}
          >
            <span style={{ fontSize: FONT.size.lg, lineHeight: 1 }}>←</span>
            대시보드로 돌아가기
          </Link>

          <div style={{ display: 'flex', gap: SPACING.sm, flexWrap: 'wrap' }}>
            <button onClick={handleExportThis} style={btnSecondary}>
              📤 이 워크북 결과만 (.json)
            </button>
            <button onClick={handleExportAll} style={btnPrimary}>
              📦 전체 백업 (.json)
            </button>
          </div>
        </div>

        {/* 헤더 */}
        <div style={{ marginBottom: SPACING.lg }}>
          <p style={{
            fontSize: FONT.size.caption, color: COLORS.sub,
            margin: 0,
            letterSpacing: 1.8, textTransform: 'uppercase',
            fontWeight: FONT.weight.medium,
          }}>
            {resolvedStepLabel}
          </p>
          <h1 style={{
            fontSize: FONT.size.h2, fontWeight: FONT.weight.bold,
            color: COLORS.ink, margin: '4px 0 0',
            lineHeight: FONT.lineHeight.tight,
          }}>
            {resolvedTitle}
          </h1>
        </div>

        {topReferenceIds && topReferenceIds.length > 0 && (
          <ReferenceInline ids={topReferenceIds} />
        )}

        {children}

        {mentoringType && <MentoringBox type={mentoringType} />}
      </div>
    </div>
  );
}

const btnBase = {
  fontFamily: FONT.family,
  fontSize: FONT.size.body,
  fontWeight: FONT.weight.semibold,
  padding: '8px 14px',
  cursor: 'pointer',
  borderRadius: 4,
};
const btnPrimary = {
  ...btnBase,
  background: COLORS.accent2,
  color: COLORS.white,
  border: `1px solid ${COLORS.accent2}`,
};
const btnSecondary = {
  ...btnBase,
  background: COLORS.white,
  color: COLORS.accent,
  border: `1px solid ${COLORS.line}`,
};
