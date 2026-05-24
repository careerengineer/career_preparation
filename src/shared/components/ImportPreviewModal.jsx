import { useEffect, useState, useMemo } from 'react';
import { COLORS, FONT, SPACING, RADIUS } from '../design/tokens.js';
import { QUESTION_LABELS } from '../../store/questionLabels.js';
import { formatComps } from '../../store/comps.js';
import { insertIntoFocusedField } from '../utils/fieldInsert.js';

// 코드성/내부용 키 — 미리보기에 노출하지 않음 (지원자에게 의미 없음)
const NOISE_KEYS = new Set(['savedAt', 'completedAt', 'quizAnswers', 'scores', 'basicInfo', 'phase', 'version', 'id', 'persona']);

// 객체를 사람이 읽을 수 있는 텍스트로 (JSON 코드 덤프 방지)
function readable(obj) {
  if (obj == null) return '';
  if (typeof obj !== 'object') return String(obj);
  if (Array.isArray(obj)) {
    return obj.map((v) => (typeof v === 'object' ? readable(v) : String(v))).filter(Boolean).join(', ');
  }
  const lines = [];
  for (const [k, v] of Object.entries(obj)) {
    if (NOISE_KEYS.has(k) || v == null || v === '') continue;
    const inner = typeof v === 'object' ? readable(v) : String(v).trim();
    if (inner) lines.push(`${k}: ${inner}`);
  }
  return lines.join('\n');
}

// item 종류별로 적절한 텍스트 추출
export function extractText(item) {
  if (!item) return '';
  const { kind, data } = item;

  // 매핑된 데이터 (questionMapping.js → resolveMappedData 결과)
  if (kind === 'mapped' && data?.__mapped) {
    return data.text;
  }

  if (kind === 'profile') {
    return [
      `산업: ${data.industry || '-'}`,
      `직무: ${data.position || '-'}`,
      `회사: ${data.company || '-'}`,
    ].join('\n');
  }

  if (kind === 'experience') {
    const e = data;
    return [
      `[${e.category || '경험'}] ${e.org || ''} (${e.period || ''})`,
      e.role ? `역할: ${e.role}` : '',
      e.summary ? `요약: ${e.summary}` : '',
      e.motivation ? `동기: ${e.motivation}` : '',
      '',
      '[STAR]',
      `- 상황: ${e.star_s || ''}`,
      `- 과제: ${e.star_t || ''}`,
      `- 행동: ${e.star_a || ''}`,
      `- 결과: ${e.star_r || ''}`,
      `- 배운 점: ${e.learning || ''}`,
      formatComps(e.job_comps) ? `\n직무 역량: ${formatComps(e.job_comps)}` : '',
      formatComps(e.comm_comps) ? `소통 역량: ${formatComps(e.comm_comps)}` : '',
      formatComps(e.att_comps) ? `태도 역량: ${formatComps(e.att_comps)}` : '',
    ].filter(Boolean).join('\n');
  }

  if (kind === 'job_analysis') {
    const ja = data;
    const lines = [];
    if (ja.company) lines.push(`[회사] vision: ${ja.company.vision || '-'}`);
    if (ja.success_signals) lines.push(`\n[성공 신호]\n${ja.success_signals}`);
    if (ja.my_experience_pool) lines.push(`\n[내 경험 풀]\n${ja.my_experience_pool}`);
    if (ja.connection_sentences) lines.push(`\n[연결 문장]\n${ja.connection_sentences}`);
    return lines.join('\n') || readable(ja);
  }

  if (kind.startsWith('output_')) {
    if (data.finalText) return data.finalText;
    if (data.answers) return readable(data.answers);
    return readable(data);
  }

  if (kind.startsWith('raw_')) {
    const raw = data.raw || data;
    const wbKey = data.workbookKey;
    const labels = (wbKey && QUESTION_LABELS[wbKey]) || {};
    const lines = [];
    if (raw.basicInfo) {
      lines.push(`[기본정보]`);
      lines.push(`산업: ${raw.basicInfo.industry || '-'}`);
      lines.push(`직무: ${raw.basicInfo.position || '-'}`);
      lines.push(`회사: ${raw.basicInfo.company || raw.basicInfo.target || '-'}`);
      lines.push('');
    }
    if (raw.answers && typeof raw.answers === 'object') {
      lines.push(`[답변]`);
      Object.entries(raw.answers).forEach(([k, v]) => {
        if (v && String(v).trim()) {
          const label = labels[k];
          lines.push(label ? `■ ${label}\n${v}\n` : `${k}: ${v}\n`);
        }
      });
    }
    if (raw.finalText) {
      lines.push(`\n[완성본]\n${raw.finalText}`);
    }
    return lines.join('\n') || readable(raw);
  }

  return readable(data);
}

export function ImportPreviewModal({ item, onClose, onInserted }) {
  const [copied, setCopied] = useState(false);
  const [insertMsg, setInsertMsg] = useState('');
  const text = useMemo(() => extractText(item), [item]);

  const handleInsert = () => {
    if (insertIntoFocusedField(text)) {
      onInserted?.();
      onClose?.();
    } else {
      setInsertMsg('먼저 넣을 답변칸을 한 번 클릭한 뒤, 다시 [답변칸에 넣기]를 눌러주세요.');
    }
  };

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!item) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // fallback: select textarea
      const ta = document.getElementById('ce-import-preview-textarea');
      if (ta) { ta.select(); document.execCommand('copy'); setCopied(true); setTimeout(() => setCopied(false), 1800); }
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(14,39,80,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: SPACING.md,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: COLORS.white,
          maxWidth: 640, width: '100%', maxHeight: '85vh',
          display: 'flex', flexDirection: 'column',
          padding: SPACING.lg,
          fontFamily: FONT.family,
          boxShadow: '0 12px 36px rgba(0,0,0,0.18)',
          borderTop: `4px solid ${COLORS.accent2}`,
        }}
      >
        <div style={{ marginBottom: SPACING.md }}>
          <p style={{
            margin: 0, fontSize: 20, color: COLORS.accent2,
            letterSpacing: 3, textTransform: 'uppercase', fontWeight: FONT.weight.semibold,
          }}>
            IMPORT · 미리보기
          </p>
          <h2 style={{
            margin: '6px 0 0', fontSize: FONT.size.h3, color: COLORS.ink,
            fontWeight: FONT.weight.semibold, letterSpacing: '-0.3px',
          }}>
            {item.label}
          </h2>
          <p style={{
            margin: '6px 0 0', fontSize: 20, color: COLORS.sub,
            lineHeight: FONT.lineHeight.base,
          }}>
            내용을 확인하고, [답변칸에 넣기]로 작성 중인 칸에 바로 넣거나 복사해서 붙여넣으세요.
          </p>
        </div>

        <textarea
          id="ce-import-preview-textarea"
          readOnly
          value={text}
          style={{
            flex: 1, minHeight: 200, maxHeight: '50vh',
            background: COLORS.cream,
            border: `1px solid ${COLORS.line}`,
            padding: SPACING.md,
            fontFamily: FONT.family,
            fontSize: 20,
            color: COLORS.ink,
            lineHeight: FONT.lineHeight.base,
            resize: 'vertical',
            outline: 'none',
            whiteSpace: 'pre-wrap',
          }}
        />

        {insertMsg && (
          <p style={{ margin: `${SPACING.sm}px 0 0`, fontSize: 16, color: COLORS.red, lineHeight: FONT.lineHeight.base }}>
            {insertMsg}
          </p>
        )}
        <div style={{
          display: 'flex', gap: SPACING.sm, justifyContent: 'flex-end',
          marginTop: SPACING.md, flexWrap: 'wrap',
        }}>
          <button onClick={onClose} style={btnGhost}>닫기</button>
          <button onClick={handleCopy} style={btnGhost}>
            {copied ? '복사됨' : '텍스트 복사'}
          </button>
          <button onClick={handleInsert} style={btnPrimary}>답변칸에 넣기</button>
        </div>
      </div>
    </div>
  );
}

const btnBase = {
  fontFamily: FONT.family, fontSize: 20,
  padding: '10px 18px', cursor: 'pointer',
  fontWeight: FONT.weight.semibold,
};
const btnPrimary = { ...btnBase, background: COLORS.accent, color: COLORS.white, border: 'none' };
const btnGhost = { ...btnBase, background: 'transparent', color: COLORS.sub, border: `1px solid ${COLORS.line}` };
