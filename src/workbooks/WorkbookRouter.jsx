import { useParams, Link } from 'react-router-dom'
import { COLORS, FONT, SPACING } from '../shared/design/tokens.js'
import ExperiencePage from './experience/index.jsx'
import JobAnalysisPage from './job_analysis/index.jsx'
import ResumePage from './resume/index.jsx'
import CareerDescriptionPage from './career_description/index.jsx'
import MotivationPage from './motivation/index.jsx'
import JobcompetencyPage from './jobcompetency/index.jsx'
import PersonalityPage from './personality/index.jsx'
import GoalachievementPage from './goalachievement/index.jsx'
import CareergoalPage from './careergoal/index.jsx'
import SelfIntroductionPage from './self_introduction/index.jsx'
import InterviewNewPage from './interview_new/index.jsx'
import InterviewCareerPage from './interview_career/index.jsx'

const PAGES = {
  experience: ExperiencePage,
  job_analysis: JobAnalysisPage,
  resume: ResumePage,
  career_description: CareerDescriptionPage,
  motivation: MotivationPage,
  jobcompetency: JobcompetencyPage,
  personality: PersonalityPage,
  goalachievement: GoalachievementPage,
  careergoal: CareergoalPage,
  self_introduction: SelfIntroductionPage,
  interview_new: InterviewNewPage,
  interview_career: InterviewCareerPage,
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
        이 워크북은 아직 준비 중입니다.
      </p>
      <Link to="/" style={{ color: COLORS.accent2 }}>← 대시보드로 돌아가기</Link>
    </div>
  )
}
