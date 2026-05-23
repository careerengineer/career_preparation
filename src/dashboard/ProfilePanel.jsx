import { useDataStore } from '../store/DataContext.jsx';
import { COLORS, FONT, SPACING, RULE } from '../shared/design/tokens.js';
import ResetCompanyButton from './ResetCompanyButton.jsx';

export default function ProfilePanel() {
  const { master, updateSlice } = useDataStore();
  const { industry, position, company } = master.profile;
  const empty = !industry && !position && !company;

  const onChange = (field) => (e) => updateSlice('profile', { [field]: e.target.value });

  return (
    <section style={{
      background: COLORS.white,
      border: RULE,
      borderTop: `3px solid ${COLORS.accent2}`,
      padding: SPACING.lg,
      marginBottom: SPACING.lg,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: SPACING.md, flexWrap: 'wrap', marginBottom: SPACING.md }}>
        <h2 style={{
          margin: 0, fontSize: 24, color: COLORS.ink,
          fontWeight: FONT.weight.bold, letterSpacing: '-0.3px',
        }}>
          어떤 직무에 지원하나요?
        </h2>
        <ResetCompanyButton />
      </div>
      {empty && (
        <p style={{
          color: COLORS.sub, fontSize: 20,
          margin: `0 0 ${SPACING.md}px`,
          lineHeight: FONT.lineHeight.base,
        }}>
          여기에 적으면 모든 워크북에 자동으로 들어갑니다.
        </p>
      )}
      <div style={{
        marginTop: SPACING.md,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: SPACING.md,
      }}>
        <LabeledInput label="산업" value={industry} placeholder="예: 반도체" onChange={onChange('industry')} />
        <LabeledInput label="직무" value={position} placeholder="예: 공정엔지니어" onChange={onChange('position')} />
        <LabeledInput label="회사" value={company} placeholder="예: 삼성전자" onChange={onChange('company')} />
      </div>
    </section>
  );
}

function LabeledInput({ label, value, placeholder, onChange }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{
        fontSize: 20, color: COLORS.sub,
        fontWeight: FONT.weight.semibold,
        letterSpacing: 1.5, textTransform: 'uppercase',
      }}>
        {label}
      </span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        style={{
          fontFamily: FONT.family, fontSize: 20, color: COLORS.ink,
          padding: '10px 12px', border: `1px solid ${COLORS.line}`,
          background: COLORS.cream,
          outline: 'none',
        }}
      />
    </label>
  );
}
