import { useEffect } from 'react';
import { COLORS, FONT, SPACING, RADIUS } from '../design/tokens.js';

export function OverwriteModal({ conflicts, onReplace, onBackupAndReplace, onCancel }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onCancel?.(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  return (
    <div
      onClick={onCancel}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(14,39,80,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: SPACING.md,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: COLORS.white, borderRadius: RADIUS.lg,
          maxWidth: 520, width: '100%', padding: SPACING.xl,
          fontFamily: FONT.family, boxShadow: '0 12px 36px rgba(0,0,0,0.18)',
          borderTop: `4px solid ${COLORS.accent2}`,
        }}
      >
        <h2 style={{
          margin: 0, fontSize: FONT.size.xl, color: COLORS.ink,
          fontWeight: FONT.weight.bold,
        }}>
          현재 작업 중인 내용이 있습니다
        </h2>
        <p style={{
          color: COLORS.sub, fontSize: FONT.size.sm,
          marginTop: SPACING.sm, marginBottom: SPACING.md,
        }}>
          가져올 파일이 현재 데이터와 충돌합니다. 어떻게 처리할까요?
        </p>

        <div style={{
          background: COLORS.bgAlt, borderRadius: RADIUS.md,
          padding: SPACING.md, marginBottom: SPACING.lg,
        }}>
          <p style={{
            fontSize: FONT.size.xs, color: COLORS.accent2,
            fontWeight: FONT.weight.semibold, margin: 0, marginBottom: SPACING.sm,
            letterSpacing: 0.5, textTransform: 'uppercase',
          }}>
            충돌 필드 ({conflicts.length}개)
          </p>
          <ul style={{ margin: 0, paddingLeft: SPACING.md, color: COLORS.ink, fontSize: FONT.size.sm, lineHeight: FONT.lineHeight.base }}>
            {conflicts.map((c, i) => (
              <li key={i}>
                <strong>{c.field}</strong>: {c.current} (현재) / {c.incoming} (가져올 값)
              </li>
            ))}
          </ul>
        </div>

        <div style={{ display: 'flex', gap: SPACING.sm, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={btnGhost}>취소</button>
          <button onClick={onReplace} style={btnSecondary}>그대로 교체</button>
          <button onClick={onBackupAndReplace} style={btnPrimary}>현재 백업 후 교체</button>
        </div>
      </div>
    </div>
  );
}

const btnBase = {
  fontFamily: FONT.family, fontSize: FONT.size.sm,
  padding: '10px 16px', borderRadius: RADIUS.md, cursor: 'pointer',
  fontWeight: FONT.weight.semibold,
};
const btnPrimary = { ...btnBase, background: COLORS.accent, color: COLORS.white, border: 'none' };
const btnSecondary = { ...btnBase, background: COLORS.white, color: COLORS.accent, border: `1px solid ${COLORS.accent}` };
const btnGhost = { ...btnBase, background: 'transparent', color: COLORS.sub, border: `1px solid ${COLORS.line}` };
