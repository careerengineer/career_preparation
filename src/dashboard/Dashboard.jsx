import { useDataStore } from '../store/DataContext.jsx';
import { WORKBOOKS } from '../store/schema.js';
import { getWorkbookProgress, getStepProgress } from '../store/selectors.js';
import { COLORS, FONT, SPACING, RADIUS, MENTORING_URLS, RULE } from '../shared/design/tokens.js';
import { ExportImportBar } from '../shared/components/ExportImportBar.jsx';
import { CELockupA, CEMark } from '../shared/components/CELogo.jsx';
import ProfilePanel from './ProfilePanel.jsx';
import StepCard from './StepCard.jsx';
import NextActionCard from './NextActionCard.jsx';
import CompanySlots from './CompanySlots.jsx';

const STEPS = [
  { n: 0, name: '방향 설정' },
  { n: 1, name: '채용공고 분석' },
  { n: 2, name: '경험 소재 발굴' },
  { n: 3, name: '서류 작성' },
  { n: 4, name: '자소서 5대 항목' },
  { n: 5, name: '면접 준비' },
];

export default function Dashboard() {
  const { master } = useDataStore();

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
            <p style={{
              margin: 0, fontSize: FONT.size.caption, color: COLORS.sub,
              letterSpacing: 4, fontWeight: FONT.weight.medium, textTransform: 'uppercase',
            }}>
              CAREER ENGINEERING · EST. 2026
            </p>
            <h1 className="ce-h1-display" style={{
              margin: '6px 0 0',
              fontSize: FONT.size.h1, color: COLORS.ink,
              fontWeight: FONT.weight.bold,
              letterSpacing: '-1.4px',
              lineHeight: FONT.lineHeight.tight,
            }}>
              CareerEngineer<span style={{ color: COLORS.accent2 }}>.</span>
            </h1>
            <p style={{
              margin: '6px 0 0',
              fontSize: FONT.size.body,
              color: COLORS.sub,
              lineHeight: FONT.lineHeight.base,
            }}>
              데이터로 다음 단계를 보여주고, 함께 그 단계를 걷습니다.
            </p>
          </div>
          <ExportImportBar />
        </header>

        {/* 프로필 패널 */}
        <ProfilePanel />

        {/* 다음 액션 (profile 있을 때만 표시) */}
        <NextActionCard />

        {/* 회사별 슬롯 (여러 회사 지원 관리) */}
        <CompanySlots />

        {/* 6-STEP 진행률 */}
        <section style={{
          background: COLORS.white, border: RULE,
          padding: SPACING.lg, marginBottom: SPACING.lg,
        }}>
          <h2 style={{
            margin: 0, fontSize: FONT.size.h3, color: COLORS.ink,
            fontWeight: FONT.weight.semibold, marginBottom: SPACING.md,
            letterSpacing: '-0.4px',
          }}>
            6-STEP 진행률
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: SPACING.sm,
          }}>
            {STEPS.map((s) => {
              const pct = getStepProgress(master, s.n);
              return (
                <div key={s.n} style={{ textAlign: 'left' }}>
                  <p style={{
                    margin: 0, fontSize: FONT.size.caption,
                    color: COLORS.ink, fontWeight: FONT.weight.semibold,
                    letterSpacing: 1.5, textTransform: 'uppercase',
                  }}>
                    STEP {s.n}
                  </p>
                  <p style={{
                    margin: '2px 0 0', fontSize: FONT.size.xs,
                    color: COLORS.sub, lineHeight: FONT.lineHeight.tight,
                  }}>
                    {s.name}
                  </p>
                  <div style={{
                    marginTop: 8, height: 4, background: COLORS.cream,
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%', width: `${pct}%`,
                      background: pct === 100 ? COLORS.accent : COLORS.accent2,  // 완료 Navy / 진행 Gold
                      transition: 'width 0.4s ease',
                    }} />
                  </div>
                  <p style={{
                    margin: '4px 0 0', fontSize: FONT.size.xs,
                    color: pct === 100 ? COLORS.accent : COLORS.sub,
                    fontWeight: FONT.weight.semibold,
                  }}>
                    {pct}%
                  </p>
                </div>
              );
            })}
          </div>
        </section>

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
                  fontSize: FONT.size.caption, color: COLORS.accent2,
                  letterSpacing: 3, textTransform: 'uppercase',
                  fontWeight: FONT.weight.semibold,
                }}>
                  STEP {s.n}
                </span>
                <h3 style={{
                  margin: 0, fontSize: FONT.size.bodyL,
                  color: COLORS.ink, fontWeight: FONT.weight.semibold,
                  letterSpacing: '-0.3px',
                }}>
                  {s.name}
                </h3>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: SPACING.md,
              }}>
                {items.map((w) => (
                  <StepCard key={w.key} workbook={w} progress={getWorkbookProgress(master, w.key)} />
                ))}
              </div>
            </section>
          );
        })}

        {/* Footer */}
        <footer style={{
          marginTop: SPACING.xxl, paddingTop: SPACING.lg,
          borderTop: RULE,
          color: COLORS.sub, fontSize: FONT.size.caption,
          letterSpacing: 1.5,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: SPACING.md,
        }}>
          <CELockupA size={20} color={COLORS.sub} />
          <p style={{ margin: 0, textTransform: 'uppercase' }}>
            © 2026 CAREERENGINEER · 멘토링 문의:{' '}
            <a href={MENTORING_URLS.consulting} target="_blank" rel="noopener noreferrer"
              style={{
                color: COLORS.accent2, textDecoration: 'none',
                fontWeight: FONT.weight.semibold,
              }}>
              1:1 컨설팅 →
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
