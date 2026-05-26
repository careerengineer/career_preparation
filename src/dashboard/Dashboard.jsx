import { useEffect } from 'react';
import { useDataStore } from '../store/DataContext.jsx';
import { WORKBOOKS, ALL_WORKBOOKS, VARIANT, VARIANT_LABEL, VARIANT_NOTICE } from '../store/schema.js';
import { getWorkbookProgress } from '../store/selectors.js';
import { COLORS, FONT, SPACING, RADIUS, MENTORING_URLS, RULE } from '../shared/design/tokens.js';
import { ExportImportBar } from '../shared/components/ExportImportBar.jsx';
import { CELockupA, CEMark } from '../shared/components/CELogo.jsx';
import ProfilePanel from './ProfilePanel.jsx';
import StepCard from './StepCard.jsx';
import CompanySlots from './CompanySlots.jsx';

// 변형별 브라우저 탭 제목 (신입=멘토링 / 경력=컨설팅)
const VARIANT_TITLE = {
  new_grad: 'CareerEngineer | 최종합격 멘토링',
  experienced: 'CareerEngineer | 최종합격 컨설팅',
  documents_new_grad: 'CareerEngineer | 서류합격 멘토링',
  documents_experienced: 'CareerEngineer | 서류합격 컨설팅',
  interview_new_grad: 'CareerEngineer | 면접합격 멘토링',
  interview_experienced: 'CareerEngineer | 면접합격 컨설팅',
};
const PAGE_TITLE = VARIANT_TITLE[VARIANT] || 'CareerEngineer';

const ALL_STEPS = [
  { n: 0, name: '방향 설정' },
  { n: 1, name: '채용공고·직무 분석' },
  { n: 2, name: '경험 정리' },
  { n: 3, name: '이력서·경력기술서' },
  { n: 4, name: '자소서' },
  { n: 5, name: '면접' },
];
// variant에 포함된 워크북이 있는 STEP만 노출 (카드 섹션용)
const STEPS = ALL_STEPS.filter((s) => WORKBOOKS.some((w) => w.step === s.n));

// 각 상품(variant)이 커버하는 STEP 영역. 정의가 없으면 변형의 워크북이 있는 STEP을 커버로 간주.
const COVERAGE = {
  documents_new_grad: [0, 1, 2, 3, 4],   // 신입 서류: 방향설정·채용공고분석·경험소재발굴·서류작성·자소서작성
  documents_experienced: [0, 1, 2, 3],   // 경력 서류: 방향설정·채용공고분석·경험소재발굴·서류작성(경력기술서)
  interview_new_grad: [2, 5],            // 신입 면접: 경험소재발굴·면접준비 (로드맵 워크북 없음)
  interview_experienced: [2, 3, 5],      // 경력 면접: 경험·경력기술서·면접준비
};
const COVERED_STEPS = COVERAGE[VARIANT] || ALL_STEPS.filter((s) => WORKBOOKS.some((w) => w.step === s.n)).map((s) => s.n);
// 과정에서 제외된 STEP이 하나라도 있으면 "다루는 영역만 집계" 안내를 띄운다(전 단계 커버 시엔 종합 안내).
const HAS_EXCLUDED_STEPS = COVERED_STEPS.length < ALL_STEPS.length;
// 신입=멘토링 / 경력=컨설팅 (변형 키에 'experienced' 포함 여부로 판별)
const COACHING_WORD = (VARIANT && VARIANT.includes('experienced')) ? '컨설팅' : '멘토링';
// 서류·면접 전용(부분 과정)은 제외 STEP을 흐리게+신청 안내로 노출(업셀), 종합 과정(신입 멘토링·경력 컨설팅)은 다루는 STEP만 표시.
const STEPS_TO_RENDER = COVERAGE[VARIANT] ? ALL_STEPS : ALL_STEPS.filter((s) => COVERED_STEPS.includes(s.n));

// 진행률용 STEP 라벨(1~5) — 처음 사용 가이드 흐름 문구 생성에 사용
const STEP_FLOW_LABELS = { 1: '채용공고·직무 분석', 2: '경험 정리', 3: '이력서·경력기술서', 4: '자소서', 5: '면접' };
const STEP_FLOW = COVERED_STEPS.filter((n) => n >= 1)
  .map((n, i) => `${['①', '②', '③', '④', '⑤'][i] || '·'} ${STEP_FLOW_LABELS[n]}`)
  .join(' → ');

// 커버 영역의 STEP 진행률 — variant 필터와 무관하게 전체 워크북 기준으로 계산
function coveredStepProgress(master, step) {
  const wbs = ALL_WORKBOOKS.filter((w) => w.step === step);
  if (wbs.length === 0) return 0;
  return Math.round(wbs.reduce((sum, w) => sum + getWorkbookProgress(master, w.key), 0) / wbs.length);
}

export default function Dashboard() {
  const { master } = useDataStore();

  // 변형별 브라우저 탭 제목 설정 (다른 워크북 방문 후 대시보드로 돌아와도 복원)
  useEffect(() => { document.title = PAGE_TITLE; }, []);

  return (
    <div style={{
      background: COLORS.cream,           // 60% Cream
      minHeight: '100vh',
      fontFamily: FONT.family,
      color: COLORS.ink,                  // 30% Navy 텍스트
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: `${SPACING.lg}px ${SPACING.md}px ${SPACING.xxl}px` }}>
        {/* 헤더 — Wordmark 스타일 */}
        <header className="ce-dashboard-header" style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          marginBottom: SPACING.xl, flexWrap: 'wrap', gap: SPACING.md,
          paddingBottom: SPACING.md, borderBottom: RULE,
        }}>
          <div>
            {/* H1: A 락업 (마크 + 워드마크 + 변형 배지) — 좁은 화면에선 배지가 아래로 줄바꿈 */}
            <div style={{
              display: 'flex', alignItems: 'center', flexWrap: 'wrap',
              gap: Math.round(56 * (683/620) * 0.24), rowGap: 8, maxWidth: '100%',
            }}>
              <CEMark size={56} />
              <h1 className="ce-h1-display" style={{
                margin: 0,
                fontSize: 52,
                fontWeight: 700,
                letterSpacing: '-0.028em',
                lineHeight: 1,
                color: COLORS.ink,
              }}>
                Career<span style={{ color: COLORS.goldDeep }}>Engineer</span>
              </h1>
              {VARIANT_LABEL && (
                <span style={{
                  alignSelf: 'center',
                  background: COLORS.accent, color: COLORS.white,
                  fontSize: 18, fontWeight: FONT.weight.bold,
                  padding: '6px 14px', borderRadius: RADIUS.pill,
                  letterSpacing: '-0.2px', whiteSpace: 'nowrap',
                }}>
                  {VARIANT_LABEL}
                </span>
              )}
            </div>
            {/* H2: 슬로건 */}
            <p style={{
              margin: '24px 0 0',
              fontSize: 32,
              color: COLORS.ink,
              fontWeight: FONT.weight.bold,
              lineHeight: 1.25,
              letterSpacing: '-0.6px',
            }}>
              생각하는 힘으로 커리어를 설계하다
            </p>
            {/* Body: 본문 */}
            <p style={{
              margin: '14px 0 0',
              fontSize: 20,
              color: COLORS.sub,
              fontWeight: FONT.weight.regular,
              lineHeight: 1.65,
            }}>
              취업이 막막하던 사람도 CareerEngineer의 질문에 답하다 보면, 생각하는 힘이 길러집니다. 일하는 방식이 달라집니다. 채용담당자가 먼저 알아봅니다.
            </p>
          </div>
          <ExportImportBar />
        </header>

        {/* 프로필 패널 */}
        <ProfilePanel stepFlow={STEP_FLOW} />

        {/* 6-STEP 진행률 (PROFILE 바로 아래) */}
        <section style={{
          background: COLORS.white, border: RULE,
          padding: SPACING.lg, marginBottom: SPACING.lg,
        }}>
          <h2 style={{
            margin: 0, fontSize: 26, color: COLORS.ink,
            fontWeight: FONT.weight.bold, marginBottom: SPACING.md,
            letterSpacing: '-0.5px',
          }}>
            6-STEP 진행률
          </h2>
          {VARIANT && (
            <p style={{ margin: `0 0 ${SPACING.md}px`, fontSize: 18, color: COLORS.sub, lineHeight: FONT.lineHeight.base }}>
              {HAS_EXCLUDED_STEPS ? (
                <>
                  <strong style={{ color: COLORS.accent }}>{VARIANT_LABEL}</strong>이 다루는 영역만 진도율을 집계합니다.
                </>
              ) : (
                <>
                  <strong style={{ color: COLORS.accent }}>{VARIANT_LABEL}</strong>은 취업 준비 전 과정을 함께 진행하는 종합 과정입니다. 단계별 진도율을 한눈에 확인하세요.
                </>
              )}
            </p>
          )}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: SPACING.sm,
          }}>
            {STEPS_TO_RENDER.map((s) => {
              const covered = COVERED_STEPS.includes(s.n);
              const pct = covered ? coveredStepProgress(master, s.n) : 0;
              return (
                <div key={s.n} style={{ textAlign: 'left', opacity: covered ? 1 : 0.45 }}>
                  <p style={{
                    margin: 0, fontSize: 20,
                    color: COLORS.ink, fontWeight: FONT.weight.semibold,
                    letterSpacing: 1.5, textTransform: 'uppercase',
                  }}>
                    STEP {s.n}
                  </p>
                  <p style={{
                    margin: '2px 0 0', fontSize: 20,
                    color: COLORS.sub, lineHeight: FONT.lineHeight.tight,
                  }}>
                    {s.name}
                  </p>
                  {covered ? (
                    <>
                      <div style={{ marginTop: 8, height: 4, background: COLORS.cream, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', width: `${pct}%`,
                          background: pct === 100 ? COLORS.accent : COLORS.accent2,
                          transition: 'width 0.4s ease',
                        }} />
                      </div>
                      <p style={{
                        margin: '4px 0 0', fontSize: 20,
                        color: pct === 100 ? COLORS.accent : COLORS.sub,
                        fontWeight: FONT.weight.semibold,
                      }}>
                        {pct}%
                      </p>
                    </>
                  ) : (
                    <div style={{ margin: '8px 0 0' }}>
                      <p style={{ margin: 0, fontSize: 15, color: COLORS.sub, fontWeight: FONT.weight.medium }}>
                        {COACHING_WORD} 과정 외 STEP
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: 14, color: COLORS.goldText, fontWeight: FONT.weight.semibold }}>
                        희망 시 {COACHING_WORD} 신청 가능
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 회사별 슬롯 (여러 회사 지원 관리) */}
        <CompanySlots />

        {/* STEP별 워크북 카드 */}
        {STEPS.map((s) => {
          const items = WORKBOOKS.filter((w) => w.step === s.n);
          if (items.length === 0) return null;
          return (
            <section key={s.n} style={{ marginBottom: SPACING.xl }}>
              <div style={{
                display: 'flex', alignItems: 'baseline', gap: SPACING.sm,
                marginBottom: SPACING.md,
              }}>
                <span style={{
                  fontSize: 20, color: COLORS.accent2,
                  letterSpacing: 3, textTransform: 'uppercase',
                  fontWeight: FONT.weight.semibold,
                }}>
                  STEP {s.n}
                </span>
                <h3 style={{
                  margin: 0, fontSize: 22,
                  color: COLORS.ink, fontWeight: FONT.weight.bold,
                  letterSpacing: '-0.4px',
                }}>
                  {s.name}
                </h3>
              </div>
              <div style={{
                display: 'grid',
                // STEP 4(자소서 작성)는 3열, 모바일에서는 1열
                gridTemplateColumns: s.n === 4
                  ? 'repeat(auto-fit, minmax(220px, 1fr))'
                  : 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: SPACING.md,
              }}>
                {items.map((w) => (
                  <StepCard key={w.key} workbook={w} progress={getWorkbookProgress(master, w.key)} />
                ))}
              </div>
            </section>
          );
        })}

        {/* variant 안내 배너 (예: 신입 서류 전용 → 신입 면접 준비/멘토링 안내) */}
        {VARIANT_NOTICE && (
          <section style={{
            background: COLORS.white, border: RULE,
            borderLeft: `4px solid ${COLORS.accent2}`,
            padding: SPACING.lg, marginBottom: SPACING.xl,
            display: 'flex', flexWrap: 'wrap', alignItems: 'center',
            justifyContent: 'space-between', gap: SPACING.md,
          }}>
            <div style={{ flex: 1, minWidth: 240 }}>
              <h3 style={{
                margin: 0, fontSize: 22, color: COLORS.ink,
                fontWeight: FONT.weight.bold, letterSpacing: '-0.3px',
              }}>
                {VARIANT_NOTICE.title}
              </h3>
              <p style={{
                margin: '8px 0 0', fontSize: 20, color: COLORS.sub,
                lineHeight: 1.6,
              }}>
                {VARIANT_NOTICE.body}
              </p>
            </div>
            <div style={{ display: 'flex', gap: SPACING.sm, flexWrap: 'wrap', flexShrink: 0 }}>
              {(VARIANT_NOTICE.links || []).map((lnk, i) => (
                <a
                  key={lnk.url}
                  href={lnk.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: i === 0 ? COLORS.accent : COLORS.white,
                    color: i === 0 ? COLORS.white : COLORS.accent,
                    border: i === 0 ? `1px solid ${COLORS.accent}` : `1px solid ${COLORS.line}`,
                    textDecoration: 'none', whiteSpace: 'nowrap',
                    fontSize: 18, fontWeight: FONT.weight.semibold,
                    padding: '12px 20px', borderRadius: RADIUS.pill,
                  }}
                >
                  {lnk.label}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer style={{
          marginTop: SPACING.xxl, paddingTop: SPACING.lg,
          borderTop: RULE,
          color: COLORS.sub,
          lineHeight: FONT.lineHeight.base,
        }}>
          <div style={{ marginBottom: SPACING.md }}>
            <CELockupA markSize={26} />
          </div>
          <p style={{
            margin: 0, fontSize: 20,
            color: COLORS.sub, lineHeight: 1.7,
            textAlign: 'left',
          }}>
            © 2026 CareerEngineer. All Rights Reserved. 저작권법에 의하여 보호받는 저작물이므로 무단 전재와 무단 복제를 금합니다.
            이 자료는 구매하신 분의 취업을 위한 개인 학습 용도로 자유롭게 활용하실 수 있으나,
            자료의 전부 또는 일부를 다른 사람에게 공유하거나, 복제·재판매·재배포하는 것은 금지되어 있습니다.
            {' '}<strong style={{ color: COLORS.ink }}>이를 위반할 경우 관련 법률에 따라 민·형사상 책임을 질 수 있습니다.</strong>
          </p>
        </footer>
      </div>
    </div>
  );
}
