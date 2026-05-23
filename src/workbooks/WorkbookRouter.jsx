import { useParams, Link } from 'react-router-dom'
import { COLORS, FONT, SPACING } from '../shared/design/tokens.js'

export default function WorkbookRouter() {
  const { workbookKey } = useParams()
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
        이 워크북은 아직 준비 중입니다. (Phase 5~7에서 구현)
      </p>
      <Link to="/" style={{ color: COLORS.accent2 }}>← 대시보드로 돌아가기</Link>
    </div>
  )
}
