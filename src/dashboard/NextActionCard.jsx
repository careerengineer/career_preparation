import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDataStore } from '../store/DataContext.jsx';
import { getNextRecommendation } from '../store/selectors.js';
import { COLORS, FONT, SPACING } from '../shared/design/tokens.js';

export default function NextActionCard() {
  const { master } = useDataStore();
  // master 변경마다 재계산되지만 결과가 같으면 동일 reference 유지 → 깜빡임 방지
  const rec = useMemo(() => getNextRecommendation(master), [
    master.profile.industry, master.profile.position, master.profile.company,
    master.roadmap.completedAt, master.roadmap.weakestStep,
    master.experiences.length,
    JSON.stringify(master.workbookRaw || {}),
  ]);

  // profile 비어있으면 ProfilePanel의 빈 상태 안내가 같은 역할을 하므로 숨김
  if (rec.kind === 'profile') return null;

  const inner = (
    <>
      <span style={{
        fontSize: 20, color: COLORS.accent2,
        fontWeight: FONT.weight.semibold,
        letterSpacing: 3, textTransform: 'uppercase',
      }}>
        NEXT · 다음 단계
      </span>
      <p style={{
        margin: '10px 0 0', fontSize: 24,
        fontWeight: FONT.weight.bold, color: COLORS.white,
        letterSpacing: '-0.4px',
        lineHeight: 1.35,
      }}>
        {rec.label}
      </p>
      {rec.kind === 'workbook' && (
        <p style={{
          margin: '12px 0 0', fontSize: 20,
          color: COLORS.accent2, letterSpacing: 1.5,
          textTransform: 'uppercase', fontWeight: FONT.weight.semibold,
        }}>
          시작하기
        </p>
      )}
    </>
  );

  const style = {
    display: 'block',
    background: COLORS.accent,
    color: COLORS.white,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    textDecoration: 'none',
  };

  if (rec.kind === 'workbook') {
    return <Link to={`/workbook/${rec.workbookKey}`} style={style}>{inner}</Link>;
  }
  return <div style={style}>{inner}</div>;
}
