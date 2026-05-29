// personality 워크북 — 공통 엔진(EssayWorkbook)에 config 주입.
import { EssayWorkbook } from '../_essay/EssayWorkbook.jsx';
import { round1Steps, round2Questions, round3Questions } from './data.js';
import { buildEssayDocxChildren } from '../../store/workbookDocx.js';

const config = {
  workbookKey: 'personality',
  storageKey: 'careerengineer_personality_v1',
  docxTitle: "성격 장단점",
  docxPayloadTitle: "성격의 장단점",
  fileNamePrefix: "성격 장단점",
  completedHeader: "성격의 장단점 완성",
  completedEditLabel: "완성본 (수정 가능)",
  evaluationEyebrow: "CAREERENGINEER · 자소서 워크북 · 2라운드 진입",
  focusArea: ['motivation','difficulty','number','autonomy'],
  basicInfoFields: [["position", "지원하고자 하는 직무", "예: 기구 설계, 기계 설계, 전자 설계 등"], ["company", "지원하고자 하는 회사명", "예: 삼성전자, 현대자동차 등"]],
  genLetter: (answers) => {
    const parts = [];
    if (answers.connect_adv_core) parts.push(answers.connect_adv_core);
    if (answers.connect_adv_evidence) parts.push('\n' + answers.connect_adv_evidence);
    if (answers.connect_adv_contribution) parts.push('\n' + answers.connect_adv_contribution);
    if (answers.connect_dis_recognition) parts.push('\n' + answers.connect_dis_recognition);
    if (answers.connect_dis_growth) parts.push('\n' + answers.connect_dis_growth);
    return parts.join('\n\n');
  },
  getRawText: (answers, basicInfo) => `원본 답변 모음\n\n[기본 정보]\n직무: ${basicInfo.position||'-'}\n회사: ${basicInfo.company||'-'}\n\n`,
  computeProgress: ({ currentPhase, currentPart, round1Steps, round2Questions, round3Questions, selectedSteps, answers }) => { const ALL_ANS_KEYS = ['q1_1','q1_2','q1_3','q1_4','q1_5','q1_6','q1_7','q2_1','q2_2','q2_3','q2_4','connect_adv_core','connect_adv_evidence','connect_adv_contribution','connect_dis_growth','connect_dis_recognition']; return Math.round(ALL_ANS_KEYS.filter((k) => (answers[k] || '').trim().length > 1).length / ALL_ANS_KEYS.length * 100); },
  buildDocxChildren: (payload, docxLib) => buildEssayDocxChildren('personality', payload, docxLib),
  round1Steps, round2Questions, round3Questions,
  completedGuide: {
    headerLabel: "INFO · 내 답변 활용 가이드",
    intro: "3라운드 연결 답변을 우선 사용. 없으면 각 Q 답변에서 핵심만 골라 연결하세요.",
    sections: [
      { title: "도입부 — 장점 정의 + 증거 (Q1)", items: [ { key: "connect_adv_core", label: "연결 ①→③ (권장)", recommended: true } ], example: "연결 예시: \"\\\"이 장점이 이런 상황에서 이렇게 발휘됐습니다...\\\"\"" },
      { title: "중반부 — 지속성과 성과 (Q4·Q5)", items: [ { key: "connect_adv_evidence", label: "연결 ④→⑤ (권장)", recommended: true } ], example: "연결 예시: \"\\\"꾸준한 성과로 증명되었습니다...\\\"\"" },
      { title: "후반부 — 직무 기여 (Q6·Q7)", items: [ { key: "connect_adv_contribution", label: "연결 ⑥→⑦ (권장)", recommended: true } ], example: "연결 예시: \"\\\"이 장점이 이 직무에서 이렇게 작용합니다...\\\"\"" },
      { title: "단점 — 인식과 결심 (Q8→Q9)", items: [ { key: "connect_dis_recognition", label: "연결 ⑧→⑨ (권장)", recommended: true } ], example: "연결 예시: \"\\\"이 단점을 인식하고 이렇게 관리합니다...\\\"\"" },
      { title: "마무리 — 관리와 성장 (Q10→Q11)", items: [ { key: "connect_dis_growth", label: "연결 ⑩→⑪ (권장)", recommended: true } ], example: "연결 예시: \"\\\"지속적으로 관리하며 성장해왔습니다...\\\"\"" },
    ],
  },
  finalChecklist: [
                  { n: "①", q: "Q1: 장점이 직무와 연결되고 증거가 있는가?", miss: "Q1-1, Q1-2" },
                { n: "②", q: "Q2: 단점이 치명적이지 않고 극복 노력이 보이는가?", miss: "Q2-1, Q2-2" },
                { n: "③", q: "Q3: 장단점이 하나의 일관된 인격으로 드러나는가?", miss: "Q3-1" }
                ],
  intro: {
    stepLabel: "STEP 4 · 성격 장단점 작성",
    title: "성격 장단점",
    subtitle: "3라운드 체계적 작성으로 완성하는 성격 장단점 항목",
    flow: [
          { label: '1라운드', desc: '장단점 핵심 — Q1 장점(형성·발전·성과·연결) / Q2 단점(인지·극복·성장)' },
          { label: '2라운드', desc: '약한 부분 보강 — 부족한 답변을 심화 질문으로 구체화' },
          { label: '3라운드', desc: '연결 및 완성 — 직무 연결성 확보' },
        ],
    flowTitle: "3라운드 작성 시스템",
    prerequisites: [
          {
            text: '지원할 회사의 채용공고 (직무상세내용)',
            recommend: {
              workbookId: 'job_analysis',
              condition: '어떤 장점을 강조할지 막막하다면',
              linkLabel: '채용공고 및 직무분석 가이드',
            },
          },
          {
            text: '장단점을 증명할 구체 경험',
            recommend: {
              workbookId: 'experience',
              condition: '경험을 아직 정리하지 못했다면',
              linkLabel: '경험정리 가이드 워크북',
            },
          },
        ],
    helpTitle: "성격 장단점 워크북 사용 안내",
    helpSteps: [
          '<strong>1라운드 → 2라운드 → 3라운드</strong> 순서로 진행하세요.',
          '장단점은 <strong>구체적 경험</strong>으로 증명하고, <strong>직무와 연결</strong>합니다.',
          '단점은 <strong>가짜 단점</strong>("너무 열심히 한다")이 아닌 진짜 개선 중인 점이어야 합니다.',
          '3라운드 완료 후 <strong>최종 자소서 형태</strong>로 출력됩니다.',
        ],
  },
};

export default function Workbook() {
  return <EssayWorkbook config={config} />;
}
