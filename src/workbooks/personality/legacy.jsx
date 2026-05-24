// [BUILD v36 20260520 10:30] docx 저장에 CareerEngineer 자료 + 멘토링 안내 섹션 추가 (ExternalHyperlink + linkP)
import React, { useState, useEffect, useRef } from 'react';
import { COLORS, FONT, SPACING, RADIUS, MENTORING_URLS } from '../../shared/design/tokens.js';
import { AnswerQualityCheck } from '../../shared/components/AnswerQualityCheck.jsx';
import { ReferenceInline } from '../../shared/components/ReferenceInline.jsx';

// 멘토링·컨설팅 URL 상수 (작업 18: URL 상수화)
// ══════════════════════════════════════════════════════════════
//  CareerEngineer 성격의 장단점 워크북
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


const PersonalityWorkbook = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [currentPhase, setCurrentPhase] = useState('round1');
  const [currentStep, setCurrentStep] = useState(() => { try { const __d = JSON.parse(localStorage.getItem('careerengineer_personality_v1') || '{}'); return (__d.basicInfo && (__d.basicInfo.industry || __d.basicInfo.position || __d.basicInfo.company)) ? 1 : 0; } catch { return 0; } });
  const [selectedSteps, setSelectedSteps] = useState([]);
  const [showGuide, setShowGuide] = useState({});
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [showRawAnswers, setShowRawAnswers] = useState(false);
  const [finalText, setFinalText] = useState('');
  const [checklistState, setChecklistState] = useState({});
  const [basicInfo, setBasicInfo] = useState({ position: '', company: '' });
  const [answers, setAnswers] = useState({});
  const [autoSaveStatus, setAutoSaveStatus] = useState('');
  const [confirmingClear, setConfirmingClear] = useState(false);
  const [clearedFlash, setClearedFlash] = useState(false);
  const [hasRestored, setHasRestored] = useState(false);

  // 자동 저장 키
  const STORAGE_KEY = 'careerengineer_personality_v1';

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
      setBasicInfo({ position: '', company: '' });
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

  // ── 1라운드: Q1(장점 7문항) + Q2(단점 4문항) ──────────
  const round1Steps = [
    { id: 0, title: '기본 정보 입력', subtitle: '지원할 직무와 회사를 입력하세요' },
    {
      id: 1,
      title: 'Q1: 장점',
      subtitle: '무엇이고, 어떤 계기로 형성됐으며, 왜 발전시키려 하고, 지속적으로 어떻게 나타나며, 어떤 성과를 냈고, 어떻게 기여하는가',
      questions: [
        {
          id: 'q1_1',
          label: 'Q1-1. 나의 장점은 무엇인가?',
          hint: '타인도 인정하는 장점 — 실제로 들어본 평가를 근거로',
          guide: {
            description: '실제로 들어본 평가를 근거로 작성하세요.',
            diagnosis: '즉석자가진단: "누가, 언제 그렇게 말했나요?"에 즉답 가능한가?',
            helpQuestions: [
              '가족, 친구, 선후배가 자주 하는 말은?',
              '팀에서 자연스럽게 맡게 되는 역할은?',
              '나에게 자주 부탁하는 일의 공통점은?'
            ],
            ifDifficult: '지금 당장 가장 친한 친구 1명에게 "내 첫인상이 어때?"라고 물어보세요.',
            ifStillDifficult: '평가가 여러 개 나왔다면 가장 많이 들은 것 하나를 선택하세요. "성실합니다", "열정적입니다"는 답이 아닙니다. 행동으로 관찰 가능한 특성으로 표현하세요.',
            warning: '"성실합니다", "열정적입니다"는 답이 아닙니다. 행동으로 관찰 가능한 특성으로 표현하세요.'
          },
          placeholder: '예: "계획적이고 체계적이다"\n— 팀 프로젝트에서 항상 일정 관리를 자연스럽게 맡게 됩니다.\n— 교수님: "항상 준비가 잘 되어 있다"\n— 팀원들: "같이 하면 마감 걱정이 없다"\n→ 서로 전혀 다른 사람들이 같은 표현을 씁니다.',
          rows: 4, relatedWorkbooks: ['experience', 'motivation', 'jobcompetency', 'goalachievement', 'careergoal']
        },
        {
          id: 'q1_2',
          label: 'Q1-2. 이 장점은 어떤 계기로 형성되었는가?',
          hint: '언제, 어떤 경험을 통해 이 성격이 만들어졌는지 — 구체적인 장면이 있어야 합니다',
          guide: {
            description: '이 장점이 처음 만들어지거나 강화된 경험을 구체적으로 작성하세요.',
            diagnosis: '즉석자가진단: "그때 무슨 일이 있었나요?"에 구체적으로 답변 가능한가?',
            helpQuestions: [
              '언제부터 이런 성격이 되었나요?',
              '이 장점이 처음으로 빛을 발한 경험은?',
              '이 장점이 없었다면 실패했을 것 같은 경험은?'
            ],
            ifDifficult: '이 장점 덕분에 처음으로 칭찬받거나 좋은 결과를 낸 순간을 떠올려보세요.',
            ifStillDifficult: '언제부터인지 몰라도 됩니다. 가장 선명한 기억 하나만 쓰세요.',
            warning: '"원래 이런 성격이었습니다"는 답이 아닙니다. 만들어진 경험이 반드시 있습니다.'
          },
          placeholder: '예: 고등학교 때 수능 준비와 동아리 활동을 동시에 하면서 처음으로 시간표를 직접 짰습니다.\n막연하게 "열심히 해야지"로 임했을 때는 둘 다 흔들렸는데,\n우선순위를 정하고 주간 일정을 관리하기 시작하자 두 가지 모두 좋은 성과가 났습니다.',
          rows: 4, relatedWorkbooks: ['experience', 'motivation', 'jobcompetency', 'goalachievement', 'careergoal']
        },
        {
          id: 'q1_3',
          label: 'Q1-3. 이 장점을 계속 발전시켜야겠다고 생각하게 된 계기는?',
          hint: '형성에서 그친 것이 아니라 — 이 장점이 실제로 중요하다고 느꼈던 구체적 경험',
          guide: {
            description: '이 장점 덕분에 일이 잘 풀렸거나, 타인에게 인정받거나, 없었다면 힘들었을 경험을 작성하세요.',
            diagnosis: '즉석자가진단: "그 경험이 없었다면 이 장점을 계속 키우려 했을까요?"에 답변 가능한가?',
            helpQuestions: [
              '이 장점 덕분에 위기를 넘긴 경험은?',
              '이 장점이 없었던 사람과 비교해서 차이를 느낀 순간은?',
              '"덕분에 편했다", "없었으면 어쩔 뻔했어"라는 말을 들은 순간은?',
              '이 장점을 잃어버린다면 가장 아쉬운 상황은?'
            ],
            ifDifficult: '"이 장점이 없었다면 어떻게 됐을까?"를 떠올려보세요. 그 차이가 발전 의지의 이유입니다.',
            ifStillDifficult: '이 장점으로 가장 뿌듯했던 순간, 또는 가장 고마웠다는 말을 들은 순간을 떠올려보세요.',
            warning: '"잘하는 것 같아서 계속 발전시키고 싶었습니다"는 답이 아닙니다. 구체적 경험이 이유여야 합니다.'
          },
          placeholder: '예: 동아리 프로젝트에서 제가 일정 관리를 맡은 팀은 항상 기한 내에 완성됐는데,\n제가 빠진 다른 팀은 마감 전날 밤새 작업하는 일이 반복됐습니다.\n그 차이를 직접 보면서 "이 능력이 팀 전체에 영향을 미친다"는 것을 실감했고,\n단순히 내 습관이 아닌 팀에 기여하는 역량으로 키워야겠다고 생각하게 됐습니다.',
          rows: 4, relatedWorkbooks: ['career_roadmap', 'experience', 'motivation', 'jobcompetency', 'goalachievement', 'careergoal']
        },
        {
          id: 'q1_4',
          label: 'Q1-4. 이 장점이 지속적으로 나타난다는 것을 어떻게 증명할 수 있는가?',
          hint: '하나의 사례로는 부족합니다 — 다른 맥락, 다른 사람, 다른 시점에서 반복되는 패턴이 증거입니다',
          guide: {
            description: '"지속적"이라는 말은 증명이 필요합니다. 아래 3가지 방법으로 패턴을 보여주세요.',
            diagnosis: '즉석자가진단: 3가지 방법 중 2가지 이상을 채울 수 있는가?',
            helpQuestions: [
              '[방법 1] 다른 맥락에서 반복: 학교·알바·동아리에서도 같은 장점이 나타난 상황 3가지는?',
              '[방법 2] 다른 사람들이 같은 말을 한다: 서로 다른 관계의 2명 이상이 비슷하게 한 말은?',
              '[방법 3] 시간적 일관성: 가장 오래된 사례는? 가장 최근 사례는? 그 사이 몇 년인가요?'
            ],
            ifDifficult: '방법 1부터 시작하세요. 맥락만 달라도 충분합니다.',
            ifStillDifficult: '하나의 대표 사례만으로는 지속성을 증명할 수 없습니다. 소소한 일상 사례도 포함해서 패턴을 찾아보세요.'
          },
          placeholder: '예:\n[방법 1 — 다른 맥락에서 반복]\n학업: 매 학기 초 전과목 일정표 작성 / 팀 활동: 모든 팀 프로젝트 일정 관리 담당 / 일상: 약속·여행 캘린더 역산 입력\n\n[방법 2 — 다른 사람들이 같은 말]\n교수님: "항상 준비가 잘 돼 있다" / 팀원들: "같이 하면 마감 걱정 없다" / 친구들: "네가 있으면 굴러간다"\n\n[방법 3 — 시간적 일관성]\n고1(2019): 수행평가 일정표 직접 제작 → 대학 2학년(2022): 팀 프로젝트 간트차트 → 현재(2025): 대외활동 기획팀장',
          rows: 6, relatedWorkbooks: ['experience', 'motivation', 'jobcompetency', 'goalachievement', 'careergoal']
        },
        {
          id: 'q1_5',
          label: 'Q1-5. 이 장점으로 만들어낸 가장 구체적인 성과는?',
          hint: 'STAR(상황-과제-행동-결과) + 타인의 평가 — 하나를 깊게',
          guide: {
            description: 'STAR 구조로 가장 대표적인 경험 하나를 깊게 서술하세요. 타인의 평가도 함께 작성하세요.',
            diagnosis: '즉석자가진단: "그 상황을 자세히 설명해주세요"라고 하면 3분간 막힘없이 설명 가능한가?',
            helpQuestions: [
              'S(상황): 언제, 어디서, 어떤 역할이었나요?',
              'T(과제): 해결해야 했던 문제나 목표는?',
              'A(행동): 이 장점을 어떻게 발휘했나요? 구체적으로?',
              'R(결과): 숫자로 표현 가능한 결과는? (성적, 인원, 기간, 비율 등)',
              '타인 평가: 교수님, 팀장, 선배가 정확히 뭐라고 했나요?'
            ],
            ifDifficult: '큰 성과가 아니어도 됩니다. 작아도 STAR로 구체화하면 의미 있습니다.',
            ifStillDifficult: '"그때 어떤 상황이었나요?"부터 시작해 한 줄씩 채워보세요. 직접적인 말이 기억나지 않으면, 그 후 나에게 달라진 것(더 많이 부탁받는 일 등)을 써도 됩니다.'
          },
          placeholder: '예:\n[STAR 성과]\nS: 대학 축제 기획단에서 20개 부스 운영 총괄을 맡았습니다.\nT: 3주 안에 부스 섭외·물품·인력 배치를 모두 완료해야 했습니다.\nA: 부스별 준비 체크리스트를 만들고, 주 2회 책임자와 진행 상황을 점검했습니다.\nR: 당일 모든 부스가 차질 없이 운영되었고, 예산 내 처리율 100%를 달성했습니다.\n\n[타인의 평가]\n지도교수님: "너와 일하면 마음이 놓인다"\n팀원들: "덕분에 각자 역할에만 집중할 수 있었다"',
          rows: 7, relatedWorkbooks: ['experience', 'self_introduction', 'motivation', 'jobcompetency', 'goalachievement', 'careergoal']
        },
        {
          id: 'q1_6',
          label: 'Q1-6. 이 장점은 이 직무의 어떤 업무에서 어떻게 쓰이는가?',
          hint: '지금 채용공고를 열고 주요 업무와 장점을 1:1로 연결해보세요 — 직접 연결이 어려우면 팀 기여로 연결해도 됩니다',
          guide: {
            description: '지금 바로 채용공고를 열고 주요 업무 항목을 적은 뒤, 이 장점이 연결되는 업무에만 한 줄씩 쓰세요. 연결이 안 되는 업무는 비워두세요. 억지로 연결할 필요 없습니다.',
            diagnosis: '즉석자가진단: 연결된 업무가 1개라도 있나요? 그것으로 충분합니다.',
            helpQuestions: [
              '"이 장점이 없는 사람이 이 직무를 한다면 어떤 어려움이 생길까?"로 역으로 생각해보세요.',
              '직무 업무가 아니더라도, 이 조직·팀·문화에서 이 장점이 도움이 되는 상황은 있나요?',
              '이 장점이 없었던 시절의 나와 지금의 나는 어떻게 다른가요?',
              '이 장점 덕분에 나는 어떤 사람으로 기억되고 있나요?'
            ],
            ifDifficult: '연결이 억지스럽다면 Q1-7(기여)에서 직무 연결 대신 이 장점이 만들어내는 팀 기여를 써도 됩니다.',
            ifStillDifficult: '직접 연결이 전혀 안 된다면, "팀 내에서 누군가는 반드시 해야 하는 역할"로 연결하세요. 예: 체계적인 성격은 마케팅 크리에이티브 업무에 직접 쓰이진 않지만, 팀 일정이 흐트러질 때 중심을 잡는 사람으로 기여할 수 있습니다.'
          },
          placeholder: '예:\n[채용공고 업무 → 장점 연결]\n마케팅 캠페인 기획 → 체계적 계획 수립 능력\n일정 관리 및 진행 모니터링 → 간트차트 + 주간 체크인 습관\n복수 채널 동시 운영 → 여러 일정을 충돌 없이 관리하는 경험\n\n또는 [팀 기여로 연결 (직접 연결이 약한 경우)]\n"팀 일정이 흐트러질 때 중심을 잡는 역할로 기여할 수 있습니다."',
          rows: 5, relatedWorkbooks: ['job_analysis', 'experience', 'motivation', 'jobcompetency', 'goalachievement', 'careergoal']
        },
        {
          id: 'q1_7',
          label: 'Q1-7. 이 장점으로 이 직무·이 회사에 어떻게 기여하겠는가?',
          hint: '"열심히 하겠습니다"가 아닌 — 이 장점이 기여의 이유가 되어야 합니다',
          guide: {
            description: 'Q1-6에서 연결한 직무 업무를 바탕으로 기여 방식을 구체적으로 작성하세요.',
            diagnosis: '즉석자가진단: "왜 그런 기여를 할 수 있다고 생각하나요?"에 이 장점으로 즉답 가능한가?',
            helpQuestions: [
              '"이 장점이 있기 때문에 이 업무를 이렇게 할 수 있습니다"로 문장을 완성해보세요.',
              'Q1-5(STAR 성과)에서 만든 결과가 이 직무에서도 재현 가능한 이유는?',
              '"팀 프로젝트에서 ~했던 것처럼, 귀사에서도 ~하겠습니다" 구조로 시작해보세요.'
            ],
            ifDifficult: '"기여하고 싶습니다"가 아닌 "이 장점이 있기 때문에 이런 기여가 가능합니다"로 연결하세요.',
            ifStillDifficult: '입사후포부처럼 "~을 하겠습니다"로만 끝나지 않도록 주의하세요. 장점이 이유여야 합니다.',
            warning: '입사후포부처럼 "~을 하겠습니다"로만 끝나지 않도록 주의하세요. 장점이 기여의 이유여야 합니다.'
          },
          placeholder: '예: 체계적 계획성 덕분에 팀 프로젝트에서 항상 기한 내 완성이라는 결과를 만들어왔습니다.\n이 장점이 있기 때문에 귀사의 복수 캠페인 동시 운영 업무에서\n채널별 일정을 충돌 없이 관리하고, 진행 상황을 팀 전체가 공유할 수 있는 구조를 만들겠습니다.\n→ "체계적이기 때문에" → "이런 구체적 업무를" → "이렇게 할 수 있습니다"의 흐름입니다.',
          rows: 5, relatedWorkbooks: ['job_analysis', 'experience', 'motivation', 'jobcompetency', 'goalachievement', 'careergoal']
        }
      ]
    },
    {
      id: 2,
      title: 'Q2: 단점',
      subtitle: '무엇이고, 어떻게 알게 됐으며, 왜 고치려 하고, 어떻게 성장해 나가고 있는가',
      questions: [
        {
          id: 'q2_1',
          label: 'Q2-1. 나의 단점은 무엇인가? 이 단점을 어떻게 알게 되었는가?',
          hint: '장점의 이면이나 과도함으로 나타나는 진짜 단점 + 인식하게 된 구체적 계기',
          guide: {
            description: '[단점] 장점의 이면이나 과도함으로 나타나는 진짜 단점을 솔직하게 작성하세요.\n[인식 계기] 이 단점을 결정적으로 인식하게 된 경험을 작성하세요.',
            diagnosis: '즉석자가진단: "그래서 어떤 문제가 생겼나요?"에 구체적 사례로 즉답 가능한가?',
            helpQuestions: [
              '[단점 찾기] 이 장점이 과도하게 발현될 때 어떤 부작용이 생기나요?',
              '[단점 찾기] Q1-1의 장점을 극단적으로 밀어붙였을 때를 상상해보세요. 그게 단점입니다.',
              '[인식 계기] 단점으로 인해 실제로 어려움을 겪은 경험은?',
              '[인식 계기] "아, 이게 나의 단점이구나"라고 느낀 순간은?',
              '[인식 계기] 누구의 피드백이 결정적이었나요?'
            ],
            ifDifficult: '"이 단점 때문에 ~하지 못했다"의 형식으로 구체적 상황을 떠올려보세요.',
            ifStillDifficult: '이 단점을 개선하고 싶다고 느낀 순간을 떠올려보세요.',
            warning: '"완벽주의", "긍정적 사고", "너무 열심히 함"은 면접관에게 통하지 않습니다. 직무에 치명적이지 않은 진짜 단점을 쓰세요.'
          },
          placeholder: '예:\n[단점]\n계획적인 성격이 과도하면 유연성이 부족해집니다.\n예상치 못한 변수나 갑작스러운 계획 변경에 스트레스를 받고,\n즉흥적인 아이디어 회의나 빠른 방향 전환이 필요한 상황에서 적응이 느립니다.\n\n[인식 계기]\n스타트업 인턴십에서 매일 우선순위가 바뀌는 환경에 기존 계획을 고수하려다 팀의 속도를 따라가지 못했고,\n멘토님께서 "계획은 방향이지 족쇄가 아니다"라고 조언해주신 것이 결정적인 전환점이 되었습니다.',
          rows: 6, relatedWorkbooks: ['experience', 'interview_new', 'motivation', 'jobcompetency', 'goalachievement', 'careergoal']
        },
        {
          id: 'q2_2',
          label: 'Q2-2. 이 단점을 고쳐야겠다고 결심하게 된 계기는?',
          hint: '추상적 이유가 아닌 — 실제로 어렵거나 불편했던, 또는 타인에게 불편을 끼쳤던 구체적 경험',
          guide: {
            description: '이 단점 때문에 실제로 힘들었거나, 일이 잘못됐거나, 누군가에게 불편을 준 경험을 작성하세요. 그 경험이 "이건 정말 고쳐야 하겠다"는 결심을 만든 계기입니다.',
            diagnosis: '즉석자가진단: "그때 어떤 기분이었나요?"에 구체적으로 답변 가능한가?',
            helpQuestions: [
              '[내가 힘들었던 경험] 이 단점 때문에 목표를 달성하지 못했거나 기회를 놓친 경험은?',
              '[내가 힘들었던 경험] "다시 하면 달랐을 텐데"라고 생각한 순간은?',
              '[타인에게 불편을 끼친 경험] 이 단점 때문에 팀원이나 주변 사람이 힘들어했던 적은?',
              '[타인에게 불편을 끼친 경험] 누군가가 직접적으로 불편함이나 답답함을 표현한 적은?',
              '[타인에게 불편을 끼친 경험] 내 단점 때문에 팀 전체가 영향을 받은 상황은?'
            ],
            ifDifficult: '"이 단점 때문에 ~하지 못했다" 또는 "이 단점 때문에 ~에게 미안했다"로 시작해보세요.',
            ifStillDifficult: '이 단점이 가장 크게 드러났던 하루를 떠올리고, 그날 무슨 일이 있었는지 써보세요.',
            warning: '"단점이니까 당연히 고쳐야 한다"는 계기가 아닙니다. 실제 경험에서 나온 결심이어야 합니다.'
          },
          placeholder: '예:\n[내가 힘들었던 경험]\n스타트업 인턴십에서 팀 방향이 급변했을 때, 기존 계획을 내려놓지 못해 혼자 뒤처졌습니다.\n팀은 이미 새 방향으로 달려가는데 저만 이전 계획을 수정하는 데 30분을 쓰며 멈춰있었고,\n그날 회의에서 아무 기여도 못한 채 끝났습니다. "내가 없는 게 나았겠다"는 생각이 들었습니다.\n\n[타인에게 불편을 끼친 경험]\n팀원들이 "그냥 넘어가자"며 저를 기다려줬는데,\n나중에 한 팀원이 "그때 좀 답답했어"라고 솔직하게 말해줬습니다.\n내 단점이 나만의 문제가 아니라 팀 전체에 영향을 준다는 것을 그때 처음 실감했습니다.',
          rows: 6, relatedWorkbooks: ['career_roadmap', 'experience', 'motivation', 'jobcompetency', 'goalachievement', 'careergoal']
        },
        {
          id: 'q2_3',
          label: 'Q2-3. 지금 이 단점을 어떻게 관리하고 있는가?',
          hint: '오늘도 실행 중인 구체적 방법 — "노력 중"이 아닌 행동이 있어야 합니다',
          guide: {
            description: '오늘도 실행 중인 구체적인 관리 방법을 작성하세요.',
            diagnosis: '즉석자가진단: "오늘은 뭘 했나요?"라고 물으면 구체적 행동을 즉답할 수 있는가?',
            helpQuestions: [
              '매일/매주 반복하는 것은?',
              '이 단점이 나타나려 할 때 스스로 어떻게 하나요?',
              '새롭게 시작한 습관이나 활동은?',
              '이 전자책 작성 전에도 이 노력을 하고 있었나요?'
            ],
            ifDifficult: '작은 것이라도 괜찮습니다. "스트레스받을 때 5분 기다렸다가 말한다"도 관리입니다.',
            ifStillDifficult: '지금 당장 오늘부터 할 수 있는 가장 작은 행동 하나를 정하고 작성하세요.',
            warning: '"열심히 하겠습니다"는 관리가 아닙니다. 지금 무엇을 어떻게 하고 있는지가 핵심입니다.'
          },
          placeholder: "예: '플랜 B 습관'을 기르고 있습니다.\n모든 계획에 대안을 미리 준비해두고,\n주 1회는 계획 없이 움직이는 '즉흥 데이'를 만들어 변화에 적응하는 연습을 합니다.\n브레인스토밍 시간에는 타이머를 설정하고 평가 없이 아이디어를 먼저 내는 훈련도 꾸준히 하고 있습니다.",
          rows: 4, relatedWorkbooks: ['experience', 'motivation', 'jobcompetency', 'goalachievement', 'careergoal']
        },
        {
          id: 'q2_4',
          label: 'Q2-4. 아직 부족하지만, 이렇게 보완하면서 어떻게 성장해 나가고 있는가?',
          hint: '완전히 극복했다는 주장이 아닌 — 진행 중인 성장의 구체적 증거',
          guide: {
            description: '완전히 고쳤다고 주장하지 않아도 됩니다. 변화하고 있다는 증거를 작성하세요.',
            diagnosis: '즉석자가진단: "이전과 비교해 어떻게 달라졌나요?"에 구체적으로 답변 가능한가?',
            helpQuestions: [
              '이전에는 X분 걸리던 것이 지금은 Y분이다',
              '이전에는 X번 실수했던 것이 지금은 Y번이다',
              '주변에서 변화를 알아챈 사람이 있나요? 어떻게 표현했나요?',
              '이전에는 못했지만 지금은 할 수 있는 것은?'
            ],
            ifDifficult: '3개월 전 나와 오늘의 나를 같은 상황에 놓고 비교해보세요.',
            ifStillDifficult: '아주 작은 변화도 괜찮습니다. 작은 변화가 쌓여 큰 성장이 됩니다.',
            warning: '"앞으로 더 노력하겠습니다"가 아닌, 지금 변화하고 있는 과정과 방향이 드러나야 합니다.'
          },
          placeholder: '예:\n[현재까지의 변화]\n이전: 예상치 못한 변경 요청을 받으면 30분 이상 당황해서 대응이 늦었습니다.\n현재: 같은 상황에서 5분 이내에 플랜 B를 제시할 수 있게 되었습니다.\n팀장님이 "예전보다 훨씬 유연해졌다"고 말씀하셨습니다.\n\n[앞으로의 성장]\n계획성이라는 장점을 유지하면서도 빠르게 플랜 B로 전환하는 능력을 갖춰가고 있습니다.\n이 균형이 완성될수록 마케팅 직무에서 더 큰 강점이 될 것이라 생각합니다.',
          rows: 5, relatedWorkbooks: ['experience', 'motivation', 'jobcompetency', 'goalachievement', 'careergoal']
        }
      ]
    }
  ];

  // ── 2라운드: 심화 질문 ─────────────────────────────────
  const round2Questions = {
    1: [ // Q1 장점 심화 (5개)
      {
        id: 'q1_d1',
        label: 'Q1-심화1. 지금 당장 최근 3개월 내 타인에게 받은 피드백을 모두 적어보세요.',
        hint: '기억이 나지 않는다면 지금 바로 주변 사람에게 물어보세요 — 공통점이 핵심 장점입니다',
        guide: {
          description: '기억이 나지 않는다면 지금 당장 실행하세요.',
          diagnosis: '즉석자가진단: 3가지 이상의 평가에서 공통된 키워드가 보이나요?',
          helpQuestions: [
            '지금 바로 가장 친한 친구 1명에게 카톡으로 "내 첫인상이나 나에 대한 평가 솔직하게 말해줘"라고 보내세요.',
            '최근 함께한 팀 프로젝트 팀원에게 "같이 일하면서 어떤 점이 인상적이었어?"라고 물어보세요.',
            '나에게 자주 부탁하는 일은 무엇인가요?',
            '가장 자주 받는 칭찬과 지적은?'
          ],
          ifDifficult: '교수, 팀장, 친구 등 각각 한 명씩 떠올리고 그들의 평가를 써보세요.',
          ifStillDifficult: '공통 키워드가 바로 당신의 핵심 장점입니다.'
        },
        placeholder: '예: 교수님: "보고서가 항상 체계적이다"\n팀원들: "일정을 항상 잘 챙겨준다"\n친구들: "약속을 절대 어기지 않는다"\n알바 점장님: "시키지 않아도 미리 준비한다"\n→ 공통 키워드: "체계적, 신뢰할 수 있는, 미리 준비하는"',
        rows: 5, relatedWorkbooks: ['experience', 'motivation', 'jobcompetency', 'goalachievement', 'careergoal']
      },
      {
        id: 'q1_d2',
        label: 'Q1-심화2. 이 장점이 언제, 어떤 상황에서 가장 강하게 발현되나요?',
        hint: '모든 상황에서 동일하게 나타나지 않습니다 — 강하게 나타나는 상황이 본질입니다',
        guide: {
          description: '장점이 특히 강하게 나타나는 상황과 상대적으로 약해지는 상황을 비교해보세요.',
          diagnosis: '즉석자가진단: 이 장점이 가장 빛나는 순간을 생생하게 묘사할 수 있나요?',
          helpQuestions: [
            '이 장점이 없었다면 어떤 상황에서 가장 힘들었을까요?',
            '반대로 이 장점이 숨어드는 상황은?',
            '이 장점이 가장 필요한 사람은 어떤 사람인가요?'
          ],
          ifDifficult: '"이 장점이 가장 빛났던 하루"를 구체적으로 묘사해보세요.',
          ifStillDifficult: '약해지는 상황을 찾으면 단점과 자연스럽게 연결됩니다.'
        },
        placeholder: '예: 가장 강하게 발현: 여러 사람이 함께 일하는 프로젝트 상황\n→ 혼자보다 팀이 있을 때 책임감이 생기고, 체계를 만들어 팀 전체가 방향을 잃지 않도록 합니다.\n\n상대적으로 약해지는 상황: 창의적 아이디어가 필요한 자유로운 브레인스토밍\n→ 이 상황의 약점이 Q2의 단점(유연성 부족)과 직결됩니다.',
        rows: 4, relatedWorkbooks: ['experience', 'motivation', 'jobcompetency', 'goalachievement', 'careergoal']
      },
      {
        id: 'q1_d3',
        label: 'Q1-심화3. 이 장점을 계속 발전시켜야겠다고 생각한 계기가 막연하다면?',
        hint: '긍정적 경험·타인의 변화·"없었다면" 역으로 생각하기',
        guide: {
          description: '이 장점이 실제로 중요하다고 느꼈던 순간을 찾는 3가지 방법을 시도해보세요.',
          diagnosis: '즉석자가진단: 3가지 방법 중 하나라도 구체적인 경험이 나왔나요?',
          helpQuestions: [
            '[방법 1] 이 장점 덕분에 팀 전체가 좋은 결과를 낸 경험은?',
            '[방법 2] "덕분에 편했다", "네가 없었으면 어쩔 뻔했어"라는 말을 들은 순간은?',
            '[방법 3] 이 장점 없는 상황을 목격하고 차이를 느낀 경험은?'
          ],
          ifDifficult: '"이 장점이 없었다면 어떻게 됐을까?"를 먼저 생각한 뒤, 역으로 "그래서 계속 키워야 했다"로 연결하세요.',
          ifStillDifficult: '작은 경험도 괜찮습니다. 소소한 일상에서 이 장점이 빛났던 순간을 찾아보세요.'
        },
        placeholder: '예: [방법 2 — 타인의 반응]\n동아리 기획 프로젝트에서 팀원들이 "네가 일정 관리해줘서 우리가 각자 할 일에만 집중할 수 있었어"라고 했습니다.\n\n[방법 3 — 없는 상황을 목격]\n일정 관리 없이 진행한 다른 팀이 마감 전날 밤새 작업하는 것을 보면서,\n"이 장점이 없으면 저렇게 된다"는 것을 직접 확인했고, 더 키워야겠다는 동기가 생겼습니다.',
        rows: 5, relatedWorkbooks: ['experience', 'motivation', 'jobcompetency', 'goalachievement', 'careergoal']
      },
      {
        id: 'q1_d4',
        label: 'Q1-심화4. 가장 의미 있었던 성과 경험을 더 깊게 파고들어 보세요.',
        hint: '"나 없었다면 어떻게 됐을까?" — 대체 불가능한 기여의 가치',
        guide: {
          description: '본인만의 독특한 기여를 서술하세요.',
          diagnosis: '즉석자가진단: "다른 사람이었다면 같은 결과가 나왔을까요?"에 "아니오"라고 즉답할 수 있나요?',
          helpQuestions: [
            '내가 없었다면 팀은 어떻게 됐을까요?',
            '나만이 할 수 있었던 역할이나 방식은?',
            '팀원들이 나에게 고마워한 이유는?'
          ],
          ifDifficult: '실제로 그 팀원에게 "그때 내가 어떤 역할을 했던 것 같아?"라고 물어보세요.',
          ifStillDifficult: '팀에서 "이 사람이 없었으면 어떻게 됐을까?"라는 질문에 답해보세요.'
        },
        placeholder: '예: 저의 체계적 접근이 없었다면 프로젝트가 중반에 표류했을 가능성이 높습니다.\n팀원들이 각자 맡은 일만 했다면 전체 일정 충돌을 아무도 인지하지 못했을 것이고,\n마감 당일 미완성 결과물을 제출했을 수도 있었습니다.\n팀원 중 한 명이 나중에 "네가 없었으면 우리 팀 어쩔 뻔 했어"라고 했는데,\n그 말이 이 장점의 실제 가치를 가장 잘 보여준다고 생각합니다.',
        rows: 5, relatedWorkbooks: ['experience', 'motivation', 'jobcompetency', 'goalachievement', 'careergoal']
      },
      {
        id: 'q1_d5',
        label: 'Q1-심화5. 이 장점이 직무와 연결되는지 확인해보세요.',
        hint: '직접 연결되면 좋지만 억지스럽다면 직무 연결 부분은 건너뛰어도 됩니다',
        guide: {
          description: '지금 채용공고를 열고 주요 업무 항목을 적은 뒤, 이 장점이 연결되는 업무에만 한 줄씩 쓰세요. 연결이 안 되는 업무는 비워두세요.',
          diagnosis: '즉석자가진단: 연결된 업무가 1개라도 있나요? 그것으로 충분합니다.',
          helpQuestions: [
            '"이 장점이 없는 사람이 이 직무를 한다면 어떤 어려움이 생길까?"로 역으로 생각해보세요.',
            '직무 업무가 아니더라도, 이 팀·조직 문화에서 이 장점이 도움이 되는 상황은?',
            '이 장점이 없었던 시절의 나와 지금의 나는 어떻게 다른가요?',
            '이 장점 덕분에 나는 어떤 사람으로 기억되고 있나요?'
          ],
          ifDifficult: '연결이 억지스럽다면 Q1-7에서 직무 연결 대신 팀 기여로 써도 됩니다.',
          ifStillDifficult: '"팀 내에서 누군가는 반드시 해야 하는 역할"로 연결하세요.'
        },
        placeholder: '예:\n[직접 연결되는 경우]\n마케팅 캠페인 기획 → 체계적 계획 수립 능력으로 직접 연결됨\n복수 채널 동시 운영 → 여러 일정을 충돌 없이 관리하는 경험으로 연결됨\n\n[직접 연결이 약한 경우 — 다른 시각 확인]\n이 장점이 없었다면: 프로젝트마다 마감 전날 밤새는 상황이 반복됐을 것 같습니다.\n이 장점 덕분에 기억되는 모습: "얘랑 하면 뭔가 굴러간다"는 사람으로 기억됩니다.',
        rows: 5, relatedWorkbooks: ['job_analysis', 'experience', 'motivation', 'jobcompetency', 'goalachievement', 'careergoal']
      }
    ],
    2: [ // Q2 단점 심화 (6개)
      {
        id: 'q2_d1',
        label: 'Q2-심화1. 단점의 근본 원인은 무엇인가?',
        hint: '"왜 이런 단점이 생겼을까?"를 3번 반복해 물으면 진짜 원인이 나옵니다',
        guide: {
          description: '단점의 표면이 아닌 근본 원인을 파악하세요.',
          diagnosis: '즉석자가진단: 왜 그런 단점이 생겼는지 이해하고 있나요?',
          helpQuestions: [
            '이 단점이 처음 생겨난 환경이나 경험은?',
            '어떤 상황에서 이 단점이 더 강하게 나타나나요?',
            '이 단점과 내 장점은 어떻게 연결되나요?'
          ],
          ifDifficult: '"왜 이런 단점이 있을까?" → 대답 → "왜?" → 대답 → "왜?"를 3번 반복하세요.',
          ifStillDifficult: '가장 최근에 단점이 드러난 순간을 떠올리고, 그 순간 왜 그랬는지 분석해보세요.'
        },
        placeholder: '예: 완벽한 결과를 내야 한다는 책임감이 강하게 작용해, 예측 불가능한 상황을 통제하려는 경향이 생겼습니다.\n→ 이것이 장점(체계성)으로는 좋은 성과를 만들지만,\n과도해지면 변화에 저항하는 단점으로 나타납니다.\n\n이 원인을 알고 있기 때문에, 보완 방향도 명확합니다:\n"통제욕이 아닌 방향 설정"으로 계획의 역할을 재정의하는 것입니다.',
        rows: 5, relatedWorkbooks: ['experience', 'motivation', 'jobcompetency', 'goalachievement', 'careergoal']
      },
      {
        id: 'q2_d2',
        label: 'Q2-심화2. 보완 과정에서 가장 어려웠던 순간은? 그래도 계속하는 이유는?',
        hint: '쉽게 고쳐지지 않는다는 현실적 인정 — 그래도 계속하는 이유가 진정성입니다',
        guide: {
          description: '보완 과정이 쉽지 않았다는 것을 솔직하게 보여주세요.',
          diagnosis: '즉석자가진단: "그 순간에 어떻게 했나요?"에 구체적으로 답변 가능한가?',
          helpQuestions: [
            '보완하려 했지만 다시 원래대로 돌아간 경험은?',
            '그 순간 어떻게 다시 시도했나요?',
            '포기하고 싶었던 순간이 있었나요?'
          ],
          ifDifficult: '가장 최근에 단점이 다시 나타난 순간을 솔직하게 떠올려보세요.',
          ifStillDifficult: '어렵다고 솔직하게 말하는 것이 오히려 진정성을 높입니다.'
        },
        placeholder: '예: [가장 어려웠던 순간]\n즉흥적 회의에서 아무 말도 못하고 나온 날이 여러 번 있었습니다.\n훈련을 했는데도 그 순간이 되면 굳어버리는 자신이 답답했습니다.\n\n[그래도 계속하는 이유]\n그 순간들을 노트에 기록하고, 다음에는 어떻게 할 수 있었을지를 씁니다.\n이 과정이 느리지만 분명히 효과가 있다는 것을 조금씩 느끼기 때문에 계속하고 있습니다.',
        rows: 5, relatedWorkbooks: ['experience', 'motivation', 'jobcompetency', 'goalachievement', 'careergoal']
      },
      {
        id: 'q2_d3',
        label: 'Q2-심화3. 이 단점이 역으로 강점이 되는 상황은 있는가?',
        hint: '단점의 다른 면 — 균형 잡힌 자기 인식의 증거',
        guide: {
          description: '단점이 도움이 되는 상황을 솔직하게 서술하세요.',
          diagnosis: '즉석자가진단: 긍정적으로 활용할 수 있는 상황이 있나요?',
          helpQuestions: [
            '이 단점이 오히려 도움이 된 상황은?',
            '이 단점이 있어서 피할 수 있었던 실수는?',
            '이 단점을 가진 사람이 없다면 팀에 어떤 문제가 생길까요?'
          ],
          ifDifficult: '단점이 전혀 없는 사람을 상상해보세요. 그 사람에게 없는 것은 무엇인가요?',
          ifStillDifficult: '단점의 반대편을 생각해보세요.'
        },
        placeholder: '예: 계획에 집착하는 성향이 위기 상황에서는 오히려 침착한 대응으로 이어집니다.\n다른 사람들이 당황할 때 이미 대비책을 생각해둔 경우가 많아 리스크 관리에 강점을 보입니다.\n이 단점을 인식하고 관리하는 과정에서,\n"언제 계획을 지키고 언제 내려놓아야 하는가"를 스스로 판단하는 능력도 함께 기르고 있습니다.',
        rows: 4, relatedWorkbooks: ['experience', 'motivation', 'jobcompetency', 'goalachievement', 'careergoal']
      },
      {
        id: 'q2_d4',
        label: 'Q2-심화4. 관리 노력의 구체적 변화를 수치나 관찰 가능한 형태로 표현해보세요.',
        hint: '"더 나아졌다"는 느낌이 아닌 — 누구나 확인할 수 있는 변화',
        guide: {
          description: '측정 가능하거나 관찰 가능한 변화를 찾아보세요.',
          diagnosis: '즉석자가진단: "어떻게 달라졌는지 증명할 수 있나요?"에 답변 가능한가?',
          helpQuestions: [
            '이전에는 X분 걸리던 것이 지금은 Y분이다',
            '이전에는 X번 실수했던 것이 지금은 Y번이다',
            '주변 사람이 "많이 달라졌다"고 한 표현은?'
          ],
          ifDifficult: '3개월 전 나와 오늘의 나를 같은 상황에 놓고 비교해보세요.',
          ifStillDifficult: '아주 작은 변화도 괜찮습니다. 작은 변화가 쌓여 큰 성장이 됩니다.'
        },
        placeholder: '예: [관찰 가능한 변화]\n이전: 예상치 못한 변경 요청을 받으면 30분 이상 당황해서 대응이 늦었습니다.\n현재: 같은 상황에서 5분 이내에 플랜 B를 제시할 수 있게 되었습니다.\n\n[타인의 확인]\n팀장님이 "예전보다 훨씬 유연해졌다"고 말씀하셨고,\n최근 프로젝트에서 갑작스러운 일정 변경에도 팀에서 가장 먼저 대안을 제시했습니다.',
        rows: 5, relatedWorkbooks: ['job_analysis', 'experience', 'motivation', 'jobcompetency', 'goalachievement', 'careergoal']
      },
      {
        id: 'q2_d5',
        label: 'Q2-심화5. 단점을 쓰면 자기소개서에 불리한 것 아닐까요?',
        hint: '면접관이 원하는 솔직함의 기준 — 쓰면 오히려 신뢰가 높아지는 단점의 3가지 조건',
        guide: {
          description: '단점 작성에 대한 걱정이 있다면 이 기준을 먼저 확인하세요.',
          diagnosis: '즉석자가진단: 내 단점이 아래 3가지 조건을 충족하는가?',
          helpQuestions: [
            '[조건 1] 직무의 핵심 역량이 아예 없다는 뜻이 아닌 단점인가?',
            '[조건 2] 보완 중이라는 구체적 증거가 함께 있는가?',
            '[조건 3] 장점의 이면으로 연결되는 단점인가? ("이 장점이 과도해지면 이런 단점이 됩니다")'
          ],
          ifDifficult: '조건을 충족한 단점은 솔직하게 쓸수록 오히려 신뢰를 높입니다.',
          ifStillDifficult: '조건을 갖추지 못한 단점은 어떤 단점이라도 불리합니다. 조건 충족이 먼저입니다.',
          warning: '"완벽주의", "너무 열심히 함"은 면접관에게 통하지 않습니다.'
        },
        placeholder: '예: [내 단점의 조건 확인]\n① 직무 핵심 아님: 마케터인데 "유연성 부족" — 치명적이지 않음 \n② 보완 증거 있음: 플랜 B 습관, 즉흥 데이, 타이머 훈련으로 매일 관리 중 \n③ 장점의 이면: 계획성(장점)의 과도함 → 유연성 부족(단점)으로 자연스럽게 연결 \n\n→ 3가지 조건을 갖춘 단점은 쓸수록 신뢰를 높입니다.',
        rows: 5, relatedWorkbooks: ['job_analysis', 'experience', 'motivation', 'jobcompetency', 'goalachievement', 'careergoal']
      },
      {
        id: 'q2_d6',
        label: 'Q2-심화6. 내가 쓴 단점 서사가 진짜인지 스스로 확인해보세요.',
        hint: '글로 쓴 것과 실제 나 사이의 간극 — 3가지 시각으로 점검',
        guide: {
          description: '단점을 쓰고 나서 읽어봤을 때 "뭔가 어색하다"는 느낌이 든다면 아래 3가지로 확인해보세요.',
          diagnosis: '즉석자가진단: 3가지 확인을 모두 통과했나요?',
          helpQuestions: [
            '[확인 1] 나를 잘 아는 사람에게 이 단점 서사를 보여주고 "공감돼?"라고 물어보세요. "맞아, 그랬지"가 나오면 진짜입니다.',
            '[확인 2] 이 전자책 작성 전에도 이 보완 노력을 하고 있었나요? 글에 쓴 관리 방법이 오늘 실제로 이루어졌나요?',
            '[확인 3] 처음부터 끝까지 소리 내어 읽어보세요. "왜 갑자기 이 얘기가 나오지?"라는 느낌이 드는 문장은 앞뒤 연결을 수정하세요.'
          ],
          ifDifficult: '확인 1부터 시작하세요. 주변 사람 한 명에게 읽어달라고 부탁하는 것이 가장 빠릅니다.',
          ifStillDifficult: '확인 2가 "아니오"라면 노력 부분을 지금 실제로 하고 있는 것으로 바꾸세요.'
        },
        placeholder: '예: [확인 1 — 타인에게 확인]\n친한 친구에게 읽어줬더니 "맞아, 작년 OO 때 딱 그랬잖아"라고 했습니다.\n→ 구체적 경험을 떠올렸다는 것 자체가 진짜라는 증거입니다.\n\n[확인 3 — 흐름 점검]\n단점(과도한 계획성) → 인식(인턴십 경험) → 결심(팀에 불편을 끼쳤다) → 관리(플랜 B) → 변화(5분 내 대응)\n→ 각 단계가 자연스럽게 이어지면 완성입니다.',
        rows: 5, relatedWorkbooks: ['experience', 'motivation', 'jobcompetency', 'goalachievement', 'careergoal']
      }
    ]
  };

  // ── 3라운드: 연결 질문 (장점 흐름 → 단점 흐름) ─────────
  const round3Questions = [
    {
      id: 'connect_adv_core',
      label: '연결 ①→③: 장점 + 계기 + 발전 의지를 하나의 단락으로',
      hint: '"저의 장점은 [장점]입니다. [형성 계기]를 통해 만들어졌고, [발전 계기 경험]을 통해 계속 키워야겠다고 생각했습니다."',
      placeholder: '예: 고등학교 때 수능과 동아리를 병행하며 시간표를 처음 짰을 때, 계획이 있으면 된다는 확신이 생겼고 체계적인 습관이 자연스럽게 자리잡았습니다. 이후 동아리 프로젝트에서 제가 없을 때 팀이 마감 전날 밤새 작업하는 것을 보며, 이 능력이 팀 전체에 영향을 미친다는 것을 실감하고 더 키워야겠다고 생각했습니다.',
      rows: 4,
      referenceQuestions: ['q1_1', 'q1_2', 'q1_3']
    },
    {
      id: 'connect_adv_evidence',
      label: '연결 ④→⑤: 지속성 증거 + 대표 성과를 자연스럽게 연결',
      hint: '"이 성격은 [다른 맥락/다른 사람/시간적 일관성]으로 나타나고 있으며, [STAR 성과]라는 결과를 만들었고, [타인의 평가]를 받았습니다."',
      placeholder: '예: 이 성격은 학업·팀·일상 모든 곳에서 나타나고 있습니다. 교수님도, 팀원도, 친구도 같은 말을 합니다. 대학 축제 기획단에서 20개 부스를 총괄하며 예산 내 처리율 100%를 달성했고, 지도교수님께서는 "너와 일하면 마음이 놓인다"고 말씀하셨습니다.',
      rows: 4,
      referenceQuestions: ['q1_4', 'q1_5']
    },
    {
      id: 'connect_adv_contribution',
      label: '연결 ⑥→⑦: 직무 연결 + 기여를 논리적으로 연결',
      hint: '"이 장점은 귀사의 [구체적 업무]에서 직접 쓰입니다. 이 장점이 있기 때문에 [이런 방식으로] 기여할 수 있습니다."',
      placeholder: '예: 이 장점은 귀사의 복수 캠페인 동시 운영 업무에서 직접 쓰입니다. 체계적 계획성 덕분에 팀 프로젝트에서 항상 기한 내 완성이라는 결과를 만들어온 것처럼, 귀사에서도 채널별 일정을 충돌 없이 관리하고 성과 데이터를 체계적으로 정리해 다음 캠페인 개선으로 이어지는 사이클을 만들겠습니다.',
      rows: 4,
      referenceQuestions: ['q1_6', 'q1_7']
    },
    {
      id: 'connect_dis_recognition',
      label: '연결 ⑦→⑨: 단점 인식 + 고쳐야겠다는 결심을 자연스럽게 전환',
      hint: '"다만 이 장점이 과도해지면 [단점]이 나타납니다. [인식 경험]을 통해 알게 됐고, [결심 계기 경험]을 통해 반드시 고쳐야겠다고 결심했습니다."',
      placeholder: '예: 다만 이 장점이 과도해지면 유연성이 부족해집니다. 인턴십에서 팀 방향이 급변했을 때 기존 계획을 내려놓지 못해 혼자 뒤처졌고, 팀원이 나중에 "그때 좀 답답했어"라고 솔직하게 말해줬습니다. 내 단점이 나만의 문제가 아니라 팀 전체에 영향을 준다는 것을 그때 처음 실감하고, 반드시 고쳐야겠다고 결심했습니다.',
      rows: 4,
      referenceQuestions: ['q2_1', 'q2_2']
    },
    {
      id: 'connect_dis_growth',
      label: '연결 ⑩→⑪: 현재 관리 + 성장 증거로 마무리',
      hint: '"현재 [관리 방법]으로 매일 개선하고 있으며, [변화의 증거]가 있습니다. 이 과정이 [직무에서 어떤 강점]이 될 것입니다."',
      placeholder: "예: 현재 '플랜 B 습관'으로 매일 개선하고 있습니다. 3개월 전 30분 걸리던 대응이 지금은 5분 이내로 줄었고, 팀장님께서도 변화를 알아채셨습니다. 계획성과 유연성의 균형을 갖춰가는 이 과정이 귀사에서 더욱 빠르게 성장하는 기반이 될 것이라 확신합니다.",
      rows: 4,
      referenceQuestions: ['q2_3', 'q2_4']
    }
  ];

  // ── 헬퍼 함수 ──────────────────────────────────────────

  // ── 핸들러 ─────────────────────────────────────────────────
  const handleAnswerChange = (qid, val) => setAnswers(p => ({ ...p, [qid]: val }));
  const handleBasicInfoChange = (f, v) => setBasicInfo(p => ({ ...p, [f]: v }));
  const toggleGuide = (qid) => setShowGuide(p => ({ ...p, [qid]: !p[qid] }));
  const toggleStepSelection = (sid) => setSelectedSteps(p => p.includes(sid) ? p.filter(i => i !== sid) : [...p, sid]);

  const goToNextStep = () => {
    if (currentPhase === 'round1') { if (currentStep < round1Steps.length - 1) setCurrentStep(s => s + 1); else setCurrentPhase('evaluation'); }
    else if (currentPhase === 'evaluation') { setSelectedSteps(p => [...p].sort((a, b) => a - b)); setCurrentPhase('round2'); setCurrentStep(0); }
    else if (currentPhase === 'round2') { if (currentStep < selectedSteps.length - 1) setCurrentStep(s => s + 1); else { setCurrentPhase('round3'); setCurrentStep(0); } }
    else if (currentPhase === 'round3') { if (currentStep < round3Questions.length - 1) setCurrentStep(s => s + 1); else { setFinalText(generateFinalText()); setCurrentPhase('completed'); } }
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

  const generateFinalText = () => {
    const parts = [];
    if (answers.connect_adv_core) parts.push(answers.connect_adv_core);
    if (answers.connect_adv_evidence) parts.push('\n' + answers.connect_adv_evidence);
    if (answers.connect_adv_contribution) parts.push('\n' + answers.connect_adv_contribution);
    if (answers.connect_dis_recognition) parts.push('\n' + answers.connect_dis_recognition);
    if (answers.connect_dis_growth) parts.push('\n' + answers.connect_dis_growth);
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

    window.__CE_DOWNLOAD = { fn: () => __ceDlRef.current?.(), key: 'personality' };

    return () => { if (window.__CE_DOWNLOAD?.key === 'personality') window.__CE_DOWNLOAD = null; };

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
      
      const children = [dateP(), titleP('성격 장단점')];
      
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
        children.push(placeholderP('[성격 장단점 본문이 여기에 들어갑니다.]'));
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
        title: '성격 장단점',
        sections: [{
          properties: { page: { margin: { top: 1400, right: 1133, bottom: 1400, left: 1133 } } },
          children: children
        }]
      });
      
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `성격 장단점_${(basicInfo.company || '미입력').replace(/[^a-zA-Z0-9가-힣\s]/g, '_')}_${today}.docx`;
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
    return `원본 답변 모음\n\n[기본 정보]\n직무: ${basicInfo.position||'-'}\n회사: ${basicInfo.company||'-'}\n\n` +
    `[Q1 장점]\nQ1-1 (장점): ${answers.q1_1||'-'}\nQ1-2 (형성 계기): ${answers.q1_2||'-'}\nQ1-3 (발전 결심 계기): ${answers.q1_3||'-'}\nQ1-4 (지속성 증명): ${answers.q1_4||'-'}\nQ1-5 (STAR 성과): ${answers.q1_5||'-'}\nQ1-6 (직무 연결): ${answers.q1_6||'-'}\nQ1-7 (기여): ${answers.q1_7||'-'}\n\n` +
    `[Q2 단점]\nQ2-1 (단점+인식): ${answers.q2_1||'-'}\nQ2-2 (결심 계기): ${answers.q2_2||'-'}\nQ2-3 (현재 관리): ${answers.q2_3||'-'}\nQ2-4 (성장 증거): ${answers.q2_4||'-'}\n\n` +
    `[3라운드 연결]\n①→③ 장점+계기+발전: ${answers.connect_adv_core||'-'}\n④→⑤ 지속성+성과: ${answers.connect_adv_evidence||'-'}\n⑥→⑦ 직무연결+기여: ${answers.connect_adv_contribution||'-'}\n⑦→⑨ 단점+결심: ${answers.connect_dis_recognition||'-'}\n⑩→⑪ 관리+성장: ${answers.connect_dis_growth||'-'}`;
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

    window.__CE_HOME = { fn: () => __ceHomeRef.current?.(), key: 'personality' };

    return () => { if (window.__CE_HOME?.key === 'personality') window.__CE_HOME = null; };

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
  const CE_SYMBOL_B64 = "data:image/png;base64,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";
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
      workbookKey='personality'
      StepNavComponent={StepNavigatorDropdown}
      stepLabel='STEP 4 · 성격 장단점 작성'
      title='성격 장단점'
      subtitle='3라운드 체계적 작성으로 완성하는 성격 장단점 항목'
      flow={[
          { label: '1라운드', desc: '장단점 핵심 — Q1 장점(형성·발전·성과·연결) / Q2 단점(인지·극복·성장)' },
          { label: '2라운드', desc: '약한 부분 보강 — 부족한 답변을 심화 질문으로 구체화' },
          { label: '3라운드', desc: '연결 및 완성 — 직무 연결성 확보' },
        ]}
      flowTitle={'3라운드 작성 시스템'}
      prerequisites={[
          {
            text: '지원할 회사의 채용공고 (직무상세내용)',
            recommend: {
              workbookId: 'job_analysis',
              condition: '어떤 장점을 강조할지 막막하다면',
              linkLabel: '채용공고 분석 & 직무분석 가이드',
            },
          },
          {
            text: '장단점을 증명할 구체 경험',
            recommend: {
              workbookId: 'experience',
              condition: '경험을 아직 정리하지 못했다면',
              linkLabel: '경험정리 가이드 워크북',
            },
          },
        ]}
      helpModal={<FirstVisitModal open={showHelp} onClose={() => setShowHelp(false)} title='성격 장단점 워크북 사용 안내' steps={[
          '<strong>1라운드 → 2라운드 → 3라운드</strong> 순서로 진행하세요.',
          '장단점은 <strong>구체적 경험</strong>으로 증명하고, <strong>직무와 연결</strong>합니다.',
          '단점은 <strong>가짜 단점</strong>("너무 열심히 한다")이 아닌 진짜 개선 중인 점이어야 합니다.',
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
            <h2 style={{ ...S.h2, textAlign: 'center', marginBottom: 4 }}>성격의 장단점 완성</h2>
            <p style={S.subtitle}>아래 내용을 확인하고 자유롭게 수정하세요</p>
          </div>

          <div style={{ ...S.boxNeutral, textAlign: 'center', marginBottom: SPACING.lg }}>
            <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0 }}>
              <strong>{basicInfo.position}</strong> / <strong>{basicInfo.company}</strong>
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
                <p style={{ fontSize: FONT.size.xs, fontWeight: FONT.weight.bold, color: COLORS.accent2, margin: 0, marginBottom: SPACING.sm }}>도입부 — 장점 정의 + 증거 (Q1)</p>
                {answers.connect_adv_core && (
                  <div style={{ background: COLORS.blueBg, borderRadius: RADIUS.sm, padding: SPACING.sm, marginBottom: 6 }}>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.blue, fontWeight: FONT.weight.semibold, margin: 0 }}>연결 ①→③ (권장)</p>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.accent, margin: 0, marginTop: 4, lineHeight: FONT.lineHeight.base }}>{answers.connect_adv_core.substring(0,200)}{answers.connect_adv_core.length>200?'...':''}</p>
                  </div>
                )}
                <p style={{ fontSize: FONT.size.xs, color: COLORS.accent2, margin: 0, marginTop: SPACING.sm, fontStyle: 'italic' }}>연결 예시: "\"이 장점이 이런 상황에서 이렇게 발휘됐습니다...\""</p>
              </div>

              <div style={{ background: COLORS.bg, borderLeft: `3px solid ${COLORS.accent2}`, borderRadius: `0 ${RADIUS.sm}px ${RADIUS.sm}px 0`, padding: SPACING.base, marginBottom: SPACING.sm }}>
                <p style={{ fontSize: FONT.size.xs, fontWeight: FONT.weight.bold, color: COLORS.accent2, margin: 0, marginBottom: SPACING.sm }}>중반부 — 지속성과 성과 (Q4·Q5)</p>
                {answers.connect_adv_evidence && (
                  <div style={{ background: COLORS.blueBg, borderRadius: RADIUS.sm, padding: SPACING.sm, marginBottom: 6 }}>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.blue, fontWeight: FONT.weight.semibold, margin: 0 }}>연결 ④→⑤ (권장)</p>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.accent, margin: 0, marginTop: 4, lineHeight: FONT.lineHeight.base }}>{answers.connect_adv_evidence.substring(0,200)}{answers.connect_adv_evidence.length>200?'...':''}</p>
                  </div>
                )}
                <p style={{ fontSize: FONT.size.xs, color: COLORS.accent2, margin: 0, marginTop: SPACING.sm, fontStyle: 'italic' }}>연결 예시: "\"꾸준한 성과로 증명되었습니다...\""</p>
              </div>

              <div style={{ background: COLORS.bg, borderLeft: `3px solid ${COLORS.accent2}`, borderRadius: `0 ${RADIUS.sm}px ${RADIUS.sm}px 0`, padding: SPACING.base, marginBottom: SPACING.sm }}>
                <p style={{ fontSize: FONT.size.xs, fontWeight: FONT.weight.bold, color: COLORS.accent2, margin: 0, marginBottom: SPACING.sm }}>후반부 — 직무 기여 (Q6·Q7)</p>
                {answers.connect_adv_contribution && (
                  <div style={{ background: COLORS.blueBg, borderRadius: RADIUS.sm, padding: SPACING.sm, marginBottom: 6 }}>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.blue, fontWeight: FONT.weight.semibold, margin: 0 }}>연결 ⑥→⑦ (권장)</p>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.accent, margin: 0, marginTop: 4, lineHeight: FONT.lineHeight.base }}>{answers.connect_adv_contribution.substring(0,200)}{answers.connect_adv_contribution.length>200?'...':''}</p>
                  </div>
                )}
                <p style={{ fontSize: FONT.size.xs, color: COLORS.accent2, margin: 0, marginTop: SPACING.sm, fontStyle: 'italic' }}>연결 예시: "\"이 장점이 이 직무에서 이렇게 작용합니다...\""</p>
              </div>

              <div style={{ background: COLORS.bg, borderLeft: `3px solid ${COLORS.accent2}`, borderRadius: `0 ${RADIUS.sm}px ${RADIUS.sm}px 0`, padding: SPACING.base, marginBottom: SPACING.sm }}>
                <p style={{ fontSize: FONT.size.xs, fontWeight: FONT.weight.bold, color: COLORS.accent2, margin: 0, marginBottom: SPACING.sm }}>단점 — 인식과 결심 (Q7→Q9)</p>
                {answers.connect_dis_recognition && (
                  <div style={{ background: COLORS.blueBg, borderRadius: RADIUS.sm, padding: SPACING.sm, marginBottom: 6 }}>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.blue, fontWeight: FONT.weight.semibold, margin: 0 }}>연결 ⑦→⑨ (권장)</p>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.accent, margin: 0, marginTop: 4, lineHeight: FONT.lineHeight.base }}>{answers.connect_dis_recognition.substring(0,200)}{answers.connect_dis_recognition.length>200?'...':''}</p>
                  </div>
                )}
                <p style={{ fontSize: FONT.size.xs, color: COLORS.accent2, margin: 0, marginTop: SPACING.sm, fontStyle: 'italic' }}>연결 예시: "\"이 단점을 인식하고 이렇게 관리합니다...\""</p>
              </div>

              <div style={{ background: COLORS.bg, borderLeft: `3px solid ${COLORS.accent2}`, borderRadius: `0 ${RADIUS.sm}px ${RADIUS.sm}px 0`, padding: SPACING.base, marginBottom: SPACING.sm }}>
                <p style={{ fontSize: FONT.size.xs, fontWeight: FONT.weight.bold, color: COLORS.accent2, margin: 0, marginBottom: SPACING.sm }}>마무리 — 관리와 성장 (Q10→Q11)</p>
                {answers.connect_dis_growth && (
                  <div style={{ background: COLORS.blueBg, borderRadius: RADIUS.sm, padding: SPACING.sm, marginBottom: 6 }}>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.blue, fontWeight: FONT.weight.semibold, margin: 0 }}>연결 ⑩→⑪ (권장)</p>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.accent, margin: 0, marginTop: 4, lineHeight: FONT.lineHeight.base }}>{answers.connect_dis_growth.substring(0,200)}{answers.connect_dis_growth.length>200?'...':''}</p>
                  </div>
                )}
                <p style={{ fontSize: FONT.size.xs, color: COLORS.accent2, margin: 0, marginTop: SPACING.sm, fontStyle: 'italic' }}>연결 예시: "\"지속적으로 관리하며 성장해왔습니다...\""</p>
              </div>
            </div>

            <div style={{ ...S.boxSuccess, marginBottom: SPACING.md }}>
              <p style={{ ...labelStyle(COLORS.green), marginBottom: SPACING.sm }}>SUCCESS · 수정 전 최종 확인</p>
              <p style={{ fontSize: FONT.size.xs, color: COLORS.sub, margin: `0 0 ${SPACING.sm}px`, lineHeight: FONT.lineHeight.base }}>각 항목을 확인하며 체크하세요. 통과하지 못한 항목이 있다면 해당 Q로 돌아가 보완합니다.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { n: "①", q: "Q1: 장점이 직무와 연결되고 증거가 있는가?", miss: "Q1-1, Q1-2" },
                { n: "②", q: "Q2: 단점이 치명적이지 않고 극복 노력이 보이는가?", miss: "Q2-1, Q2-2" },
                { n: "③", q: "Q3: 장단점이 하나의 일관된 인격으로 드러나는가?", miss: "Q3-1" }
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
            <AnswerQualityCheck text={finalText} focusArea={['motivation','difficulty','number','autonomy']} />
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
              {[["position", "지원하고자 하는 직무", "예: 마케팅, 개발, 기획 등"], ["company", "지원하고자 하는 회사명", "예: 삼성전자, 네이버 등"]].map(([f, l, p]) => (
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
                        {q.relatedWorkbooks && <RelatedWorkbookInline ids={q.relatedWorkbooks} questionId={q.id || q.label} workbookKey="personality" />}
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

export default PersonalityWorkbook;
