// 직무확보역량 워크북 — 공통 엔진(EssayWorkbook)에 config 주입.
import { EssayWorkbook } from '../_essay/EssayWorkbook.jsx';
import { round1Steps, round2Questions, round3Questions } from './data.js';
import { buildEssayDocxChildren } from '../../store/workbookDocx.js';

const config = {
  workbookKey: 'jobcompetency',
  storageKey: 'careerengineer_jobcompetency_v1',
  docxTitle: '직무역량',
  docxPayloadTitle: '직무확보역량',
  fileNamePrefix: '직무역량',
  completedHeader: '직무 확보 역량 완성',
  completedEditLabel: '완성본 (수정 가능)',
  focusArea: ['number', 'autonomy', 'difficulty', 'connection'],
  genLetter: (answers) => {
    const parts = [];

    // 1단락: 역량 선언
    if (answers.connect_para1) parts.push(answers.connect_para1);
    else {
      if (answers.q1_2) parts.push(answers.q1_2);
      if (answers.q1_3) parts.push(answers.q1_3);
    }

    // 2단락: 계기와 쌓아온 과정
    if (answers.connect_para2) parts.push('\n' + answers.connect_para2);
    else {
      if (answers.q2_1) parts.push('\n' + answers.q2_1);
      if (answers.q2_2) parts.push(answers.q2_2);
      if (answers.q2_3) parts.push(answers.q2_3);
    }

    // 3단락: 역량으로 해낸 것
    if (answers.connect_para3) parts.push('\n' + answers.connect_para3);
    else {
      if (answers.q3_1) parts.push('\n' + answers.q3_1);
      if (answers.q3_2) parts.push(answers.q3_2);
      if (answers.q3_3) parts.push(answers.q3_3);
    }

    // 4단락: 직무 키워드 연결
    if (answers.connect_para4) parts.push('\n' + answers.connect_para4);
    else {
      if (answers.q4_1) parts.push('\n' + answers.q4_1);
      if (answers.q4_2) parts.push(answers.q4_2);
    }

    return parts.join('\n\n');
  },
  getRawText: (answers, basicInfo) => `원본 답변 모음\n\n[기본 정보]\n산업: ${basicInfo.industry || '-'}\n직무: ${basicInfo.position || '-'}\n회사: ${basicInfo.company || '-'}\n\n[Q1: 이 직무에서 무엇이 요구되는가]\nQ1-1 핵심 업무 3가지: ${answers.q1_1 || '-'}\nQ1-2 잘하는 사람을 가르는 핵심 역량: ${answers.q1_2 || '-'}\nQ1-3 내가 보유한 역량: ${answers.q1_3 || '-'}\n\n[Q2: 이 역량을 어떻게 갖게 됐고 어떻게 쌓아왔는가]\nQ2-1 계기: ${answers.q2_1 || '-'}\nQ2-2 의도적 과정: ${answers.q2_2 || '-'}\nQ2-3 반복 패턴: ${answers.q2_3 || '-'}\n\n[Q3: 이 역량으로 무엇을 해냈는가]\nQ3-1 성취와 결과: ${answers.q3_1 || '-'}\nQ3-2 역량의 인과관계: ${answers.q3_2 || '-'}\nQ3-3 현재 수준: ${answers.q3_3 || '-'}\n\n[Q4: 이 역량이 이 직무에서 어떻게 작동하는가]\nQ4-1 직무 키워드 연결: ${answers.q4_1 || '-'}\nQ4-2 왜 그렇게 생각하는가: ${answers.q4_2 || '-'}\nQ4-3 단계적 성장 목표: ${answers.q4_3 || '-'}\n\n[3라운드 연결 질문]\n1단락(역량 선언): ${answers.connect_para1 || '-'}\n2단락(계기·과정): ${answers.connect_para2 || '-'}\n3단락(성취·수준): ${answers.connect_para3 || '-'}\n4단락(직무 연결): ${answers.connect_para4 || '-'}`,
  computeProgress: ({ currentPhase, currentPart, round1Steps, round2Questions, round3Questions, selectedSteps, answers }) => currentPhase === 'round1' ? ((currentPart + 1) / round1Steps.length) * 33 : currentPhase === 'round2' ? 33 + ((currentPart + 1) / Math.max(selectedSteps.length, 1)) * 33 : 66 + ((currentPart + 1) / round3Questions.length) * 34,
  buildDocxChildren: (payload, docxLib) => buildEssayDocxChildren('jobcompetency', payload, docxLib),
  round1Steps, round2Questions, round3Questions,
  evaluationEyebrow: 'CareerEngineer · 자소서 워크북 · 2라운드 진입',
  basicInfoFields: [["position", "지원하고자 하는 직무", "예: 기구 설계, 기계 설계, 전자 설계 등"], ["company", "지원하고자 하는 회사명", "예: 삼성전자, 현대자동차 등"], ["industry", "지원하고자 하는 산업", "예: 자동차, 전자, 기계 등"]],
  completedGuide: {
    headerLabel: 'INFO · 내 답변 활용 가이드',
    intro: "3라운드 연결 답변을 우선 사용. 없으면 각 Q 답변에서 핵심만 골라 연결하세요.",
    sections: [
      { title: "1단락 — 역량 선언", items: [ { key: "connect_para1", label: "연결 1단락 (권장)", recommended: true } ], example: "연결 예시: \"\\\"저의 핵심 역량은 이것입니다...\\\"\"" },
      { title: "2단락 — 계기와 쌓아온 과정", items: [ { key: "connect_para2", label: "연결 2단락 (권장)", recommended: true } ], example: "연결 예시: \"\\\"이 역량은 이렇게 쌓였습니다...\\\"\"" },
      { title: "3단락 — 성취와 현재 수준", items: [ { key: "connect_para3", label: "연결 3단락 (권장)", recommended: true } ], example: "연결 예시: \"\\\"이 역량으로 이런 성취를...\\\"\"" },
      { title: "4단락 — 직무 연결과 기여", items: [ { key: "connect_para4", label: "연결 4단락 (권장)", recommended: true } ], example: "연결 예시: \"\\\"이 역량이 이 직무에 이렇게 작동합니다...\\\"\"" },
    ],
  },
  finalChecklist: [
                  { n: "①", q: "Q1: 직무의 핵심 업무·역량을 현직자 관점에서 파악했는가?", miss: "Q1-1, Q1-2" },
                { n: "②", q: "Q2: 역량의 계기와 쌓아온 과정이 구체적인가?", miss: "Q2-1, Q2-2" },
                { n: "③", q: "Q3: 성취 결과가 수치로 증명되는가?", miss: "Q3-1, Q3-2" },
                { n: "④", q: "Q4: 역량이 직무 키워드와 1:1로 연결되는가?", miss: "Q4-1" }
                ],
  intro: {
    stepLabel: "STEP 4 · 직무역량 작성",
    title: "직무역량",
    subtitle: "3라운드 체계적 작성으로 완성하는 직무역량 항목",
    flow: [
          { label: '1라운드', desc: '직무역량 핵심 — Q1 무엇이 요구되는가 / Q2 어떻게 갖췄는가 / Q3 무엇을 해냈는가 / Q4 직무에서 어떻게 작동하는가' },
          { label: '2라운드', desc: '약한 부분 보강 — 부족한 Q를 심화 질문으로 구체화' },
          { label: '3라운드', desc: '연결 및 완성 — 4개 Q를 자연스러운 4단락으로 연결' },
        ],
    flowTitle: "3라운드 작성 시스템",
    prerequisites: [
          {
            text: '지원할 회사의 채용공고 (직무상세내용)',
            recommend: {
              workbookId: 'job_analysis',
              condition: '직무 키워드 추출이 필요하다면',
              linkLabel: '채용공고 및 직무분석 가이드',
            },
          },
          {
            text: '역량의 근거가 될 본인의 경험과 성과',
            recommend: {
              workbookId: 'experience',
              condition: '경험 정리가 안 되어 있다면',
              linkLabel: '경험정리 가이드 워크북',
            },
          },
        ],
    helpTitle: "직무역량 워크북 사용 안내",
    helpSteps: [
          '<strong>1라운드 → 2라운드 → 3라운드</strong> 순서로 진행하세요.',
          '직무역량은 반드시 <strong>구체적 경험과 성과</strong>로 증명해야 합니다.',
          '각 Q는 최종 글의 1~4단락 재료가 됩니다 — Q1은 역량 선언, Q4는 직무 연결.',
          '3라운드 완료 후 <strong>최종 자소서 형태</strong>로 출력됩니다.',
        ],
  },
};

export default function CompetencyWorkbook() {
  return <EssayWorkbook config={config} />;
}
