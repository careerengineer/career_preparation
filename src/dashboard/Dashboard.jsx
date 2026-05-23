import { useDataStore } from '../store/DataContext.jsx';
import { WORKBOOKS } from '../store/schema.js';
import { getWorkbookProgress, getStepProgress } from '../store/selectors.js';
import { COLORS, FONT, SPACING, RADIUS, MENTORING_URLS } from '../shared/design/tokens.js';
import { ExportImportBar } from '../shared/components/ExportImportBar.jsx';
import ProfilePanel from './ProfilePanel.jsx';
import StepCard from './StepCard.jsx';
import NextActionCard from './NextActionCard.jsx';

const STEPS = [0, 1, 2, 3, 4, 5];

export default function Dashboard() {
  const { master } = useDataStore();

  return (
    <div style={{
      background: COLORS.bg,
      minHeight: '100vh',
      fontFamily: FONT.family,
      color: COLORS.ink,
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: `${SPACING.lg}px ${SPACING.md}px ${SPACING.xxl}px` }}>
        {/* 헤더 */}
        <header style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: SPACING.lg, flexWrap: 'wrap', gap: SPACING.md,
        }}>
          <div>
            <p style={{ margin: 0, fontSize: FONT.size.xs, color: COLORS.accent2, letterSpacing: 4, fontWeight: FONT.weight.semibold, textTransform: 'uppercase' }}>
              CAREER ENGINEER
            </p>
            <h1 style={{ margin: '4px 0 0', fontSize: FONT.size.h1, color: COLORS.ink, fontWeight: FONT.weight.bold }}>
              취업 준비 통합 시스템
            </h1>
          </div>
          <ExportImportBar />
        </header>

        {/* 프로필 패널 */}
        <ProfilePanel />

        {/* 전체 진행률 */}
        <section style={{
          background: COLORS.white, borderRadius: RADIUS.lg,
          padding: SPACING.lg, marginBottom: SPACING.lg,
        }}>
          <h2 style={{ margin: 0, fontSize: FONT.size.lg, color: COLORS.ink, fontWeight: FONT.weight.semibold, marginBottom: SPACING.md }}>
            6-STEP 진행률
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: SPACING.sm }}>
            {STEPS.map((s) => {
              const pct = getStepProgress(master, s);
              return (
                <div key={s} style={{ textAlign: 'center' }}>
                  <p style={{ margin: 0, fontSize: FONT.size.xs, color: COLORS.sub, fontWeight: FONT.weight.semibold }}>
                    STEP {s}
                  </p>
                  <div style={{
                    marginTop: 6, height: 6, background: COLORS.bgAlt,
                    borderRadius: RADIUS.pill, overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%', width: `${pct}%`,
                      background: pct === 100 ? COLORS.green : COLORS.accent2,
                      transition: 'width 0.4s ease',
                    }} />
                  </div>
                  <p style={{ margin: '4px 0 0', fontSize: FONT.size.xs, color: COLORS.sub }}>
                    {pct}%
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 다음 액션 */}
        <NextActionCard />

        {/* STEP 카드 그리드 */}
        {STEPS.map((s) => {
          const items = WORKBOOKS.filter((w) => w.step === s);
          if (items.length === 0) return null;
          return (
            <section key={s} style={{ marginBottom: SPACING.lg }}>
              <h3 style={{
                margin: 0, marginBottom: SPACING.sm,
                fontSize: FONT.size.sm, color: COLORS.accent,
                letterSpacing: 3, textTransform: 'uppercase', fontWeight: FONT.weight.semibold,
              }}>
                STEP {s}
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
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
          borderTop: `1px solid ${COLORS.line}`,
          textAlign: 'center', color: COLORS.sub, fontSize: FONT.size.xs,
        }}>
          <p style={{ margin: 0 }}>© CareerEngineer · 멘토링 문의:{' '}
            <a href={MENTORING_URLS.consulting} target="_blank" rel="noopener noreferrer"
              style={{ color: COLORS.accent2, textDecoration: 'none', fontWeight: FONT.weight.semibold }}>
              1:1 컨설팅
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
