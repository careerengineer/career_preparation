// 공통 자소서 엔진 — 6개 자소서 워크북이 공유. 워크북별 값은 config로 주입(동작은 기존 코드 보존).
import { useState, useEffect, useRef } from 'react';
import { COLORS, FONT, SPACING, RADIUS } from '../../shared/design/tokens.js';
import { AnswerQualityCheck, JdBridgeGuide } from '../../shared/components/AnswerQualityCheck.jsx';
import { ReferenceInline } from '../../shared/components/ReferenceInline.jsx';
import { ExampleToggle } from '../../shared/components/ExampleToggle.jsx';
import { ToggleLink } from '../../shared/components/ToggleLink.jsx';
import { buildWorkbookBackupParagraphs, buildWorkbookPayload, buildCopyrightParagraphs } from '../../store/docxBackup.js';
import { CE_SYMBOL_B64, _INTRO_FONT } from '../_shared/brandKit.jsx';

// 멘토링·컨설팅 URL 상수 (작업 18: URL 상수화)
// ══════════════════════════════════════════════════════════════
//  CareerEngineer 지원동기 작성 워크북
//  — 3라운드 체계적 작성 시스템
//  — 공식 디자인 토큰 내장형 (Standalone)
//  — 기준 문서: careerengineer-theme.js v1.0
// ══════════════════════════════════════════════════════════════

// ────────────────────────────────────────────────────────────
//  CAREERENGINEER 공식 디자인 토큰
//  (careerengineer-theme.js의 내용을 그대로 내장)
// ────────────────────────────────────────────────────────────

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

const RelatedWorkbookList = ({ items, title = '함께 보면 좋은 워크북' }) => (
  <div style={{
    background: COLORS.bg, border: `1px solid ${COLORS.border}`,
    borderRadius: RADIUS.base, padding: 16, marginTop: 12, marginBottom: 12,
  }}>
    <p style={{
      fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold,
      color: COLORS.accent, margin: 0, marginBottom: 10,
      letterSpacing: 0.3,
    }}>{title}</p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((item, i) => (
        <RelatedWorkbook key={i} id={item.id} hint={item.hint} />
      ))}
    </div>
  </div>
);

const BOX = {
  tip:     { background: COLORS.yellowBg, border: `1px solid ${COLORS.yellow}33`, color: COLORS.accent },
  warning: { background: COLORS.redBg,    border: `1px solid ${COLORS.red}33`,    color: COLORS.accent },
  success: { background: COLORS.greenBg,  border: `1px solid ${COLORS.green}33`,  color: COLORS.accent },
  info:    { background: COLORS.blueBg,   border: `1px solid ${COLORS.blue}33`,   color: COLORS.accent },
};

const BUTTON = {
  primary: {
    background: COLORS.accent, color: COLORS.white, border: 'none',
    borderRadius: RADIUS.md, padding: '14px 32px',
    fontSize: FONT.size.md, fontWeight: FONT.weight.semibold, cursor: 'pointer',
  },
  secondary: {
    background: COLORS.white, color: COLORS.accent, border: `1px solid ${COLORS.border}`,
    borderRadius: RADIUS.md, padding: '14px 32px',
    fontSize: FONT.size.md, fontWeight: FONT.weight.medium, cursor: 'pointer',
  },
  text: {
    background: 'transparent', color: COLORS.accent2, border: 'none',
    padding: '8px 0', fontSize: FONT.size.base, fontWeight: FONT.weight.medium,
    cursor: 'pointer', textDecoration: 'underline',
  },
};

// ══════════════════════════════════════════════════════════════
//  워크북 컴포넌트
// ══════════════════════════════════════════════════════════════

export const EssayWorkbook = ({ config }) => {
  const {
    workbookKey, storageKey, focusArea,
    docxTitle, docxPayloadTitle, fileNamePrefix, completedHeader, completedEditLabel,
    round1Steps, round2Questions, round3Questions,
    intro,
  } = config;
  const [showIntro, setShowIntro] = useState(true);
  const [currentPhase, setCurrentPhase] = useState('round1');
  // currentPart: 이 워크북 "내부" PART 인덱스 (대시보드 상위 STEP 0~5와 무관). 저장 키도 currentPart, 단 구버전(currentStep) 저장본 호환을 위해 로드 시 둘 다 읽음.
  const [currentPart, setCurrentPart] = useState(() => { try { const __d = JSON.parse(localStorage.getItem(storageKey) || '{}'); return (__d.basicInfo && (__d.basicInfo.industry || __d.basicInfo.position || __d.basicInfo.company)) ? 1 : 0; } catch { return 0; } });
  const [selectedSteps, setSelectedSteps] = useState([]);
  const [showGuide, setShowGuide] = useState({});
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [showRawAnswers, setShowRawAnswers] = useState(false);
  const [finalText, setFinalText] = useState('');
  const [checklistState, setChecklistState] = useState({});
  const [basicInfo, setBasicInfo] = useState({ industry: '', position: '', company: '' });
  const [answers, setAnswers] = useState({});
  const [confirmingClear, setConfirmingClear] = useState(false);

  // 자동 저장 키
  const STORAGE_KEY = storageKey;

  // 페이지 로드 시 저장된 데이터 자동 복구
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.answers && Object.keys(data.answers).length > 0) {
          const savedDate = data.savedAt ? new Date(data.savedAt).toLocaleString('ko-KR') : '이전';
          if (true /* auto-restore */) {
            setAnswers(data.answers || {});
            if (data.basicInfo) setBasicInfo(data.basicInfo);
            if (data.finalText) setFinalText(data.finalText);
            if (data.checklistState) setChecklistState(data.checklistState);
            if (data.selectedSteps) setSelectedSteps(data.selectedSteps);
            if (data.currentPhase) setCurrentPhase(data.currentPhase);
            // 하위호환: 신규 저장본은 currentPart, 구버전 저장본·기존 다운로드 파일은 currentStep 키 → 둘 다 읽어 작성 위치 유실 0.
            if (typeof (data.currentPart ?? data.currentStep) === 'number') setCurrentPart(data.currentPart ?? data.currentStep);
            if (data.showIntro === false) setShowIntro(false);
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      }
    } catch (e) {
      console.warn('자동 복구 실패:', e);
    }
  }, []);

  // 데이터 변경 시 자동 저장 (디바운스 1초)
  useEffect(() => {
    if (Object.keys(answers).length === 0 && !finalText && !(basicInfo?.industry || basicInfo?.position || basicInfo?.company)) return;
    
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          answers, basicInfo, finalText, checklistState, selectedSteps,
          currentPhase, currentPart, showIntro,
          savedAt: new Date().toISOString()
        }));
      } catch (e) {
        console.warn('자동 저장 실패:', e);
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [answers, basicInfo, finalText, checklistState, selectedSteps, currentPhase, currentPart, showIntro]);

  // 저장된 데이터 초기화
  const clearSavedData = () => {
    if (confirmingClear) {
      localStorage.removeItem(STORAGE_KEY);
      setAnswers({});
      setBasicInfo({ industry: '', position: '', company: '' });
      setFinalText('');
      setConfirmingClear(false);
      setTimeout(() => { localStorage.removeItem(STORAGE_KEY); }, 50);
      setTimeout(() => { localStorage.removeItem(STORAGE_KEY); }, 1500);
    } else {
      setConfirmingClear(true);
      setTimeout(() => setConfirmingClear(false), 5000);
    }
  };

  // 인라인 참고 워크북 (가이드 PART 7-15)
  const RelatedWorkbookInline = ReferenceInline; // master 기반 inline 참고 패널 (shared)

  // ── 핸들러 ─────────────────────────────────────────────────
  const handleAnswerChange = (qid, val) => setAnswers(p => ({ ...p, [qid]: val }));
  const handleBasicInfoChange = (f, v) => setBasicInfo(p => ({ ...p, [f]: v }));
  const toggleGuide = (qid) => setShowGuide(p => ({ ...p, [qid]: !p[qid] }));
  const toggleStepSelection = (sid) => setSelectedSteps(p => p.includes(sid) ? p.filter(i => i !== sid) : [...p, sid]);

  const goToNextStep = () => {
    if (currentPhase === 'round1') { if (currentPart < round1Steps.length - 1) setCurrentPart(s => s + 1); else setCurrentPhase('evaluation'); }
    else if (currentPhase === 'evaluation') { setSelectedSteps(p => [...p].sort((a, b) => a - b)); setCurrentPhase('round2'); setCurrentPart(0); }
    else if (currentPhase === 'round2') { if (currentPart < selectedSteps.length - 1) setCurrentPart(s => s + 1); else { setCurrentPhase('round3'); setCurrentPart(0); } }
    else if (currentPhase === 'round3') { if (currentPart < round3Questions.length - 1) setCurrentPart(s => s + 1); else { setFinalText(prev => (prev && prev.trim()) ? prev : config.genLetter(answers)); setCurrentPhase('completed'); } }
    window.scrollTo(0, 0);
  };
  const goToPrevStep = () => {
    if (currentPhase === 'completed') { setCurrentPhase('round3'); setCurrentPart(round3Questions.length - 1); }
    else if (currentPart > 0) setCurrentPart(s => s - 1);
    else if (currentPhase === 'round3') { setCurrentPhase('round2'); setCurrentPart(selectedSteps.length - 1); }
    else if (currentPhase === 'round2') setCurrentPhase('evaluation');
    else if (currentPhase === 'evaluation') { setCurrentPhase('round1'); setCurrentPart(round1Steps.length - 1); }
    else if (currentPhase === 'round1' && currentPart === 0) setShowIntro(true);
    window.scrollTo(0, 0);
  };

  // docx 라이브러리 동적 로드 (CDN)
  const loadDocxLib = () => new Promise((resolve, reject) => {
    if (window.docx) return resolve(window.docx);
    const sources = [
      'https://cdn.jsdelivr.net/npm/docx@9.6.1/build/index.umd.min.js',
      'https://unpkg.com/docx@9.6.1/dist/index.iife.js',
      'https://cdn.jsdelivr.net/npm/docx@9.6.1/dist/index.iife.js',
      'https://unpkg.com/docx@9.6.1/build/index.umd.min.js',
    ];
    let idx = 0;
    const tryNext = () => {
      if (idx >= sources.length) {
        reject(new Error('docx 라이브러리 다운로드 실패'));
        return;
      }
      const script = document.createElement('script');
      script.src = sources[idx++];
      script.async = true;
      script.onload = () => {
        if (window.docx) resolve(window.docx);
        else tryNext();
      };
      script.onerror = () => tryNext();
      document.head.appendChild(script);
    };
    tryNext();
  });

  // [CE-DL] 외부 WorkbookShell 버튼에서 호출 위한 등록

  const __ceDlRef = useRef(null);

  useEffect(() => {

    if (typeof window === 'undefined') return;

    window.__CE_DOWNLOAD = { fn: () => __ceDlRef.current?.(), key: workbookKey };

    return () => { if (window.__CE_DOWNLOAD?.key === workbookKey) window.__CE_DOWNLOAD = null; };

  }, []);

  const downloadFinalText = async () => {
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
      const bodyP = (t) => new Paragraph({
        children: t.split('\n').flatMap((line, i) => i === 0 ? [new TextRun({ text: line, size: 22, font: '맑은 고딕', color: '0E2750' })] : [new TextRun({ break: 1, text: line, size: 22, font: '맑은 고딕', color: '0E2750' })]),
        spacing: { before: 100, after: 280, line: 400 },
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
      const dateP = () => new Paragraph({
        children: [new TextRun({ text: '작성일 · ' + today, size: 20, font: '맑은 고딕', color: '6E7A8F' })],
        alignment: AlignmentType.RIGHT,
        spacing: { after: 80 }
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
      
      const children = config.buildDocxChildren({ basicInfo, finalText, answers }, docxLib);

      // 결과물 docx에 복원용 백업 동봉 → 이 파일 그대로 "기존 지원동기 불러오기"로 재import 가능
      try {
        const payload = buildWorkbookPayload(workbookKey, docxPayloadTitle, storageKey);
        children.push(...buildWorkbookBackupParagraphs(docxLib, payload));
      try { children.unshift(...buildCopyrightParagraphs(docxLib)); } catch (e) { console.warn('copyright skip', e); }
      } catch (e) { console.warn('[motivation] backup embed skipped:', e); }

      const doc = new Document({
        creator: '',
        title: docxTitle,
        sections: [{
          properties: { page: { margin: { top: 1400, right: 1133, bottom: 1400, left: 1133 } } },
          children: children
        }]
      });
      
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileNamePrefix}_${(basicInfo.company || '미입력').replace(/[^a-zA-Z0-9가-힣\s]/g, '_')}_${today}.docx`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setDownloadSuccess(true); setTimeout(() => setDownloadSuccess(false), 5000);
    } catch (err) {
      console.error('docx 생성 실패:', err);
      alert('.docx 파일 생성에 실패했습니다.\n' + (err.message || ''));
    }
  };

  __ceDlRef.current = downloadFinalText; // [CE-DL] ref 갱신

  // 임시저장 — 작성 중간 모든 답변을 항목별로 정리 (빈 답변도 항목명은 표시)
  const savePartial = () => {
    // 메인 다운로드와 동일한 docx 생성 (모든 답변 포함)
    downloadFinalText();
  };

  const canGoNext = () => { if (currentPhase === 'evaluation') return selectedSteps.length >= 1; return true; };
  // 진행률은 현재 단계가 아니라 실제 작성한 답변 기반
  const progress = config.computeProgress({ currentPhase, currentPart, round1Steps, round2Questions, round3Questions, selectedSteps, answers });

  // ══════════════════════════════════════════════════════════════
  //  스타일 (careerengineer-theme.js 기반)
  // ══════════════════════════════════════════════════════════════
  const S = {
    page: { minHeight: '100vh', background: COLORS.bgAlt, padding: SPACING.md, fontFamily: FONT.family, color: COLORS.accent },
    container: { maxWidth: 1350, margin: '0 auto' },
    card: { background: COLORS.bg, borderRadius: RADIUS.md, padding: SPACING.lg, border: `1px solid ${COLORS.border}`, marginBottom: SPACING.md },
    // 메인 화면 상단 헤더 (PART 7-6: 상단 고정)
    headerSticky: { background: COLORS.bgAlt, borderRadius: RADIUS.md, padding: SPACING.md, border: `1px solid ${COLORS.border}`, marginBottom: SPACING.md, position: 'sticky', top: SPACING.md, zIndex: 10, boxShadow: '0 2px 8px rgba(14, 39, 80, 0.12)' },
    cardLarge: { background: COLORS.bg, borderRadius: RADIUS.md, padding: SPACING.xl, border: `1px solid ${COLORS.border}`, marginBottom: SPACING.md },
    h1: { fontSize: FONT.size.h1, fontWeight: FONT.weight.bold, color: COLORS.accent, marginBottom: SPACING.sm, lineHeight: FONT.lineHeight.tight, margin: 0 },
    h1Center: { fontSize: FONT.size.h1, fontWeight: FONT.weight.bold, color: COLORS.accent, marginBottom: SPACING.md, lineHeight: FONT.lineHeight.tight, textAlign: 'center', margin: `0 0 ${SPACING.md}px` },
    h2: { fontSize: FONT.size.h2, fontWeight: FONT.weight.bold, color: COLORS.accent, marginBottom: SPACING.sm, lineHeight: FONT.lineHeight.tight, margin: 0 },
    h3: { fontSize: FONT.size.lg, fontWeight: FONT.weight.semibold, color: COLORS.accent, marginBottom: SPACING.sm, margin: 0 },
    brandEyebrow: { fontSize: FONT.size.xs, letterSpacing: 4, color: COLORS.sub, marginBottom: SPACING.base, textAlign: 'center', fontWeight: FONT.weight.medium },
    subtitle: { fontSize: FONT.size.base, color: COLORS.sub, lineHeight: FONT.lineHeight.base, margin: 0 },
    label: { fontSize: FONT.size.md, fontWeight: FONT.weight.semibold, color: COLORS.accent, display: 'block', marginBottom: SPACING.sm },
    hint: { fontSize: FONT.size.sm, color: COLORS.sub, marginTop: 0, marginBottom: SPACING.sm, lineHeight: FONT.lineHeight.base },
    input: { width: '100%', padding: '12px 16px', border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.base, fontSize: FONT.size.base, fontFamily: FONT.family, color: COLORS.accent, outline: 'none', boxSizing: 'border-box', background: COLORS.bg, transition: 'border-color 150ms ease, box-shadow 150ms ease' },
    textarea: { width: '100%', padding: '12px 16px', border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.base, fontSize: FONT.size.base, fontFamily: FONT.family, color: COLORS.accent, outline: 'none', resize: 'none', boxSizing: 'border-box', lineHeight: 1.7, background: COLORS.bg, transition: 'border-color 150ms ease, box-shadow 150ms ease' },
    btnPrimary: { ...BUTTON.primary, width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: FONT.family },
    btnPrimarySmall: { ...BUTTON.primary, padding: '12px 28px', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: FONT.family, fontSize: FONT.size.base },
    btnSecondary: { ...BUTTON.secondary, display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: FONT.family, fontSize: FONT.size.base, padding: '12px 24px' },
    // 저장 버튼 (헤더용 컴팩트 사이즈)
    btnSaveHeader: { background: COLORS.accent2, color: COLORS.white, border: 'none', borderRadius: RADIUS.base, padding: '0 14px', fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, cursor: 'pointer', fontFamily: FONT.family, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, whiteSpace: 'nowrap', transition: 'opacity 150ms ease', height: 36 },
    btnText: { ...BUTTON.text, display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: FONT.family, fontSize: FONT.size.sm },
    progressTrack: { width: '100%', background: COLORS.border, borderRadius: RADIUS.pill, height: 6, overflow: 'hidden' },
    progressBar: { background: COLORS.accent2, height: 6, borderRadius: RADIUS.pill, transition: 'width 500ms ease' },
    // Status boxes
    boxTip:     { ...BOX.tip,     padding: SPACING.md, borderRadius: RADIUS.base, marginBottom: SPACING.md },
    boxWarning: { ...BOX.warning, padding: SPACING.md, borderRadius: RADIUS.base, marginBottom: SPACING.md },
    boxSuccess: { ...BOX.success, padding: SPACING.md, borderRadius: RADIUS.base, marginBottom: SPACING.md },
    boxInfo:    { ...BOX.info,    padding: SPACING.md, borderRadius: RADIUS.base, marginBottom: SPACING.md },
    boxNeutral: { background: COLORS.bgAlt, padding: SPACING.md, borderRadius: RADIUS.base, border: `1px solid ${COLORS.border}` },
    // Accent labels (left border)
    accentLeft: (color) => ({ borderLeft: `3px solid ${color}`, paddingLeft: SPACING.md, background: COLORS.bg, padding: `${SPACING.base}px ${SPACING.md}px`, borderRadius: `0 ${RADIUS.base}px ${RADIUS.base}px 0` }),
    // Copyright
    copyrightWrap: { background: COLORS.bg, borderRadius: RADIUS.md, padding: SPACING.md, border: `1px solid ${COLORS.border}`, marginBottom: SPACING.md, marginTop: SPACING.lg },
    copyrightText: { fontSize: FONT.size.xs, color: COLORS.sub, textAlign: 'center', margin: 0, lineHeight: FONT.lineHeight.base },
    copyrightWarn: { fontSize: FONT.size.xs, color: COLORS.red, textAlign: 'center', marginTop: 8, fontWeight: FONT.weight.medium, lineHeight: FONT.lineHeight.base },
  };

  const labelStyle = (color) => ({ fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color, margin: 0, letterSpacing: 0.5, textTransform: 'uppercase' });

  // ══════════ 사용 안내 팝업 (PART 7-8) ══════════
  const [showHelp, setShowHelp] = useState(true);

  // [CE-HOME] WorkbookShell '처음으로' 버튼에서 호출

  const __ceHomeRef = useRef(null);

  useEffect(() => {

    if (typeof window === 'undefined') return;

    window.__CE_HOME = { fn: () => __ceHomeRef.current?.(), key: workbookKey };

    return () => { if (window.__CE_HOME?.key === workbookKey) window.__CE_HOME = null; };

  }, []);

  const goHome = () => {
    setShowIntro(true);
    setCurrentPart(0);
    setCurrentPhase('round1');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  __ceHomeRef.current = goHome; // [CE-HOME] ref 갱신
  const FirstVisitModal = ({ open, onClose, title, steps }) => {
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

  // ══════════ 하단 고정 저작권 + 문의 블록 (PART 7-8, 11) ══════════
  const StickyFooter = () => (
    <div style={{ position: 'sticky', bottom: 0, background: COLORS.bg, borderTop: `1px solid ${COLORS.border}`, padding: `${SPACING.sm}px ${SPACING.md}px`, marginTop: SPACING.lg, marginLeft: -SPACING.md, marginRight: -SPACING.md, marginBottom: -SPACING.md, zIndex: 5 }}>
      <div style={{ maxWidth: 1350, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: SPACING.sm, flexWrap: 'wrap' }}>
        <p style={{ fontSize: 16, color: COLORS.sub, margin: 0 }}>
          <a href={`https://open.kakao.com/me/careerengineer`} target="_blank" rel="noopener noreferrer" style={{ color: COLORS.accent2, textDecoration: 'none' }}>CareerEngineer 카카오톡 상담</a>
        </p>
      </div>
    </div>
  );

  // ══════════ 글로벌 CSS (focus 상태 · input/textarea) ══════════
  const FocusStyles = () => (
    <style>{`
      .ce-input:focus, .ce-textarea:focus, .ce-select:focus {
        border-color: ${COLORS.accent2} !important;
        box-shadow: 0 0 0 3px rgba(201, 168, 106, 0.12) !important;
      }
      .ce-save-btn:hover { opacity: 0.88; }
    `}</style>
  );

  // ══════════════════════════════════════════════════════════════
  //  CE 로고 (정식 PNG base64 임베딩)
  //  - 가이드 PART 1-4-1 정식 마스터 파일 사용 (스크린캡처 아님)
  //  - 심볼: 102×96px → UI 헤더 32~40px로 표시 (Retina 대응)
  //  - 락업: 389×80px → A 락업 표시
  // ══════════════════════════════════════════════════════════════
    const CE_LOCKUP_B64 = "data:image/png;base64,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";

  // CE 심볼만 (C 락업 - 24px 이하 또는 작은 영역)
  const CESymbol = ({ size = 32 }) => (
    <img
      src={CE_SYMBOL_B64}
      alt="CareerEngineer 심볼"
      style={{ height: size, width: 'auto', flexShrink: 0, display: 'inline-block' }}
    />
  );

  // CE 심볼 + 워드마크 A 락업 (가이드 PART 1-4-2 기본 락업)
  const CELockupA = ({ height = 32 }) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: height * 0.2, height: height, lineHeight: 1, flexShrink: 0 }}>
      <img src={CE_SYMBOL_B64} alt="" aria-hidden="true" style={{ height: height, width: 'auto', display: 'block' }} />
      <span style={{ fontFamily: '"Pretendard", -apple-system, BlinkMacSystemFont, system-ui, sans-serif', fontWeight: 700, fontSize: height * 0.62, letterSpacing: '-0.028em', whiteSpace: 'nowrap' }} aria-label="CareerEngineer">
        <span style={{ color: '#0E2750' }}>Career</span><span style={{ color: '#C9A86A' }}>Engineer</span>
      </span>
    </span>
  );

// ════════════════════════════════════════════════════════════
//  표준 Intro 페이지 컴포넌트 — 통일 7-Block 구조
//  (Brand Standards v1.0 + 통일 방안 v1.0 적용)
// ════════════════════════════════════════════════════════════
const _INTRO_INK = '#0E2750';
const _INTRO_INK2 = '#1B3A6B';
const _INTRO_PAPER = '#F2F1EC';
const _INTRO_GOLD = '#C9A86A';
const _INTRO_MUTE = '#565F72';

const BrandHero = () => (
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

const IntroCTA = ({ onClick, children }) => (
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

const IntroFlowCard = ({ flow, flowTitle }) => {
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

const IntroCopyright = () => (
  <div style={{ background: _INTRO_PAPER, border: `1px solid ${_INTRO_INK}33`, color: _INTRO_INK, padding: 16, borderRadius: 10, marginBottom: 16 }}>
    <p style={{ fontSize: 16, color: _INTRO_INK, fontWeight: 700, margin: 0, lineHeight: 1.6 }}>
      작성 내용은 이 브라우저에서만 자동 저장됩니다. 백업하거나 다른 기기에서 이어 쓰려면 상단의 '저장 (.docx)' 버튼으로 파일을 내려받고, '불러오기' 버튼으로 복원할 수 있습니다.
    </p>
  </div>
);

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

  // ══════════════════════════════════════════════════════════════
  //  인트로 화면
  // ══════════════════════════════════════════════════════════════
      if (showIntro) return (
    <IntroPage
      workbookKey={workbookKey}
      stepLabel={intro.stepLabel}
      title={intro.title}
      subtitle={intro.subtitle}
      flow={intro.flow}
      flowTitle={intro.flowTitle}
      prerequisites={intro.prerequisites}
      helpModal={<FirstVisitModal open={showHelp} onClose={() => setShowHelp(false)} title={intro.helpTitle} steps={intro.helpSteps} />}
      onStart={() => { setShowIntro(false); }}
    />
  );

  // ══════════════════════════════════════════════════════════════
  //  평가 화면 (1라운드 종료 후)
  // ══════════════════════════════════════════════════════════════
  if (currentPhase === 'evaluation') return (
    <div style={S.page}>
      <FocusStyles />
      <div style={S.container}>
        <div style={S.headerSticky}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: SPACING.base, flexWrap: 'wrap' }}>
            <CELockupA height={32} />
            <div style={{ position: 'relative', flex: 1, display: 'flex', justifyContent: 'center' }}>
              
              
            </div>
            <button onClick={() => window.__CE_RESET?.fn?.()} title="이 워크북 작성 내용을 모두 지우고 처음부터 다시 작성" style={{ background: 'transparent', color: COLORS.red, border: `1px solid ${COLORS.red}66`, borderRadius: 10, padding: '0 14px', fontSize: 16, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', height: 40, display: 'inline-flex', alignItems: 'center', marginRight: 6 }}>삭제하고 다시 작성</button><button onClick={goHome} title="처음 페이지로 이동 (작성 내용 유지)" style={{ background: 'transparent', color: COLORS.sub, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: '0 14px', fontSize: 16, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', height: 40, display: 'inline-flex', alignItems: 'center' }}>처음으로</button>
            
            
          </div>
        </div>

        <div style={S.cardLarge}>
          <p style={S.brandEyebrow}>{config.evaluationEyebrow}</p>
          <h2 style={{ ...S.h2, textAlign: 'center', marginBottom: SPACING.sm }}>1라운드 완료</h2>
          <p style={{ ...S.subtitle, textAlign: 'center', marginBottom: SPACING.lg }}>부족한 Q를 선택해 2라운드 심화 질문에 답변하세요</p>

          <div style={S.boxTip}>
            <p style={{ ...labelStyle(COLORS.yellow), marginBottom: SPACING.sm }}>TIP · 선택 기준</p>
            <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0 }}>3초 자가진단 통과가 어려웠던 질문을 우선 선택하세요.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.base, marginBottom: SPACING.xl }}>
            {round1Steps.slice(1).map(step => {
              const sid = step.id, sel = selectedSteps.includes(sid);
              return (
                <div key={sid} style={{ border: `2px solid ${sel ? COLORS.accent2 : COLORS.border}`, background: sel ? COLORS.blueBg : COLORS.bg, borderRadius: RADIUS.base, padding: SPACING.md, transition: 'all 200ms' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: SPACING.md }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: FONT.size.md, fontWeight: FONT.weight.bold, color: COLORS.accent, margin: 0, marginBottom: 4 }}>{step.title}</h3>
                      <p style={{ fontSize: FONT.size.sm, color: COLORS.sub, margin: 0, marginBottom: SPACING.sm }}>{step.subtitle}</p>
                      <div style={{ background: COLORS.bgAlt, borderRadius: RADIUS.sm, padding: SPACING.sm, fontSize: FONT.size.sm, color: COLORS.accent, lineHeight: FONT.lineHeight.base }}>
                        <strong>내 답변:</strong> {answers[step.questions[0].id]?.substring(0, 200) || '(답변 없음)'}
                        {answers[step.questions[0].id]?.length > 200 && '...'}
                      </div>
                    </div>
                    <button onClick={() => toggleStepSelection(sid)} style={{ padding: '10px 18px', borderRadius: RADIUS.base, fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, border: 'none', cursor: 'pointer', background: sel ? COLORS.accent2 : COLORS.border, color: sel ? COLORS.white : COLORS.accent, whiteSpace: 'nowrap', fontFamily: FONT.family }}>
                      {sel ? '✓ 선택됨' : '심화 선택'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: SPACING.base }}>
            <button onClick={goToPrevStep} style={S.btnSecondary}>이전</button>
            <button onClick={goToNextStep} disabled={!canGoNext()} style={{ ...S.btnPrimary, flex: 1, opacity: canGoNext() ? 1 : 0.4, cursor: canGoNext() ? 'pointer' : 'not-allowed' }}>
              2라운드 시작 ({selectedSteps.length}개 선택) </button>
          </div>
        </div>

      <StickyFooter />
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════
  //  완성 화면
  // ══════════════════════════════════════════════════════════════
  if (currentPhase === 'completed') return (
    <div style={S.page}>
      <FocusStyles />
      <div style={S.container}>
        <div style={S.headerSticky}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: SPACING.base, flexWrap: 'wrap' }}>
            <CELockupA height={32} />
            <div style={{ position: 'relative', flex: 1, display: 'flex', justifyContent: 'center' }}>
              
              
            </div>
            <button onClick={() => window.__CE_RESET?.fn?.()} title="이 워크북 작성 내용을 모두 지우고 처음부터 다시 작성" style={{ background: 'transparent', color: COLORS.red, border: `1px solid ${COLORS.red}66`, borderRadius: 10, padding: '0 14px', fontSize: 16, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', height: 40, display: 'inline-flex', alignItems: 'center', marginRight: 6 }}>삭제하고 다시 작성</button><button onClick={goHome} title="처음 페이지로 이동 (작성 내용 유지)" style={{ background: 'transparent', color: COLORS.sub, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: '0 14px', fontSize: 16, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', height: 40, display: 'inline-flex', alignItems: 'center' }}>처음으로</button>
            
            
          </div>
        </div>

        <div style={S.cardLarge}>
          {/* 완성 헤더 (SUCCESS) */}
          <div style={{ textAlign: 'center', marginBottom: SPACING.xl }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, background: COLORS.greenBg, borderRadius: RADIUS.pill, marginBottom: SPACING.base }}>
              </div>
            <h2 style={{ ...S.h2, textAlign: 'center', marginBottom: 4 }}>{completedHeader}</h2>
            <p style={S.subtitle}>아래 내용을 확인하고 자유롭게 수정하세요</p>
          </div>

          {/* 기본 정보 */}
          <div style={{ ...S.boxNeutral, textAlign: 'center', marginBottom: SPACING.lg }}>
            <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0 }}>
              {config.basicInfoFields.map(([f], i) => (<span key={f}>{i > 0 ? ' / ' : ''}<strong>{basicInfo[f]}</strong></span>))}
            </p>
          </div>

          {/* 다운로드 경고 (WARNING) */}
          <div style={S.boxWarning}>
            <p style={{ ...labelStyle(COLORS.red), marginBottom: SPACING.sm }}>WARNING · 반드시 다운로드하세요</p>
            <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0, lineHeight: FONT.lineHeight.base }}>
              새로고침하면 <strong>모든 내용이 삭제</strong>됩니다. 아래 <strong>"다운로드 (.docx)"</strong> 버튼을 눌러 저장하세요.
            </p>
          </div>

          {/* 완성된 지원동기 */}
          <div style={{ background: COLORS.bgAlt, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.base, padding: SPACING.md, marginBottom: SPACING.lg }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.base }}>
              <h3 style={{ ...S.h3, display: 'flex', alignItems: 'center', gap: 8 }}>
                {completedEditLabel}
              </h3>
              <button onClick={() => setShowRawAnswers(!showRawAnswers)} style={S.btnText}>
                {showRawAnswers ? '원본 숨기기' : '원본 보기'}
              </button>
            </div>

            {/* 활용 가이드 (INFO) — config.completedGuide 기반 */}
            <div style={{ ...S.boxInfo, marginBottom: SPACING.md }}>
              <p style={{ ...labelStyle(COLORS.blue), marginBottom: SPACING.sm }}>{config.completedGuide.headerLabel}</p>
              <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, marginTop: 0, marginBottom: SPACING.md }}>{config.completedGuide.intro}</p>
              {config.completedGuide.sections.map((sec, si) => (
                <div key={si} style={{ background: COLORS.bg, borderLeft: `3px solid ${COLORS.accent2}`, borderRadius: `0 ${RADIUS.sm}px ${RADIUS.sm}px 0`, padding: SPACING.base, marginBottom: si < config.completedGuide.sections.length - 1 ? SPACING.sm : 0 }}>
                  <p style={{ fontSize: FONT.size.xs, fontWeight: FONT.weight.bold, color: COLORS.accent2, margin: 0, marginBottom: SPACING.sm }}>{sec.title}</p>
                  {sec.items.map((it, ii) => answers[it.key] ? (
                    <div key={ii} style={{ background: it.recommended ? COLORS.blueBg : COLORS.bgAlt, borderRadius: RADIUS.sm, padding: SPACING.sm, marginBottom: it.recommended ? 6 : 4 }}>
                      <p style={{ fontSize: FONT.size.xs, color: it.recommended ? COLORS.blue : COLORS.sub, fontWeight: FONT.weight.semibold, margin: 0 }}>{it.label}</p>
                      <p style={{ fontSize: FONT.size.xs, color: COLORS.accent, margin: 0, marginTop: 4, lineHeight: FONT.lineHeight.base }}>{answers[it.key].substring(0,200)}{answers[it.key].length>200?'...':''}</p>
                    </div>
                  ) : null)}
                  <p style={{ fontSize: FONT.size.xs, color: COLORS.accent2, margin: 0, marginTop: SPACING.sm, fontStyle: 'italic' }}>{sec.example}</p>
                </div>
              ))}
            </div>

            {/* 수정 전 최종 확인 (SUCCESS) */}
            <div style={{ ...S.boxSuccess, marginBottom: SPACING.md }}>
              <p style={{ ...labelStyle(COLORS.green), marginBottom: SPACING.sm }}>SUCCESS · 수정 전 최종 확인</p>
              <p style={{ fontSize: FONT.size.xs, color: COLORS.sub, margin: `0 0 ${SPACING.sm}px`, lineHeight: FONT.lineHeight.base }}>각 항목을 확인하며 체크하세요. 통과하지 못한 항목이 있다면 해당 Q로 돌아가 보완합니다.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {config.finalChecklist.map((item, i) => {
                  const checked = !!checklistState[i];
                  return (
                    <label key={i} style={{ display: 'flex', alignItems: 'start', gap: 8, padding: SPACING.sm, background: checked ? COLORS.bg : 'transparent', borderRadius: RADIUS.sm, border: `1px solid ${COLORS.green}20`, cursor: 'pointer' }}>
                      <input type="checkbox" checked={checked} onChange={e => setChecklistState(p => ({ ...p, [i]: e.target.checked }))} style={{ marginTop: 3, cursor: 'pointer', width: 16, height: 16, accentColor: COLORS.green }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: FONT.size.xs, fontWeight: FONT.weight.semibold, color: COLORS.accent, margin: 0, marginBottom: 4, textDecoration: checked ? 'line-through' : 'none', opacity: checked ? 0.6 : 1 }}>{item.n} {item.q}</p>
                        <p style={{ fontSize: FONT.size.xs, color: COLORS.sub, margin: 0 }}>통과 못 하면 → <span style={{ color: COLORS.accent2, fontWeight: FONT.weight.semibold }}>{item.miss}</span></p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <JdBridgeGuide />
            <textarea className="ce-textarea" value={finalText} onChange={e => setFinalText(e.target.value)} rows={20} style={{ ...S.textarea, fontFamily: `'Noto Serif KR', '맑은 고딕', 'Malgun Gothic', serif`, lineHeight: 1.8 }} />
            <p style={{ fontSize: FONT.size.xs, color: COLORS.sub, textAlign: 'right', margin: '4px 0 0', fontVariantNumeric: 'tabular-nums' }}>
              {(finalText || '').length}자
            </p>
            <AnswerQualityCheck text={finalText} focusArea={focusArea} />
          </div>

          {showRawAnswers && (
            <div style={S.boxNeutral}>
              <h4 style={{ fontSize: FONT.size.md, fontWeight: FONT.weight.semibold, color: COLORS.accent, marginTop: 0, marginBottom: SPACING.sm }}>원본 답변 참고</h4>
              <pre style={{ fontSize: FONT.size.sm, color: COLORS.accent, whiteSpace: 'pre-wrap', fontFamily: FONT.family, margin: 0, lineHeight: FONT.lineHeight.relaxed }}>{config.getRawText(answers, basicInfo)}</pre>
            </div>
          )}

          <button onClick={downloadFinalText} style={{ ...S.btnPrimary, padding: '18px 32px', fontSize: FONT.size.md, marginTop: SPACING.md }}>
            다운로드 (.docx)
          </button>

          {downloadSuccess && <p style={{ fontSize: FONT.size.sm, color: COLORS.green, textAlign: 'center', marginTop: SPACING.md, fontWeight: FONT.weight.semibold }}>✓ 다운로드 완료</p>}

          <div style={{ ...S.boxInfo, marginTop: SPACING.base, marginBottom: 0, textAlign: 'center' }}>
            <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0 }}><strong>.docx 편집 가능:</strong> .docx 파일을 Word에서 열어 자유롭게 편집하세요.</p>
          </div>

          <div style={{ marginTop: SPACING.md }}>
            <button onClick={goToPrevStep} style={S.btnSecondary}>이전</button>
          </div>
        </div>

      <StickyFooter />
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════
  //  메인 질문 화면 (1/2/3라운드 공통)
  // ══════════════════════════════════════════════════════════════
  const sd = currentPhase === 'round1'
    ? round1Steps[currentPart]
    : currentPhase === 'round2'
      ? { title: `${round1Steps[selectedSteps[currentPart]].title} - 심화`, questions: round2Questions[selectedSteps[currentPart]] }
      : { title: '3라운드: 연결 및 완성', questions: [round3Questions[currentPart]] };

  return (
    <div style={S.page}>
      <FocusStyles />
      <div style={S.container}>
        {/* ═══ 상단 고정 헤더 (PART 7-6: 워드마크 · 단계 · 저장) ═══ */}
        <div style={S.headerSticky}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: SPACING.base, marginBottom: SPACING.sm, flexWrap: 'wrap' }}>
            {/* 좌: A 락업 (심볼 + 워드마크) — 가이드 PART 1-4-6 인터랙티브 헤더 32~40px */}
            <CELockupA height={32} />
            {/* 중: 현재 단계 (클릭 시 7단계 드롭다운) */}
            <div style={{ position: 'relative', flex: 1, display: 'flex', justifyContent: 'center' }}>
              
              
            </div>
            {/* 우: 저장 버튼 */}
            <button onClick={() => window.__CE_RESET?.fn?.()} title="이 워크북 작성 내용을 모두 지우고 처음부터 다시 작성" style={{ background: 'transparent', color: COLORS.red, border: `1px solid ${COLORS.red}66`, borderRadius: 10, padding: '0 14px', fontSize: 16, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', height: 40, display: 'inline-flex', alignItems: 'center', marginRight: 6 }}>삭제하고 다시 작성</button><button onClick={goHome} title="처음 페이지로 이동 (작성 내용 유지)" style={{ background: 'transparent', color: COLORS.sub, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: '0 14px', fontSize: 16, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', height: 40, display: 'inline-flex', alignItems: 'center' }}>처음으로</button>
            
            
          </div>
          {/* 진행 바 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.sm }}>
            <div style={{ ...S.progressTrack, flex: 1 }}>
              <div style={{ ...S.progressBar, width: progress + '%' }} />
            </div>
            <span style={{ fontSize: FONT.size.xs, color: COLORS.sub, minWidth: 40, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{Math.round(progress)}%</span>
          </div>
        </div>

        {/* 저장 완료 토스트 (임시저장용) */}
        {downloadSuccess && currentPhase !== 'completed' && (
          <div style={{ ...S.boxSuccess, marginBottom: SPACING.md, textAlign: 'center' }}>
            <p style={{ fontSize: FONT.size.sm, color: COLORS.green, fontWeight: FONT.weight.semibold, margin: 0 }}>✓ 백업 .docx 파일을 내려받았습니다</p>
          </div>
        )}

        {/* ═══ 라운드 점프 탭 (가이드 PART 7-6) ═══ */}
        <div style={{ marginBottom: SPACING.md }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
            {[
              { phase: 'round1', label: '1라운드 · 핵심 질문' },
              { phase: 'round2', label: '2라운드 · 심화 질문' },
              { phase: 'round3', label: '3라운드 · 연결 및 완성' },
            ].map(({ phase, label }) => {
              const isCurrent = currentPhase === phase;
              const phaseOrder = { round1: 0, evaluation: 1, round2: 2, round3: 3, completed: 4 };
              const isPast = phaseOrder[currentPhase] > phaseOrder[phase];
              return (
                <button key={phase} onClick={() => {
                  if (phase === 'round2') {
                    setCurrentPhase('evaluation');
                  } else {
                    setCurrentPhase(phase);
                    setCurrentPart(0);
                  }
                  window.scrollTo(0, 0);
                }}
                  style={{
                    fontSize: FONT.size.sm, padding: '6px 14px', borderRadius: 999, cursor: 'pointer',
                    fontWeight: isCurrent ? FONT.weight.bold : FONT.weight.medium,
                    background: isCurrent ? COLORS.accent : isPast ? '#FBFAF6' : 'transparent',
                    color: isCurrent ? COLORS.white : isPast ? COLORS.accent2 : COLORS.sub,
                    fontFamily: FONT.family,
                    border: isPast && !isCurrent ? `1px solid ${COLORS.accent2}` : 'none',
                  }}>
                  {isPast ? '✓ ' : ''}{label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 질문 카드 */}
        <div style={S.cardLarge}>
          <h2 style={{ ...S.h2, marginBottom: SPACING.xs }}>{sd.title}</h2>
          {sd.subtitle && <p style={{ ...S.subtitle, marginBottom: SPACING.lg }}>{sd.subtitle}</p>}

          {currentPart === 0 && currentPhase === 'round1' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
              {config.basicInfoFields.map(([f, l, p]) => (
                <div key={f}>
                  <label style={S.label}>{l}</label>
                  <input type="text" className="ce-input" value={basicInfo[f]} onChange={e => handleBasicInfoChange(f, e.target.value)} style={S.input} placeholder={p} />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.lg }}>
              {sd.questions.map((q) => (
                <div key={q.id} style={{ borderBottom: `1px solid ${COLORS.border}`, paddingBottom: SPACING.lg }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: SPACING.base, marginBottom: SPACING.sm }}>
                    <label style={{ ...S.label, marginBottom: 0, flex: 1 }}>{q.label}</label>
                    {q.guide && (
                      <ToggleLink open={!!showGuide[q.id]} onToggle={() => toggleGuide(q.id)} label="가이드" />
                    )}
                  </div>

                  {q.hint && <p style={S.hint}>{q.hint}</p>}

                  {/* 이전 답변 참고 (3라운드 INFO) */}
                  {q.referenceQuestions && (
                    <div style={{ ...S.boxInfo, borderLeft: `3px solid ${COLORS.blue}` }}>
                      <p style={{ ...labelStyle(COLORS.blue), marginBottom: SPACING.sm }}>INFO · 참고: 이전 답변</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.sm }}>
                        {q.referenceQuestions.map((rid) => {
                          const rq = round1Steps.flatMap(s => s.questions || []).find(x => x?.id === rid);
                          if (!rq || !answers[rid]) return null;
                          return (
                            <div key={rid} style={{ background: COLORS.bg, padding: SPACING.sm, borderRadius: RADIUS.sm, fontSize: FONT.size.sm }}>
                              <p style={{ fontWeight: FONT.weight.semibold, color: COLORS.accent, margin: 0, marginBottom: 4 }}>{rq.label}</p>
                              <p style={{ color: COLORS.sub, margin: 0, fontStyle: 'italic', lineHeight: FONT.lineHeight.base }}>
                                {answers[rid]?.substring(0,200)}{answers[rid]?.length>200?'...':''}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 가이드 (INFO) */}
                  {q.guide && showGuide[q.id] && (
                    <div style={{ ...S.boxInfo, borderLeft: `3px solid ${COLORS.accent2}` }}>
                      <p style={{ ...labelStyle(COLORS.accent2), marginBottom: SPACING.sm }}>GUIDE · 작성 가이드</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.sm }}>
                        <p style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color: COLORS.accent, margin: 0 }}>{q.guide.description}</p>
                        <p style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.medium, color: COLORS.accent, margin: 0 }}>{q.guide.diagnosis}</p>
                        {q.guide.helpQuestions && (
                          <div>
                            <p style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color: COLORS.accent, margin: 0, marginBottom: 4 }}>구체화 도움 질문:</p>
                            <ul style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0, paddingLeft: SPACING.md, lineHeight: FONT.lineHeight.relaxed }}>
                              {q.guide.helpQuestions.map((h, i) => <li key={i}>{h}</li>)}
                            </ul>
                          </div>
                        )}
                        {q.guide.ifDifficult && (
                          <div>
                            <p style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color: COLORS.accent, margin: 0, marginBottom: 4 }}>답변하기 어렵다면:</p>
                            <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0, lineHeight: FONT.lineHeight.base }}>{q.guide.ifDifficult}</p>
                          </div>
                        )}
                        {q.guide.ifStillDifficult && (
                          <div>
                            <p style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color: COLORS.accent, margin: 0, marginBottom: 4 }}>그래도 어렵다면:</p>
                            <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0, lineHeight: FONT.lineHeight.base }}>{q.guide.ifStillDifficult}</p>
                          </div>
                        )}
                        {/* 인라인 참고 워크북 (가이드 PART 7-15) */}
                        {q.relatedWorkbooks && <RelatedWorkbookInline ids={q.relatedWorkbooks} questionId={q.id || q.label} workbookKey={workbookKey} />}
                      </div>
                    </div>
                  )}

                  <ExampleToggle text={q.placeholder} />
                  <textarea className="ce-textarea" value={answers[q.id] || ''} onChange={e => handleAnswerChange(q.id, e.target.value)} rows={q.rows || 3} style={S.textarea} placeholder="" />
                  {(
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.sub, textAlign: 'right', margin: '4px 0 0', fontVariantNumeric: 'tabular-nums' }}>
                      {(answers[q.id] || '').length}자
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: SPACING.base, marginTop: SPACING.xl }}>
            <button onClick={goToPrevStep} style={S.btnSecondary}>이전</button>
            <button onClick={goToNextStep} disabled={!canGoNext()} style={{ ...S.btnPrimary, flex: 1, opacity: canGoNext() ? 1 : 0.4, cursor: canGoNext() ? 'pointer' : 'not-allowed' }}>
              다음 </button>
          </div>
        </div>

      </div>
    </div>
  );
};

