import { useEffect, useState } from 'react';
import { useDataStore } from '../store/DataContext.jsx';
import { exportFullBackupZip } from '../store/docExport.js';
import { COLORS, FONT, SPACING, RADIUS } from '../shared/design/tokens.js';

const CLEARED = [
  '산업 / 직무 / 회사 (기본정보)',
  '채용공고 및 직무분석',
  '이력서 / 경력기술서',
  '자소서 5종 (지원동기·직무역량·성격·목표수립달성·입사후 포부)',
  '1분 자기소개',
  '신입 / 경력 면접 답변',
];
const KEPT = [
  '경험 정리 (STAR 카드)',
  '취업 로드맵 진단 결과',
];

export default function ResetCompanyButton() {
  const { master, resetCompanyRelated } = useDataStore();
  const [open, setOpen] = useState(false);
  const [pendingMode, setPendingMode] = useState(null); // null | 'plain' | 'backup'
  const [toast, setToast] = useState(null);

  const hasCompanyData =
    master.profile.industry || master.profile.position || master.profile.company;

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 4000); };

  // ESC로 모달 닫기
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') closeAll(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const closeAll = () => { setOpen(false); setPendingMode(null); };

  const handleAskDelete       = () => setPendingMode('plain');
  const handleAskBackupDelete = () => setPendingMode('backup');

  const handleFinalConfirm = async () => {
    if (pendingMode === 'backup') {
      try { await exportFullBackupZip(master); }
      catch (e) { showToast('백업 오류: ' + e.message); return; }
    }
    resetCompanyRelated();
    closeAll();
    // 페이지 상단으로 + alert로 명확히 안내 (토스트보다 강력)
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      window.alert(
        (pendingMode === 'backup' ? '백업이 완료되었고 데이터를 초기화했습니다.\n\n' : '데이터를 초기화했습니다.\n\n') +
        '다음 단계:\n' +
        '1. 상단 "어떤 직무에 지원하나요?"에 새 회사·직무·산업을 입력\n' +
        '2. STEP 1 채용공고 및 직무분석부터 새로 작성\n\n' +
        '경험·로드맵 진단 결과는 그대로 남아있습니다.'
      );
    }, 300);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={!hasCompanyData}
        style={{
          background: hasCompanyData ? COLORS.white : COLORS.cream,
          color: hasCompanyData ? COLORS.red : COLORS.sub,
          border: `1px solid ${hasCompanyData ? COLORS.red : COLORS.line}`,
          padding: '8px 14px',
          fontFamily: FONT.family,
          fontSize: 20,
          fontWeight: FONT.weight.semibold,
          cursor: hasCompanyData ? 'pointer' : 'not-allowed',
        }}
      >
        회사 변경 (회사 관련 정보 삭제하고 다시 작성)
      </button>

      {open && (
        <div
          onClick={closeAll}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(14,39,80,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: SPACING.md,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: COLORS.white,
              maxWidth: 560, width: '100%',
              padding: SPACING.lg,
              fontFamily: FONT.family,
              boxShadow: '0 12px 36px rgba(0,0,0,0.18)',
              borderTop: `4px solid ${COLORS.red}`,
            }}
          >
            <h2 style={{
              margin: 0, fontSize: FONT.size.h3, color: COLORS.ink,
              fontWeight: FONT.weight.bold,
            }}>
              회사 관련 정보를 삭제하시겠습니까?
            </h2>
            <p style={{
              color: COLORS.sub, fontSize: 20,
              marginTop: SPACING.sm, marginBottom: SPACING.md,
              lineHeight: FONT.lineHeight.base,
            }}>
              다른 회사에 지원할 때 사용하세요.
              회사·직무와 관련된 작성 내용은 비워지고, 본인 자산(경험·로드맵)은 그대로 유지됩니다.
            </p>

            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: SPACING.md,
              marginBottom: SPACING.lg,
            }}>
              <div style={{ background: COLORS.bgAlt, padding: SPACING.md, borderLeft: `3px solid ${COLORS.red}` }}>
                <p style={{
                  margin: 0, marginBottom: 6,
                  fontSize: 20, color: COLORS.red,
                  fontWeight: FONT.weight.semibold,
                  letterSpacing: 1.5, textTransform: 'uppercase',
                }}>
                  삭제
                </p>
                <ul style={{ margin: 0, paddingLeft: SPACING.md, color: COLORS.ink, fontSize: 20, lineHeight: FONT.lineHeight.base }}>
                  {CLEARED.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </div>
              <div style={{ background: COLORS.bgAlt, padding: SPACING.md, borderLeft: `3px solid ${COLORS.accent2}` }}>
                <p style={{
                  margin: 0, marginBottom: 6,
                  fontSize: 20, color: COLORS.accent2,
                  fontWeight: FONT.weight.semibold,
                  letterSpacing: 1.5, textTransform: 'uppercase',
                }}>
                  유지
                </p>
                <ul style={{ margin: 0, paddingLeft: SPACING.md, color: COLORS.ink, fontSize: 20, lineHeight: FONT.lineHeight.base }}>
                  {KEPT.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </div>
            </div>

            {pendingMode && (
              <div style={{
                background: COLORS.redBg, borderLeft: `3px solid ${COLORS.red}`,
                padding: SPACING.md, marginBottom: SPACING.md,
              }}>
                <p style={{
                  margin: 0, fontSize: 20, color: COLORS.red,
                  fontWeight: FONT.weight.semibold, lineHeight: FONT.lineHeight.base,
                }}>
                  마지막 확인 — 정말 삭제하시겠습니까?
                </p>
                <p style={{
                  margin: '6px 0 0', fontSize: 20, color: COLORS.ink,
                  lineHeight: FONT.lineHeight.base,
                }}>
                  {pendingMode === 'backup'
                    ? '백업 파일이 먼저 다운로드된 뒤, 위 항목들이 삭제됩니다.'
                    : '백업 없이 위 항목들이 즉시 삭제됩니다. 되돌릴 수 없습니다.'}
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: SPACING.sm, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <button onClick={closeAll} style={btnGhost}>취소</button>
              {pendingMode ? (
                <button onClick={handleFinalConfirm} style={btnDanger}>
                  {pendingMode === 'backup' ? '네, 백업 후 삭제합니다' : '네, 삭제합니다'}
                </button>
              ) : (
                <>
                  <button onClick={handleAskBackupDelete} style={btnSecondary}>전체 백업 후 삭제</button>
                  <button onClick={handleAskDelete} style={btnPrimary}>삭제</button>
                </>
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
    </>
  );
}

const btnBase = {
  fontFamily: FONT.family, fontSize: 20,
  padding: '10px 18px', cursor: 'pointer',
  fontWeight: FONT.weight.semibold,
};
const btnPrimary = { ...btnBase, background: COLORS.white, color: COLORS.red, border: `1px solid ${COLORS.red}` };
const btnSecondary = { ...btnBase, background: COLORS.white, color: COLORS.accent, border: `1px solid ${COLORS.accent}` };
const btnGhost = { ...btnBase, background: 'transparent', color: COLORS.sub, border: `1px solid ${COLORS.line}` };
const btnDanger = { ...btnBase, background: COLORS.red, color: COLORS.white, border: 'none' };
