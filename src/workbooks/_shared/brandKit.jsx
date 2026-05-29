// 전 워크북 공용 브랜드 자산 — 로고(base64)와 인트로 폰트.
import { COLORS, SPACING } from '../../shared/design/tokens.js';
// 8개 워크북/엔진에 byte-동일하게 복붙돼 있던 것을 단일 소스로 통합. 동작 변경 없음.
export const CE_SYMBOL_B64 = "data:image/png;base64,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";
export const _INTRO_FONT = '"Pretendard", -apple-system, BlinkMacSystemFont, system-ui, sans-serif';

// ── 인트로 색상 상수 + 컴포넌트 (essay 기준 표준; 값은 전부 브랜드 팔레트) ──
export const _INTRO_INK = '#0E2750';

export const _INTRO_INK2 = '#1B3A6B';

export const _INTRO_PAPER = '#F2F1EC';

export const _INTRO_GOLD = '#C9A86A';

export const _INTRO_MUTE = '#565F72';

export const CESymbol = ({ size = 32 }) => (
    <img
      src={CE_SYMBOL_B64}
      alt="CareerEngineer 심볼"
      style={{ height: size, width: 'auto', flexShrink: 0, display: 'inline-block' }}
    />
  );

export const CELockupA = ({ height = 32 }) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: height * 0.2, height: height, lineHeight: 1, flexShrink: 0 }}>
      <img src={CE_SYMBOL_B64} alt="" aria-hidden="true" style={{ height: height, width: 'auto', display: 'block' }} />
      <span style={{ fontFamily: '"Pretendard", -apple-system, BlinkMacSystemFont, system-ui, sans-serif', fontWeight: 700, fontSize: height * 0.62, letterSpacing: '-0.028em', whiteSpace: 'nowrap' }} aria-label="CareerEngineer">
        <span style={{ color: '#0E2750' }}>Career</span><span style={{ color: '#C9A86A' }}>Engineer</span>
      </span>
    </span>
  );

export const FirstVisitModal = ({ open, onClose, title, steps }) => {
    if (!open) return null;
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(14, 39, 80, 0.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={onClose}>
        <div style={{ background: '#fff', borderRadius: 14, padding: 'clamp(16px, 4vw, 32px)', maxWidth: 480, width: '100%', boxShadow: '0 20px 50px rgba(14, 39, 80,0.2)', fontFamily: '"Pretendard", -apple-system, BlinkMacSystemFont, system-ui, sans-serif' }} onClick={e => e.stopPropagation()}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0E2750', margin: 0, marginBottom: 16 }}>{title}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
            {(steps || []).map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, fontSize: 15, color: '#0E2750', lineHeight: 1.7 }}>
                <span style={{ color: '#C9A86A', fontWeight: 700, minWidth: 20 }}>{i+1}.</span>
                <span dangerouslySetInnerHTML={{ __html: s }} />
              </div>
            ))}
          </div>
          <button onClick={onClose} style={{ background: '#0E2750', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 24px', fontSize: 16, fontWeight: 600, cursor: 'pointer', width: '100%', fontFamily: 'inherit' }}>
            확인, 시작합니다
          </button>
        </div>
      </div>
    );
  };

export const BrandHero = () => (
  <div style={{ textAlign: 'center', marginBottom: 24, paddingTop: 12 }}>
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
      <CELockupA height={56} />
    </div>
    <p style={{ fontSize: 20, fontWeight: 700, color: _INTRO_INK, margin: '8px 0 0', fontFamily: _INTRO_FONT }}>
      생각하는 힘으로 커리어를 설계하다
    </p>
    <p style={{ fontSize: 15, fontWeight: 400, color: _INTRO_MUTE, margin: '4px 0 0', lineHeight: 1.6, fontFamily: _INTRO_FONT }}>
      취업이 막막하던 사람도 CareerEngineer의 질문에 답하다 보면,<br />
      생각하는 힘이 길러집니다. 일하는 방식이 달라집니다. 채용담당자가 먼저 알아봅니다.
    </p>
  </div>
);

export const IntroCTA = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="ce-intro-cta"
    style={{
      width: '100%', padding: '16px 32px',
      background: _INTRO_INK, color: '#ffffff',
      border: 'none', borderRadius: 4,
      fontSize: 16, fontWeight: 600, cursor: 'pointer',
      fontFamily: _INTRO_FONT, marginTop: 16,
    }}
  >
    {children || '시작하기'}
  </button>
);

export const IntroFlowCard = ({ flow, flowTitle }) => {
  if (!flow || flow.length === 0) return null;
  return (
    <div style={{ background: _INTRO_PAPER, borderRadius: 12, padding: 20, marginBottom: 24 }}>
      <p style={{ fontSize: 15, fontWeight: 700, color: _INTRO_INK, margin: 0, marginBottom: 12 }}>
        {flowTitle || '이 워크북의 작성 순서'}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {flow.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 15, color: _INTRO_INK2 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: _INTRO_INK, flexShrink: 0, minWidth: 64 }}>
              {item.label}
            </span>
            <span style={{ flex: 1, lineHeight: 1.6 }}>{item.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const IntroCopyright = () => (
  <div style={{ background: _INTRO_PAPER, border: `1px solid ${_INTRO_INK}33`, color: _INTRO_INK, padding: 16, borderRadius: 10, marginBottom: 16 }}>
    <p style={{ fontSize: 16, color: _INTRO_INK, fontWeight: 700, margin: 0, lineHeight: 1.6 }}>
      작성 내용은 이 브라우저에서만 자동 저장됩니다. 백업하거나 다른 기기에서 이어 쓰려면 상단의 '다운로드 (.docx)' 버튼으로 파일을 내려받고, '불러오기' 버튼으로 복원할 수 있습니다.
    </p>
  </div>
);

// ── 푸터 + 포커스 스타일 (essay 기준 표준: 8pt 그리드 · 골드 포커스 링) ──
export const StickyFooter = () => (
    <div style={{ position: 'sticky', bottom: 0, background: COLORS.bg, borderTop: `1px solid ${COLORS.border}`, padding: `${SPACING.sm}px ${SPACING.md}px`, marginTop: SPACING.lg, marginLeft: -SPACING.md, marginRight: -SPACING.md, marginBottom: -SPACING.md, zIndex: 5 }}>
      <div style={{ maxWidth: 1350, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: SPACING.sm, flexWrap: 'wrap' }}>
        <p style={{ fontSize: 16, color: COLORS.sub, margin: 0 }}>
          <a href={`https://open.kakao.com/me/careerengineer`} target="_blank" rel="noopener noreferrer" style={{ color: COLORS.accent2, textDecoration: 'none' }}>CareerEngineer 카카오톡 상담</a>
        </p>
      </div>
    </div>
  );

export const FocusStyles = () => (
    <style>{`
      .ce-input:focus, .ce-textarea:focus, .ce-select:focus {
        border-color: ${COLORS.accent2} !important;
        box-shadow: 0 0 0 3px rgba(201, 168, 106, 0.12) !important;
      }
      .ce-save-btn:hover { opacity: 0.88; }
    `}</style>
  );
