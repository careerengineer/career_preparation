// formative_experiences 워크북 — 공통 엔진(EssayWorkbook)에 config 주입.
import { EssayWorkbook } from '../_essay/EssayWorkbook.jsx';
import { round1Steps, round2Questions, round3Questions } from './data.js';
import { buildEssayDocxChildren } from '../../store/workbookDocx.js';

const config = {
  workbookKey: 'formative_experiences',
  storageKey: 'careerengineer_formative_experiences_v1',
  docxTitle: "성장과정",
  docxPayloadTitle: "성장과정",
  fileNamePrefix: "성장과정",
  completedHeader: "성장과정 완성",
  completedEditLabel: "완성본 (수정 가능)",
  evaluationEyebrow: "CareerEngineer · 자소서 워크북 · 2라운드 진입",
  focusArea: ['motivation','difficulty','number','autonomy'],
  basicInfoFields: [["position", "지원하고자 하는 직무", "예: 기구 설계, 기계 설계, 전자 설계 등"], ["company", "지원하고자 하는 회사명", "예: 삼성전자, 현대자동차 등"]],
  genLetter: (answers) => {
    const parts = [];
    if (answers.connect_value_core) parts.push(answers.connect_value_core);
    if (answers.connect_value_test) parts.push('\n' + answers.connect_value_test);
    if (answers.connect_value_proof) parts.push('\n' + answers.connect_value_proof);
    if (answers.connect_growth_recognition) parts.push('\n' + answers.connect_growth_recognition);
    if (answers.connect_growth_direction) parts.push('\n' + answers.connect_growth_direction);
    return parts.join('\n\n');
  },
  getRawText: (answers, basicInfo) => `원본 답변 모음\n\n[기본 정보]\n직무: ${basicInfo.position||'-'}\n회사: ${basicInfo.company||'-'}\n\n`,
  computeProgress: ({ currentPhase, currentPart, round1Steps, round2Questions, round3Questions, selectedSteps, answers }) => { const ALL_ANS_KEYS = ['q1_1','q1_2','q1_3','q1_4','q1_5','q1_6','q1_7','q2_1','q2_2','q2_3','q2_4','connect_value_core','connect_value_test','connect_value_proof','connect_growth_direction','connect_growth_recognition']; return Math.round(ALL_ANS_KEYS.filter((k) => (answers[k] || '').trim().length > 1).length / ALL_ANS_KEYS.length * 100); },
  buildDocxChildren: (payload, docxLib) => buildEssayDocxChildren('formative_experiences', payload, docxLib),
  round1Steps, round2Questions, round3Questions,
  completedGuide: {
    headerLabel: "INFO · 내 답변 활용 가이드",
    intro: "3라운드 연결 답변을 우선 사용. 없으면 각 Q 답변에서 핵심만 골라 연결하세요.",
    sections: [
      { title: "도입부 — 핵심 가치관 + 형성 (①→③)", items: [ { key: "connect_value_core", label: "연결 ①→③ (권장)", recommended: true } ], example: "연결 예시: \"\\\"제 핵심 가치관 ○○은 ○○ 사건에서 ○○의 영향으로 형성됐습니다...\\\"\"" },
      { title: "중반부 — 전환점과 지속성 (④→⑤)", items: [ { key: "connect_value_test", label: "연결 ④→⑤ (권장)", recommended: true } ], example: "연결 예시: \"\\\"결정적 전환점은 ○○이었고, 그 이후 ○○로 일관되게 이어졌습니다...\\\"\"" },
      { title: "후반부 — 대표 경험 + 직무 연결 (⑥→⑦)", items: [ { key: "connect_value_proof", label: "연결 ⑥→⑦ (권장)", recommended: true } ], example: "연결 예시: \"\\\"이 가치관은 ○○ 경험에서 가장 잘 드러났고, 이 직무에서 이렇게 작동합니다...\\\"\"" },
      { title: "성장 — 부족함 인식과 계기 (⑧→⑨)", items: [ { key: "connect_growth_recognition", label: "연결 ⑧→⑨ (권장)", recommended: true } ], example: "연결 예시: \"\\\"과거엔 ○○이 부족했지만, ○○ 계기로 만들어지기 시작했습니다...\\\"\"" },
      { title: "마무리 — 자리잡음과 확장 (⑩→⑪)", items: [ { key: "connect_growth_direction", label: "연결 ⑩→⑪ (권장)", recommended: true } ], example: "연결 예시: \"\\\"이제 ○○이 자리잡았고, 앞으로 ○○로 확장해 가겠습니다...\\\"\"" },
    ],
  },
  finalChecklist: [
                  { n: "①", q: "Q1: 핵심 가치관이 추상적 단어가 아닌 행동·기준으로 드러나는가? 형성 사건과 강점 형성 과정이 보이는가?", miss: "Q1-1, Q1-2" },
                { n: "②", q: "Q2: 과거의 부족함 + 결정적 계기 + 자리잡은 증거(반복·확장·자동화)가 모두 있는가?", miss: "Q2-1, Q2-2, Q2-3" },
                { n: "③", q: "통합: Q1(이미 가진 가치관) + Q2(새로 만들어진 강점)가 한 인격으로 보이는가?", miss: "Q2-심화4" }
                ],
  intro: {
    stepLabel: "STEP 4 · 성장과정 작성",
    title: "성장과정",
    subtitle: "3라운드 체계적 작성으로 완성하는 성장과정 항목",
    flow: [
          { label: '1라운드', desc: '두 축의 성장 — Q1 가치관 형성(핵심 가치관·형성사건·영향인물·전환점·일관성·대표경험·옵션직무연결) / Q2 없었던 것이 만들어진 과정(과거의 부족함·결정적 계기·자리잡은 증거·확장 방향)' },
          { label: '2라운드', desc: '약한 부분 보강 — 부족한 답변을 심화 질문으로 구체화 (Q1 5개 + Q2 6개 심화)' },
          { label: '3라운드', desc: '연결 및 완성 — Q1·Q2 두 축이 한 인격으로 보이도록 연결' },
        ],
    flowTitle: "3라운드 작성 시스템",
    prerequisites: [
          {
            text: '지원할 회사의 채용공고 (직무상세내용) — 직무 연결을 다루는 경우',
            recommend: {
              workbookId: 'job_analysis',
              condition: '가치관과 직무 연결까지 다루려면',
              linkLabel: '채용공고 및 직무분석 가이드',
            },
          },
          {
            text: '두 축(가치관 + 새 강점)의 성장 서사를 증명할 구체 경험',
            recommend: {
              workbookId: 'experience',
              condition: '경험을 아직 정리하지 못했다면',
              linkLabel: '경험정리 가이드 워크북',
            },
          },
        ],
    helpTitle: "성장과정 워크북 사용 안내",
    helpSteps: [
          '<strong>1라운드 → 2라운드 → 3라운드</strong> 순서로 진행하세요.',
          '<strong>Q1은 이미 가진 가치관</strong>, <strong>Q2는 과거에 없었다가 새로 만들어진 강점</strong>입니다. 두 축이 함께 있어야 입체적인 성장과정이 됩니다.',
          '가치관·강점은 <strong>추상적 단어</strong>가 아닌 <strong>행동·기준·선택의 묘사</strong>로 표현하세요.',
          '직무 연결(Q1-7, Q1-심화5)은 <strong>옵션</strong>입니다 — 다른 자소서 항목이 있다면 가볍게, 없다면 깊게 작성하세요.',
          '3라운드 완료 후 <strong>최종 자소서 형태</strong>로 출력됩니다.',
        ],
  },
};

export default function Workbook() {
  return <EssayWorkbook config={config} />;
}
