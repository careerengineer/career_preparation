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
        <div style={{
          background: COLORS.bgAlt,
          borderLeft: `3px solid ${COLORS.accent2}`,
          padding: SPACING.md,
          margin: `0 0 ${SPACING.md}px`,
        }}>
          <p style={{
            margin: 0, fontSize: 20, color: COLORS.ink,
            lineHeight: FONT.lineHeight.base,
            fontWeight: FONT.weight.semibold,
          }}>
            처음 사용하시나요? — 이 순서로 진행하세요
          </p>
          <ol style={{
            margin: '8px 0 0', paddingLeft: 24,
            fontSize: 20, color: COLORS.sub, lineHeight: 1.7,
          }}>
            <li><strong>산업·직무·회사 입력</strong> — 위 칸에 입력하면 모든 워크북에 자동으로 채워집니다.</li>
            <li><strong>STEP 0 취업 로드맵</strong> — 몇 가지 질문으로 내 준비 상태를 진단하고, 가장 보완할 단계를 알려줍니다.</li>
            <li><strong>STEP 1~5를 순서대로</strong> — ① 채용공고·직무 분석 → ② 경험 정리 → ③ 이력서·경력기술서 → ④ 자소서 → ⑤ 면접. 각 워크북은 이전 단계 내용을 참고해 자동으로 이어집니다.</li>
            <li><strong>참고 자료 버튼 활용</strong> — 각 워크북 <strong>오른쪽 아래의 [참고 자료] 버튼</strong>을 누르면, 앞 단계에서 작성한 내용(경험·직무분석·자소서 등)을 바로 보고 답변 칸에 넣을 수 있습니다. 처음부터 다시 쓰지 마세요.</li>
            <li><strong>자동 저장 + 파일 백업</strong> — 작성 내용은 이 브라우저에 자동 저장됩니다. 백업하거나 다른 기기에서 이어 쓰려면 상단 <strong>[전체내용 저장]</strong>으로 파일을 받아 두고, <strong>[가져오기]</strong>로 복원하세요.</li>
            <li><strong>여러 회사 지원</strong> — 다른 회사에도 지원한다면 <strong>[회사 변경]</strong>으로 회사 관련 내용만 비우거나(경험·로드맵은 유지), 아래 회사별 저장본에 따로 보관하세요.</li>
          </ol>
        </div>
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
