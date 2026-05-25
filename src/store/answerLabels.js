// 클릭형(객관식) 답변의 코드값(new / 0 / 2 등)을 지원자가 실제로 선택한 문구로 변환.
// 문서·백업에 코드가 그대로 노출되지 않도록 export 시 사용한다.
// 자유서술 답변(자소서 등)은 매핑이 없으므로 원문을 그대로 반환한다.

// career_roadmap 진단(QS) 선택지: questionId → { 코드값: 선택 문구 }
const ROADMAP = {
  who: { new: '첫 취업 준비 중 (학부)', grad: '첫 취업 준비 중 (대학원)', career: '이직 준비 중 (같은 직무)', switch: '직무를 바꾸려고 해요 (경력직)' },
  job: { 0: '아직 안 정함', 1: '대략 정함', 2: '확실히 정함' },
  jd: { 0: '잘 모름 (30% 이하)', 1: '대략 이해 (30~70%)', 2: '충분히 이해 (70% 이상)' },
  exp: { 0: '안 해봄', 1: '머릿속으로만 생각해봄', 2: '문서로 정리하고 직무와 연결함' },
  resume: { 0: '없음', 1: '있지만 범용', 2: '직무에 맞게 커스터마이즈함' },
  career_desc: { 0: '없음', 1: '있지만 미흡', 2: '잘 정리되어 있음' },
  essay: { 0: '아직 안 써봄', 1: '쓰고 있는 중', 2: '제출했는데 계속 탈락', 3: '서류 통과 경험 있음', '-1': '해당사항 없음 (자소서 미요구)' },
  essay_pass_rate: { 0: '통과율 30% 미만', 1: '통과율 30~70%', 2: '통과율 70% 이상' },
  interview: { 0: '아직 안 해봄', 1: '예상 질문은 생각해봄', 2: '답변 정리하고 소리 내어 연습함' },
};

// experience 페르소나 선택지
const EXPERIENCE = {
  status: { fresh: '신입 취업 준비 중', experienced: '경력직(같은 직무 이직)', transfer: '직무 전환(다른 직무로)' },
};

const MAPS = {
  career_roadmap: ROADMAP,
  experience: EXPERIENCE,
};

// (workbookKey, questionId, value) → 사람이 읽을 수 있는 선택 문구.
// 매핑이 없으면 원래 값(자유서술 등)을 그대로 반환.
export function decodeAnswer(workbookKey, questionId, value) {
  if (value === undefined || value === null) return '';
  const wb = MAPS[workbookKey];
  const opt = wb && wb[questionId];
  if (opt) {
    const hit = opt[value] ?? opt[String(value)];
    if (hit != null) return hit;
  }
  return value;
}
