// 지원동기 워크북 — 공통 엔진(EssayWorkbook)에 config만 주입.
import { EssayWorkbook } from '../_essay/EssayWorkbook.jsx';
import { round1Steps, round2Questions, round3Questions } from './data.js';
import { buildMotivationDocxChildren } from '../../store/workbookDocx.js';

const config = {
  workbookKey: 'motivation',
  storageKey: 'careerengineer_motivation_v1',
  docxTitle: '지원동기',
  docxPayloadTitle: '지원동기',
  fileNamePrefix: '지원동기',
  completedHeader: '지원동기 완성',
  completedEditLabel: '완성된 지원동기 (수정 가능)',
  focusArea: ['motivation', 'connection', 'number', 'autonomy'],
  genLetter: (answers) => {
    const p = [];
    if (answers.connect_q1q2) p.push(answers.connect_q1q2); else { if (answers.q1_1) p.push(answers.q1_1); if (answers.q1_2) p.push(answers.q1_2); if (answers.q2_1) p.push('\n' + answers.q2_1); }
    if (answers.connect_q2q3) p.push('\n' + answers.connect_q2q3); else { if (answers.q3_1) p.push('\n' + answers.q3_1); if (answers.q3_2) p.push(answers.q3_2); }
    if (answers.connect_q3q4) p.push('\n' + answers.connect_q3q4); else { if (answers.q4_1) p.push('\n' + answers.q4_1); if (answers.q4_2) p.push(answers.q4_2); }
    return p.join('\n\n');
  },
  getRawText: (answers, basicInfo) => `원본 답변 모음\n\n[기본 정보]\n산업: ${basicInfo.industry||'-'}\n직무: ${basicInfo.position||'-'}\n회사: ${basicInfo.company||'-'}\n\n[Q1: 왜 이 직무인가]\nQ1-1 관심 계기: ${answers.q1_1||'-'}\nQ1-2 가치관 연결: ${answers.q1_2||'-'}\nQ1-3 성장 경로: ${answers.q1_3||'-'}\n\n[Q2: 왜 이 회사인가]\nQ2-1 차별점: ${answers.q2_1||'-'}\nQ2-2 가치관+회사: ${answers.q2_2||'-'}\n\n[Q3: 무엇을 왜 준비]\nQ3-1 필요 역량: ${answers.q3_1||'-'}\nQ3-2 준비 과정: ${answers.q3_2||'-'}\nQ3-3 업무 연결: ${answers.q3_3||'-'}\n\n[Q4: 어떻게 기여]\nQ4-1 동기→역량→기여: ${answers.q4_1||'-'}\nQ4-2 회사 과제 연결: ${answers.q4_2||'-'}\n\n[3라운드 연결]\nQ1→Q2: ${answers.connect_q1q2||'-'}\nQ2→Q3: ${answers.connect_q2q3||'-'}\nQ3→Q4: ${answers.connect_q3q4||'-'}`,
  allAnsKeys: ['q1_1','q1_2','q1_3','q2_1','q2_2','q3_1','q3_2','q3_3','q4_1','q4_2','connect_q1q2','connect_q2q3','connect_q3q4'],
  completedGuide: {
    intro: '3라운드 연결 답변을 우선 사용. 없으면 아래 Q 답변에서 핵심만 골라 연결하세요.',
    sections: [
      { title: '도입부 — 왜 이 직무 + 왜 이 회사 (Q1·Q2)', items: [ { key: 'connect_q1q2', label: '연결 Q1→Q2 (권장)', recommended: true }, { key: 'q1_1', label: '관심 계기 (Q1-1)' } ], example: '연결 예시: "이 직무를 할 수 있는 곳은 많지만, 귀사를 선택한 이유는..."' },
      { title: '중반부 — 무엇을 왜 준비 (Q3)', items: [ { key: 'connect_q2q3', label: '연결 Q2→Q3 (권장)', recommended: true }, { key: 'q3_2', label: '준비 과정 (Q3-2)' } ], example: '연결 예시: "그 확신이 생긴 이후 본격적으로 준비를 시작했습니다..."' },
      { title: '마무리 — 어떻게 기여 (Q4)', items: [ { key: 'connect_q3q4', label: '연결 Q3→Q4 (권장)', recommended: true }, { key: 'q4_1', label: '동기→역량→기여 (Q4-1)' } ], example: '연결 예시: "이렇게 준비해온 역량이 귀사에서 이런 방식으로..."' },
    ],
  },
  finalChecklist: [
    { n: '①', q: 'Q1: 관심 계기가 구체적 장면+감정이고, 가치관과 연결되는가?', miss: 'Q1-1, Q1-2' },
    { n: '②', q: 'Q2: 회사의 직무분석 없이는 쓸 수 없는 이 회사만의 이유가 있는가?', miss: 'Q2-1 (차별점)' },
    { n: '③', q: 'Q3: 역량 준비의 이유("~하기 위해")가 명시되어 있는가?', miss: 'Q3-1, Q3-2' },
    { n: '④', q: 'Q4: "열심히 하겠다"가 아닌 동기+역량의 인과적 결론인가?', miss: 'Q4-1 인과 연결' },
  ],
  buildDocxChildren: buildMotivationDocxChildren,
  round1Steps, round2Questions, round3Questions,
  intro: {
    stepLabel: 'STEP 4 · 지원동기 작성',
    title: '지원동기',
    subtitle: '3라운드 체계적 작성으로 완성하는 지원동기',
    flow: [
          { label: '1라운드', desc: '기본 지원동기 수립 — Q1 왜 직무 / Q2 왜 회사 / Q3 무엇을 왜 준비 / Q4 어떻게 기여' },
          { label: '2라운드', desc: '약한 부분 보강 — 부족한 Q를 심화 질문으로 구체화' },
          { label: '3라운드', desc: '연결 및 완성 — Q 간 연결로 자연스러운 인과 흐름 만들기' },
        ],
    flowTitle: '3라운드 작성 시스템',
    prerequisites: [
          {
            text: '지원할 회사의 채용공고 및 회사 자료',
            recommend: {
              workbookId: 'job_analysis',
              condition: '회사·직무 분석이 필요하다면',
              linkLabel: '채용공고 및 직무분석 가이드',
            },
          },
          {
            text: '"왜 나인가"를 증명할 본인의 경험',
            recommend: {
              workbookId: 'experience',
              condition: '경험을 아직 정리하지 못했다면',
              linkLabel: '경험정리 가이드 워크북',
            },
          },
        ],
    helpTitle: '지원동기 워크북 사용 안내',
    helpSteps: [
          '<strong>1라운드 → 2라운드 → 3라운드</strong> 순서로 진행하세요. 각 라운드는 이전 답변 위에 쌓입니다.',
          '1라운드 <strong>4개 핵심 질문</strong>은 모두 답해야 다음 라운드로 진행됩니다.',
          '작성은 <strong>3초 자가진단</strong>을 통과한 내용만 — 막연한 표현이 아닌 구체적 사실로.',
          '3라운드 완료 후 <strong>최종 자소서 형태</strong>로 출력됩니다.',
        ],
  },
};

export default function MotivationWorkbook() {
  return <EssayWorkbook config={config} />;
}
