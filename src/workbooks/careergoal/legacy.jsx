// careergoal 워크북 — 공통 엔진(EssayWorkbook)에 config 주입.
import { EssayWorkbook } from '../_essay/EssayWorkbook.jsx';
import { round1Steps, round2Questions, round3Questions } from './data.js';
import { buildEssayDocxChildren } from '../../store/workbookDocx.js';

const config = {
  workbookKey: 'careergoal',
  storageKey: 'careerengineer_careergoal_v1',
  docxTitle: "입사후 포부",
  docxPayloadTitle: "입사후 포부",
  fileNamePrefix: "입사후 포부",
  completedHeader: "입사 후 포부 완성",
  completedEditLabel: "완성본 (수정 가능)",
  evaluationEyebrow: "CAREERENGINEER · 자소서 워크북 · 2라운드 진입",
  focusArea: ['motivation','connection','autonomy'],
  basicInfoFields: [["position", "지원하고자 하는 직무", "예: 공정엔지니어, 기구설계, 회로설계 등"], ["company", "지원하고자 하는 회사명", "예: 삼성전자, LG전자 등"], ["industry", "지원하고자 하는 산업", "예: 반도체, 자동차, 디스플레이 등"]],
  genLetter: (answers) => {
    const parts = [];

    // Q1: 직무 핵심 이해 + 나의 현재
    if (answers.connect_q1) parts.push(answers.connect_q1);
    else {
      if (answers.q1_1_1) parts.push(answers.q1_1_1);
      if (answers.q1_2_1) parts.push(answers.q1_2_1);
      if (answers.q1_2_2) parts.push(answers.q1_2_2);
    }

    // Q2: 역량 갭 → 확보 계획 → 범위 확장
    if (answers.connect_q2) parts.push('\n' + answers.connect_q2);
    else {
      if (answers.q1_3_1) parts.push('\n' + answers.q1_3_1);
      if (answers.q1_3_2) parts.push(answers.q1_3_2);
      if (answers.q1_3_3) parts.push(answers.q1_3_3);
    }

    // Q3: 단기 성과 → 중기 다음 단계
    if (answers.connect_q3) parts.push('\n' + answers.connect_q3);
    else {
      if (answers.q1_q4_1) parts.push('\n' + answers.q1_q4_1);
    }

    // Q4: 개인 성장 → 조직 기여 큰 그림
    if (answers.connect_q4) parts.push('\n' + answers.connect_q4);
    else {
      if (answers.q1_q4_2) parts.push('\n' + answers.q1_q4_2);
    }

    return parts.join('\n\n');
  },
  getRawText: (answers, basicInfo) => `원본 답변 모음\n\n[기본 정보]\n산업: ${basicInfo.industry || '-'}\n직무: ${basicInfo.position || '-'}\n회사: ${basicInfo.company || '-'}\n\n[Q1: 직무 핵심 이해]\nQ1-1 핵심 업무·본질: ${answers.q1_1_1 || '-'}\nQ1-2 성과자 역량: ${answers.q1_1_2 || '-'}\nQ1-3 연계 팀·역할: ${answers.q1_1_3 || '-'}\n\n[Q2: 현재 역량 진단]\nQ2-1 보유 역량: ${answers.q1_2_1 || '-'}\nQ2-2 부족한 역량: ${answers.q1_2_2 || '-'}\nQ2-3 이미 시작한 노력: ${answers.q1_2_3 || '-'}\n\n[Q3: 역량 확보 및 범위 확장 계획]\nQ3-1 역량별 확보 방법+시기: ${answers.q1_3_1 || '-'}\nQ3-2 업무 범위 확장: ${answers.q1_3_2 || '-'}\nQ3-3 측정 기준+1년 후 수준: ${answers.q1_3_3 || '-'}\n\n[Q4: 다음 단계와 큰 그림]\nQ4-1 다음 역할+준비 경로: ${answers.q1_q4_1 || '-'}\nQ4-2 조직 기여+회사 방향 연결: ${answers.q1_q4_2 || '-'}\n\n[3라운드 연결 질문]\n연결Q1 (직무핵심+현재): ${answers.connect_q1 || '-'}\n연결Q2 (역량갭→확보→확장): ${answers.connect_q2 || '-'}\n연결Q3 (단기→중기다음단계): ${answers.connect_q3 || '-'}\n연결Q4 (개인성장→조직기여): ${answers.connect_q4 || '-'}`,
  computeProgress: ({ currentPhase, currentPart, round1Steps, round2Questions, round3Questions, selectedSteps, answers }) => currentPhase === 'round1' ? ((currentPart + 1) / round1Steps.length) * 33 : currentPhase === 'round2' ? 33 + ((currentPart + 1) / Math.max(selectedSteps.length, 1)) * 33 : 66 + ((currentPart + 1) / round3Questions.length) * 34,
  buildDocxChildren: (payload, docxLib) => buildEssayDocxChildren('careergoal', payload, docxLib),
  round1Steps, round2Questions, round3Questions,
  completedGuide: {
    headerLabel: "INFO · 내 답변 활용 가이드",
    intro: "3라운드 연결 답변을 우선 사용. 없으면 각 Q 답변에서 핵심만 골라 연결하세요.",
    sections: [
      { title: "도입부 — 직무 핵심 이해 (Q1)", items: [ { key: "connect_q1", label: "연결 Q1 (권장)", recommended: true } ], example: "연결 예시: \"\\\"이 직무의 본질은 이것이고...\\\"\"" },
      { title: "중반부 — 역량 갭 진단과 확보 (Q2·Q3)", items: [ { key: "connect_q2", label: "연결 Q2 (권장)", recommended: true } ], example: "연결 예시: \"\\\"부족한 역량을 이렇게 확보합니다...\\\"\"" },
      { title: "후반부 — 단기 → 중기 다음 단계 (Q3·Q4)", items: [ { key: "connect_q3", label: "연결 Q3 (권장)", recommended: true } ], example: "연결 예시: \"\\\"단기 목표가 달성되면 다음 단계로...\\\"\"" },
      { title: "마무리 — 개인 성장 → 조직 기여 (Q4)", items: [ { key: "connect_q4", label: "연결 Q4 (권장)", recommended: true } ], example: "연결 예시: \"\\\"나의 성장이 회사의 방향과 맞물려...\\\"\"" },
    ],
  },
  finalChecklist: [
                  { n: "①", q: "Q1: 직무 핵심을 본질 수준에서 이해했는가?", miss: "Q1-1, Q1-2" },
                { n: "②", q: "Q2: 현재 보유·부족 역량을 정직하게 진단했는가?", miss: "Q2-1, Q2-2" },
                { n: "③", q: "Q3: 역량 확보 계획이 수치·기한으로 검증 가능한가?", miss: "Q3-1, Q3-3" },
                { n: "④", q: "Q4: 조직 기여가 회사 방향과 연결되는가?", miss: "Q4-2" }
                ],
  intro: {
    stepLabel: "STEP 4 · 입사후 포부 작성",
    title: "입사후 포부",
    subtitle: "3라운드 체계적 작성으로 완성하는 입사후 포부 항목",
    flow: [
          { label: '1라운드', desc: '포부 핵심 — Q1 직무에서 진짜 중요한 것 / Q2 지금 나는 어디에 / Q3 무엇을 어떻게 준비·확장 / Q4 다음 단계와 큰 그림' },
          { label: '2라운드', desc: '약한 부분 보강 — 부족한 Q를 심화 질문으로 구체화' },
          { label: '3라운드', desc: '연결 및 완성 — 회사 비전·방향성과의 연결' },
        ],
    flowTitle: "3라운드 작성 시스템",
    prerequisites: [
          {
            text: '지원할 회사의 채용공고 및 회사 자료',
            recommend: {
              workbookId: 'job_analysis',
              condition: '회사·직무 분석이 필요하다면',
              linkLabel: '채용공고 및 직무분석 가이드',
            },
          },
          { text: '회사의 비전·미션·중장기 전략 자료 (선택)' },
          {
            text: '현재 본인의 역량과 경험',
            recommend: {
              workbookId: 'experience',
              condition: '경험을 아직 정리하지 못했다면',
              linkLabel: '경험정리 가이드 워크북',
            },
          },
        ],
    helpTitle: "입사후 포부 워크북 사용 안내",
    helpSteps: [
          '<strong>1라운드 → 2라운드 → 3라운드</strong> 순서로 진행하세요.',
          '포부는 <strong>회사의 방향성</strong>과 <strong>본인의 역량</strong>이 만나는 지점에서 만들어집니다.',
          'Q1에서 <strong>직무상세내용 키워드를 직접 인용</strong>하고, Q4에서 회사 방향성과 연결하세요.',
          '3라운드 완료 후 <strong>최종 자소서 형태</strong>로 출력됩니다.',
        ],
  },
};

export default function Workbook() {
  return <EssayWorkbook config={config} />;
}
