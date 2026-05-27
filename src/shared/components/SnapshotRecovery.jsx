import { useState } from 'react';
import { useDataStore } from '../../store/DataContext.jsx';
import { mergeWithDefaults } from '../../store/schema.js';
import { syncLegacyFromMaster } from '../../store/legacySync.js';
import { COLORS, FONT, SPACING, RADIUS } from '../design/tokens.js';

function fmtTime(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const diff = Date.now() - d.getTime();
  const min = Math.round(diff / 60000);
  let rel;
  if (min < 1) rel = '방금 전';
  else if (min < 60) rel = `${min}분 전`;
  else if (min < 1440) rel = `${Math.round(min / 60)}시간 전`;
  else rel = `${Math.round(min / 1440)}일 전`;
  const p = (n) => String(n).padStart(2, '0');
  const abs = `${d.getMonth() + 1}/${d.getDate()} ${p(d.getHours())}:${p(d.getMinutes())}`;
  return `${rel} · ${abs}`;
}

export function SnapshotRecovery() {
  const { getSnapshots, deleteSnapshotAt, captureSnapshot, replaceMaster } = useDataStore();
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // 모달을 열 때(그리고 적재 버전이 바뀔 때)마다 최신 목록을 읽는다.
  const snapshots = open ? getSnapshots() : [];

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 4000); };

  const handleRestore = (snap) => {
    const when = fmtTime(snap.at);
    if (!window.confirm(`이 시점(${when})으로 되돌립니다.\n\n· 현재 작성 내용은 되돌리기 전에 자동 백업으로 한 번 더 보관됩니다.\n· 복원 후 페이지가 새로고침됩니다.\n\n계속할까요?`)) return;
    try {
      captureSnapshot(true); // 현재 상태를 안전하게 먼저 백업
      const merged = mergeWithDefaults(snap.master);
      replaceMaster(merged);
      syncLegacyFromMaster(merged);
      showToast('이전 버전으로 복원했습니다. 페이지를 새로고침합니다…');
      setTimeout(() => window.location.reload(), 1300);
    } catch (e) {
      showToast('오류: ' + e.message);
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm('이 자동 백업 시점을 삭제할까요?')) return;
    deleteSnapshotAt(id);
  };

  return (
    <>
      <button onClick={() => setOpen(true)} style={btnStyle} title="자동으로 보관된 이전 작성 시점으로 되돌립니다">
        이전 버전 복구
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(14,39,80,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: SPACING.md }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: COLORS.white, borderRadius: RADIUS.lg, maxWidth: 560, width: '100%', maxHeight: '80vh', overflowY: 'auto', padding: SPACING.xl, fontFamily: FONT.family, boxShadow: '0 12px 36px rgba(0,0,0,0.18)', borderTop: `4px solid ${COLORS.accent2}` }}
          >
            <h2 style={{ margin: 0, fontSize: FONT.size.xl, color: COLORS.ink, fontWeight: FONT.weight.bold }}>이전 버전 복구 (자동 백업)</h2>
            <p style={{ color: COLORS.sub, fontSize: 18, marginTop: SPACING.sm, marginBottom: SPACING.md, lineHeight: 1.6 }}>
              작성 내용은 이 브라우저에 <strong>5분마다, 그리고 페이지를 벗어날 때</strong> 자동으로 백업됩니다(최근 {10}개). 실수로 삭제·초기화했거나 내용이 사라졌을 때 아래 시점으로 되돌릴 수 있습니다.
            </p>

            {snapshots.length === 0 ? (
              <div style={{ background: COLORS.cream, padding: SPACING.lg, textAlign: 'center', color: COLORS.sub, fontSize: 18, borderRadius: RADIUS.md }}>
                아직 자동 백업이 없습니다.<br />산업·직무를 입력하고 잠시 작성하면 자동으로 쌓이기 시작합니다.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.sm }}>
                {snapshots.map((s, i) => {
                  const sm = s.summary || {};
                  const who = [sm.company, sm.position].filter(Boolean).join(' · ');
                  return (
                    <div key={s.id || s.at} style={{ display: 'flex', alignItems: 'center', gap: SPACING.md, border: `1px solid ${COLORS.line}`, borderRadius: RADIUS.md, padding: `${SPACING.sm}px ${SPACING.md}px` }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 18, color: COLORS.ink, fontWeight: FONT.weight.semibold }}>
                          {fmtTime(s.at)}{i === 0 && <span style={{ color: COLORS.accent2, fontSize: 14, marginLeft: 8 }}>최신</span>}
                        </div>
                        <div style={{ fontSize: 15, color: COLORS.sub, marginTop: 2 }}>
                          {who || '내용 없음'} · 워크북 {sm.workbooks ?? 0}개 · 경험 {sm.experiences ?? 0}개
                        </div>
                      </div>
                      <button onClick={() => handleRestore(s)} style={btnPrimaryStyle}>복구</button>
                      <button onClick={() => handleDelete(s.id || s.at)} style={{ ...btnStyle, color: COLORS.sub, border: `1px solid ${COLORS.line}`, padding: '6px 10px', fontSize: 16 }}>삭제</button>
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: SPACING.md }}>
              <button onClick={() => setOpen(false)} style={{ ...btnStyle, color: COLORS.sub, border: `1px solid ${COLORS.line}` }}>닫기</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div style={{ position: 'fixed', bottom: SPACING.lg, left: '50%', transform: 'translateX(-50%)', background: COLORS.accent, color: COLORS.white, padding: `${SPACING.sm}px ${SPACING.md}px`, fontFamily: FONT.family, fontSize: 20, boxShadow: '0 6px 18px rgba(0,0,0,0.18)', zIndex: 1100 }}>
          {toast}
        </div>
      )}
    </>
  );
}

const btnStyle = {
  background: COLORS.white,
  color: COLORS.accent2,
  border: `1px solid ${COLORS.accent2}`,
  padding: '8px 14px',
  fontFamily: FONT.family,
  fontSize: 20,
  fontWeight: FONT.weight.semibold,
  cursor: 'pointer',
};
const btnPrimaryStyle = {
  ...btnStyle,
  background: COLORS.accent2,
  color: COLORS.white,
  padding: '6px 14px',
  fontSize: 18,
};
