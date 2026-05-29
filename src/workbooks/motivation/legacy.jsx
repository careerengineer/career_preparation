// 지원동기 워크북 — 공통 엔진(EssayWorkbook)에 config만 주입.
import { EssayWorkbook } from '../_essay/EssayWorkbook.jsx';
import { round1Steps, round2Questions, round3Questions } from './data.js';
import { buildMotivationDocxChildren } from '../../store/workbookDocx.js';

const config = {
  workbookKey: 'motivation',
  storageKey: 'careerengineer_motivation_v1',
  title: '지원동기',
  focusArea: ['motivation', 'connection', 'number', 'autonomy'],
  genLetter: (answers) => {
    const p = [];
    if (answers.connect_q1q2) p.push(answers.connect_q1q2); else { if (answers.q1_1) p.push(answers.q1_1); if (answers.q1_2) p.push(answers.q1_2); if (answers.q2_1) p.push('\n' + answers.q2_1); }
    if (answers.connect_q2q3) p.push('\n' + answers.connect_q2q3); else { if (answers.q3_1) p.push('\n' + answers.q3_1); if (answers.q3_2) p.push(answers.q3_2); }
    if (answers.connect_q3q4) p.push('\n' + answers.connect_q3q4); else { if (answers.q4_1) p.push('\n' + answers.q4_1); if (answers.q4_2) p.push(answers.q4_2); }
    return p.join('\n\n');
  },
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
