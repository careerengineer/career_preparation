// [BUILD v36 20260520 10:30] docx 저장에 CareerEngineer 자료 + 멘토링 안내 섹션 추가 (ExternalHyperlink + linkP)
import { useState, useEffect, useRef } from 'react';
import * as DOCX from 'docx';
import { COLORS, FONT, SPACING, RADIUS } from '../../shared/design/tokens.js';
import { buildWorkbookBackupParagraphs, buildWorkbookPayload, buildCopyrightParagraphs } from '../../store/docxBackup.js';
import { buildSelfIntroDocxChildren } from '../../store/workbookDocx.js';
import { ReferenceInline } from '../../shared/components/ReferenceInline.jsx';
import { ExampleToggle } from '../../shared/components/ExampleToggle.jsx';
import { AnswerQualityCheck } from '../../shared/components/AnswerQualityCheck.jsx';
import { VARIANT } from '../../store/schema.js';
import { SELF_INTRO_EXAMPLES, SELF_INTRO_EXAMPLES_CAREER, PARTS, CHECKLIST } from './data.js';
import { _INTRO_FONT, StickyFooter, FocusStyles } from '../_shared/brandKit.jsx';
import { _INTRO_INK, _INTRO_INK2, _INTRO_PAPER, _INTRO_GOLD, _INTRO_MUTE, CELockupA, FirstVisitModal, BrandHero, IntroCTA, IntroFlowCard, IntroCopyright } from '../_shared/brandKit.jsx';

// 경력 변형(경력 컨설팅·경력 면접)에서는 경력 페르소나 예시를 보여준다
const IS_EXPERIENCED_VARIANT = ['experienced', 'documents_experienced', 'interview_experienced'].includes(VARIANT);

// 멘토링·컨설팅 URL 상수 (작업 18: URL 상수화)
// ══════════════════════════════════════════════════════════════
//  CareerEngineer 공식 디자인 토큰 (PART 7-2)
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
}

// 변형에 맞는 예시 세트 선택
const EXAMPLES = IS_EXPERIENCED_VARIANT ? SELF_INTRO_EXAMPLES_CAREER : SELF_INTRO_EXAMPLES;

// ══════════════════════════════════════════════════════════════
//  CE 로고 (정식 PNG base64 임베딩)
//  - 가이드 PART 1-4-1 정식 마스터 파일 사용 (스크린캡처 아님)
//  - 심볼: 102×96px → C 락업
//  - 락업: 389×80px → A 락업 (심볼+워드마크)
// ══════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════
//  표준 Intro 페이지 컴포넌트 — 통일 7-Block 구조
//  (Brand Standards v1.0 + 통일 방안 v1.0 적용)
// ════════════════════════════════════════════════════════════

const IntroPrerequisites = ({ items }) => {
  if (!items || items.length === 0) return null;
  return (
    <div style={{ background: '#FBFAF6', border: `1px solid ${_INTRO_GOLD}33`, color: _INTRO_INK, padding: 16, borderRadius: 10, marginBottom: 16 }}>
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

      <div style={{ background: '#fff', borderRadius: 14, padding: 'clamp(16px, 4vw, 32px)', border: `1px solid ${_INTRO_MUTE}33`, marginBottom: 16 }}>
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
         padding: '10px 12px', background: COLORS.blueBg,
         border: `1px solid ${COLORS.blue}33`, borderRadius: RADIUS.sm,
         textDecoration: 'none', color: COLORS.accent,
         fontFamily: FONT.family, transition: 'opacity 150ms ease',
       }}
       onMouseEnter={e => e.currentTarget.style.opacity = 0.85}
       onMouseLeave={e => e.currentTarget.style.opacity = 1}>
      <span style={{ fontSize: FONT.size.sm, color: COLORS.blue, marginTop: 1 }}></span>
      <span style={{ fontSize: FONT.size.sm, lineHeight: FONT.lineHeight.base, flex: 1 }}>
        <strong style={{ color: COLORS.blue }}>{link.label}</strong>
        {hint && <span style={{ color: COLORS.accent }}> · {hint}</span>}
      </span>
    </a>
  );
};

// ══════════════════════════════════════════════════════════════
//  7 STEP × 22 Q 워크북 데이터 (자가점검은 완성 화면 체크리스트)

  

const SelfIntroWorkbook = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [showHelp, setShowHelp] = useState(true);
  // currentPart: 이 워크북 "내부" PART 인덱스 (대시보드 상위 STEP 0~5와 무관). 저장 키도 currentPart, 단 구버전(currentStep) 저장본 호환을 위해 로드 시 둘 다 읽음.
  const [currentPart, setCurrentPart] = useState(() => { try { const __d = JSON.parse(localStorage.getItem('careerengineer_self_introduction_v1') || '{}'); return (__d.basicInfo && (__d.basicInfo.industry || __d.basicInfo.position || __d.basicInfo.company)) ? 1 : 0; } catch { return 0; } });
  const [basicInfo, setBasicInfo] = useState({ industry: '', position: '', company: '' });
  const [answers, setAnswers] = useState({});
  const [showStuckHint, setShowStuckHint] = useState({});
  const [checks, setChecks] = useState({});
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [resetCounter, setResetCounter] = useState(0);
  const [confirmingClear, setConfirmingClear] = useState(false);

  // [CE-HOME] WorkbookShell '처음으로' 버튼에서 호출

  const __ceHomeRef = useRef(null);

  useEffect(() => {

    if (typeof window === 'undefined') return;

    window.__CE_HOME = { fn: () => __ceHomeRef.current?.(), key: 'self_introduction' };

    return () => { if (window.__CE_HOME?.key === 'self_introduction') window.__CE_HOME = null; };

  }, []);

  const goHome = () => {
    console.log('[goHome] clicked - moving to intro page');
    setShowIntro(true);
    setCurrentPart(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  __ceHomeRef.current = goHome; // [CE-HOME] ref 갱신
  
  const STORAGE_KEY = 'careerengineer_self_introduction_v1';
  
  useEffect(() => {
    try {
      // [v8] 기록 삭제 후 새로고침된 경우 자동 불러오기 차단
      if (sessionStorage.getItem('__si_skip_autoload__') === '1') {
        console.log('[v8 load] 자동 불러오기 차단 - 기록 삭제 후');
        sessionStorage.removeItem('__si_skip_autoload__');
        const keepStep = sessionStorage.getItem('__si_keep_step__');
        if (keepStep !== null) {
          setCurrentPart(parseInt(keepStep, 10));
          setShowIntro(false);
          sessionStorage.removeItem('__si_keep_step__');
          console.log('[v8 load] 단계 복원:', keepStep);
        }
        return;
      }
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.answers && Object.keys(data.answers).length > 0) {
          const savedDate = data.savedAt ? new Date(data.savedAt).toLocaleString('ko-KR') : '이전';
          if (true /* auto-restore */) {
            setAnswers(data.answers || {});
            if (data.basicInfo) setBasicInfo(data.basicInfo);
            if (data.checks) setChecks(data.checks);
            // 하위호환: 신규 저장본은 currentPart, 구버전 저장본·기존 다운로드 파일은 currentStep 키 → 둘 다 읽어 작성 위치 유실 0.
            if (typeof (data.currentPart ?? data.currentStep) === 'number') setCurrentPart(data.currentPart ?? data.currentStep);
            if (data.showIntro === false) setShowIntro(false);
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      }
    } catch (e) { console.warn(e); }
  }, []);
  
  useEffect(() => {
    if (Object.keys(answers).length === 0 && !(basicInfo?.industry || basicInfo?.position || basicInfo?.company)) return;
    // 실제 답변이 하나라도 있는지 확인 (빈 문자열 제외)
    const hasRealAnswer = Object.values(answers).some(v => v && String(v).trim().length > 0);
    if (!hasRealAnswer) return;
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          answers, basicInfo, checks, currentPart, showIntro,
          savedAt: new Date().toISOString()
        }));
      } catch { /* ignore */ }
    }, 1000);
    return () => clearTimeout(timer);
  }, [answers, basicInfo, checks, currentPart, showIntro]);
  

  const setAnswer = (id, val) => setAnswers(p => ({ ...p, [id]: val }));
  const toggleCheck = (id) => setChecks(p => ({ ...p, [id]: !p[id] }));

  const progress = ((currentPart + 1) / PARTS.length) * 100;
  
  // 각 PART의 질문 범위 계산 (PART 1: Q1-Q3, PART 2: Q4-Q8 등)
  const stepQuestionRanges = (() => {
    const ranges = [];
    let cumIdx = 0;
    PARTS.forEach((s, i) => {
      const start = cumIdx + 1;
      const end = cumIdx + s.questions.length;
      ranges.push(`Q${start}${start === end ? '' : '-Q' + end}`);
      cumIdx = end;
    });
    return ranges;
  })();
  const finalAnswer = answers['Q20'] || '';  // 1분 버전 수정본 = 최종본
  const shortAnswer = answers['Q18'] || '';  // 30초 버전 초안

  // 인라인 참고 워크북 (가이드 PART 7-15)
  const RelatedWorkbookInline = ReferenceInline; // master 기반 inline 참고 패널 (shared)

  // docx 라이브러리 동적 로드
  const loadDocxLib = () => Promise.resolve(DOCX);

  // [CE-DL] 외부 WorkbookShell 버튼에서 호출 위한 등록

  const __ceDlRef = useRef(null);

  useEffect(() => {

    if (typeof window === 'undefined') return;

    window.__CE_DOWNLOAD = { fn: () => __ceDlRef.current?.(), key: 'self_introduction' };

    return () => { if (window.__CE_DOWNLOAD?.key === 'self_introduction') window.__CE_DOWNLOAD = null; };

  }, []);

  const downloadFinal = async () => {
    try {
      const docxLib = await loadDocxLib();
      const { Document, Paragraph, TextRun, AlignmentType, BorderStyle, ExternalHyperlink, Packer } = docxLib;
      const today = new Date().toISOString().slice(0,10);
      
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
      const subH = (t) => new Paragraph({
        children: [new TextRun({ text: t, bold: true, size: 24, font: '맑은 고딕', color: '1B3A6B' })],
        spacing: { before: 360, after: 120 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '1B3A6B', space: 4 } }
      });
      const labelP = (t) => new Paragraph({
        children: [new TextRun({ text: t, bold: true, size: 22, font: '맑은 고딕', color: '1B3A6B' })],
        spacing: { before: 200, after: 80 },
        border: { left: { style: BorderStyle.SINGLE, size: 24, color: 'C9A86A', space: 8 } },
        indent: { left: 200 }
      });
      const labelBodyP = (t) => new Paragraph({
        children: (t || '').split('\n').flatMap((line, i) => i === 0 ? [new TextRun({ text: line, size: 22, font: '맑은 고딕', color: '0E2750' })] : [new TextRun({ break: 1, text: line, size: 22, font: '맑은 고딕', color: '0E2750' })]),
        spacing: { before: 0, after: 160, line: 360 },
        indent: { left: 360 }
      });
      const placeholderP = (t) => new Paragraph({
        children: [new TextRun({ text: t, italic: true, size: 22, font: '맑은 고딕', color: '6E7A8F' })],
        spacing: { before: 0, after: 160, line: 360 },
        indent: { left: 360 }
      });
      const highlightP = (t) => new Paragraph({
        children: t.split('\n').flatMap((line, i) => i === 0 ? [new TextRun({ text: line, size: 24, font: '맑은 고딕', color: '0E2750' })] : [new TextRun({ break: 1, text: line, size: 24, font: '맑은 고딕', color: '0E2750' })]),
        spacing: { before: 100, after: 200, line: 400 },
        shading: { fill: 'F2F1EC' },
        border: { left: { style: BorderStyle.SINGLE, size: 24, color: '0E2750', space: 8 } },
        indent: { left: 240 }
      });
      const softHighlightP = (t) => new Paragraph({
        children: t.split('\n').flatMap((line, i) => i === 0 ? [new TextRun({ text: line, size: 22, font: '맑은 고딕', color: '0E2750' })] : [new TextRun({ break: 1, text: line, size: 22, font: '맑은 고딕', color: '0E2750' })]),
        spacing: { before: 100, after: 200, line: 380 },
        shading: { fill: 'FBFAF6' },
        border: { left: { style: BorderStyle.SINGLE, size: 24, color: 'C9A86A', space: 8 } },
        indent: { left: 240 }
      });
      const dateP = () => new Paragraph({
        children: [new TextRun({ text: '작성일 · ' + today, size: 20, font: '맑은 고딕', color: '6E7A8F' })],
        alignment: AlignmentType.RIGHT,
        spacing: { after: 80 }
      });
      const checkP = (checked, criteria, question) => new Paragraph({
        children: [
          new TextRun({ text: (checked ? '✓  ' : '·  '), bold: true, size: 22, font: '맑은 고딕', color: 'C9A86A' }),
          new TextRun({ text: criteria + '  ', bold: true, size: 20, font: '맑은 고딕', color: '1B3A6B' }),
          new TextRun({ text: question, size: 20, font: '맑은 고딕', color: '0E2750' })
        ],
        spacing: { before: 80, after: 80 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'E8E5DD', space: 4 } }
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
      
      const children = buildSelfIntroDocxChildren({ basicInfo, answers, checks }, docxLib);

      try { children.push(...buildWorkbookBackupParagraphs(docxLib, buildWorkbookPayload('self_introduction', '1분 자기소개', 'careerengineer_self_introduction_v1'))); } catch (e) { console.warn('[self_introduction] backup embed skipped:', e); }
      try { children.unshift(...buildCopyrightParagraphs(docxLib)); } catch (e) { console.warn('copyright skip', e); }
      const doc = new Document({
        creator: '',
        title: '1분 자기소개',
        sections: [{
          properties: { page: { margin: { top: 1400, right: 1133, bottom: 1400, left: 1133 } } },
          children: children
        }]
      });
      
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `1분자기소개_${(basicInfo.company || '미입력').replace(/[^a-zA-Z0-9가-힣\s]/g, '_')}_${today}.docx`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setDownloadSuccess(true); setTimeout(() => setDownloadSuccess(false), 5000);
    } catch (err) {
      console.error('docx 생성 실패:', err);
      alert('.docx 파일 생성에 실패했습니다.\n' + (err.message || ''));
    }
  };

  __ceDlRef.current = downloadFinal; // [CE-DL] ref 갱신

  const S = {
    page: { minHeight: '100vh', background: COLORS.bgAlt, padding: SPACING.md, fontFamily: FONT.family, color: COLORS.accent },
    container: { maxWidth: 1350, margin: '0 auto' },
    card: { background: COLORS.bg, borderRadius: RADIUS.md, padding: SPACING.lg, border: `1px solid ${COLORS.border}`, marginBottom: SPACING.md },
    headerSticky: { background: COLORS.bgAlt, borderRadius: RADIUS.md, padding: SPACING.md, border: `1px solid ${COLORS.border}`, marginBottom: SPACING.md, position: 'sticky', top: SPACING.md, zIndex: 10, boxShadow: '0 2px 8px rgba(14, 39, 80, 0.12)' },
    cardLarge: { background: COLORS.bg, borderRadius: RADIUS.md, padding: SPACING.xl, border: `1px solid ${COLORS.border}`, marginBottom: SPACING.md },
    h1Center: { fontSize: FONT.size.h1, fontWeight: FONT.weight.bold, color: COLORS.accent, margin: `0 0 ${SPACING.md}px`, lineHeight: FONT.lineHeight.tight, textAlign: 'center' },
    h2: { fontSize: FONT.size.h2, fontWeight: FONT.weight.bold, color: COLORS.accent, margin: 0, lineHeight: FONT.lineHeight.tight },
    h3: { fontSize: FONT.size.lg, fontWeight: FONT.weight.semibold, color: COLORS.accent, margin: 0 },
    brandEyebrow: { fontSize: FONT.size.xs, letterSpacing: 4, color: COLORS.sub, marginBottom: SPACING.base, textAlign: 'center', fontWeight: FONT.weight.medium },
    subtitle: { fontSize: FONT.size.base, color: COLORS.sub, lineHeight: FONT.lineHeight.base, margin: 0 },
    label: { fontSize: FONT.size.md, fontWeight: FONT.weight.semibold, color: COLORS.accent, display: 'block', marginBottom: SPACING.sm },
    textarea: { width: '100%', padding: '12px 16px', border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.base, fontSize: FONT.size.base, fontFamily: FONT.family, color: COLORS.accent, outline: 'none', resize: 'none', boxSizing: 'border-box', lineHeight: 1.7, background: COLORS.bg, transition: 'border-color 150ms ease, box-shadow 150ms ease' },
    input: { width: '100%', padding: '12px 16px', border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.base, fontSize: FONT.size.base, fontFamily: FONT.family, color: COLORS.accent, outline: 'none', boxSizing: 'border-box', background: COLORS.bg, transition: 'border-color 150ms ease, box-shadow 150ms ease' },
    btnPrimary: { background: COLORS.accent, color: COLORS.white, border: 'none', padding: '14px 32px', borderRadius: RADIUS.md, fontSize: FONT.size.md, fontWeight: FONT.weight.semibold, cursor: 'pointer', fontFamily: FONT.family, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 },
    btnSecondary: { background: 'transparent', color: COLORS.accent, border: `1px solid ${COLORS.border}`, padding: '12px 24px', borderRadius: RADIUS.base, fontSize: FONT.size.base, fontWeight: FONT.weight.medium, cursor: 'pointer', fontFamily: FONT.family, display: 'inline-flex', alignItems: 'center', gap: 6 },
    btnSaveHeader: { background: COLORS.accent2, color: COLORS.white, border: 'none', borderRadius: RADIUS.base, padding: '0 14px', fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, cursor: 'pointer', fontFamily: FONT.family, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, whiteSpace: 'nowrap', transition: 'opacity 150ms ease', height: 36 },
    btnText: { background: 'transparent', color: COLORS.accent2, border: 'none', padding: 0, fontSize: FONT.size.sm, fontWeight: FONT.weight.medium, cursor: 'pointer', fontFamily: FONT.family, display: 'inline-flex', alignItems: 'center', gap: 4 },
    progressTrack: { width: '100%', background: COLORS.border, borderRadius: RADIUS.pill, height: 6, overflow: 'hidden' },
    progressBar: { background: COLORS.accent2, height: 6, borderRadius: RADIUS.pill, transition: 'width 500ms ease' },
    boxTip:     { background: COLORS.yellowBg, border: `1px solid ${COLORS.yellow}33`, color: COLORS.accent, padding: SPACING.md, borderRadius: RADIUS.base, marginBottom: SPACING.md },
    boxWarning: { background: COLORS.redBg,    border: `1px solid ${COLORS.red}33`,    color: COLORS.accent, padding: SPACING.md, borderRadius: RADIUS.base, marginBottom: SPACING.md },
    boxSuccess: { background: COLORS.greenBg,  border: `1px solid ${COLORS.green}33`,  color: COLORS.accent, padding: SPACING.md, borderRadius: RADIUS.base, marginBottom: SPACING.md },
    boxInfo:    { background: COLORS.blueBg,   border: `1px solid ${COLORS.blue}33`,   color: COLORS.accent, padding: SPACING.md, borderRadius: RADIUS.base, marginBottom: SPACING.md },
    copyrightWrap: { background: COLORS.bg, borderRadius: RADIUS.md, padding: SPACING.md, border: `1px solid ${COLORS.border}`, marginTop: SPACING.lg },
    copyrightText: { fontSize: FONT.size.xs, color: COLORS.sub, textAlign: 'center', margin: 0, lineHeight: FONT.lineHeight.base },
    copyrightWarn: { fontSize: FONT.size.xs, color: COLORS.red, textAlign: 'center', marginTop: 8, fontWeight: FONT.weight.medium, lineHeight: FONT.lineHeight.base },
  };
  const labelStyle = (color) => ({ fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color, margin: 0, letterSpacing: 0.5, textTransform: 'uppercase' });

  // ══════════════════ 인트로 화면 ══════════════════
      if (showIntro) return (
    <IntroPage
      workbookKey='self_introduction'
      stepLabel='STEP 5 · 1분 자기소개 준비'
      title='1분 자기소개'
      subtitle='면접 첫인상을 결정하는 1분 자기소개를 만듭니다'
      flow={[
          { label: 'PART 1', desc: '직무 분석 — 직무 이해도를 보여준다' },
          { label: 'PART 2', desc: '경험 연결 — 즉시 전력화 가능성을 보여준다' },
          { label: 'PART 3', desc: '강점 도출 — 함께 일하고 싶은 동료인가를 보여준다' },
          { label: 'PART 4', desc: '마무리 — 오래 함께할 사람인가를 보여준다' },
          { label: 'PART 5', desc: '자기소개 조립 — 키워드 카드 만들기' },
          { label: 'PART 6', desc: '연결 — 키워드 사이를 자연스럽게 잇기' },
          { label: 'PART 7', desc: '초안 작성 — 키워드를 보고 말한 후, 그대로 적기' },
        ]}
      flowTitle={'이 워크북의 작성 순서'}
      prerequisites={[
          {
            text: '지원할 회사의 채용공고 (직무상세내용)',
            recommend: {
              workbookId: 'job_analysis',
              condition: '직무 키워드 추출이 필요하다면',
              linkLabel: '채용공고 및 직무분석 가이드',
            },
          },
          {
            text: '강점을 증명할 본인의 경험',
            recommend: {
              workbookId: 'experience',
              condition: '경험을 아직 정리하지 못했다면',
              linkLabel: '경험정리 가이드 워크북',
            },
          },
        ]}
      helpModal={<FirstVisitModal open={showHelp} onClose={() => setShowHelp(false)} title='1분 자기소개 워크북 사용 안내' steps={[
          '<strong>PART 1부터 PART 7까지</strong> 순서대로 진행하세요. PART 1~4는 답변 재료, PART 5~7은 조립·연결·작성입니다.',
          '1분 분량은 약 <strong>300~350자</strong>(30초는 약 150자)입니다. 너무 길지 않게 다듬으세요.',
          '<strong>키워드 카드 → 연결 → 초안</strong> 순서로 자연스러운 흐름을 만드세요.',
          '마지막에 <strong>녹음하여 직접 들어보고</strong> 다듬으세요.',
        ]} />}
      onStart={() => { setShowIntro(false); }}
    />
  );
  // ══════════════════ 완성 화면 (자소서 패턴: 최종 답변 중심) ══════════════════
  if (currentPart >= PARTS.length) {
    const checkedCount = Object.values(checks).filter(Boolean).length;

    return (
      <div style={S.page}>
        <FocusStyles />
        <div style={S.container}>
          <div style={S.headerSticky}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: SPACING.base, flexWrap: 'wrap' }}>
              <CELockupA height={32} />
              <div style={{ position: 'relative', flex: 1, display: 'flex', justifyContent: 'center' }}>
                
                
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, whiteSpace: 'nowrap', flexShrink: 0 }}>
                <button onClick={() => window.__CE_RESET?.fn?.()} title="이 워크북 작성 내용을 모두 지우고 처음부터 다시 작성" style={{ background: 'transparent', color: COLORS.red, border: `1px solid ${COLORS.red}66`, borderRadius: 10, padding: '0 14px', fontSize: 16, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', height: 40, display: 'inline-flex', alignItems: 'center', marginRight: 6 }}>삭제하고 다시 작성</button><button onClick={goHome} title="처음 페이지로 이동 (작성 내용 유지)" style={{ background: 'transparent', color: COLORS.sub, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: '0 14px', fontSize: 16, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', height: 40, display: 'inline-flex', alignItems: 'center' }}>처음으로</button>
                
                
              </div>
            </div>
          </div>
          <div style={S.cardLarge}>
            {/* 완성 헤더 */}
            <div style={{ textAlign: 'center', marginBottom: SPACING.xl }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, background: COLORS.greenBg, borderRadius: RADIUS.pill, marginBottom: SPACING.base }}>
                </div>
              <h1 style={S.h1Center}>자기소개 완성</h1>
              <p style={{ ...S.subtitle, textAlign: 'center' }}>자가 점검 체크리스트로 최종 검토하세요</p>
            </div>

            {/* ═══ PART 1~7 작성 내용 참고 (기본 노출, 통합 완성본 위) ═══ */}
            {(() => {
              const hasAnyAnswer = PARTS.some(s => s.questions.some(q => answers[q.label]?.trim()));
              if (!hasAnyAnswer) return null;
              return (
                <div style={{ background: COLORS.bgAlt, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.base, padding: SPACING.md, marginBottom: SPACING.lg }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.sm, flexWrap: 'wrap', gap: SPACING.sm }}>
                    <h4 style={{ fontSize: FONT.size.md, fontWeight: FONT.weight.semibold, color: COLORS.accent, margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                      지금까지 작성한 내용
                    </h4>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.sub, margin: 0 }}>아래 완성된 자기소개 작성 시 참고하세요</p>
                  </div>
                  <div style={{ background: COLORS.bg, borderRadius: RADIUS.sm, padding: SPACING.md, border: `1px solid ${COLORS.border}`, maxHeight: 400, overflow: 'auto' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
                      {PARTS.map(s => {
                        const answeredQs = s.questions.filter(q => answers[q.label]?.trim());
                        if (answeredQs.length === 0) return null;
                        return (
                          <div key={s.part} style={{ borderLeft: `3px solid ${COLORS.accent2}`, paddingLeft: SPACING.md }}>
                            <p style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.bold, color: COLORS.accent, margin: 0, marginBottom: SPACING.sm }}>
                              PART {s.part}. {s.title}
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.sm }}>
                              {answeredQs.map(q => (
                                <div key={q.label}>
                                  <p style={{ fontSize: FONT.size.xs, fontWeight: FONT.weight.semibold, color: COLORS.accent2, margin: 0, marginBottom: 2 }}>
                                    [{q.label}] {q.question}
                                  </p>
                                  <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0, lineHeight: FONT.lineHeight.base, whiteSpace: 'pre-wrap', padding: SPACING.sm, background: COLORS.bgAlt, borderRadius: RADIUS.sm }}>
                                    {answers[q.label]}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ═══ 완성된 1분 자기소개 (통합 완성본) ═══ */}
            <div style={{ background: COLORS.bgAlt, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.base, padding: SPACING.md, marginBottom: SPACING.lg }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.base, flexWrap: 'wrap', gap: SPACING.sm }}>
                <h3 style={{ ...S.h3, fontSize: FONT.size.md, display: 'flex', alignItems: 'center', gap: 6 }}>
                  완성된 자기소개 (1분 버전)
                </h3>
              </div>
              <textarea
                key={`final-${resetCounter}`}
                className="ce-textarea"
                value={finalAnswer}
                onChange={e => setAnswer('Q20', e.target.value)}
                rows={10}
                style={{ ...S.textarea, fontSize: FONT.size.md, lineHeight: FONT.lineHeight.relaxed }}
                placeholder="PART 7의 Q20 수정본을 여기서 최종 다듬을 수 있습니다. 소리 내어 읽어보고 어색한 부분을 수정하세요."
              />
              <p style={{ fontSize: FONT.size.xs, color: COLORS.sub, textAlign: 'right', margin: '4px 0 0', fontVariantNumeric: 'tabular-nums' }}>
                {(finalAnswer || '').length}자
              </p>
              <p style={{ fontSize: FONT.size.xs, color: COLORS.sub, margin: `${SPACING.sm}px 0 0`, lineHeight: FONT.lineHeight.base }}>
                1분 안에 편안하게 말할 수 있어야 합니다. 너무 길면 키워드 중심으로 축약하세요.
              </p>
            </div>

            {/* ═══ 30초 버전 (있을 때만) ═══ */}
            {shortAnswer.trim() && (
              <div style={{ background: COLORS.bgAlt, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.base, padding: SPACING.md, marginBottom: SPACING.lg }}>
                <h3 style={{ ...S.h3, fontSize: FONT.size.md, marginBottom: SPACING.base }}>
                  30초 버전 (짧은 자기소개용)
                </h3>
                <textarea
                  key={`short-${resetCounter}`}
                  className="ce-textarea"
                  value={shortAnswer}
                  onChange={e => setAnswer('Q18', e.target.value)}
                  rows={5}
                  style={S.textarea}
                />
                <p style={{ fontSize: FONT.size.xs, color: COLORS.sub, textAlign: 'right', margin: '4px 0 0', fontVariantNumeric: 'tabular-nums' }}>
                  {(shortAnswer || '').length}자
                </p>
              </div>
            )}

            {/* ═══ 자가 점검 체크리스트 (Q21~Q26) ═══ */}
            <div style={{ background: COLORS.bg, border: `2px solid ${COLORS.accent2}`, borderRadius: RADIUS.base, padding: SPACING.lg, marginBottom: SPACING.lg }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.base, flexWrap: 'wrap', gap: SPACING.sm }}>
                <h3 style={{ ...S.h3, fontSize: FONT.size.md }}>
                  자가 점검 체크리스트
                </h3>
                <span style={{ fontSize: FONT.size.xs, color: checkedCount === CHECKLIST.length ? COLORS.green : COLORS.sub, fontWeight: FONT.weight.semibold }}>
                  {checkedCount}/{CHECKLIST.length} 완료
                </span>
              </div>
              <p style={{ fontSize: FONT.size.sm, color: COLORS.sub, margin: 0, marginBottom: SPACING.md, lineHeight: FONT.lineHeight.base }}>
                완성된 자기소개를 아래 6가지 기준으로 점검하세요. 하나라도 체크되지 않은 항목이 있다면 해당 PART로 돌아가 보완할 수 있습니다.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.sm }}>
                {CHECKLIST.map((c, i) => {
                  const checked = !!checks[c.label];
                  return (
                    <label
                      key={c.label}
                      htmlFor={`check-${c.label}`}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: SPACING.sm,
                        padding: SPACING.sm,
                        background: checked ? COLORS.greenBg : COLORS.bgAlt,
                        border: `1px solid ${checked ? COLORS.green + '44' : COLORS.border}`,
                        borderRadius: RADIUS.sm,
                        cursor: 'pointer',
                        transition: 'background 150ms, border-color 150ms',
                      }}
                    >
                      <input
                        type="checkbox"
                        id={`check-${c.label}`}
                        className="ce-check-input"
                        checked={checked}
                        onChange={() => toggleCheck(c.label)}
                        style={{ width: 18, height: 18, marginTop: 2, flexShrink: 0, accentColor: COLORS.green, cursor: 'pointer' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
                          <span style={{ fontSize: FONT.size.xs, fontWeight: FONT.weight.bold, color: COLORS.accent2, padding: '2px 6px', background: COLORS.bg, borderRadius: 4 }}>
                            {i + 1}
                          </span>
                          <span style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.bold, color: COLORS.accent }}>
                            {c.criteria}
                          </span>
                        </div>
                        <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0, lineHeight: FONT.lineHeight.base }}>
                          {c.question}
                        </p>
                        {!checked && (
                          <p style={{ fontSize: FONT.size.xs, color: COLORS.red, margin: `${SPACING.xs}px 0 0`, fontStyle: 'italic' }}>
                            {c.fallback}
                          </p>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
              {checkedCount === CHECKLIST.length && (
                <div style={{ ...S.boxSuccess, marginTop: SPACING.md, marginBottom: 0 }}>
                  <p style={{ fontSize: FONT.size.sm, color: COLORS.green, fontWeight: FONT.weight.semibold, margin: 0 }}>
                    ✓ 6가지 기준을 모두 충족했습니다. 최종 자기소개가 완성되었습니다.
                  </p>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: SPACING.sm, marginTop: SPACING.md }}>
              <button onClick={() => { setCurrentPart(PARTS.length - 1); window.scrollTo(0,0); }} style={S.btnSecondary}>
                이전
              </button>
              <button onClick={() => window.__CE_RESET?.fn?.()} title="이 워크북 작성 내용을 모두 지우고 처음부터 다시 작성" style={{ background: 'transparent', color: COLORS.red, border: `1px solid ${COLORS.red}66`, borderRadius: 10, padding: '0 14px', fontSize: 16, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', height: 40, display: 'inline-flex', alignItems: 'center', marginRight: 6 }}>삭제하고 다시 작성</button><button onClick={goHome} title="처음 페이지로 이동 (작성 내용 유지)" style={{ background: 'transparent', color: COLORS.sub, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: '0 14px', fontSize: 16, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', height: 40, display: 'inline-flex', alignItems: 'center' }}>처음으로</button>
              <button onClick={downloadFinal} style={{ ...S.btnPrimary, flex: 1, padding: '18px 32px', fontSize: FONT.size.lg }}>
                최종본 다운로드 (.docx)
              </button>
            </div>

            {downloadSuccess && (
              <p style={{ fontSize: FONT.size.sm, color: COLORS.green, textAlign: 'center', marginTop: SPACING.md, fontWeight: FONT.weight.semibold }}>✓ 다운로드 완료</p>
            )}

          </div>
          <StickyFooter />
        </div>
      </div>
    );
  }

  // ══════════════════ 메인 STEP 화면 ══════════════════
  const s = PARTS[currentPart];
  return (
    <div style={S.page}>
      <FocusStyles />
      <div style={S.container}>
        <div style={S.headerSticky}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: SPACING.base, marginBottom: SPACING.sm, flexWrap: 'wrap' }}>
            <CELockupA height={32} />
            <div style={{ position: 'relative', flex: 1, display: 'flex', justifyContent: 'center' }}>
              
              
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, whiteSpace: 'nowrap', flexShrink: 0 }}>
              <button onClick={() => window.__CE_RESET?.fn?.()} title="이 워크북 작성 내용을 모두 지우고 처음부터 다시 작성" style={{ background: 'transparent', color: COLORS.red, border: `1px solid ${COLORS.red}66`, borderRadius: 10, padding: '0 14px', fontSize: 16, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', height: 40, display: 'inline-flex', alignItems: 'center', marginRight: 6 }}>삭제하고 다시 작성</button><button onClick={goHome} title="처음 페이지로 이동 (작성 내용 유지)" style={{ background: 'transparent', color: COLORS.sub, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: '0 14px', fontSize: 16, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', height: 40, display: 'inline-flex', alignItems: 'center' }}>처음으로</button>
              
              
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.sm }}>
            <div style={{ ...S.progressTrack, flex: 1 }}>
              <div style={{ ...S.progressBar, width: progress + '%' }} />
            </div>
            <span style={{ fontSize: FONT.size.xs, color: COLORS.sub, minWidth: 40, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{Math.round(progress)}%</span>
          </div>
        </div>

        {downloadSuccess && (
          <div style={{ ...S.boxSuccess, marginBottom: SPACING.md, textAlign: 'center' }}>
            <p style={{ fontSize: FONT.size.sm, color: COLORS.green, fontWeight: FONT.weight.semibold, margin: 0 }}>✓ 백업 .docx 파일을 내려받았습니다</p>
          </div>
        )}

        {/* ═══ PART 탭 인디케이터 (가이드 PART 7-6) ═══ */}
        <div style={{ marginBottom: SPACING.md }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: 4 }}>
            {PARTS.map((s, i) => (
              <button key={i} onClick={() => { setCurrentPart(i); window.scrollTo(0, 0); }}
                style={{
                  fontSize: 16, padding: '4px 10px', borderRadius: 999, border: 'none', cursor: 'pointer',
                  fontWeight: i === currentPart ? FONT.weight.bold : FONT.weight.medium,
                  background: i === currentPart ? COLORS.accent : i < currentPart ? COLORS.greenBg : 'transparent',
                  color: i === currentPart ? COLORS.white : i < currentPart ? COLORS.green : COLORS.sub,
                  fontFamily: FONT.family, whiteSpace: 'nowrap', flexShrink: 0,
                }}
                title={`${s.part}. ${s.title.split('—')[0].trim()} (${stepQuestionRanges[i]})`}>
                {i < currentPart ? '✓ ' : ''}PART {s.part}. {s.title.split('—')[0].trim()}
              </button>
            ))}
          </div>
        </div>

        <div style={S.cardLarge}>
          <div style={{ marginBottom: SPACING.lg }}>
            <div style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: 4, background: COLORS.accent, color: COLORS.white, fontSize: FONT.size.xs, fontWeight: 700, marginBottom: SPACING.sm }}>PART {s.part}</div>
            <h2 style={S.h2}>{s.title}</h2>
            {s.intro && (
              <p style={{ ...S.subtitle, marginTop: SPACING.sm }}>{s.intro}</p>
            )}
            {s.part === 1 && (
              <div style={{ background: COLORS.cream, borderLeft: `4px solid ${COLORS.accent2}`, borderRadius: RADIUS.sm, padding: SPACING.md, marginTop: SPACING.md }}>
                <p style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.bold, color: COLORS.goldDeep, margin: 0, marginBottom: SPACING.sm }}>1분 자기소개의 핵심</p>
                <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0, lineHeight: FONT.lineHeight.relaxed, marginBottom: SPACING.sm }}>
                  면접관이 1분 안에 확인하고 싶은 건 — <strong>"이 사람이 이 직무에 어떻게 기여할 사람인가"</strong>. 자랑·나열이 아니라 아래 3가지가 첫 문장 한 줄로 정리되어야 합니다.
                </p>
                <ol style={{ fontSize: FONT.size.sm, color: COLORS.accent, paddingLeft: 20, margin: 0, lineHeight: FONT.lineHeight.relaxed }}>
                  <li><strong>직무 관련 경험으로 쌓은 핵심 역량 1개</strong> — 경험으로 증명되는 강점</li>
                  <li><strong>그 역량으로 이 직무에 할 수 있는 기여</strong> — 직무 연결</li>
                  <li><strong>위 둘을 묶어 이름으로 마무리</strong> — "…할 수 있는 ○○○입니다"</li>
                </ol>
                <div style={{ background: COLORS.bg, borderRadius: RADIUS.sm, padding: SPACING.sm, marginTop: SPACING.sm, border: `1px solid ${COLORS.border}` }}>
                  <p style={{ fontSize: FONT.size.xs, fontWeight: FONT.weight.semibold, color: COLORS.accent, margin: 0, marginBottom: 4 }}>좋은 예시</p>
                  <p style={{ fontSize: FONT.size.xs, color: COLORS.accent, margin: 0, lineHeight: FONT.lineHeight.base, fontStyle: 'italic' }}>
                    {IS_EXPERIENCED_VARIANT
                      ? "전력 회로를 5년간 설계하며 DC-DC 컨버터 손실을 측정으로 분해·재설계한 경험으로, 이 직무의 전원 효율 개선에 기여할 수 있는 5년차 김경력입니다."
                      : "자작자동차 동아리에서 SolidWorks로 서스펜션 브래킷을 설계·도면화하며 공차·구조 검토 역량을 쌓아, 이 직무에서 설계 단계부터 양산성을 확보하는 데 기여할 수 있는 김지원입니다."}
                  </p>
                  <p style={{ fontSize: 11, color: COLORS.sub, margin: '6px 0 0' }}>
                    {IS_EXPERIENCED_VARIANT
                      ? '→ "DC-DC 컨버터 손실 재설계 경험"이 핵심 역량 · "전원 효율 개선에 기여"가 직무 기여 · "…할 수 있는 김경력입니다"가 이름 마무리'
                      : '→ "SolidWorks로 서스펜션 브래킷을 설계한 경험"이 핵심 역량 · "설계 단계부터 양산성 확보에 기여"가 직무 기여 · "…할 수 있는 김지원입니다"가 이름 마무리'}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.lg }}>
            {s.questions.map((q, i) => (
              <div key={q.label} style={{ borderLeft: `3px solid ${COLORS.accent2}`, paddingLeft: SPACING.md }}>
                <div style={{ marginBottom: SPACING.sm }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: SPACING.sm, marginBottom: 4 }}>
                    <span style={{ fontSize: FONT.size.md, fontWeight: FONT.weight.bold, color: COLORS.accent2, whiteSpace: 'nowrap' }}>{q.label}.</span>
                    <span style={{ fontSize: FONT.size.base, fontWeight: FONT.weight.semibold, color: COLORS.accent, lineHeight: FONT.lineHeight.base, flex: 1 }}>{q.question}</span>
                  </div>
                  {q.tip && (
                    <div style={{ display: 'flex', gap: 6, marginTop: 6, paddingLeft: 20 }}>
                      <span style={{ fontSize: FONT.size.xs, color: COLORS.sub, lineHeight: FONT.lineHeight.base, fontStyle: 'italic' }}>{q.tip}</span>
                    </div>
                  )}
                  {q.checkpoint && (
                    <div style={{ background: COLORS.bgAlt, padding: '6px 10px', borderRadius: RADIUS.sm, fontSize: FONT.size.xs, color: COLORS.sub, marginTop: 6, marginLeft: 20, lineHeight: FONT.lineHeight.base }}>
                      <strong style={{ color: COLORS.accent }}>채용담당자 체크:</strong> {q.checkpoint}
                    </div>
                  )}
                </div>

                {/* 이전 답변 참고 (INFO) — 같은 STEP 안의 Q는 바로 위에 보이므로 제외 */}
                {(() => {
                  if (!q.referenceQuestions || q.referenceQuestions.length === 0) return null;
                  const sameStepLabels = new Set(s.questions.map(x => x.label));
                  const otherStepRefs = q.referenceQuestions.filter(rid => !sameStepLabels.has(rid) && answers[rid]?.trim());
                  if (otherStepRefs.length === 0) return null;
                  return (
                    <div style={{ ...S.boxInfo, borderLeft: `3px solid ${COLORS.blue}`, marginBottom: SPACING.sm }}>
                      <p style={{ ...labelStyle(COLORS.blue), marginBottom: SPACING.sm }}>INFO · 참고: 이전 답변</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.sm }}>
                        {otherStepRefs.map(rid => {
                          const answer = answers[rid];
                          let refQuestion = '';
                          for (const st of PARTS) {
                            const rq = st.questions.find(x => x.label === rid);
                            if (rq) { refQuestion = rq.question; break; }
                          }
                          return (
                            <div key={rid} style={{ background: COLORS.bg, padding: SPACING.sm, borderRadius: RADIUS.sm, fontSize: FONT.size.sm }}>
                              <p style={{ fontWeight: FONT.weight.semibold, color: COLORS.accent, margin: 0, marginBottom: 4 }}>
                                [{rid}] {refQuestion}
                              </p>
                              <p style={{ color: COLORS.sub, margin: 0, fontStyle: 'italic', lineHeight: FONT.lineHeight.base, whiteSpace: 'pre-wrap' }}>
                                {answer.length > 200 ? answer.substring(0, 200) + '...' : answer}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                <ExampleToggle text={EXAMPLES[q.label] || q.placeholder} />
                <textarea
                  key={`${q.label}-${resetCounter}`}
                  className="ce-textarea"
                  value={answers[q.label] || ''}
                  onChange={e => setAnswer(q.label, e.target.value)}
                  rows={q.label === 'Q12' || q.label === 'Q13' || q.label === 'Q18' || q.label === 'Q19' || q.label === 'Q20' ? 6 : 3}
                  style={S.textarea}
                  placeholder={q.placeholder || '답변을 입력하세요'}
                />
                {(q.label === 'Q18' || q.label === 'Q19' || q.label === 'Q20') && (
                  <p style={{ fontSize: FONT.size.xs, color: COLORS.sub, textAlign: 'right', margin: '4px 0 0', fontVariantNumeric: 'tabular-nums' }}>
                    {(answers[q.label] || '').length}자
                  </p>
                )}
                {(q.label === 'Q19' || q.label === 'Q20') && (
                  <AnswerQualityCheck text={answers[q.label]} focusArea={['autonomy', 'number', 'connection']} />
                )}
              </div>
            ))}
          </div>

          {s.stuckNote && (
            <div style={{ marginTop: SPACING.lg }}>
              <button
                onClick={() => setShowStuckHint(p => ({ ...p, [s.part]: !p[s.part] }))}
                style={{ ...S.btnText, fontSize: FONT.size.sm }}
              >
                {showStuckHint[s.part] ? '진단 닫기' : '막혔을 때 진단 보기'}
              </button>
              {showStuckHint[s.part] && (
                <div style={{ ...S.boxWarning, marginTop: SPACING.sm }}>
                  <p style={{ ...labelStyle(COLORS.red), marginBottom: SPACING.sm }}>막혔을 때 진단</p>
                  <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0, lineHeight: FONT.lineHeight.base, whiteSpace: 'pre-line' }}>{s.stuckNote}</p>
                  {/* 인라인 참고 워크북 (가이드 PART 7-15) - PART 단위 통합 추천 */}
                  {(() => {
                    const allRelated = (s.questions || []).flatMap(q => q.relatedWorkbooks || []);
                    const unique = [...new Set(allRelated)];
                    return unique.length > 0 ? <RelatedWorkbookInline ids={unique.slice(0, 3)} /> : null;
                  })()}
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: SPACING.base, marginTop: SPACING.xl }}>
            <button onClick={() => { 
              if (currentPart === 0) { setShowIntro(true); window.scrollTo(0,0); }
              else { setCurrentPart(i => i-1); window.scrollTo(0,0); }
            }} style={S.btnSecondary}>
              이전
            </button>
            <button onClick={() => { setCurrentPart(i => i+1); window.scrollTo(0,0); }} style={{ ...S.btnPrimary, flex: 1 }}>
              다음 </button>
          </div>
        </div>

        <StickyFooter />
      </div>
    </div>
  );
};

export default SelfIntroWorkbook;
