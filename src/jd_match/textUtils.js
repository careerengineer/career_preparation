const STOPWORDS = new Set([
  '그리고', '또한', '등', '및', '위해', '대한', '통해', '관련', '업무', '경험', '역량',
  '수행', '담당', '우대', '지원', '회사', '직무', '자격', '요건', '조건', '분야', '내용',
  '이상', '이하', '관리', '진행', '수준', '정도', '가능', '필요', '보유', '희망', '우리',
  '저희', '다음', '경우', '사항', '이를', '이에', '그', '이', '저', '것',
]);

// 한국어 형태소 분석 없이도 동작하도록, 특수문자 제거 + 공백 분리 + 불용어 제거만 수행.
// (조사 등 일부는 그대로 남지만, 길이 2 이상 토큰만 쓰므로 매칭 잡음은 제한적)
export function tokenize(text) {
  if (!text) return [];
  const cleaned = String(text)
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .toLowerCase();
  return cleaned
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2 && !STOPWORDS.has(t));
}

export function uniqueTokens(text) {
  return Array.from(new Set(tokenize(text)));
}

// 경험 카드 등 임의의 객체를 매칭용 텍스트로 펼침 (필드명을 모를 때도 동작하도록 범용 처리)
export function flattenToText(value, depth = 0) {
  if (value == null || depth > 4) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (Array.isArray(value)) return value.map((v) => flattenToText(v, depth + 1)).join(' ');
  if (typeof value === 'object') return Object.values(value).map((v) => flattenToText(v, depth + 1)).join(' ');
  return '';
}
