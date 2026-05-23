import { useState } from 'react';
import { useDataStore } from '../../store/DataContext.jsx';
import { WORKBOOKS } from '../../store/schema.js';
import { COLORS, FONT, SPACING, RADIUS } from '../design/tokens.js';
import { ImportPreviewModal } from './ImportPreviewModal.jsx';

// 각 워크북의 질문 옆에 표시 — 이 질문과 관련된 다른 워크북의 작성 내용을 칩으로 노출.
// 칩 클릭 → 미리보기 모달 (텍스트 복사 가능)
// props.ids: ['experience', 'job_analysis', 'career_roadmap', ...] 같은 workbookKey 배열
export function ReferenceInline({ ids = [] }) {
  const { master } = useDataStore();
  const [preview, setPreview] = useState(null);

  if (!ids || ids.length === 0) return null;

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
      const rm = master.roadmap;
      if (rm && (rm.completedAt || rm.weakestStep != null || Object.keys(rm.quizAnswers || {}).length > 0)) {
        items.push({
          kind: 'raw_career_roadmap',
          label: `${wbTitle}: 진단 결과`,
          data: { __raw: true, workbookKey: id, raw: rm },
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

  if (items.length === 0) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
        padding: '6px 10px', background: COLORS.cream,
        borderLeft: `2px solid ${COLORS.line}`,
        marginTop: 4, marginBottom: 8,
        fontSize: FONT.size.xs, color: COLORS.sub,
        lineHeight: FONT.lineHeight.base,
      }}>
        <span style={{ fontWeight: FONT.weight.semibold, flexShrink: 0 }}>참고:</span>
        <span>이 질문과 관련된 이전 워크북 ({ids.map((id) => WORKBOOKS.find((w) => w.key === id)?.title || id).join(', ')}) — 아직 작성된 내용 없음</span>
      </div>
    );
  }

  return (
    <>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
        padding: '8px 12px', background: COLORS.cream,
        borderLeft: `2px solid ${COLORS.accent2}`,
        marginTop: 4, marginBottom: 8,
        fontSize: FONT.size.sm, lineHeight: FONT.lineHeight.base,
      }}>
        <span style={{ color: COLORS.sub, fontWeight: FONT.weight.semibold, flexShrink: 0 }}>
          참고할 이전 작성:
        </span>
        {items.map((it, idx) => (
          <button
            key={it.id || it.kind + idx}
            onClick={() => setPreview(it)}
            style={{
              background: COLORS.white,
              border: `1px solid ${COLORS.line}`,
              borderRadius: RADIUS.pill,
              padding: '3px 10px',
              fontSize: FONT.size.sm,
              color: COLORS.accent,
              fontFamily: FONT.family,
              fontWeight: FONT.weight.medium,
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS.accent2; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.line; }}
          >
            {it.label}
          </button>
        ))}
      </div>
      {preview && <ImportPreviewModal item={preview} onClose={() => setPreview(null)} />}
    </>
  );
}
