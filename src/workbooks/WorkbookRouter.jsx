import { lazy, Suspense } from 'react'
import { useParams, Link } from 'react-router-dom'
import { COLORS, FONT, SPACING } from '../shared/design/tokens.js'
import { ErrorBoundary } from '../shared/components/ErrorBoundary.jsx'

const PAGES = {
  career_roadmap:     lazy(() => import('./career_roadmap/index.jsx')),
  experience:         lazy(() => import('./experience/index.jsx')),
  job_analysis:       lazy(() => import('./job_analysis/index.jsx')),
  resume:             lazy(() => import('./resume/index.jsx')),
  career_description: lazy(() => import('./career_description/index.jsx')),
  motivation:         lazy(() => import('./motivation/index.jsx')),
  jobcompetency:      lazy(() => import('./jobcompetency/index.jsx')),
  personality:        lazy(() => import('./personality/index.jsx')),
  goalachievement:    lazy(() => import('./goalachievement/index.jsx')),
  careergoal:         lazy(() => import('./careergoal/index.jsx')),
  self_introduction:  lazy(() => import('./self_introduction/index.jsx')),
  interview_new:      lazy(() => import('./interview_new/index.jsx')),
  interview_career:   lazy(() => import('./interview_career/index.jsx')),
}

function Loading() {
  return (
    <div style={{
      background: COLORS.bg, minHeight: '100vh', fontFamily: FONT.family,
      padding: SPACING.lg,
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* skeleton header */}
        <div style={{
          height: 44, background: '#E5E1D6', borderRadius: 22,
          width: 200, marginBottom: 12, opacity: 0.4,
          animation: 'ce-pulse 1.2s ease-in-out infinite',
        }} />
        <div style={{
          height: 14, background: '#E5E1D6', width: 120,
          marginBottom: 8, opacity: 0.4,
          animation: 'ce-pulse 1.2s ease-in-out infinite',
        }} />
        <div style={{
          height: 32, background: '#E5E1D6', width: 280,
          marginBottom: 32, opacity: 0.4,
          animation: 'ce-pulse 1.2s ease-in-out infinite',
        }} />
        {[1,2,3].map((i) => (
          <div key={i} style={{
            height: 80, background: '#FFF', border: '1px solid #E5E1D6',
            marginBottom: 12, opacity: 0.5,
            animation: 'ce-pulse 1.2s ease-in-out infinite',
            animationDelay: `${i * 0.1}s`,
          }} />
        ))}
        <style>{`@keyframes ce-pulse { 0%, 100% { opacity: 0.3 } 50% { opacity: 0.6 } }`}</style>
      </div>
    </div>
  )
}

export default function WorkbookRouter() {
  const { workbookKey } = useParams()
  const Page = PAGES[workbookKey]
  if (!Page) {
    return (
      <div style={{
        background: COLORS.bg, minHeight: '100vh', fontFamily: FONT.family,
        padding: SPACING.xl, textAlign: 'center',
      }}>
        <p style={{ color: COLORS.sub, fontSize: FONT.size.sm }}>
          workbookKey: <strong>{workbookKey}</strong>
        </p>
        <p style={{ color: COLORS.ink }}>이 워크북은 아직 준비 중입니다.</p>
        <Link to="/" style={{ color: COLORS.accent2 }}>대시보드로 돌아가기</Link>
      </div>
    )
  }
  return (
    <ErrorBoundary key={workbookKey}>
      <Suspense fallback={<Loading />}>
        <Page />
      </Suspense>
    </ErrorBoundary>
  )
}
