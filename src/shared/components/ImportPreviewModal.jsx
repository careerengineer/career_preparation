import { useEffect, useState, useMemo } from 'react';
import { COLORS, FONT, SPACING, RADIUS } from '../design/tokens.js';

// item 종류별로 적절한 텍스트 추출
function extractText(item) {
  if (!item) return '';
  const { kind, data } = item;

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
      e.job_comps ? `\n직무 역량: ${Array.isArray(e.job_comps) ? e.job_comps.join(', ') : e.job_comps}` : '',
    ].filter(Boolean).join('\n');
  }

  if (kind === 'job_analysis') {
    const ja = data;
    const lines = [];
    if (ja.company) lines.push(`[회사] vision: ${ja.company.vision || '-'}`);
    if (ja.success_signals) lines.push(`\n[성공 신호]\n${ja.success_signals}`);
    if (ja.my_experience_pool) lines.push(`\n[내 경험 풀]\n${ja.my_experience_pool}`);
    if (ja.connection_sentences) lines.push(`\n[연결 문장]\n${ja.connection_sentences}`);
    return lines.join('\n') || JSON.stringify(ja, null, 2);
  }

  if (kind.startsWith('output_')) {
    if (data.finalText) return data.finalText;
    if (data.answers) return JSON.stringify(data.answers, null, 2);
    return JSON.stringify(data, null, 2);
  }

  if (kind.startsWith('raw_')) {
    const raw = data.raw || data;
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
        if (v && String(v).trim()) lines.push(`${k}: ${v}\n`);
      });
    }
    if (raw.finalText) {
      lines.push(`\n[완성본]\n${raw.finalText}`);
    }
    return lines.join('\n') || JSON.stringify(raw, null, 2);
  }

  return JSON.stringify(data, null, 2);
}

export function ImportPreviewModal({ item, onClose }) {
  const [copied, setCopied] = useState(false);
  const text = useMemo(() => extractText(item), [item]);

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
            margin: 0, fontSize: FONT.size.caption, color: COLORS.accent2,
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
            margin: '6px 0 0', fontSize: FONT.size.caption, color: COLORS.sub,
            lineHeight: FONT.lineHeight.base,
          }}>
            아래 텍스트를 복사해 원하는 답변 칸에 붙여넣으세요.
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
            fontSize: FONT.size.body,
            color: COLORS.ink,
            lineHeight: FONT.lineHeight.base,
            resize: 'vertical',
            outline: 'none',
            whiteSpace: 'pre-wrap',
          }}
        />

        <div style={{
          display: 'flex', gap: SPACING.sm, justifyContent: 'flex-end',
          marginTop: SPACING.md,
        }}>
          <button onClick={onClose} style={btnGhost}>닫기</button>
          <button onClick={handleCopy} style={btnPrimary}>
            {copied ? '복사됨' : '텍스트 복사'}
          </button>
        </div>
      </div>
    </div>
  );
}

const btnBase = {
  fontFamily: FONT.family, fontSize: FONT.size.body,
  padding: '10px 18px', cursor: 'pointer',
  fontWeight: FONT.weight.semibold,
};
const btnPrimary = { ...btnBase, background: COLORS.accent, color: COLORS.white, border: 'none' };
const btnGhost = { ...btnBase, background: 'transparent', color: COLORS.sub, border: `1px solid ${COLORS.line}` };
