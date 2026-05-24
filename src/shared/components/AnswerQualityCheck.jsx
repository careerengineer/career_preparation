import { useState } from 'react';
import { COLORS, FONT, SPACING, RADIUS } from '../design/tokens.js';
import { useDataStore } from '../../store/DataContext.jsx';

// 자소서/자기소개 답변에서 실무자가 보는 요소를 점검하고,
// 본인이 정리한 직무·역량 키워드와 답변을 대조해 "직무-경험 연결"을 구체적으로 안내한다.
// 답변 텍스트 + master(읽기 전용)만 사용 — 어떤 저장/데이터도 변경하지 않는다 (import/export 무영향).
const CHECKS = {
  motivation: {
    label: '행동의 계기 (왜 시작했나)',
    re: /자청|먼저\s*제안|직접\s*기획|스스로|주도|찾아서|시작했|관심|호기심|답답|아쉬|문제를?\s*발견|필요해서|계기/,
    hint: '"왜 이걸 시작했는지" 한 줄이 있으면 자발성이 드러납니다. 예: "팀에 데이터 다루는 사람이 없어 자청해서 맡았습니다."',
  },
  difficulty: {
    label: '객관적 어려움 (왜 힘들었나)',
    re: /처음|혼자|시간\s*부족|짧은\s*기간|어려[운움]|복잡|전무|없는\s*상태|참고할|사례가|전공\s*아닌|쉽지\s*않/,
    hint: '"누가 들어도 힘들었겠다" 싶은 객관적 어려움을 1줄 더하세요. 예: "전공자가 아닌데 3주 만에 익혀야 했습니다."',
  },
  number: {
    label: '구체적 수치·결과',
    re: /\d+\s*[%개건명년주달월시간배회분위등]/,
    hint: '수치가 있으면 결과가 또렷해집니다. 예: "참여율 40% 향상", "3개월 만에 도입", "7명 중 1위"',
  },
  autonomy: {
    label: '주도성 (시킨 일이 아닌 내가 한 일)',
    re: /주도|제안|기획|이끌|자청|먼저|선뜻|직접|발굴|찾아내|새로/,
    hint: '"내가 주도했다"가 드러나는 동사를 쓰세요. 예: 주도·제안·직접·발굴·자청',
  },
  connection: {
    label: '직무·회사 연결',
    re: /귀사|이\s*회사|이\s*직무|입사\s*후|함께|기여|활용하겠|적용하겠/,
    hint: '이 답변이 회사·직무로 이어지는 한 줄이 있어야 합니다. 예: "이 경험으로 익힌 데이터 감각을 마케터로서 활용하겠습니다."',
  },
};

// "채용공고 용어" 우선으로 본인 키워드 추출 (읽기 전용, 저장 무변경)
// 순서: 실제 채용공고 키워드 → import된 직무분석 키워드 → 경험 직무역량 → 지원 직무·산업
function splitTerms(text) {
  return String(text || '')
    .split(/[,/·、|;\n]+|\s{2,}/)
    .map((s) => s.replace(/^[-•\d.\s]+/, '').trim())
    .filter((s) => s.length >= 2 && s.length <= 20);
}
function extractUserKeywords(master) {
  const out = [];
  const push = (v) => {
    if (!v) return;
    const s = String(v).trim();
    if (s.length >= 2 && s.length <= 20) out.push(s);
  };
  // 1) 채용공고 분석 원본의 핵심 키워드 (사용자가 공고에서 뽑은 실제 용어) — 최우선
  const ja = master?.workbookRaw?.job_analysis;
  if (ja) {
    const fa = ja.formAnswers || {};
    Object.values(fa).forEach((form) => {
      if (form && typeof form === 'object') {
        ['keywords', 'core', 'hard_skills', 'required_skills', 'tools'].forEach((k) => {
          if (form[k]) splitTerms(form[k]).forEach(push);
        });
      }
    });
    if (Array.isArray(ja.jobPostings)) {
      ja.jobPostings.forEach((p) => {
        if (p && p.keywords) splitTerms(p.keywords).forEach(push);
      });
    }
  }
  // 2) import 등으로 채워진 구조화 직무분석 키워드
  const kw = master?.jobAnalysis?.keywords || {};
  [kw.hard_skills, kw.soft_skills, kw.domain].forEach((arr) => {
    if (Array.isArray(arr)) arr.forEach((x) => push(typeof x === 'string' ? x : x?.name));
  });
  // 3) 경험에 태그한 직무 역량 (job_comps: [{name,score}] 또는 문자열)
  (master?.experiences || []).forEach((e) => {
    const jc = e?.job_comps;
    if (Array.isArray(jc)) jc.forEach((c) => push(typeof c === 'string' ? c : c?.name));
  });
  // 4) 지원 직무·산업 (보조)
  push(master?.profile?.position);
  push(master?.profile?.industry);
  // 중복 제거, 최대 12개 (채용공고 키워드가 앞쪽 우선)
  return [...new Set(out)].slice(0, 12);
}

// 작성 전 안내: "채용공고 용어로 시작 → 내 경험을 그 용어에 연결" (기본 접힘)
export function JdBridgeGuide() {
  const { master } = useDataStore();
  const [open, setOpen] = useState(false);
  const keywords = extractUserKeywords(master);
  return (
    <div style={{ background: COLORS.cream, borderRadius: RADIUS.base, padding: SPACING.sm, marginBottom: SPACING.sm, border: `1px dashed ${COLORS.accent2}` }}>
      <button onClick={() => setOpen((v) => !v)}
        style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color: COLORS.goldDeep, fontFamily: FONT.family }}>
        {open ? '▼ 채용담당자의 용어로 시작하는 법' : '▶ 채용담당자의 용어로 시작하는 법 (펼치기)'}
      </button>
      {open && (
        <div style={{ marginTop: SPACING.sm }}>
          <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0, marginBottom: SPACING.sm, lineHeight: FONT.lineHeight.relaxed }}>
            채용담당자는 <strong>자기들이 채용공고에 쓴 용어</strong>로 지원자를 이해합니다. 내 표현으로 풀어 쓰기보다, <strong>공고에 나온 요구역량·키워드를 그대로 가져와</strong> 그 용어에 내 경험을 연결하면 직무 적합성이 가장 빠르게 전달됩니다.
          </p>
          <div style={{ background: COLORS.bg, borderRadius: RADIUS.sm, padding: SPACING.sm, border: `1px solid ${COLORS.border}`, marginBottom: SPACING.sm }}>
            <p style={{ fontSize: FONT.size.xs, fontWeight: FONT.weight.semibold, color: COLORS.accent, margin: 0, marginBottom: 4 }}>문장 틀</p>
            <p style={{ fontSize: FONT.size.xs, color: COLORS.accent, margin: 0, lineHeight: FONT.lineHeight.base, fontStyle: 'italic' }}>
              "[채용공고 용어/요구역량]이 핵심인 이 직무에서, 저는 [구체적 경험]을 통해 [그 역량]을 입증했습니다."
            </p>
          </div>
          {keywords.length >= 1 && (
            <div>
              <p style={{ fontSize: FONT.size.xs, fontWeight: FONT.weight.semibold, color: COLORS.accent, margin: 0, marginBottom: 6 }}>내가 정리한 직무 용어 — 이 표현으로 시작해 보세요</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {keywords.map((k, i) => (
                  <span key={i} style={{ fontSize: FONT.size.xs, padding: '3px 10px', borderRadius: RADIUS.pill, background: COLORS.white, border: `1px solid ${COLORS.accent2}`, color: COLORS.accent }}>{k}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function AnswerQualityCheck({ text, focusArea }) {
  const { master } = useDataStore();
  if (!text || text.trim().length < 50) return null;

  const keys = (focusArea && focusArea.length) ? focusArea : ['motivation', 'difficulty', 'number', 'autonomy', 'connection'];
  const userKeywords = extractUserKeywords(master);
  const matched = userKeywords.filter((k) => text.includes(k));
  const useKeywordConnection = userKeywords.length >= 3; // 본인 키워드가 충분할 때만 키워드 매칭 사용

  const checks = keys.filter((k) => CHECKS[k]).map((k) => {
    if (k === 'connection' && useKeywordConnection) {
      const missing = userKeywords.filter((w) => !text.includes(w)).slice(0, 4);
      return {
        key: k,
        label: `직무-경험 연결 (내 키워드 ${matched.length}/${userKeywords.length} 반영)`,
        passed: matched.length >= 2,
        hint: missing.length
          ? `직무분석·경험에서 정리한 키워드 중 아직 안 쓴 것을 자연스럽게 녹이세요: ${missing.join(', ')}`
          : '직무 키워드가 잘 반영됐습니다.',
      };
    }
    return { key: k, label: CHECKS[k].label, passed: CHECKS[k].re.test(text), hint: CHECKS[k].hint };
  });

  const passed = checks.filter((c) => c.passed).length;
  const total = checks.length;
  const ratio = total ? passed / total : 0;

  let verdict, color, bg;
  if (ratio === 1) { verdict = '핵심 요소를 모두 갖춘 답변입니다'; color = COLORS.green; bg = COLORS.greenBg; }
  else if (ratio >= 0.75) { verdict = '좋은 답변입니다. 아래 요소만 더하면 완성도가 올라갑니다'; color = COLORS.green; bg = COLORS.greenBg; }
  else if (ratio >= 0.5) { verdict = '아래 요소를 더하면 더 설득력 있어집니다'; color = COLORS.goldDeep; bg = COLORS.cream; }
  else { verdict = '아래 요소들을 보완하면 훨씬 강해집니다'; color = COLORS.goldDeep; bg = COLORS.cream; }

  return (
    <div style={{ background: bg, borderRadius: RADIUS.base, padding: SPACING.md, marginTop: SPACING.sm, border: `1px solid ${color}66` }}>
      <p style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color, margin: 0, marginBottom: SPACING.sm }}>
        면접관 관점 점검 · {passed}/{total} 요소 포함 — {verdict}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {checks.map((c) => (
          <div key={c.key} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: FONT.size.sm, color: COLORS.accent, lineHeight: FONT.lineHeight.base }}>
            <span style={{ color: c.passed ? COLORS.green : COLORS.sub, marginTop: 1, fontWeight: 700 }}>{c.passed ? '✓' : '·'}</span>
            <div style={{ flex: 1 }}>
              <span style={{ fontWeight: FONT.weight.semibold, opacity: c.passed ? 0.7 : 1 }}>{c.label}</span>
              {!c.passed && (
                <p style={{ fontSize: FONT.size.xs, color: COLORS.sub, margin: '2px 0 0', fontStyle: 'italic' }}>{c.hint}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
