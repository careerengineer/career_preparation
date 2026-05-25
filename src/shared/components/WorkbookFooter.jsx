// 모든 워크북·대시보드 하단에 항상 노출되는 공통 푸터
// - CareerEngineer 로고
// - 직무상세내용 키워드 추출이 막막할 때 STEP 1(채용공고·직무분석)로 안내
// - 저작권 한 줄

import { Link } from 'react-router-dom';
import { CELockupA } from './CELogo.jsx';
import { COLORS, FONT, SPACING, RULE } from '../design/tokens.js';

export function WorkbookFooter({ currentWorkbookKey }) {
  const showJdGuide = currentWorkbookKey !== 'job_analysis';
  return (
    <footer style={{
      marginTop: SPACING.xxl, paddingTop: SPACING.lg,
      borderTop: RULE,
      color: COLORS.sub,
      lineHeight: FONT.lineHeight.base,
    }}>
      <div style={{ marginBottom: SPACING.md }}>
        <CELockupA markSize={26} />
      </div>

      {showJdGuide && (
        <div style={{
          background: COLORS.bgAlt,
          borderLeft: `3px solid ${COLORS.accent2}`,
          padding: SPACING.md,
          marginBottom: SPACING.md,
        }}>
          <p style={{
            margin: 0, fontSize: 20, color: COLORS.ink,
            lineHeight: 1.7, fontWeight: FONT.weight.semibold,
          }}>
            직무상세내용 키워드를 어떻게 뽑을지 막막하다면 —{' '}
            <Link to="/workbook/job_analysis" style={{ color: COLORS.accent, fontWeight: FONT.weight.bold }}>
              STEP 1의 「채용공고·직무분석 가이드」
            </Link>
            를 참고해 채용공고에서 핵심 키워드를 추출한 뒤 돌아오세요.
          </p>
        </div>
      )}

      <p style={{
        margin: 0, fontSize: 16,
        color: COLORS.sub, lineHeight: 1.7,
      }}>
        © 2026 CareerEngineer. All Rights Reserved. 저작권법에 의하여 보호받는 저작물이므로 무단 전재와 무단 복제를 금합니다.
      </p>
    </footer>
  );
}
