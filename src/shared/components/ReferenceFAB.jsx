// 워크북 작성 중 어디서든 이전 작성 자료 참고할 수 있는 Floating Panel
// - 우측 하단 둥근 버튼 → 클릭 → 우측 슬라이드 패널
// - 모든 워크북의 작성 내용을 카테고리별 칩으로 표시
// - 칩 클릭 → ImportPreviewModal (텍스트 복사)

import { useEffect, useState } from 'react';
import { useDataStore } from '../../store/DataContext.jsx';
import { ALL_WORKBOOKS as WORKBOOKS, isWorkbookInVariant } from '../../store/schema.js';
import { COLORS, FONT, SPACING, RADIUS } from '../design/tokens.js';
import { ImportPreviewModal } from './ImportPreviewModal.jsx';

export function ReferenceFAB({ currentWorkbookKey }) {
  const { master } = useDataStore();
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(null);
  const [toast, setToast] = useState(null);

  // 미리보기에서 '답변칸에 넣기' 성공 시: 패널 닫고 안내
  const handleInserted = () => {
    setOpen(false);
    setToast('참고 내용을 입력칸에 넣었습니다');
    setTimeout(() => setToast(null), 2500);
  };

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
  if (currentWorkbookKey !== 'career_roadmap' && isWorkbookInVariant('career_roadmap')) {
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
  if (currentWorkbookKey !== 'experience' && isWorkbookInVariant('experience')) {
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
  if (currentWorkbookKey !== 'job_analysis' && isWorkbookInVariant('job_analysis')) {
    const ja = master.jobAnalysis;
    if (ja && (ja.completedAt || ja.success_signals || ja.my_experience_pool)) {
      items.push({
        group: 'STEP 1',
        kind: 'job_analysis',
        label: '채용공고 및 직무분석 결과',
        data: ja,
      });
    }
  }

  // 다른 워크북 raw (workbookRaw)
  const TITLE_MAP = Object.fromEntries(WORKBOOKS.map((w) => [w.key, w.title]));
  const STEP_MAP = Object.fromEntries(WORKBOOKS.map((w) => [w.key, `STEP ${w.step}`]));
  Object.entries(master.workbookRaw || {}).forEach(([key, raw]) => {
    if (!raw || key === currentWorkbookKey || key === 'experience' || key === 'career_roadmap' || key === 'job_analysis' || key === '_docxImport') return;
    if (!isWorkbookInVariant(key)) return;
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
    if (key === currentWorkbookKey || !isWorkbookInVariant(key)) return;
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
      <style>{`@keyframes ceFabAttn{0%{box-shadow:0 6px 18px rgba(14,39,80,0.28),0 0 0 0 rgba(201,168,106,0.55);}70%{box-shadow:0 6px 18px rgba(14,39,80,0.28),0 0 0 14px rgba(201,168,106,0);}100%{box-shadow:0 6px 18px rgba(14,39,80,0.28),0 0 0 0 rgba(201,168,106,0);}} .ce-fab-attn{animation:ceFabAttn 1.8s ease-out 4;}`}</style>
      {/* FAB 버튼 - 콘텐츠가 있으면 처음에 펄스로 주의 환기, hover 시 진하게 */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="참고 자료 열기"
        className={hasAny && !open ? 'ce-fab-attn' : undefined}
        style={{
          position: 'fixed', right: SPACING.lg, bottom: SPACING.lg, zIndex: 90,
          background: COLORS.accent, color: COLORS.white,
          border: `2px solid ${COLORS.accent2}`,
          padding: '12px 16px', borderRadius: RADIUS.pill,
          fontFamily: FONT.family, fontSize: 20,
          fontWeight: FONT.weight.semibold,
          cursor: 'pointer',
          boxShadow: '0 6px 18px rgba(14,39,80,0.28)',
          display: 'flex', alignItems: 'center', gap: 8,
          opacity: 0.92,
          transition: 'opacity 0.2s ease',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.92'; }}
        onFocus={(e) => { e.currentTarget.style.opacity = '1'; }}
        onBlur={(e) => { e.currentTarget.style.opacity = '0.92'; }}
      >
        참고 자료
        {hasAny && (
          <span style={{
            background: COLORS.accent2, color: COLORS.white,
            fontSize: 20, fontWeight: FONT.weight.bold,
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
                  margin: 0, fontSize: 20, color: COLORS.accent2,
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
                <p style={{ color: COLORS.sub, fontSize: 20, lineHeight: FONT.lineHeight.base }}>
                  아직 다른 워크북에 작성된 내용이 없습니다.
                  다른 STEP을 먼저 작성하면 여기서 참고할 수 있습니다.
                </p>
              ) : (
                sortedGroups.map((g) => (
                  <div key={g} style={{ marginBottom: SPACING.md }}>
                    <p style={{
                      margin: 0, marginBottom: 8,
                      fontSize: 20, color: COLORS.sub,
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
                          title="클릭하면 내용을 미리 보고 답변칸에 넣을 수 있습니다"
                          style={{
                            textAlign: 'left',
                            background: COLORS.white,
                            border: `1px solid ${COLORS.line}`,
                            borderLeft: `3px solid ${COLORS.accent2}`,
                            padding: '10px 12px',
                            fontFamily: FONT.family,
                            fontSize: 20, color: COLORS.ink,
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
              fontSize: 20, color: COLORS.sub,
              lineHeight: FONT.lineHeight.base,
            }}>
              항목을 클릭하면 내용을 미리 볼 수 있습니다. 작성 중이던 답변 칸을 먼저 한 번 클릭해 두면, 미리보기에서 [답변칸에 넣기]로 그 칸에 바로 넣을 수 있습니다. (또는 텍스트 복사)
            </div>
          </div>
        </>
      )}
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

      {preview && <ImportPreviewModal item={preview} onClose={() => setPreview(null)} onInserted={handleInserted} />}
    </>
  );
}
