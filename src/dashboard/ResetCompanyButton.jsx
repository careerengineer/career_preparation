import { useState } from 'react';
import { useDataStore } from '../store/DataContext.jsx';
import { exportToFile } from '../store/exportImport.js';
import { COLORS, FONT, SPACING, RADIUS } from '../shared/design/tokens.js';

const CLEARED = [
  '산업 / 직무 / 회사 (기본정보)',
  '채용공고·직무 분석',
  '이력서 / 경력기술서',
  '자소서 5종 (지원동기·직무역량·성격·목표수립달성·입사후 포부)',
  '1분 자기소개',
  '신입 / 경력직 면접 답변',
];
const KEPT = [
  '경험 정리 (STAR 카드)',
  '취업 로드맵 진단 결과',
];

export default function ResetCompanyButton() {
  const { master, resetCompanyRelated } = useDataStore();
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const hasCompanyData =
    master.profile.industry || master.profile.position || master.profile.company;

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2400); };

  const handleConfirm = () => {
    resetCompanyRelated();
    setOpen(false);
    showToast('회사 관련 데이터를 초기화했습니다. 경험·로드맵은 유지됐습니다.');
  };

  const handleBackupThenConfirm = () => {
    exportToFile(master);
    resetCompanyRelated();
    setOpen(false);
    showToast('현재 데이터를 백업하고 초기화했습니다.');
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
          fontSize: FONT.size.body,
          fontWeight: FONT.weight.semibold,
          cursor: hasCompanyData ? 'pointer' : 'not-allowed',
        }}
      >
        회사 변경 (회사 관련 정보 삭제하고 다시 작성)
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
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
              color: COLORS.sub, fontSize: FONT.size.body,
              marginTop: SPACING.sm, marginBottom: SPACING.md,
              lineHeight: FONT.lineHeight.base,
            }}>
              다른 회사에 지원할 때 사용하세요.
              회사·직무와 관련된 작성 내용은 비워지고, 본인 자산(경험·로드맵)은 그대로 유지됩니다.
            </p>

            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: SPACING.md,
              marginBottom: SPACING.lg,
            }}>
              <div style={{ background: COLORS.bgAlt, padding: SPACING.md, borderLeft: `3px solid ${COLORS.red}` }}>
                <p style={{
                  margin: 0, marginBottom: 6,
                  fontSize: FONT.size.caption, color: COLORS.red,
                  fontWeight: FONT.weight.semibold,
                  letterSpacing: 1.5, textTransform: 'uppercase',
                }}>
                  삭제
                </p>
                <ul style={{ margin: 0, paddingLeft: SPACING.md, color: COLORS.ink, fontSize: FONT.size.caption, lineHeight: FONT.lineHeight.base }}>
                  {CLEARED.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </div>
              <div style={{ background: COLORS.bgAlt, padding: SPACING.md, borderLeft: `3px solid ${COLORS.accent2}` }}>
                <p style={{
                  margin: 0, marginBottom: 6,
                  fontSize: FONT.size.caption, color: COLORS.accent2,
                  fontWeight: FONT.weight.semibold,
                  letterSpacing: 1.5, textTransform: 'uppercase',
                }}>
                  유지
                </p>
                <ul style={{ margin: 0, paddingLeft: SPACING.md, color: COLORS.ink, fontSize: FONT.size.caption, lineHeight: FONT.lineHeight.base }}>
                  {KEPT.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </div>
            </div>

            <div style={{ display: 'flex', gap: SPACING.sm, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <button onClick={() => setOpen(false)} style={btnGhost}>취소</button>
              <button onClick={handleBackupThenConfirm} style={btnSecondary}>전체 백업 후 삭제</button>
              <button onClick={handleConfirm} style={btnPrimary}>삭제</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div style={{
          position: 'fixed', bottom: SPACING.lg, left: '50%', transform: 'translateX(-50%)',
          background: COLORS.accent, color: COLORS.white,
          padding: `${SPACING.sm}px ${SPACING.md}px`,
          fontFamily: FONT.family, fontSize: FONT.size.body,
          boxShadow: '0 6px 18px rgba(0,0,0,0.18)', zIndex: 1100,
        }}>{toast}</div>
      )}
    </>
  );
}

const btnBase = {
  fontFamily: FONT.family, fontSize: FONT.size.body,
  padding: '10px 18px', cursor: 'pointer',
  fontWeight: FONT.weight.semibold,
};
const btnPrimary = { ...btnBase, background: COLORS.red, color: COLORS.white, border: 'none' };
const btnSecondary = { ...btnBase, background: COLORS.white, color: COLORS.accent, border: `1px solid ${COLORS.accent}` };
const btnGhost = { ...btnBase, background: 'transparent', color: COLORS.sub, border: `1px solid ${COLORS.line}` };
