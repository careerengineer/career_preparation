import { uniqueTokens, flattenToText } from './textUtils.js';

// 공고 텍스트에서 섹션 헤딩으로 흔히 쓰이는 표현들
const SECTION_PATTERNS = [
  { key: 'main_tasks', re: /(주요\s*업무|담당\s*업무|업무\s*내용|job\s*description)/i },
  { key: 'qualifications', re: /(자격\s*요건|자격\s*조건|지원\s*자격|필수\s*요건|qualification)/i },
  { key: 'preferred', re: /(우대\s*사항|우대\s*조건|preferred)/i },
];

export const SECTION_LABELS = {
  main_tasks: '주요업무',
  qualifications: '자격요건',
  preferred: '우대사항',
  general: '기타 요구사항',
};

function stripBullet(line) {
  return line.replace(/^\s*[-•·*\d.)\]]+\s*/, '').trim();
}

// 줄바꿈 기준으로 공고를 섹션(주요업무/자격요건/우대사항)별 항목 리스트로 분리.
// 섹션 구분이 전혀 없는 공고도 동작하도록 general → main_tasks로 폴백.
export function parseJobPosting(rawText) {
  const lines = String(rawText || '')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const sections = { main_tasks: [], qualifications: [], preferred: [], general: [] };
  let current = null;

  lines.forEach((line) => {
    const heading = SECTION_PATTERNS.find((s) => s.re.test(line));
    // 짧은 줄이 헤딩 패턴과 일치하면 섹션 전환 트리거로만 사용 (항목으로는 넣지 않음)
    if (heading && line.length <= 20) {
      current = heading.key;
      return;
    }
    if (heading) current = heading.key;
    const text = stripBullet(line);
    if (!text) return;
    sections[current || 'general'].push(text);
  });

  if (!sections.main_tasks.length && !sections.qualifications.length && !sections.preferred.length) {
    sections.main_tasks = sections.general;
    sections.general = [];
  }

  return sections;
}

const OUTPUT_TITLES = {
  resume: '이력서', career_description: '경력기술서', motivation: '지원동기',
  jobcompetency: '직무확보역량', personality: '성격의 장단점', goalachievement: '목표수립·달성',
  formative_experiences: '성장과정', self_introduction: '1분 자기소개',
};

// master.experiences / master.outputs를 매칭 후보로 변환.
// 경험 카드 필드명이 워크북마다 조금씩 달라도 안전하게 동작하도록 객체 전체를 펼쳐서 매칭 텍스트로 사용.
export function buildCandidates(master) {
  const candidates = [];

  (master.experiences || []).forEach((exp, i) => {
    const label = `경험: ${exp.org || exp.company || '미입력'} · ${exp.role || exp.category || exp.title || `경험 ${i + 1}`}`;
    const text = flattenToText(exp);
    if (text.trim()) candidates.push({ id: `exp_${exp.id || i}`, label, text });
  });

  Object.entries(master.outputs || {}).forEach(([key, out]) => {
    const text = (out && out.finalText) || flattenToText(out && out.answers);
    if (text && text.trim().length > 10) {
      candidates.push({ id: `out_${key}`, label: `자소서: ${OUTPUT_TITLES[key] || key}`, text });
    }
  });

  return candidates;
}

function scoreCandidate(jdTokens, candidate) {
  const candTokens = new Set(uniqueTokens(candidate.text));
  const matched = jdTokens.filter((t) => candTokens.has(t));
  const score = jdTokens.length ? matched.length / jdTokens.length : 0;
  return { score, matched: Array.from(new Set(matched)) };
}

function buildAppeal(line, candidate, matchedKeywords) {
  const kwText = matchedKeywords.slice(0, 5).join(', ');
  return `${candidate.label}의 내용은 공고 요구사항 "${line}"과 연결됩니다${kwText ? ` (공통 키워드: ${kwText})` : ''}.`;
}

// 공고를 섹션별 요구사항으로 쪼개고, 각 요구사항에 가장 키워드가 겹치는 경험/자소서를 매칭.
// LLM 없이 동작하는 규칙 기반(키워드 겹침) MVP. master는 DataContext의 master 객체.
export function buildMatchReport(master, jdText) {
  const sections = parseJobPosting(jdText);
  const candidates = buildCandidates(master);

  const result = [];
  Object.entries(sections).forEach(([key, lines]) => {
    if (!lines.length) return;
    const items = lines.map((line) => {
      const jdTokens = uniqueTokens(line);
      const scored = candidates
        .map((c) => ({ candidate: c, ...scoreCandidate(jdTokens, c) }))
        .filter((s) => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 2);

      return {
        requirement: line,
        matches: scored.map((s) => ({
          label: s.candidate.label,
          score: Math.round(s.score * 100),
          keywords: s.matched,
          appeal: buildAppeal(line, s.candidate, s.matched),
        })),
      };
    });
    result.push({ key, label: SECTION_LABELS[key] || key, items });
  });

  return {
    generatedAt: new Date().toISOString(),
    candidateCount: candidates.length,
    sections: result,
  };
}
