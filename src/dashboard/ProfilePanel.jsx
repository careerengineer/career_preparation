import { useDataStore } from '../store/DataContext.jsx';
import { COLORS, FONT, SPACING, RADIUS } from '../shared/design/tokens.js';

export default function ProfilePanel() {
  const { master, updateSlice } = useDataStore();
  const { industry, position, company } = master.profile;
  const empty = !industry && !position && !company;

  const onChange = (field) => (e) => updateSlice('profile', { [field]: e.target.value });

  return (
    <section style={{
      background: COLORS.white,
      borderLeft: `3px solid ${COLORS.accent2}`,
      borderRadius: RADIUS.lg,
      padding: SPACING.lg,
      marginBottom: SPACING.lg,
    }}>
      <h2 style={{
        margin: 0, fontSize: FONT.size.lg, color: COLORS.ink,
        fontWeight: FONT.weight.semibold, marginBottom: SPACING.sm,
      }}>
        기본정보
      </h2>
      {empty && (
        <p style={{ color: COLORS.sub, fontSize: FONT.size.sm, marginTop: 0, marginBottom: SPACING.md, lineHeight: FONT.lineHeight.base }}>
          먼저 어떤 직무에 지원하나요? 기본정보를 입력하면 모든 워크북에 자동 적용됩니다.
        </p>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: SPACING.md }}>
        <LabeledInput label="산업" value={industry} placeholder="예: 반도체" onChange={onChange('industry')} />
        <LabeledInput label="직무" value={position} placeholder="예: 공정엔지니어" onChange={onChange('position')} />
        <LabeledInput label="회사" value={company} placeholder="예: 삼성전자" onChange={onChange('company')} />
      </div>
    </section>
  );
}

function LabeledInput({ label, value, placeholder, onChange }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontSize: FONT.size.xs, color: COLORS.sub, fontWeight: FONT.weight.semibold }}>{label}</span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        style={{
          fontFamily: FONT.family, fontSize: FONT.size.base, color: COLORS.ink,
          padding: '10px 12px', border: `1px solid ${COLORS.line}`,
          borderRadius: RADIUS.md, background: COLORS.bg,
          outline: 'none',
        }}
      />
    </label>
  );
}
