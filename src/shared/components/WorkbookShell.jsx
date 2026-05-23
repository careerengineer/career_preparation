import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MentoringBox } from './MentoringBox.jsx';
import { ReferenceInline } from './ReferenceInline.jsx';
import { ReferenceFAB } from './ReferenceFAB.jsx';
import { CEMark } from './CELogo.jsx';
import { useDataStore } from '../../store/DataContext.jsx';
import {
  exportWorkbookDocx, exportFullDocx,
  exportExperiencesXlsx, importExperiencesXlsx,
} from '../../store/docExport.js';
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
  const { master, replaceMaster } = useDataStore();
  const meta = WORKBOOKS.find((w) => w.key === workbookKey) || {};
  const resolvedTitle = title || meta.title || '';
  const resolvedStepLabel = stepLabel || meta.stepLabel || '';
  const isExperience = workbookKey === 'experience';

  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);
  const xlsxRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [workbookKey]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 4000); };

  const handleExportThis = async () => {
    setBusy(true);
    try {
      // 1순위: 워크북 원본의 정성 다운로드 함수 호출 (한글 라벨, 풍부한 스타일, 멘토링 안내 포함)
      const dl = (typeof window !== 'undefined') ? window.__CE_DOWNLOAD : null;
      if (dl?.key === workbookKey && typeof dl.fn === 'function') {
        await dl.fn();
        showToast(`${resolvedTitle} 결과를 저장했습니다.`);
        return;
      }
      // 2순위: 우리 generic export
      const name = isExperience
        ? exportExperiencesXlsx(master)
        : await exportWorkbookDocx(master, workbookKey, resolvedTitle);
      showToast(`다운로드 완료: ${name}`);
    } catch (e) {
      showToast('오류: ' + e.message);
    } finally { setBusy(false); }
  };

  const handleExportAll = async () => {
    setBusy(true);
    try {
      const name = await exportFullDocx(master);
      showToast(`다운로드 완료: ${name}`);
    } catch (e) {
      showToast('오류: ' + e.message);
    } finally { setBusy(false); }
  };

  const handleXlsxImport = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!window.confirm('경험 카드를 xlsx 파일로 교체합니다. 기존 경험 데이터가 덮어쓰기됩니다. 계속할까요?')) return;
    try {
      const { experiences } = await importExperiencesXlsx(file);
      replaceMaster({ ...master, experiences });
      showToast(`경험 카드 ${experiences.length}개를 불러왔습니다.`);
    } catch (err) {
      showToast('오류: ' + err.message);
    }
  };

  return (
    <div style={{ background: COLORS.bg, minHeight: '100vh', fontFamily: FONT.family }}>
      {/* 통합 sticky 헤더 */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: COLORS.bg,
        borderBottom: `1px solid ${COLORS.line}`,
        boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          padding: `${SPACING.sm}px ${SPACING.md}px`,
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.sm,
          }}>
            <div style={{ display: 'flex', gap: SPACING.sm, flexWrap: 'wrap', alignItems: 'center' }}>
              <Link
                to="/"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: COLORS.accent, color: COLORS.white,
                  textDecoration: 'none',
                  fontSize: FONT.size.body, fontWeight: FONT.weight.semibold,
                  padding: '8px 16px', borderRadius: RADIUS.pill,
                  boxShadow: '0 2px 8px rgba(14,39,80,0.18)',
                }}
              >
                대시보드로 돌아가기
              </Link>
            </div>

            <div className="ce-workbook-header-actions" style={{ display: 'flex', gap: SPACING.sm, flexWrap: 'wrap', alignItems: 'center' }}>
              {isExperience && (
                <>
                  <button onClick={() => xlsxRef.current?.click()} style={btnSecondary} disabled={busy}>
                    xlsx 불러오기
                  </button>
                  <input
                    ref={xlsxRef} type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    onChange={handleXlsxImport} style={{ display: 'none' }}
                  />
                </>
              )}
              <button onClick={handleExportThis} style={btnSecondary} disabled={busy}>
                {resolvedTitle} 저장 ({isExperience ? '.xlsx' : '.docx'})
              </button>
              <button onClick={handleExportAll} style={btnPrimary} disabled={busy}>
                전체 결과 저장 (.docx)
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.sm }}>
            <CEMark size={32} />
            <div>
              <p style={{
                fontSize: FONT.size.xs, color: COLORS.sub,
                margin: 0,
                letterSpacing: 1.6, textTransform: 'uppercase',
                fontWeight: FONT.weight.medium,
              }}>
                {resolvedStepLabel}
              </p>
              <h1 style={{
                fontSize: FONT.size.h3, fontWeight: FONT.weight.bold,
                color: COLORS.ink, margin: '2px 0 0',
                lineHeight: FONT.lineHeight.tight,
                letterSpacing: '-0.3px',
              }}>
                {resolvedTitle}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: `${SPACING.lg}px ${SPACING.md}px ${SPACING.xxl}px` }}>

        {topReferenceIds && topReferenceIds.length > 0 && (
          <ReferenceInline ids={topReferenceIds} />
        )}

        <div className="ce-workbook-body">
          {children}
        </div>

        {mentoringType && <MentoringBox type={mentoringType} />}
      </div>

      <ReferenceFAB currentWorkbookKey={workbookKey} />

      {toast && (
        <div style={{
          position: 'fixed', bottom: SPACING.lg, left: '50%', transform: 'translateX(-50%)',
          background: COLORS.accent, color: COLORS.white,
          padding: `${SPACING.sm}px ${SPACING.md}px`,
          fontFamily: FONT.family, fontSize: FONT.size.body,
          boxShadow: '0 6px 18px rgba(0,0,0,0.18)', zIndex: 1100,
          display: 'flex', alignItems: 'center', gap: SPACING.md,
        }}>
          <span>{toast}</span>
          <button onClick={() => setToast(null)} style={{
            background: 'transparent', border: 'none', color: COLORS.accent2,
            cursor: 'pointer', fontSize: FONT.size.body,
            fontWeight: FONT.weight.semibold, fontFamily: FONT.family,
          }}>닫기</button>
        </div>
      )}
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
