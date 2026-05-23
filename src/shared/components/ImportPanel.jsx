import { useDataStore } from '../../store/DataContext.jsx';
import { getImportableItems } from '../../store/selectors.js';
import { COLORS, FONT, SPACING, RADIUS } from '../design/tokens.js';

export function ImportPanel({ workbookKey, onImport }) {
  const { master } = useDataStore();
  const items = getImportableItems(master, workbookKey);

  if (items.length === 0) return null;

  const profile = items.find((i) => i.kind === 'profile');
  const jobAna = items.find((i) => i.kind === 'job_analysis');
  const experiences = items.filter((i) => i.kind === 'experience');
  const outputs = items.filter((i) => i.kind.startsWith('output_'));

  return (
    <div style={{
      background: COLORS.bgAlt,
      borderLeft: `3px solid ${COLORS.accent2}`,
      borderRadius: RADIUS.md,
      padding: SPACING.md,
      marginBottom: SPACING.lg,
    }}>
      <p style={{
        fontSize: FONT.size.sm,
        fontWeight: FONT.weight.semibold,
        color: COLORS.accent2,
        margin: 0, marginBottom: SPACING.sm,
        letterSpacing: 0.5, textTransform: 'uppercase',
      }}>
        IMPORT · 이전 작성 가져오기
      </p>

      {profile && (
        <div style={{ marginBottom: SPACING.sm }}>
          <button onClick={() => onImport(profile)} style={chipStyle}>
            📋 {profile.label}
          </button>
        </div>
      )}

      {jobAna && (
        <div style={{ marginBottom: SPACING.sm }}>
          <button onClick={() => onImport(jobAna)} style={chipStyle}>
            🎯 {jobAna.label}
          </button>
        </div>
      )}

      {experiences.length > 0 && (
        <div style={{ marginBottom: SPACING.sm }}>
          <p style={{ fontSize: FONT.size.xs, color: COLORS.sub, margin: 0, marginBottom: 6 }}>
            정리한 경험 ({experiences.length}개)
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {experiences.map((e) => (
              <button key={e.id} onClick={() => onImport(e)} style={chipStyle}>
                💼 {e.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {outputs.length > 0 && (
        <div>
          <p style={{ fontSize: FONT.size.xs, color: COLORS.sub, margin: 0, marginBottom: 6 }}>
            완성한 자소서/답변
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {outputs.map((o) => (
              <button key={o.kind} onClick={() => onImport(o)} style={chipStyle}>
                📝 {o.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const chipStyle = {
  background: COLORS.white,
  border: `1px solid ${COLORS.line}`,
  borderRadius: RADIUS.pill,
  padding: '6px 12px',
  fontSize: FONT.size.sm,
  color: COLORS.accent,
  cursor: 'pointer',
  fontFamily: FONT.family,
};
