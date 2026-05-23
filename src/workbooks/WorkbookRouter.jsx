import { lazy, Suspense } from 'react'
import { useParams, Link } from 'react-router-dom'
import { COLORS, FONT, SPACING } from '../shared/design/tokens.js'

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
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: COLORS.sub,
    }}>
      워크북 로딩 중…
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
    <Suspense fallback={<Loading />}>
      <Page />
    </Suspense>
  )
}
