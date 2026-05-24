import { useState } from 'react';
import { useDataStore } from '../../store/DataContext.jsx';
import { ALL_WORKBOOKS as WORKBOOKS } from '../../store/schema.js';
import { COLORS, FONT, SPACING, RADIUS } from '../design/tokens.js';
import { ImportPreviewModal, extractText } from './ImportPreviewModal.jsx';
import { insertIntoFocusedField } from '../utils/fieldInsert.js';
import { QUESTION_MAPPING, resolveMappedData } from '../../store/questionMapping.js';

// 각 워크북의 질문 옆에 표시 — 이 질문과 관련된 다른 워크북의 작성 내용을 칩으로 노출.
// 칩 클릭 → 미리보기 모달 (텍스트 복사 가능)
// props.ids: ['experience', 'job_analysis', 'career_roadmap', ...] 같은 workbookKey 배열
export function ReferenceInline({ ids = [], questionId, workbookKey }) {
  const { master } = useDataStore();
  const [preview, setPreview] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [toast, setToast] = useState(null);

  // 칩 클릭 → 직전에 작성 중이던 답변칸에 바로 삽입. 포커스된 칸이 없으면 미리보기(복사)로.
  const handleChipClick = (it) => {
    const text = extractText(it);
    if (insertIntoFocusedField(text)) {
      setToast('참고 내용을 입력칸에 넣었습니다');
      setTimeout(() => setToast(null), 2500);
    } else {
      setPreview(it);
    }
  };

  // 질문 id 매핑이 있으면 정확한 필드 데이터를 칩으로 노출
  let mappedItems = [];
  if (workbookKey && questionId) {
    const sources = QUESTION_MAPPING[workbookKey]?.[questionId];
    if (Array.isArray(sources)) {
      mappedItems = sources
        .map((src) => {
          const data = resolveMappedData(master, src);
          if (!data) return null;
          return {
            kind: 'mapped',
            id: `${workbookKey}_${questionId}_${src.type}_${src.field}`,
            label: data.label,
            data: { __mapped: true, label: data.label, text: data.text },
          };
        })
        .filter(Boolean);
    }
  }

  if (!ids || ids.length === 0) {
    // ids 없어도 mapped만 있으면 표시
    if (mappedItems.length === 0) return null;
  }

  // 각 id에 해당하는 master 데이터를 item으로 변환
  const items = [];

  for (const id of ids) {
    const meta = WORKBOOKS.find((w) => w.key === id);
    const wbTitle = meta?.title || id;

    if (id === 'experience') {
      const exps = master.experiences || [];
      if (exps.length > 0) {
        // 각 경험 카드를 별도 칩으로
        exps.forEach((e) => {
          items.push({
            kind: 'experience',
            id: e.id,
            label: `경험: ${e.org || e.category || '미입력'}${e.role ? ' · ' + e.role : ''}`,
            data: e,
          });
        });
      }
      continue;
    }

    if (id === 'job_analysis') {
      const ja = master.jobAnalysis;
      const hasContent = ja && (ja.completedAt || ja.success_signals || ja.my_experience_pool);
      if (hasContent) {
        items.push({
          kind: 'job_analysis',
          label: `${wbTitle}: 작성 결과`,
          data: ja,
        });
      }
      // 또는 workbookRaw에 raw 데이터
      const raw = master.workbookRaw?.[id];
      if (raw && Object.keys(raw).filter((k) => k !== 'basicInfo' && k !== 'savedAt').length > 0) {
        items.push({
          kind: `raw_${id}`,
          label: `${wbTitle}: 작성 내용`,
          data: { __raw: true, workbookKey: id, raw },
        });
      }
      continue;
    }

    if (id === 'career_roadmap') {
      // 진단은 퀴즈 코드(q1:'b' 등)라 그대로 보여주면 의미 불명 →
      // 사람이 읽을 수 있는 '진단 결과 요약'으로 변환해서 노출.
      const rm = master.roadmap;
      const rmRaw = master.workbookRaw?.career_roadmap;
      const STEP_NAMES = {
        0: 'STEP 0 · 방향 설정', 1: 'STEP 1 · 채용공고 분석', 2: 'STEP 2 · 경험 소재 발굴',
        3: 'STEP 3 · 이력서/경력기술서', 4: 'STEP 4 · 자소서', 5: 'STEP 5 · 면접',
      };
      const lines = [];
      if (rm?.weakestStep != null) {
        lines.push(`가장 보완이 필요한 단계: ${STEP_NAMES[rm.weakestStep] || ('STEP ' + rm.weakestStep)}`);
      }
      // 진단에서 직접 작성한 자유 서술이 있으면 함께 (코드성 quizAnswers는 제외)
      if (rmRaw?.answers && typeof rmRaw.answers === 'object') {
        Object.values(rmRaw.answers).forEach((v) => {
          if (v && String(v).trim().length > 2) lines.push(String(v).trim());
        });
      }
      if (lines.length > 0) {
        items.push({
          kind: 'mapped',
          id: 'career_roadmap_summary',
          label: `${wbTitle}: 진단 결과`,
          data: { __mapped: true, label: `${wbTitle}: 진단 결과`, text: lines.join('\n\n') },
        });
      }
      continue;
    }

    // 그 외 워크북: outputs.finalText + workbookRaw 둘 다 노출
    const out = master.outputs?.[id];
    if (out?.finalText) {
      items.push({
        kind: `output_${id}`,
        label: `${wbTitle}: 완성본`,
        data: out,
      });
    }
    const raw = master.workbookRaw?.[id];
    if (raw && Object.keys(raw).filter((k) => k !== 'basicInfo' && k !== 'savedAt').length > 0) {
      items.push({
        kind: `raw_${id}`,
        label: `${wbTitle}: 작성 내용`,
        data: { __raw: true, workbookKey: id, raw },
      });
    }
  }

  // mapped items를 items 앞에 추가 (더 가까운 매핑이 우선)
  const allItems = [...mappedItems, ...items];

  // 빈 상태는 노출하지 않음 (첫 사용자에게 의미 없는 안내 박스 제거)
  if (allItems.length === 0) return null;

  const COLLAPSE_THRESHOLD = 5;
  const overflow = allItems.length > COLLAPSE_THRESHOLD;
  const visibleItems = overflow && !expanded ? allItems.slice(0, COLLAPSE_THRESHOLD) : allItems;
  const hiddenCount = allItems.length - visibleItems.length;

  return (
    <>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
        padding: '8px 12px', background: COLORS.cream,
        borderLeft: `2px solid ${COLORS.accent2}`,
        marginTop: 4, marginBottom: 8,
        fontSize: 20, lineHeight: FONT.lineHeight.base,
      }}>
        <span style={{ color: COLORS.sub, fontWeight: FONT.weight.semibold, flexShrink: 0 }}>
          참고할 이전 작성:
        </span>
        {visibleItems.map((it, idx) => (
          <button
            key={it.id || it.kind + idx}
            onClick={() => handleChipClick(it)}
            title="클릭하면 작성 중인 답변칸에 바로 삽입됩니다"
            style={{
              background: it.kind === 'mapped' ? COLORS.bgAlt : COLORS.white,
              border: `1px solid ${it.kind === 'mapped' ? COLORS.accent2 : COLORS.line}`,
              borderRadius: RADIUS.pill,
              padding: '3px 10px',
              fontSize: 20,
              color: COLORS.accent,
              fontFamily: FONT.family,
              fontWeight: it.kind === 'mapped' ? FONT.weight.semibold : FONT.weight.medium,
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS.accent2; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = it.kind === 'mapped' ? COLORS.accent2 : COLORS.line; }}
          >
            {it.label}
          </button>
        ))}
        {overflow && (
          <button
            onClick={() => setExpanded((v) => !v)}
            style={{
              background: 'transparent', border: 'none',
              color: COLORS.accent2, fontSize: 20, fontWeight: FONT.weight.semibold,
              fontFamily: FONT.family, cursor: 'pointer', textDecoration: 'underline',
              padding: '3px 6px',
            }}
          >
            {expanded ? '접기' : `더 보기 (${hiddenCount})`}
          </button>
        )}
      </div>
      {preview && <ImportPreviewModal item={preview} onClose={() => setPreview(null)} />}
      {toast && (
        <div style={{
          position: 'fixed', bottom: SPACING.lg, left: '50%', transform: 'translateX(-50%)',
          background: COLORS.accent, color: COLORS.white,
          padding: `${SPACING.sm}px ${SPACING.md}px`, fontFamily: FONT.family, fontSize: 18,
          boxShadow: '0 6px 18px rgba(0,0,0,0.18)', zIndex: 1100,
        }}>
          {toast}
        </div>
      )}
    </>
  );
}
