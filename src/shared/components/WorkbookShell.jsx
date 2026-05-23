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
  const { master, replaceMaster, resetSingleWorkbook } = useDataStore();
  const meta = WORKBOOKS.find((w) => w.key === workbookKey) || {};
  const resolvedTitle = title || meta.title || '';
  const resolvedStepLabel = stepLabel || meta.stepLabel || '';
  const isExperience = workbookKey === 'experience';

  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);
  const [resetMode, setResetMode] = useState(null); // null | 'ask' | 'confirm'
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

  const closeReset = () => setResetMode(null);
  const handleResetFinal = () => {
    resetSingleWorkbook(workbookKey);
    closeReset();
    // 워크북 자체 useState도 리셋되도록 페이지 reload
    setTimeout(() => window.location.reload(), 200);
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
          {/* Row 1: 좌측 락업 (마크 + 워드마크) | 우측 [대시보드로 돌아가기] */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.sm,
          }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center',
              gap: Math.round(28 * (683/620) * 0.24),
            }}>
              <CEMark size={28} />
              <span style={{
                fontFamily: '"Pretendard Variable","Pretendard",system-ui,sans-serif',
                fontSize: 22, fontWeight: 700,
                letterSpacing: '-0.028em',
                color: COLORS.ink, lineHeight: 1,
              }}>
                Career<span style={{ color: COLORS.goldDeep }}>Engineer</span>
              </span>
            </div>
            <Link
              to="/"
              style={{
                background: COLORS.accent, color: COLORS.white,
                textDecoration: 'none',
                fontSize: 16, fontWeight: FONT.weight.semibold,
                padding: '7px 14px', borderRadius: RADIUS.pill,
              }}
            >
              대시보드로 돌아가기
            </Link>
          </div>

          {/* Row 2: STEP + 워크북 제목 (좌) | 액션 버튼 (우) */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            flexWrap: 'wrap', gap: SPACING.sm,
          }}>
            <div style={{ minWidth: 0 }}>
              <p style={{
                fontSize: 14, color: COLORS.sub,
                margin: 0,
                letterSpacing: 1.4, textTransform: 'uppercase',
                fontWeight: FONT.weight.medium,
              }}>
                {resolvedStepLabel}
              </p>
              <h1 style={{
                fontSize: 26, fontWeight: FONT.weight.bold,
                color: COLORS.ink, margin: '2px 0 0',
                lineHeight: 1.2,
                letterSpacing: '-0.4px',
              }}>
                {resolvedTitle}
              </h1>
            </div>

            <div className="ce-workbook-header-actions" style={{ display: 'flex', gap: SPACING.xs, flexWrap: 'wrap', alignItems: 'center' }}>
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
              <button onClick={() => setResetMode('ask')} style={btnDanger} disabled={busy}>
                {resolvedTitle} 삭제하고 다시 작성
              </button>
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

      {/* 워크북 단독 리셋 - 2단계 confirm */}
      {resetMode && (
        <div onClick={closeReset} style={{
          position: 'fixed', inset: 0, background: 'rgba(14,39,80,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: SPACING.md,
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            background: COLORS.white, maxWidth: 480, width: '100%',
            padding: SPACING.lg, fontFamily: FONT.family,
            boxShadow: '0 12px 36px rgba(0,0,0,0.18)',
            borderTop: `4px solid ${COLORS.red}`,
          }}>
            <h2 style={{ margin: 0, fontSize: FONT.size.h3, color: COLORS.ink, fontWeight: FONT.weight.bold }}>
              "{resolvedTitle}" 워크북을 삭제하시겠습니까?
            </h2>
            <p style={{ color: COLORS.sub, fontSize: 20, marginTop: SPACING.sm, marginBottom: SPACING.md, lineHeight: FONT.lineHeight.base }}>
              이 워크북에서 작성한 모든 내용이 삭제되고 처음부터 다시 작성할 수 있게 됩니다.<br />
              다른 워크북(경험·진단 등)의 내용은 영향받지 않습니다.
            </p>
            {resetMode === 'confirm' && (
              <div style={{ background: COLORS.redBg, borderLeft: `3px solid ${COLORS.red}`, padding: SPACING.md, marginBottom: SPACING.md }}>
                <p style={{ margin: 0, fontSize: 20, color: COLORS.red, fontWeight: FONT.weight.semibold }}>
                  마지막 확인 — 정말 삭제하시겠습니까?
                </p>
                <p style={{ margin: '6px 0 0', fontSize: 20, color: COLORS.ink }}>
                  삭제 후엔 되돌릴 수 없습니다. 페이지가 자동으로 새로고침됩니다.
                </p>
              </div>
            )}
            <div style={{ display: 'flex', gap: SPACING.sm, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <button onClick={closeReset} style={resetBtnGhost}>취소</button>
              {resetMode === 'ask' ? (
                <button onClick={() => setResetMode('confirm')} style={resetBtnPrimary}>삭제</button>
              ) : (
                <button onClick={handleResetFinal} style={resetBtnDanger}>네, 삭제합니다</button>
              )}
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div style={{
          position: 'fixed', bottom: SPACING.lg, left: '50%', transform: 'translateX(-50%)',
          background: COLORS.accent, color: COLORS.white,
          padding: `${SPACING.sm}px ${SPACING.md}px`,
          fontFamily: FONT.family, fontSize: 20,
          boxShadow: '0 6px 18px rgba(0,0,0,0.18)', zIndex: 1100,
          display: 'flex', alignItems: 'center', gap: SPACING.md,
        }}>
          <span>{toast}</span>
          <button onClick={() => setToast(null)} style={{
            background: 'transparent', border: 'none', color: COLORS.accent2,
            cursor: 'pointer', fontSize: 20,
            fontWeight: FONT.weight.semibold, fontFamily: FONT.family,
          }}>닫기</button>
        </div>
      )}
    </div>
  );
}

const btnBase = {
  fontFamily: FONT.family,
  fontSize: 14,
  fontWeight: FONT.weight.semibold,
  padding: '7px 12px',
  cursor: 'pointer',
  borderRadius: 4,
  whiteSpace: 'nowrap',
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
const btnDanger = {
  ...btnBase,
  background: COLORS.white,
  color: COLORS.red,
  border: `1px solid ${COLORS.red}`,
};
const resetBtnGhost = {
  fontFamily: FONT.family, fontSize: 20, fontWeight: FONT.weight.semibold,
  padding: '10px 18px', cursor: 'pointer',
  background: 'transparent', color: COLORS.sub, border: `1px solid ${COLORS.line}`,
};
const resetBtnPrimary = {
  fontFamily: FONT.family, fontSize: 20, fontWeight: FONT.weight.semibold,
  padding: '10px 18px', cursor: 'pointer',
  background: COLORS.white, color: COLORS.red, border: `1px solid ${COLORS.red}`,
};
const resetBtnDanger = {
  fontFamily: FONT.family, fontSize: 20, fontWeight: FONT.weight.semibold,
  padding: '10px 18px', cursor: 'pointer',
  background: COLORS.red, color: COLORS.white, border: 'none',
};
