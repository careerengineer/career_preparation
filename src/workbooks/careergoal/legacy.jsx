// [BUILD v36 20260520 10:30] docx 저장에 CareerEngineer 자료 + 멘토링 안내 섹션 추가 (ExternalHyperlink + linkP)
import React, { useState, useEffect, useRef } from 'react';
import { COLORS, FONT, SPACING, RADIUS, MENTORING_URLS } from '../../shared/design/tokens.js';
import { AnswerQualityCheck } from '../../shared/components/AnswerQualityCheck.jsx';
import { ReferenceInline } from '../../shared/components/ReferenceInline.jsx';

// 멘토링·컨설팅 URL 상수 (작업 18: URL 상수화)
// ══════════════════════════════════════════════════════════════
//  CareerEngineer 입사 후 포부 워크북
//  — 3라운드 체계적 작성 시스템
//  — 공식 디자인 토큰 내장형 (Standalone)
// ══════════════════════════════════════════════════════════════

// ────────────────────────────────────────────────────────────
//  CAREERENGINEER 공식 디자인 토큰
//  (careerengineer-theme.js 기준, Standalone 내장)
// ────────────────────────────────────────────────────────────

// ════════════════════════════════════════════════════════════════
//  CareerEngineer 워크북 라이브러리 (URL은 나중에 일괄 적용)
// ════════════════════════════════════════════════════════════════
const WORKBOOK_LINKS = { career_roadmap: { label: 'STEP 0 · 취업준비 진단', url: 'https://www.latpeed.com/products/YPFjD' },
  job_analysis:       { label: 'STEP 1 · 채용공고 및 직무 분석', url: 'https://www.latpeed.com/products/-3Wgm' },
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
  primary: { background: COLORS.accent, color: COLORS.white, border: 'none', borderRadius: RADIUS.md, padding: '14px 32px', fontSize: FONT.size.md, fontWeight: FONT.weight.semibold, cursor: 'pointer' },
  secondary: { background: COLORS.white, color: COLORS.accent, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.md, padding: '14px 32px', fontSize: FONT.size.md, fontWeight: FONT.weight.medium, cursor: 'pointer' },
  text: { background: 'transparent', color: COLORS.accent2, border: 'none', padding: '8px 0', fontSize: FONT.size.base, fontWeight: FONT.weight.medium, cursor: 'pointer', textDecoration: 'underline' },
};


const CareerAspirationWorkbook = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [currentPhase, setCurrentPhase] = useState('round1');
  const [currentStep, setCurrentStep] = useState(() => { try { const __d = JSON.parse(localStorage.getItem('careerengineer_careergoal_v1') || '{}'); return (__d.basicInfo && (__d.basicInfo.industry || __d.basicInfo.position || __d.basicInfo.company)) ? 1 : 0; } catch { return 0; } });
  const [selectedSteps, setSelectedSteps] = useState([]);
  const [showGuide, setShowGuide] = useState({});
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [showRawAnswers, setShowRawAnswers] = useState(false);
  const [finalText, setFinalText] = useState('');
  const [checklistState, setChecklistState] = useState({});
  const [basicInfo, setBasicInfo] = useState({ position: '', company: '', industry: '' });
  const [answers, setAnswers] = useState({});
  const [autoSaveStatus, setAutoSaveStatus] = useState('');
  const [confirmingClear, setConfirmingClear] = useState(false);
  const [clearedFlash, setClearedFlash] = useState(false);
  const [hasRestored, setHasRestored] = useState(false);

  // 자동 저장 키
  const STORAGE_KEY = 'careerengineer_careergoal_v1';

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
            if (typeof data.currentStep === 'number') setCurrentStep(data.currentStep);
            if (data.showIntro === false) setShowIntro(false);
            setHasRestored(true);
            setAutoSaveStatus('✓ 이전 작성 내용을 불러왔습니다');
            setTimeout(() => setAutoSaveStatus(''), 5000);
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      }
    } catch (e) {
      console.warn('자동 복구 실패:', e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 데이터 변경 시 자동 저장 (디바운스 1초)
  useEffect(() => {
    if (Object.keys(answers).length === 0 && !finalText && !(basicInfo?.industry || basicInfo?.position || basicInfo?.company)) return;
    
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          answers, basicInfo, finalText, checklistState, selectedSteps,
          currentPhase, currentStep, showIntro,
          savedAt: new Date().toISOString()
        }));
        setAutoSaveStatus('✓ 자동 저장됨');
        setTimeout(() => setAutoSaveStatus(''), 2000);
      } catch (e) {
        console.warn('자동 저장 실패:', e);
        setAutoSaveStatus('⚠ 저장 공간 부족');
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [answers, basicInfo, finalText, checklistState, selectedSteps, currentPhase, currentStep, showIntro]);

  // 저장된 데이터 초기화
  const clearSavedData = () => {
    if (confirmingClear) {
      localStorage.removeItem(STORAGE_KEY);
      setAnswers({});
      setBasicInfo({ position: '', company: '', industry: '' });
      setFinalText('');
      setConfirmingClear(false);
      setClearedFlash(true);
      setTimeout(() => { localStorage.removeItem(STORAGE_KEY); }, 50);
      setTimeout(() => { localStorage.removeItem(STORAGE_KEY); }, 1500);
      setTimeout(() => setClearedFlash(false), 3000);
    } else {
      setConfirmingClear(true);
      setTimeout(() => setConfirmingClear(false), 5000);
    }
  };

  const round1Steps = [
    { id: 0, title: '기본 정보 입력', subtitle: '지원할 직무와 회사를 입력하세요' },
    {
      id: 1,
      title: 'Q1: 이 직무에서 진짜 중요한 것',
      subtitle: '직무상세내용 키워드 직접 인용 · 핵심 업무의 본질 · 연계 팀 파악',
      questions: [
        {
          id: 'q1_1_1',
          label: 'Q1-1. 이 직무의 핵심 업무 3가지와 그 본질은 무엇인가요?',
          hint: '채용공고(직무상세내용)에 나온 키워드를 직접 인용하세요 — 단순 나열이 아닌 "왜 이 업무가 중요한가"까지',
          guide: {
            description: '[핵심 포인트] 직무상세내용의 "주요업무" 항목에 나온 단어를 그대로 가져오되, 그 업무의 본질이 무엇인지까지 써야 합니다. "보고서 작성"이 아닌 "데이터를 근거로 의사결정을 지원하는 것"처럼요.',
            diagnosis: '즉석자가진단: 각 업무 뒤에 "이 업무를 왜 하나요?"라고 물었을 때 3초 안에 즉답 가능한가?',
            helpQuestions: [
              '직무상세내용의 주요업무 중 가장 많은 비중을 차지할 것 같은 업무는?',
              '이 직무가 없으면 조직에서 어떤 문제가 생기나요?',
              '이 직무의 최종 산출물(output)은 무엇인가요?'
            ],
            ifDifficult: '지금 바로 직무상세내용을 열어두고 작성하세요. "주요업무" 항목의 첫 3개를 기준으로 시작하세요.',
            ifStillDifficult: '현직자 인터뷰 영상이나 블로그에서 "이 직무의 하루 일과"를 찾아보세요. 반복적으로 언급되는 업무가 핵심입니다.'
          },
          placeholder: '예(생산기술 기준): ① 공정 개선 — 불량률·사이클타임 데이터를 분석하여 생산성을 높이는 것이 본질 ② 설비 관리 — 장비 가동률을 유지하여 생산 계획을 지키는 것 ③ 품질 검증 — 신제품 양산 전 공정 안정성을 확인하여 클레임을 예방하는 것',
          rows: 4, relatedWorkbooks: ['job_analysis', 'experience', 'motivation', 'jobcompetency', 'personality', 'goalachievement']
        },
        {
          id: 'q1_1_2',
          label: 'Q1-2. 이 직무에서 성과를 내는 사람들이 공통적으로 갖춘 역량은 무엇인가요?',
          hint: '시니어 채용공고 + 현직자 인터뷰 기반 — 상상이 아닌 리서치의 결과여야 합니다',
          guide: {
            description: '[리서치가 필요한 이유] 이 답변이 Q2 역량 진단의 기준이 됩니다. 내 보유 역량이 충분한지, 무엇이 부족한지를 판단하려면 먼저 "잘하는 사람들이 갖춘 것"을 알아야 합니다.',
            diagnosis: '즉석자가진단: "시니어는 어떤 일을 하고, 그러려면 무엇이 필요한가?"에 구체적으로 답할 수 있는가?',
            helpQuestions: [
              '지원 직무명 + "시니어" 채용공고를 검색해보세요 — 요구 역량 항목에 무엇이 있나요?',
              '현직자 인터뷰에서 "이 일을 잘하려면 뭐가 중요해요?"라는 답변은?',
              '기술적 역량과 소프트 스킬 각각 1~2가지씩 구분해보세요'
            ],
            ifDifficult: '시니어 직무상세내용과 신입 직무상세내용을 비교하면 추가된 항목이 보입니다. 그것이 성장하면서 쌓아야 할 역량입니다.',
            ifStillDifficult: '지금 당장 시니어 채용공고 하나만 찾아서 "우대사항"을 읽어보세요. 30분이면 충분합니다.'
          },
          placeholder: '예(생산기술 기준): [기술 역량] 공정 분석 능력(SPC·FMEA 활용), 설비 트러블슈팅 역량, 도면·공차 해독 능력 / [소프트 스킬] 데이터 기반 문제해결 사고, 유관부서(품질·설비·개발팀)와의 협업 커뮤니케이션 / [리서치 출처: ○○사 생산기술 시니어 채용공고 + ○○ 현직자 인터뷰]',
          rows: 4, relatedWorkbooks: ['job_analysis', 'experience', 'motivation', 'jobcompetency', 'personality', 'goalachievement']
        },
        {
          id: 'q1_1_3',
          label: 'Q1-3. 이 직무가 협업하는 연계 팀/직무는 무엇이고, 그 협업에서 이 직무는 어떤 역할을 하나요?',
          hint: '연계 팀의 직무를 이해하는 것이 업무 범위 확장의 출발점 — 직무상세내용의 "유관부서" 키워드 확인',
          guide: {
            description: '[중요한 이유] 이 직무를 깊이 아는 사람은 자기 직무만 아는 것이 아니라 연계 팀의 니즈도 압니다. "팀 차원의 기여"를 쓸 때 구체성이 생기는 이유입니다. 연계 팀을 모르면 "협업하겠습니다"는 공허한 말이 됩니다.',
            diagnosis: '즉석자가진단: "품질팀(또는 연계팀)이 이 직무에 원하는 것이 무엇인가요?"에 답할 수 있는가?',
            helpQuestions: [
              '이 직무의 산출물을 누가 받아서 사용하나요?',
              '이 직무가 없으면 어떤 팀이 가장 먼저 타격을 받나요?',
              '직무상세내용의 "협업", "유관부서", "공유" 관련 내용을 확인해보세요'
            ],
            ifDifficult: '직무상세내용에서 "협업", "유관부서", "공유" 등의 키워드를 찾아보세요. 어떤 팀과 무엇을 주고받는지가 드러납니다.',
            ifStillDifficult: '현직자 인터뷰에서 "하루 중 가장 많이 소통하는 팀이 어딘가요?"라는 답변을 찾아보세요.'
          },
          placeholder: '예(생산기술 기준): [연계팀] ① 품질팀 — 불량 분석 데이터 공유, 공정 개선 결과 검증 협의 ② 설비팀 — 설비 이상 발생 시 원인 공동 분석 ③ 개발팀 — 신제품 시생산(MP) 단계에서 공정 적합성 검토 / [이 직무의 역할] 각 팀의 요구사항을 공정 데이터로 연결하고, 현장과 사무실 사이의 기술적 다리 역할',
          rows: 4, relatedWorkbooks: ['job_analysis', 'experience', 'motivation', 'jobcompetency', 'personality', 'goalachievement']
        }
      ]
    },
    {
      id: 2,
      title: 'Q2: 지금 나는 어디에 있는가',
      subtitle: '보유 역량 · 부족한 역량 · 이미 시작한 노력 — 솔직하고 구체적인 자기 평가',
      questions: [
        {
          id: 'q1_2_1',
          label: 'Q2-1. 이 직무에서 즉시 활용 가능한 보유 역량은 무엇인가요?',
          hint: '증거(프로젝트·자격증·경험)가 있는 역량만 쓰세요 — Q1-2의 "성과자 역량"을 기준으로 점검',
          guide: {
            description: '[기준] Q1-2에서 파악한 "성과를 내는 사람들의 역량"을 기준으로 내가 이미 갖춘 것을 점검합니다. "잘한다"가 아니라 "이 경험으로 증명할 수 있다"는 역량만 쓰세요.',
            diagnosis: '즉석자가진단: "그 역량을 증명할 수 있는 경험이 하나 있나요?"라는 질문에 3초 안에 즉답 가능한가?',
            helpQuestions: [
              '지금 당장 이 직무 업무를 도울 수 있는 것은 무엇인가요?',
              '어떤 수준인가요? (기초/중급/활용 가능 등)',
              '그 역량을 확인할 수 있는 경험이나 결과물이 있나요?'
            ],
            ifDifficult: '학교 수업, 프로젝트, 동아리, 자격증, 개인 공부 모두 포함합니다. 작아도 괜찮습니다.',
            ifStillDifficult: '"수업에서 ○○을 했고", "프로젝트에서 ○○을 담당해서", "자격증 ○○으로 기초를 갖췄다"처럼 경험과 연결해서 쓰세요.'
          },
          placeholder: '예(생산기술 기준): ① 도면 해독 — 캡스톤 프로젝트에서 3D 도면 작성 경험, GD&T 기초 수준 ② 데이터 분석 — Excel 피벗테이블 활용 가능, 통계 기초 수업 이수 ③ 공정 이해 — 생산관리 수업 A+, 스마트팩토리 견학 2회 / 즉시 활용 가능 여부: ①②는 보조 역할로 기여 가능, ③은 이해 수준',
          rows: 4, relatedWorkbooks: ['job_analysis', 'experience', 'motivation', 'jobcompetency', 'personality', 'goalachievement']
        },
        {
          id: 'q1_2_2',
          label: 'Q2-2. Q1에서 파악한 필요 역량 중 부족한 것은 무엇인가요?',
          hint: '솔직하게 — 부족한 정도(미경험/이론 수준/기초)까지 구체적으로 명시',
          guide: {
            description: '[핵심] 부족한 역량을 솔직하게 인정하는 것이 오히려 신뢰를 만듭니다. 어느 정도 수준인지까지 구체적으로 써야 Q3에서 준비 계획을 세울 수 있습니다.',
            diagnosis: '즉석자가진단: "그 역량을 지금 당장 업무에 적용할 수 있나요?"에 솔직하게 답할 수 있는가?',
            helpQuestions: [
              'Q1-2에서 쓴 "성과자 역량" 목록을 다시 보세요 — 내가 없는 것은?',
              '신입에게 요구되는 것 중 아직 갖추지 못한 것은?',
              '"당장 업무에 쓰면 팀에 민폐가 될 것 같다"는 역량이 있나요?'
            ],
            ifDifficult: '부족한 역량이 없다면 직무상세내용을 다시 읽어보세요. 경험 없이 갖출 수 있는 역량은 거의 없습니다.',
            ifStillDifficult: '"이 역량이 필요한 상황을 맞닥뜨리면 어떻게 될까?"라고 상상해보세요. 버벅거릴 것 같은 것이 부족한 역량입니다.'
          },
          placeholder: '예(생산기술 기준): ① 설비 트러블슈팅 — 미경험, 실제 장비를 다뤄본 적 없음 ② FMEA 작성 — 개념은 알지만 실제로 작성해본 경험 없음 ③ SPC 데이터 해석 — 이론은 배웠지만 실무 데이터로 활용해본 적 없음 / 수준 평가: ①은 완전 미경험, ②③은 이론 수준',
          rows: 3, relatedWorkbooks: ['job_analysis', 'experience', 'motivation', 'jobcompetency', 'personality', 'goalachievement']
        },
        {
          id: 'q1_2_3',
          label: 'Q2-3. 이미 시작한 역량 개발 노력이 있나요?',
          hint: '"앞으로 하겠다"가 아닌 "이미 하고 있다" — 현재 진행 중인 것만, 아직 없다면 솔직하게',
          guide: {
            description: '[지원동기와 다른 점] 지원동기의 역량 준비는 "왜 이 역량을 준비했는가"의 목적을 설명합니다. 여기서는 이미 시작한 것의 진행 상황을 있는 그대로 기술하면 됩니다. 아직 시작하지 않은 것은 Q3에서 계획으로 씁니다.',
            diagnosis: '즉석자가진단: "지금 당장 증명할 수 있는 학습 활동이 있나요?"에 즉답 가능한가?',
            helpQuestions: [
              '최근 3개월 내에 시작한 학습 활동은?',
              '강의 수강, 자격증 준비, 개인 프로젝트, 스터디 참여 등',
              '아직 아무것도 시작하지 않았다면 솔직하게 "준비 시작 전"이라고 쓰세요'
            ],
            ifDifficult: '작은 것이라도 괜찮습니다. 유튜브 강의 1개를 봤어도 "시청 중"이라고 쓰세요.',
            ifStillDifficult: '아무것도 없다면 솔직하게 인정하고, 그 에너지를 Q3 준비 계획을 세우는 데 쓰세요.'
          },
          placeholder: '예: ① FMEA — 관련 교재 구매 후 1~3장 학습 완료 (현재 진행 중) ② SPC — 코세라 "통계적 공정 관리" 강의 수강 중 (40% 완료) ③ 현장 감각 — 학교 실습실에서 CNC 기초 조작 경험 (올해 3월 완료)',
          rows: 3, relatedWorkbooks: ['experience', 'motivation', 'jobcompetency', 'personality', 'goalachievement']
        }
      ]
    },
    {
      id: 3,
      title: 'Q3: 무엇을 어떻게 준비하고 어떻게 확장할 것인가',
      subtitle: '역량 확보 계획 (방법+시기+측정기준) · 단기 범위 확장 서사',
      questions: [
        {
          id: 'q1_3_1',
          label: 'Q3-1. 부족한 역량별로 구체적인 확보 방법과 시기를 작성하세요.',
          hint: '"열심히 하겠습니다"는 계획이 아닙니다 — 역량마다 방법+시기+측정기준이 하나의 세트',
          guide: {
            description: '[가장 중요한 질문] "○○ 역량이 부족하기 때문에 ○○ 방법으로 ○개월 안에 준비하겠다"는 구조가 되어야 합니다. 직무상세내용에 나온 키워드를 직접 연결해서 쓰세요. "열심히 배우겠다"는 이 질문의 답이 아닙니다.',
            diagnosis: '즉석자가진단: "다음 달에는 어떤 것을 할 건가요?"에 즉답 가능한가?',
            helpQuestions: [
              'Q2-2에서 쓴 부족한 역량 목록을 가져오세요',
              '각 역량을 어떤 방법으로 채울 수 있나요? (강의·자격증·OJT·멘토링·프로젝트)',
              '입사 전에 할 것 vs 입사 후에 채울 것을 구분하세요'
            ],
            ifDifficult: '역량 한 개씩만 집중해서 쓰세요. "FMEA → ○○ 교재 완독 (2개월) → 실무 워크시트 작성 가능 수준"처럼요.',
            ifStillDifficult: '"역량명 / 현재 수준 / 준비 방법 / 완료 시기 / 확인 방법" 다섯 칸을 채운다고 생각하고 써보세요.'
          },
          placeholder: '예(생산기술 기준):\n[FMEA 작성 역량] 현재: 개념만 앎 → 방법: ○○ 교재 완독 + 가상 공정 시뮬레이션 3회 → 시기: 입사 전 2개월 → 확인: 스스로 FMEA 양식 작성 가능 여부\n[SPC 실무 해석] 현재: 이론 수준 → 방법: 공개 데이터셋으로 관리도 직접 작성 → 시기: 입사 후 3개월 → 확인: 이상 원인 분류 가능 수준\n[설비 트러블슈팅] 현재: 미경험 → 방법: 입사 후 OJT + 선배 동행 → 시기: 6개월 → 확인: 일상 점검 독립 수행',
          rows: 6, relatedWorkbooks: ['job_analysis', 'experience', 'motivation', 'jobcompetency', 'personality', 'goalachievement']
        },
        {
          id: 'q1_3_2',
          label: 'Q3-2. 역량이 갖춰지면 어떻게 업무 범위를 확장해나갈 것인가요?',
          hint: '개인 숙달 → 파트 기여 → 팀 기여 — 직무상세내용 키워드를 작은 단위에서 큰 단위로 연결',
          guide: {
            description: '[확장의 의미] "더 많은 일을 하겠다"가 아닙니다. 내가 맡은 업무에서 쌓은 데이터·노하우·분석 결과가 파트와 팀 전체에 어떤 가치를 줄 수 있는지입니다. 직무상세내용 키워드를 그대로 써서 "이 역량을 이 범위에서 이렇게 활용하겠다"는 흐름을 만드세요.',
            diagnosis: '즉석자가진단: "당신의 일이 팀 전체에 어떤 영향을 미치나요?"라고 물으면 구체적으로 답할 수 있는가?',
            helpQuestions: [
              '내 담당 업무의 결과물을 파트의 누가 활용하게 될까요?',
              'Q1-3에서 파악한 연계 팀이 내 업무 결과를 어떻게 활용할 수 있나요?',
              '직무상세내용에서 "표준화", "가이드 작성", "교육" 관련 내용이 있었나요?'
            ],
            ifDifficult: '직무상세내용 키워드 하나를 골라 "처음엔 내 담당 업무에서 → 나중엔 팀 전체에서" 흐름만 그려보세요.',
            ifStillDifficult: '"내가 이 업무를 잘 하면, 파트의 어떤 문제가 해결되나요?"를 생각해보세요.'
          },
          placeholder: '예(생산기술 기준): [개인] 담당 공정 1개 불량 원인 데이터 분석 후 개선안 제안 / [파트] 분석 방법론을 파트 표준 양식으로 공유 → 팀원들도 동일하게 적용 가능 / [팀] 품질팀이 원하는 형식으로 불량 데이터 정기 공유 / [연결] 직무상세내용 키워드 "공정 개선" → 개인 공정 → 파트 내 유사 공정 3개 → 라인 전체로 확장',
          rows: 4, relatedWorkbooks: ['job_analysis', 'motivation', 'jobcompetency', 'personality', 'goalachievement']
        },
        {
          id: 'q1_3_3',
          label: 'Q3-3. 역량이 갖춰졌다는 것을 어떻게 측정할 것이고, 1년 후 어떤 수준이 될 것인가요?',
          hint: '"잘한다는 느낌"이 아닌 객관적 기준 + "1년 후 독립적으로 수행할 수 있는 업무"',
          guide: {
            description: '[두 가지를 함께] 역량 달성 여부를 확인하는 기준과, 1년 후 "어떤 업무를 수행하는 사람이 되어 있을 것인가"를 함께 씁니다. 면접관이 "1년 후에 어떤 수준이 될 것 같나요?"라고 물었을 때 바로 나오는 답변이어야 합니다.',
            diagnosis: '즉석자가진단: "1년 후 어떤 업무를 독립적으로 수행할 수 있나요?"에 즉답 가능한가?',
            helpQuestions: [
              '이 역량이 필요한 업무를 혼자 수행할 수 있는가?',
              '수치로 표현할 수 있는 것은? (오류율, 소요시간, 처리 건수 등)',
              '3개월 / 6개월 / 1년 후 "할 수 있게 되는 것"을 구분하세요'
            ],
            ifDifficult: '"독립 수행 가능 여부"도 충분한 기준입니다. "선배 없이도 ○○을 완료할 수 있다"처럼요.',
            ifStillDifficult: '"입사 후 1년 경과 후 팀장이 나에게 맡길 수 있는 일은 무엇인가?"를 상상해보세요.'
          },
          placeholder: '예:\n[측정 기준] FMEA: 신규 공정 시나리오를 혼자 작성 후 팀장 리뷰 통과 / 공정 개선: 불량률 데이터 분석 후 개선안 1건 독립 제안 가능\n[1년 후 수행 가능 업무]\n3개월: 공정 표준서 파악 완료 + FMEA 양식 선배 검토 하에 작성\n6개월: 불량 데이터 1차 분석 독립 수행 + 품질팀 협의 참여\n1년: 담당 공정 불량률 감소 과제 독립 제안 + 파트 내 분석 방법론 공유',
          rows: 5, relatedWorkbooks: ['interview_new', 'interview_career', 'motivation', 'jobcompetency', 'personality', 'goalachievement']
        }
      ]
    },
    {
      id: 4,
      title: 'Q4: 성장하면 어디로 — 다음 단계와 큰 그림',
      subtitle: '다음 역할의 요건·준비 경로 · 조직 기여 · 회사 방향성 연결',
      questions: [
        {
          id: 'q1_q4_1',
          label: 'Q4-1. 이 직무에서 성장하면 구체적으로 어떤 다음 역할이 열리고, 그 단계를 위해 무엇을 준비할 것인가요?',
          hint: '시니어 채용공고 리서치 기반 — 막연한 "전문가"가 아닌 실제 역할 + 진입하기 위한 준비 경로',
          guide: {
            description: '[리서치가 필요한 이유] 이 직무에서 3~5년 경력자가 실제로 하는 일을 알아야 현실적인 목표가 됩니다. 단순히 "성장하겠다"가 아니라, 그 다음 단계에 진입하기 위해 지금부터 어떤 준비를 해야 하는지까지 연결되어야 합니다.',
            diagnosis: '즉석자가진단: "이 직무 4년차는 어떤 일을 하나요? 그 수준이 되려면 지금 무엇을 해야 하나요?"에 즉답 가능한가?',
            helpQuestions: [
              '이 직무 시니어 채용공고의 "주요업무"와 "자격요건"을 읽어보세요',
              '주니어와 시니어의 역할 차이는 무엇인가요?',
              '그 다음 단계로 가기 위해 2~3년차에 어떤 경험이 필요한가요?'
            ],
            ifDifficult: '지금 당장 [직무명 + 시니어 OR 경력] 채용공고를 하나 찾아보세요. 거기 나온 역할이 내 다음 목표입니다.',
            ifStillDifficult: '"신입에게 없고 시니어에게 있는 것"이 바로 다음 단계에서 쌓아야 할 역량입니다.'
          },
          placeholder: '예(생산기술 기준): [다음 역할 — 리서치 결과]\n시니어 직무상세내용 기준: ① 공정 라인 전체 관리 책임 ② 신제품 MP 총괄 참여 ③ 원가 절감 과제 프로젝트 리드 ④ 후임 교육 및 표준서 수립 책임\n[그 단계를 위한 준비 경로]\n2년차: 라인 밸런싱 과제 보조 참여 자원 + PLC 기초 외부 교육\n3년차: 원가 절감 과제 1건 독립 기획·실행 경험 쌓기\n자격증: 생산관리기사 입사 후 2년차 내 취득',
          rows: 5, relatedWorkbooks: ['job_analysis', 'experience', 'motivation', 'jobcompetency', 'personality', 'goalachievement']
        },
        {
          id: 'q1_q4_2',
          label: 'Q4-2. 팀을 넘어 조직 전체에 어떻게 기여하고 싶으며, 그 기여가 이 회사의 방향성과 어떻게 연결되나요?',
          hint: '장기 큰 그림 + 회사 IR·뉴스룸 리서치 기반 — 회사의 직무분석 없이는 쓸 수 없는 내용',
          guide: {
            description: '[마지막 설득] 나의 성장 경로가 이 회사의 방향성과 맞닿는 지점을 구체적으로 보여줍니다. "이 회사에서 성장하는 것이 왜 의미 있는가"의 답입니다. 리서치 없이 쓴 일반론은 면접관이 바로 알아챕니다.',
            diagnosis: '즉석자가진단: "다른 회사가 아닌 이 회사에서 이 성장 경로가 왜 의미 있는가요?"에 답할 수 있는가?',
            helpQuestions: [
              '이 회사가 추진 중인 중장기 사업 방향은 무엇인가요? (IR자료·뉴스룸 확인)',
              '그 방향과 내 성장 경로가 겹치는 지점은?',
              '이 직무의 최고 전문가가 된다면 회사의 어떤 의사결정에 영향을 줄 수 있나요?'
            ],
            ifDifficult: '회사 홈페이지 > 투자자 정보(IR) 또는 뉴스룸에서 최근 중장기 전략 자료를 찾아보세요.',
            ifStillDifficult: '"이 회사가 ○○ 방향으로 나아가는데, 내가 ○○ 역량을 갖추면 그 과정에서 이렇게 기여할 수 있다"는 구조로 씁니다.'
          },
          placeholder: '예: [조직 전체 기여] 공정 데이터 분석·자동화 전문가로서 스마트팩토리 전환 과제 주도, 신공장 공정 표준 수립, 협력사 기술 지원으로 공급망 전체 품질 강화 기여\n[회사 방향성 연결] 귀사 IR 자료 기준 "스마트 제조 전환 가속" 전략과, 내가 중기적으로 쌓아갈 데이터 기반 공정 분석·자동화 역량이 직접 연결됩니다. 이 회사에서 성장하는 것이 귀사의 미래 공장 구현에 실질적인 기여가 될 것이라 생각합니다.',
          rows: 5, relatedWorkbooks: ['job_analysis', 'experience', 'motivation', 'jobcompetency', 'personality', 'goalachievement']
        }
      ]
    }
  ];

  const round2Questions = {
    1: [
      {
        id: 'q2_1_1',
        label: 'Q1 심화-1. 지금 당장 직무상세내용을 열어두고 — 핵심 업무 키워드를 3~5개 뽑아 각각의 본질을 한 문장으로 정의하세요.',
        hint: '직무상세내용 키워드를 그대로 인용 + "이 업무의 존재 이유"를 풀어쓰는 연습',
        guide: {
          description: '단어를 복붙하는 것이 아니라, 그 단어가 담고 있는 의미를 풀어쓰는 것입니다. "공정 개선"이 아니라 "생산 비용 구조를 바꿔 제품 경쟁력을 높이는 것"처럼요. 이 연습이 되면 면접에서 "이 직무에서 가장 중요한 것이 뭔가요?"에 막히지 않습니다.',
          diagnosis: '즉석자가진단: "이 업무의 존재 이유가 무엇인가요?"라고 물으면 3초 안에 즉답 가능한가?',
          helpQuestions: [
            '지금 직무상세내용의 주요업무 항목을 열어두고 핵심 단어를 표시하세요',
            '각 업무 옆에 "이 업무가 없으면 회사에서 어떤 문제가 생기나?" 한 줄씩 씁니다',
            '면접관이 "이 직무에서 가장 중요한 것이 뭐예요?"라고 물으면?'
          ],
          ifDifficult: '직무상세내용의 단어를 그대로 쓰되, 각 단어 옆에 "(왜냐하면 ___)" 한 문장만 추가해보세요.',
          ifStillDifficult: '현직자 유튜브에서 "이 직무의 가장 중요한 역량이 뭔가요?"라는 질문에 대한 답변을 찾아보세요.'
        },
        placeholder: '예(생산기술 기준):\n직무상세내용 키워드 → 본질 정의\n"공정 개선" → 불량·원가·사이클타임 데이터를 분석해 생산 경쟁력을 높이는 것\n"설비 관리" → 장비 가동률을 유지해 납기 약속을 지키는 것\n"품질 문제 대응" → 문제를 재발 없이 원인에서 차단하는 것\n"표준화 문서 작성" → 현장 노하우를 조직 자산으로 만드는 것',
        rows: 5, relatedWorkbooks: ['job_analysis', 'self_introduction', 'motivation', 'jobcompetency', 'personality', 'goalachievement']
      },
      {
        id: 'q2_1_2',
        label: 'Q1 심화-2. 이 직무에서 "절대 하기 싫은 일"과 "가장 하고 싶은 일"을 비교해보세요.',
        hint: '싫은 것을 먼저 찾으면 정말 원하는 것이 선명해집니다 — 지원동기와도 연결되는 내용',
        guide: {
          description: '하고 싶은 것보다 하기 싫은 것이 더 솔직하게 나옵니다. 이 대비에서 "이 직무를 선택한 나만의 이유"가 드러납니다.',
          diagnosis: '즉석자가진단: 두 가지를 대비했을 때 "이래서 이 직무를 선택했다"는 이유가 보이나요?',
          helpQuestions: [
            '이 직무에서 단순 반복만 하게 된다면 어떤 기분일까요?',
            '이 직무의 어떤 순간에 가장 보람을 느낄 것 같은가요?',
            '다른 직무와 비교했을 때 이 직무만이 줄 수 있는 것은?'
          ],
          ifDifficult: '이 직무에서 성공한 사람의 하루를 상상해보세요. 그 하루 중 어떤 장면이 가장 하고 싶나요?',
          ifStillDifficult: '"계속 하다 보면 지칠 것 같은 것"과 "계속해도 안 지칠 것 같은 것"을 나눠보세요.'
        },
        placeholder: '예: [절대 하기 싫은 것] 문제 원인을 찾지 못한 채 임시방편으로만 해결하는 것, 데이터 없이 직관으로만 판단하는 환경\n[가장 하고 싶은 것] 불량 데이터를 파고들어 진짜 원인을 찾아내고 재발을 막는 것, 공정을 구조적으로 바꿔서 팀 전체의 업무 부담을 줄이는 것\n→ 이 직무를 선택한 이유: 문제를 데이터로 구조적으로 해결하는 것에 가장 몰입할 수 있기 때문',
        rows: 5, relatedWorkbooks: ['job_analysis', 'motivation', 'jobcompetency', 'personality', 'goalachievement']
      },
      {
        id: 'q2_1_3',
        label: 'Q1 심화-3. 연계 팀(품질·설비·개발 등)의 직무상세내용을 하나 찾아보고, 그 팀이 이 직무에 원하는 것을 써보세요.',
        hint: '상대방의 언어를 알아야 진짜 협업이 됩니다 — 연계 팀 직무상세내용 리서치 후 작성',
        guide: {
          description: '진짜 협업 역량은 "내가 무엇을 잘한다"가 아니라 "상대방이 무엇을 필요로 하는지 알고 그것을 준다"에서 나옵니다. 연계 팀 직무상세내용을 읽으면 "그 팀이 이 직무에 원하는 것"이 보입니다.',
          diagnosis: '즉석자가진단: "품질팀(또는 연계팀)이 이 직무에 가장 원하는 것이 무엇인가요?"에 리서치 기반으로 답할 수 있는가?',
          helpQuestions: [
            '연계 팀 직무상세내용의 "주요업무" 항목을 읽어보세요',
            '그 팀이 업무를 잘 하려면 이 직무에서 무엇을 받아야 하나요?',
            '"우리 팀이 잘 되려면 당신 팀에서 ○○을 해줘야 한다"는 것은?'
          ],
          ifDifficult: '연계 팀 직무상세내용을 찾아서 "이 팀은 어떤 결과물을 만들어내는 팀인가?"를 먼저 파악하세요.',
          ifStillDifficult: '연계 팀 현직자 인터뷰를 하나 찾아보세요. "다른 팀과 협업할 때 가장 중요한 것"에 대한 답이 있을 수 있습니다.'
        },
        placeholder: '예: [품질팀이 이 직무에 원하는 것]\n① 정확하고 빠른 불량 원인 분류 데이터\n② 공정 개선 후 효과 수치 (불량률 변화)\n③ 신제품 MP 전 공정 FMEA 결과 공유\n[내가 준비할 것] 내 분석 양식을 품질팀 보고 형식에 맞추고, 월간 공유 루틴을 만들겠습니다',
        rows: 4, relatedWorkbooks: ['job_analysis', 'experience', 'motivation', 'jobcompetency', 'personality', 'goalachievement']
      }
    ],
    2: [
      {
        id: 'q2_2_1',
        label: 'Q2 심화-1. 보유 역량의 "실제 수준"을 STAR 구조로 하나씩 증명해보세요.',
        hint: '언제, 어디서, 무엇을 했고, 어떤 결과 — 수치가 있다면 반드시 포함',
        guide: {
          description: '역량이 있다고 말하는 것과 증명하는 것은 다릅니다. 각 역량마다 "어떤 상황에서, 어떻게 사용했고, 어떤 결과를 냈는가"를 써야 면접에서도 사용할 수 있는 답변이 됩니다.',
          diagnosis: '즉석자가진단: "그 역량을 입사 첫날 바로 사용하면 어떤 결과가 나올 것 같나요?"에 솔직하게 답할 수 있는가?',
          helpQuestions: [
            '가장 자신 있는 역량 하나를 골라 STAR로 써보세요',
            '그 결과에 숫자가 있나요?',
            '"보조 가능 / 독립 가능 / 지도 가능" 중 어느 수준인가요?'
          ],
          ifDifficult: '가장 자신 있는 것 하나만 STAR로 쓰고, 나머지는 수준(기초/중급)만 명시하세요.',
          ifStillDifficult: '아직 증명할 경험이 없다면 솔직하게 "이론 수준"이라고 쓰는 것이 더 낫습니다.'
        },
        placeholder: '예: [SPC 역량] 수준: 이론 중급 / S: 품질경영 수업 팀 프로젝트에서 데이터 분석 담당 / T: 불량 데이터로 관리도 작성 과제 / A: Excel로 X-bar 관리도 작성, 이상 포인트 3개 식별 / R: 교수님 평가 "실무 적용 가능 수준의 분석" / 현재 수준: 교과서 데이터 → 실무 데이터 적용은 추가 연습 필요',
        rows: 5, relatedWorkbooks: ['experience', 'interview_new', 'motivation', 'jobcompetency', 'personality', 'goalachievement']
      },
      {
        id: 'q2_2_2',
        label: 'Q2 심화-2. 부족한 역량을 "단기에 채울 수 있는 것"과 "시간이 걸리는 것"으로 분류하세요.',
        hint: '입사 전에 채울 것 vs 입사 후 OJT로 채울 것을 구분하면 계획이 현실적이 됩니다',
        guide: {
          description: '모든 역량을 입사 전에 채울 수 없습니다. 짧은 시간에 채울 수 있는 것과 실무 경험이 필요한 것을 구분하면 Q3 계획이 현실적으로 됩니다.',
          diagnosis: '즉석자가진단: "입사 전까지 확실히 준비할 수 있는 역량은 몇 가지인가요?"에 즉답 가능한가?',
          helpQuestions: [
            '지식·개념 수준: 혼자 공부로 단기간에 가능',
            '경험·실습 필요: 실무나 OJT를 통해서만 가능',
            '자격증·인증: 시험 준비 기간이 필요'
          ],
          ifDifficult: '각 역량 옆에 "공부로 가능 / OJT 필요 / 자격 필요" 중 하나를 표시해보세요.',
          ifStillDifficult: '"이 역량을 유튜브와 교재로 익힐 수 있나요, 아니면 현장에서만 배울 수 있나요?"로 구분하세요.'
        },
        placeholder: '예:\n[입사 전 채울 수 있는 것 — 공부로 가능]\nFMEA 개념·양식 작성 → 교재 + 유튜브 강의 (2개월)\nSPC 기본 해석 → 공개 데이터셋 실습 (1개월)\n\n[입사 후 OJT로 채울 것 — 실무 경험 필요]\n설비 트러블슈팅 → 현장 실측 경험 필수\n공정 개선 실전 → 실제 생산 데이터 분석 경험 필요\n\n[자격증] 생산관리기사 → 입사 1~2년차 목표',
        rows: 5, relatedWorkbooks: ['job_analysis', 'experience', 'motivation', 'jobcompetency', 'personality', 'goalachievement']
      },
      {
        id: 'q2_2_3',
        label: 'Q2 심화-3. 현재 나의 준비 상태를 솔직하게 평가해보세요. 갖춘 것과 부족한 것은?',
        hint: '자만도, 과소평가도 아닌 객관적 평가 — 부족한 부분을 인정하는 것이 오히려 진정성을 높입니다',
        guide: {
          description: '솔직한 자기 평가는 입사후포부에서 진정성의 증거입니다. 모든 역량을 다 갖췄다고 쓰는 것보다, 갖춘 것과 부족한 것을 명확히 구분하고 부족한 부분의 보완 계획을 함께 제시하는 것이 더 설득력 있습니다.',
          diagnosis: '즉석자가진단: "부족한 역량을 어떻게 채울 건가요?"라고 물으면 구체적 계획을 즉답할 수 있는가?',
          helpQuestions: [
            '증거가 있는 역량만 "갖췄다"고 쓰세요 (프로젝트, 자격증, 실습 경험 등)',
            '부족한 역량은 구체적으로 어떻게 보완할 계획인가요?',
            '이미 보완을 시작한 것이 있나요?'
          ],
          ifDifficult: '자만하지도, 과소평가하지도 말고 객관적으로 평가하세요.',
          ifStillDifficult: '"열심히 배우겠습니다"는 보완 계획이 아닙니다. 구체적인 방법과 기간이 있어야 합니다.'
        },
        placeholder: '예: [준비 상태 평가]\n갖춘 것: SPC 기초, FMEA 개념 이해, 도면 해독 기초, 데이터 분석 Excel 활용\n기초 수준: Python 데이터 분석 (기초 문법은 알지만 실무 적용은 부족)\n부족한 것: 실제 설비 조작 경험, FMEA 실제 작성 경험\n\n[보완 계획]\nFMEA: 입사 전 2개월 교재 완독 + 가상 공정 3회 작성 실습\n설비: 입사 후 OJT에서 적극 참여하고 선배 동행 요청',
        rows: 5, relatedWorkbooks: ['experience', 'motivation', 'jobcompetency', 'personality', 'goalachievement']
      }
    ],
    3: [
      {
        id: 'q2_3_1',
        label: 'Q3 심화-1. 부족한 역량 하나를 골라 "역량명/현재수준/준비방법/완료시기/확인기준" 5칸을 채워보세요.',
        hint: '가장 중요한 역량 하나로 연습하면 나머지도 같은 방식으로 쓸 수 있습니다',
        guide: {
          description: 'Q3의 핵심 훈련입니다. 이 다섯 칸을 채울 수 있으면 면접에서 "어떻게 준비했나요?"에 막히지 않습니다.',
          diagnosis: '즉석자가진단: "그 방법으로 준비하면 ○월에는 어떤 수준이 되나요?"에 즉답 가능한가?',
          helpQuestions: [
            '가장 입사 후 빨리 필요할 것 같은 역량을 고르세요',
            '현재 수준을 솔직하게 쓰세요 (미경험/이론/기초/중급)',
            '완료 시기는 입사 전? 3개월? 6개월?'
          ],
          ifDifficult: '"이 역량 없이 첫 주 업무를 하면 어떻게 될까?"를 상상하고, 가장 곤란한 것부터 써보세요.',
          ifStillDifficult: '준비 방법이 없다면 지금 당장 검색해서 "어떻게 배울 수 있는지"를 찾아보세요.'
        },
        placeholder: '예: [역량명] FMEA 작성\n[현재 수준] 개념 인지 / 실제 작성 경험 없음\n[준비 방법] ①FMEA 교재 1권 완독 ②공정 가상 시나리오 3개에 직접 양식 작성 ③유튜브 FMEA 실무 강의 시청\n[완료 시기] 입사 전 2개월\n[확인 기준] 교재에 없는 새로운 공정 시나리오를 받았을 때 혼자 FMEA 양식 작성 완료 가능',
        rows: 5, relatedWorkbooks: ['interview_new', 'interview_career', 'motivation', 'jobcompetency', 'personality', 'goalachievement']
      },
      {
        id: 'q2_3_2',
        label: 'Q3 심화-2. 지금까지 한 활동을 모두 나열하고, 각각 "왜 했는지"를 한 줄씩 써보세요.',
        hint: '"그냥 했다"거나 "스펙 때문에"는 답이 안 됩니다 — 이 직무와 어떻게 연결되는지가 핵심',
        guide: {
          description: '활동마다 진짜 이유를 찾는 과정이 핵심입니다. 목적이 없는 활동 나열은 스펙 나열과 같습니다. "~하기 위해 ~을 했다" 구조가 되어야 합니다.',
          diagnosis: '즉석자가진단: 각 활동의 이유가 이 직무에서 필요한 역량과 연결되나요?',
          helpQuestions: [
            '활동을 시작하게 된 계기가 무엇이었나요? (강요였나요, 자발적이었나요?)',
            '그 활동을 하면서 기대한 것은 무엇이었나요?',
            '이유가 없는 활동은 과감하게 입사후포부에서 빼세요'
          ],
          ifDifficult: '"~하기 위해 ~을 했다" 문장 구조로 각 활동을 다시 써보세요.',
          ifStillDifficult: '이유 없는 활동은 빼도 됩니다. 이유 있는 활동 2~3개가 훨씬 강합니다.'
        },
        placeholder: '예: ① 생산관리 수업 A+ → 공정의 전체 흐름을 이해하고 싶어서\n② 스마트팩토리 견학 2회 → 실제 현장이 어떻게 돌아가는지 보고 싶어서\n③ SPC 강의 수강 → FMEA와 함께 공정 품질 분석의 핵심이라고 판단해서\n④ 캡스톤 도면 작업 → 도면 해독이 생산기술의 기본이라고 느껴서\n\n이유 없는 활동 (삭제): 토익 — 직무와 직접 연관 없음',
        rows: 5, relatedWorkbooks: ['job_analysis', 'experience', 'motivation', 'jobcompetency', 'personality', 'goalachievement']
      },
      {
        id: 'q2_3_3',
        label: 'Q3 심화-3. 1년 로드맵을 "할 수 있게 되는 것" 단위로 다시 써보세요.',
        hint: '"○○을 공부하겠다"가 아닌 "○○을 할 수 있게 된다" — 결과 중심으로',
        guide: {
          description: '"공부하겠다"와 "할 수 있게 된다"는 다릅니다. 면접관이 보고 싶은 것은 "어떤 업무를 수행하는 사람이 될 것인가"입니다.',
          diagnosis: '즉석자가진단: 6개월 후 나의 수행 가능 업무 목록을 즉석에서 나열할 수 있는가?',
          helpQuestions: [
            '3개월 후: "할 수 있게 될 것"은?',
            '6개월 후: "독립적으로 수행할 수 있는 것"은?',
            '1년 후: "팀에 기여할 수 있는 것"은?'
          ],
          ifDifficult: 'Q3-3의 답변을 다시 보고, 각 항목을 "○○을 할 수 있다"는 문장으로 바꿔 쓰세요.',
          ifStillDifficult: '"입사 후 1년 경과 후 팀장이 나에게 맡길 수 있는 일은 무엇인가?"를 상상해보세요.'
        },
        placeholder: '예:\n[3개월 후 할 수 있는 것]\n공정 표준서 읽고 이해하기 / FMEA 양식 작성 (선배 검토 하에) / 일상 설비 점검표 독립 수행\n[6개월 후 할 수 있는 것]\n불량 데이터 분석 보고서 1차 작성 / 품질팀 미팅 내용 요약·공유\n[1년 후 할 수 있는 것]\n소규모 공정 개선 과제 독립 제안 / 담당 공정 불량률 추이 보고 독립 수행 / 파트 내 분석 방법론 공유',
        rows: 5, relatedWorkbooks: ['interview_new', 'interview_career', 'motivation', 'jobcompetency', 'personality', 'goalachievement']
      },
      {
        id: 'q2_3_4',
        label: 'Q3 심화-4. 직무상세내용 키워드 하나를 골라 "개인→파트→팀→회사" 단위로 확장하는 시나리오를 써보세요.',
        hint: '같은 키워드가 범위에 따라 어떻게 달라지는지 — 직무 이해의 깊이를 보여주는 연습',
        guide: {
          description: '이 연습이 잘 되면 "작은 것에서 큰 것으로" 확장하는 서사가 자연스럽게 나옵니다. 면접에서 "10년 후에는?"이라는 질문에도 자신 있게 답할 수 있습니다.',
          diagnosis: '즉석자가진단: 이 키워드로 "개인 수준의 기여"와 "회사 수준의 기여"를 구분해서 설명할 수 있는가?',
          helpQuestions: [
            '직무상세내용에서 가장 핵심적인 키워드 하나를 고르세요',
            '그 키워드를 나 혼자 적용하면? → 파트에 적용하면? → 회사 전체에 영향을 주면?',
            '"이 역량이 회사 전체에 퍼지면 어떤 가치가 생기나요?"'
          ],
          ifDifficult: '"공정 개선" 하나만 골라서 개인·파트·팀·회사 칸을 채워보세요.',
          ifStillDifficult: '각 단계에서 "이 수준의 기여를 하려면 어떤 역량이 추가로 필요한가?"를 함께 쓰세요.'
        },
        placeholder: '예: 키워드 — "데이터 기반 공정 개선"\n[개인] 담당 공정 1개 불량률 데이터 분석 → 원인 제거 → 5% 감소\n[파트] 분석 방법론을 파트 내 표준 양식으로 공유 → 다른 팀원도 적용\n[팀] 팀 전체 라인 불량 데이터 통합 분석 → 라인 밸런싱 개선 제안\n[회사] 공장 전체 스마트팩토리 데이터 수집 체계 구축에 기여',
        rows: 4, relatedWorkbooks: ['job_analysis', 'interview_new', 'motivation', 'jobcompetency', 'personality', 'goalachievement']
      }
    ],
    4: [
      {
        id: 'q2_4_1',
        label: 'Q4 심화-1. 이 직무 5년차 현직자 인터뷰나 시니어 직무상세내용을 찾아 — "지금의 나"와 "다음 단계 나" 사이의 갭을 써보세요.',
        hint: '갭이 명확해야 준비 계획이 구체적이 됩니다 — 리서치 결과를 그대로 쓰세요',
        guide: {
          description: '다음 단계를 상상으로 쓰면 공허합니다. 실제로 그 단계에 있는 사람의 이야기나 시니어 직무상세내용을 기반으로 "지금과 그때의 차이"를 구체적으로 파악해야 준비 계획이 나옵니다.',
          diagnosis: '즉석자가진단: "지금의 나"와 "4년차 나" 사이에 어떤 구체적인 차이가 있는지 설명할 수 있는가?',
          helpQuestions: [
            '시니어 직무상세내용 우대사항에 "신입 직무상세내용에는 없는 것"이 있나요?',
            '현직자 인터뷰에서 "3년이 지나자 달라진 것"이 있었나요?',
            '그 갭을 채우려면 어떤 경험이 필요한가?'
          ],
          ifDifficult: '시니어 직무상세내용과 신입 직무상세내용을 나란히 놓고 "추가된 항목"을 표시해보세요.',
          ifStillDifficult: '현직자 인터뷰에서 "1년차와 4년차의 가장 큰 차이"를 검색해보세요.'
        },
        placeholder: '예: [리서치 기반 갭 분석]\n시니어 직무상세내용에 있고 신입 직무상세내용에 없는 것:\n① 공정 라인 전체 관리 및 최적화 주도\n② 후임 지도 및 작업 표준서 수립 책임\n③ 원가 절감 과제 독립 기획·실행\n④ 신제품 MP 총괄 참여\n\n갭을 채우기 위해 필요한 경험:\n① 라인 전체 데이터를 보는 기회 자원\n② 원가 과제 보조 참여 → 독립 기획 순서로\n③ MP 참여 기회가 생기면 적극 지원',
        rows: 5, relatedWorkbooks: ['job_analysis', 'experience', 'motivation', 'jobcompetency', 'personality', 'goalachievement']
      },
      {
        id: 'q2_4_2',
        label: 'Q4 심화-2. Q1~Q3에서 나온 역량 준비와 성장 경로가 어떻게 하나의 흐름으로 연결되는지 써보세요.',
        hint: '"직무 이해 → 역량 갭 → 확보 계획 → 범위 확장 → 다음 단계 → 큰 그림"이 하나의 인과 흐름인지 점검',
        guide: {
          description: 'Q1~Q3이 따로 놀면 입사후포부가 아닌 목표 나열이 됩니다. 이 흐름이 자연스럽게 연결될 때, 면접관이 "이 사람은 정말 이 직무를 깊이 이해하고 있구나"라고 느낍니다.',
          diagnosis: '즉석자가진단: "Q3에서 준비한 것이 Q4 다음 단계로 어떻게 이어지나요?"에 막힘없이 설명할 수 있는가?',
          helpQuestions: [
            'Q3에서 준비한 역량이 Q4 다음 단계에서 어디에 쓰이나요?',
            '끊기는 지점이 있다면 어떤 추가 준비가 필요한가?',
            '전체 흐름을 한 문단으로 요약할 수 있나요?'
          ],
          ifDifficult: 'Q1, Q2, Q3, Q4 답변을 나란히 놓고 "화살표로 연결하면 자연스러운가?"를 확인하세요.',
          ifStillDifficult: '각 단계 끝에 "이것을 완성하면 → 다음에 이것이 가능해진다"는 한 문장을 추가해보세요.'
        },
        placeholder: '예: [흐름 점검]\nQ1: 생산기술의 본질은 공정 데이터로 불량률·원가를 구조적으로 개선하는 것\n↓\nQ2: 현재 SPC·FMEA 이론 수준 + 설비 경험 부재\n↓\nQ3: 입사 전 FMEA 실습 + 입사 후 3개월 SPC 실무, 파트 분석 방법론 공유로 범위 확장\n↓\nQ4: 라인 전체 관리 경험 + PLC 기초 → 스마트팩토리 전환 과제 기여\n\n[끊기는 지점] Q3→Q4 사이: 라인 전체를 보는 경험이 추가로 필요 → 2년차 TF 참여 자원',
        rows: 5, relatedWorkbooks: ['experience', 'interview_new', 'motivation', 'jobcompetency', 'personality', 'goalachievement']
      }
    ]
  };

  const round3Questions = [
    {
      id: 'connect_q1',
      label: '연결 질문 1: 직무 핵심 이해 + 나의 현재 — 오프닝 단락',
      hint: 'Q1에서 파악한 "이 직무의 핵심"과 Q2에서 진단한 "나의 현재 위치"를 하나의 단락으로 연결하세요. "이 직무의 핵심은 ○○이고, 나는 ○○을 갖췄지만 ○○이 부족하다"는 구조가 되어야 합니다. 직무상세내용 키워드를 직접 인용하고, 단순한 자기소개가 아닌 이 직무를 이해한 사람으로서의 시작이어야 합니다.',
      placeholder: '예: 생산기술의 본질은 공정 데이터를 분석하여 불량률과 원가를 구조적으로 개선하는 것이라 이해합니다. 저는 현재 SPC 기초와 FMEA 개념을 갖추고 있으나, 실제 현장 데이터와 설비를 다루는 경험이 부족합니다. 이 갭을 정확히 인식한 상태에서, 구체적인 계획으로 준비해나가겠습니다.',
      rows: 5,
      referenceQuestions: ['q1_1_1', 'q1_1_2', 'q1_2_1', 'q1_2_2']
    },
    {
      id: 'connect_q2',
      label: '연결 질문 2: 역량 갭 → 확보 계획 → 범위 확장 — 준비+단기 기여 단락',
      hint: '"○○ 역량이 부족하기 때문에 ○○을 ○○ 방법으로 ○개월 안에 준비하겠다"는 구조가 핵심입니다. 직무상세내용 키워드를 연결해서 쓰고, 역량이 갖춰지면 어떻게 파트·팀으로 범위가 확장되는지까지 이어야 합니다.',
      placeholder: '예: 부족한 FMEA 역량을 보완하기 위해 입사 전 2개월간 교재 완독과 가상 공정 실습을 진행하겠습니다. SPC 실무 해석은 입사 후 3개월 내에 관리도 작성을 반복하여 이상 원인 분류를 혼자 판단할 수 있는 수준까지 끌어올리겠습니다. 이 역량이 갖춰지면, 담당 공정의 불량 원인 분석 결과를 파트 표준 양식으로 정리하여 공유함으로써 파트 전체의 데이터 관리 수준 향상에 기여하겠습니다.',
      rows: 5,
      referenceQuestions: ['q1_2_2', 'q1_3_1', 'q1_3_2', 'q1_3_3']
    },
    {
      id: 'connect_q3',
      label: '연결 질문 3: 단기 성과 → 중기 다음 단계 — 성장 단락',
      hint: '단기에서 쌓은 경험이 어떤 다음 역할로 이어지고, 그 단계에 진입하기 위해 무엇을 추가로 준비할지 연결하세요. 이 직무를 깊이 아는 사람만 쓸 수 있는 내용이어야 합니다.',
      placeholder: '예: 1~2년차에 담당 공정 개선 과제를 반복 수행하며 데이터 분석 역량이 쌓이면, 라인 전체 밸런싱 과제에 참여할 수 있는 수준이 됩니다. 이 단계로 나아가기 위해서는 개별 공정을 넘어 라인 전체를 보는 시야와 PLC 기초를 더해 설비-공정 연계 분석이 가능한 역량이 필요합니다. 이를 위해 2년차부터 라인 개선 TF 참여를 자원하고, 외부 PLC 교육을 이수할 계획입니다.',
      rows: 5,
      referenceQuestions: ['q1_3_2', 'q1_3_3', 'q1_q4_1']
    },
    {
      id: 'connect_q4',
      label: '연결 질문 4: 개인 성장 → 조직 기여 큰 그림 — 클로징 단락',
      hint: '나의 성장 경로가 단순히 개인의 발전이 아니라 이 회사의 성장 방향과 어떻게 연결되는지를 보여주세요. 회사의 직무분석 없이는 쓸 수 없는 내용이어야 합니다. "열심히 하겠습니다"가 아닌 역량+성장+기여의 자연스러운 결론이어야 합니다.',
      placeholder: '예: 단기·중기에 쌓아온 공정 데이터 분석과 라인 관리 역량은 궁극적으로 귀사의 스마트팩토리 전환이라는 큰 방향과 연결됩니다. 디지털화된 공정 데이터를 분석하고 개선하는 엔지니어로 성장하는 것이 저 개인의 목표이자, 귀사의 생산 경쟁력을 높이는 과정에 실질적으로 기여하는 경로라 생각합니다. 이 성장 경로가 귀사에서 가능하기에, 귀사를 선택했습니다.',
      rows: 5,
      referenceQuestions: ['q1_q4_1', 'q1_q4_2']
    }
  ];

  // ── 핸들러 ─────────────────────────────────────────────────
  const handleAnswerChange = (qid, val) => setAnswers(p => ({ ...p, [qid]: val }));
  const handleBasicInfoChange = (f, v) => setBasicInfo(p => ({ ...p, [f]: v }));
  const toggleGuide = (qid) => setShowGuide(p => ({ ...p, [qid]: !p[qid] }));
  const toggleStepSelection = (sid) => setSelectedSteps(p => p.includes(sid) ? p.filter(i => i !== sid) : [...p, sid]);

  const goToNextStep = () => {
    if (currentPhase === 'round1') { if (currentStep < round1Steps.length - 1) setCurrentStep(s => s + 1); else setCurrentPhase('evaluation'); }
    else if (currentPhase === 'evaluation') { setSelectedSteps(p => [...p].sort((a, b) => a - b)); setCurrentPhase('round2'); setCurrentStep(0); }
    else if (currentPhase === 'round2') { if (currentStep < selectedSteps.length - 1) setCurrentStep(s => s + 1); else { setCurrentPhase('round3'); setCurrentStep(0); } }
    else if (currentPhase === 'round3') { if (currentStep < round3Questions.length - 1) setCurrentStep(s => s + 1); else { setFinalText(generateAspirationLetter()); setCurrentPhase('completed'); } }
    window.scrollTo(0, 0);
  };

  const goToPrevStep = () => {
    if (currentPhase === 'completed') { setCurrentPhase('round3'); setCurrentStep(round3Questions.length - 1); }
    else if (currentStep > 0) setCurrentStep(s => s - 1);
    else if (currentPhase === 'round3') { setCurrentPhase('round2'); setCurrentStep(selectedSteps.length - 1); }
    else if (currentPhase === 'round2') setCurrentPhase('evaluation');
    else if (currentPhase === 'evaluation') { setCurrentPhase('round1'); setCurrentStep(round1Steps.length - 1); }
    else if (currentPhase === 'round1' && currentStep === 0) setShowIntro(true);
    window.scrollTo(0, 0);
  };

  const generateAspirationLetter = () => {
    const parts = [];

    // Q1: 직무 핵심 이해 + 나의 현재
    if (answers.connect_q1) parts.push(answers.connect_q1);
    else {
      if (answers.q1_1_1) parts.push(answers.q1_1_1);
      if (answers.q1_2_1) parts.push(answers.q1_2_1);
      if (answers.q1_2_2) parts.push(answers.q1_2_2);
    }

    // Q2: 역량 갭 → 확보 계획 → 범위 확장
    if (answers.connect_q2) parts.push('\n' + answers.connect_q2);
    else {
      if (answers.q1_3_1) parts.push('\n' + answers.q1_3_1);
      if (answers.q1_3_2) parts.push(answers.q1_3_2);
      if (answers.q1_3_3) parts.push(answers.q1_3_3);
    }

    // Q3: 단기 성과 → 중기 다음 단계
    if (answers.connect_q3) parts.push('\n' + answers.connect_q3);
    else {
      if (answers.q1_q4_1) parts.push('\n' + answers.q1_q4_1);
    }

    // Q4: 개인 성장 → 조직 기여 큰 그림
    if (answers.connect_q4) parts.push('\n' + answers.connect_q4);
    else {
      if (answers.q1_q4_2) parts.push('\n' + answers.q1_q4_2);
    }

    return parts.join('\n\n');
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

    window.__CE_DOWNLOAD = { fn: () => __ceDlRef.current?.(), key: 'careergoal' };

    return () => { if (window.__CE_DOWNLOAD?.key === 'careergoal') window.__CE_DOWNLOAD = null; };

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
      
      const children = [dateP(), titleP('입 사 후 포 부')];
      
      // 회사·직무
      if (basicInfo.company || basicInfo.position) {
        const sub = (basicInfo.company || '') + 
          (basicInfo.company && basicInfo.position ? ' · ' : '') +
          (basicInfo.position ? basicInfo.position + ' 지원' : '');
        children.push(subtitleP(sub));
      }
      
      // === 제출용 본문 ===
      if (finalText && finalText.trim()) {
        finalText.split('\n\n').filter(x => x.trim()).forEach(para => {
          children.push(bodyP(para));
        });
      } else {
        children.push(placeholderP('[입사후 포부 본문이 여기에 들어갑니다.]'));
      }
      
      // === 작성 노트 (페이지 분리) ===
      children.push(new Paragraph({
        children: [new TextRun({ text: '', size: 22 })],
        pageBreakBefore: true
      }));
      children.push(new Paragraph({
        children: [new TextRun({ text: '작성 노트 — 단계별 답변', bold: true, size: 28, font: '맑은 고딕', color: '0E2750' })],
        spacing: { before: 0, after: 100 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: '0E2750', space: 4 } }
      }));
      children.push(new Paragraph({
        children: [new TextRun({ text: '아래는 자소서 작성 과정에서 정리한 모든 답변입니다. 다음에 이어 작업하거나 다른 자소서에 활용할 때 참고하세요.', italic: true, size: 20, font: '맑은 고딕', color: '6E7A8F' })],
        spacing: { before: 0, after: 280 }
      }));
      
      // round1Steps 자동 펼침
      round1Steps.slice(1).forEach(step => {
        const hasAny = (step.questions || []).some(q => answers[q.id]);
        // 항목 있는 step만 표시 (질문 자체가 있으면 모두 표시)
        if (!step.questions || step.questions.length === 0) return;
        children.push(subH(step.title));
        step.questions.forEach(q => {
          children.push(labelP(q.label || q.id));
          const ans = answers[q.id];
          if (ans && ans.trim()) {
            children.push(labelBodyP(ans));
          } else {
            children.push(placeholderP('[작성 전]'));
          }
        });
      });
      
      // round3Questions (있으면)
      if (typeof round3Questions !== 'undefined' && Array.isArray(round3Questions) && round3Questions.length > 0) {
        children.push(subH('연결 문장'));
        round3Questions.forEach(q => {
          children.push(labelP(q.label || q.id));
          const ans = answers[q.id];
          if (ans && ans.trim()) {
            children.push(labelBodyP(ans));
          } else {
            children.push(placeholderP('[작성 전]'));
          }
        });
      }
      
            
      // ═══ CareerEngineer 자료 + 멘토링 안내 (docx 본문 끝) ═══
      children.push(sectionH('CareerEngineer 자료 — 다음 단계로'));
      children.push(new Paragraph({
        children: [new TextRun({ text: '이 워크북을 완성한 후 다음 단계로 나아가는 데 도움이 되는 자료들입니다.', italic: true, size: 20, font: '맑은 고딕', color: '6E7A8F' })],
        spacing: { before: 80, after: 160 }
      }));
      children.push(linkP('자소서 작성 전자책 시리즈 (5대 항목 전체)', 'https://www.latpeed.com/products/dfdMW'));
      children.push(linkP('자소서 멘토링 — 실제 글을 함께 다듬는 1:1 멘토링', 'https://www.latpeed.com/products/fKnUV'));
      children.push(linkP('1:1 취업 컨설팅 — 방향 설정부터 함께', 'https://www.latpeed.com/products/S92cP'));
      children.push(linkP('CareerEngineer 카카오톡 상담', 'https://open.kakao.com/me/careerengineer'));
      children.push(new Paragraph({
        children: [new TextRun({ text: '', size: 22, font: '맑은 고딕' })],
        spacing: { before: 240, after: 60 }
      }));
      children.push(new Paragraph({
        children: [new TextRun({ text: 'CareerEngineer 전자책 / 멘토링 전체 안내', bold: true, size: 22, font: '맑은 고딕', color: '0E2750' })],
        spacing: { before: 160, after: 80 },
        shading: { fill: 'F2F1EC' },
        border: { left: { style: BorderStyle.SINGLE, size: 24, color: '1B3A6B', space: 8 } },
        indent: { left: 240 }
      }));
      children.push(new Paragraph({
        children: [new TextRun({ text: 'CareerEngineer는 취업·이직 준비의 모든 단계를 지원하는 전자책과 멘토링을 운영합니다. 자소서 작성, 경력기술서, 면접 답변집 등 단계별 가이드와 1:1 멘토링이 있으며, 모든 자료는 공학박사 멘토의 실제 합격 사례 기반으로 설계되어 있습니다.', size: 20, font: '맑은 고딕', color: '0E2750' })],
        spacing: { before: 0, after: 120, line: 360 },
        indent: { left: 240 }
      }));
      children.push(linkP('전체 상품 보기 (클릭)', 'https://www.latpeed.com/stores/eqxhZ', { before: 80, after: 160, indent: 240 }));

      const doc = new Document({
        creator: '',
        title: '입사후 포부',
        sections: [{
          properties: { page: { margin: { top: 1400, right: 1133, bottom: 1400, left: 1133 } } },
          children: children
        }]
      });
      
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `입사후 포부_${(basicInfo.company || '미입력').replace(/[^a-zA-Z0-9가-힣\s]/g, '_')}_${today}.docx`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setDownloadSuccess(true); setTimeout(() => setDownloadSuccess(false), 5000);
    } catch (err) {
      console.error('docx 생성 실패:', err);
      alert('워드 문서 생성에 실패했습니다.\n' + (err.message || ''));
    }
  };

  __ceDlRef.current = downloadFinalText; // [CE-DL] ref 갱신

  // 임시저장 — 현재까지 작성된 답변들과 최종 통합 본문을 함께 저장
  const savePartial = () => {
    // 메인 다운로드와 동일한 docx 생성 (모든 답변 포함)
    downloadFinalText();
  };

  const getRawAnswersText = () => {
    return `원본 답변 모음\n\n[기본 정보]\n산업: ${basicInfo.industry || '-'}\n직무: ${basicInfo.position || '-'}\n회사: ${basicInfo.company || '-'}\n\n[Q1: 직무 핵심 이해]\nQ1-1 핵심 업무·본질: ${answers.q1_1_1 || '-'}\nQ1-2 성과자 역량: ${answers.q1_1_2 || '-'}\nQ1-3 연계 팀·역할: ${answers.q1_1_3 || '-'}\n\n[Q2: 현재 역량 진단]\nQ2-1 보유 역량: ${answers.q1_2_1 || '-'}\nQ2-2 부족한 역량: ${answers.q1_2_2 || '-'}\nQ2-3 이미 시작한 노력: ${answers.q1_2_3 || '-'}\n\n[Q3: 역량 확보 및 범위 확장 계획]\nQ3-1 역량별 확보 방법+시기: ${answers.q1_3_1 || '-'}\nQ3-2 업무 범위 확장: ${answers.q1_3_2 || '-'}\nQ3-3 측정 기준+1년 후 수준: ${answers.q1_3_3 || '-'}\n\n[Q4: 다음 단계와 큰 그림]\nQ4-1 다음 역할+준비 경로: ${answers.q1_q4_1 || '-'}\nQ4-2 조직 기여+회사 방향 연결: ${answers.q1_q4_2 || '-'}\n\n[3라운드 연결 질문]\n연결Q1 (직무핵심+현재): ${answers.connect_q1 || '-'}\n연결Q2 (역량갭→확보→확장): ${answers.connect_q2 || '-'}\n연결Q3 (단기→중기다음단계): ${answers.connect_q3 || '-'}\n연결Q4 (개인성장→조직기여): ${answers.connect_q4 || '-'}`;
  };

  const canGoNext = () => { if (currentPhase === 'evaluation') return selectedSteps.length >= 1; return true; };
  const progress = currentPhase === 'round1' ? ((currentStep + 1) / round1Steps.length) * 33 : currentPhase === 'round2' ? 33 + ((currentStep + 1) / Math.max(selectedSteps.length, 1)) * 33 : 66 + ((currentStep + 1) / round3Questions.length) * 34;


  // ══════════ 스타일 객체 (공식 브랜드 토큰 기반) ══════════
  const S = {
    page: { minHeight: '100vh', background: COLORS.bgAlt, padding: SPACING.md, fontFamily: FONT.family, color: COLORS.accent },
    container: { maxWidth: 1350, margin: '0 auto' },
    card: { background: COLORS.bg, borderRadius: RADIUS.md, padding: SPACING.lg, border: `1px solid ${COLORS.border}`, marginBottom: SPACING.md },
    // 메인 화면 상단 헤더 (PART 7-6: 상단 고정)
    headerSticky: { background: COLORS.bgAlt, borderRadius: RADIUS.md, padding: SPACING.md, border: `1px solid ${COLORS.border}`, marginBottom: SPACING.md, position: 'sticky', top: SPACING.md, zIndex: 10, boxShadow: '0 2px 8px rgba(14, 39, 80, 0.12)' },
    cardLarge: { background: COLORS.bg, borderRadius: RADIUS.md, padding: SPACING.xl, border: `1px solid ${COLORS.border}`, marginBottom: SPACING.md },
    h1: { fontSize: FONT.size.h1, fontWeight: FONT.weight.bold, color: COLORS.accent, margin: 0, lineHeight: FONT.lineHeight.tight },
    h1Center: { fontSize: FONT.size.h1, fontWeight: FONT.weight.bold, color: COLORS.accent, margin: `0 0 ${SPACING.md}px`, lineHeight: FONT.lineHeight.tight, textAlign: 'center' },
    h2: { fontSize: FONT.size.h2, fontWeight: FONT.weight.bold, color: COLORS.accent, margin: 0, lineHeight: FONT.lineHeight.tight },
    h3: { fontSize: FONT.size.lg, fontWeight: FONT.weight.semibold, color: COLORS.accent, margin: 0 },
    brandEyebrow: { fontSize: FONT.size.xs, letterSpacing: 4, color: COLORS.sub, marginBottom: SPACING.base, textAlign: 'center', fontWeight: FONT.weight.medium },
    subtitle: { fontSize: FONT.size.base, color: COLORS.sub, lineHeight: FONT.lineHeight.base, margin: 0 },
    label: { fontSize: FONT.size.md, fontWeight: FONT.weight.semibold, color: COLORS.accent, display: 'block', marginBottom: SPACING.sm },
    hint: { fontSize: FONT.size.sm, color: COLORS.sub, marginTop: 0, marginBottom: SPACING.sm, lineHeight: FONT.lineHeight.base },
    input: { width: '100%', padding: '12px 16px', border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.base, fontSize: FONT.size.base, fontFamily: FONT.family, color: COLORS.accent, outline: 'none', boxSizing: 'border-box', background: COLORS.bg, transition: 'border-color 150ms ease, box-shadow 150ms ease' },
    textarea: { width: '100%', padding: '12px 16px', border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.base, fontSize: FONT.size.base, fontFamily: FONT.family, color: COLORS.accent, outline: 'none', resize: 'none', boxSizing: 'border-box', lineHeight: 1.7, background: COLORS.bg, transition: 'border-color 150ms ease, box-shadow 150ms ease' },
    btnPrimary: { ...BUTTON.primary, width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: FONT.family },
    btnSecondary: { ...BUTTON.secondary, display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: FONT.family, fontSize: FONT.size.base, padding: '12px 24px' },
    // 저장 버튼 (헤더용 컴팩트 사이즈)
    btnSaveHeader: { background: COLORS.accent2, color: COLORS.white, border: 'none', borderRadius: RADIUS.base, padding: '0 14px', fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, cursor: 'pointer', fontFamily: FONT.family, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, whiteSpace: 'nowrap', transition: 'opacity 150ms ease', height: 36 },
    btnText: { ...BUTTON.text, display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: FONT.family, fontSize: FONT.size.sm },
    progressTrack: { width: '100%', background: COLORS.border, borderRadius: RADIUS.pill, height: 6, overflow: 'hidden' },
    progressBar: { background: COLORS.accent2, height: 6, borderRadius: RADIUS.pill, transition: 'width 500ms ease' },
    boxTip:     { ...BOX.tip,     padding: SPACING.md, borderRadius: RADIUS.base, marginBottom: SPACING.md },
    boxWarning: { ...BOX.warning, padding: SPACING.md, borderRadius: RADIUS.base, marginBottom: SPACING.md },
    boxSuccess: { ...BOX.success, padding: SPACING.md, borderRadius: RADIUS.base, marginBottom: SPACING.md },
    boxInfo:    { ...BOX.info,    padding: SPACING.md, borderRadius: RADIUS.base, marginBottom: SPACING.md },
    boxNeutral: { background: COLORS.bgAlt, padding: SPACING.md, borderRadius: RADIUS.base, border: `1px solid ${COLORS.border}` },
    accentLeft: (color) => ({ borderLeft: `3px solid ${color}`, background: COLORS.bg, padding: `${SPACING.base}px ${SPACING.md}px`, borderRadius: `0 ${RADIUS.base}px ${RADIUS.base}px 0` }),
    copyrightWrap: { background: COLORS.bg, borderRadius: RADIUS.md, padding: SPACING.md, border: `1px solid ${COLORS.border}`, marginTop: SPACING.lg },
    copyrightText: { fontSize: FONT.size.xs, color: COLORS.sub, textAlign: 'center', margin: 0, lineHeight: FONT.lineHeight.base },
    copyrightWarn: { fontSize: FONT.size.xs, color: COLORS.red, textAlign: 'center', marginTop: 8, fontWeight: FONT.weight.medium, lineHeight: FONT.lineHeight.base },
  };
  const labelStyle = (color) => ({ fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color, margin: 0, letterSpacing: 0.5, textTransform: 'uppercase' });


  // ══════════ 사용 안내 팝업 (PART 7-8) ══════════
  const [showHelp, setShowHelp] = useState(true);
  const [showStepNav, setShowStepNav] = useState(false);

  // [CE-HOME] WorkbookShell '처음으로' 버튼에서 호출

  const __ceHomeRef = useRef(null);

  useEffect(() => {

    if (typeof window === 'undefined') return;

    window.__CE_HOME = { fn: () => __ceHomeRef.current?.(), key: 'careergoal' };

    return () => { if (window.__CE_HOME?.key === 'careergoal') window.__CE_HOME = null; };

  }, []);

  const goHome = () => {
    setShowIntro(true);
    setCurrentStep(0);
    setCurrentPhase('round1');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  __ceHomeRef.current = goHome; // [CE-HOME] ref 갱신
  const FirstVisitModal = ({ open, onClose, title, steps }) => {
    if (!open) return null;
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(14, 39, 80, 0.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={onClose}>
        <div style={{ background: '#fff', borderRadius: 14, padding: 32, maxWidth: 480, width: '100%', boxShadow: '0 20px 50px rgba(14, 39, 80,0.2)', fontFamily: '"Pretendard", -apple-system, BlinkMacSystemFont, system-ui, sans-serif' }} onClick={e => e.stopPropagation()}>
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

  // 인라인 참고 워크북 (가이드 PART 7-15)
  const RelatedWorkbookInline = ReferenceInline; // master 기반 inline 참고 패널 (shared)

  // STEP 네비게이터 드롭다운 (가이드 PART 7-6: 헤더 STEP 클릭 시)
  const StepNavigatorDropdown = ({ open, onClose, currentKey, anchorRef }) => {
    if (!open) return null;
    
    // 7단계 구조 - 자소서 5대 항목만 하위 항목 펼침, 나머지는 단일 링크
    const stepGroups = [
      { step: '0', label: '취업준비 진단', key: 'career_roadmap' },
      { step: '1', label: '채용공고 및 직무 분석', key: 'job_analysis' },
      { step: '2', label: '경험 정리', key: 'experience' },
      { step: '3', inline: true, label: '', items: [
        { key: 'resume', label: '이력서 작성' },
        { key: 'career_description', label: '경력기술서 작성' },
        { directUrl: MENTORING_URLS.career_consulting, label: '이직 컨설팅' },
      ]},
      { step: '4', label: '', expandable: true, items: [
        { key: 'motivation', label: '지원동기 작성' },
        { key: 'jobcompetency', label: '직무역량 작성' },
        { key: 'personality', label: '성격 장단점 작성' },
        { key: 'goalachievement', label: '목표수립 및 달성 작성' },
        { key: 'careergoal', label: '입사후 포부 작성' },
        { mentoring: true, label: '자소서 멘토링', directUrl: MENTORING_URLS.cover_letter },
      ]},
      { step: '5', label: '', expandable: true, items: [
        { key: 'interview_answer_guide', label: '면접 유형별 답변 전략' },
        { key: 'self_introduction', label: '1분 자기소개 준비' },
        { key: 'interview_new', label: '신입 면접 준비' },
        { key: 'interview_career', label: '경력 면접 준비' },
        { mentoring: true, label: '면접 멘토링', directUrl: MENTORING_URLS.interview },
      ]},
    ];
    
    // 추가 서비스 (별도 섹션)
    const extraServices = [
      { label: 'CareerEngineer 전자책 / 멘토링', url: 'https://www.latpeed.com/stores/eqxhZ/collections/68459e30db90f1ebed56226f' },
      { label: 'CareerEngineer 1-Hour 1:1 취업컨설팅', url: MENTORING_URLS.consulting },
      { label: 'CareerEngineer 카카오톡 상담', url: 'https://open.kakao.com/me/careerengineer' },
    ];
    
    return (
      <>
        {/* 외부 클릭 감지용 오버레이 (투명) */}
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 50 }} />
        
        {/* 드롭다운 본체 */}
        <div style={{
          position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
          marginTop: 4, zIndex: 51,
          background: COLORS.white,
          borderRadius: RADIUS.base,
          border: `1px solid ${COLORS.border}`,
          boxShadow: '0 12px 32px rgba(14, 39, 80, 0.18)',
          minWidth: 1100, maxWidth: 1330,
          maxHeight: '70vh', overflowY: 'auto',
          padding: SPACING.sm,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {stepGroups.map((g, gi) => {
              if (g.expandable) {
                // 자소서 5대 항목 - 하위 항목 펼침
                const isCurrent = g.items.some(it => it.key === currentKey);
                return (
                  <div key={gi} style={{
                    position: 'relative',
                    padding: `10px ${SPACING.base}px`,
                    paddingLeft: g.label ? SPACING.base : 84,
                    borderRadius: 6,
                    border: `1px solid ${isCurrent ? COLORS.accent2 : COLORS.border}`,
                    background: isCurrent ? '#FBFAF6' : COLORS.white,
                  }}>
                    {!g.label && (
                      <span style={{
                        position: 'absolute', left: SPACING.base, top: '50%', transform: 'translateY(-50%)',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: 64, height: 24, borderRadius: 4,
                        background: isCurrent ? COLORS.accent : COLORS.bgAlt,
                        color: isCurrent ? COLORS.white : COLORS.sub,
                        fontSize: FONT.size.xs, fontWeight: FONT.weight.bold, fontFamily: FONT.family,
                      }}>STEP {g.step}</span>
                    )}
                    {g.label && (
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8, minHeight: 24 }}>
                        <span style={{
                          position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          width: 64, height: 24, borderRadius: 4,
                          background: isCurrent ? COLORS.accent : COLORS.bgAlt,
                          color: isCurrent ? COLORS.white : COLORS.sub,
                          fontSize: FONT.size.xs, fontWeight: FONT.weight.bold, fontFamily: FONT.family,
                        }}>STEP {g.step}</span>
                        <span style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color: COLORS.accent }}>{g.label}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', gap: 8, alignItems: 'center', justifyContent: 'center', columnGap: 8, rowGap: 6, overflowX: 'auto' }}>
                      {g.items.map((it, ii) => {
                        const isCurrentItem = it.key === currentKey;
                        const link = it.directUrl ? { url: it.directUrl } : WORKBOOK_LINKS[it.key];
                        if (!link) return null;
                        const isMentoring = it.mentoring === true;
                        const showSeparator = ii < g.items.length - 1 && (g.items[ii + 1].mentoring === isMentoring);
                        return (
                          <React.Fragment key={it.key || it.label}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
                              {isCurrentItem ? (
                                <span style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.bold, color: COLORS.accent }}>
                                  {it.label} <span style={{ fontSize: FONT.size.xs, color: COLORS.accent2, fontWeight: FONT.weight.semibold }}>(현재)</span>
                                </span>
                              ) : (
                                <a href={link.url} target="_blank" rel="noopener noreferrer"
                                  style={{ fontSize: FONT.size.sm, color: COLORS.accent2, textDecoration: 'underline', textUnderlineOffset: 2, fontWeight: isMentoring ? FONT.weight.semibold : FONT.weight.medium }}>
                                  {it.label}
                                </a>
                              )}
                              {showSeparator && <span style={{ color: COLORS.sub, fontSize: FONT.size.xs }}>/</span>}
                            </span>
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                );
              }
              
              if (g.inline) {
                // 인라인 다중 항목 (STEP 3 서류, STEP 5 면접) - 한 줄에 라벨 여러 개
                const isCurrent = g.items.some(it => it.key === currentKey);
                return (
                  <div key={gi} style={{
                    position: 'relative',
                    padding: `10px ${SPACING.base}px`,
                    borderRadius: 6,
                    border: `1px solid ${isCurrent ? COLORS.accent2 : COLORS.border}`,
                    background: isCurrent ? '#FBFAF6' : COLORS.white,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap',
                    minHeight: 44,
                  }}>
                    <span style={{
                      position: 'absolute', left: SPACING.base, top: '50%', transform: 'translateY(-50%)',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 64, height: 24, borderRadius: 4,
                      background: isCurrent ? COLORS.accent : COLORS.bgAlt,
                      color: isCurrent ? COLORS.white : COLORS.sub,
                      fontSize: FONT.size.xs, fontWeight: FONT.weight.bold, fontFamily: FONT.family,
                    }}>STEP {g.step}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color: COLORS.accent, flexWrap: 'wrap' }}>
                    {g.label && (<>
                      <span>{g.label}</span>
                      <span style={{ color: COLORS.sub, fontSize: FONT.size.sm }}>·</span>
                    </>)}
                    {g.items.map((it, ii) => {
                      const isCurrentItem = it.key === currentKey;
                      const link = it.directUrl ? { url: it.directUrl } : WORKBOOK_LINKS[it.key];
                      if (!link) return null;
                      return (
                        <span key={it.key} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                          {isCurrentItem ? (
                            <span style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.bold, color: COLORS.accent }}>
                              {it.label} <span style={{ fontSize: FONT.size.xs, color: COLORS.accent2, fontWeight: FONT.weight.semibold }}>(현재)</span>
                            </span>
                          ) : (
                            <a href={link.url} target="_blank" rel="noopener noreferrer"
                              style={{ fontSize: FONT.size.sm, color: COLORS.accent2, textDecoration: 'underline', textUnderlineOffset: 2, fontWeight: FONT.weight.medium }}>
                              {it.label}
                            </a>
                          )}
                          {ii < g.items.length - 1 && <span style={{ color: COLORS.sub, fontSize: FONT.size.xs }}>/</span>}
                        </span>
                      );
                    })}
                    </span>
                  </div>
                );
              }
              
              // 일반 단일 STEP - 라벨 자체가 하이퍼링크
              const isCurrent = g.key === currentKey;
              const link = g.directUrl ? { url: g.directUrl } : WORKBOOK_LINKS[g.key];
              if (!link) return null;
              
              if (isCurrent) {
                return (
                  <div key={gi} style={{
                    position: 'relative',
                    padding: `10px ${SPACING.base}px`,
                    borderRadius: 6,
                    border: `1px solid ${COLORS.accent2}`,
                    background: '#FBFAF6',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    minHeight: 44,
                  }}>
                    <span style={{
                      position: 'absolute', left: SPACING.base, top: '50%', transform: 'translateY(-50%)',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 64, height: 24, borderRadius: 4,
                      background: COLORS.accent, color: COLORS.white,
                      fontSize: FONT.size.xs, fontWeight: FONT.weight.bold, fontFamily: FONT.family,
                    }}>STEP {g.step}</span>
                    <span style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.bold, color: COLORS.accent }}>{g.label} <span style={{ fontSize: FONT.size.xs, color: COLORS.accent2, fontWeight: FONT.weight.semibold }}>(현재)</span></span>
                  </div>
                );
              }
              
              return (
                <a key={gi} href={link.url} target="_blank" rel="noopener noreferrer"
                  style={{
                    position: 'relative',
                    padding: `10px ${SPACING.base}px`,
                    borderRadius: 6,
                    border: `1px solid ${COLORS.border}`,
                    background: COLORS.white,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    textDecoration: 'none',
                    transition: 'all 150ms',
                    minHeight: 44,
                  }}
                  className="ce-step-nav-item">
                  <span style={{
                    position: 'absolute', left: SPACING.base, top: '50%', transform: 'translateY(-50%)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 64, height: 24, borderRadius: 4,
                    background: COLORS.bgAlt, color: COLORS.sub,
                    fontSize: FONT.size.xs, fontWeight: FONT.weight.bold, fontFamily: FONT.family,
                  }}>STEP {g.step}</span>
                  <span style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.medium, color: COLORS.accent2, textDecoration: 'underline', textUnderlineOffset: 2 }}>{g.label}</span>
                </a>
              );
            })}
          </div>
          
          {/* 추가 서비스 섹션 */}
          <div style={{ marginTop: SPACING.md, paddingTop: SPACING.md, borderTop: `1px solid ${COLORS.border}` }}>
            <p style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.medium, color: COLORS.sub, padding: `0 ${SPACING.base}px`, margin: 0, marginBottom: SPACING.md, lineHeight: FONT.lineHeight.relaxed, textAlign: 'center' }}>개인적인 경험, 직무, 공백기 등에 대한 고민이 있다면<br/>1:1로 CareerEngineer와 함께 더 깊은 이야기를 나눌 수도 있습니다.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {extraServices.map((svc, si) => (
                <a key={si} href={svc.url} target="_blank" rel="noopener noreferrer"
                  style={{
                    padding: `10px ${SPACING.base}px`,
                    borderRadius: 6,
                    border: `1px solid ${COLORS.border}`,
                    background: COLORS.white,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    textDecoration: 'none',
                    fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold,
                    color: COLORS.accent,
                    transition: 'all 150ms',
                  }}
                  className="ce-step-nav-item">
                  {svc.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  };
  // ══════════ 하단 고정 저작권 + 문의 블록 (PART 7-8, 11) ══════════
  const StickyFooter = () => (
    <div style={{ position: 'sticky', bottom: 0, background: COLORS.bg, borderTop: `1px solid ${COLORS.border}`, padding: `${SPACING.sm}px ${SPACING.md}px`, marginTop: SPACING.lg, marginLeft: -SPACING.md, marginRight: -SPACING.md, marginBottom: -SPACING.md, zIndex: 5 }}>
      <div style={{ maxWidth: 1350, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: SPACING.sm, flexWrap: 'wrap' }}>
        <p style={{ fontSize: 16, color: COLORS.sub, margin: 0 }}>
          © 2026 CareerEngineer. All Rights Reserved.
        </p>
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
  //  - 심볼: 102×96px → C 락업
  //  - 락업: 389×80px → A 락업 (심볼+워드마크)
  // ══════════════════════════════════════════════════════════════
  const CE_SYMBOL_B64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGYAAABgCAYAAADvhgd/AAABCGlDQ1BJQ0MgUHJvZmlsZQAAeJxjYGA8wQAELAYMDLl5JUVB7k4KEZFRCuwPGBiBEAwSk4sLGHADoKpv1yBqL+viUYcLcKakFicD6Q9ArFIEtBxopAiQLZIOYWuA2EkQtg2IXV5SUAJkB4DYRSFBzkB2CpCtkY7ETkJiJxcUgdT3ANk2uTmlyQh3M/Ck5oUGA2kOIJZhKGYIYnBncAL5H6IkfxEDg8VXBgbmCQixpJkMDNtbGRgkbiHEVBYwMPC3MDBsO48QQ4RJQWJRIliIBYiZ0tIYGD4tZ2DgjWRgEL7AwMAVDQsIHG5TALvNnSEfCNMZchhSgSKeDHkMyQx6QJYRgwGDIYMZAKbWPz9HbOBQAAAdlklEQVR42u1dd5hU1fl+v3PunbYz21iaEMWgSxH9BcESS5aVXoSlzICgYmWt0SQaTWIyuzF2ozEUWYhIFZgFpEiTsgtIUbChqNgAhSDFhV22zNx7z/l+f8wsEkREWMom+z3PffYy3Htn5rzna+/3nTNAndRJndRJnZwuiUQikpmpbiTOEGFmCgYj8pB/i7pROQNAqT7/bOv2K5i5YbX21I3OaZJwOCwS4DQcPXnG6J4DbuI//W3Epzt277v4vxEco7ZoSm7uGMnM6S9OnnfjjDmrcpcveTf67qe7znd53VOYuSMR/RsAAeC6aXyKZNiwAhMAXnmt6O/tutym0aBLNKXNDew6r5udkdmFn/rnlO3MnBEOh41wnc85RaAUFJggYObra19qkzWw1HNOZ+VvdR17WgzmQKsg+5r1Uo0v6MWPPffSJ35/0n9NQHDGfgFmpmHDCswxubl2pLA4PHLkKzd+sa0k2eXzkUYUBixIR8D0esW+CodHjZ2Z+ae/jlzEzI2JSNd2n3PG+hgiAMi1Z81efd+/Jr765zfe+kR4UgJaQQuCAwGGYECxDbcvib4trdSFc1Z0jUatB5k5TEQVYWaRT6TrgKkhTCKRiAiFSC1f/eFDoyfMe3LB2g91IDUdii2hwQABRBqaFIAYtLbhTQ6IjZu3W8J89ze+lFdczHwvEYGZiYi4DpgTD4vNUChkvbfxy3v/OXrik5E5y21/+lmG0DEiJrBwA3BARMzCICgBEMEihjfd73r7401W1Cq9OyngjzHzI7m5YxxmdmobOHSGgWLk5+c76zZtyfnHiAmvvjpvqe31pxpgk0gDDIKWBFtZKlpZIb2mR3tc6cJmDTYsaI7BkIxYWcxpk/kz43d33zBlcL/s6wFIAKrO+R8PKEVFRn5+vrPqrfe7/3Pky1MiC1cr+BsYmgxiraHJhJACdtUe3ShdyD/+/jZ1ySXnidLS7do0bYBtkBaA44EvKcXY9PHXasSoyddNmrZwlMvlUllZWUZt4tbOiMhlWEGB+dyAAc7a9Zt7TIrMnTN11usejycAg0wBxQARpCBYsQrVMM0rr+106epn/nR3KGZbnm/37PnFjh072DQ9xCzBIAAahtcnPt+6jW07eulfHw03fuaJR+cCMIqLizk/P7/OxxyT+crNtT/4aHuvsVNnT38pssjwegPaFBA2OwAJSMOEFXOU1yVkj05XrHvhiT/0I6LdzHybZPieGz4+Z9tOm6Uv1XDYgRIWQBrJ9RvSa0vX2VHLzn319TVf9e1yxeN5yBO1gR04rRpTUFBgPvDAA06VzV2fHT658MWJs5KkP4MFC0HMAAlAEKxohXIbSg7p33HL8Ccf7EBEeyPMsg2Rnjdr2vS/Pfb4eVu2/bvtV1/vtLxJXknKgsEEtgUFfKnys8+2qd0luzuNLBhpn3fjWW8AoBUrVnAdMD9As+Tn59pzF6/q/vyoaXOnzFrmES63FkKIuCsQkEKiMlqhmjTyy54d2857NO/X/ZJcrt3hcFjck52tmZk++ugC8dRj/ReRSzQqryq75MvPvrR97iQJLUAQYGKYPg99tPlLx+emzhe2bP5e35zeHxcVFRkTJkzQdabsEIlEIjIUCtlr3/m8R8H4aZFJkUWG15+hDQGhlAMNN7R0waoqdZqkeo1BvTuseewPd4eIKBoOh0V+fr6OJ6GkE3lKpctl3jZ5zjKyyqtuWb9xu+0NpJhaOwBpQLoJwk179h7gWEwH6qKyI0hRUZERCoXUjr0HOo+ZOD0ybe6ypEBaPTZk/LOQEBAkEbNiyuvWxp3X997x2G9vu52IopFIRFaD8h1DQBwOh4Vl2XJQj6xbf3fP0En/d2FTs+zAXseQgFAOiAEIAiSIDNOpA+Z7PmWDmZ2d7ezZU3HJE0+PfG3GvKVJwh3QDtyCWcJxAAkCW2Uq2aiQ990+YHdO/26dyeP5KKFlR8xF8vPzNTNz/wEDZL8eV935m7uCSy9q2dSo2l/quKQEYAOaIADYuorqgDnM0efmtrc/31p25VOjJs+bNOt104FHS+kS0BoaBGGYsKLlOs2n5LDre+zo3/OqgS3OPevjai07OrdGunXr1kxEFYOv7dJn2PXB5W0yzzXKS/bZJrkBFmAwIGoHdXZKfAwzCyKy3/1w56Ujxk56ceLs1xtWsVt5PT4JOwoCwxFu2I7SLsncv0/2zt/cfeN1DdKTVxUUFJjZ2dn2sbxPQnMEEVUyc5+qyn2zJk8v7fzx1v2OIAmGrjXp/0kHJhwfKM0VFU3zRs6ePeHVlY3LbCifx5TsxCAgwJLA0AzrAG69qa988P5br2uQ7lu1YcMGs3379vZPeb9EQCCIqJyZg5aunDVuSvE1X3yyLyqF10AdMAc1RTNzo/wnX1wzcvzcxgccn+Nzm4ZWUQBusDABstgq24PcG/qKO24Z2OusdN+KoiI22rcn+3je9xBwSpm5t0byvH88/0p27ECFY0qf/p8G5hBQ6j36j/GrX5y66GcHbKGTTRjCiqLScMMWAbjY0c7+7bh1YGc1dEifwS2aNZgfDodFdjadUPR0CDgVn376ac7Or74s9Eqzi11W5f6fBYaZKS8vD8zsvf2+8ONF6z/++e4y5ST5Aoa2qkBEEIJh6Cg7B0rE0P5dMaRfx2GXtGk+Ix4k5No18TmISIfDYZGZmVm2YMGC4Bdbv7mztGT3egAoLi6ulQW0EwIFCAsiwgN/+ftLLa8Isnn2NXag9QD2n9+PUzP7caBVf/a37K79zTqo0I2/ryxaueH2ROLpSjDANXkcbH06FLND/p7Qs2uFhMMs2rVrZzKzyHtq/PPnXjqI5Tkd7fTWfTjlvGs5+fwc9rcMsq9Nf2U2zbIG3PAQr3jjg4GnkB6StWVAjZrUFCLSgkgPHzt7amTu0kHb9+x3fL6A4SgFIQwwCAzmqpL9onenK8Sv77xpWIcrW05nZnc8CzzpeRXX8Gznk1UZpRoCRRCRLi0trTfi5VdHTpm1YuCn23Y5SUmmoTWgOU4oEhxWdqXqld3eHjKg2xN9umc9OmrclEn7Sp0r7ZitNCCYBJgSo8cn4AaIATCYBQgG+NBYguM1nmMZUkEaKoGlyRY0CcSUVOkBn7wg82cLe3T51T1HYyVOm8aEw2FBRMzMaU+PmDJ54vQF3T77uszxJ6cYWlWCyQCEG4IYlSU7nZsGdjXv//X1N7Vp3nwKM9cfetefc6bNWef3+v3QrKHB4MSI0XHPNj5EOapV5fieJqChyAABcKkoNBmo0grpySZuva5HEwAYOXIknVGmrJrpZWb3yPGzVhS8Mu/Cr3eW2ilJPlPbUZAUcFiCheSyfbvU4N6dzNuu6zO0TfPmU4Lxvi8t3B5tG9Bu6WWtHSJoEDGYjn8wwd/dyWAQAXRYDyADOJZCMzPAZIIYYJIASZAgB6QNZmGdcT4m4VOImeXIlwqXjJgw88ItO/Y7gaRUUzsWwBrQDFMQl5XsQbB3R+O6AV0fuPzyX0wMRiKyMBRSYGalBRgQQIwlNAlmCA1oAjTRYa7hp5wfhgL0Idabqz3Ejz6PmCFJgXTc9EkwDK2ES2vh1jadUcAwM4VCISGlUCPGzoxMmrHo6s+/3O6kpTQ0lGODSYIFgUmzU1HK3bPaUr8eVzxybZfL/h6MRGQkGDw4WQUzGyAWUrEmDc3fDavUOOhvDr5IRzinxB/+TguO9fzQe7/Xkk7fRdREDCKKX0KStTBYUfXwdQCw4vQCE08ei+WMwkJn1Lg5T/9r2sLg25u+duqlNjTYjgGQ0GQAgjkarVJXtW9l3HpDzqP9enV4LCsrbESCwUOdJAlbGVwZI2X4SGmARVxbiAHB303qY9WXo+F3LOffex4xQA6IKTFBGJZiGbMNsr5T6dOrMXHzFRJAoTNhWvEzI8ZNfeC9j7c6gbR6hmVXQUKASUAIYjtaym0zmxpDQj3v7derw4h2w4aZK8bk20T5OCSJjBFX7WiYajRzeUgrFoLp2O3/qRAiTqiTBnHcX8WsmFMvyW34PTrBUBSfXmCIQkKIGWrMpNnPjpgw7XfvfPKV4w/4pHKiYCGgWcKQBleUfasvbtlEDurT+Z7br+s5MhiMyMIxIfsQqqR6ola0bJ6WtaukqfR5vbUmka6sqkK9dC8ym2ZUAcCKFStOT1WUmWlYQYFpGAYmzVryZIf+9zA1zbZTWvbl9Mxe7GvVh92tQpx0wQ1aNO5kXdn5Rn76ubEPxyO3olpDtZ9JckwGIxiMyMLCkJr52rKnJkYW/X7OorVOIKOhhGOTBMESEoZwo2zft85lv2huXJ9zzcR7hg24uUNenijOy1NHy46rozsgXIuGLR9AGMx5fNp6oouK4jN+cdGGB/tcfz+j/mVOSutB7Gs5gJNb9OHkBCnpO6eL0zbrBh41fvYbzOwBQHXLvU+M1DsKS3yB6+abe9mr39py15iJs/4xc2Gxk1y/sdRKkQADkJCmC5VV++yfN/AZ99wyYNYdN/frSUR2vKaSXWOzKQGyONMb9WqK+qIf+T9+d+O23KefHze6cPFq25sSMBQrMojB2gCTB+XlJXbzc9PNe4f2Kb7v1oHd4qAw8vNPzoIhabjAmqtXNiV4r8OTyRqKl492DR9tBKsviOc+yrFPHElmpsLCQhEMBrFk2Zr7X5659NkZC9ZqlztAQljEcMCQIBFArPKAanVumrxlcM66waGcoQ1S6NNqQrOGNQXbtr3dqHTHB+OlXdrM0mCLPGSwAwkHXJ1j4PiSzeoElhP5UzUp8B+vH35N4n2qcyyd+MrxJikJQIA0tMcjhSXTNl10ebD/YRHpTwuXQ4WFojAUUovXbPzDi1MXPT577lIntV4j6cAhhgbBgCQPKsr26JbN0+Rv7x0ye2jfzkEicsLhmgUlLnlElK+//mJpfY+zu0vV7s0gg0BkQGg7QVjSEWcb/cAMPDnnh6jTQeQY0f0GKPWCpsCBDKLkPcxhQZSvfxIwkUhEDhw4UE2d+dpDz4+e+Oji4o1WckYTkx2bSGhoIggSsCpi6qLMn4s7bu22aGjfzkOISMWpbzpp3UFSuZxYmUtZFUkk3Yg3nGsTmgmaxPdNCx/n+bE8h49kaw6zgaRgUIXWQglB1j4gUJWI6H66xhQCEEJg644dXT/Y+KE0Dakpzs0m6AkBQMCOlXOL8zKpZ5c+k4mo8oUFC9yhHj1iJweSPAD5sG032Qak5YrCcDFsGCAFMAQ0JXwNjmaXjnb+A/bvcCKNj2D/DiKlE9fQwbjK4TRISSKmDEcaZvlxZ/6RYJARDNL6TV9Me+f9zwLLV73XPmpFtTTcghOEntYafr+Xileu1g+HK+5ctu6dDztefvH71bnOyQEGsGBBU6nSXMKsAcEmoAwAbvAZsDDuoAXn6uq1A5DmaJV20hqd36Bq/8cXuAPnbwLCdCxaY/znw0kn1kGO2b5975d/febF6S8Xvh5w+euTJBdBOwAx2CBZYVlq8fI3r0xL8UUqKviapCTacWgnfk1rDLkDlBw4W/qFhiEFhAZIe8FkAWSfdmCY+PtRGWnElAG3y+M4FZWBeCBTeEyh8xEv2rBhg9muXTu1dVfVZY8/9481L0+ez4GkJnBIEwsNAQUBAW2zY7Bl3HZjn51PhYe1IqLSkwEOMxO2bnV/VrGtn9stzo1WHmBAktAuQFjx2Xna5fCvLGCw1ElJAXGgPLqkedtOb9XI2ITDLJhZbvj408E3/TpPuxtcreu17KsDmX3Z36Iv+1v04uSWfdh/Xm9Vv1VXvj/v7+8yc/3qIKIudz+pGWlYAPm6aM3Ge/41adrz02cthze1idRkkmALDAUyDMTK96lzGmXI3p2uKnr2b/f2IqLKk6E5RUVFRocOtWh0ixGvoaGDrvE0IhyOuADg9VXr7rnurj+z0STb9meGdCAzxIFWOZzU6lpOaZXD7qY97BYXD+W/PDGumJmTq7Wubu4fn/woJZ+XF7SBsNH5qssKPEn+hiUl+x8pXr1Jub2pAiSItANmDW8gYHy1e58zZdZrWckZ7pl79+7tn5FBZTXNBNTJYRIMBiUALF7z/oMdg3eweVaWk95ioE7NHMApmf05ObMvp7box95mna3zLwvx8IK5y5jZB8SXYpwCk1zrjnA4LH6IgT9m1pOZqbi4WGZnZzsTZsx9eMLkBU+sXL3JSU1tIG0I0mSDBUNKgVhZzDn/Z/WNu27NWX7HLTm9iCha3alZN8VryJQdkuMwACcrHDaGDuj95HNjp8DlMZ5Ytepjx/SlS4IgQMNRDjwBr/HJlzud8dMXXbO/sryAmW+Jc2knJ5QuLi52FxcXo1ltGPHEh6xIqm+0bfLLeoGmGWUXnXPOvuMG5mCgkZen8tDBeGDYNU+ufn8zP/3sv56cu2iNSqnXWNjaIJADm20kpfmMdzd9bu/au/sGR6EBMweJ6EBN+ZxD9iI7Z9majavHTFpCvkA6QznEgqCI4msuD+lHOpZOmhOl2n6IUouf6/jBJgx2UZJvafLddw3Z5PG4L41GYycGTLXmBIMR+cuLMp96dWGx1KQfm7twnUpOP1s4DGJywOwgKSVgfrOnwpk2fVFXl0YhM+cQUbSGN3gzY7Y8a285wyMEoASYCEoQNMWb1ATHOzKPafRPtJ5zFJSJBQQYpA2QJuDbfSiPWelCEE5YYw4SnoUhnZWVZfTt3uHx8TPnI1rlPLZk5QeOLzXNYDYAYthawe33G59u3WtPn13c1eWR8xLgVJyoWYsTNfGvbUBrw+Ull8vHUDYBDEWAFnH6lfjM2VyWEWfDhYaWHo8QBtnMXHPAAODi4mKVm5tr3jyg5+NTXl2WbGv7oVXrPrCT/PVNR8W7Fx3NCKSlmx98ts15efr8TikZGYXMHIqDw6ImKp2SFZHWRFqBtEUEdXCGEgTABDqMMuFTZMr+syBAsCWg4lupEOkoAQ4dKQY7odaiRJe/s3lzY2NosOvDkQVF51ix6KB167dYgeT6rnjVV8PWVfCkeY2PvvzGeX5kpHuyRxYyc99DorUTms6W4WFbuuFIF0vYiYpifGbSQbZXf09rThUwB9kzBkzENy8SbLCL3Sy1W59QVPYj4Ciij2ROp6tui1XGtipnysPr391mB1LPMklXAmSBAfj9Scann39lPzMq0i0G9wRmvr5Dhw4MsAKOHxxtR4Wu3I9Kt4dY2RAc39KUE2ZMagCkoEkk1ssQRHVd+BSKONj2S2CukDGnDGRrH9W0xhwGjiaiCinFH555cQprFP1h/XtbnNTUVGlpk6prS75kv7nhwy/sgnFTQxLRqpUrV9zUbliuuaHgp+1bmYjsCMC2tq1//uYff3tLa4vdSrOSBBscr+9BaIJkgJEAiwkEgkz04p5ozf975zjCNd/TTAHAVl5TybMapc2OWRYON+s12veVCIXZ5/Ny+Omx4yfNmDf0iy0lMD0prCAIpAA4EEJyecku55pftjFuvzE4fFDfTvclCm36eKZxgpszfwJheya1QJUSkfOf0+IkSGKFMHm9Hjz54rglTS/qZgV+3lMntxjI/pYDOKnVtexr1YdTWvfXRqMs1SP0W569aMPDABCsKxec9KCQAJAgwrNjpr/dqFV3y9fsWie55QBObn0tJ7XsxUktBnBqy0FaNshyeg1+kJdv+HAoEN8M6Hiy/x86qjtJi157s9Hi4pVvFm944+rq149236k8juiPThKnyAD4tttHm9cN6t71jlt6L2tUj6RVUWZJ7YWhXSBWcDhK/rQ0sbj4Xfv54dPHL1u36Ybc3Fz7hRdecP9UH3eko7CwUGRnZzvM3GjqklVzZs5ccWm9wFnnVvuyH7rvVB8nJSo7mjRu/G/VJDl574EYP2SY3uSC8bOv2LW3zPH7Ug1NCgo2QJq8yT5jedGbSlWWPb90xdtJnbLajT7RlcDV9zNz/T89MXbBnAXL2/7yklbKJd12bbA5JxWY/Px8HYlEZMBNG/eV8z2KadJLE2desGdPmeP2+w0NA1o4ACsyXD5avf7zet6XZj0xddai7aF+3V4bNqzAHDPmp29fkghCVPmWLY0ef2bs/BnzVrXdtbc0aiYleWyt6H8eGAAIhUIqEmGZ5qd3mfmyRvXS5w0fOzV78xf/tpLSGroslVidLFkoYeq5y95IjtoV8+YuWvdg726XPxt++WVP/s03R3+KphCRYuYGt98Tnrto+ZsXl0Q9DgVSDUdryFoSXpySRUWhEKmioiKDiCqYeWiVVTV11L+mX7lle4nyBDKk1gIKVdAGCXeyX6944wMVK8dDc+a/5erT89LHg8GgLCwsVD/BfGXc/dBTCxav/ajdt1HheH0+o7K0xKlNa0JOWU0+OzvbSczmr++7Ndj/+oHd3m5QzyWjFfs1CSO+RbwGBAshvMn05ntfZIybNONPc5asvHPGjEJ1hI16jgjKAeaGjzwzeuG8JW+02/VtuePypBhKA/HtfjVqyxb/p3QZXrVZI6JdzNyZ4N48fMy0+uWxUmW4fBI6vhCVCEImmXp+8Vpfcrp/1OIVb3/a5VftllX/KMMP+ZQdZWUZY8cWznlp8sL2+8uU4/WlGFopCBlv7WUIZpZcB8wPmLWE5uxj5qu1souGj57UOBaDMkyP1Jqg4cCRSrhT0/X0WSu0iulFb7+/uWO7/2uxMlxUZORnZzuHsw3M3PC5cZHXXnhxWvuSA4bj9voNpSyI6pSfHYa2CcxmHTBH1ZyIJKLN335b2p9gLXxmxNQU7ZAi6ZOCBEAOGEJ4A8k09/UVkB696PM9+3qdVz9teUHBBjM3t719iKMXoybOXzpyzMw2O/fFHK83zWAVhWQHJEywMBnqANVP93FquncPAOzZs4frgPkBcIqK2KhXj9Zu/mpnlypHzB89pjDDUYaWblMgUe2DUEQer56zZL1X4Z+FX3y1t3vzszPeCkcirlAoZDFzYOS4WXNGjXu1zVc7yxxPIGBopwoGMUR8JycuLdnNOT07GFdfeemdZ9VrsDAcDoua3i3pvwaYeEBATiQSkS3ObvzWJ1t35BwoLZ39yqvLMyqjSrncSVLDAcOCMFzCipnOwtc3prupoOCNNz+8+arL2rzHzI0mz1gyZsL0edkfbd2mktMbG8qyIMiBIh80S9jle9Ht6tYi2P3qO4b0615wMraw+q8DplpzwuEio2WzJqu3l5b2KasoXThn/tvJytIKpimJAM0OTA8bVoydeYtW/8Jl8PS1b2/JeW74S71mLX7z2vUbv7RSMxq5LEtBMiAZUEJzeXmFc3mbZjSkf7f7h4S6F2RlZRmhUKhWbCF/xoT2RUVFRnZ2trPlm28u/0v+6Pmz5q9NF26fJmkIJg3NDqTQgBNlchT16dEbG9/5EB9u+1p5U9Kkdpz4KgTWMCWjZN9+q8OvLnH97u4hz/fscPFvg8Gwq7Aw30ItkTMq54owyxCRWrbi7V+NL5wze/qcpak+bz0GuYViBZADQQStJds2kyFNsCEAaEgdB05Kif0l+5wrLj7fuOu20AMDczoOz8vL03k/shFEnSk7mlkjUgUFBWbHrHYrF61ed4thyJmTprzOgdSmWkIIZglNBCaQ6WEw2zBYgyDi9X2S2F+yx2nb5jyjb6/sRwb17fT3QUCt/MnFM64bPzc31x5WUGB2u/Ly2TeFet83ONhFVlXuZWZbk2AwOdCwAdYQSkCoeL2XpJv3l5bZF1/Ywgj2ufqlB++9/rFgMChr6+9gnrESDocNAPhsx66ud/3x6ZjvZ1nsz7xW+S/oy95W/TmpxQBOyRzAyS0GcUrrwUwNsu1eQx7maXNXP0IAatuv+NVKcIrf+qDfzfc++a2/WTb7MruopFZ9OdAqyIHM/uxvdR2LJl1VVq87ePK0RY8xs1mtKXUjeFLBiZeGV675KCvnht8cSD43i5Oad1fJrfuzv3VfxtnXOG0738Ljpsx7WcS3ManbXOhUSXUfwKoNn1zVqe+dJUnnduTk1v2UPKe7dUHWII68VrwWAFBnvk4fOAtXvNOnx+DflCP1Qrt9l2E8bvKCGcyckpUVNlCb9tv/rzJriY6XF8a+3O2+B//MTz07cjQzpwDfbQZUJ6dBqjc5ZWbjmx1bcpjZlQgS6hbhnqFg1ckZQ99EInUhcZ3USZ0k5P8BC5EiijONfgkAAAAASUVORK5CYII=";
  const CE_LOCKUP_B64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYUAAABQCAYAAAD2p2lgAAABCGlDQ1BJQ0MgUHJvZmlsZQAAeJxjYGA8wQAELAYMDLl5JUVB7k4KEZFRCuwPGBiBEAwSk4sLGHADoKpv1yBqL+viUYcLcKakFicD6Q9ArFIEtBxopAiQLZIOYWuA2EkQtg2IXV5SUAJkB4DYRSFBzkB2CpCtkY7ETkJiJxcUgdT3ANk2uTmlyQh3M/Ck5oUGA2kOIJZhKGYIYnBncAL5H6IkfxEDg8VXBgbmCQixpJkMDNtbGRgkbiHEVBYwMPC3MDBsO48QQ4RJQWJRIliIBYiZ0tIYGD4tZ2DgjWRgEL7AwMAVDQsIHG5TALvNnSEfCNMZchhSgSKeDHkMyQx6QJYRgwGDIYMZAKbWPz9HbOBQAABaZElEQVR42u2dd5wlRdWGn1Mdbr4Tdmd2F5aMIDlKUARFUFTEgKKIIIoJ/VBAkWQgiAQVlaAiSBATioqAAgKKgogSJcOSWdg86eburjrfH90TNpBBQe/rbwR2Z+50qKqT3vMeqY0NoerooosuuuiiC9N9BF100UUXXXSNQhdddNFFF12j0EUXXXTRRdcodNFFF1100TUKXXTRRRdddI1CF1100UUXXaPQRRdddNHF/5RRkO4b66KLLrr43zEKMuVrGVOgiqqd8qfafXtddNFFF//dRkGzLwfohHlQVTzPkA9DnHPdoKGLLrro4n/CKIiCWBBFMFmEYAlyAWPtiEeeGNZCKYdzFtFghVFFF1100UUX/y1GQbMDXg2KT6IdfF+JNc/+h5ysO+3+SW69e65Wq1WcrfNU6aYuuuiiiy7+G4wCAlkE4FyE7+eI/Aqf+PzX9aIr7uLJeo69P3E0t9/3qBarJayNmUw3ddFFF1108V9kFBSwqCiOGN9Tcn4vXzjsdP3Fb6+hOq1ET67Mw/NqfPBjx3L/Q6NaqpRIbJQFCt1ooYsuuujilW8UxKZfCILgNMEHcrkqBx11hp7586uoTB/AaQQaUe0JmfPYEHt//BgenjesxUpAklgUDxWZyEB10UUXXXTxiowUJLsMg1Uh0IRcaRpHHv9DPe28C+nt78Gzhk5HGas30bhAsaeHWx58mA99/KvMWxRRLBWxtoWoQbpM1S666KKLV5pRmHJyqw/qo1hEHaXKNI765tl60pkX0dvbg4/QHBtmgzX72e3tW1MbGwKN6e3p55bb5/KRTxynwyMtSoUQZxOkGyl00UUXXbwSjEJ2WouylDsvDiVGnKVaHeC40y7UE049n95KD0ZCxpptVppR4cxvHMJPTj1c3vnmjRhbMoxzOUrTe7jmlnvY5zPH6nDDkC/6WE26b7WLLl4WSPe6QScPGulW/7pG4Rng1CGaUK72863v/0q/8s3zKFQH8I1Qb9WZMS3gvO8fzaYbrC6mVeOsbx8pu+68FWOjizA2ob9ngKuvvZf9Dv661hoW3/hoN4XURRf/cQigKFYUUUVlsj21i65RYGI56GRfgaIYtZSrAxz1rfP0i1/7PpVSGc/LM9KwrD5Y4rc/Po5ttlxDxuqjRFbI+Yaf/vAI2XO3bRldUkNRytP6+f01t3L7XQ9qMV94hc6c1hV8dfG/doj+N3nRKoITn8QZImdJnMW6GMGBaJcU8jKF/+9b8Tq+UkANqCBqqfQMcMKpP9FjT/kZ1d5p+EapNRrMnJbnJ6d9hc3XW0WGakMEXoAIRC6i4CxnfOPz0oxiveQPN9AzbYB8Po/xDSr2Zb7tlzUC/43Hwf/ywS5T3vBzM+zp9/8XrQMF3yWUS1XwQ6ADKtTqdVQi0Px4vqC7cP4njYKadJWIAyxYS6V3Jb5z5m/0K988l3K5HzGGeqvJrKry49MOZfPN1paR0SWEfh4cOFE8fDqREPqWs08+XD7cOEYv/8ttFHpKWEl45Qi/TjUEDqcOVV2q3KJiMCaT+1jOoHTx8oRb6h1PPeb1adwDyTzrZX2oV7A9wAB+rsy5v7pa//b3O1FxbLrJGnxwz7dL6BRjLU787mr+nzMKWQ8C6k36x9bR0zuNM358mR5y/FnkShVyxlGPmlQKwhmnfIXtt11fhodH8L0C4hSd2CUWPI+WTSiFHmd97wvywU8ep3+65h7wBKcvZ29r6rV5qDqctZjAUsiHhIHHJEXXoYnQbEVESYzxfIxkhhXXjS5ehu9WVXHG4UQRNXhuSl+lMsmM0+XdA8Wg6iMYMAq8kgkTgtiYfKXIV7/1Uz3+27/Itr+Bn7W47Z7H9bRjPyUSjWVJg+46/h+MFNKDTiTGJW16+mZy7i/+qAce9V0KQRnxAmodoey1OPvbX2HH7TeRxaMLKXgFUMVlBkF0XDvV4RlDuxPRWyhx9ulfkr32OVI7ox18b9nD9+WzUZxxiGZftkmYC8n1DDAWtfjX/Y/pvHmL6HQ6WAc5z7BSfw/rrbu69PX30m4OE0UWMWH2ILob6eXzahURCE0RQXG+Q9TDc1Ncfn2K8CCzEAo48ZAkwbmYOA0dJi3KK8YcKFaFUqHIHffP1e+d+1vK1R78MIvgkx7Ou+Ay9thlS33z9ltKu97CeN21/D9kFDTtQ8Ck8hWR0jNtJr/63Z90/y+dggQVip4ymiSErsOZ3ziYXXfeQpYML8D3fZxTxIEzK9gUqhjxaDY7zOgLOfu0Q9EEWq04DeKfjoKUeW3yb/ZQ0o7tDp4XUqoO8MAj8/Xnvz6Xv998L/+66wHmDw0jziEqWDwq5SKbbrC6br/thnzkA29hjVWnS320jhB000gvl/hAlSDwmL+oxhFf+642WgYCg2jMs0lljh/5RqDdbrHhurP58hc+IuI66FIVileQWVCHCUPmPLqQettSLhqSJEFUMJ7BYpjz0Dze/KYcTlrd8Y//M0ZBsjSHCorDJR16+2dy8WX/1I8d8i18CQl9j1Fr8eIRzvnmYbz7XTtJvbmEar4HlTRFIvo00hUCgVg0Dlhn9VVFsXTimHzeX+7AFDSLMlLutKpg4+Tflm4yCDaOyZXzNDs5jv32L/VHP/0tj88dxvgl8sU81cq0lMetiiPAquPvtzzMtX+/l59f+Fc+/9l36357vF3UdojiOE01dA3Dfzwh6BlDvW310mtupT4G4htUOmQvk2VZd0tZBFKeZiAecb3FSK2ZisarvkLfbHbPtsWqfT0UBJxzBCbdk9YoGscMTh8AF2VVly7+u42CuMwY+OnHi4OkQ29PP7+/8p/60YOPI9KQYi5PJ4rxXJtTvnYQb9ppG7ntrvs09HPZBsqMytOK3WXf40IUC7jU+1/BzwgOh2CwaSlQfVYZ6BE/EF5KvpITwVOQOKZULnLPY4v04MNO4epr/0VQLVIZ7AN1OJt6hp76GATPdfAV8oUQUy4yb3GTzxz+HW697SE95gt7S6XiodbRrSu8PCyDJ0pPqYAPmEBQQsYZZjIRni6/elHwFHzxGTYhlWIBX2NsFicIryzjoIAx0Gp22HzDtWW3t26jP73wz/i5Hqxn0bjGm7bfgjfusLm0mzWM+N31819vFFRAUi0jRdC4SU//IL+6+G+638EnkEiBQj5HMzLk3Bg/+OZn+cC7dpUvnfB9PfWMS6n09xJrPOlITWVtjv/3uMM/ZbvoeKvklL+f+k9RxRmPwCUk1pEvGi7+8Un66lUHJG53MOYlOlxFcbZDsbeHf97xsH7go1/l8cVtKtMHwCbYSFHj4Xk5knZEox1h1eH5HvlCDs+A2g5hLkdQXpWzzvwtlZzVbx77WamN1THG667ilwmscyTq8J1DbYAazSLl8QVrM6dJljpEY8CXhIiYCIt7RRdeNU1/io/Q5rsnfl5es/EG+rs/XENsYnZ6w2vZf+/3SiUXEyUmtSDdbtP/NqMwSatM175BNS0Gu8TR2zfAJX/8u+73xW9iKVAKDO1ODEnMqccfxB677ig2SYicz1ing2nHaBLjZErAMBGGjxud8cXHMpZisimOiUJdVkDI3DJfIbEGJcHYGHkJuX+CgI3w8z6PLKrxsYNOYu5CR7WvgrM1xAUEJk8nalOvL2aVVWbx6rXXo1TOsWjxGHff9QDDIy1K1X7EM7THxth40zX4yH770Gk7RMyK34aaNEVGSnNdOrSXKfZVEHGTz3i5T9Klvnci9YaCeilJRtK8ekoIyCgFIpPl06nvcGrRVJXxOmwa3cnS0ebTFlnHpVIyymf2vYou1biYBo1mmRRk2jQlOv6GlvfEVQTRpftIxtOPqpNpyMlnM/l9upQnowgRWDCY9NqmrDfRyU8wnkGSNsY6nAaMs490IvqWpcgFqRPkJu5j4s91Ml2lIhhhIsmoT5XmXSo/O96HnDHgpqwfQbLXJBMp2aWinql7USBxjpwX8dmPvUP2//DbUcD3hbjdJoktGG/K3nUrTEMZlcl2Tpm8EZ3i9U1mB8i+X5/xvEqT2pP3P3mbWdpa0t8vuuxOeDp/OGWdSfY5LksDjl+OTMwEk6fN+mrmxKY/brKdk17x5N3J+DbK7iR9BmbiFcp/0ihMceWzg1cEbNyit3cWV/3ldt3vwJPQRMnncrRsgo3qnHb0p/nQHjvK4qHFDEybgXYsNJu0CzkSa1mqtvyipf0FiyG2gjGKU+9ZveznmWlGVBEcJpjOUcedpHffM5+egSo27gAe6vu0xsZYY3aFzx35WV6/7aasPnuGFAvC2FiTe+bM1V/87lrO/vnvqcVCX77Et7/+WTZYvT8tOHvLGEsEh0WdRbCI7xOEAd7EgeyIk4Q4sYiAMSbrH3kKz1fT/gkzcQYLYnzETNKDrU3wgxy+HyAosXPYxGZF/MnFny5pi7OK53kEoY8nHihYLHHcSf/OeNl6lqff2NmiN4A6h1PF9338MEw3n6aeexTHqIKHhwg4WZHpVpyzE+SEcQMgnpd9VnZw2Bg/CPFCHwMkiaMTJ0sfmtl7EOPR6DTZaoOV+NoRn8IlUwrPssyeyfSBEqdUqkVU21OMI+AM1iVT3C/FGC+lKEvqmTtnASUMPYwJAINTSxLFxOrS73/KDH7WVZD9PuvAaCd9nkGQevMo1lqiOEHd0zebeZ6XHaYeruMYaQ1jZPwQs4jx8PxgyqNQVBwuSVewZs9RDDgvdTINAjZGcfhBDuOH6d04JYnS6F88k9GBn8mBzRwDp7jE4fmGIPQniCdOHXEcY63DiI8aD3lGlQSTnX0W60CdJfA9/CCccN6csyRxjEvSa30q9U4BnIKzipC9d3UQKEZDjBpUHNZG+L5PEKRrPrGKjZMXTPH1X+ghiyRZDSFdiGoSXGzp7e3lLzfcox/67HGMRj6VnCFyMVFzmBO//Gn2+/A7ZGxkMYEXolZZZUYvm2y4JqXePmJngRc/Wy7GpZvZWvI58EODOvfiK6uKghqstqhUS1x81b/0l5dcQ7Wvh8S2EDzw8jTHxnjTVuvwvZMPZa3VZkrcqtGJm9TrlsAXtt5sHdnmNRux0/br6qe/eBKHfHYvdnzdZjI2vBiCMN3DbpKJ5FwL9Q3V3ipGlHq9w8LFo0TtRJ0T/MDSU63ItGl9EEfUa2PgF7LstVt640hMuVDED/JMcuZDWs1RbGLBOkxoKJf6Wbx4jOHhxSooxWqv9FdyJHGLxBTxACRBkxZhvki+WqZRbzB/4TCNWFVEKeQ8mTG9l0o+oNkYJY69p02LKYJKxvCxlmKpghcKw6NjLHiyibVWxQilYk4GBqv4nk9jpIlTRX1v4tAQFCsevrYplQp4QXmKx6o023XiTg6hjecllKtVhofaLFywSK1AtVKUSqW0XEpo3CtMLFQrvbzxtZtKkjSQ8e0mbmnjJqkHKCokqrTazfQg0QBHhyCXo5Lvy95DatyjqE6naXDGQ22bnkoPTn2eXLKAWnOJoh75wMjK0/soF31Gxpr46uMki+h0qlsag+bABThGqFaLGFNh8VCdkcU11dhhjFIohjJ9oI8wyC9zyC79dmrNJUiSR6RDua8XI95S0ROqNGt1EgHRNM3kG59CX9+UteaTJE3q7Tq+eqiFQqmI7wcsWLSYkUZHHQbfg1nT+qWnp0xtbBSnNt1fKzR/49GuI7GOXJCnUi1T69SYt3iEqG3VAGFopL+/h95qkaRWp5lE4AU8nXuvCJ5T1Ebki3ly+Sq1sTpzFwxp2zqMCMWckRkDPeRDj3qtjrV+ZsCXjuOMS/BzFQr5IpARFjC0ojqumc6fUYRKXy8j9QaPz12iqgnVQlkGe8sktkXyAmo1UhsbeoFaQVlIrH7qqdomPT39/P22B3T3/b7C8GhErlQgcgHJ6AKOO3RfDjxgLxmtLSSvIQbFSoR4IeKFoAZPTSqgtfzrXN666rLfsIKsw0QNQgCLiE2ttrNZqktW4E3A82f2KKIeKhF+rsj7Pvo1vey6m6mWe7BW8YzQbCZs8KoZXPSTY2Sl/iq1sQbGN5gsBZd66gmiSqVSZc4ji3XGQElCiUnwsmjRZjULi2+EUqXKaDPh2n/cobfe9RjX/+NW7rp3Do16hGd8xFhWX302O7x2M96x49Zst+VG0miMjAfMkykQtYR5jz9fe7fedNcj5Is+JnFY4/GBXbaVgWlFvNAx1vQ555d/0V/+5goeeexRxEC5WuZbX9mf3XbaSkYblpAIpzHV3n7mPLJQ//Cnf3Lln//JrXfeRzOCQJVqLuA1W2zEW960Nbu+eVvp6wupjQ3hSzlrWnSZdzcemlvUOXxRitUqt9z+oF525W1c+ddbuO/hh0gy731afz87bL0Zb915C96y46biq6XZjvGMyYr6EOFRzAt/++e9+rdb5lDI51BnwFre9dZtWGmlgnji0ekUOfd3V+vPfnU59z34CEaUainka0d8kj13e5PcM+cR3en9h1NvWHwPRDyGWy122np9Lj7ny9KO6pNGYbnDdDIUTiO41HNXG5Arwt1z5ukVV99MEOQQcXSiFttvswFbbLiGRM6jVCzzp7//Uy/+/bX8+S93sGDJMGqUfCHH1ltszAfe9Ube/uatRds1rBNEvMk8vihGFescXi5HPlfk2uvv0quuu42//u1GHnhoLpFzIJa+vgrbvXYL1n/VmhhncVNSFCKKc5D3hfe+cyvpKw2g2uLCS2/UeYtGsj4FIXaWvlKR9+32Osn7YK1HmHM8OX+U3/7hBrXiI57Q6TTZYsNX8YatNxOXjFHs6eFvt8zR3/7hBv745+uYu2AxRgvkxLLFJqux+7t35D1v31FC2yaxCdaE6apWNyVlZFImpOvQ09vP44tHuOyP1+tVf76Zm26+j3ozBmPJFQI23nBddnnD1rzrza+XVWaWGBsbRvxwUplhItCT9PmRYDLZnjvmPKqXX30jf7zmJu64535s7DAYeopFXrfVJuz8pq14287bSKmY0Kw3CCimxtoo6qAYetx61yP6x+vvIpfzUTUkSYu3vGFzNll9VWmbFgQ5fn3RP/X8C67g9rvuxaHk8jkO+7+9+OQ+b5dWo55mAv4z6aPJFERiI3or/fzrrkd1r08dzaKRiJ5insgK7dElfPXAfTjkM3vJ8NhiApNudqceqgEkCklngqM/9VDWqbnUcYrfCg9veYb/tlMsRJxuUjVL5YQncpQv8Jk4jSkUS9xw6xy9/p+3USyWcU4xojinhKbDUYd/lJVn5BgbGsUPitn1TaYXPEmfQ61eZ82ZFYltjE2z5Cmpy3MojmKlh0bTcu45f9CLf/83rr/xDuodCMI8QZADr4ixabh8xx3z+eeNF/DDs37Dwft/UA/5v/eJxg3Umey+FacJ+VwPv7n0Bs464zcwUIXEQVRn/VUGdde3vUHumvOgfubQb/GXax8gXyoSBgWM8Xn4wUWMNTrg53FuFM+z5Ir9nPnzK/Rbp13AfXOeIJ+rEoQ51HhYgWYn4cIr/skFl/6V7bZYX48/6uNsu8Va0hxpgb/0QaqASRz5IKCpOY466dd65o8v4MlFY4TFPkITpA1+qjw2v8lZF1zBeb/8De98y5v0uC/tzxozS9Ju1SDIoeqBs4S5Kpf+6WZOPvE8TH8fToGxUVYaPIoPrrUdDz46pAcediKXXv1P8oU+vLCIBD6PPLKQ4eE2xvipRMnEu5t0xQXFGMEzZooHK8/saAGqCbmwyL33PMrhXzoFyv0YI7glQxxw4F68bquNGV48zNEn/ETP+MXvabQiCoUyRgqINXSihIv/cCMXXXINXzzg/fqVQz8ottHOHLjxtKMhSSy5Sp55Qw1OOOls/fnvrqDWaJPLV/H9HJ6k0cmT8zqc//M/Y5OrljduBrCOSiHgzW/cUgernjRjj++e9TtuuekepFxIg4ROh9VXm8k7dtmOUmCINSYI8jwyf0w/f8wZIAWM5+FGFvPO976RXXbcitFGyDHfvkBPO+MiFg/VKJQqiF8GUVoOLr9uDpdcdSt/+ds9+p1jPyOe1LP8+9LHm2qME6HYO8Bvf3+dfu07P+eWO+7Fz5UJgyJGfCTxaXeUq665gz/88QbOOv8iPf6wj/K2N20po7UxjJdbKuhBwDnFCwQTVPj2mb/RU374Kx55dAn5fAU/DMD4iAr14YSfXPxXfvybq9n5dRvr8cd+io3WXUnao23E97O9ZwkKFW66+V6+fPh3kb5p6a8aWoI54TNsccB61BZHHHrUKfrzC/+K5Ivkc0WMZ1gy90nmL5hHEAjNF1C8f1HYRyKOxCX0Vnq4Z85iff+njuaxhTWq5V4iC7Wx+Xxl/z340kF7Sa2+JM3vOn/KUZw9EARMgkgjyxkbBMH4wdJVmIkUBysukk4t5GRFF0Vwxs/kNtI8slmOJZjKaTiboGqfNt/+jPGTOrwgx5XX3MRITemZHqJJjPEMY2MN3vbGTXjLdptJc2QMP/BA7QqMWbbfjCFKOjjj4cTDd1lft1NMWOZ3f7hRTzj9x9xxx6M4zVHumUZvNa0FaFaNEh1fvIZipY8o8fjqCedQa4zq8Ud+Shr1sck6AAYFysUAb1qFvr4enPMZqQc0rWXJaJ199z+Rm+6aS+/MHnAx4hKcJkyfXmaTdVbHdRqYwKJehcOO/YF+90e/IcxPp39wJqpRdnYmaU0nMAT5AvhFrr/jQfbY9yuc94Ov6I6vXV9qtVGMF0w8GucshVyeJbWEjx1yjP7+jzdTrhTpHxjEqWbEgVSq2UMJCyWMK/PL3/+d+x6ZywVnfl3XmlWWZtTGmQDVGNSSKxTxBvrp6e3FiqHuCbUopt6CfT9zMtfdfCfTZvTjkvRdJZrQ019gk/VWA1qo8ZnQhl56RaXFadVnjD4nnJGJtZ/SrD2/SDh9kGK5hIgw5llGmg0efWyUD332KL3un/dTqQ7Q15c2R+KSiVp9tVokkR5O/O4FrL3Kqrrfh94io6PDE+k55xL8os9jC1q6zyeP4h83PUh5epWeQjEt0FuLTRKMCPlCSFj0UQxODCYraosIeB6xtfTk8+AFCDHOKKW+KsFAL8VSHhRanZi+vkoWEac1JeMcoe9RnTaIGIPxDI0wR6Pt8fiiUT536Hf0t5f/g1Kpj2mD/Vn9J0axqK8EuQKm0s85P72KlVaZqccctJfURpZkDsUUZ0KhVOrj66f+XI//5k+wFOibNhtHJ+NKJlmpyuARkjcV7np4mPfv/zXO+OYhuudur5darYZkz04AdQle6JPYHJ875Lt6zi+vIl/qp29wENUkXY+aIHj4CEGhiIjHlTfcy/37fJlfnHmsbrHRKlKv1/GMnzokOPxCHm9gOr3VKiKWYfFpNB0WOODQ7+qvL/0b/YODOI3wkoTYM3ilAlts/OqscfI/WWiWNM3RW85zzwNP6p77H8+cuaNUe4p0Ikur3uCzH3svRx72UYmaQ4j6GQNm3D93y2RuDGLLafFPPKzGNOY/hFOrKr54zunzveGpHQm6FEPGAR5gRF2sQXVQcoXpiLrsKp9bpVtRPE9otNvccPM9aVHMpqFmImlO+T1vfT2hD5EzWf1RnzZtZY2fBRGasRwUwZILClx8yR+55R8PMH2lVUm0hhpLFAudThubuJQi7EGxUMBXxXUijGfoHRjg1LMuYuutXqPvefMmMlpr4Hl+NgcpDYmt7ZDYDjgHcZ25C4Y44oTv60133E/fjFVR28SqjwokiWXWrF5mDUwXF0Xk8zkOP+ZHesqZF1GdPh1RiK1FxVBvjmASEDEYyVEoFdAoordSYmE95tNf/AaXXnCirjZQkajj0tfjHDnPYzSK+cjnTtLLr7mR/sEqSeThEo8kSah3mohxqBU8P6BULGJtTM+sMv+690EO+tLJ/OzMr+IZi9GIRFy6Hp3DxgkkaWHPxi3mLx7i2G+drdfdcAs9K83G2gSHQ0WwiTI4rZeVZk4D28FMzWNLxs5y4KvBeAG+b1IjLYKMOxsyyfNJNC0MyzjzSKYKYCS4pA2Jj1UIfZ9b7rif3fc7Qm+552H6BgbRJKLdaaM2JBfmQCxOLc4peJArVjnlrEt421u3pbfoiOM0neP7lk4S8rnDT+Qftz7ItBkDadEfQ7sVk/OUvr4CnZYwUhsjKAZ42WGeys8Y4k5MrDHOKn7cxmqCwaV1qiRB4xiSzADEEYlNgBgVMzlXXROwLZzLIVYJjeXhR5/k/R89Wm+8eQ690wZwmtDoRGAdYZhDTQiuiarDejUK/VV+dP4lfPAdO+irVumVZpQg+Km7aWNK5Wl84wc/16OOP4tKdRaeWJxrkmBo1y2qHdTEiBrKxQpGOlQLedqR8Lkvf5/V15il26y/ktQbBhdYjPXxxCIm4HOHnqbn/fJKeganY60ldhbnHM3mGMYJRgX8HKViGdUOvX1VHllY59OHHc/vfvIN+os+Ns6eGQ6nMTaOkTjBGsXaOiO1UU4+69f660uvpW/GILE6PPVx6rDWp1qpsOrslbCxfUF10hdcaFa15MIc/7xrvu61/9E8MneYarWAjUHiiC8d+C6OPHg/aTQXYfCzUHRqvWB5ZUiVNNdvTIyLFvD4Tb/QOBpGja+eJs+NMaTLRhS6dJQhS+VFNYnarLzp+7Rn7Z0ksR2sx3NnKKkjDAPmLhrSBx6aSy4XouoQhCiyDEyrsO0WG9KJ2+DZ7DXoMz3pZeoegqiHuDYHHfxxLr/hATqdVFm1PlSjZ1qJV6+1Or3lHJ4XMzLW4O67FmJ9HxMEOBcTeAEqeb79/Z/w1h02wPdM2jSVFUIdKUNCRXAOyoU+fnDWxSweHqEybTrtpE1rpEYhH1Ao5qiPDbPy4Kr09RbwwpDvnfNrPeWsi6hOH0BtgohP1IkpBo6dXrMe662zNlZj7rzrfm6+83HUKxBjKVcKzHloMSecfD5nnvwF2tEIRtMQPCgWOPLzp+jlV99G/8x+ksjhvJBWbZgZvTne+Nr1WXOt1amNjnHr7fdx94MLCHJVaDv6emdwxZ+u59xfXKyf2+/dUh8aBm9K5KmT/Qalcg8/veBqlgzXKE+fiYuV2lgDPw+VYo7aksVMf9UgAwN9ksTtLLZaarFhpIXVNksaLVy7Q5BRUnWCdZRRah04zydfTinTyzsG49xfk62tHI88OoTF0Ns/k7GhMcQoK63chxFl7pOL8P0Sge+halHXoVgIuevBh7nimht0391fL52oDSpUq3386EcX6+VX3kzvwAySThvjezQaLTbbYDZfO/wTrL36gLQ7Vs/7xdV875yLwXgYk4Yi1lrWmj2Lvt48cTuiWAoIPZfWLibIsJkh1IwplXKJUBk/BwxOMkoxBlWLCXzmLRnh8YVL6JnWS2OsTmI7rLxyL0EQ8PC8YVQCymFKVMEJucBj/oLFXHLZtRx6wPtwnRGMhKhrU+2t8MtLr9UjTzqTQt8MjE1Q59NxCeIavHaL1dh43VfjhTnuuudBbr7tASJ8ggCKuRxDww2OPvFsfnf20RgTYSXBqaVa6eeok8/W8351GT2DM3CxwzMh7UabatFnu9duxPqvWoNO1Obmu+Zwx11z8cIKmkRUe3q4+bZH+M4PfqEnfelTMjo6lNX2/NR51nRVxU4olCtcfuX1jLViitP6cdZRq41QIE9PKUdzdIgZs3pZZaWVJY7sC0qBvyCjoBnvX5zh0KO/xQMPLmBgYDpt16HVTNh+sw35yhc+Lp36AjyrOE9wymRa41kweIzmwStggjGMBIgrpJQrfRoa+1MUmpdjNS4VXGb9o36ADSAKOlibZHlgeY7PRTB+yIIlI4zWmhi/iCPGE4OLlFXXHmDGYFWSKMmKp8+1Mzn1RD0T0Kk32Hjd2fL+d75WT//WTxlcexb7fHgX3vuO17LVphtIPkgji8gGnP+Lq/Xwr3+fyObSa7GOfLHE7fc9zB13Pqiv2WwdGWu1JloKdMpZKaqIhDy5qEEQ5HBRB18iPvbBHdll+y2ZPn069z70INNKIWEQcu9jC/Q737+EfLmMuhiPAlGzwUrTQ759/MG8bcctBG2DeKiGnHHu7/SI48/BeQXEWiqVXi676ibuuv8xXXutQenU2/RUpnPZdTfpz377V3qn9RPHDcQr0q4PsdUmszn1619k0w3WkEQtHkKjmXDk13+oP/zplRSL/eAi/GKJn154Bfvs/hZKfkjkouWfriqB5/Hk4joaFFDbwe8M86F3v55ddtqW2YPTeOThR/FzIb4Y1HmZGvDk81IHhVwft9+7iN0+cITioqyhS6esOAWTetqrzOjhzNMPk768JbZPvxpUFT/w8UzIyJL57Piaddn3g7ux1Ws2IBd6cvEfr9fjvvtjxpqK5/l4mhpk6zxu/tf97PuenVFt4nshnbby+8tvJMz1glWMMbTiDqvP6uXn3zta1lytQlyLEb8pJxy5L2ISPenUi+jpq6IKrdoI22z9Wr534iHSadVwXgjxKFFiwTcv6GzxfCGXLzA8tIDN11+Dj3/oHbxh240pFUvypxtu02O/+UOeXOzwAgPOYKxFvJB/3jYHFysYQZ0l9H0WjrU58bSfIKYXD0HFkdgmvYFy4lc/z/t3304CYqwIzuT4zSV/1c8d9l0aVjDO0Fsu8Lfr7+W6G+/XN263lsSjHUqlPLfc/ah+75w/UOirookjIEerMcLaq/bxnRM+zw7brifGtREJiRKPb57+c/36KRdiCnlIYgqlPi669Ho+9ZHddcZgUeJGayLFPekMOHyTY+FQGzUeRnI06w1232Ur3vGWbVhtlVnMnbeQVq1BsQSJjREJ/jNGwSA4TemBh3/uYzzwwLEsqrXJFXMUCoZbbr+bb3z3J3r4AR+U+thIWuyUZ8fpEQVnwIklogmukf4ZyaSMtj5D68TTkYh06QWYthcJkYuRRDEuDcsk85SfU9elc/iez/CSOo12RFjM4zR92DZxTO/roZAL6ESd52XRVRzOS/0qT3xoN/nEe3cirtfY+8PvZLtN1pM4atGJ2jRbmf6U1vjkvjvJnfc/rKefcxm9/QWsVYwnjI1G3HbXA2yz1Xpoc1kZtszLE4eTGBMa4nZCqSB87/gj2H3X10sa9lt22HZd4laCeh6/+u2VPP74IqqDVayNcc6SzzX43rePYJfXbyPDo3MxIjj18FEO+Nh75ba7HtRzf3kVPT3TMKFl4fAI11z/LzZ49btoa52EiHPPv4JGYukJ2nhxgajV4lWr9HP+6cfJmrOrjIyOIEZxKhSCgOO+vL/cePtDeuudj1Ms+wT5Enc/OJ/b7nxQd9x6fRmrdVbYdOiweIEhdh1yXpNvn3gQ++6xs2DbuMSywzbrYx2M1er4eT+lyU60OWlakzLQiCLuvP9JFB8rKYtnavugEaHTjqh3YtSR5rXxJprHVqiBlPoENBqL+OQHd+KkL+8vlWqeTrOGWscBH9ldJLJ60LFn4PdMR12CqmK8gDkPzaPdsfjGEAQeC+YPMefhxzChQTVGJKTd6LD7fq9lzdWmMbx4BBP6aCtPwdX4yAffzrkX/JWxRpMw8AgKVa7+8w3MnfsYKw9UaUUNPBOhkksjWXVTu1CfA6tbMZ5HfXSE3d6yJaeecKjMHizSaTWwVtn7vW+WQj6nex/wDUyQT/epWkyQ59HHFzJSaxAUDC62FCo9/OKXV+lddzxIT890kqSD9XxcYvnm8Qey13vfIKOjQ7TVZQ17TfbcbWe57+779ZhTf07QuxKeWhqR44/X3MBO26+H2g4Sljjvlz9j0VCb3ulFrFWipE1fr+OM07/E6zZeS4ZHFuCJh2qHwAhfOnAfufWOB/XiK/9BpVoll/N4bN5Crr/xDvZ89w6062OZg+GWWo0qFgnSGol2lnDCl/bjs598t3gmJo5jfH9DUI96vQYEL+RYfxFqCsYQd1q8+fWbyZnfPVL33v9Ymk2PsGhIHBx14vnkciU98FO7Sn14BCMe6rln7riTtDvV84qsutkHBY3VIxBRp5Msohevr2A8VnAOCpVBIRI8Tdkxz6d3TjRtqrGqE92TmpXTy5XiC5OnGO/QVQEjdDodXrXGgJx+4kE4AyNLhsDkEPw0CjHgeSHgsed73sQ5F1yMc4VsyTmwHvfMmZ+aedWlOyInOjqzfg4XkER1Tvzap9l91zfI0NA8jPEQEZzr4IngLPz+qpsIcnnEKp7JMTY8yif2eRM7vn4LWbjwSYIgj81qO3HSIeqMstuur+dnv/0TzjmM54CAG295gHgfKBZ87n9krl73z/solHJgY0RKdFp1PrPfB1hzdj+LFy3B5MLscIVmvUV1ep5d3/Za/nnrj1CZTuiE4UbMjXfey46v2/hpPAYPTwPa9SV85ej92XePt8nI0DxEsnttxRmzyEzR2prsrEbAuDQVF+a9tKkKyTasLuVY+TjyuRy+pnl+J+BlnbwrGnTv+R5jo3U+9L7tOf2Eg6TTaDI8NIrnC84J0hhlpzduxsD3q4w2LL6fUTI9w9DwGJ2og4fBGGFxo6O1dsw4e1ERjHhssNaaqIvB91EvQgiJE2FWf6+stVq//vOWOjnfww/yDA2PMffxJbr6zJWk1W4A+bR/SZ7/LjWeT61eZ5ftNuf8078kHh2Ghkbx/QDnwNWGeP1WG8paq07XB+aOUgjSArhnlKFag3orYWahQEfaRE656Mq/k5g8VhR8n+bYGLu8cUt2f+frZXjRXDQo4gjwVbFWaNVr7Pbm13P6eZfSSCDvAzmPG+98gFrLUSz4LFpU4+pr/kWuUECtw5iQ0cYIn/3oO9lm47Vl4cKF+GGeeJxi3mkR5pu8fdft+d3VN6Tv10Bk4cbb7mXvd20/NZk+ZY0o6gSCgNrIIr64//s5eP93y9jIcOqrGgGNUBU874Vrzr4wo5CdlsYz1IYXssv2m8lZ3zlcP3bAMTTaJcJ8jrDH4/DjT6WQN7r/vrvKyOhCjOafcbGkXY2gJk/v4NqIERFRjGZaAvI0UcCzSR8tlUaSKYet4FyMTSLUM5OKCs+FeZQNw0nP1nTYio7PzsHhealcgOrzpb+aie7xtNjn4xzYRhNrFd8TwlxMkC8hEjLabvPoE4t00W0PccNdDxIWCySRMiH3ZIQlYw2cTdeXewqSpCch9bER3rzj5nxg9x2lNrwY38tPMn5EKZV8br/rCX3ggXmEBT9tGLMQ5j323v2dhAQMTusBz5v0hlwZjMfWG71KBqf16uLRDjnPx/NzPPjoXJr1Bv09ZW6+9RYWDQ1RqZRRNURxjVVWKfOe3XYQjDB9xrSlr9iVwOTZ9jWvJpfzsc7iiwHxmfPgY08b/Rkj1OpjbLf1q/nonm+TsdEnMF6YcvzTfvSMZfZUIWi6cBwezqWRlk4MSJqyfQxEqiTOgRrEeXjO4WUSjytsnwGsdWy23noY4+hEEX4YpmvLpLTGnp6K9Pb26PDoCMbPpCJEiJKYOInwxxl9moBaPAwT+h9is79XVCyBDdL4x8SoSWd9SKpPku5RtbQ6HdRzqEkQl0O99gslumMTy3rrrE654DE01MEPCoims1TUKdWSz4yBCvc8PEo5VGL18CQmcTHtOFakKF4u4IkFC7n9rvvxCzmSVGsAdcpe730D+SBPvncAgilpYlUQw7obvVpmz15Z75yzhIInBEHA43OXMLJkjFVWrnL3TffqY3MXEOZSdlySWHorRT7w3rfjETA4vS/rBs+cWFsCz/C6zdamr1ygbR2B72E8nzkPP0E7jlOBQPWmNLRl1+QZmu0GG7xqJgd+cg9p1UdxRvDG09vyQvqqXsyawpQ0jvgB9eFh3vnmraX17S/qJz73TeJOmbAgkO/l0C+fTa7g6Ufev7OMjowhXpBRQt3TF3JV0DgLoUVJ0OWLxstah+doFMZ/j2QKr0rG2c/kDZ6ruyOqE4Ytm6k18T+jhnq9gXVuQl/lueuU6DKGWbDOIiamXMljXcijTwzrH//0V269cw5PzB/l4UeeYP6C+dTaSrHSi5FkkgBrhCSJ0vkVrNgISpbL9jzlIx/YGeMnOBWCVGEppfyqQ4KQBx59klq9Qb63BFZRTSgVQs7/5cVcctkfNVGwxmA0S6e4EENMvZ3QShTxUo0h8Qwj9SaddhN6ZnD/nMdxiUXEpPIbKILPN757vuZESRCscRPaM+KE0PN5bN4woaSGRI0D8RkdbuDicf2o5UehCYBrs9cH3k5PEUaH01kAK85NylKbOH1WBufFqZZRkiAZ425Zw2GMwUQRxrbSJympSq6OD7ZXWeaVZ+vfONo2SiM4b0pPT2ap/FyecqGMumEQg7rUEYnjmNgmFMICahP6yp7k8p42xxTPz5rQrOXheYsQ42Ocy+i2DuMZRmsxj82vQSg4SRAXIEYolnLg3EQBWSYGcurzO6yy224nNo38vCB9pxN8wDQdViyVcRqnEZhk0X6cEMcxjgQ/zPHE3Ed0aPEwQVBO2XvOUSyVuPjKG7j1X/eoS1xaf1jq96fihsO1McIgPQqM+LSaEfVaU5Hpct9Dj9FstygXw9S2akIx5/HDsy+kmPfUqskY9Da1tc7HeDGLR2Mc/iT7zBhqI03ijkW9lPJsljm41BOSdpM93/1uZk0vMDJUwwTepNTui4gXp08BcOIjIYyOLOEDb99eOu1IP/35b2G1hzAM6eQjDjziNPJ+WT+4+w4yOrIIzHju9BkOwClCSCJpcU40y83qi2Ulx01TKoPgJKN+YlD33EoK43o5xXxI4HmZn5DmocQoY7UxrM3qFfoiqC8lEaVigY4EXP7Xe/TMcy7mtnseYeH8IdqdmCCXJ8wX8HP9VIseSRxl1FaZyFo26k2cTQ+vFbi/WV+EI58vssrgDEyStRhOlWxI+4SZv2SIxOmECJwnSuLgjJ9fCc5CpnmUemQ2lVjQCBAq1f60Pukcvgi1VkSn1QFxzF80lHnqFlTx/IBFQw2+/cPfIs6geOBNGWPpPNAI4/uUK9NwRFhSwb7aWJ04thMNe8s6Ik6VfJBn1Rn9qI3wNHwWK2xKWsjzaLSabLvxanz7uIOIk04mbmaWiSbSNRAGQjlvibGoSXsAntqPyVJVE+KGS9+DiEyhUq+gFyLTTIrjmBmzprP2mmtz7T/uIMzlUTXk/B6uuOJvfO6ju1Ms5onaHcBSqszi0ssu18cen09QrSKuTRI7Bvr6mDlzkDjpMK4BN0ng0Oe5G7PHY8ZF+BwrHFqkTDK6pijPSdpVhmeERYtrtCNHLjTgbHrAm5ALfnstGiXjyolLS+5nIo/lniq+76GaYKRAu22p19pAyJOLhnFqEE0ZU554jHUsp513+dKHtbhsT4XpOhePnmpvSme1ihGfRj0iasV4BbMMOzNFkICvHrNXmpX2ND2txtPLxCikByngh4yOLObDu+8knWakX/zK94g7FYKiR9QpcMAXT8YPfd3jHVvJ6MgSxBSe06ANUUcnMni6jCLqi1NcmKJcmfUiKfiewRj3HAyDYJOEmQP9lIpFWh0lMGm84IUBC+bXGR6q0z+tTBzHz/v6NWueKearPPj4qB518plcdOnfwQpB0ZDvz5PTHuJGRKNTx7RiQl/wCpUpKbPxPeCe5VtQEmtBAqxpTfEIx/1kw9BIHYeHp4Y4+wsnlt7pM9P6g7o0SphYPSaLGCB2WdwhglFL3s8hno8jYWi0kR5oOqm06vke02bMADHL0XbFpRP/rMSoc3gqGGPwfQj83NNEqOOHrsmE5jysiZ/zhLBEHcVygS02WkuSeAwRf/mwNas1WOsRt8dIAKOWZzO1bcXrMRVhXFEEJMtExYlVSrkcH9ljR66/4V8446NxQrEY8veb5vCl48/Wg/ffQ8pZw9qV196qR337XEwQoiSI79MaGWWrnV7L6itPk6g+hmdyL5rf+kK3tWZpwNHhOjYRJMuNpg1lMdN6+zCSS43KiggwCs7FOBQfD3UegQ9ko0WHR+uAj6c6qbpgDH2Ds7JVbbNnrVmazUt1rlyaLnSSivB5NiIIPTCKyWzfsskDzdRV1Vp4iaXVXxSjME6vk/HmHC9HfWiYT+z9DqlWS/rJg75B3O7Bz+dod5p89P+Ood36vO6zx5tkZGQx/rNYSM4phUKOO+c8qfv+3zHYxCAeJLIi2d0XeDPZ/QTGo7GkwcEH7cmnP/wuGR0dwvOeRYHYKEmSMGOgTwan9ehDjy0hHwY4ZwlyIXOfXMKdcx7WnVbaSKIoAeNnBunZRzwiilpLoVTh5tsf1j0/fgSPLGxSrg6Qo431LSOjbQIbs96aA8yavSpbbbwBvb29nPT9XzDWdATeeGFUnkUxfVLKWo3LctQOJ15W/5kcJqMuYWLamCRoxuwaW7wAZ1227NwyEr+TkssT8ymbbbz+HOVSkUQjROyEZ5yltHFWWTJ/UcoBnar1MvWzxz/Teng+2OFR8vmNCPO5VBRwuQM4W9Ga1odSNpA++6NKhZRqZ9KiZbNJJ2ovJ7uwbBbdmCDT1tPU21aesmCWNhjKZGE6u0eHwYlLu42nTHZbKorJ2EDieTTG6uz1njfIlX++UX/6yyuZNjgDayPy5V6+f+5F/PqSP+js2avSqtd56LHFRDYkF+ZxorQ6CdUenwM/uTtGWzixODET6dMXgwAikhrliYFaz+r5Z+cQ4xpi6fMyOkn4QLzUeUmGp/DT3fL5ZpkULaQT4U0vU+krA3ZKc2s6f93gwAmjC+amTYMmWN5yLzt72/NgbBTvVdMplPJErdYyEVa6j6yMkxVSiyHPmBf/DxuFqUvOjD8Ez6e2ZDEfeOfrpBW19TNfOB1nSoS5HAken/3iaeRzge7xztfL8PAwvpebUtJ8Cg9IBDoxj80dop0EGONIDFmH6Iv/cMQP6SxezJLGCGJi0nEo5lkcn0LHJvT397LBOrOZ88ATkMul7AADY+2IK6/7BzvvuDmitazr8pm8wow4OyFB7PA9Q72lfOGo7/Lowha9/YO4ToQK1EYcO2y2IR/da0fe8qbXSKW3QsELeHzuAr515s9UX5AeuU5SL5f7DMvAYC+py+MmNrdNlH32eAurzazQ6TiMWdFGnmoThE4UseZqMymGBk89Zk7vz8Qb076ARCPKJZ+P7Lkb+ZKPtRC65TP942UbFcF40GpGvHbr9bCu9RRTkHVF59PzcpUEwZjUY53azPVsEpnP1Zd+Ou7FU8HiSDp1TjzqE9JpJ3rFn2/FKwT4KgTl6SysN5l35+Mgjlw+R159nBWiZgRJjRNP/Dxbb7q21MbGHaYkO8RfzJNFnt95JAZnLdMH+jIpmcmDPum0ee8u27DeOjOJOlHaGSxu6RLilEWkxtBJYLCvh75yTlCYMdg3KW8uDqcWIz4f2/sdDPZXSOIofeNZmm98LU7aacEYodPusOF6a6S1tHEqMlMdpqUzGC/1tMWXbBaeM0DoMzY8ykfe+1ZptSP9/JGn4XQ6YZCjA3ziC98kDPP6rrduJaMjQ3jm6fK2MlEUxQvxVPBNkkkMy3IaRs9ccZYVLLqlf875Cr6mzAxCVM2zeiGCISHCDxzbb7sxF11yHSoeKjFiE3KlCr+74no+8/E9mV0p0UxiZKkIZOlrdE7xPYPv+7Q7HYzxcM5RqfZw6aXX6w23PUhfdTq23cL3DLV6iz3e8Tp+cOIBUi2HtBoNGvUxAk8YqzfVaYDJptu9qEY0G9o+ODgtpUdm8689k6PRHONdb9uWd+78ekHjbDqfPl3lP4ujE8aGhymYPLMGp6POpfpUAk49oiTh0x/dg3VWnyUQPUXaZcogKGKggE3atBq1dD39G/HMHAj9t16MwSeOHAMzqqy25mxaV99KxROiRpP2mMXPGULPERuPdrNBJ0prQq9afYDjjjiId+68pYzVahhTwHMxmATHy2MaoADWxgwMVsnlA1wmky/Go9lust22G3PAfu8WtAVSGA8nn/64VMvI6HxwyoyZ0xBPJyI3JE/UarLXe3dm+602lrR+4D+FoztVndngXEytMQQSTLkG4T8xg/0lMwoT3pmXZ3RkiE/vvZtErUgPPfpsTKWfMAdR2+fjB51ErvBlfesb1pfhkVECUwAcugIlVFXF+D6DAxXaLsAzCRaD7wTFpnnsjGs/zq6bSlRaoUmYUqee6l0awDM+NU3oCYppkVCe7WJXPAKSVsLOr30NM2cUWdJoTcgO5PMBDz08wiln/Fq/fdT+wtBCREy6YNXDqMtYNIpNHMV8jlqtweMjTV1jzUFptdoYNTgD191wJy7xU9Eto7STmJkzihx7+Icohh6jS0aQMIePB16MEiIuANov/usXIYoS1l1jNoPVIqOtAD+waeAvCb+56DLevsNrqI3MR4I8SoBKghOb5vvVI5H0GRkShACDQ43gEp8N1l0VrwAWH6FBziswNrSYX192BYd84v2MDS1BQoM4mZiANc7gUQGbDSwRGngiBDLu2b4E0LRPwYnDioc4bzl9xaUml2UFbzNR2zEvvVOoacdvuafC1065UL/1/Z/S0zdIsz7GJuuuwZqrzuDeBx8jTlKp9lzeY+XpVd73ttfz5p22lenTS9TroxhJ51Fb8V4eE6Ulras4I2hHWWulARmcNU0fmTtGOdSsIzzHr3//J/Z5/07YaAhripn8pl3q0BYsqknm6qXrUSQgcTEbrL0yPYWAtgvwJUKNTytu85vfXc7rNlub0aEFmLCI4qOSZHRdD6OClSAVs8vUXEUEzxsnIhcmpif+J2aw+y/xu0n/zzM0h5Zw4H7vl1bH6ldOOItCZZAgB2PtJh894Ch+ccYxusNr15ex4cUYP5dxdadkXI0himLWWLlPrjj/pFQeQlLGitps1KtPKsGdkRWXHcz3bOKEKSSwlOqpVsvFQBqN8fD4WVhvSbPo7VabdV41KLvu/EY94/w/UphWIbGCswmF3io//PHvWG/12fqJfd8ljeYSOnE6MS1w2YgwUarVKsP1Bvt/+VS9887HueTCE1hlWpF2o03kEhYuXIJn/DREFY9Os806a63L7P5BadbamKCYKrbGMX4xh+ZrJK6BELzoXogYiDoxa666smzy6lX06r8/Si700SSmVKpy6dX/4h+3Paiv23JNGRpeQuB5iIRoFrobIkJtk8vlsOSIkzQSdC5NJW224Xoye2CmLlxsCfOCkuDni5x3wdXsufvbWaWap1XvgB9mHppgRTOGl6WcL2OTGGvTed3WvZSLf9w5iPC1jRIRS4jgTaRYXSa3YJRU+VYFJyFgJ+neLyGcOkrFPLfc/rCefvpvKVamoS6imDOceOx+vGGrDWXRWAfaFiOOXCEgyAWEamhHEbVaLd0TqkslFV8uEIEotgwO9LP1pmvzwAPXIrkKzllKxRL/uPkerrrmVt19121kaGg+gRdMjrhVEJvK+gVBEc9L5T9E/Ezttc2r115D1ltztt58zyJyRUkH7JSq/Or317Pf3u/XjdYelJHRdJ1DPlPKdSAOX9sE+RxW036MSV0Z96xIBi8l/i2/XRDUE5qji/ji/71fDj9oT5qjS1J9mGLAUMOw9/5f5++3PKKVvunZQzIrzquHPjNmVFhpsMBKgyVmTcsze3Yv06b1UCg4Vlq5wowZBWbNzDNzRoFZMwrMmpn+c+K/s3+fmf3dzJmTfzdz5uQ/VxoMWXWwLJVSLm1AesqJTivkPYBxJHGdj394N2ZNK2QUyPEFm2CCXr7w1R9w2DGnaK2dUC0X6akUKffmKPR4eJUSV/z9bn37Xl/RC6+4i7vnDvPpL3xLmzbECwPEacYa0onnEwQ+8+YvZLTVotrnY0ybMEyoTCsxf0w55uvnMTaWzsrVF3lgugi4RCkXAnZ76w6QNFLvSx2BF1Dr+Bxw5Mnc88iQ9kybTb5QIPCU0GuTCy1hOU+lb4DH5jX04SfqGgZ+RgU0RFGD1VcZZOftNqHdGMKYkFgtQSHkoQdGOOSw03QsNhSnVfHyIEEHE0QUQktv0dBTqXDfnMd0qNZJG4bGpcpfqqHxmgoWInnwS/h+ibzJUZCA0ISEJiRnQvKSI/RymCDA5nMkoZ8Wqf8NDrc6R5DLcdkf/8HQcI18zqMTKwPVlVhvzTXEtkfI25hCwZErKM41aTWHGK2PEUVtUMUmqRLryyJCWGHNJDW873nrduSMTeOA8cE7fpkjjv0e/7jtEe3vX5lcvoRnAgwevu+RLxsq/T0sHK1z7yNzNcyFaS+GpAd5X2+FXd+8La49nMppW6Hg5Vk0ZPncYd/gkUVNqtNWIZfPEfgO33P4OSFXylPum86Dj43qvAUN9f10Zvx/MmX0b4sUUqc5vUFrUnllOzbMlw7aVzqtSL9x2oX09M2gWAyZPzrGXp88hgvPPlo332i2jAzX8D1/uTSSA+I4QhBiVUI/RCTPZw89Ud/3ntez845bS7Nex7zQXPGExLFmLIgpzIdnajbTbMi28Wg2YbMN1pDPHvAuPewrP6ZnIC2WeknKaEgKBU4+4/f87rJ/6DZbbcBGG7yKfMFn3rwh/vbPW7j1jgdptD16ygWcOK68Zg5fOPr7etKRH5aKCeif1ofVcYmOhHwYMuehJznka2fqYQfsQW8hkChJuOW+OXrcN8/gtrueoFSdgbo6K+S+vaB3LYhvaDbG2H23HeXMn/5B73hgHpVyGZd0KOfz3H3fQt7xwYM45IC9dMdtN6G3lBc/EEZrHZYMN/UPl/+NM87+Da9//bb85HuHEEeLJ9Kv1tbZf9+38ts/XE0zjvFNiMSWUrnM7668gcc+MF8PPXBfNl5nZarFvBjjGKs3mLdoTH964VX87FeX8vmDP6Zf/syeEg3NTyPSl8Cz1ezALeVC7rj7SbZ/1+fUuPGeFF1qTnTavMlE74CNm5xyzGfZcrMNpV6rvaQHhEh6nY8tXoR6ArZDGHrMXbSACy68Sj+651vEz4VpmjuLvSVLqQSegMkBDht1aHWiVEvLjM9nNrjxe/23Bw+p1+0pqYR9fZQ3b7+FbP+6zfSP197BtL4eoigmCA2PLmrw7n0O5aD936e77rwNlUpZwjCkVWsxMtbWq6+9iu/98AJWX2WAi39yIp5JE5tGDFGzxp7v20XOu+AKfXRxjUI+jyZNKqUcf7vlEd72/s/r4Qd+iG03W5eecijGM4y1IhYuqutFf/gLPzrvYvZ4zy6cdvxniEYWkiqmuP/EA/v3GoXlFiGGqDnKsYd/Qjqx6vfPuoR8Tz+FnhJPLBzmQx8/hvPP+rJuuv6g1EciAi9IWQHjrWVq8SXlgIdBjlACPn/kKXrur67gI3vvQuA6GNEJls4LvuApgTH6bFf4ODkznbjVGBvi/z76brn3nsf03F/8hcrgIEoHdaloWr63h4cW1rnv13/B/OYvKd3UpRo7uVJIqQoSpWqrQT7Pby++hk9/cBfdbON+2Wrz9TjrZ3/MurAVq0qu1MsFv72Wiy/7K6vMmqGjow3mLW5gQku1t0y9OUo+F7541MFlbj2JYwZ6e/nq4fuz5/5fpm0tgW9IbINCOce8RR3+7/Dv0lvKs/rs2Zor5FmwaAkLFi6iHUdIrsIlV97An/92h+74uvWlNjqG8Q3NZoNNN1pLDj5gLz3y2B9R7ZuFemBdQrFc5ba7HmfPjx3F9N4iq648SxFh7rxFLBodpeMUYwqcff7v2PMdb9RVB4oSdZKXZP+Ni8NrIIw2O9x4x2MsvZLMckbEg3Q8aNKm1gLPvPRBfKrm4NHbU8Kpl9qlOMbLGQ478Sx+/JsrdZ1116JUyGWsr4zsoY6eSpnpgz3MmN7Dq1dfmXXXXU0qpTytRi2byUyWz/1PIhtGpZAPhGMO24/b7z6MoZolXzSQRBRzIaOtmCOO/xFf/86PWXX2LK1UKixePMSTC4dotZsEfpXH5z/Ery+/Tvfe/Y0yNjyG8/O0oxarr9zPEYd+io8dfAyxhgSewbo2xVKRR+aOst+BJ9JXLbLa7JU08APmL1zMwkWLadsEwgq/+t1f+Oheu+jGr54prVr8HzcI/1ajMJFHFYNTxdZH+PZXD5CeUkGP++75FPpWplipMGfBYnb/0KFccNZJuuWWK0ltZAxfChMVfKMGZxUv8MHP8fEDT9Cf/PZaStMHUu34rJ7wUngeU7n6z6WwYhGCtuX0Ew+WUqWop59zGYVy2umNjTG2TSn0IKwydVCL4uEsaCy4IKQ+soRZvcqPTvsaG6y3ttTri3j7m7eWjdafrbffP49SpQJJB6NtCqWQxML9jy/B+AnlvhDbrtIZa7Lm6jN4cuGiiQKXPINdlBXwJZ72XRuP5tgIu+24uZx63EF64CGnEpsQvxoSJy3CIE+Q66dlLXc+MB+LI/AMvt9DOZ9AmGN0qMNhR5/MFRd+h4JvSBSMKVAbG+ULn95daiMjeuIpv6LY15POh7AJxZKP0wLDLcfiex5F1OD5AfmgSs43eH6BRx6exzHfOJUfnfxlaCXpSbzM/Y2XGOU5rqPJn0vTh+Ig8CEXlJYywEvXC8xExCAKbWuQQFdIb596XfKsWHBL38eyP2HEYKM2u+3yOn549sW02gmhl09Ln4UqdzywiFvufiKTBkn3gHFpA5i6VAlWfEM1n2ODV83Srx7xYd6w3XrSHmulmjzqL90s/AxXLstc8XNxwZZ+NlPNgsNISLPeYOuN1pJzvnuY7vOZoxhu+BTLVWLXwfNDSkFIYi33PjKEc4vxPEMYhBR7fDzPp9H0OfLrP2L7LddjxsA0WjYh8DyaI8Ps867tZcniT+thR50BhSpeGWzSJJ/L4/J9NKKE2+97Im1L8D2CXJWqJ9gwZOHCMQ475jv85ryvY0za+T/1eTzd+3tF1xTGbfZ4k5NBcCI0a4v40hc+LAd+anfqQwux6lMuF5g/ErP3J4/htrse10q1hySJM555KvblGUMQ9vC5I7+l5//uWnqmr5R1+nmp1MGLHnILz48FTuYXeiQKLm7wraP3l+8c+1kqoTK6eAjXDhEto8agJh0HqEZRsglo4oiiiJHFC9h6k1X41TknsNP260u7NUriDP09RY474uOUwoRmo47xAkIxGDWEvqGUzxF6JeqjMbY5zDFHfJCvfekjxK0miZi0EDu1NUtlaa9WQZ3PlJlQE8vVZA1WU5XMRdNBKZ7nUR9dxEfet4Oce/rBzOzzqS1soTaPmtRXzvk+pZJPpVQgzIdp30nkqC2aT16bbLbxhnSiCDUywSQTEVqNJRx12H5y/Jc+jrFtGiO19HO1gCdCPvApl4qUynly+TQFaNsRw4vm099f4VVrr0Gr007HRmbjD1FNB6RLepA4Ug6/TtWmkqfOF42LfKSix+ND7RWnjsQmxM4Ra/qVOCWxSuKUyFkiZ4mdI3GQ2EmSwTih3cm4Q5XOI3EoTpfueZjSFTKlkK1ZCieVXrbqjU9/TqNuozRbLbbe5FVyxBc+hC9+psnjCHCUiwH9PSWmVfqZVu5jWqWX3t4y1el5qgMFegarlPuL2JzHTXct4n0fPoY/XH23Fio9xOOPzQlJxrEZv8bJZkfNJiCmRXZVg8NhxWEzZeHJhk5lKX2nbK2OF7fTe7XpzzNVZypjdXk+tdFh3rLDpvKLHx3L+qtNZ2zxvGzamUE9ix8IpUJAtZyjmA/xtIB2itSGIpJWnS03fTWxRRUPb1wKxjPURxdy0MfeLmee/Bl6CpaxRR00CVFN1W5zgUelmKdcLpDPh2AMUZRQW/QE5YKy3gbr0m7HGUt7UkdLsVhRrDicuCnP46WtOvxH4jsnkg1XUbQxwnGHfUrarVi/d84l9PXNpFTyeWjJIj708a/z63OO0XXWHpTGWANj/LR+W8pz8JdP1R/99K/09s0AZ4k7HZIk4WVEfljaJIqgKiT1YT73kZ1kh23X0XN+8gcuuuQGltRqNJtR6lllM7xQ8EUJcpaVZ/fyqb325UPv3UWm9/gM14bwvDxGfZpjDXZ53aZywWlf1c8ddSqPPL6EloXE+OkRZRTfBLxu83X44uffy1u321bu+NcDWinmaFqHEZ/A2bRVP2uuSmXNLKmJTRDi1Jhrgpi0QJse/k/t9XU8gxhDbWSM3d+6tay//sp6+lmXc+El1zJar9NJlGV5wjnfoycf8o5dt2XfD7yHHV63ocRJExtpKrk+0QUd0m7U+Pz/vUe223Y9/e73L+Dy626n3hJc7CZ8TsVhMASBYaAv4BMf3JkP7b4rm2y8hjTqIyljy2XzdsXiEWOcZpnCBMGlm3+8nrRCocDxDUw6zEYl1XwaP56ebsqqZm1eknYZG7V4RFMcm7RRz6BpD4BahIytRGdK/nl8nCx46rJpeekMcqMuq40JATGBs5m5SBV8sQ5fHe9/z5vkpxdep3MefZx8LsdorYNgEeMjtCcMkEoqxR6GBbxM3l5QCj15GjWfY078Edtu+S3KoSF2CZ7G+BqBhgg27frFYsXgGC/4h6kEDFE6xlQdIh6ejpsSs8K4wUo6f8JXm0ntaKqimsmEyMT7yTxt36c+MswbX7OeXPqLEzjj3Iv0/AuuYtFIm5ZrZL/bz1JrjpwvlHMeb9x+Pfb90DvZ+Q2bii9tolYnU1tJaeEYoT5a48N77CQbbbKWnvbDy/n9Fdcz3GiQ2EzET0xm/Bz5IEdPKeD9b38T++7xLrbdej2JWmMkbnzGeNqc6eHIHnc6aEeTCavwUh5zUhsbyvKF/+ZC0ETh2BGIww/LfObwk/Wcn/6ZnmnTcX6HxnCL9dYe5FfnncRaM8tSr9ep9M7g0ON+qN/8wa/o6Z1BQMxIPWLdNapccu7RstJgH53YvdTyIM/7vg0JiYsplkqohMyfP8wdd96r1/zjbu6eM5ckThuwcgWP9ddZkze+dks2XW91GRyo0G41iaMI4weTzZmaqpCWiyWeGGlz6VV/06uu/ivDdcUnYc3VV+Jdb92BbTdfV0qlPPVaA1WfRx+dq5G6dAJbklCq5Fl15UFRZ0nEkBOYt3CMxcNDavwc4tJDy4lh1dnTpFTIYd3T9ZtOecc2oVDMIcbn0blDet0/7uCav/+dJxaOogQYY1l1oI/tt9mCbbfchNkr90o+DKjXRrLmsiA9jMYNrKYNQYmLqZSrdGLHgw8/qlf+7Sauu/E+6rUm6oTQhzXWWIkdX7cFW2y8rqw82IdgqTeaGBNkm1/wAli8cJSFi8fU8yWTFbBgHavOHpRSOY+z8pQaXUagbRMeeXSROmfTkbNZr8yzL00bRB0JsPrKM6RUyuOSBN83jNTaPP7kEhVPM2VhSJKEgRn9MrO3hygbBiVZU05aW0p47LEl2oki8BSjAYlVwhDWWHW6iClgk4hKscAddz+he3/uKB6c18LkDEmUsOX6a5CXiKFGDMbLlF9TeZVGO+aJuSNEkaNQzKfy25KgXkDSqnPhj45ll+1fLWO1Dk8+MaSNTiubH+JQ5/DDgLVmD4p4qbS6b4RGK+LRufOUTJ4ibTxT+vsqzBrskzgTwJw6tVGM8NgTi7RR7+AbsCZNu3kirLHKoIRhOnthatrOd4bExYT5kDAIeHz+KH+/9V698q/XM/fxRalBFmGwv5cdttyA7bbdnFVX6ZNSMaAx1kgNkZiluo3HnYMkSSiV86gKjzw+pH/522389R83MX9oFCcBvoE1Zk3nDa/dkq02f7WsNKuH0Mun63yieVXxTMjw8AiPLxzW0EujJ0FwVll5Vr/0VUskVp+mAfQVaRSmvigBFxOaEOcX+cQhX9ef/vpv9PYPgukwOtJmy1evxq/OOVJWmz2Dr554lh57ygWUe6fjG6VRT1htIM8vz/ka668zQ9rNZiY89nKG4DJV0HxYIOeXstpDOigjbdJLvT2cI+l06HQsYsyKpZ4B5yx+GBLkCqkYl42zBZbWcFrtNnE2blEEirn8lDF4DquWTideKk0WBkGmEMlE7UFJewastc+pruKyEZOFnBAEaee6VbCaDnvxM8/YJpZmJ86ULJ8pFShY59KUUS7E87Poc1xh1HhIJsAXdzpEcSeT0Fi+CTHwPYLAn8hma1aJbUdRKnP+LDgJuVw6J2RqnWYpuY2nDBomdW6cKlEUp9o54+G876X1J9WJrnEF4iQhiZNlBNImytwUcrl0CNBEYVlxztFO2jgXEHhKrRbz1vcfov96YAG9fdMYHV3AB3bdhnNOPVq8qEHDZmqsEzVBZbQVcce/HtbjTj6bm+97nGKYw6nieR5jo6P88MT/46N77SQjI00qhWIqipsZLFWHqqZpQZ1ahxJyYZg+/3GZcRGiOCaOk6d8/7kwwEjaxzSulOrUEXWiNOLVFXfNqzpQS5jL4Yc5EA/nYnw1OOfwfB9VwdqYdqeFc3HmSDzVQZxpIDkwklDI+Xh+mEnKC1YFT8CTtGs6ThztToRTWZ5UoErgB/iBP0lhz6LRThRj7Ut7Xr8MTs80NeCSNj6O00/8nLSbsf76D7fQO9BLtdfjprvv5hMHf1O33mxzjv/erylWpxMotGp1Bqf18osfHsWm686Q0foY4uV5mVKml75n44Ea2p2IdjuaKCippGQ+oxaXBdwYH+MJTydFbIyHjSNcp5EOyjFZoTrjy4sxeGaSUltvtpc6skRYZuCP0Ili2p3lGRHGMCH7/Swt/4TWUTO2EDUnUh2K4MTLcuTp53pZd/czv0jN7klodiJo64Q3n3aHO4xzaS7e81IZ5qdw36M4oRMlyxAJNDXEz5LJ01zmmT6X9TDVGItI9nzT+0gSSxQ1WXpuA1kXvKzgs9IEWqvdWeZMlIm1JzamVK3y/fN+o7fdO5e+gZloFFEuhHz6I+9N51t0WpggSLt6s5/2VOnPWd6+02aibh997ye+ipKbMDqY1IiN336z1V5mrFB6U8uyA51TGs0WS9MaUofi6ZiErU6UUX2nSpmkmkJPPfo301ETnyiyJJ1RIAEt0pHxFdTGkc5oF/HT1DU20zqSp4yMjQHFp95R6HSyzvx0RouTNOWEehhJJ9x5smIPI0osnThezrUYXxv/1UYhVRr0SPwckbOExuOMbx8qUXKUXnrFbfRNm0lPTz9/uekhrr7hAYrlXgJPaDVq9FVCfvn9Q9l809VkeGgIP8jxwoTe/p12wUx4SFOHvkuWCXf4WbpJU/30Z3PIGIOaPJaUJeKMjickl7MnxsgyG3DF2vsiK8pg6vNufPPwlmr3cJJehzdZqX5eRt2IpCJ8Mtn4pUDi+ROlSPCeOtm11L0+P1LB8s/0uRiF5dNuU/f+pMf/7A3O5D2x1HWJCoEmJC7i5jvuR3IhRlvEavFLZaZPn4aNYxL1CBJQ8bP56GBFcbFSJkl7ENTPyAmptHwYhMycORPN8jZmKn3tGa596Xt8Du99qUNy6cjomZ+R4owPGk6MEB1fnJ76mRGLJ/esPjvWlz9hXIKsmJ4+dyOASWsLzxR5TnRXPxeF3lcS++jpLyE9CDzj00kc5VA56+Qj5G1v2oKxkSEgJMiHlEs5cqI0mhH9PQXO+96X2HbLdWV0eBjfL2RdpK8Ag7CcYTSI+ojLpVPI1M+0e2zqwUjyLD9HJseHZvLJnks12pdWTdAVfD3TofVsv/cZE2dpATOd0IzRVO/HV4uPTQulzyPyGp9mLy6PuHy6ydVPR1yql/27PPvPel73qc/zi5f4upb5eclK2YllyWgHFYPFIYFPbbTBJVf+hVyhwLRqkVxg8L1U4dn3oVzw6Z/ez8NzRzj1rN9gJQDxMMbQbkWsv+bKbLbhutJox+m8bnkp71VfhLUpmYOWRdQuTL8meixkXGL3OXyiZjG+zajG6Rr3SNd4WhjXl/h9v6LTR5MPEgXjpYPoe/M5fnrmV2S/z56ov77sOqrTBhHrM9qOWakn4IIfHcPWm68hI8OLEb/w0skV/FuSSeOKfZOkvclowjwnr3XK6KGXJayYqaWGyT9/UbwgTeUCpnj8QhcrekqxGspBjjVnDyCxAmXUWnI5x9HHXcBDDyzU9757B2at1Me0UlUEIYkj5i9apNf960FO/cHPePzxFuViERVLS/LYeAlfPODzTOsrMjY2hG8Mr4RdKUvNQ05WELXJc97PugKl2EkN1pf3qvyPF5qX8yMlHWlCYgnDgHoSsvenjtDL/3oHQbmXat7ymx8cw3ZbrS3DY2N4fg7R/5Ld+rzmNb/ibvIp0iZd/NtMghg0MVQqPn+85hZ9z75fJSzNSGd1Sx3jfJqNOiHKqquuRrW/BChxFPHo408wNNahWCiSD/IICVESU6vV+Mrn9+YrB+4ljdookqXt/nchr9g1/jIzClOWrmRaPjnDaMPnA584Um+9/X4u/NHx7LT9RjIyPITnhd093kUXzxkGNEBpkC9VOOZb5+tJ3/o5XqEXvxIQquI8A4lg2wmddKgqxghhGOIHPuoc7VaLTrvBYDXPlw/+CJ/YZ1dpt2vPYu56F12j8DyNAoDamEKpxKNzF+iCJ+ax3TabS60+hnovkXZPF138T3ix4w2KEBZ6OO+nF+sp517E3Q8sIYksQT7EC71MpC1r6FNHlMQk7Ri8hFVXnsGOW2/IIfu/j/XWXUvq9bGJKWNddI3CS2AU0sUrCupsypkPQhrNekrnFHlF1xG66OI/u/NdVrNSjEQUyn0sWNLg4j/8Se+4fyEPPPQ4j82bn/aMuFTyvZDPM2twBuuttgrrrD6NnXfZhlevubIkrZhWp40nHs7wjMyaLrpG4UXxbNKmJDDdyLSLLl5EpBvKOUcgPsVKAYxQq9VZMlyn1UpUJEYE8rmi9PaW6anmAI92s00n6gAmm0G9rDpRF12j0EUXXbyC4VBrMar4nofxfcSYiT4a5xzWJsQ2QTXAmGBKI1XXEPy3wO8+gi66+F92Cycp0KIKvo9Tj0hBrUPtZEe7YDCaz7rIU+XV8Uj+v5811zUKXXTRxf8CdEoHcKYVJJkabSbcsJwR0RX8bBf/Pei+1S666GLCLHTRRdcodNFFF1100TUKXXTRRRdddI1CF1100UUXXaPQRRdddNFF1yh00UUXXXTRNQpddNFFF110jUIXXXTRRRddo9BFF1100UXXKHTRRRdddNE1Cl100UUXXbx0+H8X+q5Fb+8pQgAAAABJRU5ErkJggg==";

  const CESymbol = ({ size = 32 }) => (
    <img
      src={CE_SYMBOL_B64}
      alt="CareerEngineer 심볼"
      style={{ height: size, width: 'auto', flexShrink: 0, display: 'inline-block' }}
    />
  );

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
const _INTRO_FONT = '"Pretendard", -apple-system, BlinkMacSystemFont, system-ui, sans-serif';
const _INTRO_INK = '#0E2750';
const _INTRO_INK2 = '#1B3A6B';
const _INTRO_PAPER = '#F2F1EC';
const _INTRO_GOLD = '#C9A86A';
const _INTRO_MUTE = '#6E7A8F';

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
      작성 내용을 반드시 다운로드해 주세요. 페이지를 새로 고치거나 창을 닫으면 모든 내용이 즉시 삭제됩니다. 수시로 '저장하기' 버튼을 눌러 파일로 다운로드하시기 바랍니다.
    </p>
  </div>
);

const IntroFooterCopyright = () => (
  <p style={{ textAlign: 'center', fontSize: 13, color: _INTRO_MUTE, marginTop: 16, lineHeight: 1.6, padding: '0 16px' }}>
    © 2026 CareerEngineer. All Rights Reserved. 저작권법에 의하여 보호받는 저작물이므로 무단 전재와 무단 복제를 금합니다. 이 자료는 구매하신 분의 취업을 위한 개인 학습 용도로 자유롭게 활용하실 수 있으나, 자료의 전부 또는 일부를 다른 사람에게 공유하거나, 복제·재판매·재배포하는 것은 금지되어 있습니다. <strong>이를 위반할 경우 관련 법률에 따라 민·형사상 책임을 질 수 있습니다.</strong>
  </p>
);

const IntroStickyHeader = () => null;

const IntroPage = ({
  workbookKey, stepLabel, title, subtitle,
  flow, flowTitle, prerequisites,
  onStart, helpModal, extraContent, StepNavComponent,
}) => (
  <div style={{ minHeight: '100vh', background: _INTRO_PAPER, padding: 24, fontFamily: _INTRO_FONT, color: _INTRO_INK }}>
    {helpModal}
    <div style={{ maxWidth: 1350, width: '100%', margin: '0 auto' }}>
      <IntroStickyHeader workbookKey={workbookKey} stepLabel={stepLabel} StepNavComponent={StepNavComponent} />

      <div style={{ background: '#fff', borderRadius: 14, padding: 32, border: `1px solid ${_INTRO_MUTE}33`, marginBottom: 16 }}>
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

      <IntroFooterCopyright />
    </div>
  </div>
);
// ════════════════════════════════════════════════════════════


  // ══════════════════ 인트로 ══════════════════
      if (showIntro) return (
    <IntroPage
      workbookKey='careergoal'
      StepNavComponent={StepNavigatorDropdown}
      stepLabel='STEP 4 · 입사후 포부 작성'
      title='입사후 포부'
      subtitle='3라운드 체계적 작성으로 완성하는 입사후 포부 항목'
      flow={[
          { label: '1라운드', desc: '포부 핵심 — Q1 직무에서 진짜 중요한 것 / Q2 지금 나는 어디에 / Q3 무엇을 어떻게 준비·확장 / Q4 다음 단계와 큰 그림' },
          { label: '2라운드', desc: '약한 부분 보강 — 부족한 Q를 심화 질문으로 구체화' },
          { label: '3라운드', desc: '연결 및 완성 — 회사 비전·방향성과의 연결' },
        ]}
      flowTitle={'3라운드 작성 시스템'}
      prerequisites={[
          {
            text: '지원할 회사의 채용공고 및 회사 자료',
            recommend: {
              workbookId: 'job_analysis',
              condition: '회사·직무 분석이 필요하다면',
              linkLabel: '채용공고 분석 & 직무분석 가이드',
            },
          },
          { text: '회사의 비전·미션·중장기 전략 자료 (선택)' },
          {
            text: '현재 본인의 역량과 경험',
            recommend: {
              workbookId: 'experience',
              condition: '경험을 아직 정리하지 못했다면',
              linkLabel: '경험정리 가이드 워크북',
            },
          },
        ]}
      helpModal={<FirstVisitModal open={showHelp} onClose={() => setShowHelp(false)} title='입사후 포부 워크북 사용 안내' steps={[
          '<strong>1라운드 → 2라운드 → 3라운드</strong> 순서로 진행하세요.',
          '포부는 <strong>회사의 방향성</strong>과 <strong>본인의 역량</strong>이 만나는 지점에서 만들어집니다.',
          'Q1에서 <strong>직무상세내용 키워드를 직접 인용</strong>하고, Q4에서 회사 방향성과 연결하세요.',
          '3라운드 완료 후 <strong>최종 자소서 형태</strong>로 출력됩니다.',
        ]} />}
      onStart={() => { setShowIntro(false); }}
    />
  );

  // ══════════════════ 평가 ══════════════════
  if (currentPhase === 'evaluation') return (
    <div style={S.page}>
      <FocusStyles />
      <div style={S.container}>
        <div style={S.headerSticky}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: SPACING.base, flexWrap: 'wrap' }}>
            <CELockupA height={32} />
            <div style={{ position: 'relative', flex: 1, display: 'flex', justifyContent: 'center' }}>
              
              
            </div>
            <button onClick={() => window.__CE_RESET?.fn?.()} title="이 워크북 작성 내용을 모두 지우고 처음부터 다시 작성" style={{ background: 'transparent', color: '#C53030', border: '1px solid #C5303066', borderRadius: 10, padding: '0 14px', fontSize: 16, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', height: 40, display: 'inline-flex', alignItems: 'center', marginRight: 6 }}>삭제하고 다시 작성</button><button onClick={goHome} title="처음 페이지로 이동 (작성 내용 유지)" style={{ background: 'transparent', color: '#6E7A8F', border: '1px solid #6E7A8F66', borderRadius: 10, padding: '0 14px', fontSize: 16, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', height: 40, display: 'inline-flex', alignItems: 'center' }}>처음으로</button>
            
            
          </div>
        </div>

        <div style={S.cardLarge}>
          <p style={S.brandEyebrow}>CAREERENGINEER · 자소서 워크북 · 2라운드 진입</p>
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
                        <strong>내 답변:</strong> {step.questions && step.questions[0] && answers[step.questions[0].id]?.substring(0, 200) || '(답변 없음)'}
                        {step.questions && step.questions[0] && answers[step.questions[0].id]?.length > 200 && '...'}
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

        <p style={{ ...S.copyrightText, marginTop: SPACING.lg }}>© 2026 CareerEngineer. All Rights Reserved.</p>
      <StickyFooter />
      </div>
    </div>
  );

  // ══════════════════ 완성 ══════════════════
  if (currentPhase === 'completed') return (
    <div style={S.page}>
      <FocusStyles />
      <div style={S.container}>
        <div style={S.headerSticky}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: SPACING.base, flexWrap: 'wrap' }}>
            <CELockupA height={32} />
            <div style={{ position: 'relative', flex: 1, display: 'flex', justifyContent: 'center' }}>
              
              
            </div>
            <button onClick={() => window.__CE_RESET?.fn?.()} title="이 워크북 작성 내용을 모두 지우고 처음부터 다시 작성" style={{ background: 'transparent', color: '#C53030', border: '1px solid #C5303066', borderRadius: 10, padding: '0 14px', fontSize: 16, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', height: 40, display: 'inline-flex', alignItems: 'center', marginRight: 6 }}>삭제하고 다시 작성</button><button onClick={goHome} title="처음 페이지로 이동 (작성 내용 유지)" style={{ background: 'transparent', color: '#6E7A8F', border: '1px solid #6E7A8F66', borderRadius: 10, padding: '0 14px', fontSize: 16, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', height: 40, display: 'inline-flex', alignItems: 'center' }}>처음으로</button>
            
            
          </div>
        </div>

        <div style={S.cardLarge}>
          <div style={{ textAlign: 'center', marginBottom: SPACING.xl }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, background: COLORS.greenBg, borderRadius: RADIUS.pill, marginBottom: SPACING.base }}>
              </div>
            <h2 style={{ ...S.h2, textAlign: 'center', marginBottom: 4 }}>입사 후 포부 완성</h2>
            <p style={S.subtitle}>아래 내용을 확인하고 자유롭게 수정하세요</p>
          </div>

          <div style={{ ...S.boxNeutral, textAlign: 'center', marginBottom: SPACING.lg }}>
            <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0 }}>
              <strong>{basicInfo.position}</strong> / <strong>{basicInfo.company}</strong> / <strong>{basicInfo.industry}</strong>
            </p>
          </div>

          <div style={S.boxWarning}>
            <p style={{ ...labelStyle(COLORS.red), marginBottom: SPACING.sm }}>WARNING · 반드시 다운로드하세요</p>
            <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0, lineHeight: FONT.lineHeight.base }}>
              새로고침하면 <strong>모든 내용이 삭제</strong>됩니다. 아래 <strong>"워드 파일로 다운로드"</strong> 버튼을 눌러 저장하세요.
            </p>
          </div>

          <div style={{ background: COLORS.bgAlt, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.base, padding: SPACING.md, marginBottom: SPACING.lg }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.base }}>
              <h3 style={{ ...S.h3, display: 'flex', alignItems: 'center', gap: 8 }}>
                완성본 (수정 가능)
              </h3>
              <button onClick={() => setShowRawAnswers(!showRawAnswers)} style={S.btnText}>
                {showRawAnswers ? '원본 숨기기' : '원본 보기'}
              </button>
            </div>

            <div style={{ ...S.boxInfo, marginBottom: SPACING.md }}>
              <p style={{ ...labelStyle(COLORS.blue), marginBottom: SPACING.sm }}>INFO · 내 답변 활용 가이드</p>
              <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, marginTop: 0, marginBottom: SPACING.md }}>3라운드 연결 답변을 우선 사용. 없으면 각 Q 답변에서 핵심만 골라 연결하세요.</p>

              <div style={{ background: COLORS.bg, borderLeft: `3px solid ${COLORS.accent2}`, borderRadius: `0 ${RADIUS.sm}px ${RADIUS.sm}px 0`, padding: SPACING.base, marginBottom: SPACING.sm }}>
                <p style={{ fontSize: FONT.size.xs, fontWeight: FONT.weight.bold, color: COLORS.accent2, margin: 0, marginBottom: SPACING.sm }}>도입부 — 직무 핵심 이해 (Q1)</p>
                {answers.connect_q1 && (
                  <div style={{ background: COLORS.blueBg, borderRadius: RADIUS.sm, padding: SPACING.sm, marginBottom: 6 }}>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.blue, fontWeight: FONT.weight.semibold, margin: 0 }}>연결 Q1 (권장)</p>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.accent, margin: 0, marginTop: 4, lineHeight: FONT.lineHeight.base }}>{answers.connect_q1.substring(0,200)}{answers.connect_q1.length>200?'...':''}</p>
                  </div>
                )}
                <p style={{ fontSize: FONT.size.xs, color: COLORS.accent2, margin: 0, marginTop: SPACING.sm, fontStyle: 'italic' }}>연결 예시: "\"이 직무의 본질은 이것이고...\""</p>
              </div>

              <div style={{ background: COLORS.bg, borderLeft: `3px solid ${COLORS.accent2}`, borderRadius: `0 ${RADIUS.sm}px ${RADIUS.sm}px 0`, padding: SPACING.base, marginBottom: SPACING.sm }}>
                <p style={{ fontSize: FONT.size.xs, fontWeight: FONT.weight.bold, color: COLORS.accent2, margin: 0, marginBottom: SPACING.sm }}>중반부 — 역량 갭 진단과 확보 (Q2·Q3)</p>
                {answers.connect_q2 && (
                  <div style={{ background: COLORS.blueBg, borderRadius: RADIUS.sm, padding: SPACING.sm, marginBottom: 6 }}>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.blue, fontWeight: FONT.weight.semibold, margin: 0 }}>연결 Q2 (권장)</p>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.accent, margin: 0, marginTop: 4, lineHeight: FONT.lineHeight.base }}>{answers.connect_q2.substring(0,200)}{answers.connect_q2.length>200?'...':''}</p>
                  </div>
                )}
                <p style={{ fontSize: FONT.size.xs, color: COLORS.accent2, margin: 0, marginTop: SPACING.sm, fontStyle: 'italic' }}>연결 예시: "\"부족한 역량을 이렇게 확보합니다...\""</p>
              </div>

              <div style={{ background: COLORS.bg, borderLeft: `3px solid ${COLORS.accent2}`, borderRadius: `0 ${RADIUS.sm}px ${RADIUS.sm}px 0`, padding: SPACING.base, marginBottom: SPACING.sm }}>
                <p style={{ fontSize: FONT.size.xs, fontWeight: FONT.weight.bold, color: COLORS.accent2, margin: 0, marginBottom: SPACING.sm }}>후반부 — 단기 → 중기 다음 단계 (Q3·Q4)</p>
                {answers.connect_q3 && (
                  <div style={{ background: COLORS.blueBg, borderRadius: RADIUS.sm, padding: SPACING.sm, marginBottom: 6 }}>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.blue, fontWeight: FONT.weight.semibold, margin: 0 }}>연결 Q3 (권장)</p>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.accent, margin: 0, marginTop: 4, lineHeight: FONT.lineHeight.base }}>{answers.connect_q3.substring(0,200)}{answers.connect_q3.length>200?'...':''}</p>
                  </div>
                )}
                <p style={{ fontSize: FONT.size.xs, color: COLORS.accent2, margin: 0, marginTop: SPACING.sm, fontStyle: 'italic' }}>연결 예시: "\"단기 목표가 달성되면 다음 단계로...\""</p>
              </div>

              <div style={{ background: COLORS.bg, borderLeft: `3px solid ${COLORS.accent2}`, borderRadius: `0 ${RADIUS.sm}px ${RADIUS.sm}px 0`, padding: SPACING.base, marginBottom: SPACING.sm }}>
                <p style={{ fontSize: FONT.size.xs, fontWeight: FONT.weight.bold, color: COLORS.accent2, margin: 0, marginBottom: SPACING.sm }}>마무리 — 개인 성장 → 조직 기여 (Q4)</p>
                {answers.connect_q4 && (
                  <div style={{ background: COLORS.blueBg, borderRadius: RADIUS.sm, padding: SPACING.sm, marginBottom: 6 }}>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.blue, fontWeight: FONT.weight.semibold, margin: 0 }}>연결 Q4 (권장)</p>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.accent, margin: 0, marginTop: 4, lineHeight: FONT.lineHeight.base }}>{answers.connect_q4.substring(0,200)}{answers.connect_q4.length>200?'...':''}</p>
                  </div>
                )}
                <p style={{ fontSize: FONT.size.xs, color: COLORS.accent2, margin: 0, marginTop: SPACING.sm, fontStyle: 'italic' }}>연결 예시: "\"나의 성장이 회사의 방향과 맞물려...\""</p>
              </div>
            </div>

            <div style={{ ...S.boxSuccess, marginBottom: SPACING.md }}>
              <p style={{ ...labelStyle(COLORS.green), marginBottom: SPACING.sm }}>SUCCESS · 수정 전 최종 확인</p>
              <p style={{ fontSize: FONT.size.xs, color: COLORS.sub, margin: `0 0 ${SPACING.sm}px`, lineHeight: FONT.lineHeight.base }}>각 항목을 확인하며 체크하세요. 통과하지 못한 항목이 있다면 해당 Q로 돌아가 보완합니다.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { n: "①", q: "Q1: 직무 핵심을 본질 수준에서 이해했는가?", miss: "Q1-1, Q1-2" },
                { n: "②", q: "Q2: 현재 보유·부족 역량을 정직하게 진단했는가?", miss: "Q2-1, Q2-2" },
                { n: "③", q: "Q3: 역량 확보 계획이 수치·기한으로 검증 가능한가?", miss: "Q3-1, Q3-3" },
                { n: "④", q: "Q4: 조직 기여가 회사 방향과 연결되는가?", miss: "Q4-2" }
                ].map((item, i) => {
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

            <textarea className="ce-textarea" value={finalText} onChange={e => setFinalText(e.target.value)} rows={20} style={{ ...S.textarea, fontFamily: `'Noto Serif KR', '맑은 고딕', 'Malgun Gothic', serif`, lineHeight: 1.8 }} />
            <AnswerQualityCheck text={finalText} focusArea={['motivation','connection','autonomy']} />
            <p style={{ fontSize: FONT.size.xs, color: COLORS.sub, textAlign: 'right', margin: '4px 0 0', fontVariantNumeric: 'tabular-nums' }}>
              {(finalText || '').length}자
            </p>
          </div>

          {showRawAnswers && (
            <div style={S.boxNeutral}>
              <h4 style={{ fontSize: FONT.size.md, fontWeight: FONT.weight.semibold, color: COLORS.accent, marginTop: 0, marginBottom: SPACING.sm }}>원본 답변 참고</h4>
              <pre style={{ fontSize: FONT.size.sm, color: COLORS.accent, whiteSpace: 'pre-wrap', fontFamily: FONT.family, margin: 0, lineHeight: FONT.lineHeight.relaxed }}>{getRawAnswersText()}</pre>
            </div>
          )}


          <button onClick={downloadFinalText} style={{ ...S.btnPrimary, padding: '18px 32px', fontSize: FONT.size.md, marginTop: SPACING.md }}>
            워드 파일로 다운로드 (.doc)
          </button>

          {downloadSuccess && <p style={{ fontSize: FONT.size.sm, color: COLORS.green, textAlign: 'center', marginTop: SPACING.md, fontWeight: FONT.weight.semibold }}>✓ 다운로드 완료</p>}

          <div style={{ ...S.boxInfo, marginTop: SPACING.base, marginBottom: 0, textAlign: 'center' }}>
            <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0 }}><strong>워드에서 편집 가능:</strong> .doc 파일을 Word에서 열어 자유롭게 편집하세요.</p>
          </div>

          <div style={{ marginTop: SPACING.md }}>
            <button onClick={goToPrevStep} style={S.btnSecondary}>이전</button>
          </div>
        </div>

        <div style={S.copyrightWrap}>
          <p style={S.copyrightText}>© 2026 CareerEngineer. All Rights Reserved.</p>
          <p style={S.copyrightWarn}>이 워크북은 저작권법에 의해 보호받는 저작물입니다. 무단 복제·배포·수정을 금지하며, 위반 시 법적 책임을 질 수 있습니다.</p>
        </div>
      <StickyFooter />
      </div>
    </div>
  );

  // ══════════════════ 메인 질문 화면 ══════════════════
  const sd = currentPhase === 'round1'
    ? round1Steps[currentStep]
    : currentPhase === 'round2'
      ? { title: `${round1Steps[selectedSteps[currentStep]].title} - 심화`, questions: round2Questions[selectedSteps[currentStep]] }
      : { title: '3라운드: 연결 및 완성', questions: [round3Questions[currentStep]] };

  return (
    <div style={S.page}>
      <FocusStyles />
      <div style={S.container}>
        {/* ═══ 상단 고정 헤더 (PART 7-6: 워드마크 · 단계 · 저장) ═══ */}
        <div style={S.headerSticky}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: SPACING.base, marginBottom: SPACING.sm, flexWrap: 'wrap' }}>
            {/* 좌: 워드마크 */}
            <CELockupA height={32} />
            {/* 중: 현재 단계 (클릭 시 7단계 드롭다운) */}
            <div style={{ position: 'relative', flex: 1, display: 'flex', justifyContent: 'center' }}>
              
              
            </div>
            {/* 우: 저장 버튼 */}
            <button onClick={() => window.__CE_RESET?.fn?.()} title="이 워크북 작성 내용을 모두 지우고 처음부터 다시 작성" style={{ background: 'transparent', color: '#C53030', border: '1px solid #C5303066', borderRadius: 10, padding: '0 14px', fontSize: 16, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', height: 40, display: 'inline-flex', alignItems: 'center', marginRight: 6 }}>삭제하고 다시 작성</button><button onClick={goHome} title="처음 페이지로 이동 (작성 내용 유지)" style={{ background: 'transparent', color: '#6E7A8F', border: '1px solid #6E7A8F66', borderRadius: 10, padding: '0 14px', fontSize: 16, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', height: 40, display: 'inline-flex', alignItems: 'center' }}>처음으로</button>
            
            
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
            <p style={{ fontSize: FONT.size.sm, color: COLORS.green, fontWeight: FONT.weight.semibold, margin: 0 }}>✓ 임시저장 완료 — 다운로드된 .doc 파일을 확인하세요</p>
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
                    setCurrentStep(0);
                  }
                  window.scrollTo(0, 0);
                }}
                  style={{
                    fontSize: FONT.size.sm, padding: '6px 14px', borderRadius: 999, border: 'none', cursor: 'pointer',
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

          {currentStep === 0 && currentPhase === 'round1' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
              {[["position", "지원하고자 하는 직무", "예: 마케팅, 개발, 기획 등"], ["company", "지원하고자 하는 회사명", "예: 삼성전자, 네이버 등"], ["industry", "지원하고자 하는 산업", "예: IT, 금융, 제조 등"]].map(([f, l, p]) => (
                <div key={f}>
                  <label style={S.label}>{l}</label>
                  <input type="text" className="ce-input" value={basicInfo[f]} onChange={e => handleBasicInfoChange(f, e.target.value)} style={S.input} placeholder={p} />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.lg }}>
              {sd.questions && sd.questions.map((q) => (
                <div key={q.id} style={{ borderBottom: `1px solid ${COLORS.border}`, paddingBottom: SPACING.lg }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: SPACING.base, marginBottom: SPACING.sm }}>
                    <label style={{ ...S.label, marginBottom: 0, flex: 1 }}>{q.label}</label>
                    {q.guide && (
                      <button onClick={() => toggleGuide(q.id)} style={{ ...S.btnText, whiteSpace: 'nowrap' }}>
                        {showGuide[q.id] ? '가이드 숨기기' : '가이드 보기'}
                      </button>
                    )}
                  </div>

                  {q.hint && <p style={S.hint}>{q.hint}</p>}

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

                  {q.guide && showGuide[q.id] && (
                    <div style={{ ...S.boxInfo, borderLeft: `3px solid ${COLORS.accent2}` }}>
                      <p style={{ ...labelStyle(COLORS.accent2), marginBottom: SPACING.sm }}>GUIDE · 작성 가이드</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.sm }}>
                        <p style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color: COLORS.accent, margin: 0 }}>{q.guide.description}</p>
                        {q.guide.diagnosis && <p style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.medium, color: COLORS.accent, margin: 0 }}>{q.guide.diagnosis}</p>}
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
                        {q.relatedWorkbooks && <RelatedWorkbookInline ids={q.relatedWorkbooks} questionId={q.id || q.label} workbookKey="careergoal" />}
                      </div>
                    </div>
                  )}

                  <textarea className="ce-textarea" value={answers[q.id] || ''} onChange={e => handleAnswerChange(q.id, e.target.value)} rows={q.rows || 3} style={S.textarea} placeholder={q.placeholder} />
                  {currentPhase === 'round3' && (
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

        <p style={{ ...S.copyrightText, marginTop: SPACING.lg }}>© 2026 CareerEngineer. All Rights Reserved.</p>
        <StickyFooter />
      </div>
    </div>
  );
};

export default CareerAspirationWorkbook;
