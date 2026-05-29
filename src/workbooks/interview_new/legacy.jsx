// interview_new 워크북 — 공통 면접 엔진(InterviewWorkbook)에 config 주입.
import { InterviewWorkbook } from '../_interview/InterviewWorkbook.jsx';
import { QUESTIONS } from './questions.js';

const config = {
  workbookKey: 'interview_new',
  storageKey: 'careerengineer_interview_new_v1',
  docxInnerTitle: "신 입 면 접 답변집",
  docxPayloadTitle: "신입 면접",
  docxTitle: "신입 면접 답변집",
  fileNamePrefix: "신입 면접",
  brandEyebrow: "신입 면접 워크북",
  focusArea: ['autonomy', 'number', 'difficulty', 'connection'],
  mentoringLinks: [['신입 면접 준비 가이드북','https://www.latpeed.com/products/H7UHo'],['면접 유형별 답변 전략','https://www.latpeed.com/products/O-KKc'],['면접 멘토링 — 모의 면접과 실전 피드백','https://www.latpeed.com/products/tZ5xw'],['CareerEngineer 카카오톡 상담','https://open.kakao.com/me/careerengineer']],
  QUESTIONS,
  computeProgress: ({ QUESTIONS, currentIdx, getQuestionStatus }) => (QUESTIONS.reduce((s, qq) => s + getQuestionStatus(qq), 0) / (QUESTIONS.length * 4)) * 100,
  tailRules: [
    { re: "\\d+\\s*[%개건명년원배점]", q: "그 수치는 어떻게 측정한 건가요?", tip: "측정 방법과 비교 대상(전·후, 목표 대비)을 준비하세요" },
    { re: "팀|협업|함께|동료", q: "팀 안에서 본인의 구체적인 역할은 무엇이었나요?", tip: "본인이 주도한 부분과 협업한 부분을 구분해 답변" },
    { re: "데이터|분석|지표", q: "구체적으로 어떤 데이터를 어떤 도구로 다뤘나요?", tip: "도구명·데이터 규모·분석 방법을 구체적으로" },
    { re: "리더|주도|이끌|설득", q: "의견이 갈렸을 때 어떻게 설득했나요?", tip: "구체적인 대화 사례나 데이터로 설득한 경험" },
    { re: "실패|어려움|문제|갈등", q: "그때 가장 힘들었던 점과 어떻게 극복했나요?", tip: "극복 과정에서의 본인 행동을 구체적으로" },
  ],
  intro: {
    stepLabel: "STEP 5 · 신입 면접 준비",
    title: "신입 면접 준비",
    subtitle: "24개 빈출 질문에 대한 답변을 미리 준비합니다",
    flow: [
          { label: 'PART 1', desc: '나를 소개합니다 — 자기소개·장단점 (Q1~Q3)' },
          { label: 'PART 2', desc: '왜 이 회사, 이 직무 — 지원동기·회사 이해 (Q4~Q7)' },
          { label: 'PART 3', desc: '나의 경험과 역량 — 핵심 경험·강점 증명 (Q8~Q13)' },
          { label: 'PART 4', desc: '직무 전문성 — 전공·기술 이해도 (Q14~Q17)' },
          { label: 'PART 5', desc: '상황 대응 — 갈등·실패·압박 대처 (Q18~Q22)' },
          { label: 'PART 6', desc: '마무리 질문 — 역질문 준비 (Q23~Q24)' },
        ],
    flowTitle: "이 워크북의 PART 구성",
    prerequisites: [
          {
            text: '지원할 회사의 채용공고 (직무상세내용)',
            recommend: {
              workbookId: 'job_analysis',
              condition: '회사·직무 이해가 부족하다면',
              linkLabel: '채용공고 및 직무분석 가이드',
            },
          },
          {
            text: '자소서 작성본 (지원동기·직무역량 등)',
            recommend: {
              workbookId: 'motivation',
              condition: '자소서가 아직이라면',
              linkLabel: '자소서 작성 워크북 (지원동기·직무역량·장단점 등)',
            },
          },
          {
            text: '면접 답변에 활용할 구체 사례',
            recommend: {
              workbookId: 'experience',
              condition: '경험을 아직 정리하지 못했다면',
              linkLabel: '경험정리 가이드 워크북',
            },
          },
        ],
    helpTitle: "신입 면접 준비 워크북 사용 안내",
    helpSteps: [
          '24개 빈출 질문이 6개 PART로 구성되어 있습니다. <strong>PART 1부터 순서대로</strong> 작성하세요.',
          '각 답변은 <strong>STAR 프레임</strong>(상황·과제·행동·결과)으로 작성합니다.',
          '각 질문에는 <strong>예시 답변·꼬리 질문</strong>이 함께 제공됩니다.',
          '마지막에 <strong>소리내어 연습</strong>하며 시간(1분 30초 내외)을 측정하세요.',
        ],
  },
};

export default function Workbook() {
  return <InterviewWorkbook config={config} />;
}
