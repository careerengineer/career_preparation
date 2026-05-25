import { Link } from 'react-router-dom';
import { COLORS, FONT, SPACING, RULE } from '../shared/design/tokens.js';

// 각 워크북에서 핵심적으로 신경 써야 할 한 문장
const STEP_HINT = {
  career_roadmap: '내 준비 상태를 진단해 가장 약한 단계부터 공략하세요.',
  job_analysis: '채용공고의 용어를 그대로 내 분석의 출발점으로 삼으세요.',
  experience: '사소한 경험도 STAR로 정리해 쓸 "재료"를 최대한 많이 확보하세요.',
  resume: '직무 키워드를 이력서 곳곳에 노출시켜 시스템과 사람 모두를 통과하세요.',
  career_description: '팀 성과가 아니라 "내가 한 일"을 숫자로 분리해 적으세요.',
  motivation: '"왜 이 직무·이 회사인가"를 남이 못 쓸 내 경험으로만 답하세요.',
  jobcompetency: '강점 나열이 아니라 직무 키워드에 연결되는 역량을 증거와 함께 쓰세요.',
  careergoal: '회사의 방향과 내 성장 경로가 만나는 지점을 구체적으로 보여주세요.',
  personality: '범용 표현 말고, 경험으로 증명되는 장점 한 가지에 집중하세요.',
  goalachievement: '목표를 수치로 정의하고 달성 과정을 단계로 보여주세요.',
  self_introduction: '첫 문장에 직무 핵심 키워드 + 나만의 한 줄 정체성을 던지세요.',
  interview_new: '각 답변을 "두괄식 → 경험 → 수치" 구조로 30초 안에 끝내세요.',
  interview_career: '퇴사 사유는 짧고 긍정적으로, 성과는 수치로 분리해 말하세요.',
};

function progressBadge(progress) {
  if (progress >= 100) return { label: '완료', bg: COLORS.accent, color: COLORS.white };
  if (progress >= 80)  return { label: '거의 완성', bg: COLORS.bgAlt, color: COLORS.accent };
  if (progress >= 50)  return { label: '작성 중', bg: COLORS.bgAlt, color: COLORS.goldDeep };
  if (progress >= 20)  return { label: '시작함', bg: COLORS.cream, color: COLORS.goldDeep };
  if (progress > 0)    return { label: '진행 시작', bg: COLORS.cream, color: COLORS.sub };
  return { label: '시작 전', bg: COLORS.cream, color: COLORS.sub };
}

export default function StepCard({ workbook, progress }) {
  const badge = progressBadge(progress);
  return (
    <Link
      to={`/workbook/${workbook.key}`}
      style={{
        display: 'flex', flexDirection: 'column', gap: SPACING.sm,
        background: COLORS.white,
        border: RULE,
        borderTop: `2px solid ${COLORS.accent2}`,
        padding: SPACING.md,
        textDecoration: 'none',
        color: 'inherit',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        minHeight: 130,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 14px rgba(14,39,80,0.10)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ flex: 1 }}>
        <p style={{
          margin: 0,
          fontSize: 22,
          fontWeight: FONT.weight.bold,
          color: COLORS.ink,
          lineHeight: 1.3,
          letterSpacing: '-0.3px',
        }}>
          {workbook.title}
        </p>
        {STEP_HINT[workbook.key] && (
          <p style={{
            margin: '6px 0 0',
            fontSize: 15,
            color: COLORS.sub,
            lineHeight: 1.5,
            fontWeight: FONT.weight.regular,
          }}>
            {STEP_HINT[workbook.key]}
          </p>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.sm, flexWrap: 'wrap' }}>
        <span style={{
          background: badge.bg, color: badge.color,
          fontSize: 16, fontWeight: FONT.weight.semibold,
          padding: '4px 10px',
          letterSpacing: 1, textTransform: 'uppercase',
        }}>
          {badge.label}
        </span>
        {progress > 0 && (
          <span style={{ fontSize: 16, color: COLORS.sub, fontWeight: FONT.weight.semibold }}>
            {progress}%
          </span>
        )}
      </div>
      {/* 진행률 바 */}
      <div style={{
        height: 4, background: COLORS.cream,
        overflow: 'hidden', marginTop: 4,
      }}>
        <div style={{
          height: '100%', width: `${progress}%`,
          background: progress >= 100 ? COLORS.accent : COLORS.accent2,
          transition: 'width 0.4s ease',
        }} />
      </div>
    </Link>
  );
}
