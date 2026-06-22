import { parseJobPosting, buildCandidates, SECTION_LABELS } from './matchEngine.js';

const MAX_CANDIDATE_TEXT = 500;

function truncate(text, max) {
  const t = String(text || '').trim();
  return t.length > max ? `${t.slice(0, max)}...` : t;
}

// API 키/서눉니 없이, 사용자가 기존 Claude 구냅을 직접 활용하여 수동으로
// 매칭 결과를 복사-붙여넣기 할 수 있는 프롬트를 만든다.
// (LLM 고도화 Phase2: 서버없이 동작하는 임시 우회로)
export function buildLlmPrompt(master, jdText, meta = {}) {
  const sections = parseJobPosting(jdText);
  const candidates = buildCandidates(master);

  const sectionBlocks = Object.entries(sections)
    .filter(([, lines]) => lines.length > 0)
    .map(([key, lines]) => {
      const items = lines.map((l, i) => `  ${i + 1}. ${l}`).join('\n');
      return `[${SECTION_LABELS[key] || key}] (key: ${key})\n${items}`;
    })
    .join('\n\n');

  const candidateBlocks = candidates
    .map((c, i) => `${i + 1}. [${c.label}]\n${truncate(c.text, MAX_CANDIDATE_TEXT)}`)
    .join('\n\n');

  return `당신은 채용 컨설턴트입니다. 아래 "직무 요구사항"과 지원자의 "경험/자소서 목록"을 비교하여,
각 요구사항에 가장 적합한 경험/자소서를 매칭하고 어필 포인트를 작성해주세요.

[지원 기업/직무]
${meta.company || '미입력'}

[직무 요구사항]
${sectionBlocks || '(요구사항 없음)'}

[지원자 경험/자소서 목록]
${candidateBlocks || '(작성된 경험/자소서 없음)'}

[응답 형식]
다른 설명 없이 아래 JSON 형식으로만 응답해주세요. 마크다운 코드블록(\`\`\`)도 사용하지 마세요.
매칭되는 경험/자소서가 없는 요구사항은 matches를 빈 배열로 두세요. 요구사항당 매칭은 최대 2개로 제한하세요.

{
  "sections": [
    {
      "key": "main_tasks",
      "items": [
        {
          "requirement": "요구사항 원문",
          "matches": [
            { "label": "경험/자소서 목록에 표시된 이름 그대로", "score": 90, "appeal": "이 경험이 왜 이 요구사항에 어필되는지 2~3문장" }
          ]
        }
      ]
    }
  ]
}

key 값은 위에 표시된 "(key: ...)" 값을 그대로 사용하세요. score는 0~100 사이 정수(적합도)입니다.`;
}

function stripCodeFence(text) {
  const trimmed = String(text || '').trim();
  const fenceMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  return fenceMatch ? fenceMatch[1] : trimmed;
}

// Claude에서 복사해온 JSON 응답 텍스트를 기존 리포트 구조({sections:[{key,label,items}]})로 변환.
export function parseLlmResult(rawText) {
  const cleaned = stripCodeFence(rawText);
  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (e) {
    throw new Error('JSON 형식을 인식할 수 없습니다. 클로드 응답을 그대로(코드블록 포함 가능) 붙여넣었는지 확인해주세요.');
  }

  if (!parsed || !Array.isArray(parsed.sections)) {
    throw new Error('응답에 sections 배열이 없습니다.');
  }

  const labelsSeen = new Set();
  const sections = parsed.sections.map((section) => {
    const items = (section.items || []).map((item) => {
      const matches = (item.matches || []).map((m) => {
        if (m.label) labelsSeen.add(m.label);
        return {
          label: m.label || '미입력',
          score: Number.isFinite(m.score) ? Math.round(m.score) : 0,
          keywords: [],
          appeal: m.appeal || '',
        };
      });
      return { requirement: item.requirement || '', matches };
    });
    return { key: section.key, label: SECTION_LABELS[section.key] || section.key, items };
  });

  return {
    generatedAt: new Date().toISOString(),
    candidateCount: labelsSeen.size,
    sections,
  };
}
