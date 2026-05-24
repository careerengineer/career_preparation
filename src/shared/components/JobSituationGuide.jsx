import { useState } from 'react';
import { COLORS, FONT, SPACING, RADIUS } from '../design/tokens.js';

// 면접 답변 전략을 지원자의 직무 상황(신입/전환/관련/같은직무)에 맞게 안내.
// 자체 상태만 사용 — 어떤 저장/데이터도 변경하지 않는다 (import/export 무영향).
const OPTIONS = [
  { key: 'fresh', label: '신입 (모든 게 처음)', desc: '학습 의지 + 작은 자발성도 가치' },
  { key: 'same', label: '같은 직무로 지원 (직무 경험 있음)', desc: '직무 깊이를 보여주는 게 핵심' },
  { key: 'related', label: '다른 직무로 전환 (관련 분야)', desc: '전이 가능한 역량 강조' },
  { key: 'new', label: '완전히 새로운 직무 (경험 부족 우려)', desc: '학습 속도와 주도성 강조' },
];

const STRATEGY = {
  fresh: {
    title: '신입 — 학습 의지와 작은 자발성',
    intro: '실무자는 완성된 실력이 아니라 "빠르게 배우고 스스로 움직이는 사람인가"를 봅니다.',
    use: ['사소해도 본인이 먼저 시작·자청한 경험', '낯선 일을 단기간에 익힌 경험', '결과가 숫자로 남은 경험'],
    must: ['왜 직접 시작했는지(계기)', '왜 어려웠는지(난이도)', '어떻게 해냈는지(주도성)'],
  },
  same: {
    title: '같은 직무 — 깊이와 시야',
    intro: '같은 직무 경험자에겐 "얼마나 깊이 있게, 주도적으로 해왔는가"가 평가 축입니다.',
    use: ['직무 핵심 성과를 수치로 증명하는 경험', '문제를 스스로 정의하고 개선한 경험', '시니어 관점(우선순위·트레이드오프) 판단 경험'],
    must: ['성과의 정량 증명(수치)', '본인이 주도한 부분의 분리', '직무 전문성으로의 연결'],
  },
  related: {
    title: '관련 직무 전환 — 전이 가능한 역량',
    intro: '"기존 경력의 무엇이 새 직무에 그대로 쓰이는가"를 키워드 단위로 보여주세요.',
    use: ['새 직무 요구역량과 겹치는 기존 경험', '도메인은 달라도 방법론·태도가 통하는 경험', '전환을 위해 자발적으로 준비한 흔적'],
    must: ['전이 가능한 역량의 명시적 매핑', '왜 전환하는지의 설득력', '새 직무에서의 기여 연결'],
  },
  new: {
    title: '완전히 새로운 직무 — 학습 속도·주도성',
    intro: '직무 경력이 없어도 실무자는 "어려운 상황을 주도적으로 풀어낸 패턴이 반복되는가"를 봅니다.',
    use: ['처음 해보는 영역에서 빠르게 학습한 경험', '자료가 부족한 상황에서 스스로 답을 찾은 경험', '결과가 명확한 숫자로 나타난 경험'],
    must: ['왜 직접 시작했는지(계기)', '왜 어려웠는지(난이도)', '어떻게 해냈는지(주도성)', '새 직무로의 전이가능성'],
  },
};

export function JobSituationGuide() {
  const [sit, setSit] = useState('');

  if (!sit) {
    return (
      <div style={{ background: COLORS.bgAlt, borderRadius: RADIUS.base, padding: SPACING.md, marginBottom: SPACING.lg, border: `1px solid ${COLORS.border}` }}>
        <p style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color: COLORS.accent, margin: 0, marginBottom: 4 }}>본인의 상황을 먼저 알려주세요</p>
        <p style={{ fontSize: FONT.size.xs, color: COLORS.sub, margin: 0, marginBottom: SPACING.md }}>선택에 따라 답변 전략 안내가 달라집니다. (선택은 저장되지 않습니다)</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.sm }}>
          {OPTIONS.map((o) => (
            <button key={o.key} onClick={() => setSit(o.key)}
              style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.sm, padding: SPACING.sm, textAlign: 'left', cursor: 'pointer', fontFamily: FONT.family }}>
              <div style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color: COLORS.accent }}>{o.label}</div>
              <div style={{ fontSize: FONT.size.xs, color: COLORS.sub, marginTop: 2 }}>{o.desc}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const s = STRATEGY[sit];
  return (
    <div style={{ background: COLORS.cream, borderLeft: `4px solid ${COLORS.accent2}`, borderRadius: RADIUS.sm, padding: SPACING.md, marginBottom: SPACING.lg }}>
      <p style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.bold, color: COLORS.goldDeep, margin: 0, marginBottom: SPACING.sm }}>{s.title}</p>
      <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0, marginBottom: SPACING.sm, lineHeight: FONT.lineHeight.relaxed }}>{s.intro}</p>
      <p style={{ fontSize: FONT.size.xs, fontWeight: FONT.weight.semibold, color: COLORS.accent, margin: `0 0 4px` }}>우선 활용할 경험</p>
      <ul style={{ fontSize: FONT.size.xs, color: COLORS.sub, paddingLeft: 18, margin: `0 0 ${SPACING.sm}px`, lineHeight: FONT.lineHeight.relaxed }}>
        {s.use.map((t, i) => <li key={i}>{t}</li>)}
      </ul>
      <p style={{ fontSize: FONT.size.xs, fontWeight: FONT.weight.semibold, color: COLORS.red, margin: `0 0 4px` }}>답변에서 빠뜨리지 말 것</p>
      <ul style={{ fontSize: FONT.size.xs, color: COLORS.sub, paddingLeft: 18, margin: 0, lineHeight: FONT.lineHeight.relaxed }}>
        {s.must.map((t, i) => <li key={i}>{t}</li>)}
      </ul>
      <button onClick={() => setSit('')} style={{ background: 'transparent', border: 'none', color: COLORS.sub, fontSize: FONT.size.xs, marginTop: SPACING.sm, cursor: 'pointer', textDecoration: 'underline', fontFamily: FONT.family }}>
        상황 다시 선택
      </button>
    </div>
  );
}
