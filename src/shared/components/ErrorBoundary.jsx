import { Component } from 'react';
import { COLORS, FONT, SPACING } from '../design/tokens.js';

// 렌더 중 예외가 나도 하얀 화면 대신 복구 안내를 보여준다.
// (워크북 어디선가 throw해도 앱 전체가 멈추지 않도록)
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || String(error) };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info?.componentStack);
  }

  goHome = () => {
    try { window.location.hash = '#/'; } catch { /* ignore */ }
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div style={{
        background: COLORS.bg, minHeight: '100vh', fontFamily: FONT.family,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: SPACING.lg,
      }}>
        <div style={{
          background: COLORS.white, border: `1px solid ${COLORS.line}`,
          borderTop: `4px solid ${COLORS.accent2}`,
          maxWidth: 520, width: '100%', padding: SPACING.xl, textAlign: 'center',
        }}>
          <h1 style={{ margin: 0, fontSize: 24, color: COLORS.ink, fontWeight: FONT.weight.bold }}>
            화면을 표시하는 중 문제가 발생했습니다
          </h1>
          <p style={{ margin: `${SPACING.md}px 0 0`, fontSize: 20, color: COLORS.sub, lineHeight: 1.7 }}>
            작성하신 내용은 자동 저장되어 있으니 안심하세요.
            아래 버튼으로 대시보드로 돌아가 다시 시도해 주세요.
          </p>
          <button
            onClick={this.goHome}
            style={{
              marginTop: SPACING.lg,
              background: COLORS.accent, color: COLORS.white, border: 'none',
              padding: '12px 22px', fontFamily: FONT.family,
              fontSize: 18, fontWeight: FONT.weight.semibold, cursor: 'pointer',
            }}
          >
            대시보드로 돌아가기
          </button>
          {this.state.message && (
            <p style={{ margin: `${SPACING.md}px 0 0`, fontSize: 14, color: COLORS.sub, wordBreak: 'break-word' }}>
              ({this.state.message})
            </p>
          )}
        </div>
      </div>
    );
  }
}
