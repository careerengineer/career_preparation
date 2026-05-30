// [BUILD v36 20260520 10:30] docx 저장에 CareerEngineer 자료 + 멘토링 안내 섹션 추가 (ExternalHyperlink + linkP)
import { useState, useEffect, useRef } from 'react';
import * as DOCX from 'docx';
import { clickable } from '../../shared/a11y.js';
import { COLORS, RADIUS } from '../../shared/design/tokens.js';
import { buildWorkbookBackupParagraphs, buildWorkbookPayload, buildCopyrightParagraphs } from '../../store/docxBackup.js';
import { buildResumeDocxChildren } from '../../store/workbookDocx.js';
import { ReferenceInline } from '../../shared/components/ReferenceInline.jsx';
import { ToggleLink } from '../../shared/components/ToggleLink.jsx';
import { VARIANT } from '../../store/schema.js';
import { _INTRO_FONT, StickyFooter } from '../_shared/brandKit.jsx';
import { _INTRO_INK, _INTRO_INK2, _INTRO_PAPER, _INTRO_GOLD, _INTRO_MUTE, CELockupA, FirstVisitModal, BrandHero, IntroCTA, IntroFlowCard, IntroCopyright } from '../_shared/brandKit.jsx';

const IS_EXPERIENCED_VARIANT = VARIANT === 'experienced' || VARIANT === 'documents_experienced';

// 멘토링·컨설팅 URL 상수 (작업 18: URL 상수화)
// ══════════════════════════════════════════════════════════════
//  CareerEngineer 브랜드 오버라이드 (PART 7-6 표준)
//  원본 Tailwind 클래스를 유지하되 컬러 토큰만 공식 팔레트로 교체
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
// id 기반 자동 참고 워크북 추천
function inferRelated(id) {
  if (!id) return [];
  if (/company|position|industry/i.test(id)) return ['job_analysis'];
  if (/experience|career|project|story|achievement|highlight/i.test(id)) return ['experience'];
  if (/skill|cert/i.test(id)) return ['job_analysis', 'experience'];
  if (/goal|year|aspiration|vision/i.test(id)) return ['careergoal', 'career_roadmap'];
  return ['experience', 'job_analysis'];
}

const QuestionBlock = ({ id, label, hint, placeholder, rows, guide, answers, handleAnswer, showGuide, toggleGuide }) => (
  <div style={{ marginBottom: 24 }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
      <label style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink, lineHeight: 1.375, flex: 1 }}>{label}</label>
      {guide && (
        <ToggleLink open={!!showGuide[id]} onToggle={() => toggleGuide(id)} label="가이드" style={{ flexShrink: 0 }} />
      )}
    </div>
    {hint && <p style={{ fontSize: 16, color: COLORS.sub, marginBottom: 8 }}>{hint}</p>}
    <ReferenceInline ids={inferRelated(id)} />
    {guide && showGuide[id] && (
      <div style={{ borderColor: COLORS.border, background: COLORS.cream, border: `1px solid ${COLORS.border}`, borderLeft: `3px solid ${COLORS.accent2}`, borderRadius: RADIUS.md, padding: 16, marginBottom: 12, gap: 12 }}>
        <p style={{ fontSize: 16, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', color: COLORS.accent2, margin: 0, marginBottom: 8 }}>GUIDE · 작성 가이드</p>
        {guide.description && <p style={{ fontSize: 16, color: COLORS.ink }}>{guide.description}</p>}
        {guide.helpQuestions && (
          <div>
            <p style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink, marginBottom: 4 }}>도움 질문:</p>
            <ul style={{ fontSize: 16, color: COLORS.ink, gap: 4 }}>
              {guide.helpQuestions.map((q, i) => <li key={i}>- {q}</li>)}
            </ul>
          </div>
        )}
        {guide.example && (
          <div style={{ background: COLORS.cream, borderRadius: RADIUS.soft, padding: 12 }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink, marginBottom: 4 }}>작성 예시:</p>
            <p className="whitespace-pre-line" style={{ fontSize: 16, color: COLORS.ink, whiteSpace: 'pre-line', lineHeight: 1.7 }}>{guide.example}</p>
          </div>
        )}
        {guide.warning && (
          <div style={{ borderColor: COLORS.border, display: 'flex', alignItems: 'flex-start', gap: 8, background: COLORS.paper, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.soft, padding: 12 }}>
            <p style={{ fontSize: 16, color: COLORS.ink }}>{guide.warning}</p>
          </div>
        )}
      </div>
    )}
    <textarea
      value={answers[id] || ''}
      onChange={(e) => handleAnswer(id, e.target.value)}
      rows={rows || 3}
      className="resize-none" style={{ width: '100%', paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, border: `1px solid ${COLORS.border}`, borderColor: `${COLORS.border}`, borderRadius: RADIUS.md, outline: 'none', fontSize: 16 }}
      placeholder={placeholder}
    />
  </div>
);

const TipBox = ({ children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, background: COLORS.paper, borderLeftWidth: 4, borderLeftStyle: 'solid', borderColor: COLORS.accent2, borderTopRightRadius: 8, borderBottomRightRadius: 8, padding: 16, marginBottom: 24 }}>
    <p style={{ fontSize: 16, color: COLORS.ink }}>{children}</p>
  </div>
);

const WarningBox = ({ title, children }) => (
  <div style={{ background: COLORS.cream, border: `1px solid ${COLORS.ink}33`, color: COLORS.ink, padding: 16, borderRadius: RADIUS.md, marginBottom: 16 }}>
    <p style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink, marginBottom: 4 }}>{title}</p>
    <p style={{ fontSize: 16, color: COLORS.navyMid }}>{children}</p>
  </div>
);

const ResumeWorkbook = () => {
  const [showIntro, setShowIntro] = useState(true);
  // currentPart: 이 워크북 "내부" PART 인덱스 (대시보드 상위 STEP 0~5와 무관). 저장 키도 currentPart, 단 구버전(currentStep) 저장본 호환을 위해 로드 시 둘 다 읽음.
  const [currentPart, setCurrentPart] = useState(() => { try { const __d = JSON.parse(localStorage.getItem('careerengineer_resume_v1') || '{}'); return (__d.basicInfo && (__d.basicInfo.industry || __d.basicInfo.position || __d.basicInfo.company)) ? 1 : 0; } catch { return 0; } });
  const [showGuide, setShowGuide] = useState({});
  const [answers, setAnswers] = useState({});
  const [checks, setChecks] = useState({});
  const [downloadDone, setDownloadDone] = useState(false);
  const [showHelp, setShowHelp] = useState(true);
  // [CE-HOME] WorkbookShell '처음으로' 버튼에서 호출
  const __ceHomeRef = useRef(null);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.__CE_HOME = { fn: () => __ceHomeRef.current?.(), key: 'resume' };
    return () => { if (window.__CE_HOME?.key === 'resume') window.__CE_HOME = null; };
  }, []);
  const goHome = () => {
    setShowIntro(true);
    setCurrentPart(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  __ceHomeRef.current = goHome; // [CE-HOME] ref 갱신
  const [expCount, setExpCount] = useState(3);  // PART 3: 경험 개수 (기본 3, 최대 8)
  const [projCount, setProjCount] = useState(1);  // PART 6: 프로젝트 개수 (기본 1, 최대 5)
  // 입력칸 예시(placeholder)를 사용자가 고른 유형(expType)에 맞춰 신입/경력으로 분기
  const isCareer = ['경력_3년이하', '경력_3_7년', '경력_7년이상', '직무전환'].includes(answers.expType);
  const [confirmingClear, setConfirmingClear] = useState(false);
  
  const STORAGE_KEY = 'careerengineer_resume_v1';
  
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.answers && Object.keys(data.answers).length > 0) {
          const savedDate = data.savedAt ? new Date(data.savedAt).toLocaleString('ko-KR') : '이전';
          if (true /* auto-restore */) {
            setAnswers(data.answers || {});
            if (data.checks) setChecks(data.checks);
            // 하위호환: 신규 저장본은 currentPart, 구버전 저장본·기존 다운로드 파일은 currentStep 키 → 둘 다 읽어 작성 위치 유실 0.
            if (typeof (data.currentPart ?? data.currentStep) === 'number') setCurrentPart(data.currentPart ?? data.currentStep);
            if (typeof data.expCount === 'number') setExpCount(data.expCount);
            if (typeof data.projCount === 'number') setProjCount(data.projCount);
            if (data.showIntro === false) setShowIntro(false);
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      }
    } catch (e) { console.warn(e); }
  }, []);
  
  useEffect(() => {
    if (Object.keys(answers).length === 0) return;
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          answers, checks, currentPart, expCount, projCount, showIntro,
          savedAt: new Date().toISOString()
        }));
      } catch { /* ignore */ }
    }, 1000);
    return () => clearTimeout(timer);
  }, [answers, checks, currentPart, expCount, projCount, showIntro]);
  

  const handleAnswer = (id, val) => setAnswers(p => ({ ...p, [id]: val }));
  const toggleGuide = (id) => setShowGuide(p => ({ ...p, [id]: !p[id] }));
  const toggleCheck = (id) => setChecks(p => ({ ...p, [id]: !p[id] }));

  const progress = Math.round((currentPart / 7) * 100);

  const goNext = () => { if (currentPart < 7) setCurrentPart(currentPart + 1); window.scrollTo(0, 0); };
  const goPrev = () => { if (currentPart > 0) setCurrentPart(currentPart - 1); window.scrollTo(0, 0); };

  // 채용담당자 제출용 이력서 — 워크북 입력 모두 반영 (CareerEngineer 흔적 없음)
  // docx 라이브러리 동적 로드 (CDN)
  const loadDocxLib = () => Promise.resolve(DOCX);

  // [CE-DL] 외부 WorkbookShell 버튼에서 호출 위한 등록

  const __ceDlRef = useRef(null);

  useEffect(() => {

    if (typeof window === 'undefined') return;

    window.__CE_DOWNLOAD = { fn: () => __ceDlRef.current?.(), key: 'resume' };

    return () => { if (window.__CE_DOWNLOAD?.key === 'resume') window.__CE_DOWNLOAD = null; };

  }, []);

  const generateDoc = async () => {
    try {
      const docxLib = await loadDocxLib();
      const { Document, Paragraph, TextRun, AlignmentType, BorderStyle, ExternalHyperlink, Packer } = docxLib;
      const today = new Date().toISOString().slice(0,10);
      const a = (k) => (answers[k] || '').toString();
      
      // 스타일 헬퍼
      const titleP = (t) => new Paragraph({
        children: [new TextRun({ text: t, bold: true, size: 44, font: '맑은 고딕', color: '0E2750', characterSpacing: 200 })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 240 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 24, color: '0E2750', space: 6 } }
      });
      const subtitleP = (t) => new Paragraph({
        children: [new TextRun({ text: t, bold: true, size: 24, font: '맑은 고딕', color: '1B3A6B' })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 480 }
      });
      const sectionH = (t) => new Paragraph({
        children: [new TextRun({ text: t, bold: true, size: 28, font: '맑은 고딕', color: '0E2750' })],
        spacing: { before: 480, after: 200 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: '0E2750', space: 4 } }
      });
      const bulletP = (t) => new Paragraph({
        children: [
          new TextRun({ text: '▪  ', size: 22, font: '맑은 고딕', color: '1B3A6B' }),
          new TextRun({ text: t, size: 22, font: '맑은 고딕', color: '0E2750' })
        ],
        spacing: { before: 60, after: 60, line: 340 },
        indent: { left: 240, hanging: 240 }
      });
      const resultP = (t) => new Paragraph({
        children: [
          new TextRun({ text: '▸  ', size: 22, font: '맑은 고딕', color: '1B3A6B', bold: true }),
          new TextRun({ text: t, size: 22, font: '맑은 고딕', color: '0E2750', bold: true })
        ],
        spacing: { before: 80, after: 160, line: 340 },
        indent: { left: 240, hanging: 240 }
      });
      const dateP = () => new Paragraph({
        children: [new TextRun({ text: '작성일 · ' + today, size: 20, font: '맑은 고딕', color: '6E7A8F' })],
        alignment: AlignmentType.RIGHT,
        spacing: { after: 80 }
      });
      const highlightP = (t) => new Paragraph({
        children: t.split('\n').flatMap((line, i) => i === 0 ? [new TextRun({ text: line, size: 22, font: '맑은 고딕', color: '0E2750' })] : [new TextRun({ break: 1, text: line, size: 22, font: '맑은 고딕', color: '0E2750' })]),
        spacing: { before: 100, after: 200, line: 360 },
        shading: { fill: 'F2F1EC' },
        border: { left: { style: BorderStyle.SINGLE, size: 24, color: '1B3A6B', space: 8 } },
        indent: { left: 240 }
      });
      const metaP = (label, value) => new Paragraph({
        children: [
          new TextRun({ text: label + '\t', bold: true, size: 22, font: '맑은 고딕', color: '1B3A6B' }),
          new TextRun({ text: value, size: 22, font: '맑은 고딕', color: '0E2750' })
        ],
        spacing: { before: 100, after: 100 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'E8E5DD', space: 4 } }
      });
      const noteP = (label, value) => new Paragraph({
        children: [
          new TextRun({ text: label + ': ', bold: true, size: 20, font: '맑은 고딕', color: '1B3A6B' }),
          new TextRun({ text: value, size: 20, font: '맑은 고딕', color: '0E2750' })
        ],
        spacing: { before: 80, after: 80 }
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
      
      // 줄바꿈 텍스트를 ▪ 리스트로
      
      const children = buildResumeDocxChildren({ answers, expCount, projCount }, docxLib);

      try { children.push(...buildWorkbookBackupParagraphs(docxLib, buildWorkbookPayload('resume', '이력서', 'careerengineer_resume_v1'))); } catch (e) { console.warn('[resume] backup embed skipped:', e); }
      try { children.unshift(...buildCopyrightParagraphs(docxLib)); } catch (e) { console.warn('copyright skip', e); }
      const doc = new Document({
        creator: '',
        title: '이력서',
        sections: [{
          properties: { page: { margin: { top: 1400, right: 1133, bottom: 1400, left: 1133 } } },
          children: children
        }]
      });
      
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const dl = document.createElement('a');
      dl.href = url;
      dl.download = `이력서_${(answers.company || '미입력').replace(/[^a-zA-Z0-9가-힣\s]/g, '_')}_${today}.docx`;
      document.body.appendChild(dl); dl.click(); document.body.removeChild(dl);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setDownloadDone(true);
    } catch (err) {
      console.error('docx 생성 실패:', err);
      alert('.docx 파일 생성에 실패했습니다.\n' + (err.message || ''));
    }
  };

  __ceDlRef.current = generateDoc; // [CE-DL] ref 갱신

  // ==================== INTRO ====================
      if (showIntro) return (
    <IntroPage
      workbookKey='resume'
      stepLabel='STEP 3 · 이력서 작성'
      title='이력서 작성'
      subtitle='질문에 답하며 완성하는 이력서'
      flow={[
          { label: 'PART 1', desc: '기본 정보 입력 (회사·직무·지원자 유형)' },
          { label: 'PART 2', desc: '직무상세내용 키워드 추출' },
          { label: 'PART 3', desc: '경험 선별 및 우선순위 판단' },
          { label: 'PART 4', desc: '한줄 소개 만들기' },
          { label: 'PART 5', desc: '경력/경험 최종 정리' },
          { label: 'PART 6', desc: '프로젝트 & 스킬 작성' },
          { label: 'PART 7', desc: '최종 점검 체크리스트' },
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
          {
            text: '정리된 본인의 경험 목록 (회사·학교·동아리·프로젝트별)',
            recommend: {
              workbookId: 'experience',
              condition: '아직 정리하지 못했다면',
              linkLabel: '경험정리 가이드 워크북',
            },
          },
        ]}
      helpModal={<FirstVisitModal open={showHelp} onClose={() => setShowHelp(false)} title='이력서 워크북 사용 안내' steps={[
          '순서대로 <strong>PART 1부터 PART 7까지</strong> 진행하세요. 각 PART의 질문에 답하면서 이력서 뼈대가 만들어집니다.',
          '작성 중 상단의 <strong>다운로드 (.docx)</strong> 버튼을 눌러 수시로 다운로드하세요. 새로고침 시 모든 내용이 삭제됩니다.',
          '마지막 PART에서 <strong>최종 다운로드</strong>하여 Word에서 자유롭게 편집하세요.',
        ]} />}
      onStart={() => { setShowIntro(false); }}
    />
  );

  // ==================== STEP CONTENT ====================
  const renderStep = () => {
    switch (currentPart) {
      // ========== PART 0: 기본 정보 ==========
      case 0:
        return (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.ink, marginBottom: 4 }}>PART 1. 기본 정보 입력</h2>
            <p style={{ fontSize: 16, color: COLORS.sub, marginBottom: 24 }}>지원할 회사와 직무, 본인의 유형을 선택하세요</p>

            <QuestionBlock id="company" label="지원 회사명" placeholder="예: 삼성전자, 카카오, 현대자동차 등" answers={answers} handleAnswer={handleAnswer} showGuide={showGuide} toggleGuide={toggleGuide} />
            <QuestionBlock id="position" label="지원 직무" placeholder="예: 기구 설계, 품질관리, 하드웨어 회로설계 등" answers={answers} handleAnswer={handleAnswer} showGuide={showGuide} toggleGuide={toggleGuide} />

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink, display: 'block', marginBottom: 12 }}>지원자 유형 (해당하는 것을 선택)</label>
              {[
                { val: '신입_경험있음', label: '신입 - 인턴/대외활동 등 직무 관련 경험 있음' },
                { val: '신입_경험부족', label: '신입 - 직무 관련 경험이 거의 없음' },
                { val: '신입_비전공', label: '신입 - 비전공자 (부트캠프/자기학습으로 전환)' },
                { val: '경력_3년이하', label: '경력직 - 3년 이하' },
                { val: '경력_3_7년', label: '경력직 - 3~7년' },
                { val: '경력_7년이상', label: '경력직 - 7년 이상 (시니어)' },
                { val: '직무전환', label: '직무 전환 (현재 직무와 다른 직무로 이동)' },
              ].map(opt => {
                const active = answers.expType === opt.val;
                const sepMatch = opt.label.match(/^(.+?)\s*[—–-]\s*(.+)$/);
                const labelText = sepMatch ? sepMatch[1].trim() : opt.label;
                const descText = sepMatch ? sepMatch[2].trim() : null;
                return (
                  <div key={opt.val} {...clickable(() => handleAnswer('expType', opt.val))}
                    style={{ padding: '16px 18px', borderRadius: RADIUS.lg, marginBottom: 8, border: `1.5px solid ${active ? COLORS.accent2 : COLORS.border}`, background: active ? COLORS.cream : COLORS.white, cursor: 'pointer', transition: 'all 150ms' }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.borderColor = `${COLORS.accent2}60`; }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.borderColor = COLORS.border; }}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: active ? COLORS.accent2 : COLORS.ink, marginBottom: descText ? 2 : 0 }}>{labelText}</div>
                    {descText && <div style={{ fontSize: 16, color: COLORS.sub }}>{descText}</div>}
                  </div>
                );
              })}
            </div>

            {answers.expType === '신입_경험부족' && (
              <WarningBox title="경험이 부족한 경우 - 솔직한 안내">
                이력서는 "내가 무엇을 할 수 있는지"를 보여주는 문서입니다. 직무 관련 경험이 없으면 적을 것이 없고, 적을 것이 없는 이력서로는 합격을 기대하기 어렵습니다. 지금 해야 할 일은 경험을 쌓는 것입니다. CareerEngineer의 "채용공고 및 직무분석 가이드"로 필요한 역량을 파악하고, 3~6개월간 개인 프로젝트/부트캠프/공모전/인턴으로 경험을 만든 후 다시 이 워크북으로 돌아오세요. 그래도 지금 시작하고 싶다면 가지고 있는 경험으로 최선을 다해 작성해보세요.
              </WarningBox>
            )}
            {isCareer && (
              <div style={{ background: COLORS.cream, border: `1px solid ${COLORS.navyMid}33`, borderLeft: `3px solid ${COLORS.navyMid}`, padding: 16, borderRadius: RADIUS.md, marginTop: 16 }}>
                <p style={{ fontSize: 16, color: COLORS.navyMid, margin: 0, lineHeight: 1.7 }}>
                  <span style={{ fontWeight: 700, color: COLORS.ink }}>경력자는 이력서 + 경력기술서를 함께 제출합니다.</span> 이력서엔 <span style={{ fontWeight: 700 }}>핵심 요약·대표 성과</span>만 한 장으로 담고, 프로젝트별 상세(BRIAR)는 <span style={{ fontWeight: 700 }}>경력기술서</span>에 작성하세요. 두 문서의 회사·기간·성과 수치는 일치시켜야 합니다.
                </p>
              </div>
            )}
          </div>
        );

      // ========== PART 1: 직무상세내용 키워드 추출 ==========
      case 1:
        return (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.ink, marginBottom: 4 }}>PART 2. 직무상세내용 키워드 추출</h2>
            <p style={{ fontSize: 16, color: COLORS.sub, marginBottom: 24 }}>채용공고(직무상세내용)를 보면서 핵심 키워드를 뽑아주세요. 이 키워드가 이력서 전체의 뼈대가 됩니다.</p>

            <TipBox>
              채용공고를 열어두고 작성하세요. "채용공고 및 직무분석 가이드"를 이미 분석했다면 그 결과를 여기에 옮겨 적으면 됩니다.
            </TipBox>

            <QuestionBlock
              id="jd_core"
              label="1. 직무상세내용에서 추출한 핵심 업무 키워드 (3~5개)"
              hint="직무상세내용의 '주요업무' 항목에서 반복되는 핵심 단어를 그대로 뽑으세요"
              placeholder="예: 기구 설계, 공차 분석, FEA 구조해석, 시작품 검증"
              rows={2}
              guide={{
                description: '직무상세내용의 "주요업무"에 나온 동사+명사 조합을 뽑습니다. "CAD를 활용한 기구 설계 및 공차 검증"이면 키워드는 "기구 설계", "공차 검증"입니다.',
                helpQuestions: [
                  '직무상세내용에서 가장 먼저 나오는 업무 3개는 무엇인가요?',
                  '여러 채용공고에서 반복되는 키워드는 무엇인가요?',
                  '이 직무가 매일 하는 일의 핵심 동사는 무엇인가요? (분석, 설계, 운영, 기획 등)'
                ],
                example: '[기구 설계] 3D 모델링, 공차 분석, 사출 금형 설계, 시작품 검증\n[품질관리] SPC, 불량 원인 분석, 파레토 분석, 협력사 품질감사\n[하드웨어 회로설계] 회로 설계, PCB 설계, 회로 시뮬레이션, 신뢰성 시험'
              }} answers={answers} handleAnswer={handleAnswer} showGuide={showGuide} toggleGuide={toggleGuide} />

            <QuestionBlock
              id="jd_tools"
              label="2. 직무상세내용에서 요구하는 도구/기술/언어"
              hint="직무상세내용의 '자격요건' 또는 '필수역량'에 나온 도구명을 그대로 옮기세요"
              placeholder="예: SolidWorks, CATIA, AutoCAD, ANSYS, GD&T"
              rows={2}
              guide={{
                description: '도구명은 직무상세내용에 나온 그대로 적습니다. "Python"이라고 나왔으면 "파이썬"이 아니라 "Python"으로. ATS가 키워드를 스캔하기 때문입니다.',
                example: '[전자설계] Altium, OrCAD, LTspice, MATLAB, 오실로스코프\n[기계설계] CATIA V5, AutoCAD, SolidWorks, GD&T\n[생산기술] Minitab, CATIA, AutoCAD, PLM, SPC'
              }} answers={answers} handleAnswer={handleAnswer} showGuide={showGuide} toggleGuide={toggleGuide} />

            <QuestionBlock
              id="jd_nice"
              label="3. 직무상세내용의 우대사항 키워드"
              hint="있으면 가산점이 되는 항목들. 내가 가진 것이 있다면 이력서에 반드시 넣어야 합니다"
              placeholder="예: 전기기사 자격증, 6시그마 벨트, 품질경영기사, 관련 인턴 경험"
              rows={2} answers={answers} handleAnswer={handleAnswer} showGuide={showGuide} toggleGuide={toggleGuide} />
          </div>
        );

      // ========== PART 2: 경험 선별 및 우선순위 ==========
      case 2:
        return (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.ink, marginBottom: 4 }}>PART 3. 경험 선별 및 우선순위 판단</h2>
            <p style={{ fontSize: 16, color: COLORS.sub, marginBottom: 24 }}>경험정리 워크북에서 정리한 경험 중 이력서에 넣을 상위 3개를 선별하고, 순서를 정합니다.</p>

            {(answers.jd_core || answers.jd_tools || answers.jd_nice) && (
              <div style={{ background: COLORS.cream, border: `1px solid ${COLORS.navyMid}33`, borderLeft: `3px solid ${COLORS.navyMid}`, padding: 16, borderRadius: RADIUS.md, marginBottom: 24 }}>
                <p style={{ fontSize: 16, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', color: COLORS.navyMid, marginBottom: 12 }}>
                  INFO · 참고: PART 2 직무상세내용 키워드
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {answers.jd_core && (
                    <div style={{ background: COLORS.paper, padding: 12, borderRadius: RADIUS.soft, fontSize: 16 }}>
                      <p style={{ fontWeight: 700, color: COLORS.ink, margin: 0, marginBottom: 4 }}>핵심 키워드</p>
                      <p style={{ color: COLORS.sub, margin: 0, fontStyle: 'italic', lineHeight: 1.6 }}>
                        {answers.jd_core.length > 200 ? answers.jd_core.substring(0,200) + '...' : answers.jd_core}
                      </p>
                    </div>
                  )}
                  {answers.jd_tools && (
                    <div style={{ background: COLORS.paper, padding: 12, borderRadius: RADIUS.soft, fontSize: 16 }}>
                      <p style={{ fontWeight: 700, color: COLORS.ink, margin: 0, marginBottom: 4 }}>도구/기술</p>
                      <p style={{ color: COLORS.sub, margin: 0, fontStyle: 'italic', lineHeight: 1.6 }}>
                        {answers.jd_tools.length > 200 ? answers.jd_tools.substring(0,200) + '...' : answers.jd_tools}
                      </p>
                    </div>
                  )}
                  {answers.jd_nice && (
                    <div style={{ background: COLORS.paper, padding: 12, borderRadius: RADIUS.soft, fontSize: 16 }}>
                      <p style={{ fontWeight: 700, color: COLORS.ink, margin: 0, marginBottom: 4 }}>우대사항</p>
                      <p style={{ color: COLORS.sub, margin: 0, fontStyle: 'italic', lineHeight: 1.6 }}>
                        {answers.jd_nice.length > 200 ? answers.jd_nice.substring(0,200) + '...' : answers.jd_nice}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <TipBox>
              경험의 우선순위 판단 기준: (1) 직무상세내용 키워드와의 매칭도 (가장 중요) &gt; (2) 성과의 구체성 (수치가 있는가) &gt; (3) 최신성 (최근 경험이 유리). 이 세 가지 기준으로 경험을 정렬하세요.
            </TipBox>

            {Array.from({length: expCount}, (_, i) => i + 1).map(n => (
              <div key={n} style={{ background: COLORS.cream, borderRadius: RADIUS.lg, padding: 20, marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <p style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink, margin: 0 }}>경험 {n} {n === 1 ? '(가장 강한 경험 = 이력서 최상단)' : n === 2 ? '(두 번째로 강한 경험)' : `(${n === 3 ? '세' : n === 4 ? '네' : n === 5 ? '다섯' : n === 6 ? '여섯' : n === 7 ? '일곱' : '여덟'} 번째 경험)`}</p>
                  {expCount > 3 && n === expCount && (
                    <button onClick={() => {
                      handleAnswer(`exp${n}_name`, '');
                      handleAnswer(`exp${n}_period`, '');
                      handleAnswer(`exp${n}_role`, '');
                      handleAnswer(`exp${n}_detail`, '');
                      handleAnswer(`exp${n}_result`, '');
                      setExpCount(c => c - 1);
                    }} style={{ background: 'transparent', border: `1px solid ${COLORS.border}`, color: COLORS.sub, padding: '4px 12px', borderRadius: RADIUS.md, fontSize: 16, cursor: 'pointer' }}>
                      이 경험 삭제
                    </button>
                  )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{ fontSize: 16, fontWeight: 700, color: COLORS.navyMid, display: 'block', marginBottom: 4 }}>활동/경험명</label>
                    <input type="text" value={answers[`exp${n}_name`] || ''} onChange={e => handleAnswer(`exp${n}_name`, e.target.value)}
                      style={{ width: '100%', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, border: `1px solid ${COLORS.border}`, borderColor: `${COLORS.border}`, borderRadius: RADIUS.md, fontSize: 16, outline: 'none' }}
                      placeholder={isCareer ? "예: OO전자 하드웨어 회로설계" : "예: OO기업 설계 인턴"} />
                  </div>
                  <div>
                    <label style={{ fontSize: 16, fontWeight: 700, color: COLORS.navyMid, display: 'block', marginBottom: 4 }}>기간</label>
                    <input type="text" value={answers[`exp${n}_period`] || ''} onChange={e => handleAnswer(`exp${n}_period`, e.target.value)}
                      style={{ width: '100%', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, border: `1px solid ${COLORS.border}`, borderColor: `${COLORS.border}`, borderRadius: RADIUS.md, fontSize: 16, outline: 'none' }}
                      placeholder={isCareer ? "예: 2020.03~2024.12" : "예: 2025.01~2025.02"} />
                  </div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 16, fontWeight: 700, color: COLORS.navyMid, display: 'block', marginBottom: 4 }}>역할/직책</label>
                  <input type="text" value={answers[`exp${n}_role`] || ''} onChange={e => handleAnswer(`exp${n}_role`, e.target.value)}
                    style={{ width: '100%', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, border: `1px solid ${COLORS.border}`, borderColor: `${COLORS.border}`, borderRadius: RADIUS.md, fontSize: 16, outline: 'none' }}
                    placeholder={isCareer ? "예: 회로설계팀 선임, 양산기술팀 파트장" : "예: 품질관리팀 인턴, 설계팀 팀원, 하드웨어 회로설계"} />
                </div>
                <QuestionBlock
                  id={`exp${n}_detail`}
                  label="수행 내용 (개조식으로 작성)"
                  hint="주어(저는) 빼기. 동사/명사로 시작. 도구/방법 포함. 한 줄에 한 항목."
                  placeholder={"예:\n- 양산 부품 불량 데이터 수집 및 원인 분석 (SPC 활용, 월 500건)\n- 불량 유형별 파레토 분석 보고서 작성, 팀 주간 미팅에서 발표"}
                  rows={4}
                  guide={{
                    description: '개조식 전환 공식: [동사/명사] + [구체적 대상] + (도구/방법) + - [정량적 성과]',
                    helpQuestions: [
                      '이 경험에서 내가 직접 손을 댄 업무는 무엇인가?',
                      '어떤 도구/방법/기술을 사용했는가?',
                      'PART 2에서 뽑은 직무상세내용 키워드 중 이 경험과 연결되는 것은?'
                    ],
                    warning: '"저는 팀 프로젝트에서 리더 역할을 맡아..." 같은 문장은 이력서가 아닙니다. 개조식이 아닌 서술형 문장이 들어가 있다면 반드시 수정하세요.',
                    example: '서술형(X): 저는 SolidWorks를 활용하여 기구 설계 업무를 수행한 경험이 있습니다.\n개조식(O): SolidWorks 기반 기구 설계 및 공차 분석 (부품 30종)'
                  }} answers={answers} handleAnswer={handleAnswer} showGuide={showGuide} toggleGuide={toggleGuide} />
                <QuestionBlock
                  id={`exp${n}_result`}
                  label="성과 (가능하면 수치로)"
                  hint="수치가 없다면: 피드백, 변화, 구체적 과정으로 대체"
                  placeholder={isCareer ? "예: 변환 효율 5%p 향상 / 불량률 0.5%→0.2% / 검증 프로세스 정립, 팀 표준으로 채택" : "예: 조립 불량률 12% 감소 / 설계 검토 의견 반영률 향상 / 검증 템플릿 제작, 이후 팀원 활용"}
                  rows={2}
                  guide={{
                    description: '성과 정량화가 어려운 직무(법무, 총무, 인사 등)는 처리 건수, 기간 단축, 오류율 감소, 프로세스 개선 등 간접 지표를 활용하세요.',
                    example: '정량화 가능: 원가 12% 절감, 조립 공차 불량률 30% 감소, 불량률 0.5%→0.2%\n정량화 어려울 때: 설계 검토 소요시간 3일→1일 단축 / 월 20건 도면 작성, 오류율 0% / 신입 교육 매뉴얼 제작, 이후 5명 활용'
                  }} answers={answers} handleAnswer={handleAnswer} showGuide={showGuide} toggleGuide={toggleGuide} />
              </div>
            ))}

            {expCount < 8 && (
              <button onClick={() => setExpCount(c => c + 1)}
                style={{ width: '100%', padding: '12px', background: 'transparent', border: `1px dashed ${COLORS.border}`, color: COLORS.navyMid, borderRadius: RADIUS.md, fontSize: 16, fontWeight: 600, cursor: 'pointer', marginBottom: 16, transition: 'all 150ms' }}
                onMouseEnter={e => e.currentTarget.style.background = COLORS.paper}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                + 경험 추가하기 (현재 {expCount}개, 최대 8개)
              </button>
            )}

            <QuestionBlock
              id="priority_reason"
              label="경험 1을 최상단에 배치한 이유"
              hint="직무상세내용과 가장 매칭되는 이유를 간단히 적어주세요. 이 판단이 이력서 구조를 결정합니다."
              placeholder="예: 직무상세내용에서 '기구 설계'와 'SolidWorks'가 가장 먼저 나오고, 경험 1에서 SolidWorks 기반 설계를 직접 수행했으므로"
              rows={2} answers={answers} handleAnswer={handleAnswer} showGuide={showGuide} toggleGuide={toggleGuide} />

            {/* 캡스톤/졸업프로젝트 작성 안내 (신입 전용) */}
            {!isCareer && (
            <div style={{ background: COLORS.cream, borderRadius: RADIUS.lg, padding: 20, marginTop: 16 }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink, marginBottom: 8 }}>캡스톤/졸업 프로젝트는 어떻게 넣나요?</p>
              <div style={{ fontSize: 16, color: COLORS.navyMid, gap: 8 }}>
                <p>위 경험 블록에 다른 경험과 동일한 형식으로 작성하되, <span style={{ fontWeight: 700, color: COLORS.ink }}>소속명에 "(캡스톤, 6개월)"처럼 형식·기간을 명시</span>하세요. 예시: 소속 = "OO대학교 캡스톤 프로젝트 (6개월, 3인 팀)"</p>
                <p><span style={{ fontWeight: 700, color: COLORS.ink }}>어필 우선순위:</span> (1) 외부 기관/기업과 협업한 경우 (2) 실제 데이터/제품을 다룬 경우 (3) 6개월 이상 진행한 경우 — 이런 경우는 인턴십·직무 경험과 동등한 비중으로 상단에 배치하세요.</p>
                <p><span style={{ fontWeight: 700, color: COLORS.navyMid }}>수업 과제 수준:</span> 기간이 짧고 가상 시나리오 기반이라면 경험 블록에 올리기보다 학력 하위에 한 줄로 언급하는 편이 깔끔합니다.</p>
              </div>
            </div>
            )}
            {/* 경력자 경험 선별 안내 (경력·직무전환 전용) */}
            {isCareer && (
            <div style={{ background: COLORS.cream, borderRadius: RADIUS.lg, padding: 20, marginTop: 16 }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink, marginBottom: 8 }}>경력자는 어떤 경험을 어떻게 선별하나요?</p>
              <div style={{ fontSize: 16, color: COLORS.navyMid, lineHeight: 1.7 }}>
                <p style={{ marginBottom: 10 }}>학교 경험이 아니라 <span style={{ fontWeight: 700, color: COLORS.ink }}>회사 프로젝트·업무 단위</span>로 선별하세요. 핵심은 <span style={{ fontWeight: 700, color: COLORS.ink }}>팀 성과가 아닌 "본인 기여"를 숫자로</span> 보여주는 것입니다. 지원 직무 키워드와 가장 가까운 것부터 상단에 배치하고, 직무와 먼 경험은 과감히 줄이세요.</p>
                <div style={{ background: COLORS.paper, border: `1px solid ${COLORS.accent2}33`, borderRadius: RADIUS.md, padding: 14 }}>
                  <p style={{ fontWeight: 700, color: COLORS.ink, margin: 0, marginBottom: 6 }}>이직 지원자 작성 예시 — 7년차 기구설계 → 전동화 부품 이직</p>
                  <p style={{ margin: 0 }}><span style={{ fontWeight: 700, color: COLORS.navyMid }}>(1순위)</span> 전동화 부품 신규 모델 기구 설계 — 사출 공차 재설계로 <span style={{ fontWeight: 700 }}>양산 불량률 3.1%→0.8% (개발 6개월)</span> · 지원 직무 키워드 직결</p>
                  <p style={{ margin: '4px 0 0' }}><span style={{ fontWeight: 700, color: COLORS.navyMid }}>(2순위)</span> 원가절감 TF 리드 — 부품 통합 설계로 <span style={{ fontWeight: 700 }}>모델당 재료비 12% 절감</span></p>
                  <p style={{ margin: '4px 0 0' }}><span style={{ fontWeight: 700, color: COLORS.navyMid }}>(3순위)</span> 후배 2명 설계검증 코칭 — <span style={{ fontWeight: 700 }}>도면 오류 반려율 절반으로 감소</span></p>
                  <p style={{ margin: '8px 0 0', color: COLORS.sub }}>→ 각 항목에 숫자 1개 이상, "팀이" 대신 "내가 ~해서 ~결과"로.</p>
                </div>
              </div>
            </div>
            )}
          </div>
        );

      // ========== PART 3: 한줄 소개 만들기 ==========
      case 3:
        return (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.ink, marginBottom: 4 }}>PART 4. 한줄 소개 만들기</h2>
            <p style={{ fontSize: 16, color: COLORS.sub, marginBottom: 24 }}>채용담당자가 이력서에서 가장 먼저 보는 곳입니다. 단계별로 따라가면 완성됩니다.</p>

            {isCareer && (
              <div style={{ background: COLORS.cream, border: `1px solid ${COLORS.accent2}33`, borderLeft: `3px solid ${COLORS.accent2}`, padding: 16, borderRadius: RADIUS.md, marginBottom: 24 }}>
                <p style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink, margin: 0, marginBottom: 6 }}>경력자 한줄 소개 공식</p>
                <p style={{ fontSize: 16, color: COLORS.navyMid, margin: 0, marginBottom: 8, lineHeight: 1.7 }}>
                  <span style={{ fontWeight: 700 }}>[직무] [총 연수] · [대표 성과 수치] · [관리/리드 규모]</span> 순으로, 추상 표현 없이 숫자로 압축하세요.
                </p>
                <p style={{ fontSize: 16, color: COLORS.sub, margin: 0, lineHeight: 1.7, background: COLORS.paper, borderRadius: RADIUS.soft, padding: 12 }}>
                  예: "자동차 부품 기구설계 8년 · 양산 불량률 3.1%→0.8%(74%↓)·재료비 12% 절감 · 3인 설계검증 리드"
                </p>
              </div>
            )}

            {(() => {
              const expNames = Array.from({length: expCount}, (_, i) => answers[`exp${i+1}_name`]).filter(Boolean);
              if (!answers.jd_core && expNames.length === 0) return null;
              return (
                <div style={{ background: COLORS.cream, border: `1px solid ${COLORS.navyMid}33`, borderLeft: `3px solid ${COLORS.navyMid}`, padding: 16, borderRadius: RADIUS.md, marginBottom: 24 }}>
                  <p style={{ fontSize: 16, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', color: COLORS.navyMid, marginBottom: 12 }}>
                    INFO · 참고: PART 2 키워드 + PART 3 선별 경험
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {answers.jd_core && (
                      <div style={{ background: COLORS.paper, padding: 12, borderRadius: RADIUS.soft, fontSize: 16 }}>
                        <p style={{ fontWeight: 700, color: COLORS.ink, margin: 0, marginBottom: 4 }}>핵심 키워드 (PART 2)</p>
                        <p style={{ color: COLORS.sub, margin: 0, fontStyle: 'italic', lineHeight: 1.6 }}>
                          {answers.jd_core.length > 200 ? answers.jd_core.substring(0,200) + '...' : answers.jd_core}
                        </p>
                      </div>
                    )}
                    {expNames.length > 0 && (
                      <div style={{ background: COLORS.paper, padding: 12, borderRadius: RADIUS.soft, fontSize: 16 }}>
                        <p style={{ fontWeight: 700, color: COLORS.ink, margin: 0, marginBottom: 4 }}>선별 경험 (PART 3)</p>
                        <p style={{ color: COLORS.sub, margin: 0, fontStyle: 'italic', lineHeight: 1.6 }}>
                          {expNames.join(' / ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            <WarningBox title="절대 쓰지 말아야 할 표현">
              "열정적이고 성실한 지원자", "무엇이든 빠르게 배우는 인재", "다양한 경험을 통해 성장" -- 이런 표현은 누구나 쓸 수 있어서 아무도 기억하지 않습니다. 한줄 소개에는 반드시 구체적인 경험/스킬/성과가 들어가야 합니다.
            </WarningBox>

            <div style={{ background: COLORS.cream, border: `1px solid ${COLORS.navyMid}33`, color: COLORS.ink, padding: 16, borderRadius: RADIUS.md, marginBottom: 16 }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink, marginBottom: 12 }}>한줄 소개 만드는 4단계 프로세스</p>
              <div style={{ gap: 8, fontSize: 16, color: COLORS.ink }}>
                <p><span style={{ fontWeight: 700 }}>1단계:</span> PART 2에서 뽑은 직무상세내용 핵심 키워드를 다시 보세요</p>
                <p><span style={{ fontWeight: 700 }}>2단계:</span> 내 경험 중 직무상세내용과 가장 매칭되는 키워드 3개를 뽑으세요</p>
                <p><span style={{ fontWeight: 700 }}>3단계:</span> [핵심역량/경험] + [도구/방법] + [대표 성과] 순서로 조합하세요</p>
                <p><span style={{ fontWeight: 700 }}>4단계:</span> 2줄 이내로 다듬으세요</p>
              </div>
            </div>

            <QuestionBlock
              id="oneline_kw"
              label="2단계: 내 경험에서 뽑은 핵심 키워드 3개"
              hint="직무상세내용 키워드와 매칭되는 것만 뽑으세요. 직무상세내용에 없는 키워드는 의미가 없습니다."
              placeholder="예: 기구 설계, 공차 분석, FEA 구조해석"
              rows={2}
              guide={{
                description: 'PART 2의 직무상세내용 핵심 키워드를 왼쪽에, 내 경험 키워드를 오른쪽에 놓고 겹치는 것을 찾으세요. 겹치는 것이 없다면 내 경험을 직무상세내용 용어로 "번역"해야 합니다.',
                example: '직무상세내용: 공차 분석 / 내 경험: SolidWorks로 조립 공차 검증 → 매칭됨\n직무상세내용: 구조 해석 / 내 경험: 재료역학 과제 수행 → 부분 매칭 (약한 연결)\n직무상세내용: FEA 해석 / 내 경험: 없음 → 매칭 안 됨 (한줄 소개에서 제외)'
              }} answers={answers} handleAnswer={handleAnswer} showGuide={showGuide} toggleGuide={toggleGuide} />

            <QuestionBlock
              id="oneline_draft"
              label="3단계: 한줄 소개 초안"
              hint="[핵심역량/경험] + [도구/방법] + [대표 성과] 순서로 조합"
              placeholder="예: SolidWorks 기반 기구 설계 3건, 공차 분석 및 방열 구조 개선 경험"
              rows={3}
              guide={{
                description: '공식: [직무 관련 핵심 경험/역량] + [도구/기술] + [대표 성과 1~2개]',
                example: '[신입 전자설계] 전자회로 설계 인턴 경험, 회로 시뮬레이션 기반 전원 회로 설계 및 발열 10℃ 저감, LTspice 활용 가능\n[신입 기계설계] CATIA V5 기반 자동차 부품 설계 경험(캡스톤), APQP 프로세스 이해, GD&T 공차 분석 가능\n[경력 3년] 전력 회로 설계 3년, DC-DC 컨버터 재설계 및 변환 효율 5%p 향상, Altium/회로 시뮬레이션 활용 가능\n[비전공 개발] 부트캠프 수료, Java/Spring Boot 기반 REST API 개발, 팀 프로젝트 3건 (GitHub 공개)\n[직무전환] 대학병원 간호사 3년, 임상 데이터 수집/프로토콜 관리 경험 기반 CRA 직무 전환'
              }} answers={answers} handleAnswer={handleAnswer} showGuide={showGuide} toggleGuide={toggleGuide} />

            <QuestionBlock
              id="oneline_final"
              label="4단계: 한줄 소개 최종본 (2줄 이내로 다듬기)"
              hint="불필요한 수식어 빼기, 직무상세내용 키워드 우선 배치, 읽어서 7초 안에 '이 사람이 뭘 할 수 있는지' 파악되는지 확인"
              placeholder="최종본을 여기에 작성하세요"
              rows={3} answers={answers} handleAnswer={handleAnswer} showGuide={showGuide} toggleGuide={toggleGuide} />
          </div>
        );

      // ========== PART 4: 경력/경험 개조식 작성 (경력직 추가) ==========
      case 4:
        return (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.ink, marginBottom: 4 }}>PART 5. 경력/경험 최종 정리</h2>
            <p style={{ fontSize: 16, color: COLORS.sub, marginBottom: 24 }}>PART 3에서 선별한 경험을 이력서 형태로 최종 정리합니다.</p>

            <div style={{ background: COLORS.cream, border: `1px solid ${COLORS.navyMid}33`, borderLeft: `3px solid ${COLORS.navyMid}`, padding: 16, borderRadius: RADIUS.md, marginBottom: 24 }}>
              <p style={{ fontSize: 16, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', color: COLORS.navyMid, marginBottom: 12 }}>
                EDIT · PART 3 경험 직접 수정
              </p>
              <p style={{ fontSize: 16, color: COLORS.sub, marginBottom: 16 }}>아래에서 PART 3에 작성한 경험을 바로 다듬으세요. 수정한 내용은 PART 3에도 자동으로 반영됩니다.</p>
              {Array.from({length: expCount}, (_, i) => i + 1).map(n => (
                answers[`exp${n}_name`] && (
                  <div key={n} style={{ background: COLORS.paper, padding: 14, borderRadius: RADIUS.md, fontSize: 16, marginBottom: 12 }}>
                    <p style={{ fontWeight: 700, color: COLORS.ink, margin: 0, marginBottom: 8 }}>경험 {n}: {answers[`exp${n}_name`]} {answers[`exp${n}_period`] ? `| ${answers[`exp${n}_period`]}` : ''} {answers[`exp${n}_role`] ? `| ${answers[`exp${n}_role`]}` : ''}</p>
                    <div style={{ marginBottom: 8 }}>
                      <label style={{ fontSize: 16, fontWeight: 600, color: COLORS.navyMid, display: 'block', marginBottom: 4 }}>수행 내용 (개조식)</label>
                      <textarea value={answers[`exp${n}_detail`] || ''} onChange={e => handleAnswer(`exp${n}_detail`, e.target.value)}
                        rows={4}
                        className="resize-none"
                        style={{ width: '100%', padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.md, fontSize: 15, outline: 'none', background: COLORS.white }}
                        placeholder="예: - 양산 부품 불량 데이터 수집 및 원인 분석" />
                    </div>
                    <div>
                      <label style={{ fontSize: 16, fontWeight: 600, color: COLORS.navyMid, display: 'block', marginBottom: 4 }}>성과</label>
                      <textarea value={answers[`exp${n}_result`] || ''} onChange={e => handleAnswer(`exp${n}_result`, e.target.value)}
                        rows={2}
                        className="resize-none"
                        style={{ width: '100%', padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.md, fontSize: 15, outline: 'none', background: COLORS.white }}
                        placeholder="예: 조립 불량률 12% 감소" />
                    </div>
                  </div>
                )
              ))}
              {!Array.from({length: expCount}, (_, i) => i + 1).some(n => answers[`exp${n}_name`]) && (
                <p style={{ fontSize: 16, color: COLORS.sub, fontStyle: 'italic' }}>PART 3에서 경험을 먼저 작성해주세요.</p>
              )}
            </div>

            {(answers.expType === '경력_3_7년' || answers.expType === '경력_7년이상' || answers.expType === '경력_3년이하' || answers.expType === '직무전환') && (
              <div style={{ background: COLORS.cream, border: `1px solid ${COLORS.navyMid}33`, color: COLORS.ink, padding: 16, borderRadius: RADIUS.md, marginBottom: 16 }}>
                <p style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink, marginBottom: 12 }}>경력직/이직자 추가 체크</p>
                <QuestionBlock
                  id="career_depth"
                  label="경력 깊이 조절: 각 경력의 비중을 어떻게 배분할 계획인가요?"
                  hint="최근 경력 50~60%, 중간 경력 25~30%, 초기 경력 10~15% 비중 권장"
                  placeholder="예: 현 직장(2023~현재) 상세 3~5개 성과 / 전 직장(2020~2023) 핵심 성과 2개 요약 / 첫 직장(2018~2020) 회사명, 직책, 기간만"
                  rows={3}
                  guide={{
                    description: '채용담당자는 최근 경력에 가장 관심이 많습니다. 10년 전 경험을 상세하게 쓸 필요는 없습니다. 단, 이전 경력이 지원 직무와 직접 연관되면 상세하게 써도 됩니다.',
                    example: '[12년차 예시]\n현 직장 ABC제조 (2021~현재) 팀장: 성과 5개 상세 → 이력서의 60%\n전 직장 DEF전자 (2017~2021) 선임: 핵심 성과 2개 → 이력서의 30%\n첫 직장 GHI (2014~2017) 사원: 회사명, 직책, 기간만 → 이력서의 10%'
                  }} answers={answers} handleAnswer={handleAnswer} showGuide={showGuide} toggleGuide={toggleGuide} />
                <QuestionBlock
                  id="career_gap"
                  label="경력 공백이 있다면: 어떻게 표기할 계획인가요?"
                  hint="공백을 숨기지 말고 간결하게 설명하세요. 공백 중 자기개발 내용이 있으면 함께 기재"
                  placeholder="해당 없으면 비워두세요. 예: 육아휴직 (2023.01~2024.06) - 휴직 중 직무 관련 온라인 교육 3건 수료"
                  rows={2}
                  guide={{
                    example: '육아휴직: 육아휴직 (2023.01~2024.06) - 휴직 기간 중 직무 관련 온라인 교육 수료 (3건)\n학업복귀: 대학원 진학 (2022.03~2024.02) - OO 전공 석사, 연구 주제: OOO\n자발적 휴식: 기간만 표기하고 면접에서 간결히 설명. 이력서에 사유를 상세히 쓰지 않아도 됨'
                  }} answers={answers} handleAnswer={handleAnswer} showGuide={showGuide} toggleGuide={toggleGuide} />
              </div>
            )}

            {answers.expType === '직무전환' && (
              <div style={{ background: COLORS.paper, border: `1px solid ${COLORS.accent2}33`, color: COLORS.ink, padding: 16, borderRadius: RADIUS.md, marginBottom: 16 }}>
                <p style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink, marginBottom: 12 }}>직무 전환자를 위한 경험 번역 가이드</p>
                <p style={{ fontSize: 16, color: COLORS.ink, marginBottom: 12 }}>현재 직무의 경험을 지원 직무의 언어로 바꿔야 합니다. 아래 공식을 활용하세요:</p>
                <div style={{ background: COLORS.white, borderRadius: RADIUS.md, padding: 12, fontSize: 16, color: COLORS.navyMid, gap: 8 }}>
                  <p><span style={{ fontWeight: 700 }}>[현재 경험]</span> → <span style={{ fontWeight: 700, color: COLORS.ink }}>[지원 직무에서의 의미]</span></p>
                  <p>예: 환자 활력징후 모니터링 → 임상 데이터 수집/관리 역량</p>
                  <p>예: 투약 프로토콜 준수 → GCP 기반 프로토콜 관리 경험</p>
                  <p>예: 영업 고객 미팅 → 이해관계자 커뮤니케이션 및 니즈 분석</p>
                  <p>예: 제조 현장 공정 관리 → 프로세스 최적화 및 데이터 기반 의사결정</p>
                </div>
              </div>
            )}

            <TipBox>
              PART 3에서 작성한 내용을 다시 읽어보세요. 서술형 문장이 남아있다면 개조식으로 전환하세요. "저는", "본인은" 같은 주어가 있다면 삭제하세요. 모든 항목에 도구/방법/수치가 포함되어 있는지 확인하세요.
            </TipBox>

            <p style={{ fontSize: 16, color: COLORS.navyMid, marginBottom: 16 }}>위에서 직접 수정한 경험이 이력서 최종 형태로 들어갑니다. 아래 예시 형태와 비교하며 마지막으로 다듬으세요.</p>

            <div className="font-mono whitespace-pre-line" style={{ background: COLORS.cream, borderRadius: RADIUS.lg, padding: 16, marginBottom: 16, fontSize: 16, color: COLORS.navyMid }}>
              {'[이력서 형태 예시]\n\n현대모비스 인턴 | 2025.01~2025.02 | 품질관리팀\n- 양산 부품 불량 데이터 수집 및 원인 분석 (SPC 활용, 월 500건)\n- 불량 유형별 파레토 분석 보고서 작성, 팀 주간 미팅에서 발표\n- 협력사 출하 검사 기준서 개정 보조 (3건)'}
            </div>

            <p style={{ fontSize: 16, color: COLORS.sub, marginBottom: 8 }}>위 \"EDIT · PART 3 경험 직접 수정\" 영역에서 바로 다듬을 수 있습니다. 변경사항은 자동으로 PART 3과 최종 출력에도 반영됩니다.</p>
          </div>
        );

      // ========== PART 5: 프로젝트 & 스킬 ==========
      case 5:
        return (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.ink, marginBottom: 4 }}>PART 6. 프로젝트 & 스킬 작성</h2>
            <p style={{ fontSize: 16, color: COLORS.sub, marginBottom: 24 }}>경력/경험 외에 별도로 기재할 프로젝트, 자격증/스킬, 추가 교육을 정리합니다.</p>

            {Array.from({length: projCount}, (_, i) => i + 1).map(p => (
              <div key={p} style={{ background: COLORS.cream, border: `1px solid ${COLORS.navyMid}33`, color: COLORS.ink, padding: 16, borderRadius: RADIUS.md, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <p style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink, margin: 0 }}>프로젝트 {p} {p === 1 ? '(실무적 성격의 프로젝트)' : ''}</p>
                  {projCount > 1 && p === projCount && (
                    <button onClick={() => {
                      handleAnswer(`proj${p}_name`, '');
                      handleAnswer(`proj${p}_period`, '');
                      handleAnswer(`proj${p}_org`, '');
                      handleAnswer(`proj${p}_detail`, '');
                      handleAnswer(`proj${p}_role`, '');
                      setProjCount(c => c - 1);
                    }} style={{ background: 'transparent', border: `1px solid ${COLORS.border}`, color: COLORS.sub, padding: '4px 12px', borderRadius: RADIUS.md, fontSize: 16, cursor: 'pointer' }}>
                      이 프로젝트 삭제
                    </button>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{ fontSize: 16, fontWeight: 700, color: COLORS.navyMid, display: 'block', marginBottom: 4 }}>프로젝트명</label>
                    <input type="text" value={answers[`proj${p}_name`] || ''} onChange={e => handleAnswer(`proj${p}_name`, e.target.value)}
                      style={{ width: '100%', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, border: `1px solid ${COLORS.border}`, borderColor: `${COLORS.border}`, borderRadius: RADIUS.md, fontSize: 16, outline: 'none' }}
                      placeholder="예: 드론 프레임 경량화 설계" />
                  </div>
                  <div>
                    <label style={{ fontSize: 16, fontWeight: 700, color: COLORS.navyMid, display: 'block', marginBottom: 4 }}>기간</label>
                    <input type="text" value={answers[`proj${p}_period`] || ''} onChange={e => handleAnswer(`proj${p}_period`, e.target.value)}
                      style={{ width: '100%', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, border: `1px solid ${COLORS.border}`, borderColor: `${COLORS.border}`, borderRadius: RADIUS.md, fontSize: 16, outline: 'none' }}
                      placeholder="예: 2024.09~2024.12" />
                  </div>
                  <div>
                    <label style={{ fontSize: 16, fontWeight: 700, color: COLORS.navyMid, display: 'block', marginBottom: 4 }}>소속/출처</label>
                    <input type="text" value={answers[`proj${p}_org`] || ''} onChange={e => handleAnswer(`proj${p}_org`, e.target.value)}
                      style={{ width: '100%', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, border: `1px solid ${COLORS.border}`, borderColor: `${COLORS.border}`, borderRadius: RADIUS.md, fontSize: 16, outline: 'none' }}
                      placeholder={isCareer ? "예: 사내 양산 프로젝트 / 신규 모델 개발 / 개인 사이드 프로젝트" : "예: ABC전자 인턴 / 개인 프로젝트 / 캡스톤"} />
                  </div>
                </div>

                <QuestionBlock
                  id={`proj${p}_detail`}
                  label="수행 내용 (개조식)"
                  placeholder={"예:\n- 드론 프레임 3D 모델링 및 FEA 구조해석 (SolidWorks, ANSYS)\n- 토폴로지 최적화 기반 경량화 설계 (무게 18% 절감, 강성 유지)\n- 본인 역할: 모델링, 구조해석, 결과 보고서 작성"}
                  rows={5}
                  guide={p === 1 ? {
                    description: '팀 프로젝트인 경우 반드시 "본인 역할"을 명시하세요. 면접에서 이 부분을 기반으로 질문이 나옵니다.',
                    example: '[개인 프로젝트 예시]\n전동 킥보드 거치대 설계 개인 프로젝트 | 2024.06~2024.08 | 개인\n- SolidWorks 기반 3D 모델링 및 사출 성형성 검토\n- 공차 분석으로 조립 간섭 제거, 3D 프린팅 시작품 검증 완료\n\n[캡스톤 프로젝트 예시]\n팀 프로젝트: 소형 풍력 발전기 | 2024.09~2024.11 | OO대학교 캡스톤\n- 블레이드 형상 설계 및 FEA 구조해석 (CATIA, ANSYS)\n- 발전 효율 시험 및 진동 저감 구조 개선\n- 본인 역할: 블레이드 설계 전체, 구조해석'
                  } : null}
                  answers={answers} handleAnswer={handleAnswer} showGuide={showGuide} toggleGuide={toggleGuide} />

                <QuestionBlock
                  id={`proj${p}_role`}
                  label="본인 역할 (팀 프로젝트인 경우)"
                  placeholder="예: 3D 모델링 및 구조해석 담당, 최종 보고서 작성"
                  rows={2} answers={answers} handleAnswer={handleAnswer} showGuide={showGuide} toggleGuide={toggleGuide} />
              </div>
            ))}

            {projCount < 5 && (
              <button onClick={() => setProjCount(c => c + 1)}
                style={{ width: '100%', padding: '12px', background: 'transparent', border: `1px dashed ${COLORS.border}`, color: COLORS.navyMid, borderRadius: RADIUS.md, fontSize: 16, fontWeight: 600, cursor: 'pointer', marginBottom: 16, transition: 'all 150ms' }}
                onMouseEnter={e => e.currentTarget.style.background = COLORS.paper}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                + 프로젝트 추가하기 (현재 {projCount}개, 최대 5개)
              </button>
            )}

            <QuestionBlock
              id="skills"
              label="직무 관련 자격증 & 스킬"
              hint="직무상세내용에 나온 도구/자격증 중 내가 가진 것만. 직무 연관도 높은 순서로 배치."
              placeholder={"예:\n자격증: 품질경영기사, 전기기사, 6시그마 GB\n스킬: SolidWorks | CATIA V5 | AutoCAD | ANSYS | GD&T\n\n(IT 직무) 기술 스택: Java | Spring Boot | MySQL | AWS EC2 | Docker | Git"}
              rows={4}
              guide={{
                description: '직무와 무관한 자격증(운전면허, 한자능력검정 등)은 절대 넣지 마세요. 기초 수준의 범용 도구(한글, 파워포인트)도 넣지 마세요. 직무상세내용에 명시된 것만 넣으세요.',
                warning: 'IT 직무는 기술 스택을 별도로 정리하세요. [언어 | 프레임워크 | DB | 인프라 | 도구] 순서가 일반적입니다.'
              }} answers={answers} handleAnswer={handleAnswer} showGuide={showGuide} toggleGuide={toggleGuide} />

            <QuestionBlock
              id="edu_extra"
              label="추가 교육 / 부트캠프 (해당자만)"
              hint="비전공자, 직무 전환자는 여기가 중요합니다. 수료 여부와 주요 학습 내용을 적어주세요."
              placeholder={"해당 없으면 비워두세요.\n예: 유한요소해석(FEA) 실무 교육 수료 (40시간, 2024.07) - ANSYS 기반 구조·열 해석 실습\n예: 6시그마 그린벨트 과정 수료 (2024.03~2024.05) - 공정 데이터 통계 분석/DOE 프로젝트 1건"}
              rows={3}
              guide={{
                description: '부트캠프/온라인 교육은 "자격증/스킬" 항목 또는 별도 "교육" 항목에 넣습니다. 학력 항목에 넣지 마세요. 수료증이 있으면 함께 표기하세요.',
                example: '[교육 항목 표기 예시]\n유한요소해석(FEA) 실무 과정 | 2024.03~2024.05 | 수료\n- ANSYS Mechanical 기반 구조·열 해석 40시간 과정\n- 캡스톤 부품 해석 프로젝트 1건 수행\n\n6시그마 그린벨트 | 2024.07 | 취득\n- 공정 데이터 통계 분석, DOE(실험계획법) 실습'
              }} answers={answers} handleAnswer={handleAnswer} showGuide={showGuide} toggleGuide={toggleGuide} />
          </div>
        );

      // ========== PART 6: 최종 점검 ==========
      case 6: {
        const baseCheckItems = [
          { id: 'c1', text: '회사 지정 양식/파일형식/파일명 규칙을 확인했는가?', action: '채용 공고 재확인' },
          { id: 'c2', text: '이력서에 서술형(문장) 표현이 남아있지 않은가?', action: '개조식으로 전환' },
          { id: 'c3', text: '지원 회사명/직무명이 정확한가? (다른 회사 이름 복붙 실수)', action: '전체 검색으로 확인' },
          { id: 'c4', text: '직무상세내용 키워드가 이력서에 자연스럽게 들어가 있는가?', action: 'PART 2의 키워드와 대조' },
          { id: 'c5', text: '직무와 무관한 자격증/경험/스킬이 들어가 있지 않은가?', action: '관련 없는 항목 삭제' },
          { id: 'c6', text: '수행 내용에 도구/방법/수치가 포함되어 있는가?', action: '"참여" 같은 막연한 표현 구체화' },
          { id: 'c7', text: '한줄 소개가 7초 안에 "이 사람이 뭘 할 수 있는지" 전달하는가?', action: 'STEP 4 재확인' },
          { id: 'c8', text: '같은 경험이 자소서와 일관되게 기술되어 있는가?', action: '자소서와 대조' },
          { id: 'c9', text: '오탈자가 없는가?', action: '소리 내어 읽기 또는 제3자 검토' },
          { id: 'c10', text: 'PDF 변환 후 레이아웃이 깨지지 않는가?', action: 'PDF로 변환해서 확인' },
          { id: 'c11', text: '파일명이 적절한가? (이름_직무_이력서.pdf)', action: '파일명 변경' },
          { id: 'c12', text: '기밀 사항(고객사명, 계약 금액 등)이 포함되지 않았는가?', action: '"A사 대상" 등으로 대체' },
        ];
        // 경력/직무전환 전용 점검 항목
        const careerCheckItems = [
          { id: 'cc1', text: '각 성과가 "팀 성과"가 아니라 "본인 기여"로 분리돼 있는가?', action: '"우리 팀이" → "내가 ~해서 ~결과"로 수정' },
          { id: 'cc2', text: '핵심 경력마다 정량 지표(%·원·개월·건)가 1개 이상 있는가?', action: 'Before→After 수치 보강' },
          { id: 'cc3', text: '경력 공백이 있다면 한 줄로 설명할 준비가 됐는가?', action: '공백 기간·사유 정리 (경력기술서와 일치)' },
          { id: 'cc4', text: '이력서와 경력기술서의 회사·기간·성과 수치가 일치하는가?', action: '두 문서 교차 확인' },
        ];
        // 신입 전용 점검 항목
        const gradCheckItems = [
          { id: 'cg1', text: '직무 관련 경험을 상단에, 무관한 경험은 정리했는가?', action: '직무 키워드 기준으로 재배치' },
          { id: 'cg2', text: '경험에 "성장 가능성·학습력"이 드러나는가?', action: '결과 + 배운 점 한 줄 추가' },
          { id: 'cg3', text: '캡스톤·인턴 경험을 직무 언어로 번역했는가?', action: '"수업 과제" 말투 → 직무 성과 말투' },
        ];
        const checkItems = [...baseCheckItems, ...(isCareer ? careerCheckItems : gradCheckItems)];
        const checkedCount = checkItems.filter(c => checks[c.id]).length;

        return (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.ink, marginBottom: 4 }}>PART 7. 최종 점검 체크리스트</h2>
            <p style={{ fontSize: 16, color: COLORS.sub, marginBottom: 24 }}>제출 전 아래 항목을 하나씩 점검하세요. ({checkedCount}/{checkItems.length} 완료)</p>

            {/* 지금까지 작성한 내용 — PART 1~6 전체 미리보기 */}
            <div style={{ background: COLORS.cream, border: `1px solid ${COLORS.navyMid}33`, borderLeft: `3px solid ${COLORS.navyMid}`, padding: 16, borderRadius: RADIUS.md, marginBottom: 24 }}>
              <p style={{ fontSize: 16, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', color: COLORS.navyMid, marginBottom: 4 }}>
                INFO · 지금까지 작성한 내용 (PART 1~6)
              </p>
              <p style={{ fontSize: 16, color: COLORS.sub, margin: '0 0 12px 0' }}>아래 내용이 .docx 파일로 출력됩니다. 누락된 항목이 있으면 이전 PART로 돌아가서 작성하세요.</p>

              {/* 기본 정보 */}
              {(answers.company || answers.position || answers.expType) && (
                <div style={{ marginBottom: 12 }}>
                  <p style={{ fontWeight: 700, color: COLORS.ink, margin: 0, marginBottom: 4, fontSize: 16 }}>기본 정보 (PART 1)</p>
                  <div style={{ fontSize: 16, color: COLORS.navyMid, background: COLORS.paper, borderRadius: RADIUS.md, padding: 10, lineHeight: 1.7 }}>
                    {answers.company && <div><strong>회사:</strong> {answers.company}</div>}
                    {answers.position && <div><strong>직무:</strong> {answers.position}</div>}
                    {answers.expType && <div><strong>지원자 유형:</strong> {answers.expType}</div>}
                  </div>
                </div>
              )}

              {/* 직무상세내용 분석 */}
              {(answers.jd_core || answers.jd_tools || answers.jd_nice) && (
                <div style={{ marginBottom: 12 }}>
                  <p style={{ fontWeight: 700, color: COLORS.ink, margin: 0, marginBottom: 4, fontSize: 16 }}>직무상세내용 분석 (PART 2)</p>
                  <div style={{ fontSize: 16, color: COLORS.navyMid, background: COLORS.paper, borderRadius: RADIUS.md, padding: 10, lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                    {answers.jd_core && <div style={{ marginBottom: 4 }}><strong>핵심 키워드:</strong>{'\n'}{answers.jd_core}</div>}
                    {answers.jd_tools && <div style={{ marginBottom: 4 }}><strong>도구·스킬:</strong>{'\n'}{answers.jd_tools}</div>}
                    {answers.jd_nice && <div><strong>우대 사항:</strong>{'\n'}{answers.jd_nice}</div>}
                  </div>
                </div>
              )}

              {/* 경력 / 경험 */}
              {Array.from({length: expCount}, (_, i) => i + 1).some(n => answers[`exp${n}_name`]) && (
                <div style={{ marginBottom: 12 }}>
                  <p style={{ fontWeight: 700, color: COLORS.ink, margin: 0, marginBottom: 4, fontSize: 16 }}>경력 / 경험 (PART 3)</p>
                  {Array.from({length: expCount}, (_, i) => i + 1).map(n => answers[`exp${n}_name`] && (
                    <div key={n} style={{ fontSize: 16, color: COLORS.navyMid, background: COLORS.paper, borderRadius: RADIUS.md, padding: 10, marginBottom: 6, lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                      <strong>경험 {n}: {answers[`exp${n}_name`]}</strong>
                      {answers[`exp${n}_period`] || answers[`exp${n}_role`] ? (
                        <div style={{ fontSize: 13, color: COLORS.sub }}>{[answers[`exp${n}_period`], answers[`exp${n}_role`]].filter(Boolean).join(' | ')}</div>
                      ) : null}
                      {answers[`exp${n}_detail`] && <div style={{ marginTop: 4 }}>{answers[`exp${n}_detail`]}</div>}
                      {answers[`exp${n}_result`] && <div style={{ marginTop: 4 }}><strong>성과:</strong> {answers[`exp${n}_result`]}</div>}
                    </div>
                  ))}
                </div>
              )}

              {/* 한줄 소개 */}
              {answers.oneline_final && (
                <div style={{ marginBottom: 12 }}>
                  <p style={{ fontWeight: 700, color: COLORS.ink, margin: 0, marginBottom: 4, fontSize: 16 }}>한줄 소개 (PART 4)</p>
                  <p style={{ fontSize: 16, color: COLORS.ink, background: COLORS.paper, borderRadius: RADIUS.md, padding: 10, margin: 0, whiteSpace: 'pre-line', lineHeight: 1.7 }}>{answers.oneline_final}</p>
                </div>
              )}

              {/* 경력직 추가 정보 */}
              {(answers.career_depth || answers.career_gap) && (
                <div style={{ marginBottom: 12 }}>
                  <p style={{ fontWeight: 700, color: COLORS.ink, margin: 0, marginBottom: 4, fontSize: 16 }}>경력직 추가 정보 (PART 5)</p>
                  <div style={{ fontSize: 16, color: COLORS.navyMid, background: COLORS.paper, borderRadius: RADIUS.md, padding: 10, lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                    {answers.career_depth && <div style={{ marginBottom: 4 }}><strong>경력 깊이:</strong>{'\n'}{answers.career_depth}</div>}
                    {answers.career_gap && <div><strong>경력 공백:</strong>{'\n'}{answers.career_gap}</div>}
                  </div>
                </div>
              )}

              {/* 프로젝트 */}
              {(Array.from({length: projCount}, (_, i) => i + 1).some(p => answers[`proj${p}_name`]) || answers.proj_name) && (
                <div style={{ marginBottom: 12 }}>
                  <p style={{ fontWeight: 700, color: COLORS.ink, margin: 0, marginBottom: 4, fontSize: 16 }}>프로젝트 (PART 6)</p>
                  {Array.from({length: projCount}, (_, i) => i + 1).map(p => answers[`proj${p}_name`] && (
                    <div key={p} style={{ fontSize: 16, color: COLORS.navyMid, background: COLORS.paper, borderRadius: RADIUS.md, padding: 10, marginBottom: 6, lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                      <strong>프로젝트 {p}: {answers[`proj${p}_name`]}</strong>
                      {answers[`proj${p}_period`] || answers[`proj${p}_org`] ? (
                        <div style={{ fontSize: 13, color: COLORS.sub }}>{[answers[`proj${p}_period`], answers[`proj${p}_org`]].filter(Boolean).join(' | ')}</div>
                      ) : null}
                      {answers[`proj${p}_role`] && <div style={{ marginTop: 4 }}><strong>본인 역할:</strong> {answers[`proj${p}_role`]}</div>}
                      {answers[`proj${p}_detail`] && <div style={{ marginTop: 4 }}>{answers[`proj${p}_detail`]}</div>}
                    </div>
                  ))}
                  {/* 옛 단일 키 호환 */}
                  {answers.proj_name && !answers.proj1_name && (
                    <div style={{ fontSize: 16, color: COLORS.navyMid, background: COLORS.paper, borderRadius: RADIUS.md, padding: 10, lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                      <strong>{answers.proj_name}</strong>
                      {answers.proj_period || answers.proj_org ? (
                        <div style={{ fontSize: 13, color: COLORS.sub }}>{[answers.proj_period, answers.proj_org].filter(Boolean).join(' | ')}</div>
                      ) : null}
                      {answers.proj_role && <div style={{ marginTop: 4 }}><strong>본인 역할:</strong> {answers.proj_role}</div>}
                      {answers.proj_detail && <div style={{ marginTop: 4 }}>{answers.proj_detail}</div>}
                    </div>
                  )}
                </div>
              )}

              {/* 스킬·자격증 */}
              {answers.skills && (
                <div style={{ marginBottom: 12 }}>
                  <p style={{ fontWeight: 700, color: COLORS.ink, margin: 0, marginBottom: 4, fontSize: 16 }}>스킬 · 자격증 (PART 6)</p>
                  <p style={{ fontSize: 16, color: COLORS.navyMid, background: COLORS.paper, borderRadius: RADIUS.md, padding: 10, whiteSpace: 'pre-line', lineHeight: 1.7, margin: 0 }}>{answers.skills}</p>
                </div>
              )}

              {/* 추가 교육·부트캠프 */}
              {answers.edu_extra && (
                <div>
                  <p style={{ fontWeight: 700, color: COLORS.ink, margin: 0, marginBottom: 4, fontSize: 16 }}>교육 · 부트캠프 (PART 6)</p>
                  <p style={{ fontSize: 16, color: COLORS.navyMid, background: COLORS.paper, borderRadius: RADIUS.md, padding: 10, whiteSpace: 'pre-line', lineHeight: 1.7, margin: 0 }}>{answers.edu_extra}</p>
                </div>
              )}
            </div>

            <div style={{ background: COLORS.border, width: '100%', borderRadius: RADIUS.pill, height: 8, marginBottom: 24 }}>
              <div style={{ background: COLORS.goldDeep, height: 8, borderRadius: RADIUS.pill, transition: 'all 150ms', width: `${(checkedCount / checkItems.length) * 100}%` }} />
            </div>

            <div style={{ gap: 12 }}>
              {checkItems.map(item => {
                const checked = !!checks[item.id];
                return (
                  <label key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 16, borderRadius: RADIUS.md, border: `1px solid ${checked ? COLORS.goldDeep : COLORS.border}`, background: checked ? COLORS.paper : COLORS.white, cursor: 'pointer', transition: 'all 150ms', marginBottom: 8 }}
                    onMouseEnter={e => { if (!checked) e.currentTarget.style.borderColor = `${COLORS.border}`; }}
                    onMouseLeave={e => { if (!checked) e.currentTarget.style.borderColor = COLORS.border; }}>
                    <input type="checkbox" checked={checked} onChange={() => toggleCheck(item.id)} style={{ marginTop: 2, cursor: 'pointer', width: 18, height: 18, accentColor: COLORS.goldDeep, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 16, color: COLORS.ink, margin: 0, textDecoration: checked ? 'line-through' : 'none', opacity: checked ? 0.7 : 1 }}>{item.text}</p>
                      <p style={{ fontSize: 16, color: COLORS.sub, margin: '4px 0 0' }}>조치: {item.action}</p>
                    </div>
                  </label>
                );
              })}
            </div>

            {checkedCount === checkItems.length && (
              <div style={{ marginTop: 24, background: COLORS.paper, border: `1px solid ${COLORS.border}`, borderColor: COLORS.goldDeep, borderRadius: RADIUS.lg, padding: 20, textAlign: 'center' }}>
                <p style={{ fontSize: 18, fontWeight: 700, color: COLORS.goldDeep }}>모든 점검 완료!</p>
                <p style={{ fontSize: 16, color: COLORS.goldDeep, marginTop: 4 }}>다음 단계에서 작성 결과를 다운로드하세요.</p>
              </div>
            )}
          </div>
        );
      }

      // ========== PART 7: 완성 & 다운로드 ==========
      case 7:
        return (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ width: 64, height: 64, background: COLORS.cream, borderRadius: RADIUS.pill, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto', marginRight: 'auto', marginBottom: 16 }}>
                </div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.ink, marginBottom: 8 }}>이력서 워크북 작성 완료!</h2>
              <p style={{ fontSize: 16, color: COLORS.sub }}>아래 내용을 확인하고 .docx 파일로 다운로드하세요.</p>
            </div>

            <div style={{ background: COLORS.paper, border: `1px solid ${COLORS.border}`, borderColor: COLORS.goldDeep, borderRadius: RADIUS.lg, padding: 16, marginBottom: 24 }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink }}>완성본은 파일로 받아두세요</p>
              <p style={{ fontSize: 16, color: COLORS.navyMid }}>작성한 내용은 이 브라우저에 자동 저장됩니다. 다만 캐시를 지우거나 다른 기기에서 열면 사라질 수 있으니, 최종본은 "다운로드 (.docx)" 버튼으로 받아두면 안전합니다.</p>
            </div>

            {/* 작성 결과 요약 — 워드 출력에 포함되는 모든 항목 표시 */}
            <div style={{ background: COLORS.cream, borderRadius: RADIUS.lg, padding: 20, marginBottom: 24 }}>
              <p style={{ fontSize: 18, fontWeight: 700, color: COLORS.ink, margin: 0, marginBottom: 16 }}>작성 결과 요약</p>
              <p style={{ fontSize: 16, color: COLORS.sub, margin: '0 0 16px 0' }}>아래 내용이 .docx 파일로 출력됩니다. 누락된 항목이 있으면 이전 PART로 돌아가서 작성하세요.</p>

              {/* 기본 정보 */}
              {(answers.company || answers.position || answers.expType) && (
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink, marginBottom: 6 }}>기본 정보</p>
                  <div style={{ fontSize: 15, color: COLORS.navyMid, background: COLORS.white, borderRadius: RADIUS.md, padding: 12, border: `1px solid ${COLORS.border}`, lineHeight: 1.7 }}>
                    {answers.company && <div><strong>회사:</strong> {answers.company}</div>}
                    {answers.position && <div><strong>직무:</strong> {answers.position}</div>}
                    {answers.expType && <div><strong>지원자 유형:</strong> {answers.expType}</div>}
                  </div>
                </div>
              )}

              {/* 직무상세내용 분석 */}
              {(answers.jd_core || answers.jd_tools || answers.jd_nice) && (
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink, marginBottom: 6 }}>직무상세내용 분석</p>
                  <div style={{ fontSize: 15, color: COLORS.navyMid, background: COLORS.white, borderRadius: RADIUS.md, padding: 12, border: `1px solid ${COLORS.border}`, lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                    {answers.jd_core && <div style={{ marginBottom: 6 }}><strong>핵심 키워드:</strong>{'\n'}{answers.jd_core}</div>}
                    {answers.jd_tools && <div style={{ marginBottom: 6 }}><strong>도구·스킬:</strong>{'\n'}{answers.jd_tools}</div>}
                    {answers.jd_nice && <div><strong>우대 사항:</strong>{'\n'}{answers.jd_nice}</div>}
                  </div>
                </div>
              )}

              {/* 한줄 소개 */}
              {answers.oneline_final && (
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink, marginBottom: 6 }}>한줄 소개</p>
                  <p style={{ fontSize: 15, color: COLORS.ink, background: COLORS.white, borderRadius: RADIUS.md, padding: 12, border: `1px solid ${COLORS.border}`, margin: 0, whiteSpace: 'pre-line', lineHeight: 1.7 }}>{answers.oneline_final}</p>
                </div>
              )}

              {/* 경력 / 경험 — expCount만큼 동적 */}
              {Array.from({length: expCount}, (_, i) => i + 1).some(n => answers[`exp${n}_name`]) && (
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink, marginBottom: 6 }}>경력 / 경험</p>
                  {Array.from({length: expCount}, (_, i) => i + 1).map(n => answers[`exp${n}_name`] && (
                    <div key={n} style={{ marginBottom: 8 }}>
                      <div style={{ fontSize: 15, color: COLORS.navyMid, background: COLORS.white, borderRadius: RADIUS.md, padding: 12, border: `1px solid ${COLORS.border}`, whiteSpace: 'pre-line', lineHeight: 1.7 }}>
                        <strong>경험 {n}: {answers[`exp${n}_name`]}</strong>
                        {answers[`exp${n}_period`] || answers[`exp${n}_role`] ? (
                          <div style={{ fontSize: 16, color: COLORS.sub, marginTop: 2 }}>
                            {[answers[`exp${n}_period`], answers[`exp${n}_role`]].filter(Boolean).join(' | ')}
                          </div>
                        ) : null}
                        {answers[`exp${n}_detail`] && <div style={{ marginTop: 6 }}>{answers[`exp${n}_detail`]}</div>}
                        {answers[`exp${n}_result`] && <div style={{ marginTop: 6, color: COLORS.ink }}><strong>성과 ·</strong> {answers[`exp${n}_result`]}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 경력직 추가 정보 */}
              {(answers.career_depth || answers.career_gap) && (
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink, marginBottom: 6 }}>경력직 추가 정보</p>
                  <div style={{ fontSize: 15, color: COLORS.navyMid, background: COLORS.white, borderRadius: RADIUS.md, padding: 12, border: `1px solid ${COLORS.border}`, whiteSpace: 'pre-line', lineHeight: 1.7 }}>
                    {answers.career_depth && <div style={{ marginBottom: 6 }}><strong>경력 깊이:</strong>{'\n'}{answers.career_depth}</div>}
                    {answers.career_gap && <div><strong>경력 공백:</strong>{'\n'}{answers.career_gap}</div>}
                  </div>
                </div>
              )}

              {/* 프로젝트 — projCount + 옛 단일 키 호환 */}
              {(Array.from({length: projCount}, (_, i) => i + 1).some(p => answers[`proj${p}_name`]) || answers.proj_name) && (
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink, marginBottom: 6 }}>프로젝트</p>
                  {Array.from({length: projCount}, (_, i) => i + 1).map(p => answers[`proj${p}_name`] && (
                    <div key={p} style={{ marginBottom: 8 }}>
                      <div style={{ fontSize: 15, color: COLORS.navyMid, background: COLORS.white, borderRadius: RADIUS.md, padding: 12, border: `1px solid ${COLORS.border}`, whiteSpace: 'pre-line', lineHeight: 1.7 }}>
                        <strong>프로젝트 {p}: {answers[`proj${p}_name`]}</strong>
                        {answers[`proj${p}_period`] || answers[`proj${p}_org`] ? (
                          <div style={{ fontSize: 16, color: COLORS.sub, marginTop: 2 }}>
                            {[answers[`proj${p}_period`], answers[`proj${p}_org`]].filter(Boolean).join(' | ')}
                          </div>
                        ) : null}
                        {answers[`proj${p}_role`] && <div style={{ marginTop: 6 }}><strong>본인 역할:</strong> {answers[`proj${p}_role`]}</div>}
                        {answers[`proj${p}_detail`] && <div style={{ marginTop: 6 }}>{answers[`proj${p}_detail`]}</div>}
                      </div>
                    </div>
                  ))}
                  {/* 옛 단일 proj_ 키 호환 */}
                  {answers.proj_name && !answers.proj1_name && (
                    <div style={{ fontSize: 15, color: COLORS.navyMid, background: COLORS.white, borderRadius: RADIUS.md, padding: 12, border: `1px solid ${COLORS.border}`, whiteSpace: 'pre-line', lineHeight: 1.7 }}>
                      <strong>{answers.proj_name}</strong>
                      {answers.proj_period || answers.proj_org ? (
                        <div style={{ fontSize: 16, color: COLORS.sub, marginTop: 2 }}>
                          {[answers.proj_period, answers.proj_org].filter(Boolean).join(' | ')}
                        </div>
                      ) : null}
                      {answers.proj_role && <div style={{ marginTop: 6 }}><strong>본인 역할:</strong> {answers.proj_role}</div>}
                      {answers.proj_detail && <div style={{ marginTop: 6 }}>{answers.proj_detail}</div>}
                    </div>
                  )}
                </div>
              )}

              {/* 스킬·자격증 */}
              {answers.skills && (
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink, marginBottom: 6 }}>스킬 · 자격증</p>
                  <p style={{ fontSize: 15, color: COLORS.navyMid, background: COLORS.white, borderRadius: RADIUS.md, padding: 12, border: `1px solid ${COLORS.border}`, whiteSpace: 'pre-line', lineHeight: 1.7, margin: 0 }}>{answers.skills}</p>
                </div>
              )}

              {/* 추가 교육·부트캠프 */}
              {answers.edu_extra && (
                <div>
                  <p style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink, marginBottom: 6 }}>교육 · 부트캠프</p>
                  <p style={{ fontSize: 15, color: COLORS.navyMid, background: COLORS.white, borderRadius: RADIUS.md, padding: 12, border: `1px solid ${COLORS.border}`, whiteSpace: 'pre-line', lineHeight: 1.7, margin: 0 }}>{answers.edu_extra}</p>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button onClick={goPrev} style={{ background: 'transparent', color: COLORS.ink, border: `1px solid ${COLORS.border}`, padding: '12px 24px', borderRadius: RADIUS.lg, fontSize: 16, fontWeight: 500, cursor: 'pointer' }}>
                이전
              </button>
              <button
                onClick={generateDoc}
                style={{ flex: 1, paddingTop: 16, paddingBottom: 16, color: COLORS.white, borderRadius: RADIUS.lg, fontWeight: 700, fontSize: 18, transition: 'all 150ms', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, background: COLORS.ink, cursor: 'pointer', border: 'none' }}
              >
                다운로드 (.docx)
              </button>
            </div>

            {downloadDone && <p style={{ fontSize: 16, color: COLORS.green, textAlign: 'center', marginTop: 16, fontWeight: 600 }}>✓ 다운로드 완료</p>}

            <div style={{ borderColor: COLORS.border, marginTop: 24, background: COLORS.cream, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.lg, padding: 20 }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink, marginBottom: 8 }}>다음 단계 안내</p>
              <div style={{ fontSize: 16, color: COLORS.ink, gap: 4 }}>
                <p>1. 이 워크북 결과를 바탕으로 실제 이력서 양식에 내용을 옮기세요</p>
                <p>2. {IS_EXPERIENCED_VARIANT ? '경력기술서를 마쳤다면 다음은 면접 준비입니다' : '자소서 작성이 필요하면 "질문에 답하며 완성하는 자소서 5대 항목 작성 가이드"를 활용하세요'}</p>
                <p>3. 면접 준비는 "{IS_EXPERIENCED_VARIANT ? '경력' : '신입'} 면접 가이드 & 워크북"를 참고하세요</p>
                <p>4. 회사별로 이력서를 커스터마이즈하세요 (한줄 소개, 경험 강조점, 스킬 배치 순서 조정)</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ==================== MAIN LAYOUT ====================
  const stepTitles = ['기본 정보', '직무상세내용 키워드', '경험 선별', '한줄 소개', '경력 정리', '프로젝트/스킬', '최종 점검', '완성'];

  // 중간 저장 (PART 7-7)
  // 임시저장 — generateDoc과 동일한 디자인의 워드 호환 HTML 사용

  return (
    <div style={{ minHeight: '100vh', background: COLORS.cream, padding: 'clamp(16px, 4vw, 32px)', fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, sans-serif', color: COLORS.ink }}>
      <BrandOverride />
      <FirstVisitModal open={showHelp} onClose={() => setShowHelp(false)} title="이력서 워크북 사용 안내" steps={[
        '순서대로 <strong>PART 1부터 PART 7까지</strong> 진행하세요.',
        '작성 중 상단의 <strong>다운로드 (.docx)</strong> 버튼을 눌러 수시로 다운로드하세요.',
        '질문 옆 <strong>가이드 보기</strong>를 펼쳐 작성 원칙·예시·도움 질문을 참고하세요.',
        '마지막 PART에서 <strong>최종 다운로드</strong>하여 Word에서 자유롭게 편집하세요.',
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
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, background: COLORS.border, borderRadius: RADIUS.pill, height: 6, overflow: 'hidden' }}>
              <div style={{ background: COLORS.accent2, height: 6, borderRadius: RADIUS.pill, width: `${progress}%`, transition: 'width 500ms ease' }} />
            </div>
            <span style={{ fontSize: 16, color: COLORS.sub, minWidth: 36, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{progress}%</span>
          </div>
        </div>

        {/* 임시저장 토스트 */}
        {downloadDone && (
          <div style={{ background: COLORS.paper, border: '1px solid rgba(201, 168, 106, 0.2)', borderRadius: RADIUS.md, padding: 12, marginBottom: 16, textAlign: 'center' }}>
            <p style={{ fontSize: 16, color: COLORS.accent2, fontWeight: 600, margin: 0 }}>✓ 백업 .docx 파일을 내려받았습니다</p>
          </div>
        )}

        {/* 스텝 인디케이터 (원본 유지) */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: 4 }}>
            {stepTitles.map((t, i) => (
              <button key={i} onClick={() => { setCurrentPart(i); window.scrollTo(0, 0); }}
                style={{ fontSize: 16, padding: '4px 10px', borderRadius: RADIUS.pill, border: 'none', cursor: 'pointer', fontWeight: i === currentPart ? 700 : 500, background: i === currentPart ? COLORS.ink : i < currentPart ? COLORS.paper : 'transparent', color: i === currentPart ? '#fff' : i < currentPart ? COLORS.accent2 : COLORS.sub, whiteSpace: 'nowrap', flexShrink: 0 }}>
                {i < currentPart ? '✓ ' : ''}PART {i + 1}. {t}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ background: '#fff', borderRadius: RADIUS.lg, padding: 'clamp(16px, 4vw, 32px)', border: `1px solid ${COLORS.border}`, marginBottom: 24 }}>
          {renderStep()}

          {/* Navigation */}
          <div className="mt-8" style={{ display: 'flex', gap: 16 }}>
            <button onClick={() => currentPart === 0 ? setShowIntro(true) : goPrev()} style={{ background: 'transparent', color: COLORS.ink, border: `1px solid ${COLORS.border}`, padding: '12px 24px', borderRadius: RADIUS.md, fontSize: 16, fontWeight: 500, cursor: 'pointer' }}>
              이전
            </button>
            {currentPart < 7 && (
              <button onClick={goNext} style={{ flex: 1, background: COLORS.ink, color: COLORS.white, border: 'none', padding: '12px 24px', borderRadius: RADIUS.md, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>
                다음 </button>
            )}
          </div>
        </div>

        <StickyFooter />
      </div>
    </div>
  );
};

export default ResumeWorkbook;
