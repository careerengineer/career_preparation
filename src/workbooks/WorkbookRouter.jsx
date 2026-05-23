import { useParams, Link } from 'react-router-dom'
import { COLORS, FONT, SPACING } from '../shared/design/tokens.js'
import ExperiencePage from './experience/index.jsx'

const PAGES = {
  experience: ExperiencePage,
}

export default function WorkbookRouter() {
  const { workbookKey } = useParams()
  const Page = PAGES[workbookKey]
  if (Page) return <Page />
  return (
    <div style={{
      background: COLORS.bg,
      minHeight: '100vh',
      fontFamily: FONT.family,
      padding: SPACING.xl,
      textAlign: 'center',
    }}>
      <p style={{ color: COLORS.sub, fontSize: FONT.size.sm }}>
        workbookKey: <strong>{workbookKey}</strong>
      </p>
      <p style={{ color: COLORS.ink }}>
        이 워크북은 아직 준비 중입니다. (추후 어댑팅 예정)
      </p>
      <Link to="/" style={{ color: COLORS.accent2 }}>← 대시보드로 돌아가기</Link>
    </div>
  )
}
