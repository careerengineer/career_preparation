// [BUILD v36 20260520 10:30] docx 저장에 CareerEngineer 자료 + 멘토링 안내 섹션 추가 (ExternalHyperlink + linkP)
import { useState, useEffect, useRef } from 'react';
import * as DOCX from 'docx';
import { clickable } from '../../shared/a11y.js';
import { COLORS, RADIUS } from '../../shared/design/tokens.js';
import { buildWorkbookBackupParagraphs, buildWorkbookPayload, buildCopyrightParagraphs } from '../../store/docxBackup.js';
import { buildCareerDescDocxChildren } from '../../store/workbookDocx.js';
import { ReferenceInline } from '../../shared/components/ReferenceInline.jsx';
import { ToggleLink } from '../../shared/components/ToggleLink.jsx';
import { _INTRO_FONT, StickyFooter } from '../_shared/brandKit.jsx';
import { _INTRO_INK, _INTRO_INK2, _INTRO_PAPER, _INTRO_GOLD, _INTRO_MUTE, CELockupA, FirstVisitModal, BrandHero, IntroCTA, IntroFlowCard, IntroCopyright } from '../_shared/brandKit.jsx';

// 멘토링·컨설팅 URL 상수 (작업 18: URL 상수화)
// ══════════════════════════════════════════════════════════════
//  CareerEngineer 브랜드 오버라이드 (PART 7-6 표준)
// ══════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════════
//  CareerEngineer 워크북 라이브러리 (URL은 나중에 일괄 적용)
// ════════════════════════════════════════════════════════════════
const WORKBOOK_LINKS = { career_roadmap: { label: 'STEP 0 · 취업 로드맵 진단', url: 'https://www.latpeed.com/products/YPFjD' },
  job_analysis:       { label: 'STEP 1 · 채용공고 및 직무분석', url: 'https://www.latpeed.com/products/-3Wgm' },
  experience:         { label: 'STEP 2 · 경험 정리', url: 'https://www.latpeed.com/products/wDSaj' },
  motivation:         { label: 'STEP 4 · 지원동기 작성', url: 'https://www.latpeed.com/products/dfdMW' },
  jobcompetency:      { label: 'STEP 4 · 직무역량 작성', url: 'https://www.latpeed.com/products/dfdMW' },
  personality:        { label: 'STEP 4 · 성격 장단점 작성', url: 'https://www.latpeed.com/products/dfdMW' },
  goalachievement:    { label: 'STEP 4 · 목표수립 및 달성 작성', url: 'https://www.latpeed.com/products/dfdMW' },
  careergoal:         { label: 'STEP 4 · 입사후 포부 작성', url: 'https://www.latpeed.com/products/dfdMW' },
  self_introduction:  { label: 'STEP 5 · 1분 자기소개 준비', url: 'https://www.latpeed.com/products/LObbV' },
  resume:             { label: 'STEP 3 · 이력서 작성', url: 'https://www.latpeed.com/products/F8JkO' },
  career_description: { label: 'STEP 3 · 경력기술서 작성', url: 'https://www.latpeed.com/products/AkBH-' },
  interview_new:      { label: 'STEP 5 · 신입 면접 준비', url: 'https://www.latpeed.com/products/H7UHo' },
  interview_career:   { label: 'STEP 5 · 경력 면접 준비', url: 'https://www.latpeed.com/products/j3RfY' },
  interview_answer_guide: { label: 'STEP 5 · 면접 유형별 답변 전략', url: 'https://www.latpeed.com/products/O-KKc' },
};

// ════════════════════════════════════════════════════════════════
//  CareerEngineer 디자인 토큰 (PART 7-2)
// ════════════════════════════════════════════════════════════════

  // ══════════ CE 로고 (정식 PNG base64 임베딩) ══════════
    
// ════════════════════════════════════════════════════════════
//  표준 Intro 페이지 컴포넌트 — 통일 7-Block 구조
//  (Brand Standards v1.0 + 통일 방안 v1.0 적용)
// ════════════════════════════════════════════════════════════

const IntroPrerequisites = ({ items }) => {
  if (!items || items.length === 0) return null;
  return (
    <div style={{ background: COLORS.paper, border: `1px solid ${_INTRO_GOLD}33`, color: _INTRO_INK, padding: 16, borderRadius: RADIUS.md, marginBottom: 16 }}>
      <p style={{ fontSize: 15, fontWeight: 700, color: _INTRO_INK, margin: 0, marginBottom: 10 }}>사전 준비물</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((item, i) => {
          const isObj = typeof item === 'object' && item !== null;
          const text = isObj ? item.text : item;
          const recommend = isObj ? item.recommend : null;
          const link = recommend ? WORKBOOK_LINKS[recommend.workbookId] : null;
          return (
            <div key={i}>
              <p style={{ fontSize: 16, color: _INTRO_INK, margin: 0, lineHeight: 1.6 }}>· {text}</p>
              {link && (
                <p style={{ fontSize: 13, color: _INTRO_MUTE, margin: '2px 0 0 14px', lineHeight: 1.6 }}>
                  └ {recommend.condition || '아직 준비되지 않았다면'} →{' '}
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: _INTRO_INK2, fontWeight: 700, textDecoration: 'underline', textDecorationColor: `${_INTRO_INK2}66`, textUnderlineOffset: 2 }}
                  >
                    {recommend.linkLabel || link.label}
                  </a>
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const IntroPage = ({
  workbookKey, stepLabel, title, subtitle,
  flow, flowTitle, prerequisites,
  onStart, helpModal, extraContent,
}) => (
  <div style={{ minHeight: '100vh', background: _INTRO_PAPER, padding: 24, fontFamily: _INTRO_FONT, color: _INTRO_INK }}>
    {helpModal}
    <div style={{ maxWidth: 1350, width: '100%', margin: '0 auto' }}>

      <div style={{ background: '#fff', borderRadius: RADIUS.lg, padding: 'clamp(16px, 4vw, 32px)', border: `1px solid ${_INTRO_MUTE}33`, marginBottom: 16 }}>
        <BrandHero />
        <div style={{ borderTop: `1px solid ${_INTRO_MUTE}33`, margin: '24px 0 32px' }} />
        <h1 style={{ fontSize: 28, fontWeight: 700, color: _INTRO_INK, textAlign: 'center', margin: 0, marginBottom: 4, lineHeight: 1.35 }}>{title}</h1>
        {subtitle && (
          <p style={{ fontSize: 15, color: _INTRO_MUTE, textAlign: 'center', marginTop: 0, marginBottom: 32, lineHeight: 1.6 }}>{subtitle}</p>
        )}

        <IntroFlowCard flow={flow} flowTitle={flowTitle} />
        <IntroPrerequisites items={prerequisites} />
        {extraContent}
        <IntroCopyright />
        <IntroCTA onClick={onStart} />
      </div>

    </div>
  </div>
);
// ════════════════════════════════════════════════════════════

const RelatedWorkbook = ({ id, hint }) => {
  const link = WORKBOOK_LINKS[id];
  if (!link) return null;
  return (
    <a href={link.url} target="_blank" rel="noopener noreferrer"
       style={{
         display: 'flex', alignItems: 'flex-start', gap: 8,
         padding: '10px 12px', background: COLORS.cream,
         border: `1px solid ${COLORS.navyMid}33`, borderRadius: RADIUS.md,
         textDecoration: 'none', color: COLORS.ink,
         transition: 'opacity 150ms ease',
       }}
       onMouseEnter={e => e.currentTarget.style.opacity = 0.85}
       onMouseLeave={e => e.currentTarget.style.opacity = 1}>
      <span style={{ fontSize: 16, color: COLORS.navyMid, marginTop: 1 }}></span>
      <span style={{ fontSize: 16, lineHeight: 1.6, flex: 1 }}>
        <strong style={{ color: COLORS.navyMid }}>{link.label}</strong>
        {hint && <span style={{ color: COLORS.ink }}> · {hint}</span>}
      </span>
    </a>
  );
};

const BrandOverride = () => (
  <style>{`
/* ══════════════════════════════════════════════════════════════
   CareerEngineer 브랜드 오버라이드 (워크북 페이지 전역 주입)
   ※ 과거의 Tailwind 색상 리맵 보정 시트는 인라인 토큰화 이후
     대응 className이 사라져 전부 죽은 규칙이 됨 → 제거.
     아래 3가지(전역 폰트·입력 포커스 링·인트로 CTA)만 실제로 동작하므로 유지.
   ══════════════════════════════════════════════════════════════ */

/* ── 폰트: Pretendard 우선 ── */
body, * {
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Apple SD Gothic Neo', '맑은 고딕', 'Malgun Gothic', sans-serif !important;
}

/* ── 입력 포커스 링 → 브랜드 골드(#C9A86A) ── */
input:focus, textarea:focus, select:focus {
  outline: none !important;
  border-color: #C9A86A !important;
  box-shadow: 0 0 0 3px rgba(201, 168, 106, 0.12) !important;
}

/* ── 인트로 '시작하기' CTA 버튼 ── */
button.ce-intro-cta { background-color: #0E2750 !important; color: #ffffff !important; }
button.ce-intro-cta:hover { background-color: #1B3A6B !important; }
`}
      </style>
);

// ══════════ 사용 안내 팝업 (PART 7-8) ══════════

// ══════════ 하단 고정 저작권 + 문의 (PART 7-8, 11) ══════════
// id 기반 자동 참고 워크북 추천 (career_description은 경력기술서)
function cdInferRelated(id) {
  if (!id) return [];
  if (/company|position|industry/i.test(id)) return ['job_analysis'];
  if (/story|experience|career|project|achievement|role|task/i.test(id)) return ['experience', 'resume'];
  if (/skill|cert|hard|soft/i.test(id)) return ['job_analysis', 'experience'];
  if (/strength|str\d/i.test(id)) return ['experience', 'jobcompetency'];
  if (/jd|kw|core|problem|highlight/i.test(id)) return ['job_analysis'];
  if (/growth|vision|future/i.test(id)) return ['careergoal', 'career_roadmap'];
  return ['experience', 'job_analysis'];
}

const In = ({id, label, placeholder, rows, ans, set}) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display: 'block', fontSize: 16, fontWeight: 600, color: COLORS.navyMid, marginBottom: 6 }}>{label}</label>
    <ReferenceInline ids={cdInferRelated(id)} />
    {rows ? <textarea value={ans[id]||''} onChange={e=>set(id,e.target.value)} rows={rows} placeholder={placeholder} className="resize-none" style={{ width: '100%', paddingLeft: 14, paddingRight: 14, paddingTop: 10, paddingBottom: 10, border: `1px solid ${COLORS.border}`, borderColor: `${COLORS.border}`, borderRadius: RADIUS.md, fontSize: 16, outline: 'none', background: COLORS.white }} />
      : <input type="text" value={ans[id]||''} onChange={e=>set(id,e.target.value)} placeholder={placeholder} style={{ width: '100%', paddingLeft: 14, paddingRight: 14, paddingTop: 10, paddingBottom: 10, border: `1px solid ${COLORS.border}`, borderColor: `${COLORS.border}`, borderRadius: RADIUS.md, fontSize: 16, outline: 'none', background: COLORS.white }} />}
  </div>
);
const GP = ({id, title, children, guides, tog}) => {
  // title에서 '가이드 보기: ' 접두사 자동 제거 (다른 워크북과 일관된 표시 위해)
  const cleanTitle = (title || '').replace(/^가이드 보기:\s*/, '').replace(/^가이드:\s*/, '');
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8, gap: 12 }}>
        <p style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink, margin: 0, lineHeight: 1.4, flex: 1 }}>{cleanTitle}</p>
        <ToggleLink open={!!guides[id]} onToggle={()=>tog(id)} label="가이드" style={{ flexShrink: 0 }} />
      </div>
      {guides[id] && <div style={{ background: COLORS.cream, border: `1px solid ${COLORS.border}`, borderLeft: `3px solid ${COLORS.accent2}`, borderRadius: RADIUS.md, padding: 16, fontSize: 16, color: COLORS.navyMid }}>
        <p style={{ fontSize: 16, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', color: COLORS.accent2, margin: 0, marginBottom: 12 }}>GUIDE · 작성 가이드</p>
        {children}
      </div>}
    </div>
  );
};
const Tip = ({children}) => (<div style={{ display: 'flex', gap: 12, background: COLORS.paper, borderLeftWidth: 4, borderLeftStyle: 'solid', borderColor: COLORS.accent2, borderTopRightRadius: 8, borderBottomRightRadius: 8, padding: 14, marginBottom: 16 }}><p style={{ fontSize: 16, color: COLORS.ink }}>{children}</p></div>);
const Warn = ({title, children}) => (<div style={{ background: COLORS.cream, border: `1px solid ${COLORS.ink}33`, color: COLORS.ink, padding: 16, borderRadius: RADIUS.md, marginBottom: 16 }}><div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}><div><p style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink }}>{title}</p><p style={{ fontSize: 16, color: COLORS.navyMid, marginTop: 4 }}>{children}</p></div></div></div>);
const Ex = ({children}) => {
  // 다른 워크북과 동일하게 "작성 예시 보기" 버튼 클릭 시 펼쳐지는 토글
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      <ToggleLink open={open} onToggle={() => setOpen((o) => !o)} label="작성 예시" />
      {open && (
        <div style={{ background: COLORS.paper, border: `1px solid ${COLORS.accent2}33`, color: COLORS.ink, padding: 16, borderRadius: RADIUS.md, marginTop: 6 }}>
          <p className="whitespace-pre-line" style={{ fontSize: 16, color: COLORS.ink, whiteSpace: 'pre-line', lineHeight: 1.7 }}>{children}</p>
        </div>
      )}
    </div>
  );
};
const Tbl = ({headers, rows}) => (<div style={{ overflowX: 'auto', marginBottom: 16 }}><table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 16 }}><thead><tr>{headers.map((h,i)=><th key={i} style={{ background: COLORS.navyMid, color: COLORS.white, paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, textAlign: 'left', fontWeight: 600, border: `1px solid ${COLORS.border}`, borderColor: COLORS.navyMid }}>{h}</th>)}</tr></thead><tbody>{rows.map((row,i)=><tr key={i} style={{ background: i%2===0 ? COLORS.white : COLORS.cream }}>{row.map((cell,j)=><td key={j} style={{ paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, border: `1px solid ${COLORS.border}`, borderColor: COLORS.border, color: COLORS.navyMid }}>{cell}</td>)}</tr>)}</tbody></table></div>);
const Chk = ({id, text, action, chk, togChk}) => {
  const checked = !!chk[id];
  return (
    <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 14, borderRadius: RADIUS.md, border: `1px solid ${checked ? COLORS.goldDeep : COLORS.border}`, background: checked ? COLORS.paper : COLORS.white, cursor: 'pointer', transition: 'all 150ms', marginBottom: 8 }}
      onMouseEnter={e => { if (!checked) e.currentTarget.style.borderColor = `${COLORS.border}`; }}
      onMouseLeave={e => { if (!checked) e.currentTarget.style.borderColor = COLORS.border; }}>
      <input type="checkbox" checked={checked} onChange={()=>togChk(id)} style={{ marginTop: 2, cursor: 'pointer', width: 16, height: 16, accentColor: COLORS.goldDeep, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 16, color: COLORS.ink, margin: 0, textDecoration: checked ? 'line-through' : 'none', opacity: checked ? 0.7 : 1 }}>{text}</p>
        {action && <p style={{ fontSize: 16, color: COLORS.sub, margin: '2px 0 0' }}>{action}</p>}
      </div>
    </label>
  );
};
// 성과 칸 실시간 점검 — 정량 수치/본인 기여 분리를 가볍게 안내 (저장·데이터 무영향)
const BriarHint = ({ value, kind }) => {
  const v = String(value || '').trim();
  if (!v) return null;
  const msgs = [];
  if (kind === 'number') {
    const hasNum = /\d+\s*(%|％|p\b|개|건|명|년|개월|달|주|일|회|배|원|만원|억|천|㎜|mm|℃|점|위|시간|분)/.test(v) || /\d+\s*[→~-]\s*\d+/.test(v) || /\d+\.\d/.test(v);
    if (!hasNum) msgs.push('성과에 숫자가 없습니다 — Before→After 수치를 1개 이상 넣어보세요. 예: "불량률 3.1%→0.8%", "납기 4개월→2.5개월".');
  }
  if (kind === 'contribution') {
    const teamish = /(우리\s*팀|팀이|팀에서|회사가|다\s*같이|함께\s|모두\s)/.test(v);
    const mine = /(제가|본인이|내가|주도|직접|혼자|단독|설계했|분석했|제안했|판단)/.test(v);
    if (teamish && !mine) msgs.push('"팀/회사"가 주어로 보입니다 — "내가 ~를 판단·실행해서 ~결과"로 본인 기여를 분리하세요.');
  }
  if (msgs.length === 0) return <p style={{ margin: '-8px 0 14px', fontSize: 14, color: COLORS.goldDeep }}>✓ 좋습니다</p>;
  return (
    <div style={{ margin: '-8px 0 14px', padding: 10, background: COLORS.yellowBg, borderLeft: `3px solid ${COLORS.yellow}`, borderRadius: RADIUS.md }}>
      {msgs.map((m, i) => <p key={i} style={{ margin: i ? '4px 0 0' : 0, fontSize: 14, color: COLORS.ink, lineHeight: 1.6 }}>{m}</p>)}
    </div>
  );
};
const ST = ({title, sub}) => (<div style={{ marginBottom: 20 }}><div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}><h2 style={{ fontSize: 18, fontWeight: 700, color: COLORS.ink }}>{title}</h2></div>{sub&&<p style={{ fontSize: 16, color: COLORS.sub }}>{sub}</p>}</div>);

const CareerDescWorkbook = () => {
  const [page, setPage] = useState('intro');
  // currentPart: 이 워크북 "내부" PART 인덱스 (대시보드 상위 STEP 0~5와 무관). PARTS[currentPart]로 현재 파트 렌더.
  // 위치 인덱스는 저장하지 않음 — 재방문 시 basicInfo 유무로 시작 위치(0 또는 1)만 결정.
  const [currentPart, setCurrentPart] = useState(() => { try { const __d = JSON.parse(localStorage.getItem('careerengineer_career_description_v1') || '{}'); return (__d.basicInfo && (__d.basicInfo.industry || __d.basicInfo.position || __d.basicInfo.company)) ? 1 : 0; } catch { return 0; } });
  const [ans, setAns] = useState({});
  const [chk, setChk] = useState({});
  const [guides, setGuides] = useState({});
  const [companyCount, setCompanyCount] = useState(2);  // PART 5: 회사 개수 (기본 2개, 최대 5)
  const [perfCounts, setPerfCounts] = useState({1: 2, 2: 1});  // 각 회사별 성과 개수 {회사번호: 성과수}
  const [downloaded, setDownloaded] = useState(false);
  const [showHelp, setShowHelp] = useState(true);
  // [CE-HOME] WorkbookShell '처음으로' 버튼에서 호출
  const __ceHomeRef = useRef(null);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.__CE_HOME = { fn: () => __ceHomeRef.current?.(), key: 'career_description' };
    return () => { if (window.__CE_HOME?.key === 'career_description') window.__CE_HOME = null; };
  }, []);
  const goHome = () => {
    setPage('intro');
    setCurrentPart(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  __ceHomeRef.current = goHome; // [CE-HOME] ref 갱신
  const [confirmingClear, setConfirmingClear] = useState(false);

  // 자동 저장 키 (워크북별 고유)
  const STORAGE_KEY = 'careerengineer_career_description_v1';

  // 페이지 로드 시 저장된 데이터 자동 복구 (1회만)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        // 데이터가 있고 유의미한 작성 내용이 있을 때만 복구 안내
        if (data.ans && Object.keys(data.ans).length > 0) {
          const savedDate = data.savedAt ? new Date(data.savedAt).toLocaleString('ko-KR') : '이전';
          if (true /* auto-restore */) {
            setAns(data.ans || {});
            setChk(data.chk || {});
            setGuides(data.guides || {});
            if (data.companyCount) setCompanyCount(data.companyCount);
            if (data.perfCounts) setPerfCounts(data.perfCounts);
            // page/currentPart 복원 — 작성 위치 보존
            if (data.page === 'intro' || data.page === 'steps') setPage(data.page);
            if (typeof data.currentPart === 'number' && data.currentPart >= 0 && data.currentPart <= 9) setCurrentPart(data.currentPart);
          } else {
            // 사용자가 거절하면 저장된 데이터 삭제
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      }
    } catch (e) {
      console.warn('자동 복구 실패:', e);
    }
  }, []);

  // ans/chk/companyCount/perfCounts 변경 시 자동 저장 (디바운스 1초)
  useEffect(() => {
    // 빈 상태에서는 저장 안 함
    if (Object.keys(ans).length === 0 && Object.keys(chk).length === 0) return;
    
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          ans, chk, guides, companyCount, perfCounts, page, currentPart,
          savedAt: new Date().toISOString()
        }));
      } catch (e) {
        console.warn('자동 저장 실패:', e);
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [ans, chk, guides, companyCount, perfCounts, page, currentPart]);

  // 저장된 데이터 초기화 (수동 버튼)

  const set = (k, v) => setAns(p => ({ ...p, [k]: v }));
  const tog = (k) => setGuides(p => ({ ...p, [k]: !p[k] }));
  const togChk = (k) => setChk(p => ({ ...p, [k]: !p[k] }));

  const PARTS = ['직무 분석', '스토리라인', '강점 하이라이트', '성과 선별', '성과 기술', '관리/리더십', '직무 전환', '역량 요약', '최종 점검', '완성'];
  const isChange = ans.type === 'change';
  const isJunior = ans.type === 'junior';
  // 주니어(3년 이하)는 관리/리더십(5), 직무전환(6) 건너뜀
  // 비전환자는 직무전환(6) 건너뜀
  const skipPart = (n) => {
    if (n === 5 && isJunior) return true;
    if (n === 6 && !isChange) return true;
    return false;
  };

  const activeParts = PARTS.filter((_, i) => !skipPart(i));
  // 진행률은 현재 단계가 아니라 실제 작성한 내용(채워진 답변 수) 기반.
  // basicInfo(회사/직무)는 자동 채움이라 제외하고, 의미있는 답변만 카운트.
  const SKIP_KEYS = new Set(['company', 'position']);
  const filledCount = Object.entries(ans)
    .filter(([k, v]) => !SKIP_KEYS.has(k) && v && String(v).trim().length > 1).length;
  const progress = Math.min(100, Math.round((filledCount / 18) * 100));

  const go = (n) => { setCurrentPart(n); window.scrollTo(0, 0); };
  const next = () => { let n = currentPart + 1; while (n < 10 && skipPart(n)) n++; go(Math.min(n, 9)); };
  const prev = () => { let n = currentPart - 1; while (n >= 0 && skipPart(n)) n--; go(Math.max(n, 0)); };

  // 채용담당자 제출용 경력기술서 — 실제 양식 그대로 (BRIAR 프레임 숨김)
  const buildHtml = () => {
    const today = new Date().toISOString().slice(0,10);
    const v = (k) => (ans[k] || '').toString();
    const has = () => true;
    const esc = (s) => (s || '').toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const br = (s) => esc(s).replace(/\n/g, '<br/>');
    
    const companyName = v('company');
    const positionName = v('position');
    const typeName = ({ junior: '경력 3년 이하', mid: '경력 3~7년', senior: '경력 7~12년', exec: '경력 12년 이상', change: '직무 전환' })[v('type')] || v('type');
    
    const hasLead = has('lead_team') || has('decision') || has('cross');
    const hasTrans = has('trans_why') || has('bridge');
    
    // 섹션 헤더 (한국식 비즈니스 문서)
    const sectionHeader = (title) => `
      <p style="font-size:14pt;font-weight:bold;color:#0E2750;margin:24pt 0 10pt 0;padding-bottom:6pt;border-bottom:2pt solid #0E2750;">${esc(title)}</p>`;
    
    // 회사 헤더 (회사명 | 기간)
    const subSectionHeader = (title, period) => `
      <p style="font-size:12pt;font-weight:bold;color:#0E2750;margin:18pt 0 6pt 0;padding-bottom:4pt;border-bottom:1pt solid #1B3A6B;">${esc(title)}${period ? ` <span style="font-weight:normal;color:#565F72;font-size:10pt;">| ${esc(period)}</span>` : ''}</p>`;
    
    // 기본 정보
    const basicInfoTable = `
      <table border="0" cellspacing="0" cellpadding="0" width="100%" style="margin-bottom:14pt;">
        ${has('company') ? `<tr><td width="100" style="padding:8pt 0;border-bottom:1pt solid #E5E1D6;color:#1B3A6B;font-weight:bold;font-size:11pt;vertical-align:top;">지원 회사</td><td style="padding:8pt 0;border-bottom:1pt solid #E5E1D6;font-size:11pt;color:#0E2750;vertical-align:top;">${esc(companyName)}</td></tr>` : ''}
        ${has('position') ? `<tr><td style="padding:8pt 0;border-bottom:1pt solid #E5E1D6;color:#1B3A6B;font-weight:bold;font-size:11pt;vertical-align:top;">지원 직무</td><td style="padding:8pt 0;border-bottom:1pt solid #E5E1D6;font-size:11pt;color:#0E2750;vertical-align:top;">${esc(positionName)}</td></tr>` : ''}
        ${has('type') ? `<tr><td style="padding:8pt 0;border-bottom:1pt solid #E5E1D6;color:#1B3A6B;font-weight:bold;font-size:11pt;vertical-align:top;">지원 유형</td><td style="padding:8pt 0;border-bottom:1pt solid #E5E1D6;font-size:11pt;color:#0E2750;vertical-align:top;">${esc(typeName)}</td></tr>` : ''}
        <tr><td style="padding:8pt 0;color:#1B3A6B;font-weight:bold;font-size:11pt;vertical-align:top;">작성일</td><td style="padding:8pt 0;font-size:11pt;color:#0E2750;vertical-align:top;">${today}</td></tr>
      </table>`;
    
    // 성과 항목 - BRIAR 프레임을 자연스러운 단락으로 변환
    // 표시: 성과 제목(굵게) → 상황(배경+역할) → 수행 업무(행동) → 성과(굵게, 강조) → 임팩트(파급)
    const renderPerformance = (c, p) => {
      const parts = [];
      
      // 1) 상황 = 배경 + 역할 (두 항목을 한 단락으로 연결)
      const bg = v(`c${c}_s${p}_bg`).trim();
      const role = v(`c${c}_s${p}_role`).trim();
      if (bg || role) {
        const text = [bg, role].filter(Boolean).join(' ');
        parts.push(`<p style="font-size:11pt;line-height:1.8;color:#0E2750;margin:0 0 8pt 0;"><strong style="color:#1B3A6B;">▪ 상황 및 역할</strong><br/>${br(text)}</p>`);
      }
      
      // 2) 수행 업무 = 행동
      const action = v(`c${c}_s${p}_action`).trim();
      if (action) {
        parts.push(`<p style="font-size:11pt;line-height:1.8;color:#0E2750;margin:0 0 8pt 0;"><strong style="color:#1B3A6B;">▪ 수행 업무</strong><br/>${br(action)}</p>`);
      }
      
      // 3) 핵심 성과 = 결과 (강조)
      const result = v(`c${c}_s${p}_result`).trim();
      if (result) {
        parts.push(`<table border="0" cellspacing="0" cellpadding="0" width="100%" style="margin:6pt 0 8pt 0;background:#F2F1EC;"><tr><td width="4" bgcolor="#1B3A6B" style="background:#1B3A6B;"></td><td style="padding:10pt 14pt;"><p style="font-size:10pt;color:#1B3A6B;font-weight:bold;margin:0 0 4pt 0;letter-spacing:0.5pt;">핵심 성과</p><p style="font-size:11pt;line-height:1.8;color:#0E2750;margin:0;font-weight:bold;">${br(result)}</p></td></tr></table>`);
      }
      
      // 4) 임팩트 = 파급
      const ripple = v(`c${c}_s${p}_ripple`).trim();
      if (ripple) {
        parts.push(`<p style="font-size:11pt;line-height:1.8;color:#0E2750;margin:0 0 8pt 0;"><strong style="color:#1B3A6B;">▪ 조직 임팩트</strong><br/>${br(ripple)}</p>`);
      }
      
      return parts.join('');
    };
    
    // 경력 사항 (회사별)
    const companyBlocks = Array.from({length: companyCount}, (_, i) => i + 1).filter(c => has(`c${c}_company`)).map(c => {
      const perfCount = perfCounts[c] || 1;
      
      // 성과별 (제목 + 상황/행동/성과/파급)
      const performances = Array.from({length: perfCount}, (_, i) => i + 1).filter(p => has(`c${c}_s${p}_title`)).map(p => `
        <div style="margin:12pt 0 18pt 0;">
          <p style="font-size:12pt;font-weight:bold;color:#0E2750;margin:0 0 8pt 0;padding-left:8pt;border-left:3pt solid #C9A86A;">${esc(v(`c${c}_s${p}_title`))}</p>
          <div style="padding-left:8pt;">${renderPerformance(c, p)}</div>
        </div>`).join('');
      
      // 회사 메타 (직책, 담당 범위)
      const companyMeta = [];
      if (has(`c${c}_title`)) companyMeta.push(`<tr><td width="100" style="padding:6pt 0;color:#1B3A6B;font-weight:bold;font-size:10pt;vertical-align:top;">직책</td><td style="padding:6pt 0;font-size:11pt;color:#0E2750;vertical-align:top;">${esc(v(`c${c}_title`))}</td></tr>`);
      if (has(`c${c}_scope`)) companyMeta.push(`<tr><td style="padding:6pt 0;color:#1B3A6B;font-weight:bold;font-size:10pt;vertical-align:top;">담당 업무</td><td style="padding:6pt 0;font-size:11pt;color:#0E2750;line-height:1.6;vertical-align:top;">${br(v(`c${c}_scope`))}</td></tr>`);
      
      return `${subSectionHeader(v(`c${c}_company`), v(`c${c}_period`))}
        ${companyMeta.length ? `<table border="0" cellspacing="0" cellpadding="0" width="100%" style="margin-bottom:10pt;">${companyMeta.join('')}</table>` : ''}
        ${performances ? `<p style="font-size:11pt;font-weight:bold;color:#1B3A6B;margin:14pt 0 4pt 0;">주요 성과</p>${performances}` : ''}`;
    }).join('');
    
    // 강점 3가지
    const strRows = [1,2,3].filter(n => has(`str${n}`)).map(n => 
      `<tr><td width="32" style="padding:8pt 0;border-bottom:1pt solid #E5E1D6;color:#1B3A6B;font-weight:bold;font-size:11pt;vertical-align:top;">${n}.</td><td style="padding:8pt 0;border-bottom:1pt solid #E5E1D6;font-size:11pt;color:#0E2750;line-height:1.7;vertical-align:top;">${br(v(`str${n}`))}</td></tr>`
    ).join('');
    
    // 관리/리더십
    let leadHtml = '';
    if (hasLead) {
      const items = [];
      if (has('lead_team')) items.push({t: '팀 관리', c: v('lead_team')});
      if (has('decision')) items.push({t: '의사결정', c: v('decision')});
      if (has('cross')) items.push({t: '크로스펑셔널 협업', c: v('cross')});
      leadHtml = `${sectionHeader('관리 · 리더십')}
        ${items.map(s => `<p style="font-weight:bold;color:#1B3A6B;font-size:11pt;margin:10pt 0 4pt 0;">▪ ${esc(s.t)}</p><p style="font-size:11pt;line-height:1.8;color:#0E2750;margin:0 0 8pt 12pt;">${br(s.c)}</p>`).join('')}`;
    }
    
    // 직무 전환
    let transHtml = '';
    if (hasTrans) {
      const items = [];
      if (has('trans_why')) items.push({t: '전환 이유', c: v('trans_why')});
      if (has('bridge')) items.push({t: '연결 역량', c: v('bridge')});
      transHtml = `${sectionHeader('직무 전환')}
        ${items.map(s => `<p style="font-weight:bold;color:#1B3A6B;font-size:11pt;margin:10pt 0 4pt 0;">▪ ${esc(s.t)}</p><p style="font-size:11pt;line-height:1.8;color:#0E2750;margin:0 0 8pt 12pt;">${br(s.c)}</p>`).join('')}`;
    }
    
    // 핵심 역량
    const skillRows = [];
    if (has('hard_skills')) skillRows.push(`<tr><td width="120" style="padding:8pt 0;border-bottom:1pt solid #E5E1D6;color:#1B3A6B;font-weight:bold;font-size:11pt;vertical-align:top;">하드 스킬</td><td style="padding:8pt 0;border-bottom:1pt solid #E5E1D6;font-size:11pt;color:#0E2750;line-height:1.7;vertical-align:top;">${br(v('hard_skills'))}</td></tr>`);
    if (has('soft_skills')) skillRows.push(`<tr><td style="padding:8pt 0;border-bottom:1pt solid #E5E1D6;color:#1B3A6B;font-weight:bold;font-size:11pt;vertical-align:top;">소프트 스킬</td><td style="padding:8pt 0;border-bottom:1pt solid #E5E1D6;font-size:11pt;color:#0E2750;line-height:1.7;vertical-align:top;">${br(v('soft_skills'))}</td></tr>`);
    if (has('certs')) skillRows.push(`<tr><td style="padding:8pt 0;color:#1B3A6B;font-weight:bold;font-size:11pt;vertical-align:top;">자격증·인증</td><td style="padding:8pt 0;font-size:11pt;color:#0E2750;line-height:1.7;vertical-align:top;">${br(v('certs'))}</td></tr>`);
    
    const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="ProgId" content="Word.Document">
<title>경력기술서</title>
<!--[if gte mso 9]>
<xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom><w:DoNotPromptForConvert/></w:WordDocument></xml>
<![endif]-->
<style>
@page Section1 { size: A4; margin: 2.5cm 2cm; mso-page-orientation: portrait; }
div.Section1 { page: Section1; }
body { font-family: '맑은 고딕', 'Malgun Gothic', sans-serif; font-size: 11pt; color: #0E2750; line-height: 1.7; }
p { margin: 0 0 8pt 0; }
table { border-collapse: collapse; }
</style>
</head>
<body lang="KO-KR">
<div class="Section1">

<p style="font-size:22pt;font-weight:bold;color:#0E2750;text-align:center;margin:0 0 24pt 0;padding-bottom:14pt;border-bottom:3pt solid #0E2750;letter-spacing:8pt;">경력기술서</p>

${basicInfoTable}

${has('story_one') ? `${sectionHeader('경력 한 문장')}
<p style="font-size:12pt;line-height:1.9;color:#0E2750;margin:6pt 0 14pt 0;padding:14pt 18pt;background:#F2F1EC;border-left:3pt solid #1B3A6B;">${br(v('story_one'))}</p>` : ''}

${has('summary') ? `${sectionHeader('경력 요약')}
<p style="font-size:11pt;line-height:1.9;color:#0E2750;margin:6pt 0 14pt 0;">${br(v('summary'))}</p>` : ''}

${(has('highlight_2line') || has('highlight_3keyword') || strRows) ? `${sectionHeader('강점 하이라이트')}
${has('highlight_2line') ? `<p style="font-size:12pt;line-height:1.9;color:#0E2750;margin:6pt 0 10pt 0;padding:12pt 16pt;background:#F2F1EC;border-left:3pt solid #1B3A6B;">${br(v('highlight_2line'))}</p>` : ''}
${has('highlight_3keyword') ? `<p style="font-size:11pt;color:#1B3A6B;margin:0 0 12pt 0;font-weight:bold;">▪ 핵심 키워드: ${esc(v('highlight_3keyword'))}</p>` : ''}
${strRows ? `<table border="0" cellspacing="0" cellpadding="0" width="100%" style="margin-top:6pt;">${strRows}</table>` : ''}` : ''}

${companyBlocks ? `${sectionHeader('경력 사항')}
${companyBlocks}` : ''}

${leadHtml}

${transHtml}

${skillRows.length ? `${sectionHeader('핵심 역량')}
<table border="0" cellspacing="0" cellpadding="0" width="100%">${skillRows.join('')}</table>` : ''}

${has('career_gap') ? `${sectionHeader('경력 공백 · 특이사항')}
<p style="font-size:11pt;color:#0E2750;line-height:1.8;margin:0;">${br(v('career_gap'))}</p>` : ''}

</div>
</body>
</html>`;
    
    return html;
  };

  // 다운로드 트리거 — buildHtml 결과를 doc 파일로 저장
  // docx 라이브러리 동적 로드 (CDN)
  const loadDocxLib = () => Promise.resolve(DOCX);
  
  // 진짜 .docx 파일 생성 — 워드/한글에서 100% 호환
  // [CE-DL] 외부 WorkbookShell 버튼에서 호출 위한 등록
  const __ceDlRef = useRef(null);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.__CE_DOWNLOAD = { fn: () => __ceDlRef.current?.(), key: 'career_description' };
    return () => { if (window.__CE_DOWNLOAD?.key === 'career_description') window.__CE_DOWNLOAD = null; };
  }, []);
  const dl = async () => {
    try {
      const docxLib = await loadDocxLib();
      const { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, ExternalHyperlink, Packer } = docxLib;
      
      const v = (k) => (ans[k] || '').toString();
      const today = new Date().toISOString().slice(0,10);
      
      // === 스타일 헬퍼 ===
      // 큰 제목
      const titleP = (t) => new Paragraph({
        children: [new TextRun({ text: t, bold: true, size: 44, font: '맑은 고딕', color: '0E2750', characterSpacing: 200 })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 240 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 24, color: '0E2750', space: 6 } }
      });
      // 회사·직무 부제
      const subtitleP = (t) => new Paragraph({
        children: [new TextRun({ text: t, bold: true, size: 24, font: '맑은 고딕', color: '1B3A6B' })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 400 }
      });
      // 섹션 헤더
      const sectionH = (t) => new Paragraph({
        children: [new TextRun({ text: t, bold: true, size: 28, font: '맑은 고딕', color: '0E2750' })],
        spacing: { before: 480, after: 200 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: '0E2750', space: 4 } }
      });
      // 회사명 헤더
      const companyH = (company, period) => new Paragraph({
        children: [
          new TextRun({ text: company, bold: true, size: 24, font: '맑은 고딕', color: '0E2750' }),
          ...(period ? [new TextRun({ text: '   ' + period, size: 20, font: '맑은 고딕', color: '6E7A8F' })] : [])
        ],
        spacing: { before: 360, after: 120 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: '1B3A6B', space: 4 } }
      });
      // 본문 단락
      const bodyP = (t, opts = {}) => new Paragraph({
        children: t.split('\n').flatMap((line, i) => i === 0 ? [new TextRun({ text: line, size: 22, font: '맑은 고딕', color: '0E2750', ...opts })] : [new TextRun({ break: 1, text: line, size: 22, font: '맑은 고딕', color: '0E2750', ...opts })]),
        spacing: { before: 100, after: 160, line: 360 },
        alignment: AlignmentType.JUSTIFIED
      });

      const linkP = (label, url, options = {}) => new Paragraph({
        children: [
          new TextRun({ text: options.prefix || '', size: 22, font: '맑은 고딕', color: '1B3A6B' }),
          new ExternalHyperlink({
            link: url,
            children: [new TextRun({ text: label, size: 22, font: '맑은 고딕', color: '0563C1', underline: { type: 'single', color: '0563C1' } })]
          })
        ],
        spacing: { before: options.before || 60, after: options.after || 60, line: 340 },
        indent: { left: options.indent || 240 }
      });
      // 강조 박스 (Aged Ivory 배경 + Navy 좌측 보더 효과는 indent로)
      const highlightP = (t) => new Paragraph({
        children: t.split('\n').flatMap((line, i) => i === 0 ? [new TextRun({ text: line, size: 22, font: '맑은 고딕', color: '0E2750' })] : [new TextRun({ break: 1, text: line, size: 22, font: '맑은 고딕', color: '0E2750' })]),
        spacing: { before: 100, after: 200, line: 360 },
        shading: { fill: 'F2F1EC' },
        border: { left: { style: BorderStyle.SINGLE, size: 24, color: '1B3A6B', space: 8 } },
        indent: { left: 240 }
      });
      // 성과 제목 (Navy 좌측 보더)
      const perfTitleP = (t) => new Paragraph({
        children: [new TextRun({ text: t, bold: true, size: 22, font: '맑은 고딕', color: '0E2750' })],
        spacing: { before: 280, after: 120, line: 320 },
        border: { left: { style: BorderStyle.SINGLE, size: 24, color: '1B3A6B', space: 8 } },
        indent: { left: 240 }
      });
      // 결과 라인 (▸ 화살표 + 굵게)
      const resultP = (t, bold = true) => new Paragraph({
        children: [
          new TextRun({ text: '▸ ', size: 22, font: '맑은 고딕', color: '1B3A6B', bold: true }),
          new TextRun({ text: t, size: 22, font: '맑은 고딕', color: '0E2750', bold })
        ],
        spacing: { before: 80, after: 80, line: 340 },
        indent: { left: 360 }
      });
      // 항목 라벨 (Gold 좌측 보더)
      const labelP = (t) => new Paragraph({
        children: [new TextRun({ text: t, bold: true, size: 22, font: '맑은 고딕', color: '1B3A6B' })],
        spacing: { before: 200, after: 80 },
        border: { left: { style: BorderStyle.SINGLE, size: 24, color: 'C9A86A', space: 8 } },
        indent: { left: 200 }
      });
      // 라벨 본문
      const labelBodyP = (t) => new Paragraph({
        children: t.split('\n').flatMap((line, i) => i === 0 ? [new TextRun({ text: line, size: 22, font: '맑은 고딕', color: '0E2750' })] : [new TextRun({ break: 1, text: line, size: 22, font: '맑은 고딕', color: '0E2750' })]),
        spacing: { before: 0, after: 160, line: 360 },
        indent: { left: 360 }
      });
      // 작성일 (우상단)
      const dateP = () => new Paragraph({
        children: [new TextRun({ text: '작성일 · ' + today, size: 20, font: '맑은 고딕', color: '6E7A8F' })],
        alignment: AlignmentType.RIGHT,
        spacing: { after: 80 }
      });
      // 메타 (지원회사/직무)
      const metaP = (label, value) => new Paragraph({
        children: [
          new TextRun({ text: label + '\t', bold: true, size: 22, font: '맑은 고딕', color: '1B3A6B' }),
          new TextRun({ text: value, size: 22, font: '맑은 고딕', color: '0E2750' })
        ],
        spacing: { before: 100, after: 100 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'E8E5DD', space: 4 } }
      });
      
      // === 문서 내용 조립 ===
      const children = buildCareerDescDocxChildren({ ans, companyCount, perfCounts }, docxLib);

      try { children.push(...buildWorkbookBackupParagraphs(docxLib, buildWorkbookPayload('career_description', '경력기술서', 'careerengineer_career_description_v1'))); } catch (e) { console.warn('[career_description] backup embed skipped:', e); }
      try { children.unshift(...buildCopyrightParagraphs(docxLib)); } catch (e) { console.warn('copyright skip', e); }
      const doc = new Document({
        creator: '',
        title: '경력기술서',
        sections: [{
          properties: {
            page: { margin: { top: 1400, right: 1133, bottom: 1400, left: 1133 } }
          },
          children: children
        }]
      });
      
      // 다운로드
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `경력기술서_${(ans.company || '미입력').replace(/[^a-zA-Z0-9가-힣\s]/g, '_')}_${today}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setDownloaded(true);
    } catch (err) {
      console.error('docx 생성 실패:', err);
      alert('.docx 파일 생성에 실패했습니다. 잠시 후 다시 시도해주세요.\n\n' + (err.message || ''));
    }
  };
  __ceDlRef.current = dl; // [CE-DL] ref 갱신
  
  // 새 탭에서 미리보기탭에서 미리보기 (브라우저 → 인쇄 → PDF로 저장 가능)
  // PDF 저장 (모든 환경 호환 — 모바일/PC/안드로이드/아이폰)
  const dlPreview = () => {
    const html = buildHtml();
    // 인쇄 후 자동 닫기 스크립트 추가
    const printableHtml = html.replace('</body>', `
<script>
window.addEventListener('load', function() {
  setTimeout(function() {
    try { window.print(); } catch { /* ignore */ }
  }, 800);
});
window.addEventListener('afterprint', function() {
  setTimeout(function() {
    try { window.close(); } catch { /* ignore */ }
  }, 500);
});
</script>
</body>`);
    
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(printableHtml);
      newWindow.document.close();
      newWindow.focus();
    } else {
      // 팝업 차단된 경우 — Blob URL로 새 탭에서 열기
      const blob = new Blob([printableHtml], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      window.location.href = url;
    }
    setDownloaded(true);
  };
  
  // HTML로 다운로드 (워드가 안 열릴 때 백업)
  const dlHtml = () => {
    const html = buildHtml();
    const today = new Date().toISOString().slice(0,10);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `경력기술서_${(ans.company || '미입력').replace(/[^a-zA-Z0-9가-힣\s]/g, '_')}_${today}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setDownloaded(true);
  };

  // INTRO
      if (page === 'intro') return (
    <IntroPage
      workbookKey='career_description'
      stepLabel='STEP 3 · 경력기술서 작성'
      title='경력기술서 작성'
      subtitle='경력 사실을 BRIAR 프레임으로 성과 중심으로 재구성합니다'
      flow={[
          { label: 'PART 1', desc: '기본 정보 및 지원 직무 분석' },
          { label: 'PART 2', desc: '나의 경력 스토리라인 정리' },
          { label: 'PART 3', desc: '강점 하이라이트 작성' },
          { label: 'PART 4', desc: '성과 선별 (직무 키워드와 매칭)' },
          { label: 'PART 5', desc: '성과 상세 기술 (BRIAR 프레임)' },
          { label: 'PART 6', desc: '관리/리더십 경험' },
          { label: 'PART 7', desc: '직무 전환자 경험 번역 (해당자만)' },
          { label: 'PART 8', desc: '핵심 역량 요약' },
          { label: 'PART 9', desc: '최종 점검 및 다운로드' },
        ]}
      flowTitle={'이 워크북의 작성 순서'}
      prerequisites={[
          {
            text: '지원할 회사의 채용공고 (직무상세내용)',
            recommend: {
              workbookId: 'job_analysis',
              condition: '분석이 막막하다면',
              linkLabel: '채용공고 및 직무분석 가이드',
            },
          },
          { text: '본인의 경력 정보 (회사·기간·담당 업무·성과)' },
          {
            text: '본인의 핵심 성과 사례 (각 회사·기간별로 가장 자랑스러운 일 1~2개)',
            recommend: {
              workbookId: 'experience',
              condition: '경험·성과 정리가 안 되어 있다면',
              linkLabel: '경험정리 가이드 워크북',
            },
          },
        ]}
      helpModal={<FirstVisitModal open={showHelp} onClose={() => setShowHelp(false)} title='경력기술서 워크북 사용 안내' steps={[
          '<strong>PART 1부터 순서대로</strong> 진행하면 경력기술서 초안이 완성됩니다.',
          '성과 상세 기술은 <strong>BRIAR 프레임</strong>(Background·Role·Issue·Action·Result)으로 작성합니다.',
          '본인 유형(직무 유지·직무 전환)에 따라 <strong>일부 PART는 자동 생략</strong>됩니다.',
          '마지막 PART에서 <strong>최종 다운로드</strong>하여 Word에서 자유롭게 편집하세요.',
        ]} />}
      onStart={() => { setPage('steps'); setCurrentPart(0); }}
    />
  );

  // STEP RENDERER
  const renderPart = () => { switch(currentPart) {

  // ===== PART 1: 직무 분석 =====
  case 0: return (<div>
    <ST title="PART 1. 기본 정보 및 지원 직무 분석" sub="지원 회사와 직무를 분석하고, 채용담당자의 관점을 파악합니다." />

    <Tip><span style={{ fontWeight: 700 }}>이력서와 함께 제출하세요.</span> 이력서엔 핵심 요약·대표 성과만 한 장으로, 프로젝트별 상세(BRIAR)는 이 경력기술서에 담습니다. 두 문서의 회사·기간·성과 수치는 반드시 일치시키세요. (이직 사유·공백 사연은 자소서·면접에서 다룹니다.)</Tip>

    <GP id="g_ch1" title="가이드 보기: 채용담당자는 경력기술서에서 무엇을 보는가" guides={guides} tog={tog}>
      <p style={{ fontWeight: 700, marginBottom: 8 }}>채용담당자가 경력기술서를 읽는 순서:</p>
      <Tbl headers={['#','읽는 부분','확인하는 것','불합격 신호']} rows={[
        ['1','경력 요약 + 강점 하이라이트','우리 팀에 필요한 역량이 있는가?','추상적 표현만 있고 구체적 성과 없음'],
        ['2','최근 회사 핵심 성과','실제로 어떤 문제를 해결했는가?','업무 나열만 있고 성과/맥락 없음'],
        ['3','경력 전체 흐름','일관된 성장 스토리가 있는가?','회사만 바꿨지 성장이 안 보임'],
        ['4','관리/리더십 (시니어)','팀을 맡길 수 있는가?','"8명 관리"만 있고 방법이 없음'],
        ['5','지원 직무 연결성','우리 팀 문제에 도움이 되는가?','경험이 우리 직무와 안 맞음'],
      ]} />
      <div style={{ background: COLORS.paper, borderRadius: RADIUS.md, padding: 12, marginTop: 8 }}>
        <p style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink }}>탈락하는 5가지 패턴:</p>
        <p style={{ fontSize: 16, color: COLORS.navyMid }}>1. 업무리스트 나열 ("담당했습니다"만 나열) 2. 숫자 없는 성과 3. 나의 역할 불명확 4. 기밀 노출 5. 성장 스토리 부재</p>
      </div>
    </GP>

    <In id="company" label="지원 회사명" placeholder="예: 삼성전자, 카카오, 현대자동차" ans={ans} set={set} />
    <In id="position" label="지원 직무" placeholder="예: 하드웨어 회로설계, 생산기술, 기구 설계" ans={ans} set={set} />

    <p style={{ fontSize: 16, fontWeight: 600, color: COLORS.navyMid, marginBottom: 8 }}>경력 유형</p>
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {[{val:'junior',label:'경력 3년 이하'},{val:'mid',label:'경력 3~7년'},{val:'senior',label:'경력 7~12년'},{val:'exec',label:'경력 12년 이상'},{val:'change',label:'직무 전환 (현재와 다른 직무로 이동)'}].map(o=>{
        const active = ans.type===o.val;
        const sepMatch = o.label.match(/^(.+?)\s*[—–-]\s*(.+)$/);
        const labelText = sepMatch ? sepMatch[1].trim() : o.label;
        const descText = sepMatch ? sepMatch[2].trim() : null;
        return (
          <div key={o.val} {...clickable(()=>set('type',o.val))}
            style={{ padding: '16px 18px', borderRadius: RADIUS.lg, marginBottom: 8, border: `1.5px solid ${active ? COLORS.accent2 : COLORS.border}`, background: active ? COLORS.cream : COLORS.white, cursor: 'pointer', transition: 'all 150ms' }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.borderColor = `${COLORS.accent2}60`; }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.borderColor = COLORS.border; }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: active ? COLORS.accent2 : COLORS.ink, marginBottom: descText ? 2 : 0 }}>{labelText}</div>
            {descText && <div style={{ fontSize: 16, color: COLORS.sub }}>{descText}</div>}
          </div>
        );
      })}
    </div>

    <In id="jd_kw" label="Q1-1. 직무상세내용에서 가장 많이 반복되는 키워드 3~5개는?" placeholder="이력서 워크북 PART 2 결과를 옮기세요" rows={2} ans={ans} set={set} />
    <In id="jd_core" label="Q1-2. 이 직무에서 채용담당자가 가장 중요하게 보는 역량 3가지는?" placeholder="직무상세내용 필수 요건, 우대 사항에서 추론" rows={2} ans={ans} set={set} />
    <In id="jd_problem" label="Q1-3. 이 회사가 현재 겪는 문제/과제는? 나는 어떻게 도움이 될 수 있는가?" placeholder="회사 공식 자료(뉴스·IR 보고서·홈페이지)에서 추론" rows={3} ans={ans} set={set} />
  </div>);

  // ===== PART 2: 스토리라인 =====
  case 1: return (<div>
    <ST title="PART 2. 나의 경력 스토리라인 정리" sub="개별 성과를 쓰기 전에, 전체 경력의 큰 그림을 먼저 잡습니다." />

    <GP id="g_storyline" title="가이드 보기: 경력 스토리라인이란?" guides={guides} tog={tog}>
      <p>경력기술서는 회사별 성과를 따로 나열하는 것이 아니라, 전체 경력을 관통하는 성장 스토리가 보여야 합니다.</p>
      <Tbl headers={['유형','예시']} rows={[
        ['전문성 심화형','"회로 설계 실무자 → 전력 회로 전문가 → 하드웨어 개발 리더"'],
        ['역할 확장형','"실무 담당 → 프로젝트 리드 → 팀 관리 → 개발본부 전략"'],
        ['산업 전환형','"가전 기구설계 → 자동차 부품 설계 → 모빌리티 HW" (핵심 역량은 유지)'],
        ['문제 해결형','"어디를 가든 비슷한 유형의 문제를 해결해온 스토리"'],
      ]} />
      <p style={{ fontSize: 16, color: COLORS.ink, marginTop: 8 }}>스토리라인은 경력기술서에 명시적으로 쓰는 것이 아니라, 성과의 선택과 배치를 통해 자연스럽게 드러나야 합니다.</p>
    </GP>

    <In id="story_one" label='Q2-1. 첫 직장에서 현재까지, 나의 경력을 한 문장으로 요약하면?' placeholder='"OO 분야에서 OO 역할로 시작하여, OO를 거쳐, 현재 OO 수준의 역량을 갖추게 되었다"' rows={3} ans={ans} set={set} />
    <Ex>{`회로 설계 실무자로 시작하여 전력 회로 최적화 전문성을 쌓고, 현재는 3인 팀을 리드하며 하드웨어 개발 전략을 수립하는 수준으로 성장했다.\n\n자동차 부품 양산 엔지니어로 시작하여 협력사 공정감사와 IATF 인증 경험을 쌓고, 현재는 8명 팀을 관리하며 생산 시스템을 처음부터 구축할 수 있는 수준으로 성장했다.`}</Ex>

    <div style={{ marginBottom: 24 }}>
      <label style={{ display: 'block', fontSize: 16, fontWeight: 700, color: COLORS.ink, marginBottom: 8 }}>Q2-2. 나의 경력 스토리라인 유형은?</label>
      <p style={{ fontSize: 16, color: COLORS.sub, marginBottom: 12 }}>가이드의 4가지 유형 중 내 경력에 가장 가까운 것을 선택하세요.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: 8, marginBottom: 12 }}>
        {[
          { v: '전문성 심화형', d: '같은 직무 안에서 깊이를 더해온 스토리' },
          { v: '역할 확장형', d: '실무 → 리드 → 관리로 역할 범위가 넓어진 스토리' },
          { v: '산업 전환형', d: '산업을 옮겼지만 핵심 역량이 유지된 스토리' },
          { v: '문제 해결형', d: '어디를 가든 비슷한 유형의 문제를 해결해온 스토리' },
        ].map(opt => {
          const selected = ans.story_type === opt.v;
          return (
            <button
              key={opt.v}
              type="button"
              onClick={() => set('story_type', opt.v)}
              style={{
                display: 'block', width: '100%', textAlign: 'left', padding: 14,
                borderRadius: RADIUS.md, cursor: 'pointer', transition: 'all 150ms',
                fontFamily: 'inherit',
                border: `1px solid ${selected ? COLORS.goldDeep : COLORS.border}`,
                background: selected ? COLORS.paper : COLORS.white,
              }}
            >
              <p style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink, margin: 0 }}>{opt.v}</p>
              <p style={{ fontSize: 16, color: COLORS.sub, marginTop: 4, lineHeight: 1.625 }}>{opt.d}</p>
            </button>
          );
        })}
      </div>
      <label style={{ display: 'block', fontSize: 16, fontWeight: 600, color: COLORS.navyMid, marginBottom: 4 }}>선택한 이유 (내 경력의 어떤 점이 이 유형에 해당하는지)</label>
      <textarea
        value={ans.story_type_reason || ''}
        onChange={e => set('story_type_reason', e.target.value)}
        rows={2}
        style={{ width: '100%', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, border: `1px solid ${COLORS.border}`, borderColor: `${COLORS.border}`, borderRadius: RADIUS.md, fontSize: 16, outline: 'none' }}
        placeholder="예: 같은 회로설계 직무 안에서 실무 → 전력 회로 전문가 → 팀 리드로 깊이가 쌓여왔기 때문"
      />
    </div>
    <In id="story_growth" label='Q2-3. 회사를 옮길 때마다 "이것을 얻었다/이것이 달라졌다"고 말할 수 있는 것은?' placeholder="이직마다 성장한 포인트. 회사만 바꿨는데 역할이 같으면 성장 스토리가 없는 것입니다." rows={3} ans={ans} set={set} />
    <Ex>{`1번째 이직 (A사→B사): 실무 역량을 쌓은 후, 더 큰 규모의 양산 프로젝트 기회를 찾아 이동 → 월 생산 3배 규모 라인 개발 경험\n2번째 이직 (B사→C사): 실행뿐 아니라 설계 주도와 팀 리딩 역할로 확장 → 3인 파트 리드 시작`}</Ex>
  </div>);

  // ===== PART 3: 강점 하이라이트 =====
  case 2: return (<div>
    <ST title="PART 3. 강점 하이라이트 작성" sub="채용담당자가 30초 안에 '이 사람을 왜 뽑아야 하는지' 파악할 수 있어야 합니다." />

    {(ans.jd_kw || ans.jd_core || ans.jd_problem) && (
      <div style={{ background: COLORS.cream, border: `1px solid ${COLORS.navyMid}33`, borderLeft: `3px solid ${COLORS.navyMid}`, padding: 16, borderRadius: RADIUS.md, marginBottom: 16 }}>
        <p style={{ fontSize: 16, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', color: COLORS.navyMid, marginBottom: 12 }}>
          INFO · 참고: PART 1 직무 분석 결과
        </p>
        {ans.jd_kw && (
          <div style={{ background: COLORS.paper, padding: 12, borderRadius: RADIUS.soft, marginBottom: 6, fontSize: 16 }}>
            <p style={{ fontWeight: 700, color: COLORS.ink, margin: 0, marginBottom: 4 }}>반복 키워드</p>
            <p style={{ color: COLORS.sub, margin: 0, fontStyle: 'italic', lineHeight: 1.6 }}>
              {ans.jd_kw.length > 200 ? ans.jd_kw.substring(0,200) + '...' : ans.jd_kw}
            </p>
          </div>
        )}
        {ans.jd_core && (
          <div style={{ background: COLORS.paper, padding: 12, borderRadius: RADIUS.soft, marginBottom: 6, fontSize: 16 }}>
            <p style={{ fontWeight: 700, color: COLORS.ink, margin: 0, marginBottom: 4 }}>채용담당자 중시 역량</p>
            <p style={{ color: COLORS.sub, margin: 0, fontStyle: 'italic', lineHeight: 1.6 }}>
              {ans.jd_core.length > 200 ? ans.jd_core.substring(0,200) + '...' : ans.jd_core}
            </p>
          </div>
        )}
        {ans.jd_problem && (
          <div style={{ background: COLORS.paper, padding: 12, borderRadius: RADIUS.soft, fontSize: 16 }}>
            <p style={{ fontWeight: 700, color: COLORS.ink, margin: 0, marginBottom: 4 }}>회사 문제/과제</p>
            <p style={{ color: COLORS.sub, margin: 0, fontStyle: 'italic', lineHeight: 1.6 }}>
              {ans.jd_problem.length > 200 ? ans.jd_problem.substring(0,200) + '...' : ans.jd_problem}
            </p>
          </div>
        )}
      </div>
    )}

    <Warn title="이런 표현은 강점이 아닙니다">
      "커뮤니케이션 능력이 뛰어남", "책임감 있는 인재", "빠른 학습 능력" → 모두 증거가 없는 자기 평가입니다. 강점에는 반드시 근거(경험/성과)가 함께 있어야 합니다.
    </Warn>

    <In id="str1" label="Q3-1. 강점 1: 지원 직무에서 확실히 잘할 수 있는 것 + 근거" placeholder="[강점 한 줄] - [근거가 되는 경험/성과 한 줄]" rows={2} ans={ans} set={set} />
    <In id="str2" label="Q3-2. 강점 2" placeholder="[강점 한 줄] - [근거가 되는 경험/성과 한 줄]" rows={2} ans={ans} set={set} />
    <In id="str3" label="Q3-3. 강점 3" placeholder="[강점 한 줄] - [근거가 되는 경험/성과 한 줄]" rows={2} ans={ans} set={set} />
    <Ex>{`강점 1: 데이터 기반 전력 회로 설계 - 회로 시뮬레이션과 발열 분석으로 변환 효율 5%p 향상, DOE 검증 프로세스 표준화\n강점 2: 신뢰성 시험 자동화 - 측정 장비 + 데이터 로깅 기반 내구 시험 체계 구축, 시험 리포팅 시간 70% 절감\n강점 3: 하드웨어 팀 리딩 - 3인 파트 리드, 팀 교육 체계 구축, 신입 온보딩 2주→1주 단축`}</Ex>

    <In id="summary" label="Q3-4. 경력 요약 초안 (3~5줄)" placeholder="[직무명] [총 연수]. [핵심 도구/역량], [대표 성과 수치]. [관리 경험 규모]." rows={4} ans={ans} set={set} />

    <GP id="g_summary" title="가이드 보기: 경력 요약 작성 공식" guides={guides} tog={tog}>
      <p style={{ fontWeight: 700 }}>[직무명] [총 경력 연수]. [핵심 역량/도구 3~4개], [대표 성과 2~3개 (수치 포함)]. [관리 경험이 있다면 규모 포함].</p>
      <Ex>{`전자(하드웨어) 전력 회로 설계 5년. DC-DC 컨버터/전원 모듈 설계(양산 5개 모델+), 변환 효율 최적화(효율 5%p 향상), 회로 시뮬레이션/PCB 설계 기반 검증. 3인 팀 리드, 신뢰성 시험 체계 구축으로 검증 자동화.`}</Ex>
    </GP>
  </div>);

  // ===== PART 4: 성과 선별 =====
  case 3: return (<div>
    <ST title="PART 4. 성과 선별" sub="어떤 경험을 경력기술서에 넣을 것인가? 5가지 기준으로 평가합니다." />

    {(ans.jd_kw || ans.jd_core || ans.story_one || ans.story_growth) && (
      <div style={{ background: COLORS.cream, border: `1px solid ${COLORS.navyMid}33`, borderLeft: `3px solid ${COLORS.navyMid}`, padding: 16, borderRadius: RADIUS.md, marginBottom: 16 }}>
        <p style={{ fontSize: 16, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', color: COLORS.navyMid, marginBottom: 12 }}>
          INFO · 참고: PART 1 키워드 + PART 2 스토리라인
        </p>
        {(ans.jd_kw || ans.jd_core) && (
          <div style={{ background: COLORS.paper, padding: 12, borderRadius: RADIUS.soft, marginBottom: 6, fontSize: 16 }}>
            <p style={{ fontWeight: 700, color: COLORS.ink, margin: 0, marginBottom: 4 }}>직무 핵심 키워드 (PART 1)</p>
            <p style={{ color: COLORS.sub, margin: 0, fontStyle: 'italic', lineHeight: 1.6 }}>
              {(ans.jd_kw || ans.jd_core || '').length > 200 ? (ans.jd_kw || ans.jd_core).substring(0,200) + '...' : (ans.jd_kw || ans.jd_core)}
            </p>
          </div>
        )}
        {ans.story_one && (
          <div style={{ background: COLORS.paper, padding: 12, borderRadius: RADIUS.soft, marginBottom: 6, fontSize: 16 }}>
            <p style={{ fontWeight: 700, color: COLORS.ink, margin: 0, marginBottom: 4 }}>한 줄 경력 요약 (PART 2)</p>
            <p style={{ color: COLORS.sub, margin: 0, fontStyle: 'italic', lineHeight: 1.6 }}>
              {ans.story_one.length > 200 ? ans.story_one.substring(0,200) + '...' : ans.story_one}
            </p>
          </div>
        )}
        {ans.story_growth && (
          <div style={{ background: COLORS.paper, padding: 12, borderRadius: RADIUS.soft, fontSize: 16 }}>
            <p style={{ fontWeight: 700, color: COLORS.ink, margin: 0, marginBottom: 4 }}>성장 스토리 (PART 2)</p>
            <p style={{ color: COLORS.sub, margin: 0, fontStyle: 'italic', lineHeight: 1.6 }}>
              {ans.story_growth.length > 200 ? ans.story_growth.substring(0,200) + '...' : ans.story_growth}
            </p>
          </div>
        )}
      </div>
    )}

    <GP id="g_criteria" title="가이드 보기: 성과 선별 기준 5가지" guides={guides} tog={tog}>
      <Tbl headers={['#','선별 기준','자가 진단 질문']} rows={[
        ['1','직무상세내용 키워드와 직접 연결되는가?','이 경험에 사용한 도구/역량이 직무상세내용에 나오는가?'],
        ['2','정량적 성과를 말할 수 있는가?','결과를 숫자로 표현할 수 있는가?'],
        ['3','나의 주도적 역할이 명확한가?','"당신이 없었으면 이 결과가 안 나왔을 것"이라고 말할 수 있는가?'],
        ['4','면접에서 5분 이상 설명할 수 있는가?','배경, 판단, 시행착오, 결과를 구체적으로 말할 수 있는가?'],
        ['5','조직에 파급효과가 있었는가?','이 성과 이후 팀/프로세스/매출에 지속 변화가 생겼는가?'],
      ]} />
      <p style={{ fontSize: 16, color: COLORS.ink, fontWeight: 700, marginTop: 8 }}>3개 이상 "예"인 경험만 경력기술서에 넣으세요.</p>
    </GP>

    <GP id="g_perspective" title="가이드 보기: 같은 경험도 지원 직무에 따라 다르게 쓴다" guides={guides} tog={tog}>
      <Tbl headers={['같은 경험','개발팀 팀장에 지원','회로 설계 기획에 지원']} rows={[
        ['변환 효율 5%p 향상','강조: 3인 팀을 이끌고 설계 프로세스 표준화한 리더십','강조: 회로 시뮬레이션으로 손실 원인 발견한 분석력'],
        ['불량률 40% 개선','생산기술 팀장: 협력사 50개사 감사 체계 구축한 관리 역량','공정 엔지니어: SPC/FMEA로 공정 파라미터 최적화한 기술 역량'],
      ]} />
      <div style={{ background: COLORS.cream, borderRadius: RADIUS.md, padding: 12, marginTop: 8 }}>
        <p style={{ color: COLORS.ink, fontSize: 16, fontWeight: 700 }}>관점 전환 질문:</p>
        <p style={{ fontSize: 16, color: COLORS.ink }}>1. 직무상세내용에서 가장 반복되는 키워드 3개는? 2. 내 경험과 연결되는 접점은? 3. 채용담당자가 "우리 팀에서도 해줄 수 있겠다"고 느낄 수 있는가?</p>
      </div>
    </GP>

    <In id="exp_list" label="Q4-1. 가장 최근 회사에서 수행한 주요 업무/프로젝트를 모두 나열하세요 (5~10개)" placeholder='"내가 주도적으로 한 것" 중심으로. 사소한 것도 일단 다 적으세요.' rows={6} ans={ans} set={set} />

    <Tip>위에서 나열한 각 경험을 5가지 기준(직무상세내용 연결, 정량 성과, 주도 역할, 면접 설명, 조직 파급)으로 평가하세요. O가 3개 이상인 것만 아래에 적으세요.</Tip>

    <In id="exp_selected" label="Q4-2. 선별 결과: 경력기술서에 넣을 성과 목록 (O가 3개 이상인 것만)" placeholder="최근 회사 3~5개, 이전 회사 2~3개, 초기 회사 1~2개가 적절합니다." rows={4} ans={ans} set={set} />
  </div>);

  // ===== PART 5: 성과 상세 기술 =====
  case 4: return (<div>
    <ST title="PART 5. 성과 상세 기술 (BRIAR 질문에 답하며 작성)" sub="PART 4에서 선별한 성과를 하나씩 질문에 답하며 작성합니다." />

    {ans.exp_selected && (
      <div style={{ background: COLORS.cream, border: `1px solid ${COLORS.navyMid}33`, borderLeft: `3px solid ${COLORS.navyMid}`, padding: 16, borderRadius: RADIUS.md, marginBottom: 16 }}>
        <p style={{ fontSize: 16, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', color: COLORS.navyMid, marginBottom: 12 }}>
          INFO · 참고: PART 4 선별한 성과
        </p>
        <div style={{ background: COLORS.paper, padding: 12, borderRadius: RADIUS.soft, fontSize: 16 }}>
          <p style={{ fontWeight: 700, color: COLORS.ink, margin: 0, marginBottom: 4 }}>경력기술서에 넣을 성과 목록</p>
          <p style={{ color: COLORS.sub, margin: 0, fontStyle: 'italic', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
            {ans.exp_selected.length > 400 ? ans.exp_selected.substring(0,400) + '...' : ans.exp_selected}
          </p>
        </div>
      </div>
    )}

    <GP id="g_briar" title="가이드 보기: BRIAR 성과 기술 공식" guides={guides} tog={tog}>
      <p style={{ fontWeight: 700 }}>B (Background): 어떤 상황/문제가 있었는가</p>
      <p style={{ fontWeight: 700 }}>R (Role): 나의 역할/권한/범위는 무엇이었는가</p>
      <p style={{ fontWeight: 700 }}>I (Initiative): 내가 주도적으로 한 행동/판단은 무엇인가</p>
      <p style={{ fontWeight: 700 }}>A (Achievement): 정량적 성과는 무엇인가</p>
      <p style={{ fontWeight: 700 }}>R (Ripple): 조직에 미친 파급효과는 무엇인가</p>
      <p style={{ fontSize: 16, color: COLORS.ink, marginTop: 8 }}>STAR 기법과 유사하지만, 경력기술서에는 "나의 역할 범위"와 "조직 파급효과"가 추가로 필요합니다.</p>
    </GP>

    <Ex>{`[이직 지원자 작성 예시 — 7년차 기구설계, 전동화 부품사로 이직]
[B] Background: 신규 전동화 부품(구동모터 하우징) 양산 초기, 사출 공차 누적으로 조립 간섭이 생겨 양산 불량률이 3.1%에 달했고 라인 정지가 잦았다.
[R] Role: 기구설계 책임으로 하우징을 단독 설계 담당(8명 팀 중), 협력사 금형 수정 의사결정 권한 보유.
[I] Initiative: 내가 GD&T로 데이텀을 재정의하고 공차 누적을 직접 재계산해 간섭 구간을 특정했다. 금형 업체와 공정능력(±0.1mm)을 확인해 현실적 공차로 재설계하고 시작품 3차 검증을 주도했다.
[A] Achievement: 양산 불량률 3.1%→0.8%(74% 감소), 라인 정지 월 6회→1회, 개발 6개월 내 양산 이관.
[R] Ripple: 이 공차 재정의 방식이 팀 설계 가이드로 표준화되어 후속 2개 모델에 확산, 동종 불량 재발 0건.`}</Ex>

    <Tip>회사별로 입력하세요. 가장 최근 회사부터 시작합니다. 회사가 더 있으면 아래 \"+ 회사 추가하기\" 버튼으로 추가하세요. 각 회사당 핵심 성과는 1~3개 정도가 적절합니다 (최근 회사일수록 많이, 오래된 회사일수록 적게).</Tip>

    {Array.from({length: companyCount}, (_, i) => i + 1).map(c => {
      const perfCount = perfCounts[c] || 1;
      const setPerfCount = (newCount) => setPerfCounts(prev => ({...prev, [c]: newCount}));
      return (
        <div key={c} style={{ background: COLORS.cream, borderRadius: RADIUS.lg, padding: 20, marginBottom: 20, border: `1px solid ${COLORS.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink, margin: 0 }}>회사 {c} {c === 1 ? '(가장 최근 / 현재 재직 중)' : `(${c === 2 ? '두' : c === 3 ? '세' : c === 4 ? '네' : '다섯'} 번째 회사)`}</p>
            {companyCount > 1 && c === companyCount && (
              <button onClick={() => {
                // 이 회사의 모든 답변 비우기
                ['company', 'period', 'title', 'scope'].forEach(k => set(`c${c}_${k}`, ''));
                for (let s = 1; s <= 3; s++) {
                  ['title', 'bg', 'role', 'action', 'result', 'ripple'].forEach(k => set(`c${c}_s${s}_${k}`, ''));
                }
                setCompanyCount(prev => prev - 1);
                setPerfCounts(prev => { const next = {...prev}; delete next[c]; return next; });
              }} style={{ background: 'transparent', border: `1px solid ${COLORS.border}`, color: COLORS.sub, padding: '4px 12px', borderRadius: RADIUS.md, fontSize: 16, cursor: 'pointer' }}>
                이 회사 삭제
              </button>
            )}
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            <In id={`c${c}_company`} label="회사명" placeholder={c === 1 ? "예: ABC테크" : "이전 회사명"} ans={ans} set={set} />
            <In id={`c${c}_period`} label="재직 기간" placeholder={c === 1 ? "예: 2021.03~현재" : "예: 2018.01~2021.02"} ans={ans} set={set} />
          </div>
          <In id={`c${c}_title`} label="직책/직급" placeholder={c === 1 ? "예: 하드웨어개발팀 책임연구원" : ""} ans={ans} set={set} />
          <In id={`c${c}_scope`} label="팀 규모 / 담당 범위" placeholder={c === 1 ? "예: 하드웨어개발팀 8명 중 전원회로 파트 3명 리드, 양산 모델 5종 담당" : "이 회사에서의 담당 범위"} ans={ans} set={set} />

          <div style={{ borderTop: `1px solid ${COLORS.border}`, marginTop: 12, paddingTop: 12 }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: COLORS.navyMid, marginTop: 0, marginBottom: 12, letterSpacing: 0.3 }}>이 회사에서의 핵심 성과 (BRIAR)</p>
            
            {Array.from({length: perfCount}, (_, i) => i + 1).map(p => (
              <div key={p} style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.md, padding: 14, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: COLORS.ink, margin: 0 }}>[핵심 성과 {p}]</p>
                  {perfCount > 1 && p === perfCount && (
                    <button onClick={() => {
                      ['title', 'bg', 'role', 'action', 'result', 'ripple'].forEach(k => set(`c${c}_s${p}_${k}`, ''));
                      setPerfCount(perfCount - 1);
                    }} style={{ background: 'transparent', border: `1px solid ${COLORS.border}`, color: COLORS.sub, padding: '2px 10px', borderRadius: RADIUS.md, fontSize: 13, cursor: 'pointer' }}>
                      성과 삭제
                    </button>
                  )}
                </div>
                <In id={`c${c}_s${p}_title`} label={`성과 제목 (한 줄)`} placeholder='예: "DC-DC 컨버터 효율 개선 프로젝트", "신뢰성 시험 체계 구축"' ans={ans} set={set} />
                <In id={`c${c}_s${p}_bg`} label={`[B] Background — 이 성과가 나오기 전, 팀/조직이 겪던 문제는?`} placeholder='"발열이 심했다"가 아니라 "동작 온도 85℃로 목표 대비 15℃ 초과". 왜 중요했는가?(신뢰성, 수율 영향 등)' rows={3} ans={ans} set={set} />
                <In id={`c${c}_s${p}_role`} label={`[R] Role — 이 문제 해결을 위해 당신에게 주어진 역할은?`} placeholder="혼자? 팀 리드? 의사결정 권한 범위? 예산/인력?" rows={2} ans={ans} set={set} />
                <In id={`c${c}_s${p}_action`} label={`[I] Initiative — 당신이 주도적으로 한 행동/판단은?`} placeholder='"당신이 없었으면 이 결과가 안 나왔을 것"을 보여주세요. 어떤 분석/판단/방법을 선택했는가?' rows={3} ans={ans} set={set} />
                <BriarHint value={ans[`c${c}_s${p}_action`]} kind="contribution" />
                <In id={`c${c}_s${p}_result`} label={`[A] Achievement — 정량적 성과는?`} placeholder='Before→After 형태. 예: "변환 효율 87%→92% (5%p 향상, 6개월)"' rows={2} ans={ans} set={set} />
                <BriarHint value={ans[`c${c}_s${p}_result`]} kind="number" />
                <In id={`c${c}_s${p}_ripple`} label={`[R] Ripple — 이 성과 이후 조직에 어떤 변화가 생겼는가?`} placeholder="설계 가이드 표준화, 타 모델 확산, 양산 수율 지속 개선 등. 없으면 비워두세요." rows={2} ans={ans} set={set} />
              </div>
            ))}
            
            {perfCount < 3 && (
              <button onClick={() => setPerfCount(perfCount + 1)}
                style={{ width: '100%', padding: 10, background: 'transparent', border: `1px dashed ${COLORS.border}`, color: COLORS.navyMid, borderRadius: RADIUS.md, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>
                + 이 회사의 성과 추가 (현재 {perfCount}개, 최대 3개)
              </button>
            )}
          </div>
        </div>
      );
    })}

    {companyCount < 5 && (
      <button onClick={() => {
        const newCompanyNum = companyCount + 1;
        setCompanyCount(newCompanyNum);
        setPerfCounts(prev => ({...prev, [newCompanyNum]: 1}));
      }}
        style={{ width: '100%', padding: 14, background: 'transparent', border: `1px dashed ${COLORS.border}`, color: COLORS.navyMid, borderRadius: RADIUS.md, fontSize: 16, fontWeight: 600, cursor: 'pointer', marginBottom: 16 }}>
        + 회사 추가하기 (현재 {companyCount}개, 최대 5개)
      </button>
    )}
  </div>);

  // ===== PART 6: 관리/리더십 =====
  case 5: return (<div>
    <ST title="PART 6. 관리/리더십 경험" sub="팀 리더, 매니저 이상의 경험이 있는 경우 작성합니다." />
    <In id="lead_team" label="Q6-1. 직접 관리한 팀의 규모와 구성은?" placeholder="정규직 몇 명, 파트타임/외주 몇 명, 크로스펑셔널 협업 팀원 몇 명" rows={2} ans={ans} set={set} />
    <In id="lead_budget" label="Q6-2. 운영한 예산 규모는? (연간/월간)" placeholder="개발 예산, 설비/시작품 예산, 인건비 등" ans={ans} set={set} />
    <In id="lead_growth" label="Q6-3. 팀원의 성장에 어떻게 기여했는가?" placeholder="교육 프로그램 설계, 1:1 코칭, 목표 설정, 팀원 승진 사례 등" rows={3} ans={ans} set={set} />
    <In id="lead_measure" label="Q6-4. 팀의 성과를 어떻게 측정하고 관리했는가?" placeholder="KPI 설정, 성과 리뷰 주기, 목표 달성률 관리 방법" rows={2} ans={ans} set={set} />
    <In id="lead_challenge" label="Q6-5. 리더로서 가장 어려웠던 상황과 어떻게 해결했는가?" placeholder="갈등 해결, 성과 부진 팀원, 급격한 조직 변화 대응 등" rows={3} ans={ans} set={set} />
  </div>);

  // ===== PART 7: 직무 전환 =====
  case 6: return (<div>
    <ST title="PART 7. 직무 전환자 경험 번역" sub="현재 직무와 다른 직무로 이동하는 경우 작성합니다." />
    <In id="trans_translate" label='Q7-1. 현재 직무 핵심 업무 3가지를 지원 직무 언어로 "번역"하세요' placeholder={"[현재 경험] → [지원 직무에서의 의미]\n예: 환자 활력징후 모니터링 → 임상 데이터 수집/관리 역량\n예: 영업 고객 미팅 → 이해관계자 커뮤니케이션 및 니즈 분석"} rows={4} ans={ans} set={set} />
    <In id="trans_transfer" label="Q7-2. 현재 직무에서 쌓은 역량 중 지원 직무에서 바로 활용 가능한 것은?" placeholder="기술적 역량과 소프트 스킬을 구분해서" rows={3} ans={ans} set={set} />
    <In id="trans_prep" label="Q7-3. 직무 전환을 위해 추가로 준비한 것은?" placeholder="교육, 자격증, 개인 프로젝트 등" rows={2} ans={ans} set={set} />
  </div>);

  // ===== PART 8: 역량 요약 =====
  case 7: return (<div>
    <ST title="PART 8. 핵심 역량 요약" sub="경력기술서 마지막에 배치할 역량 요약을 작성합니다." />

    {(ans.jd_core || ans.jd_kw || ans.highlight_2line || ans.highlight_3keyword) && (
      <div style={{ background: COLORS.cream, border: `1px solid ${COLORS.navyMid}33`, borderLeft: `3px solid ${COLORS.navyMid}`, padding: 16, borderRadius: RADIUS.md, marginBottom: 16 }}>
        <p style={{ fontSize: 16, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', color: COLORS.navyMid, marginBottom: 12 }}>
          INFO · 참고: PART 1 + PART 3 강점 하이라이트
        </p>
        {(ans.jd_core || ans.jd_kw) && (
          <div style={{ background: COLORS.paper, padding: 12, borderRadius: RADIUS.soft, marginBottom: 6, fontSize: 16 }}>
            <p style={{ fontWeight: 700, color: COLORS.ink, margin: 0, marginBottom: 4 }}>직무 핵심 역량 (PART 1)</p>
            <p style={{ color: COLORS.sub, margin: 0, fontStyle: 'italic', lineHeight: 1.6 }}>
              {(ans.jd_core || ans.jd_kw || '').length > 200 ? (ans.jd_core || ans.jd_kw).substring(0,200) + '...' : (ans.jd_core || ans.jd_kw)}
            </p>
          </div>
        )}
        {ans.highlight_2line && (
          <div style={{ background: COLORS.paper, padding: 12, borderRadius: RADIUS.soft, marginBottom: 6, fontSize: 16 }}>
            <p style={{ fontWeight: 700, color: COLORS.ink, margin: 0, marginBottom: 4 }}>2줄 강점 (PART 3)</p>
            <p style={{ color: COLORS.sub, margin: 0, fontStyle: 'italic', lineHeight: 1.6 }}>
              {ans.highlight_2line.length > 200 ? ans.highlight_2line.substring(0,200) + '...' : ans.highlight_2line}
            </p>
          </div>
        )}
        {ans.highlight_3keyword && (
          <div style={{ background: COLORS.paper, padding: 12, borderRadius: RADIUS.soft, fontSize: 16 }}>
            <p style={{ fontWeight: 700, color: COLORS.ink, margin: 0, marginBottom: 4 }}>3개 키워드 (PART 3)</p>
            <p style={{ color: COLORS.sub, margin: 0, fontStyle: 'italic', lineHeight: 1.6 }}>
              {ans.highlight_3keyword.length > 200 ? ans.highlight_3keyword.substring(0,200) + '...' : ans.highlight_3keyword}
            </p>
          </div>
        )}
      </div>
    )}
    <GP id="g_skills" title="핵심 역량 요약 작성 가이드" guides={guides} tog={tog}>
      <p style={{ fontSize: 16, color: COLORS.ink, marginBottom: 12 }}>경력기술서 마지막의 핵심 역량 요약은 채용담당자가 \"한눈에\" 당신을 파악하는 영역입니다. 직무상세내용 키워드 매칭 + 증거가 있는 역량만 적습니다.</p>
      
      <p style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink, marginTop: 12, marginBottom: 6 }}>1. 하드 스킬 (도구·기술·방법론)</p>
      <ul style={{ fontSize: 15, color: COLORS.navyMid, margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
        <li><strong>구체적인 도구·기술명으로</strong> 작성하세요. \"설계 도구\"가 아니라 \"SolidWorks, CATIA, Altium, LTspice, ANSYS\".</li>
        <li><strong>직무상세내용 키워드와 매칭</strong>되는 것을 가장 앞에 배치하세요.</li>
        <li><strong>PART 5의 BRIAR 성과에서 사용한 도구</strong>는 모두 포함하세요. (성과로 증명됨)</li>
        <li><strong>능숙도 표현</strong>: \"능숙\"/\"중급\" 같은 추상 표현 대신 \"3년 사용\"/\"실무 프로젝트 5건\" 같은 구체적 경험치로 표현 가능.</li>
      </ul>
      
      <Ex>{`회로 설계/PCB (5년, 양산 모델 5종+ 개발) / LTspice 회로 시뮬레이션 (4년) / Altium PCB 설계 (3년, 다층 기판·EMI 대응) / 신뢰성·내구 시험 (2년, 열·진동·수명 평가) / SolidWorks (기구 간섭·방열 구조 5건) / Python (계측 데이터 분석)`}</Ex>

      <p style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink, marginTop: 16, marginBottom: 6 }}>2. 소프트 스킬 (역량·전문성)</p>
      <ul style={{ fontSize: 15, color: COLORS.navyMid, margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
        <li><strong>흔한 소프트 스킬 금지</strong>: \"커뮤니케이션\", \"책임감\", \"성실함\" 같은 단어는 누구나 쓰므로 변별력 없음.</li>
        <li><strong>증거 가능한 전문 역량</strong>으로: \"3인 팀 리드\", \"크로스펑셔널 협업 (영업·개발·디자인)\", \"데이터 기반 의사결정\" 등.</li>
        <li><strong>PART 6 관리/리더십, PART 5 BRIAR에서 등장한 역량</strong>을 그대로 가져오세요. (성과로 증명됨)</li>
      </ul>
      
      <Ex>{`전력 회로 설계 전략 수립 (양산/선행 모두) / 3인 팀 리드 및 1:1 코칭 / 크로스펑셔널 협업 (기구·SW·생산기술) / 데이터 기반 가설 검증 및 DOE / 신뢰성 시험 기준 설계 및 검증 자동화`}</Ex>

      <p style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink, marginTop: 16, marginBottom: 6 }}>3. 자격증 / 인증</p>
      <ul style={{ fontSize: 15, color: COLORS.navyMid, margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
        <li><strong>직무 관련 자격증만</strong>: 운전면허, 무관한 어학자격증은 제외.</li>
        <li><strong>연관도 높은 순으로</strong>: 직무에 직접 연결되는 것 → 일반적인 비즈니스 자격증 순.</li>
        <li><strong>취득일</strong>이 너무 오래된(10년+) 자격증은 \"갱신 여부\"를 표시하거나 빼는 것이 안전.</li>
      </ul>
      
      <Ex>{`전기기사 (2024 갱신) / 품질경영기사 (2023) / TOEIC 920 (2022) / 컴퓨터활용능력 1급`}</Ex>
      
      <Warn title="피해야 할 표현">{`X "커뮤니케이션 능력 우수" → 누구나 적는 표현, 변별력 없음
X "문제 해결 능력" → 추상적, 무엇을 해결했는지 구체화 필요
X "긍정적이고 책임감 있는" → 인성에 가까운 표현, 경력기술서에 부적절
X 도구/기술을 너무 많이 나열 (15개+) → "이거 다 진짜 쓸 수 있어?" 의심`}</Warn>
    </GP>

    <In id="hard_skills" label="하드 스킬 (도구, 기술, 방법론)" placeholder="직무상세내용 키워드와 매칭되는 것 우선. PART 5에서 언급한 도구/기술 모두 포함" rows={2} ans={ans} set={set} />
    <In id="soft_skills" label="소프트 스킬 (역량, 전문성)" placeholder="프로젝트 리드, 데이터 기반 의사결정, 크로스펑셔널 협업 등" rows={2} ans={ans} set={set} />
    <In id="certs" label="자격증 / 인증" placeholder="직무 관련만. 연관도 높은 순서로" ans={ans} set={set} />
    <In id="career_gap" label="경력 공백 / 특이사항 설명 (해당자만 · 선택)" placeholder={'이직·교육·건강 등으로 공백이 있다면 사실+의미로 한 줄. 비워두면 출력되지 않습니다.\n예: "2023.01~2023.04(4개월) — 전동화 설계 직무 전환 준비. 사내 양산 프로젝트 마무리 후 FEA 심화 교육 수료 및 CATIA 전환 학습."'} rows={2} ans={ans} set={set} />
  </div>);

  // ===== PART 9: 최종 점검 =====
  case 8: {
    const items = [
      {id:'f1',t:'강점 하이라이트 3가지가 증거(성과)와 함께 있는가?',a:'PART 3 재확인'},
      {id:'f2',t:'경력 요약이 3~5줄로 핵심을 전달하는가?',a:'PART 3 재확인'},
      {id:'f3',t:'성과 선별 기준(5가지)으로 O가 3개 이상인 것만 포함했는가?',a:'PART 4 재확인'},
      {id:'f4',t:'모든 성과에 BRIAR(배경-역할-행동-성과-파급)가 포함되어 있는가?',a:'PART 5 재확인'},
      {id:'f5',t:'"업무를 담당했습니다" 같은 업무 나열이 아닌 성과 중심인가?',a:'"담당" → "달성" 전환'},
      {id:'f6',t:'나의 주도적 역할이 명확히 드러나는가?',a:'"나는"과 "팀은"을 구분'},
      {id:'f7',t:'직무상세내용 키워드가 자연스럽게 녹아 있는가?',a:'PART 1 키워드와 대조'},
      {id:'f8',t:'경력 스토리라인(성장 흐름)이 보이는가?',a:'PART 2 재확인'},
      {id:'f9',t:'최근 경력이 가장 상세하고 과거는 간략한가?',a:'경력 깊이 조절'},
      {id:'f10',t:'기밀 사항이 모두 제거/대체되었는가?',a:'고객사명→"A사", 금액→범위화'},
      {id:'f11',t:'이력서와 경력기술서가 일관되는가?',a:'이력서와 대조'},
      {id:'f12',t:'지원 직무 관점에서 성과 강조점이 조정되었는가?',a:'관점 전환 확인'},
      {id:'f13',t:'오탈자가 없는가?',a:'소리 내어 읽기'},
    ];
    const done = items.filter(i=>chk[i.id]).length;

    return (<div>
      <ST title="PART 9. 최종 점검" sub={`제출 전 하나씩 점검하세요. (${done}/${items.length} 완료)`} />

    <GP id="g_full_sample" title="완성 예시 펼쳐보기 — 이직 지원자 경력기술서 한 편" guides={guides} tog={tog}>
      <div className="whitespace-pre-line" style={{ background: COLORS.paper, border: `1px solid ${COLORS.accent2}33`, color: COLORS.ink, padding: 16, borderRadius: RADIUS.md, fontSize: 16, lineHeight: 1.7, whiteSpace: 'pre-line' }}>{`■ 경력 요약
자동차 부품 기구설계 7년차. 사출·기구 부품 양산 설계와 공차(GD&T)·양산성 검토가 강점. 양산 불량률·원가·납기에서 정량 성과 다수, 후배 2명 설계검증 코칭. 전동화 부품으로 직무 확장을 준비.

■ 강점 하이라이트
· 양산성 설계 — 공차 재정의로 양산 불량률 3.1%→0.8%(74%↓), 라인 정지 월 6회→1회
· 원가 절감 — 부품 통합 설계로 모델당 재료비 12% 절감
· 검증 리딩 — 해석(구조·열) 기반 설계 검증을 표준화, 후속 모델 동종 불량 재발 0건

■ 경력 사항
[B부품 · 2021.03~현재] 기구설계팀 책임 / 하우징·브래킷 모듈 단독 설계, 양산 5종
  - (BRIAR) 구동모터 하우징 사출 공차 누적으로 불량률 3.1% → GD&T 데이텀 재정의·공차 재계산을 내가 주도, 금형 공정능력(±0.1mm) 확인 후 재설계 → 불량률 0.8%(74%↓), 6개월 내 양산 이관 → 팀 설계 가이드로 표준화·2개 모델 확산
[A전자 · 2018.01~2021.02] 기구설계 선임 / 소형 모듈 방열·구조 설계
  - (BRIAR) 발열로 보호회로 작동 → ANSYS 열해석으로 병목 특정, 방열 핀 구조 제안 → IC 온도 92℃→82℃, 시작품 통과율 향상

■ 핵심 역량
하드: SolidWorks(7년)·CATIA(전환 중)·ANSYS 구조/열해석·GD&T 공차분석 / 소프트: 3인 설계검증 코칭·크로스펑셔널 협업(생산기술·품질·구매) / 자격: 일반기계기사

■ 경력 공백 · 특이사항
2023.01~2023.04(4개월) — 전동화 설계 직무 전환 준비. 양산 프로젝트 마무리 후 FEA 심화 교육 수료 및 CATIA 전환 학습.`}</div>
    </GP>

    {/* 작성 내용 직접 수정 영역 - 편집 가능 textarea */}
    <div style={{ background: COLORS.cream, border: `1px solid ${COLORS.navyMid}33`, borderLeft: `3px solid ${COLORS.navyMid}`, padding: 16, borderRadius: RADIUS.md, marginBottom: 16 }}>
      <p style={{ fontSize: 16, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', color: COLORS.navyMid, marginBottom: 4 }}>
        EDIT · 작성 내용 직접 수정
      </p>
      <p style={{ fontSize: 16, color: COLORS.sub, margin: '0 0 12px 0' }}>아래 영역에서 바로 다듬을 수 있습니다. 수정한 내용은 워드 출력에도 자동 반영됩니다.</p>

      {/* 1. 지원 정보 (PART 1) */}
      {(ans.company || ans.position) && (
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontWeight: 700, color: COLORS.ink, margin: 0, marginBottom: 6, fontSize: 16 }}>지원 정보 (PART 1)</p>
          <div style={{ background: COLORS.paper, padding: 10, borderRadius: RADIUS.md, fontSize: 16, color: COLORS.sub }}>
            {[ans.company, ans.position].filter(Boolean).join(' · ')}
          </div>
        </div>
      )}

      {/* 2. 경력 한 줄 요약 (PART 2) - 직접 수정 */}
      {ans.story_one && (
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontWeight: 700, color: COLORS.ink, display: 'block', marginBottom: 6, fontSize: 16 }}>경력 한 줄 요약 (PART 2)</label>
          <textarea value={ans.story_one || ''} onChange={e => set('story_one', e.target.value)}
            rows={2} className="resize-none"
            style={{ width: '100%', padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.md, fontSize: 16, outline: 'none', background: COLORS.white }} />
        </div>
      )}

      {/* 3. 강점 하이라이트 (PART 3) */}
      {(ans.highlight_2line || ans.highlight_3keyword) && (
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontWeight: 700, color: COLORS.ink, margin: 0, marginBottom: 6, fontSize: 16 }}>강점 하이라이트 (PART 3)</p>
          {ans.highlight_2line && (
            <div style={{ marginBottom: 6 }}>
              <label style={{ fontSize: 13, color: COLORS.navyMid, display: 'block', marginBottom: 4 }}>2줄 강점</label>
              <textarea value={ans.highlight_2line || ''} onChange={e => set('highlight_2line', e.target.value)}
                rows={2} className="resize-none"
                style={{ width: '100%', padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.md, fontSize: 16, outline: 'none', background: COLORS.white }} />
            </div>
          )}
          {ans.highlight_3keyword && (
            <div>
              <label style={{ fontSize: 13, color: COLORS.navyMid, display: 'block', marginBottom: 4 }}>3개 키워드</label>
              <input type="text" value={ans.highlight_3keyword || ''} onChange={e => set('highlight_3keyword', e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.md, fontSize: 16, outline: 'none', background: COLORS.white }} />
            </div>
          )}
        </div>
      )}

      {/* 4. 회사별 BRIAR 성과 (PART 5) - 동적 */}
      {Array.from({length: companyCount}, (_, i) => i + 1).some(c => ans[`c${c}_company`]) && (
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontWeight: 700, color: COLORS.ink, margin: 0, marginBottom: 6, fontSize: 16 }}>회사별 BRIAR 성과 (PART 5)</p>
          {Array.from({length: companyCount}, (_, i) => i + 1).map(c => {
            if (!ans[`c${c}_company`]) return null;
            const perfCount = perfCounts[c] || 1;
            return (
              <div key={c} style={{ background: COLORS.paper, borderRadius: RADIUS.md, padding: 12, marginBottom: 8 }}>
                <p style={{ fontWeight: 700, color: COLORS.ink, margin: 0, marginBottom: 6, fontSize: 16 }}>{ans[`c${c}_company`]} {ans[`c${c}_period`] ? `· ${ans[`c${c}_period`]}` : ''} {ans[`c${c}_title`] ? `· ${ans[`c${c}_title`]}` : ''}</p>
                {Array.from({length: perfCount}, (_, i) => i + 1).map(p => (
                  ans[`c${c}_s${p}_title`] && (
                    <div key={p} style={{ background: COLORS.white, padding: 10, borderRadius: RADIUS.soft, marginBottom: 6, border: `1px solid ${COLORS.border}` }}>
                      <label style={{ fontSize: 13, color: COLORS.navyMid, display: 'block', marginBottom: 4, fontWeight: 600 }}>성과 {p}: {ans[`c${c}_s${p}_title`]}</label>
                      <textarea value={ans[`c${c}_s${p}_action`] || ''} onChange={e => set(`c${c}_s${p}_action`, e.target.value)}
                        placeholder="[I] 주도한 행동"
                        rows={2} className="resize-none"
                        style={{ width: '100%', padding: '8px 10px', border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.soft, fontSize: 13, outline: 'none', background: COLORS.white, marginBottom: 4 }} />
                      <textarea value={ans[`c${c}_s${p}_result`] || ''} onChange={e => set(`c${c}_s${p}_result`, e.target.value)}
                        placeholder="[A] 정량적 성과"
                        rows={2} className="resize-none"
                        style={{ width: '100%', padding: '8px 10px', border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.soft, fontSize: 13, outline: 'none', background: COLORS.white }} />
                    </div>
                  )
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* 5. 핵심 역량 요약 (PART 8) - 직접 수정 */}
      {(ans.hard_skills || ans.soft_skills || ans.certs) && (
        <div style={{ marginBottom: 0 }}>
          <p style={{ fontWeight: 700, color: COLORS.ink, margin: 0, marginBottom: 6, fontSize: 16 }}>핵심 역량 요약 (PART 8)</p>
          {ans.hard_skills !== undefined && (
            <div style={{ marginBottom: 6 }}>
              <label style={{ fontSize: 13, color: COLORS.navyMid, display: 'block', marginBottom: 4 }}>하드 스킬</label>
              <textarea value={ans.hard_skills || ''} onChange={e => set('hard_skills', e.target.value)}
                rows={2} className="resize-none"
                style={{ width: '100%', padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.md, fontSize: 16, outline: 'none', background: COLORS.white }} />
            </div>
          )}
          {ans.soft_skills !== undefined && (
            <div style={{ marginBottom: 6 }}>
              <label style={{ fontSize: 13, color: COLORS.navyMid, display: 'block', marginBottom: 4 }}>소프트 스킬</label>
              <textarea value={ans.soft_skills || ''} onChange={e => set('soft_skills', e.target.value)}
                rows={2} className="resize-none"
                style={{ width: '100%', padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.md, fontSize: 16, outline: 'none', background: COLORS.white }} />
            </div>
          )}
          {ans.certs !== undefined && (
            <div>
              <label style={{ fontSize: 13, color: COLORS.navyMid, display: 'block', marginBottom: 4 }}>자격증·인증</label>
              <input type="text" value={ans.certs || ''} onChange={e => set('certs', e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.md, fontSize: 16, outline: 'none', background: COLORS.white }} />
            </div>
          )}
        </div>
      )}
    </div>
      <div style={{ background: COLORS.border, width: '100%', borderRadius: RADIUS.pill, height: 8, marginBottom: 20 }}>
        <div style={{ background: COLORS.goldDeep, height: 8, borderRadius: RADIUS.pill, transition: 'all 150ms', width:`${(done/items.length)*100}%` }}/>
      </div>
      {items.map(i=><Chk key={i.id} id={i.id} text={i.t} action={`조치: ${i.a}`} chk={chk} togChk={togChk} />)}
    </div>);
  }

  // ===== PART 10: 완성 =====
  case 9: return (<div>
    <div style={{ textAlign: 'center', marginBottom: 24 }}>
      <div style={{ width: 56, height: 56, background: COLORS.cream, borderRadius: RADIUS.pill, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto', marginRight: 'auto', marginBottom: 12 }}></div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.ink, marginBottom: 4 }}>경력기술서 워크북 작성 완료!</h2>
      <p style={{ fontSize: 16, color: COLORS.sub }}>작성 결과를 확인하고 다운로드하세요.</p>
    </div>
    <Warn title="완성본은 파일로 받아두세요">이 브라우저에 자동 저장됩니다. 다만 캐시 삭제·다른 기기에서는 사라질 수 있으니 최종본을 파일로 받아두면 안전합니다.</Warn>

    {/* 최종 문서 미리보기 — 워드 다운로드 결과 그대로 표시 */}
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <p style={{ fontSize: 18, fontWeight: 700, color: COLORS.ink, margin: 0 }}>최종 문서 미리보기</p>
        <p style={{ fontSize: 16, color: COLORS.sub, margin: 0 }}>아래 그대로 .docx 파일로 다운로드됩니다</p>
      </div>
      <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.lg, overflow: 'hidden', boxShadow: '0 2px 8px rgba(14, 39, 80, 0.06)' }}>
        <iframe
          srcDoc={buildHtml()}
          style={{ width: '100%', height: '600px', border: 'none', display: 'block', background: COLORS.white }}
          title="경력기술서 최종 문서 미리보기"
        />
      </div>
      <p style={{ fontSize: 13, color: COLORS.sub, margin: '8px 0 0', textAlign: 'center' }}>
        미리보기에서 누락된 항목이 보이면 이전 PART로 돌아가서 작성하세요.
      </p>
    </div>

    <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
      <button onClick={prev} style={{ background: 'transparent', color: COLORS.ink, border: `1px solid ${COLORS.border}`, padding: '12px 24px', borderRadius: RADIUS.lg, fontSize: 16, fontWeight: 500, cursor: 'pointer' }}>
        이전
      </button>
      <button onClick={dlPreview} style={{ flex: 1, color: COLORS.white, borderRadius: RADIUS.lg, fontWeight: 700, fontSize: 16, transition: 'all 150ms', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: COLORS.ink, cursor: 'pointer', border: 'none', padding: '14px 24px' }}>
        미리보기 & PDF로 저장 (추천)
      </button>
    </div>
    <div style={{ display: 'flex', gap: 12 }}>
      <button onClick={dl} style={{ flex: 1, color: COLORS.navyMid, borderRadius: RADIUS.md, fontWeight: 600, fontSize: 16, background: COLORS.cream, cursor: 'pointer', border: `1px solid ${COLORS.border}`, padding: '10px 16px' }}>
        다운로드 (.docx)
      </button>
      <button onClick={dlHtml} style={{ flex: 1, color: COLORS.navyMid, borderRadius: RADIUS.md, fontWeight: 600, fontSize: 16, background: COLORS.cream, cursor: 'pointer', border: `1px solid ${COLORS.border}`, padding: '10px 16px' }}>
        HTML 다운로드
      </button>
    </div>
    {downloaded && <p style={{ fontSize: 16, color: COLORS.green, textAlign: 'center', marginTop: 12, fontWeight: 600 }}>✓ 완료! 새 탭에서 인쇄 → \"PDF로 저장\"하시면 됩니다.</p>}
    
    <div style={{ marginTop: 16, background: COLORS.paper, border: `1px solid ${COLORS.accent2}66`, borderRadius: RADIUS.md, padding: 14, fontSize: 13, color: COLORS.sub, lineHeight: 1.6 }}>
      <p style={{ margin: 0, marginBottom: 6, fontWeight: 700, color: COLORS.ink }}>어떤 방식으로 저장할까요?</p>
      <p style={{ margin: 0, marginBottom: 4 }}>· <strong style={{color:COLORS.ink}}>PDF로 저장 (추천 · 모든 환경)</strong>: 새 탭에서 자동으로 인쇄 대화창이 열립니다. <strong>\"PDF로 저장\"</strong> 선택하세요.</p>
      <p style={{ margin: '0 0 4pt 12pt', fontSize: 16 }}>{'\u3000'}• <strong>안드로이드</strong>: \"PDF로 저장\" 선택 → 파일 위치 지정</p>
      <p style={{ margin: '0 0 4pt 12pt', fontSize: 16 }}>{'\u3000'}• <strong>아이폰</strong>: 공유 버튼 → \"파일에 저장\"</p>
      <p style={{ margin: '0 0 8pt 12pt', fontSize: 16 }}>{'\u3000'}• <strong>PC</strong>: 인쇄 → 대상을 \"PDF로 저장\"으로 변경</p>
      <p style={{ margin: 0, marginBottom: 4 }}>· <strong>다운로드 (.docx)</strong>: PC에서 수정하고 싶을 때만. <strong style={{color:COLORS.accent2}}>안드로이드/아이폰에서는 안 열립니다.</strong></p>
      <p style={{ margin: 0 }}>· <strong>HTML 다운로드</strong>: 브라우저에서 열어 확인 가능 (백업용).</p>
    </div>

    <div style={{ marginTop: 20, background: COLORS.cream, border: `1px solid ${COLORS.border}`, borderColor: COLORS.border, borderRadius: RADIUS.lg, padding: 16 }}>
      <p style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink, marginBottom: 8 }}>CareerEngineer 연계 자료</p>
      <p style={{ fontSize: 16, color: COLORS.ink }}>- 경력기술서 전: 이력서 가이드 & 워크북 / 채용공고 및 직무분석 가이드</p>
      <p style={{ fontSize: 16, color: COLORS.ink }}>- 경력기술서 후: 자소서 5대항목 가이드 & 워크북 / 경력 면접 가이드 & 워크북</p>
    </div>
  </div>);

  default: return null;
  }};

  // LAYOUT
  // 중간 저장 (PART 7-7)
  // 임시저장 — 메인 다운로드(dl)와 동일한 디자인의 워드 호환 HTML 사용
  const savePartial = () => {
    // 메인 다운로드와 동일한 docx 생성 (모든 답변 포함)
    dl();
  };

  return (
    <div style={{ minHeight: '100vh', background: COLORS.cream, padding: 'clamp(16px, 4vw, 32px)', fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, sans-serif', color: COLORS.ink }}>
      <BrandOverride />
      <FirstVisitModal open={showHelp} onClose={() => setShowHelp(false)} title="경력기술서 워크북 사용 안내" steps={[
        '순서대로 <strong>PART 1부터 PART 9까지</strong> 진행하세요.',
        '작성 중 상단의 <strong>다운로드 (.docx)</strong> 버튼을 눌러 수시로 다운로드하세요.',
        '질문 옆 <strong>가이드 보기</strong>를 펼쳐 원칙·예시를 참고하세요.',
        '마지막 PART에서 <strong>최종 다운로드</strong>하여 편집하세요.',
      ]} />
      <div style={{ maxWidth: 1350, margin: '0 auto' }}>
        {/* ═══ Sticky Header (PART 7-6) ═══ */}
        <div style={{ position: 'sticky', top: 16, zIndex: 10, background: COLORS.cream, borderRadius: RADIUS.md, padding: 16, border: `1px solid ${COLORS.border}`, marginBottom: 16, boxShadow: '0 2px 8px rgba(14, 39, 80, 0.12)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
            <CELockupA height={32} />
            {/* 중: 현재 단계 (클릭 시 7단계 드롭다운) */}
            <div style={{ position: 'relative', flex: 1, display: 'flex', justifyContent: 'center' }}>
              
              
            </div>
            <button onClick={() => window.__CE_RESET?.fn?.()} title="이 워크북 작성 내용을 모두 지우고 처음부터 다시 작성" style={{ background: 'transparent', color: COLORS.red, border: `1px solid ${COLORS.red}66`, borderRadius: RADIUS.md, padding: '0 14px', fontSize: 16, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', height: 40, display: 'inline-flex', alignItems: 'center', marginRight: 6 }}>삭제하고 다시 작성</button><button onClick={goHome} title="처음 페이지로 이동 (작성 내용 유지)" style={{ background: 'transparent', color: COLORS.sub, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.md, padding: '0 14px', fontSize: 16, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', height: 40, display: 'inline-flex', alignItems: 'center' }}>처음으로</button>
            
            <button onClick={savePartial} style={{ background: COLORS.accent2, color: '#fff', border: 'none', borderRadius: RADIUS.md, padding: '0 14px', fontSize: 16, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, whiteSpace: 'nowrap', height: 36 }} title="지금까지 작성한 내용을 Word로 저장">
              저장 (.docx)
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, background: COLORS.border, borderRadius: RADIUS.pill, height: 6, overflow: 'hidden' }}>
              <div style={{ background: COLORS.accent2, height: 6, borderRadius: RADIUS.pill, width: `${progress}%`, transition: 'width 500ms ease' }} />
            </div>
            <span style={{ fontSize: 16, color: COLORS.sub, minWidth: 36, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{progress}%</span>
          </div>
        </div>

        {/* 임시저장 토스트 */}
        {downloaded && (
          <div style={{ background: COLORS.paper, border: '1px solid rgba(201, 168, 106, 0.2)', borderRadius: RADIUS.md, padding: 12, marginBottom: 16, textAlign: 'center' }}>
            <p style={{ fontSize: 16, color: COLORS.accent2, fontWeight: 600, margin: 0 }}>✓ 백업 .docx 파일을 내려받았습니다</p>
          </div>
        )}

        {/* 스텝 인디케이터 */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: 4 }}>
            {PARTS.map((t,i) => {
              if (skipPart(i)) return null;
              return (<button key={i} onClick={()=>go(i)}
                style={{ fontSize: 13, padding: '4px 8px', borderRadius: RADIUS.pill, border: 'none', cursor: 'pointer', fontWeight: i === currentPart ? 700 : 500, background: i === currentPart ? COLORS.ink : i < currentPart ? COLORS.paper : 'transparent', color: i === currentPart ? '#fff' : i < currentPart ? COLORS.accent2 : COLORS.sub, whiteSpace: 'nowrap', flexShrink: 0 }}>
                {i < currentPart ? '✓ ' : ''}PART {i + 1}. {t}
              </button>);
            })}
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: RADIUS.lg, padding: 'clamp(16px, 4vw, 32px)', border: `1px solid ${COLORS.border}`, marginBottom: 20 }}>
          {renderPart()}
          <div className="mt-7" style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => currentPart === 0 ? setPage('intro') : prev()} style={{ background: 'transparent', color: COLORS.ink, border: `1px solid ${COLORS.border}`, padding: '12px 24px', borderRadius: RADIUS.md, fontSize: 16, fontWeight: 500, cursor: 'pointer' }}>이전</button>
            {currentPart<9 && <button onClick={next} style={{ flex: 1, background: COLORS.ink, color: COLORS.white, border: 'none', padding: '12px 24px', borderRadius: RADIUS.md, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>다음</button>}
          </div>
        </div>
        <StickyFooter />
      </div>
    </div>
  );
};

export default CareerDescWorkbook;
