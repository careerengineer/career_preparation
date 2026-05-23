import { COLORS, FONT, SPACING } from '../shared/design/tokens.js'

export default function Dashboard() {
  return (
    <div style={{
      background: COLORS.bg,
      minHeight: '100vh',
      fontFamily: FONT.family,
      padding: SPACING.xl,
    }}>
      <h1 style={{ color: COLORS.ink, fontSize: FONT.size.h1 }}>
        CareerEngineer
      </h1>
      <p style={{ color: COLORS.sub }}>
        Phase 1 placeholder — Dashboard will be implemented in Phase 3.
      </p>
    </div>
  )
}
