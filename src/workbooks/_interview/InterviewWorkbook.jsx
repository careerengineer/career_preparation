// [BUILD v36 20260520 10:30] docx 저장에 CareerEngineer 자료 + 멘토링 안내 섹션 추가 (ExternalHyperlink + linkP)
import { useState, useEffect, useRef } from 'react';
import * as DOCX from 'docx';
import { COLORS, FONT, SPACING, RADIUS } from '../../shared/design/tokens.js';
import { buildWorkbookBackupParagraphs, buildWorkbookPayload, buildCopyrightParagraphs } from '../../store/docxBackup.js';
import { buildInterviewDocxChildren } from '../../store/workbookDocx.js';
import { ReferenceInline } from '../../shared/components/ReferenceInline.jsx';
import { ToggleLink } from '../../shared/components/ToggleLink.jsx';

import { JobSituationGuide } from '../../shared/components/JobSituationGuide.jsx';
import { AnswerQualityCheck } from '../../shared/components/AnswerQualityCheck.jsx';
import { _INTRO_FONT, StickyFooter, FocusStyles } from '../_shared/brandKit.jsx';
import { _INTRO_INK, _INTRO_INK2, _INTRO_PAPER, _INTRO_GOLD, _INTRO_MUTE, CELockupA, FirstVisitModal, BrandHero, IntroCTA, IntroFlowCard, IntroCopyright } from '../_shared/brandKit.jsx';

// [Phase A-3] 세부 단계(stages) 답변을 최종 답변 작성 전에 모아 보여주는 박스
function Part2DigestBox({ q, answers }) {
  const hasAny = (q.stages || []).some((s, si) =>
    s.questions.some((_, qi) => answers[`${q.label}_s${si}_q${qi}`]?.trim())
  );
  if (!hasAny) return null;
  return (
    <div style={{ background: COLORS.bgAlt, borderRadius: RADIUS.base, padding: SPACING.md, marginBottom: SPACING.sm, borderLeft: `3px solid ${COLORS.accent2}` }}>
      <p style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color: COLORS.accent, margin: 0, marginBottom: SPACING.sm }}>
        세부 질문에 적은 내용 모음 · 이 키워드들을 연결해 최종 답변을 만들어 보세요
      </p>
      {q.stages.map((stage, si) => {
        const items = stage.questions
          .map((_, qi) => answers[`${q.label}_s${si}_q${qi}`])
          .filter((a) => a && a.trim());
        if (items.length === 0) return null;
        return (
          <div key={si} style={{ marginBottom: SPACING.sm }}>
            <p style={{ fontSize: FONT.size.xs, fontWeight: FONT.weight.semibold, color: COLORS.accent2, margin: 0, marginBottom: 4 }}>[{stage.name}]</p>
            {items.map((a, idx) => (
              <p key={idx} style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0, marginBottom: 2, paddingLeft: 8, lineHeight: 1.6 }}>· {a}</p>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// [Phase A-5] 최종 답변 내용 기반 규칙형 꼬리질문 (콘텐츠 작성 불필요)
function DynamicTailQuestions({ finalAnswer, rules }) {
  if (!finalAnswer || finalAnswer.length < 50) return null;
  const detected = [];
  (rules || []).forEach((r) => { if (new RegExp(r.re).test(finalAnswer)) detected.push({ q: r.q, tip: r.tip }); });
  if (detected.length === 0) return null;
  return (
    <div style={{ background: COLORS.bgAlt, borderRadius: RADIUS.base, padding: SPACING.md, marginTop: SPACING.sm, borderLeft: `3px solid ${COLORS.accent}` }}>
      <p style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color: COLORS.accent, margin: 0, marginBottom: SPACING.sm }}>
        내 답변에서 예상되는 추가 꼬리질문
      </p>
      {detected.map((t, i) => (
        <div key={i} style={{ marginBottom: SPACING.sm }}>
          <p style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color: COLORS.accent, margin: 0, marginBottom: 2 }}>꼬리질문: "{t.q}"</p>
          <p style={{ fontSize: FONT.size.xs, color: COLORS.sub, margin: 0, fontStyle: 'italic' }}>준비 Tip: {t.tip}</p>
        </div>
      ))}
    </div>
  );
}

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
//  24개 문항 (docx 원본 구조: 4-Step)
// ══════════════════════════════════════════════════════════════
  

export const InterviewWorkbook = ({ config }) => {
  const { workbookKey, storageKey, docxInnerTitle, mentoringLinks, docxPayloadTitle, docxTitle, fileNamePrefix, brandEyebrow, focusArea, QUESTIONS, intro } = config;
  const [showIntro, setShowIntro] = useState(true);
  const [showList, setShowList] = useState(true);
  const [showHelp, setShowHelp] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [basicInfo, setBasicInfo] = useState({ industry: '', position: '', company: '' });
  const [showGuide, setShowExample] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [showRawAnswers, setShowRawAnswers] = useState(false);
  const [finalText, setFinalText] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [confirmingClear, setConfirmingClear] = useState(false);

  // [CE-HOME] WorkbookShell '처음으로' 버튼에서 호출

  const __ceHomeRef = useRef(null);

  useEffect(() => {

    if (typeof window === 'undefined') return;

    window.__CE_HOME = { fn: () => __ceHomeRef.current?.(), key: workbookKey };

    return () => { if (window.__CE_HOME?.key === workbookKey) window.__CE_HOME = null; };

  }, []);

  const goHome = () => {
    setShowIntro(true);
    setShowList(true);
    setIsCompleted(false);
    setCurrentIdx(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  __ceHomeRef.current = goHome; // [CE-HOME] ref 갱신
  
  const STORAGE_KEY = storageKey;
  
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
            if (typeof data.currentIdx === 'number') setCurrentIdx(data.currentIdx);
            if (typeof data.isCompleted === 'boolean') setIsCompleted(data.isCompleted);
            if (data.showIntro === false) setShowIntro(false);
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      }
    } catch (e) { console.warn(e); }
  }, []);
  
  useEffect(() => {
    if (Object.keys(answers).length === 0 && !finalText && !(basicInfo?.industry || basicInfo?.position || basicInfo?.company)) return;
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          answers, basicInfo, finalText, currentIdx, isCompleted, showIntro,
          savedAt: new Date().toISOString()
        }));
      } catch { /* ignore */ }
    }, 1000);
    return () => clearTimeout(timer);
  }, [answers, basicInfo, finalText, currentIdx, isCompleted, showIntro]);
  

  const setAnswer = (id, val) => setAnswers(p => ({ ...p, [id]: val }));

  // 질문별 진행 상태 계산: 0=미시작, 1=PART1, 2=PART2, 3=PART3, 4=PART4 모두 완료
  const getQuestionStatus = (qq) => {
    const core = answers[`${qq.label}_core`]?.trim();
    const finalA = answers[`${qq.label}_final`]?.trim();
    const anyStage = qq.stages.some((st, si) =>
      st.questions.some((_, qi) => answers[`${qq.label}_s${si}_q${qi}`]?.trim())
    );
    const anyTail = qq.tails && qq.tails.some((_, ti) => answers[`${qq.label}_tail_${ti}`]?.trim());
    let level = 0;
    if (core) level = 1;
    if (anyStage) level = Math.max(level, 2);
    if (finalA) level = Math.max(level, 3);
    if (anyTail && finalA) level = 4;
    return level;
  };

  // 인라인 참고 워크북 (가이드 PART 7-15)
  const RelatedWorkbookInline = ReferenceInline; // master 기반 inline 참고 패널 (shared)

  const statusBadge = (level) => {
    if (level === 4) return { text: '✓ 완료', bg: COLORS.greenBg, color: COLORS.green };
    if (level === 3) return { text: '최종답변', bg: COLORS.blueBg, color: COLORS.blue };
    if (level === 2) return { text: '작성 중', bg: COLORS.yellowBg, color: COLORS.yellow };
    if (level === 1) return { text: '시작', bg: COLORS.bgAlt, color: COLORS.sub };
    return null;
  };
  const toggleGuide = (id) => setShowExample(p => ({ ...p, [id]: !p[id] }));

  const q = QUESTIONS[currentIdx];
  // 진행률은 현재 위치가 아니라 실제 작성한 내용 기반 (질문별 0~4단계 합 / 만점)
  const progress = config.computeProgress({ QUESTIONS, currentIdx, getQuestionStatus });

  const partGroups = QUESTIONS.reduce((acc, qq) => {
    if (!acc[qq.part]) acc[qq.part] = [];
    acc[qq.part].push(qq);
    return acc;
  }, {});

  const metaTag = (k, v) => {
    if (v === '✓') return <span key={k} style={{ fontSize: 16, padding: '3px 8px', borderRadius: 4, background: COLORS.blueBg, color: COLORS.blue, fontWeight: 600 }}>{k} ✓</span>;
    if (v === '△') return <span key={k} style={{ fontSize: 16, padding: '3px 8px', borderRadius: 4, background: COLORS.yellowBg, color: COLORS.yellow, fontWeight: 600 }}>{k} △</span>;
    return <span key={k} style={{ fontSize: 16, padding: '3px 8px', borderRadius: 4, background: COLORS.bgAlt, color: COLORS.sub }}>{k} -</span>;
  };

  const getRawText = () => '';  // 더 이상 사용 안 함 (savePartial이 downloadFinal로 통합됨)

  // docx 라이브러리 동적 로드
  const loadDocxLib = () => Promise.resolve(DOCX);

  // [CE-DL] 외부 WorkbookShell 버튼에서 호출 위한 등록

  const __ceDlRef = useRef(null);

  useEffect(() => {

    if (typeof window === 'undefined') return;

    window.__CE_DOWNLOAD = { fn: () => __ceDlRef.current?.(), key: workbookKey };

    return () => { if (window.__CE_DOWNLOAD?.key === workbookKey) window.__CE_DOWNLOAD = null; };

  }, []);

  const downloadFinal = async () => {
    try {
      const docxLib = await loadDocxLib();
      const { Document, Paragraph, TextRun, AlignmentType, BorderStyle, ExternalHyperlink, Packer } = docxLib;
      const today = new Date().toISOString().slice(0,10);
      
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
      const qHeader = (label, qtitle, required) => new Paragraph({
        children: [
          new TextRun({ text: `[${label}] `, bold: true, size: 24, font: '맑은 고딕', color: '0E2750' }),
          new TextRun({ text: qtitle, bold: true, size: 24, font: '맑은 고딕', color: '0E2750' }),
          ...(required ? [new TextRun({ text: '  (필수)', size: 18, font: '맑은 고딕', color: 'C9A86A' })] : [])
        ],
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
      const finalAnsP = (t, hasContent) => new Paragraph({
        children: t.split('\n').flatMap((line, i) => i === 0 
          ? [new TextRun({ text: line, size: 22, font: '맑은 고딕', color: hasContent ? '0E2750' : '6E7A8F', italic: !hasContent })] 
          : [new TextRun({ break: 1, text: line, size: 22, font: '맑은 고딕', color: hasContent ? '0E2750' : '6E7A8F', italic: !hasContent })]),
        spacing: { before: 100, after: 200, line: 380 },
        shading: { fill: hasContent ? 'F2F1EC' : 'FBFAF6' },
        border: { left: { style: BorderStyle.SINGLE, size: 24, color: '0E2750', space: 8 } },
        indent: { left: 240 }
      });
      const highlightP = (t) => new Paragraph({
        children: t.split('\n').flatMap((line, i) => i === 0 ? [new TextRun({ text: line, size: 22, font: '맑은 고딕', color: '0E2750' })] : [new TextRun({ break: 1, text: line, size: 22, font: '맑은 고딕', color: '0E2750' })]),
        spacing: { before: 100, after: 200, line: 380 },
        shading: { fill: 'F2F1EC' },
        border: { left: { style: BorderStyle.SINGLE, size: 24, color: '0E2750', space: 8 } },
        indent: { left: 240 }
      });
      const dateP = () => new Paragraph({
        children: [new TextRun({ text: '작성일 · ' + today, size: 20, font: '맑은 고딕', color: '6E7A8F' })],
        alignment: AlignmentType.RIGHT,
        spacing: { after: 80 }
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
      
      const children = buildInterviewDocxChildren({ title: docxInnerTitle, questions: QUESTIONS, basicInfo, answers, finalText, mentoringLinks }, docxLib);

      try { children.push(...buildWorkbookBackupParagraphs(docxLib, buildWorkbookPayload(workbookKey, docxPayloadTitle, storageKey))); } catch (e) { console.warn('[interview_new] backup embed skipped:', e); }
      try { children.unshift(...buildCopyrightParagraphs(docxLib)); } catch (e) { console.warn('copyright skip', e); }
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

  __ceDlRef.current = downloadFinal; // [CE-DL] ref 갱신

  const S = {
    page: { minHeight: '100vh', background: COLORS.bgAlt, padding: SPACING.md, fontFamily: FONT.family, color: COLORS.accent },
    container: { maxWidth: 1350, margin: '0 auto' },
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
    boxNeutral: { background: COLORS.bgAlt, border: `1px solid ${COLORS.border}`, color: COLORS.accent, padding: SPACING.md, borderRadius: RADIUS.base, marginBottom: SPACING.md },
    copyrightWrap: { background: COLORS.bg, borderRadius: RADIUS.md, padding: SPACING.md, border: `1px solid ${COLORS.border}`, marginTop: SPACING.lg },
    copyrightText: { fontSize: FONT.size.xs, color: COLORS.sub, textAlign: 'center', margin: 0, lineHeight: FONT.lineHeight.base },
    copyrightWarn: { fontSize: FONT.size.xs, color: COLORS.red, textAlign: 'center', marginTop: 8, fontWeight: FONT.weight.medium, lineHeight: FONT.lineHeight.base },
  };
  const labelStyle = (color) => ({ fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color, margin: 0, letterSpacing: 0.5, textTransform: 'uppercase' });
  const stepBadge = (n) => ({ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: COLORS.accent2, color: COLORS.white, fontSize: 16, padding: '3px 8px', borderRadius: 4, fontWeight: 700, minWidth: 48, marginRight: 8 });

  // ══════════════════ 인트로 ══════════════════
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
  // ══════════════════ 질문 목록 화면 ══════════════════
  if (!showIntro && showList && !isCompleted) {
    const answeredCount = QUESTIONS.filter(qq => getQuestionStatus(qq) >= 3).length;

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
            <div style={{ marginBottom: SPACING.lg }}>
              <p style={S.brandEyebrow}>{brandEyebrow}</p>
              <h1 style={S.h1Center}>질문 목록</h1>
              <p style={{ ...S.subtitle, textAlign: 'center' }}>원하는 질문을 눌러 바로 이동하세요 · 최종답변 {answeredCount}/{QUESTIONS.length}문항 완료</p>
            </div>

            <JobSituationGuide />

            <div style={S.boxTip}>
              <p style={{ ...labelStyle(COLORS.yellow), marginBottom: SPACING.sm }}>TIP · 작성 순서</p>
              <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0, lineHeight: FONT.lineHeight.base }}>
                [필수] 표시 문항부터 완성하세요. 상태 뱃지로 진행 상황을 확인할 수 있습니다: <strong style={{ color: COLORS.sub }}>시작</strong> → <strong style={{ color: COLORS.yellow }}>작성 중</strong> → <strong style={{ color: COLORS.blue }}>최종답변</strong> → <strong style={{ color: COLORS.green }}>✓ 완료</strong>
              </p>
            </div>

            {Object.entries(partGroups).map(([part, qs], partIdx) => (
              <div key={part} style={{ marginBottom: SPACING.lg }}>
                <p style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.bold, color: COLORS.accent2, margin: 0, marginBottom: SPACING.sm, paddingBottom: 6, borderBottom: `1px solid ${COLORS.border}` }}>
                  PART {partIdx + 1}. {part}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.sm }}>
                  {qs.map((qq) => {
                    const level = getQuestionStatus(qq);
                    const badge = statusBadge(level);
                    const borderColor = level === 4 ? COLORS.green : level === 3 ? COLORS.blue : level === 2 ? COLORS.yellow : level === 1 ? COLORS.sub : COLORS.border;
                    const qIdx = QUESTIONS.findIndex(x => x.label === qq.label);
                    return (
                      <button
                        key={qq.label}
                        onClick={() => { setCurrentIdx(qIdx); setShowList(false); window.scrollTo(0, 0); }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: SPACING.md,
                          border: `1.5px solid ${borderColor}`,
                          borderRadius: RADIUS.base,
                          background: level > 0 ? `${borderColor}11` : COLORS.bg,
                          cursor: 'pointer',
                          fontFamily: FONT.family,
                          transition: 'border-color 150ms, box-shadow 150ms, transform 80ms',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(14, 39, 80,0.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: SPACING.sm, flexWrap: 'wrap' }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3, flexWrap: 'wrap' }}>
                              <span style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.bold, color: COLORS.accent }}>{qq.label}. {qq.title}</span>
                              {qq.required && <span style={{ fontSize: 16, padding: '2px 7px', borderRadius: 3, background: COLORS.redBg, color: COLORS.red, fontWeight: 700 }}>필수</span>}
                            </div>
                            <p style={{ fontSize: FONT.size.xs, color: COLORS.sub, margin: 0, lineHeight: FONT.lineHeight.base }}>
                              권장 {qq.meta.time} · {qq.meta.length} · 인성{qq.meta.인성 || '-'} 직무{qq.meta.직무 || '-'} 임원{qq.meta.임원 || '-'}
                            </p>
                          </div>
                          {badge && (
                            <span style={{ fontSize: FONT.size.xs, padding: '4px 10px', borderRadius: 4, background: badge.bg, color: badge.color, fontWeight: FONT.weight.semibold, whiteSpace: 'nowrap' }}>
                              {badge.text}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', gap: SPACING.sm, marginTop: SPACING.md, position: 'sticky', bottom: 0, zIndex: 5, paddingTop: SPACING.base, paddingBottom: SPACING.base, background: COLORS.bg, borderTop: `1px solid ${COLORS.border}` }}>
              <button onClick={() => { setShowList(false); setShowIntro(true); window.scrollTo(0, 0); }} style={S.btnSecondary}>
                이전
              </button>
              <button onClick={() => { setIsCompleted(true); window.scrollTo(0, 0); }} style={{ ...S.btnPrimary, flex: 1, padding: '16px 32px' }}>
                작성 완료하고 다운로드
              </button>
            </div>
          </div>
          <StickyFooter />
        </div>
      </div>
    );
  }

  // ══════════════════ 완성 화면 ══════════════════
  if (isCompleted) {
    const answered = QUESTIONS.filter(qq => answers[`${qq.label}_final`]?.trim()).length;
    const required = QUESTIONS.filter(qq => qq.required).length;
    const answeredReq = QUESTIONS.filter(qq => qq.required && answers[`${qq.label}_final`]?.trim()).length;

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
            <div style={{ textAlign: 'center', marginBottom: SPACING.xl }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, background: COLORS.greenBg, borderRadius: RADIUS.pill, marginBottom: SPACING.base }}>
                </div>
              <h1 style={S.h1Center}>작성 완료</h1>
              <p style={{ ...S.subtitle, textAlign: 'center' }}>최종 답변 {answered}/{QUESTIONS.length}문항 (필수 {answeredReq}/{required}문항)</p>
            </div>

            <div style={{ background: COLORS.bgAlt, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.base, padding: SPACING.md, marginBottom: SPACING.lg }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.base, flexWrap: 'wrap', gap: SPACING.sm }}>
                <h3 style={{ ...S.h3, fontSize: FONT.size.md, display: 'flex', alignItems: 'center', gap: 6 }}>
                  통합 완성본 (선택)
                </h3>
                <button onClick={() => setShowRawAnswers(!showRawAnswers)} style={S.btnText}>
                  {showRawAnswers ? '작성 내용 숨기기' : '작성 내용 보기'}
                </button>
              </div>
              <p style={{ fontSize: FONT.size.xs, color: COLORS.sub, margin: `0 0 ${SPACING.sm}px`, lineHeight: FONT.lineHeight.base }}>
                필요하다면 여기에 통합본을 작성하세요. 비워두고 바로 다운로드해도 됩니다.
              </p>
              <textarea
                className="ce-textarea"
                value={finalText}
                onChange={e => setFinalText(e.target.value)}
                rows={8}
                style={{ ...S.textarea, fontSize: FONT.size.md }}
                placeholder="통합 완성본 (생략 가능)"
              />
            </div>

            {showRawAnswers && (
              <div style={{ ...S.boxNeutral, marginBottom: SPACING.lg }}>
                <h4 style={{ fontSize: FONT.size.md, fontWeight: FONT.weight.semibold, color: COLORS.accent, marginTop: 0, marginBottom: SPACING.sm }}>작성 내용 참고</h4>
                <pre style={{ fontSize: FONT.size.sm, color: COLORS.accent, whiteSpace: 'pre-wrap', fontFamily: FONT.family, margin: 0, lineHeight: FONT.lineHeight.relaxed, maxHeight: 400, overflow: 'auto' }}>{getRawText()}</pre>
              </div>
            )}

            <div style={S.boxInfo}>
              <p style={{ ...labelStyle(COLORS.blue), marginBottom: SPACING.sm }}>INFO · 다음 단계</p>
              <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0, lineHeight: FONT.lineHeight.base }}>
                다운로드한 답변을 <strong>소리 내어 반복 연습</strong>하세요. 외워서 읽는 게 아니라 <strong>키워드 중심으로 자연스럽게</strong> 이야기하는 훈련이 필요합니다.
              </p>
            </div>

            <div style={{ display: 'flex', gap: SPACING.sm, marginTop: SPACING.md, position: 'sticky', bottom: 0, zIndex: 5, paddingTop: SPACING.base, paddingBottom: SPACING.base, background: COLORS.bg, borderTop: `1px solid ${COLORS.border}` }}>
              <button onClick={() => { setIsCompleted(false); setShowList(true); window.scrollTo(0,0); }} style={S.btnSecondary}>
                이전
              </button>
              <button onClick={() => window.__CE_RESET?.fn?.()} title="이 워크북 작성 내용을 모두 지우고 처음부터 다시 작성" style={{ background: 'transparent', color: COLORS.red, border: `1px solid ${COLORS.red}66`, borderRadius: 10, padding: '0 14px', fontSize: 16, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', height: 40, display: 'inline-flex', alignItems: 'center', marginRight: 6 }}>삭제하고 다시 작성</button><button onClick={goHome} title="처음 페이지로 이동 (작성 내용 유지)" style={{ background: 'transparent', color: COLORS.sub, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: '0 14px', fontSize: 16, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', height: 40, display: 'inline-flex', alignItems: 'center' }}>처음으로</button>
              <button onClick={downloadFinal} style={{ ...S.btnPrimary, flex: 1, padding: '18px 32px', fontSize: FONT.size.lg }}>
                전체 답변 다운로드 (.docx)
              </button>
            </div>

            {downloadSuccess && <p style={{ fontSize: FONT.size.sm, color: COLORS.green, textAlign: 'center', marginTop: SPACING.md, fontWeight: FONT.weight.semibold }}>✓ 다운로드 완료</p>}

          </div>
          <StickyFooter />
        </div>
      </div>
    );
  }

  // ══════════════════ 메인 질문 화면 ══════════════════
  return (
    <div style={S.page}>
      <FocusStyles />
      <div style={S.container}>
        <div style={S.headerSticky}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: SPACING.base, marginBottom: SPACING.sm, flexWrap: 'wrap' }}>
            <CELockupA height={32} />
            <div style={{ position: 'relative', flex: 1, display: 'flex', justifyContent: 'center' }}>
              
              
            </div>
            <button onClick={() => window.__CE_RESET?.fn?.()} title="이 워크북 작성 내용을 모두 지우고 처음부터 다시 작성" style={{ background: 'transparent', color: COLORS.red, border: `1px solid ${COLORS.red}66`, borderRadius: 10, padding: '0 14px', fontSize: 16, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', height: 40, display: 'inline-flex', alignItems: 'center', marginRight: 6 }}>삭제하고 다시 작성</button><button onClick={goHome} title="처음 페이지로 이동 (작성 내용 유지)" style={{ background: 'transparent', color: COLORS.sub, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: '0 14px', fontSize: 16, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', height: 40, display: 'inline-flex', alignItems: 'center' }}>처음으로</button>
            
            
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.sm }}>
            <div style={{ ...S.progressTrack, flex: 1 }}>
              <div style={{ ...S.progressBar, width: progress + '%' }} />
            </div>
            <span style={{ fontSize: FONT.size.xs, color: COLORS.sub, minWidth: 40, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{Math.round(progress)}%</span>
          </div>
        </div>

        {downloadSuccess && <div style={{ ...S.boxSuccess, marginBottom: SPACING.md, textAlign: 'center' }}><p style={{ fontSize: FONT.size.sm, color: COLORS.green, fontWeight: FONT.weight.semibold, margin: 0 }}>✓ 백업 .docx 파일을 내려받았습니다</p></div>}

        {/* ═══ PART 탭 인디케이터 (가이드 PART 7-6) ═══ */}
        <div style={{ marginBottom: SPACING.md }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: 4 }}>
            {Object.entries(partGroups).map(([part, qs], partIdx) => {
              const firstQIdx = QUESTIONS.findIndex(x => x.label === qs[0].label);
              const lastQIdx = QUESTIONS.findIndex(x => x.label === qs[qs.length - 1].label);
              const isCurrent = currentIdx >= firstQIdx && currentIdx <= lastQIdx;
              const isPast = currentIdx > lastQIdx;
              return (
                <button key={part} onClick={() => { setCurrentIdx(firstQIdx); window.scrollTo(0, 0); }}
                  style={{
                    fontSize: 16, padding: '4px 10px', borderRadius: 999, border: 'none', cursor: 'pointer',
                    fontWeight: isCurrent ? FONT.weight.bold : FONT.weight.medium,
                    background: isCurrent ? COLORS.accent : isPast ? COLORS.greenBg : 'transparent',
                    color: isCurrent ? COLORS.white : isPast ? COLORS.green : COLORS.sub,
                    fontFamily: FONT.family, whiteSpace: 'nowrap', flexShrink: 0,
                  }}>
                  {isPast ? '✓ ' : ''}{partIdx + 1}. {part} (Q{firstQIdx + 1}-Q{lastQIdx + 1})
                </button>
              );
            })}
          </div>
        </div>

        <div style={S.cardLarge}>
          {/* Q 헤더 */}
          <div style={{ marginBottom: SPACING.lg }}>
            <p style={{ fontSize: FONT.size.xs, color: COLORS.accent2, fontWeight: FONT.weight.semibold, margin: 0, marginBottom: 6, letterSpacing: 0.3 }}>PART. {q.part}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm, flexWrap: 'wrap' }}>
              <span style={{ fontSize: FONT.size.xl, fontWeight: FONT.weight.bold, color: COLORS.accent2 }}>{q.label}.</span>
              <h2 style={{ ...S.h2, flex: 1 }}>{q.title}</h2>
              {q.required && <span style={{ fontSize: FONT.size.xs, padding: '4px 10px', borderRadius: 4, background: COLORS.redBg, color: COLORS.red, fontWeight: 700 }}>필수</span>}
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: FONT.size.xs, color: COLORS.sub }}>권장 {q.meta.time} · {q.meta.length}</span>
              <span style={{ fontSize: FONT.size.xs, color: COLORS.sub }}>·</span>
              {metaTag('인성', q.meta.인성)}
              {metaTag('직무', q.meta.직무)}
              {metaTag('임원', q.meta.임원)}
            </div>
          </div>

          {/* ─── Step 1: 핵심 문장 ─── */}
          <div style={{ marginBottom: SPACING.lg }}>
            <label style={{ ...S.label, display: 'flex', alignItems: 'center' }}>
              <span style={stepBadge(1)}>1단계</span>
              핵심 문장 먼저 작성
            </label>
            {/* ═══ 면접관 의도 + 답변 전략 (답변 작성 전 필독) ═══ */}
            {(q.interviewerWants || q.answerStrategy) && (
              <div style={{ background: '#FBFAF6', border: `1px solid ${COLORS.accent2}66`, borderRadius: 12, padding: '14px 16px', marginBottom: SPACING.md }}>
                {q.interviewerWants && (
                  <div style={{ marginBottom: q.answerStrategy ? 12 : 0 }}>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.accent2, fontWeight: FONT.weight.bold, margin: 0, marginBottom: 6, letterSpacing: 0.3 }}>면접관이 이 질문으로 확인하려는 것</p>
                    <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0, lineHeight: 1.7 }}>{q.interviewerWants}</p>
                  </div>
                )}
                {q.answerStrategy && (
                  <div style={{ paddingTop: q.interviewerWants ? 12 : 0, borderTop: q.interviewerWants ? `1px dashed ${COLORS.accent2}55` : 'none' }}>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.accent, fontWeight: FONT.weight.bold, margin: 0, marginBottom: 6, letterSpacing: 0.3 }}>답변 핵심 전략</p>
                    <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0, lineHeight: 1.7 }}>{q.answerStrategy}</p>
                  </div>
                )}
              </div>
            )}
            {(q.template || q.example) && (
              <div style={{ ...S.boxInfo, marginBottom: SPACING.sm }}>
                {q.template && <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0, lineHeight: FONT.lineHeight.base }}><strong>템플릿:</strong> {q.template}</p>}
                {q.example && (
                  <>
                    <ToggleLink open={!!showGuide[q.label + '_ex']} onToggle={() => toggleGuide(q.label + '_ex')} label="작성 예시" style={{ marginTop: 6 }} />
                    {showGuide[q.label + '_ex'] && (
                      <div style={{ ...S.boxInfo, borderLeft: `3px solid ${COLORS.accent2}`, marginTop: SPACING.sm }}>
                        <p style={{ ...labelStyle(COLORS.accent2), marginBottom: SPACING.sm }}>EXAMPLE · 예시 답변</p>
                        <p style={{ fontSize: FONT.size.sm, color: COLORS.sub, margin: 0, lineHeight: FONT.lineHeight.base, fontStyle: 'italic' }}>{q.example}</p>
                      </div>
                    )}
                  </>
                )}
                {/* 인라인 참고 워크북 (가이드 PART 7-15) */}
                {q.relatedWorkbooks && <RelatedWorkbookInline ids={q.relatedWorkbooks} questionId={q.id || q.label} workbookKey={workbookKey} />}
              </div>
            )}
            <textarea
              className="ce-textarea"
              value={answers[`${q.label}_core`] || ''}
              onChange={e => setAnswer(`${q.label}_core`, e.target.value)}
              rows={3}
              style={S.textarea}
              placeholder="나의 핵심 문장 (1~2줄로)"
            />
          </div>

          {/* ─── Step 2: 세부 질문 (단계별) ─── */}
          {q.stages.length > 0 && (
            <div style={{ marginBottom: SPACING.lg }}>
              <label style={{ ...S.label, display: 'flex', alignItems: 'center' }}>
                <span style={stepBadge(2)}>2단계</span>
                답변 완성을 위한 세부 질문
              </label>
              <p style={{ fontSize: FONT.size.xs, color: COLORS.sub, margin: `0 0 ${SPACING.sm}px`, fontStyle: 'italic' }}>
                모든 질문에 답하지 않아도 됩니다. 답할 수 있는 것부터 키워드로 빠르게 적어 보세요.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.base }}>
                {q.stages.map((stage, si) => (
                  <div key={si} style={{ background: COLORS.bgAlt, padding: SPACING.md, borderRadius: RADIUS.base, borderLeft: `3px solid ${COLORS.accent2}` }}>
                    <p style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.bold, color: COLORS.accent, margin: 0, marginBottom: SPACING.sm }}>[{stage.name}]</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.sm }}>
                      {stage.questions.map((sq, qi) => (
                        <div key={qi}>
                          <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0, marginBottom: 4 }}>{sq}</p>
                          <textarea
                            className="ce-textarea"
                            value={answers[`${q.label}_s${si}_q${qi}`] || ''}
                            onChange={e => setAnswer(`${q.label}_s${si}_q${qi}`, e.target.value)}
                            rows={2}
                            style={{ ...S.textarea, fontSize: FONT.size.sm }}
                            placeholder="답변 (키워드만 적어도 OK)"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── Step 3: 최종 답변 ─── */}
          <div style={{ marginBottom: SPACING.lg }}>
            <label style={{ ...S.label, display: 'flex', alignItems: 'center' }}>
              <span style={stepBadge(3)}>3단계</span>
              최종 답변 조합
            </label>
            {q.flow && (
              <div style={{ ...S.boxInfo, marginBottom: SPACING.sm }}>
                <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0 }}><strong>연결 순서:</strong> {q.flow}</p>
              </div>
            )}
            {(q.goodExample || q.badExample) && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: SPACING.sm, marginBottom: SPACING.sm }}>
                {q.goodExample && (
                  <div style={{ background: COLORS.greenBg, padding: SPACING.sm, borderRadius: RADIUS.sm, borderLeft: `3px solid ${COLORS.green}` }}>
                    <p style={{ ...labelStyle(COLORS.green), fontSize: 16, marginBottom: 4 }}>좋은 예시 ✓</p>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.accent, margin: 0, lineHeight: FONT.lineHeight.base }}>{q.goodExample}</p>
                  </div>
                )}
                {q.badExample && (
                  <div style={{ background: COLORS.redBg, padding: SPACING.sm, borderRadius: RADIUS.sm, borderLeft: `3px solid ${COLORS.red}` }}>
                    <p style={{ ...labelStyle(COLORS.red), fontSize: 16, marginBottom: 4 }}>피해야 할 예시 </p>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.accent, margin: 0, lineHeight: FONT.lineHeight.base }}>{q.badExample}</p>
                  </div>
                )}
              </div>
            )}
            <Part2DigestBox q={q} answers={answers} />
            <textarea
              className="ce-textarea"
              value={answers[`${q.label}_final`] || ''}
              onChange={e => setAnswer(`${q.label}_final`, e.target.value)}
              rows={6}
              style={S.textarea}
              placeholder="나의 최종 답변"
            />
            <p style={{ fontSize: FONT.size.xs, color: COLORS.sub, textAlign: 'right', margin: '4px 0 0', fontVariantNumeric: 'tabular-nums' }}>
                    {(answers[`${q.label}_final`] || '').length}자
                  </p>
            <AnswerQualityCheck text={answers[`${q.label}_final`]} focusArea={focusArea} />
          </div>

          {/* ─── Step 4: 꼬리질문 대비 ─── */}
          {((q.tails && q.tails.length > 0) || (answers[`${q.label}_final`] || '').length >= 50) && (
            <div style={{ marginBottom: SPACING.lg }}>
              <label style={{ ...S.label, display: 'flex', alignItems: 'center' }}>
                <span style={stepBadge(4)}>4단계</span>
                예상 꼬리질문 대비
              </label>
              <DynamicTailQuestions finalAnswer={answers[`${q.label}_final`]} rules={config.tailRules} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.sm }}>
                {(q.tails || []).map((t, ti) => (
                  <div key={ti} style={{ background: COLORS.bgAlt, padding: SPACING.md, borderRadius: RADIUS.base }}>
                    <p style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color: COLORS.accent, margin: 0, marginBottom: 4 }}>꼬리질문: "{t.q}"</p>
                    {t.tip && <p style={{ fontSize: FONT.size.xs, color: COLORS.sub, margin: 0, marginBottom: SPACING.sm, fontStyle: 'italic' }}>준비 Tip: {t.tip}</p>}
                    <textarea
                      className="ce-textarea"
                      value={answers[`${q.label}_tail_${ti}`] || ''}
                      onChange={e => setAnswer(`${q.label}_tail_${ti}`, e.target.value)}
                      rows={2}
                      style={{ ...S.textarea, fontSize: FONT.size.sm }}
                      placeholder="나의 답변 준비"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 이전/다음 */}
          <div style={{ display: 'flex', gap: SPACING.base, marginTop: SPACING.xl, flexWrap: 'wrap', position: 'sticky', bottom: 0, zIndex: 5, paddingTop: SPACING.base, paddingBottom: SPACING.base, background: COLORS.bg, borderTop: `1px solid ${COLORS.border}` }}>
            <button onClick={() => { setShowList(true); window.scrollTo(0,0); }} style={S.btnSecondary}>
              질문 목록
            </button>
            <button onClick={() => { setCurrentIdx(i => Math.max(0, i-1)); window.scrollTo(0,0); }} disabled={currentIdx === 0} style={{ ...S.btnSecondary, opacity: currentIdx === 0 ? 0.4 : 1, cursor: currentIdx === 0 ? 'not-allowed' : 'pointer' }}>
              이전
            </button>
            {currentIdx === QUESTIONS.length - 1 ? (
              <button onClick={() => { setIsCompleted(true); window.scrollTo(0,0); }} style={{ ...S.btnPrimary, flex: 1 }}>
                작성 완료 </button>
            ) : (
              <button onClick={() => { setCurrentIdx(i => i+1); window.scrollTo(0,0); }} style={{ ...S.btnPrimary, flex: 1 }}>
                다음 </button>
            )}
          </div>
        </div>

        <StickyFooter />
      </div>
    </div>
  );
};

