// 모든 워크북·대시보드 하단 공통 푸터 — 로고 + 저작권
import { CELockupA } from './CELogo.jsx';
import { COLORS, FONT, SPACING, RULE } from '../design/tokens.js';

export function WorkbookFooter() {
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
      <p style={{
        margin: 0, fontSize: 20,
        color: COLORS.sub, lineHeight: 1.7,
      }}>
        © 2026 CareerEngineer. All Rights Reserved. 저작권법에 의하여 보호받는 저작물이므로 무단 전재와 무단 복제를 금합니다.
        이 자료는 구매하신 분의 취업을 위한 개인 학습 용도로 자유롭게 활용하실 수 있으나,
        자료의 전부 또는 일부를 다른 사람에게 공유하거나, 복제·재판매·재배포하는 것은 금지되어 있습니다.
        {' '}<strong style={{ color: COLORS.ink }}>이를 위반할 경우 관련 법률에 따라 민·형사상 책임을 질 수 있습니다.</strong>
      </p>
    </footer>
  );
}
