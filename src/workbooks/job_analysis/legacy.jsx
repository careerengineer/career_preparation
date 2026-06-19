// [BUILD v36 20260520 10:30] docx 저장에 CareerEngineer 자료 + 멘토링 안내 섹션 추가 (ExternalHyperlink + linkP)
import { useState, useEffect, useRef } from 'react';
import * as DOCX from 'docx';
import { COLORS, FONT, SPACING, RADIUS } from '../../shared/design/tokens.js';
import { buildWorkbookBackupParagraphs, buildWorkbookPayload, buildCopyrightParagraphs } from '../../store/docxBackup.js';
import { ToggleLink } from '../../shared/components/ToggleLink.jsx';
import { FORMS, PERSONAS, COMPLETION_CHECKLIST, FIELD_EXAMPLES, DIAGNOSIS } from './data.js';
import { buildJobAnalysisDocxChildren } from '../../store/workbookDocx.js';
import { _INTRO_FONT, StickyFooter, FocusStyles } from '../_shared/brandKit.jsx';
import { _INTRO_INK, _INTRO_INK2, _INTRO_PAPER, _INTRO_GOLD, _INTRO_MUTE, CELockupA, FirstVisitModal, BrandHero, IntroCTA, IntroFlowCard, IntroCopyright } from '../_shared/brandKit.jsx';

// 멘토링·컨설팅 URL 상수 (작업 18: URL 상수화)

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

      <div style={{ background: COLORS.bg, borderRadius: RADIUS.md, padding: SPACING.xl, border: `1px solid ${COLORS.border}`, marginBottom: SPACING.md }}>
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

// 각 분석 항목별 "작성 예시" — 지원자가 막힐 때 참고용 (품질관리 엔지니어 예시 기준).
// 채용공고의 실제 용어로 바꿔 적는 것이 핵심.

  

const JobAnalysisWorkbook = () => {
  const [phase, setPhase] = useState('intro');
  const [showHelp, setShowHelp] = useState(true);
  // [CE-HOME] WorkbookShell '처음으로' 버튼에서 호출
  const __ceHomeRef = useRef(null);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.__CE_HOME = { fn: () => __ceHomeRef.current?.(), key: 'job_analysis' };
    return () => { if (window.__CE_HOME?.key === 'job_analysis') window.__CE_HOME = null; };
  }, []);
  const goHome = () => {
    setPhase('intro');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  __ceHomeRef.current = goHome; // [CE-HOME] ref 갱신
  const [basicInfo, setBasicInfo] = useState({ industry: '', position: '', target: '' });

  const [diagnosisAnswers, setDiagnosisAnswers] = useState({});
  const [persona, setPersona] = useState(null);

  const [jobPostings, setJobPostings] = useState(() => [{ id: Date.now() }]);
  const [formAnswers, setFormAnswers] = useState({});
  const [showExamples, setShowExamples] = useState({}); // 항목별 "예시 보기" 토글

  const [editingFormId, setEditingFormId] = useState(null);

  const [finalText, setFinalText] = useState('');
  const [checklistState, setChecklistState] = useState({});
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copyMsg, setCopyMsg] = useState('');
  const [confirmingClear, setConfirmingClear] = useState(false);
  
  const STORAGE_KEY = 'careerengineer_job_analysis_v1';
  
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        const hasAnswers = (data.formAnswers && Object.keys(data.formAnswers).length > 0) ||
                           (data.jobPostings && data.jobPostings.some(j => Object.keys(j).filter(k => k !== 'id').length > 0)) ||
                           data.persona;
        if (hasAnswers) {
          const savedDate = data.savedAt ? new Date(data.savedAt).toLocaleString('ko-KR') : '이전';
          if (true /* auto-restore */) {
            if (data.basicInfo) setBasicInfo(data.basicInfo);
            if (data.diagnosisAnswers) setDiagnosisAnswers(data.diagnosisAnswers);
            if (data.persona) setPersona(data.persona);
            if (data.jobPostings) setJobPostings(data.jobPostings);
            if (data.formAnswers) setFormAnswers(data.formAnswers);
            if (data.finalText) setFinalText(data.finalText);
            if (data.checklistState) setChecklistState(data.checklistState);
            // phase는 지원되는 5종만 허용 — 그 외(자소서 형식 'completed' 등)는 'intro'로 안전 폴백
            if (data.phase) {
              const VALID_PHASES = ['intro', 'diagnosis', 'formList', 'formEdit', 'completion'];
              setPhase(VALID_PHASES.includes(data.phase) ? data.phase : 'intro');
            }
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      }
    } catch (e) { console.warn(e); }
  }, []);
  
  useEffect(() => {
    if (Object.keys(formAnswers).length === 0 && !persona && !(basicInfo?.industry || basicInfo?.position || basicInfo?.target)) return;
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          basicInfo, diagnosisAnswers, persona, jobPostings, formAnswers,
          finalText, checklistState, phase,
          savedAt: new Date().toISOString()
        }));
      } catch { /* ignore */ }
    }, 1000);
    return () => clearTimeout(timer);
  }, [basicInfo, diagnosisAnswers, persona, jobPostings, formAnswers, finalText, checklistState, phase]);
  

  const determinePersona = (answers) => {
    const { status, job_decided, target_type } = answers;
    
    // 1. 학생 초기·서류합격은 별도 흐름
    if (status === 'student_low') return 'J';  // 저학년/비취준생
    if (status === 'interview') return 'G';    // 서류 합격
    
    // 2. 석사·박사: 보통 연구 분야와 직무가 매칭 (직무 정해짐 + 깊이 있음)
    //    포트폴리오/연구중심 직군이면 I, 회사 특성에 따라 분기
    //    job_decided가 yes_major/yes_career_same이면 신입+경력 중간 페르소나로 B 또는 C
    if (status === 'master' || status === 'phd') {
      if (target_type === 'portfolio') return 'I';
      if (target_type === 'public') return 'H';
      if (target_type === 'startup') return 'F';
      if (target_type === 'many') return 'E';
      if (job_decided === 'no') return 'D';
      if (job_decided === 'yes_different') return 'A';     // 전공과 다른 직무 전환
      if (job_decided === 'yes_career_same') return 'C';   // 박사라면 같은 분야 이직(연구원→연구원 등)
      if (job_decided === 'yes_major') return 'B';         // 전공 일치 (가장 흔함)
      return 'B';
    }
    
    // 3. 회사 특성이 직무 결정보다 우선 (대분류)
    if (target_type === 'public') return 'H';
    if (target_type === 'portfolio') return 'I';
    if (target_type === 'startup') return 'F';
    if (target_type === 'many') return 'E';
    
    // 4. 직무 결정 여부에 따라
    if (job_decided === 'no') return 'D';
    if (job_decided === 'yes_different') return 'A';
    if (job_decided === 'yes_career_same') return 'C';
    if (job_decided === 'yes_major') return 'B';
    return 'B';
  };

  // 작성된 데이터 존재 여부 체크 (저장 버튼 활성화용)

  const getFormStatus = (form) => {
    if (form.type === 'repeat') {
      const filled = jobPostings.filter(j => form.fields.some(f => (j[f.key] || '').trim())).length;
      if (filled === 0) return 0;
      if (filled < 3) return 1;
      if (filled < 10) return 2;
      return 3;
    }
    const answers = formAnswers[form.id] || {};
    const filled = form.fields.filter(f => (answers[f.key] || '').trim()).length;
    const total = form.fields.length;
    if (filled === 0) return 0;
    if (filled < total * 0.3) return 1;
    if (filled < total * 0.8) return 2;
    return 3;
  };

  const statusBadge = (level) => {
    if (level === 3) return { text: '✓ 완료', bg: COLORS.greenBg, color: COLORS.green };
    if (level === 2) return { text: '작성 중', bg: COLORS.yellowBg, color: COLORS.yellow };
    if (level === 1) return { text: '시작', bg: COLORS.blueBg, color: COLORS.blue };
    return null;
  };

  const addJobPosting = () => setJobPostings(p => [...p, { id: Date.now() }]);
  const removeJobPosting = (id) => setJobPostings(p => p.length > 1 ? p.filter(j => j.id !== id) : p);
  const updateJobPosting = (id, key, val) => setJobPostings(p => p.map(j => j.id === id ? { ...j, [key]: val } : j));

  const setFormAnswer = (formId, fieldKey, val) => {
    setFormAnswers(p => ({ ...p, [formId]: { ...(p[formId] || {}), [fieldKey]: val } }));
  };

  const copyPrompt = (text) => {
    // HTTPS 환경 — Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        setCopyMsg('✓ 프롬프트가 복사되었습니다. AI에 붙여넣어 사용하세요.');
        setTimeout(() => setCopyMsg(''), 3000);
      }).catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  };
  
  // HTTP / 구형 브라우저 fallback
  const fallbackCopy = (text) => {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.top = '0';
      textarea.setAttribute('readonly', '');
      document.body.appendChild(textarea);
      textarea.select();
      textarea.setSelectionRange(0, textarea.value.length);
      const ok = document.execCommand('copy');
      document.body.removeChild(textarea);
      if (ok) {
        setCopyMsg('✓ 프롬프트가 복사되었습니다. AI에 붙여넣어 사용하세요.');
      } else {
        setCopyMsg('⚠ 복사 실패 — 텍스트를 직접 선택해 복사해주세요.');
      }
      setTimeout(() => setCopyMsg(''), 3000);
    } catch (e) {
      setCopyMsg('⚠ 복사 실패 — 텍스트를 직접 선택해 복사해주세요.');
      setTimeout(() => setCopyMsg(''), 3000);
    }
  };

  // 참고 박스용: 이전 양식의 전체 답변을 가져오기 (잘림 없이)
  const getFullFormContent = (refFormId) => {
    const refForm = FORMS.find(f => f.id === refFormId);
    if (!refForm) return null;

    if (refForm.type === 'repeat') {
      const filled = jobPostings.filter(j => refForm.fields.some(f => (j[f.key] || '').trim()));
      if (filled.length === 0) return null;
      return filled.map((j, i) => {
        const parts = [`[공고 ${i+1}]`];
        refForm.fields.forEach(f => {
          if ((j[f.key] || '').trim()) parts.push(`· ${f.label}: ${j[f.key]}`);
        });
        return parts.join('\n');
      }).join('\n\n');
    }

    const answers = formAnswers[refFormId] || {};
    const parts = [];
    refForm.fields.forEach(f => {
      if ((answers[f.key] || '').trim()) {
        parts.push(`· ${f.label}\n  ${answers[f.key]}`);
      }
    });
    return parts.length > 0 ? parts.join('\n\n') : null;
  };

  // 고유한 참조 양식 ID 목록 추출 (중복 제거)
  const getReferencedFormIds = (form) => {
    if (!form.references || form.references.length === 0) return [];
    const ids = [...new Set(form.references.map(r => r.formId))];
    return ids;
  };

  const buildTextDump = () => {
    const lines = ['='.repeat(60)];
    lines.push('CareerEngineer · 채용공고 및 직무분석 완전 가이드');
    lines.push('='.repeat(60), '');
    lines.push(`산업: ${basicInfo.industry || '-'}`);
    lines.push(`지원 직무: ${basicInfo.position || '-'}`);
    lines.push(`지원 회사/타겟: ${basicInfo.target || '-'}`);
    if (persona) {
      lines.push(`분석 목표: ${PERSONAS[persona].title}`);
      lines.push(`추천 경로: ${PERSONAS[persona].flow}`);
    }
    lines.push('');

    const form1 = FORMS.find(f => f.id === 'form_01');
    lines.push('━'.repeat(60));
    lines.push(`【${form1.title}】 — 수집 공고 ${jobPostings.length}개`);
    lines.push('━'.repeat(60));
    jobPostings.forEach((j, i) => {
      const hasContent = form1.fields.some(f => (j[f.key] || '').trim());
      if (!hasContent) return;
      lines.push(`\n[공고 ${i+1}]`);
      form1.fields.forEach(f => {
        if ((j[f.key] || '').trim()) lines.push(`  ${f.label}: ${j[f.key]}`);
      });
    });
    lines.push('');

    FORMS.filter(f => f.id !== 'form_01').forEach(form => {
      const answers = formAnswers[form.id] || {};
      const hasContent = form.fields.some(f => (answers[f.key] || '').trim());
      if (!hasContent) return;
      lines.push('━'.repeat(60));
      lines.push(`【${form.title}】 — ${form.subtitle}`);
      lines.push('━'.repeat(60));
      form.fields.forEach(f => {
        if ((answers[f.key] || '').trim()) {
          lines.push(`\n▸ ${f.label}`);
          if (f.hint) lines.push(`  [힌트] ${f.hint}`);
          lines.push(answers[f.key]);
        }
      });
      lines.push('');
    });

    // 완성 기준 체크리스트 결과 포함
    const checkedCount = COMPLETION_CHECKLIST.filter((_, i) => checklistState[i]).length;
    if (checkedCount > 0) {
      lines.push('━'.repeat(60));
      lines.push(`【완성 기준 체크리스트】 — ${checkedCount}/${COMPLETION_CHECKLIST.length} 완료`);
      lines.push('━'.repeat(60));
      COMPLETION_CHECKLIST.forEach((item, i) => {
        lines.push(`  ${checklistState[i] ? '✓' : ''} ${item}`);
      });
      lines.push('');
    }

    if (finalText.trim()) {
      lines.push('━'.repeat(60));
      lines.push('【통합 완성본】');
      lines.push('━'.repeat(60));
      lines.push(finalText);
      lines.push('');
    }

    lines.push('');
    lines.push('='.repeat(60));
    lines.push('© 2026 CareerEngineer. All Rights Reserved.');
    return lines.join('\n');
  };

  // docx 라이브러리 동적 로드
  const loadDocxLib = () => Promise.resolve(DOCX);

  // [CE-DL] 외부 WorkbookShell 버튼에서 호출 위한 등록

  const __ceDlRef = useRef(null);

  useEffect(() => {

    if (typeof window === 'undefined') return;

    window.__CE_DOWNLOAD = { fn: () => __ceDlRef.current?.(), key: 'job_analysis' };

    return () => { if (window.__CE_DOWNLOAD?.key === 'job_analysis') window.__CE_DOWNLOAD = null; };

  }, []);

  const downloadFinal = async () => {
    try {
      const docxLib = await loadDocxLib();
      const { Document, Paragraph, TextRun, AlignmentType, BorderStyle, ExternalHyperlink, Packer } = docxLib;
      const today = new Date().toISOString().slice(0,10);
      
      const titleP = (t) => new Paragraph({
        children: [new TextRun({ text: t, bold: true, size: 40, font: '맑은 고딕', color: '0E2750', characterSpacing: 100 })],
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
      const labelP = (t) => new Paragraph({
        children: [new TextRun({ text: t, bold: true, size: 22, font: '맑은 고딕', color: '1B3A6B' })],
        spacing: { before: 200, after: 80 },
        border: { left: { style: BorderStyle.SINGLE, size: 24, color: 'C9A86A', space: 8 } },
        indent: { left: 200 }
      });
      const hintP = (t) => new Paragraph({
        children: [new TextRun({ text: t, italic: true, size: 18, font: '맑은 고딕', color: '6E7A8F' })],
        spacing: { before: 0, after: 80 },
        indent: { left: 360 }
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
      const checkP = (checked, item) => new Paragraph({
        children: [
          new TextRun({ text: (checked ? '✓  ' : '·  '), bold: true, size: 22, font: '맑은 고딕', color: 'C9A86A' }),
          new TextRun({ text: item, size: 22, font: '맑은 고딕', color: '0E2750' })
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
      
      const children = buildJobAnalysisDocxChildren({ basicInfo, persona, finalText, jobPostings, formAnswers, checklistState }, docxLib);

      try { children.push(...buildWorkbookBackupParagraphs(docxLib, buildWorkbookPayload('job_analysis', '채용공고 및 직무분석', 'careerengineer_job_analysis_v1'))); } catch (e) { console.warn('[job_analysis] backup embed skipped:', e); }
      try { children.unshift(...buildCopyrightParagraphs(docxLib)); } catch (e) { console.warn('copyright skip', e); }
      const doc = new Document({
        creator: '',
        title: '채용공고 및 직무분석',
        sections: [{
          properties: { page: { margin: { top: 1400, right: 1133, bottom: 1400, left: 1133 } } },
          children: children
        }]
      });
      
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `채용공고_직무분석_${(basicInfo.position || '미입력').replace(/[^a-zA-Z0-9가-힣\s]/g, '_')}_${today}.docx`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 5000);
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
    hint: { fontSize: FONT.size.sm, color: COLORS.sub, marginTop: 0, marginBottom: SPACING.sm, lineHeight: FONT.lineHeight.base, fontStyle: 'italic' },
    textarea: { width: '100%', padding: '12px 16px', border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.base, fontSize: FONT.size.base, fontFamily: FONT.family, color: COLORS.accent, outline: 'none', resize: 'none', boxSizing: 'border-box', lineHeight: 1.7, background: COLORS.bg, transition: 'border-color 150ms ease, box-shadow 150ms ease' },
    input: { width: '100%', padding: '12px 16px', border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.base, fontSize: FONT.size.base, fontFamily: FONT.family, color: COLORS.accent, outline: 'none', boxSizing: 'border-box', background: COLORS.bg, transition: 'border-color 150ms ease, box-shadow 150ms ease' },
    btnPrimary: { background: COLORS.accent, color: COLORS.white, border: 'none', padding: '14px 32px', borderRadius: RADIUS.md, fontSize: FONT.size.md, fontWeight: FONT.weight.semibold, cursor: 'pointer', fontFamily: FONT.family, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 },
    btnSecondary: { background: 'transparent', color: COLORS.accent, border: `1px solid ${COLORS.border}`, padding: '12px 24px', borderRadius: RADIUS.base, fontSize: FONT.size.base, fontWeight: FONT.weight.medium, cursor: 'pointer', fontFamily: FONT.family, display: 'inline-flex', alignItems: 'center', gap: 6 },
    btnSaveHeader: { background: COLORS.accent2, color: COLORS.white, border: 'none', borderRadius: RADIUS.base, padding: '0 14px', fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, cursor: 'pointer', fontFamily: FONT.family, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, whiteSpace: 'nowrap', transition: 'opacity 150ms ease', height: 36 },
    btnText: { background: 'transparent', color: COLORS.accent2, border: 'none', padding: 0, fontSize: FONT.size.sm, fontWeight: FONT.weight.medium, cursor: 'pointer', fontFamily: FONT.family, display: 'inline-flex', alignItems: 'center', gap: 4 },
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

  // ══════════════════ 인트로 ══════════════════
      const renderIntro = () => (
    <IntroPage
      workbookKey='job_analysis'
      stepLabel='STEP 1 · 채용공고 및 직무분석'
      title='채용공고 및 직무분석'
      subtitle='채용공고에서 핵심 키워드를 추출하고 직무 적합성을 진단합니다'
      flow={[
          { label: 'PART 1', desc: '페르소나 진단 — 나의 상황 파악 (신입·경력·전환 등)' },
          { label: 'PART 2', desc: '채용공고 양식 작성 — 회사·직무별 양식 만들기' },
          { label: 'PART 3', desc: '양식 작성 — 직무상세내용 키워드 추출 및 적합성 검토' },
          { label: 'PART 4', desc: '완료 — 분석 결과 최종 정리 및 다운로드' },
        ]}
      flowTitle={'이 워크북의 진행 순서'}
      prerequisites={[
          { text: '지원할 회사의 채용공고 (직무상세내용)' },
          { text: '본인의 이력서 또는 경험 자료 (선택)' },
        ]}
      helpModal={<FirstVisitModal open={showHelp} onClose={() => setShowHelp(false)} title='채용공고 및 직무분석 사용 안내' steps={[
          '<strong>페르소나 진단</strong>으로 본인의 상황을 먼저 파악합니다.',
          '<strong>분석 양식</strong>을 만든 뒤 채용공고를 붙여넣고 키워드를 추출합니다.',
          '한 사람이 <strong>여러 회사·직무</strong>를 분석할 수 있으니 양식을 추가로 만드세요.',
          '분석 결과는 자소서·이력서 작성 시 핵심 재료가 됩니다.',
        ]} />}
      onStart={() => { setPhase('diagnosis'); }}
    />
  );
  // ══════════════════ 진단 ══════════════════
  const renderDiagnosis = () => {
    const allAnswered = DIAGNOSIS.every(q => diagnosisAnswers[q.id]);

    return (
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
            <div style={{ marginBottom: SPACING.lg }}>
              <p style={S.brandEyebrow}>페르소나 진단</p>
              <h1 style={S.h1Center}>나의 상황은 어디에?</h1>
              <p style={{ ...S.subtitle, textAlign: 'center' }}>3개 질문에 답하면 맞춤 경로를 추천합니다</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.lg }}>
              {DIAGNOSIS.map((q, qi) => (
                <div key={q.id} style={{ background: COLORS.bgAlt, borderRadius: RADIUS.base, padding: SPACING.lg, borderLeft: `3px solid ${COLORS.accent2}` }}>
                  <p style={{ ...S.label, fontSize: FONT.size.md }}>{qi+1}. {q.q}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.sm }}>
                    {q.options.map(opt => {
                      const selected = diagnosisAnswers[q.id] === opt.v;
                      return (
                        <button
                          key={opt.v}
                          onClick={() => setDiagnosisAnswers(p => ({ ...p, [q.id]: opt.v }))}
                          style={{
                            textAlign: 'left', padding: SPACING.md,
                            border: `1.5px solid ${selected ? COLORS.accent2 : COLORS.border}`,
                            borderRadius: RADIUS.base,
                            background: selected ? COLORS.blueBg : COLORS.bg,
                            cursor: 'pointer', fontFamily: FONT.family,
                          }}
                          className="ce-card"
                        >
                          <p style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color: COLORS.accent, margin: 0 }}>{opt.l}</p>
                          <p style={{ fontSize: FONT.size.xs, color: COLORS.sub, margin: 0, marginTop: 4 }}>{opt.d}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {allAnswered && (() => {
              const pid = determinePersona(diagnosisAnswers);
              const p = PERSONAS[pid];
              return (
                <div style={{ ...S.boxInfo, marginTop: SPACING.lg }}>
                  <p style={{ ...labelStyle(COLORS.blue), marginBottom: SPACING.sm }}>채용공고 및 직무분석 목표</p>
                  <p style={{ fontSize: FONT.size.lg, fontWeight: FONT.weight.bold, color: COLORS.accent, margin: 0, marginBottom: 4 }}>{p.title}</p>
                  <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0, marginBottom: 8, lineHeight: FONT.lineHeight.relaxed }}>{p.desc}</p>
                  <p style={{ fontSize: FONT.size.sm, color: COLORS.blue, margin: 0, fontWeight: FONT.weight.semibold }}>추천 경로: {p.flow}</p>
                  <p style={{ fontSize: FONT.size.xs, color: COLORS.sub, margin: '8px 0 0', lineHeight: FONT.lineHeight.relaxed, fontStyle: 'italic' }}>※ 위 안내는 입력하신 상황을 바탕으로 한 \"이 워크북의 활용 목표\"입니다. 실제 본인 상황(전공 지식, 실무 경험, 인턴십 등)이 더 깊다면 워크북을 더 빠르게 진행하셔도 좋습니다.</p>
                  {p.step0_warning && (
                    <div style={{ ...S.boxWarning, marginTop: SPACING.sm, marginBottom: 0 }}>
                      <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0, lineHeight: FONT.lineHeight.base }}>
                        <strong>권장:</strong> 이 워크북은 직무가 정해진 후 사용하는 것이 효과적입니다. 방향이 확실하지 않다면 <strong><a href="https://www.latpeed.com/products/YPFjD" target="_blank" rel="noopener noreferrer" style={{ color: COLORS.accent, textDecoration: 'underline', fontWeight: FONT.weight.bold }}>[STEP0] CareerEngineer의 취업 로드맵 분석</a></strong>을 먼저 진행하세요. 그럼에도 지금 시작하신다면 공고 수집을 통해 감을 잡는 것도 가능합니다.
                      </p>
                    </div>
                  )}
                </div>
              );
            })()}

            <div style={{ display: 'flex', gap: SPACING.base, marginTop: SPACING.lg }}>
              <button onClick={() => setPhase('intro')} style={S.btnSecondary} className="ce-btn">
                이전
              </button>
              <button
                onClick={() => { setPersona(determinePersona(diagnosisAnswers)); setPhase('formList'); window.scrollTo(0,0); }}
                disabled={!allAnswered}
                style={{ ...S.btnPrimary, flex: 1, opacity: allAnswered ? 1 : 0.4, cursor: allAnswered ? 'pointer' : 'not-allowed' }}
                className="ce-btn"
              >
                다음 </button>
            </div>
          </div>
          <StickyFooter />
        </div>
      </div>
    );
  };

  // ══════════════════ 양식 목록 ══════════════════
  const renderFormList = () => {
    const p = PERSONAS[persona];
    const completedCount = FORMS.filter(f => getFormStatus(f) >= 3).length;

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
          </div>

          {downloadSuccess && <div style={{ ...S.boxSuccess, marginBottom: SPACING.md, textAlign: 'center' }}><p style={{ fontSize: FONT.size.sm, color: COLORS.green, fontWeight: FONT.weight.semibold, margin: 0 }}>✓ 백업 .docx 파일을 내려받았습니다</p></div>}

          <div style={S.cardLarge}>
            <div style={{ ...S.boxInfo, marginBottom: SPACING.lg }}>
              <p style={{ ...labelStyle(COLORS.blue), marginBottom: SPACING.sm }}>나의 페르소나</p>
              <p style={{ fontSize: FONT.size.lg, fontWeight: FONT.weight.bold, color: COLORS.accent, margin: 0, marginBottom: 4 }}>{p.title}</p>
              <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0, marginBottom: 8 }}>{p.desc}</p>
              <p style={{ fontSize: FONT.size.sm, color: COLORS.blue, margin: 0, fontWeight: FONT.weight.semibold }}>추천 경로: {p.flow}</p>
              <button onClick={() => setPhase('diagnosis')} style={{ ...S.btnText, marginTop: 8 }}>페르소나 다시 진단</button>
            </div>

            <div style={{ marginBottom: SPACING.lg }}>
              <h2 style={{ ...S.h2, marginBottom: 4 }}>7개 양식</h2>
              <p style={{ ...S.subtitle }}>완료 {completedCount}/7 · 원하는 양식을 클릭해 작성을 시작하세요</p>
            </div>

            <div style={S.boxTip}>
              <p style={{ ...labelStyle(COLORS.yellow), marginBottom: SPACING.sm }}>TIP · 상태 뱃지 안내</p>
              <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0, lineHeight: FONT.lineHeight.base }}>
                <strong style={{ color: COLORS.blue }}>시작</strong> → <strong style={{ color: COLORS.yellow }}>작성 중</strong> → <strong style={{ color: COLORS.green }}>✓ 완료</strong>. [필수] 뱃지는 나의 페르소나 기준 권장 양식입니다.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.sm, marginTop: SPACING.md }}>
              {FORMS.map((f, i) => {
                const level = getFormStatus(f);
                const badge = statusBadge(level);
                const isRequired = f.required_for.includes(persona);
                const borderColor = level === 3 ? COLORS.green : level === 2 ? COLORS.yellow : level === 1 ? COLORS.blue : COLORS.border;
                return (
                  <button
                    key={f.id}
                    onClick={() => { setEditingFormId(f.id); setPhase('formEdit'); window.scrollTo(0,0); }}
                    style={{
                      width: '100%', textAlign: 'left', padding: SPACING.md,
                      border: `1.5px solid ${borderColor}`, borderRadius: RADIUS.base,
                      background: level > 0 ? `${borderColor}11` : COLORS.bg,
                      cursor: 'pointer', fontFamily: FONT.family,
                    }}
                    className="ce-card"
                  >
                    <div style={{ display: 'flex', alignItems: 'start', gap: SPACING.sm, flexWrap: 'wrap' }}>
                      <span style={{ minWidth: 40, padding: '4px 0', fontSize: FONT.size.sm, fontWeight: FONT.weight.bold, color: COLORS.accent2 }}>{String(i+1).padStart(2, '0')}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.bold, color: COLORS.accent }}>{f.title}</span>
                          {isRequired && <span style={{ fontSize: 16, padding: '2px 7px', borderRadius: 3, background: COLORS.redBg, color: COLORS.red, fontWeight: 700 }}>필수</span>}
                          {f.type === 'repeat' && <span style={{ fontSize: 16, padding: '2px 7px', borderRadius: 3, background: COLORS.blueBg, color: COLORS.blue, fontWeight: 700 }}>반복 입력</span>}
                          {f.prompt && <span style={{ fontSize: 16, padding: '2px 7px', borderRadius: 3, background: COLORS.blueBg, color: COLORS.blue, fontWeight: 700 }}>AI 프롬프트</span>}
                        </div>
                        <p style={{ fontSize: FONT.size.xs, color: COLORS.sub, margin: 0, lineHeight: FONT.lineHeight.base }}>{f.subtitle}</p>
                        <p style={{ fontSize: FONT.size.xs, color: COLORS.sub, margin: `4px 0 0`, lineHeight: FONT.lineHeight.base }}>{f.desc}</p>
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

            <button onClick={() => { setPhase('completion'); window.scrollTo(0, 0); }} style={{ ...S.btnPrimary, width: '100%', padding: '16px 32px', marginTop: SPACING.lg }} className="ce-btn">
              작성 완료하고 다운로드 </button>
          </div>
          <StickyFooter />
        </div>
      </div>
    );
  };

  // ══════════════════ 양식 편집 ══════════════════
  const renderFormEdit = () => {
    const form = FORMS.find(f => f.id === editingFormId);
    if (!form) return null;
    const fIdx = FORMS.findIndex(f => f.id === editingFormId);

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
          </div>

          {downloadSuccess && <div style={{ ...S.boxSuccess, marginBottom: SPACING.md, textAlign: 'center' }}><p style={{ fontSize: FONT.size.sm, color: COLORS.green, fontWeight: FONT.weight.semibold, margin: 0 }}>✓ 백업 .docx 파일을 내려받았습니다</p></div>}
          {copyMsg && <div style={{ ...S.boxSuccess, marginBottom: SPACING.md, textAlign: 'center' }}><p style={{ fontSize: FONT.size.sm, color: COLORS.green, fontWeight: FONT.weight.semibold, margin: 0 }}>{copyMsg}</p></div>}

          <div style={S.cardLarge}>
            <div style={{ marginBottom: SPACING.lg }}>
              <p style={{ fontSize: FONT.size.xs, color: COLORS.accent2, fontWeight: FONT.weight.semibold, margin: 0, marginBottom: 6, letterSpacing: 0.3 }}>양식 {fIdx+1}/7</p>
              <h2 style={S.h2}>{form.title}</h2>
              <p style={{ ...S.subtitle, marginTop: 4 }}>{form.subtitle}</p>
              <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: `${SPACING.sm}px 0 0`, lineHeight: FONT.lineHeight.base }}>{form.desc}</p>
              {form.completion_criteria && (
                <p style={{ fontSize: FONT.size.sm, color: COLORS.green, margin: `${SPACING.sm}px 0 0`, fontWeight: FONT.weight.semibold }}>✓ 완성 기준: {form.completion_criteria}</p>
              )}
            </div>

            {/* 이전 양식 참고 박스 — 참조 양식의 전체 답변을 기본 노출 */}
            {(() => {
              const refFormIds = getReferencedFormIds(form);
              if (refFormIds.length === 0) return null;

              const refsWithContent = refFormIds
                .map(fid => {
                  const refForm = FORMS.find(f => f.id === fid);
                  const content = getFullFormContent(fid);
                  return { refForm, content };
                })
                .filter(x => x.content && x.refForm);

              if (refsWithContent.length === 0) return null;

              return (
                <div style={{ ...S.boxInfo, marginBottom: SPACING.lg }}>
                  <p style={{ ...labelStyle(COLORS.blue), marginBottom: SPACING.xs }}>참고 · 이전 양식에서 작성한 내용</p>
                  <p style={{ fontSize: FONT.size.xs, color: COLORS.sub, margin: `0 0 ${SPACING.sm}px`, lineHeight: FONT.lineHeight.base }}>
                    이 양식을 작성할 때 참고할 만한 이전 양식의 답변입니다. 스크롤하여 전체 내용을 확인하세요.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.sm }}>
                    {refsWithContent.map(({ refForm, content }, i) => (
                      <div key={i} style={{ background: COLORS.bg, padding: SPACING.md, borderRadius: RADIUS.sm, borderLeft: `3px solid ${COLORS.blue}`, maxHeight: 280, overflow: 'auto' }}>
                        <p style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.bold, color: COLORS.blue, margin: 0, marginBottom: SPACING.sm }}>
                          {refForm.title} <span style={{ fontWeight: FONT.weight.regular, color: COLORS.sub, fontSize: FONT.size.xs }}>· {refForm.subtitle}</span>
                        </p>
                        <pre style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0, whiteSpace: 'pre-wrap', fontFamily: FONT.family, lineHeight: FONT.lineHeight.relaxed }}>{content}</pre>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* GenAI 프롬프트 */}
            {form.prompt && (
              <div style={{ ...S.boxInfo, marginBottom: SPACING.lg }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: SPACING.sm, marginBottom: SPACING.sm, flexWrap: 'wrap' }}>
                  <p style={{ ...labelStyle(COLORS.blue), margin: 0 }}>{form.prompt.title}</p>
                  <button onClick={() => copyPrompt(form.prompt.body)} style={{ background: COLORS.blue, color: COLORS.white, border: 'none', padding: '6px 12px', borderRadius: RADIUS.sm, fontSize: FONT.size.xs, fontWeight: FONT.weight.semibold, cursor: 'pointer', fontFamily: FONT.family, display: 'inline-flex', alignItems: 'center', gap: 4 }} className="ce-btn">
                    프롬프트 복사
                  </button>
                </div>
                <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0, lineHeight: FONT.lineHeight.base, fontStyle: 'italic' }}>
                  "{form.prompt.body}"
                </p>
                <p style={{ fontSize: FONT.size.xs, color: COLORS.sub, margin: `${SPACING.sm}px 0 0`, lineHeight: FONT.lineHeight.base }}>
                  [ ] 안의 내용만 나의 상황에 맞게 바꾼 뒤 ChatGPT·Claude 등에 붙여넣으세요. AI 답변은 반드시 출처 확인 후 활용.
                </p>
              </div>
            )}

            {/* 반복 입력 vs 구조화 */}
            {form.type === 'repeat' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
                {jobPostings.map((job, idx) => (
                  <div key={job.id} style={{ background: COLORS.bgAlt, borderRadius: RADIUS.base, padding: SPACING.md, borderLeft: `3px solid ${COLORS.accent2}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm }}>
                      <p style={{ fontSize: FONT.size.md, fontWeight: FONT.weight.bold, color: COLORS.accent, margin: 0 }}>{idx === 0 ? '지원하려는 회사 공고' : `비교 공고 ${idx}`}</p>
                      {jobPostings.length > 1 && (
                        <button onClick={() => removeJobPosting(job.id)} style={{ ...S.btnText, color: COLORS.red }}>
                          삭제
                        </button>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.sm }}>
                      {form.fields.map(f => (
                        <div key={f.key}>
                          <label style={{ ...S.label, fontSize: FONT.size.sm }}>{f.label}</label>
                          {f.rows && f.rows > 1 ? (
                            <textarea className="ce-textarea" value={job[f.key] || ''} onChange={e => updateJobPosting(job.id, f.key, e.target.value)} rows={f.rows} style={{ ...S.textarea, fontSize: FONT.size.sm }} placeholder={f.placeholder || ''} />
                          ) : (
                            <input type="text" className="ce-input" value={job[f.key] || ''} onChange={e => updateJobPosting(job.id, f.key, e.target.value)} style={{ ...S.input, fontSize: FONT.size.sm }} placeholder={f.placeholder || ''} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <button onClick={addJobPosting} style={{ ...S.btnSecondary, justifyContent: 'center', borderStyle: 'dashed' }} className="ce-btn">
                  비교할 공고 추가 (선택)
                </button>
                <div style={S.boxInfo}>
                  <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0, lineHeight: FONT.lineHeight.base }}>
                    <strong>Tip:</strong> 지원하려는 <strong>한 회사·한 직무</strong>에 집중해 공고를 깊이 분석하세요. 다음 단계에서 이 공고의 '주요 업무(직무상세내용)'를 항목별로 나누고, STEP 2 경험정리에서 내 경험과 하나씩 연결합니다. 같은 직무의 다른 공고는 비교가 필요할 때만 추가하세요.
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
                {form.fields.map(f => {
                  const answers = formAnswers[form.id] || {};
                  return (
                    <div key={f.key} style={{ borderLeft: `3px solid ${COLORS.accent2}`, paddingLeft: SPACING.md }}>
                      <label style={S.label}>{f.label}</label>
                      {f.hint && <p style={S.hint}>{f.hint}</p>}
                      {FIELD_EXAMPLES[f.key] && (
                        <div style={{ marginBottom: SPACING.sm }}>
                          <ToggleLink open={!!showExamples[f.key]} onToggle={() => setShowExamples(p => ({ ...p, [f.key]: !p[f.key] }))} label="작성 예시" />
                          {showExamples[f.key] && (
                            <p style={{ margin: '6px 0 0', padding: SPACING.sm, background: COLORS.yellowBg, borderLeft: `3px solid ${COLORS.yellow}`, borderRadius: RADIUS.base, fontSize: FONT.size.sm, color: COLORS.accent, lineHeight: FONT.lineHeight.base, whiteSpace: 'pre-wrap' }}>
                              {FIELD_EXAMPLES[f.key]}
                            </p>
                          )}
                        </div>
                      )}
                      <textarea className="ce-textarea" value={answers[f.key] || ''} onChange={e => setFormAnswer(form.id, f.key, e.target.value)} rows={f.rows || 3} style={S.textarea} placeholder={f.placeholder || ''} />
                    </div>
                  );
                })}
              </div>

            )}

            {/* 네비 */}
            <div style={{ display: 'flex', gap: SPACING.base, marginTop: SPACING.xl, flexWrap: 'wrap' }}>
              <button onClick={() => { setPhase('formList'); window.scrollTo(0,0); }} style={S.btnSecondary} className="ce-btn">
                양식 목록
              </button>
              <button
                onClick={() => { if (fIdx > 0) { setEditingFormId(FORMS[fIdx-1].id); window.scrollTo(0,0); } }}
                disabled={fIdx === 0}
                style={{ ...S.btnSecondary, opacity: fIdx === 0 ? 0.4 : 1, cursor: fIdx === 0 ? 'not-allowed' : 'pointer' }}
                className="ce-btn"
              >
                이전
              </button>
              {fIdx < FORMS.length - 1 ? (
                <button onClick={() => { setEditingFormId(FORMS[fIdx+1].id); window.scrollTo(0,0); }} style={{ ...S.btnPrimary, flex: 1 }} className="ce-btn">
                  다음 </button>
              ) : (
                <button onClick={() => { setPhase('completion'); window.scrollTo(0,0); }} style={{ ...S.btnPrimary, flex: 1 }} className="ce-btn">
                  작성 완료 </button>
              )}
            </div>
          </div>

          <StickyFooter />
        </div>
      </div>
    );
  };

  // ══════════════════ 완성 화면 (대폭 강화) ══════════════════
  const renderCompletion = () => {
    const completedCount = FORMS.filter(f => getFormStatus(f) >= 3).length;
    const jobCount = jobPostings.filter(j => j.company || j.job_title).length;
    const p = persona ? PERSONAS[persona] : null;
    const checkedCount = COMPLETION_CHECKLIST.filter((_, i) => checklistState[i]).length;

    return (
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
            <div style={{ textAlign: 'center', marginBottom: SPACING.xl }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, background: COLORS.greenBg, borderRadius: RADIUS.pill, marginBottom: SPACING.base }}>
                </div>
              <h1 style={S.h1Center}>작성 완료</h1>
              <p style={{ ...S.subtitle, textAlign: 'center' }}>
                분석 공고 {jobCount}개 · 양식 완료 {completedCount}/7
              </p>
              {p && <p style={{ ...S.subtitle, textAlign: 'center', marginTop: 4 }}>분석 유형: <strong>{p.title}</strong></p>}
            </div>

            {/* ── 완성 기준 체크리스트 (PART 6-4 필수) ── */}
            <div style={{ ...S.boxSuccess, marginBottom: SPACING.lg }}>
              <p style={{ ...labelStyle(COLORS.green), marginBottom: SPACING.sm }}>✓ 완성 기준 체크리스트 ({checkedCount}/{COMPLETION_CHECKLIST.length})</p>
              <p style={{ fontSize: FONT.size.xs, color: COLORS.sub, margin: `0 0 ${SPACING.sm}px`, lineHeight: FONT.lineHeight.base }}>
                아래 항목을 직접 확인하며 체크하세요. 채워지지 않은 항목이 있다면 해당 양식으로 돌아가 보완하시기 바랍니다.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {COMPLETION_CHECKLIST.map((item, i) => {
                  const checked = !!checklistState[i];
                  return (
                    <label key={i} style={{ display: 'flex', alignItems: 'start', gap: 8, padding: 8, background: checked ? COLORS.bg : 'transparent', borderRadius: RADIUS.sm, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={e => setChecklistState(p => ({ ...p, [i]: e.target.checked }))}
                        style={{ marginTop: 3, cursor: 'pointer', width: 16, height: 16, accentColor: COLORS.green }}
                      />
                      <span style={{ fontSize: FONT.size.sm, color: COLORS.accent, lineHeight: FONT.lineHeight.base, textDecoration: checked ? 'line-through' : 'none', opacity: checked ? 0.6 : 1 }}>
                        {item}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* ── 작성 내용 참고 (통합 완성본 위, 기본 노출) ── */}
            <div style={{ ...S.boxNeutral, marginBottom: SPACING.lg }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.sm, flexWrap: 'wrap', gap: SPACING.sm }}>
                <h4 style={{ fontSize: FONT.size.md, fontWeight: FONT.weight.semibold, color: COLORS.accent, margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                  지금까지 작성한 내용
                </h4>
                <p style={{ fontSize: FONT.size.xs, color: COLORS.sub, margin: 0 }}>아래 통합 완성본 작성 시 참고하세요</p>
              </div>
              <div style={{ background: COLORS.bg, borderRadius: RADIUS.sm, padding: SPACING.md, border: `1px solid ${COLORS.border}` }}>
                <pre style={{ fontSize: FONT.size.sm, color: COLORS.accent, whiteSpace: 'pre-wrap', fontFamily: FONT.family, margin: 0, lineHeight: FONT.lineHeight.relaxed, maxHeight: 400, overflow: 'auto' }}>{buildTextDump()}</pre>
              </div>
            </div>

            {/* ── 통합 완성본 textarea (기본 노출, 토글 제거) ── */}
            <div style={{ background: COLORS.bgAlt, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.base, padding: SPACING.md, marginBottom: SPACING.lg }}>
              <h3 style={{ ...S.h3, fontSize: FONT.size.md, display: 'flex', alignItems: 'center', gap: 6, marginBottom: SPACING.base }}>
                통합 완성본 (선택)
              </h3>
              <p style={{ fontSize: FONT.size.xs, color: COLORS.sub, margin: `0 0 ${SPACING.sm}px`, lineHeight: FONT.lineHeight.base }}>
                위의 작성 내용을 참고해 분석 결과를 한 문단으로 요약해보세요. 비워두고 바로 다운로드해도 됩니다.
              </p>
              <textarea
                className="ce-textarea"
                value={finalText}
                onChange={e => setFinalText(e.target.value)}
                rows={6}
                style={{ ...S.textarea, fontSize: FONT.size.md }}
                placeholder={`예시: 이 직무의 핵심 역량은 OO, OO, OO이다. 내가 가진 것은 OO, 부족한 것은 OO이다. 지원 전략은 OO이며, 자소서에서 강조할 앵글은 OO이다.`}
              />
              <p style={{ fontSize: FONT.size.xs, color: COLORS.sub, textAlign: 'right', margin: '4px 0 0', fontVariantNumeric: 'tabular-nums' }}>
                {(finalText || '').length}자
              </p>
            </div>

            <button onClick={() => window.__CE_RESET?.fn?.()} title="이 워크북 작성 내용을 모두 지우고 처음부터 다시 작성" style={{ background: 'transparent', color: COLORS.red, border: `1px solid ${COLORS.red}66`, borderRadius: 10, padding: '0 14px', fontSize: 16, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', height: 40, display: 'inline-flex', alignItems: 'center', marginRight: 6 }}>삭제하고 다시 작성</button><button onClick={goHome} title="처음 페이지로 이동 (작성 내용 유지)" style={{ background: 'transparent', color: COLORS.sub, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: '0 14px', fontSize: 16, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', height: 40, display: 'inline-flex', alignItems: 'center' }}>처음으로</button>

            <button onClick={downloadFinal} style={{ ...S.btnPrimary, width: '100%', padding: '18px 32px', fontSize: FONT.size.lg, marginTop: SPACING.md }} className="ce-btn">
              전체 분석 다운로드 (.docx)
            </button>
            <button onClick={() => setPhase('formList')} style={{ ...S.btnSecondary, width: '100%', marginTop: SPACING.sm, justifyContent: 'center' }} className="ce-btn">
              이전
            </button>

            {downloadSuccess && <p style={{ fontSize: FONT.size.sm, color: COLORS.green, textAlign: 'center', marginTop: SPACING.md, fontWeight: FONT.weight.semibold }}>✓ 다운로드 완료</p>}

          </div>
          <StickyFooter />
        </div>
      </div>
    );
  };

  if (phase === 'intro') return renderIntro();
  if (phase === 'diagnosis') return renderDiagnosis();
  if (phase === 'formList') return renderFormList();
  if (phase === 'formEdit') return renderFormEdit();
  if (phase === 'completion') return renderCompletion();
  // 알 수 없는 phase → intro로 안전 폴백 (빈 화면 방지)
  try { console.warn('[job_analysis] unknown phase, falling back to intro:', phase); } catch { /* 무시 */ }
  return renderIntro();
};

export default JobAnalysisWorkbook;
