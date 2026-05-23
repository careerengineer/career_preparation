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
  const raws = items.filter((i) => i.kind.startsWith('raw_'));

  return (
    <div style={{
      background: COLORS.bgAlt,
      borderLeft: `3px solid ${COLORS.accent2}`,
      padding: SPACING.md,
      marginBottom: SPACING.lg,
    }}>
      <div style={{ marginBottom: SPACING.sm }}>
        <p style={{
          fontSize: FONT.size.caption,
          fontWeight: FONT.weight.semibold,
          color: COLORS.accent2,
          margin: 0,
          letterSpacing: 1.8, textTransform: 'uppercase',
        }}>
          REFERENCE · 이전 워크북에서 작성한 관련 내용
        </p>
        <p style={{
          fontSize: FONT.size.caption, color: COLORS.sub,
          margin: '4px 0 0', lineHeight: FONT.lineHeight.base,
        }}>
          항목을 클릭하면 텍스트가 미리보기로 열립니다. 복사해서 필요한 답변 칸에 붙여넣어 활용하세요.
        </p>
      </div>

      {profile && (
        <Group label="기본 정보">
          <Chip onClick={() => onImport(profile)} icon="📋" label={profile.label} />
        </Group>
      )}

      {jobAna && (
        <Group label="채용공고 · 직무 분석">
          <Chip onClick={() => onImport(jobAna)} icon="🎯" label={jobAna.label} />
        </Group>
      )}

      {experiences.length > 0 && (
        <Group label={`정리한 경험 (${experiences.length}개)`}>
          {experiences.map((e) => (
            <Chip key={e.id} onClick={() => onImport(e)} icon="💼" label={e.label} />
          ))}
        </Group>
      )}

      {outputs.length > 0 && (
        <Group label="완성한 자소서 · 답변">
          {outputs.map((o) => (
            <Chip key={o.kind} onClick={() => onImport(o)} icon="✅" label={o.label} />
          ))}
        </Group>
      )}

      {raws.length > 0 && (
        <Group label="작성 중인 다른 워크북">
          {raws.map((r) => (
            <Chip key={r.kind} onClick={() => onImport(r)} icon="📝" label={r.label} />
          ))}
        </Group>
      )}
    </div>
  );
}

function Group({ label, children }) {
  return (
    <div style={{ marginTop: SPACING.sm }}>
      <p style={{
        fontSize: FONT.size.xs, color: COLORS.sub,
        margin: 0, marginBottom: 6,
        fontWeight: FONT.weight.semibold,
        letterSpacing: 1, textTransform: 'uppercase',
      }}>
        {label}
      </p>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{children}</div>
    </div>
  );
}

function Chip({ onClick, icon, label }) {
  return (
    <button onClick={onClick} style={{
      background: COLORS.white,
      border: `1px solid ${COLORS.line}`,
      borderRadius: RADIUS.pill,
      padding: '6px 14px',
      fontSize: FONT.size.body,
      color: COLORS.accent,
      cursor: 'pointer',
      fontFamily: FONT.family,
      display: 'inline-flex', alignItems: 'center', gap: 6,
      transition: 'background 0.15s ease, border-color 0.15s ease',
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = COLORS.cream;
        e.currentTarget.style.borderColor = COLORS.accent2;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = COLORS.white;
        e.currentTarget.style.borderColor = COLORS.line;
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}
