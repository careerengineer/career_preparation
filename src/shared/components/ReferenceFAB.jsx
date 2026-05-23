// 워크북 작성 중 어디서든 이전 작성 자료 참고할 수 있는 Floating Panel
// - 우측 하단 둥근 버튼 → 클릭 → 우측 슬라이드 패널
// - 모든 워크북의 작성 내용을 카테고리별 칩으로 표시
// - 칩 클릭 → ImportPreviewModal (텍스트 복사)

import { useEffect, useState } from 'react';
import { useDataStore } from '../../store/DataContext.jsx';
import { WORKBOOKS } from '../../store/schema.js';
import { COLORS, FONT, SPACING, RADIUS } from '../design/tokens.js';
import { ImportPreviewModal } from './ImportPreviewModal.jsx';

export function ReferenceFAB({ currentWorkbookKey }) {
  const { master } = useDataStore();
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(null);

  // ESC 닫기
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // 표시할 아이템 모으기 (현재 워크북 제외)
  const items = [];

  // profile
  if (master.profile.industry || master.profile.position || master.profile.company) {
    items.push({
      group: '기본 정보',
      kind: 'profile',
      label: `${master.profile.industry || '-'} / ${master.profile.position || '-'} / ${master.profile.company || '-'}`,
      data: master.profile,
    });
  }

  // career_roadmap
  if (currentWorkbookKey !== 'career_roadmap') {
    const rm = master.roadmap;
    if (rm && (rm.completedAt || rm.weakestStep != null)) {
      items.push({
        group: 'STEP 0',
        kind: 'raw_career_roadmap',
        label: '취업 로드맵 진단',
        data: { __raw: true, workbookKey: 'career_roadmap', raw: rm },
      });
    }
  }

  // experience
  if (currentWorkbookKey !== 'experience') {
    (master.experiences || []).forEach((e) => {
      items.push({
        group: '경험 정리',
        kind: 'experience',
        id: e.id,
        label: `${e.org || e.category || '경험'}${e.role ? ' · ' + e.role : ''}`,
        data: e,
      });
    });
  }

  // job_analysis
  if (currentWorkbookKey !== 'job_analysis') {
    const ja = master.jobAnalysis;
    if (ja && (ja.completedAt || ja.success_signals || ja.my_experience_pool)) {
      items.push({
        group: 'STEP 1',
        kind: 'job_analysis',
        label: '채용공고·직무 분석 결과',
        data: ja,
      });
    }
  }

  // 다른 워크북 raw (workbookRaw)
  const TITLE_MAP = Object.fromEntries(WORKBOOKS.map((w) => [w.key, w.title]));
  const STEP_MAP = Object.fromEntries(WORKBOOKS.map((w) => [w.key, `STEP ${w.step}`]));
  Object.entries(master.workbookRaw || {}).forEach(([key, raw]) => {
    if (!raw || key === currentWorkbookKey || key === 'experience' || key === 'career_roadmap' || key === 'job_analysis' || key === '_docxImport') return;
    const keys = Object.keys(raw).filter((k) => k !== 'basicInfo' && k !== 'savedAt');
    if (keys.length === 0) return;
    items.push({
      group: STEP_MAP[key] || '',
      kind: `raw_${key}`,
      label: TITLE_MAP[key] || key,
      data: { __raw: true, workbookKey: key, raw },
    });
  });

  // outputs.finalText
  Object.entries(master.outputs || {}).forEach(([key, out]) => {
    if (key === currentWorkbookKey) return;
    if (!out?.finalText) return;
    items.push({
      group: '완성본',
      kind: `output_${key}`,
      label: `${TITLE_MAP[key] || key} (완성)`,
      data: out,
    });
  });

  // docx import
  if (master.workbookRaw?._docxImport) {
    const di = master.workbookRaw._docxImport;
    items.push({
      group: '가져온 문서',
      kind: 'raw__docxImport',
      label: di.fileName || 'docx 추출',
      data: { __raw: true, workbookKey: '_docxImport', raw: di },
    });
  }

  // 그룹별 정리
  const grouped = {};
  for (const it of items) {
    (grouped[it.group] ||= []).push(it);
  }
  const groupOrder = ['기본 정보', 'STEP 0', 'STEP 1', '경험 정리', '완성본', 'STEP 3', 'STEP 4', 'STEP 5', '가져온 문서'];
  const sortedGroups = Object.keys(grouped).sort((a, b) => {
    const ai = groupOrder.indexOf(a); const bi = groupOrder.indexOf(b);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  const hasAny = items.length > 0;

  return (
    <>
      {/* FAB 버튼 - 텍스트 입력 중일 때 자동 흐리게 + hover 시 진하게 */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="참고 자료 열기"
        style={{
          position: 'fixed', right: SPACING.lg, bottom: SPACING.lg, zIndex: 90,
          background: COLORS.accent, color: COLORS.white,
          border: `2px solid ${COLORS.accent2}`,
          padding: '12px 16px', borderRadius: RADIUS.pill,
          fontFamily: FONT.family, fontSize: FONT.size.body,
          fontWeight: FONT.weight.semibold,
          cursor: 'pointer',
          boxShadow: '0 6px 18px rgba(14,39,80,0.28)',
          display: 'flex', alignItems: 'center', gap: 8,
          opacity: 0.55,
          transition: 'opacity 0.2s ease',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.55'; }}
        onFocus={(e) => { e.currentTarget.style.opacity = '1'; }}
        onBlur={(e) => { e.currentTarget.style.opacity = '0.55'; }}
      >
        참고 자료
        {hasAny && (
          <span style={{
            background: COLORS.accent2, color: COLORS.white,
            fontSize: FONT.size.xs, fontWeight: FONT.weight.bold,
            padding: '2px 8px', borderRadius: RADIUS.pill,
            minWidth: 22, textAlign: 'center',
          }}>
            {items.length}
          </span>
        )}
      </button>

      {/* 슬라이드 패널 */}
      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(14,39,80,0.35)',
              zIndex: 95,
            }}
          />
          <div style={{
            position: 'fixed', right: 0, top: 0, bottom: 0,
            width: 'min(420px, 92vw)',
            background: COLORS.bg,
            borderLeft: `1px solid ${COLORS.line}`,
            boxShadow: '-6px 0 24px rgba(0,0,0,0.12)',
            zIndex: 96,
            display: 'flex', flexDirection: 'column',
            fontFamily: FONT.family,
          }}>
            <div style={{
              padding: SPACING.md,
              borderBottom: `1px solid ${COLORS.line}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: COLORS.white,
            }}>
              <div>
                <p style={{
                  margin: 0, fontSize: FONT.size.caption, color: COLORS.accent2,
                  letterSpacing: 2, fontWeight: FONT.weight.semibold, textTransform: 'uppercase',
                }}>
                  REFERENCE
                </p>
                <h3 style={{ margin: '4px 0 0', fontSize: FONT.size.h3, color: COLORS.ink, fontWeight: FONT.weight.semibold }}>
                  이전 작성 자료
                </h3>
              </div>
              <button onClick={() => setOpen(false)} style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                fontSize: FONT.size.lg, color: COLORS.sub, fontFamily: FONT.family,
              }}>닫기 ✕</button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: SPACING.md }}>
              {!hasAny ? (
                <p style={{ color: COLORS.sub, fontSize: FONT.size.body, lineHeight: FONT.lineHeight.base }}>
                  아직 다른 워크북에 작성된 내용이 없습니다.
                  다른 STEP을 먼저 작성하면 여기서 참고할 수 있습니다.
                </p>
              ) : (
                sortedGroups.map((g) => (
                  <div key={g} style={{ marginBottom: SPACING.md }}>
                    <p style={{
                      margin: 0, marginBottom: 8,
                      fontSize: FONT.size.xs, color: COLORS.sub,
                      letterSpacing: 1.5, textTransform: 'uppercase',
                      fontWeight: FONT.weight.semibold,
                    }}>
                      {g}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {grouped[g].map((it) => (
                        <button
                          key={it.id || it.kind}
                          onClick={() => setPreview(it)}
                          style={{
                            textAlign: 'left',
                            background: COLORS.white,
                            border: `1px solid ${COLORS.line}`,
                            borderLeft: `3px solid ${COLORS.accent2}`,
                            padding: '10px 12px',
                            fontFamily: FONT.family,
                            fontSize: FONT.size.body, color: COLORS.ink,
                            cursor: 'pointer',
                            lineHeight: FONT.lineHeight.base,
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.cream; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = COLORS.white; }}
                        >
                          {it.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={{
              padding: SPACING.md,
              borderTop: `1px solid ${COLORS.line}`,
              background: COLORS.cream,
              fontSize: FONT.size.caption, color: COLORS.sub,
              lineHeight: FONT.lineHeight.base,
            }}>
              항목을 클릭하면 내용 미리보기 + 텍스트 복사. 원하는 답변 칸에 붙여넣어 활용하세요.
            </div>
          </div>
        </>
      )}

      {preview && <ImportPreviewModal item={preview} onClose={() => setPreview(null)} />}
    </>
  );
}
