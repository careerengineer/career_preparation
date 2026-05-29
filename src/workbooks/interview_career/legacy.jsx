// interview_career 워크북 — 공통 면접 엔진(InterviewWorkbook)에 config 주입.
import { InterviewWorkbook } from '../_interview/InterviewWorkbook.jsx';
import { QUESTIONS } from './questions.js';

const config = {
  workbookKey: 'interview_career',
  storageKey: 'careerengineer_interview_career_v1',
  docxInnerTitle: "경 력 면 접 답변집",
  docxPayloadTitle: "경력직 면접",
  docxTitle: "경력 면접 답변집",
  fileNamePrefix: "경력 면접",
  brandEyebrow: "경력 면접 워크북",
  focusArea: ['autonomy', 'number', 'difficulty', 'connection'],
  mentoringLinks: [['경력 면접 준비 가이드북','https://www.latpeed.com/products/j3RfY'],['면접 유형별 답변 전략','https://www.latpeed.com/products/O-KKc'],['면접 멘토링 — 모의 면접과 실전 피드백','https://www.latpeed.com/products/tZ5xw'],['이직 컨설팅','https://www.latpeed.com/products/LimF9']],
  QUESTIONS,
  computeProgress: ({ QUESTIONS, currentIdx, getQuestionStatus }) => ((currentIdx + 1) / QUESTIONS.length) * 100,
  tailRules: [
    { re: "\\d+\\s*[%개건명년원배점]", q: "그 수치는 어떻게 측정한 건가요?", tip: "측정 방법과 비교 대상(전·후, 목표 대비)을 준비하세요" },
    { re: "팀|협업|함께|동료|조직", q: "그 안에서 본인의 구체적인 역할과 기여는 무엇이었나요?", tip: "본인이 주도한 부분과 협업한 부분을 분리해 답변" },
    { re: "데이터|분석|지표|성과", q: "그 성과를 어떤 지표·데이터로 증명할 수 있나요?", tip: "정량 지표와 측정 방법을 구체적으로" },
    { re: "리더|주도|이끌|설득|관리", q: "이해관계가 충돌했을 때 어떻게 조율했나요?", tip: "구체적 갈등 상황과 본인의 조율 방식" },
    { re: "이직|퇴사|전환", q: "왜 지금 이 시점에 이직을 결심했나요?", tip: "현 직장 비판 대신 성장·도전 관점으로" },
  ],
  intro: {
    stepLabel: "STEP 5 · 경력 면접 준비",
    title: "경력 면접 준비",
    subtitle: "27개 빈출 질문에 대한 답변을 미리 준비합니다",
    flow: [
          { label: 'PART 1', desc: '자기소개와 이직 사유' },
          { label: 'PART 2', desc: '왜 이 회사, 이 직무' },
          { label: 'PART 3', desc: '경력과 역량 — 핵심 성과 증명' },
          { label: 'PART 4', desc: '직무 전문성 — 도메인·기술 깊이' },
          { label: 'PART 5', desc: '상황 대응 — 협업·리더십·문제해결' },
          { label: 'PART 6', desc: '마무리 질문 — 역질문 준비' },
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
            text: '경력기술서 (작성 완료)',
            recommend: {
              workbookId: 'career_description',
              condition: '경력기술서가 아직이라면',
              linkLabel: '경력기술서 작성 워크북',
            },
          },
          {
            text: '본인의 핵심 성과 자료 (구체적인 수치·결과 포함)',
            recommend: {
              workbookId: 'experience',
              condition: '경험·성과 정리가 안 되어 있다면',
              linkLabel: '경험정리 가이드 워크북',
            },
          },
        ],
    helpTitle: "경력 면접 준비 워크북 사용 안내",
    helpSteps: [
          '27개 빈출 질문이 6개 PART로 구성되어 있습니다. <strong>PART 1부터 순서대로</strong> 작성하세요.',
          '경력 면접은 <strong>구체적 성과와 숫자</strong>로 답변해야 합니다.',
          '이직 사유는 <strong>전 회사 비방 없이</strong> 성장 관점에서 설명하세요.',
          '마지막에 <strong>소리내어 연습</strong>하며 시간을 측정하세요.',
        ],
  },
};

export default function Workbook() {
  return <InterviewWorkbook config={config} />;
}
