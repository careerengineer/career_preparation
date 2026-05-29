// goalachievement 워크북 — 공통 엔진(EssayWorkbook)에 config 주입.
import { EssayWorkbook } from '../_essay/EssayWorkbook.jsx';
import { round1Steps, round2Questions, round3Questions } from './data.js';
import { buildEssayDocxChildren } from '../../store/workbookDocx.js';

const config = {
  workbookKey: 'goalachievement',
  storageKey: 'careerengineer_goalachievement_v1',
  docxTitle: "목표수립 및 달성",
  docxPayloadTitle: "목표수립·달성",
  fileNamePrefix: "목표수립 및 달성",
  completedHeader: "목표 수립 및 달성 완성",
  completedEditLabel: "완성본 (수정 가능)",
  evaluationEyebrow: "CAREERENGINEER · 자소서 워크북 · 2라운드 진입",
  focusArea: ['difficulty','number','autonomy','motivation'],
  basicInfoFields: [["position", "지원하고자 하는 직무", "예: 공정엔지니어, 기구설계, 회로설계 등"], ["company", "지원하고자 하는 회사명", "예: 삼성전자, LG전자 등"], ["experience", "목표달성 경험 (간단히)", "예: 기구 설계 프로젝트 3개 완성"]],
  genLetter: (answers) => {
    const parts = [];
    if (answers.connect_full) {
      parts.push(answers.connect_full);
    } else {
      if (answers.connect_q1q2) parts.push(answers.connect_q1q2);
      else { if (answers.q1_1_1) parts.push(answers.q1_1_1); if (answers.q1_1_2) parts.push(answers.q1_1_2); }
      if (answers.connect_q2q3) parts.push('\n' + answers.connect_q2q3);
      else { if (answers.q1_2_1) parts.push('\n' + answers.q1_2_1); if (answers.q1_3_1) parts.push(answers.q1_3_1); if (answers.q1_3_2) parts.push(answers.q1_3_2); }
      if (answers.connect_q3q4) parts.push('\n' + answers.connect_q3q4);
      else { if (answers.q1_4_1) parts.push('\n' + answers.q1_4_1); if (answers.q1_4_2) parts.push(answers.q1_4_2); }
      if (answers.connect_q4q6) parts.push('\n' + answers.connect_q4q6);
      else { if (answers.q1_4_3) parts.push('\n' + answers.q1_4_3); if (answers.q1_6_1) parts.push(answers.q1_6_1); if (answers.q1_6_2) parts.push(answers.q1_6_2); if (answers.q1_6_3) parts.push('\n' + answers.q1_6_3); }
    }
    return parts.join('\n\n');
  },
  getRawText: (answers, basicInfo) => `원본 답변 모음\n\n[기본 정보]\n직무: ${basicInfo.position||'-'}\n회사: ${basicInfo.company||'-'}\n목표달성 경험: ${basicInfo.experience||'-'}\n\n[Q1: 목표 정의]\nQ1-1 목표 정의: ${answers.q1_1_1||'-'}\nQ1-2 기대효과: ${answers.q1_1_2||'-'}\nQ1-3 쉽지 않은 이유: ${answers.q1_1_3||'-'}\n\n[Q2: 계획 수립]\nQ2-1 계획: ${answers.q1_2_1||'-'}\nQ2-2 계획의 기대: ${answers.q1_2_2||'-'}\n\n[Q3: 실행과 극복]\nQ3-1 달랐던 점: ${answers.q1_3_1||'-'}\nQ3-2 극복 방법: ${answers.q1_3_2||'-'}\n\n[Q4: 결과와 임팩트]\nQ4-1 달성 결과: ${answers.q1_4_1||'-'}\nQ4-2 기대효과 달성: ${answers.q1_4_2||'-'}\nQ4-3 임팩트: ${answers.q1_4_3||'-'}\n\n[Q5: 노력 과정]\nQ5-1 노력 방식: ${answers.q1_5_1||'-'}\nQ5-2 차별화 접근: ${answers.q1_5_2||'-'}\n\n[Q6: 배움과 기여]\nQ6-1 배운 것: ${answers.q1_6_1||'-'}\nQ6-2 직무 연결: ${answers.q1_6_2||'-'}\nQ6-3 기여 방안: ${answers.q1_6_3||'-'}\n\n[3라운드 연결]\nQ1→Q2: ${answers.connect_q1q2||'-'}\nQ2→Q3: ${answers.connect_q2q3||'-'}\nQ3→Q4: ${answers.connect_q3q4||'-'}\nQ4→Q6: ${answers.connect_q4q6||'-'}\n최종 완성: ${answers.connect_full||'-'}`,
  computeProgress: ({ currentPhase, currentPart, round1Steps, round2Questions, round3Questions, selectedSteps, answers }) => currentPhase === 'round1' ? ((currentPart + 1) / round1Steps.length) * 33 : currentPhase === 'round2' ? 33 + ((currentPart + 1) / Math.max(selectedSteps.length, 1)) * 33 : 66 + ((currentPart + 1) / round3Questions.length) * 34,
  buildDocxChildren: (payload, docxLib) => buildEssayDocxChildren('goalachievement', payload, docxLib),
  round1Steps, round2Questions, round3Questions,
  completedGuide: {
    headerLabel: "INFO · 내 답변 활용 가이드",
    intro: "3라운드 연결 답변을 우선 사용. 없으면 각 Q 답변에서 핵심만 골라 연결하세요.",
    sections: [
      { title: "도입부 — 목표 정의 + 기대효과 (Q1)", items: [ { key: "connect_q1q2", label: "연결 Q1→Q2 (권장)", recommended: true }, { key: "q1_1_1", label: "목표 정의 (Q1-1)" } ], example: "연결 예시: \"\\\"이 목표였기 때문에 이 계획이 필요했습니다...\\\"\"" },
      { title: "중반부 — 계획과 실행·극복 (Q2·Q3)", items: [ { key: "connect_q2q3", label: "연결 Q2→Q3 (권장)", recommended: true }, { key: "q1_3_1", label: "달랐던 점 (Q3-1)" } ], example: "연결 예시: \"\\\"계획과 달랐고, 그래서 이렇게 했습니다...\\\"\"" },
      { title: "후반부 — 결과와 임팩트 (Q4)", items: [ { key: "connect_q3q4", label: "연결 Q3→Q4 (권장)", recommended: true }, { key: "q1_4_1", label: "달성 결과 (Q4-1)" } ], example: "연결 예시: \"\\\"이 과정의 결과는 이렇게 검증됐습니다...\\\"\"" },
      { title: "마무리 — 배움과 기여 (Q6)", items: [ { key: "connect_q4q6", label: "연결 Q4→Q6 (권장)", recommended: true }, { key: "q1_6_1", label: "배운 것 (Q6-1)" } ], example: "연결 예시: \"\\\"이 경험이 입사 후 이런 방식으로 발휘됩니다...\\\"\"" },
      { title: "최종 — 하나의 완결된 스토리", items: [ { key: "connect_full", label: "최종 연결 (권장)", recommended: true } ], example: "연결 예시: \"\\\"전체 흐름을 하나의 이야기로...\\\"\"" },
    ],
  },
  finalChecklist: [
                  { n: "①", q: "Q1: 목표가 수치·기한·범위로 측정 가능한가? (SMART)", miss: "Q1-1, Q1-2" },
                { n: "②", q: "Q2: 계획이 단계별로 구체적이고 논리적인가?", miss: "Q2-1" },
                { n: "③", q: "Q3: 예상과 달랐던 점과 극복 방식이 드러나는가?", miss: "Q3-1, Q3-2" },
                { n: "④", q: "Q4: 결과가 숫자와 임팩트로 증명되는가?", miss: "Q4-1, Q4-3" },
                { n: "⑤", q: "Q6: 배움이 직무 기여로 이어지는가?", miss: "Q6-1, Q6-2, Q6-3" }
                ],
  intro: {
    stepLabel: "STEP 4 · 목표수립 및 달성 작성",
    title: "목표수립 및 달성",
    subtitle: "3라운드 체계적 작성으로 완성하는 목표 달성 경험",
    flow: [
          { label: '1라운드', desc: '목표 달성 6단계 — Q1 목표 정의 / Q2 계획 수립 / Q3 실행과 극복 / Q4 결과·임팩트 / Q5 노력 과정 / Q6 배움·기여' },
          { label: '2라운드', desc: '약한 부분 보강 — 부족한 Q를 심화 질문으로 구체화' },
          { label: '3라운드', desc: '연결 및 완성 — 6개 Q를 자연스러운 흐름으로 정리' },
        ],
    flowTitle: "3라운드 작성 시스템",
    prerequisites: [
          {
            text: '지원할 회사의 채용공고 (직무상세내용)',
            recommend: {
              workbookId: 'job_analysis',
              condition: '직무 분석이 필요하다면',
              linkLabel: '채용공고 및 직무분석 가이드',
            },
          },
          {
            text: '목표를 세우고 달성한 본인의 경험',
            recommend: {
              workbookId: 'experience',
              condition: '경험 정리가 안 되어 있다면',
              linkLabel: '경험정리 가이드 워크북',
            },
          },
        ],
    helpTitle: "목표수립 및 달성 워크북 사용 안내",
    helpSteps: [
          '<strong>1라운드 → 2라운드 → 3라운드</strong> 순서로 진행하세요.',
          '목표·과정·결과는 <strong>구체적 숫자와 사실</strong>로 표현합니다.',
          '노력 과정과 배움·기여까지 6단계로 정리해야 깊이 있는 답변이 됩니다.',
          '3라운드 완료 후 <strong>최종 자소서 형태</strong>로 출력됩니다.',
        ],
  },
};

export default function Workbook() {
  return <EssayWorkbook config={config} />;
}
