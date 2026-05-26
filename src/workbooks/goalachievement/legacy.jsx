// [BUILD v36 20260520 10:30] docx 저장에 CareerEngineer 자료 + 멘토링 안내 섹션 추가 (ExternalHyperlink + linkP)
import React, { useState, useEffect, useRef } from 'react';
import { isWorkbookInVariant } from '../../store/schema.js';
import { COLORS, FONT, SPACING, RADIUS, MENTORING_URLS } from '../../shared/design/tokens.js';
import { buildWorkbookBackupParagraphs, buildWorkbookPayload, buildCopyrightParagraphs } from '../../store/docxBackup.js';
import { buildEssayDocxChildren } from '../../store/workbookDocx.js';
import { AnswerQualityCheck, JdBridgeGuide } from '../../shared/components/AnswerQualityCheck.jsx';
import { ReferenceInline } from '../../shared/components/ReferenceInline.jsx';
import { ExampleToggle } from '../../shared/components/ExampleToggle.jsx';
import { ToggleLink } from '../../shared/components/ToggleLink.jsx';

// 멘토링·컨설팅 URL 상수 (작업 18: URL 상수화)
// ══════════════════════════════════════════════════════════════
//  CareerEngineer 목표 수립 및 달성 워크북
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


const GoalAchievementWorkbook = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [currentPhase, setCurrentPhase] = useState('round1');
  const [currentStep, setCurrentStep] = useState(() => { try { const __d = JSON.parse(localStorage.getItem('careerengineer_goalachievement_v1') || '{}'); return (__d.basicInfo && (__d.basicInfo.industry || __d.basicInfo.position || __d.basicInfo.company)) ? 1 : 0; } catch { return 0; } });
  const [selectedSteps, setSelectedSteps] = useState([]);
  const [showGuide, setShowGuide] = useState({});
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [showRawAnswers, setShowRawAnswers] = useState(false);
  const [finalText, setFinalText] = useState('');
  const [checklistState, setChecklistState] = useState({});
  const [basicInfo, setBasicInfo] = useState({ position: '', company: '', experience: '' });
  const [answers, setAnswers] = useState({});
  const [autoSaveStatus, setAutoSaveStatus] = useState('');
  const [confirmingClear, setConfirmingClear] = useState(false);
  const [clearedFlash, setClearedFlash] = useState(false);
  const [hasRestored, setHasRestored] = useState(false);

  // 자동 저장 키
  const STORAGE_KEY = 'careerengineer_goalachievement_v1';

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
      setBasicInfo({ position: '', company: '', experience: '' });
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

  // ── 1라운드 질문 ───────────────────────────────────────────
  const round1Steps = [
    { id: 0, title: '기본 정보 입력', subtitle: '지원 직무, 회사, 목표달성 경험을 입력하세요' },
    {
      id: 1,
      title: 'Q1: 목표 정의',
      subtitle: '목표가 제대로 정의되어 있는가 — 기대효과와 도전 이유',
      questions: [
        {
          id: 'q1_1_1',
          label: 'Q1-1. 달성하려 한 목표를 구체적으로 정의해주세요.',
          hint: '단순한 다짐이 아닌 명확한 목표 — 무엇을, 언제까지, 어느 수준으로',
          guide: {
            description: '좋은 목표는 달성 여부를 객관적으로 판단할 수 있어야 합니다. "열심히 공부하겠다"가 아닌 "3개월 안에 SolidWorks로 기구 설계 프로젝트 3개 완성"처럼 수치·기한·기준이 있어야 합니다.',
            diagnosis: '즉석자가진단: "목표를 달성했는지 어떻게 판단했나요?"라고 물으면 즉답 가능한가?',
            helpQuestions: ['목표를 숫자나 기준으로 표현한다면?', '언제까지 달성하려 했나요?', '달성 여부를 어떻게 판단했나요?', '중간 목표(마일스톤)가 있었나요?'],
            ifDifficult: '"실력 향상"처럼 막연한 표현은 목표가 아닙니다. "어떤 상태가 되면 목표를 이룬 것인가?"라고 자문하며 기준을 찾아보세요.',
            ifStillDifficult: '목표 = 달성 기준 + 기한 + 수준. 이 세 가지가 모두 포함되면 제대로 정의된 목표입니다.'
          },
          placeholder: '예: 기계공학 전공이지만 실무 수준의 CAD 설계 경험이 부족했기에, 3개월 안에 SolidWorks 기초부터 실전까지 독학하여 실제 부품을 설계·3D프린팅으로 검증한 기구 설계 프로젝트 3개를 포트폴리오로 완성하는 것이 목표였습니다. 달성 기준은 "조립 공차를 직접 설정하고 간섭을 검토해 조립 가능한 설계를 독립적으로 완성할 수 있는가"였습니다.',
          rows: 4, relatedWorkbooks: ['job_analysis', 'experience', 'motivation', 'jobcompetency', 'personality', 'careergoal']
        },
        {
          id: 'q1_1_2',
          label: 'Q1-2. 이 목표를 달성했을 때 기대했던 효과는 무엇이었나요?',
          hint: '목표 달성 후 어떤 변화를 기대했는가 — 개인·직무·팀 차원',
          guide: {
            description: '기대효과는 목표를 세운 이유를 보여줍니다. "좋을 것 같아서"가 아닌, 이 목표가 달성되면 어떤 구체적인 변화가 생길지 예측했던 내용을 서술하세요.',
            diagnosis: '즉석자가진단: "왜 그 목표였나요? 다른 목표를 세워도 됐지 않나요?"라고 물으면 즉답 가능한가?',
            helpQuestions: ['이 목표를 달성하면 내 상황이 어떻게 달라질 것이라 기대했나요?', '커리어·업무·개인 성장 중 어떤 변화를 원했나요?', '이 목표가 아닌 다른 목표를 선택하지 않은 이유는?'],
            ifDifficult: '목표를 세우던 당시로 돌아가서 "이게 되면 뭐가 달라지지?"라고 생각했던 것을 떠올려보세요.',
            ifStillDifficult: '기대효과는 나중에 Q4(결과)와 연결됩니다. "예상했던 것"과 "실제로 된 것"의 비교가 스토리의 핵심입니다.'
          },
          placeholder: '예: 첫째, 기구 설계 직무 지원 자격을 갖추는 것(직무 역량 확보). 둘째, 입사 후 선배 도움 없이 CAD로 부품을 직접 설계할 수 있어 업무 의존도를 낮추는 것(업무 효율). 셋째, "혼자서도 설계 프로젝트를 끝까지 완성할 수 있다"는 것을 스스로에게 증명하는 것(자기 확신).',
          rows: 4, relatedWorkbooks: ['job_analysis', 'experience', 'motivation', 'jobcompetency', 'personality', 'careergoal']
        },
        {
          id: 'q1_1_3',
          label: 'Q1-3. 이 목표가 쉽지 않았던 이유는 무엇인가요?',
          hint: '왜 도전적인 목표였는가 — 외적 장벽과 내적 장벽 모두',
          guide: {
            description: '쉽지 않았던 이유가 구체적일수록 극복 과정의 설득력이 높아집니다. "어려웠다"가 아닌, 어떤 조건들이 이 목표를 도전적으로 만들었는지 밝히세요.',
            diagnosis: '즉석자가진단: "왜 많은 사람들이 이 목표를 포기하나요?"라고 물으면 즉답 가능한가?',
            helpQuestions: ['배경이나 조건 면에서 불리한 점이 있었나요?', '시간·자원·환경 측면의 제약이 있었나요?', '이 목표에 필요한 선행 지식이나 경험이 부족했나요?', '스스로도 "할 수 있을까" 의심했던 부분은?'],
            ifDifficult: '도전의 어려움은 크게 세 가지입니다: ① 기초/배경 부족 ② 시간·환경 제약 ③ 불확실한 성공 가능성.',
            ifStillDifficult: '이 목표를 포기하는 것이 더 편한 선택이었다면 왜 그랬는지 생각해보세요.'
          },
          placeholder: '예: 세 가지 장벽이 있었습니다. ① 실무 경험 부족: 수업에서 도면은 봤지만 실제 부품을 처음부터 설계해본 적이 없음. ② 시간 제약: 학기 중이라 하루 2~3시간만 확보 가능. ③ 불확실성: "3개월에 조립 가능한 설계 수준까지 갈 수 있는가?"라는 회의감, 주변의 "너무 이상적"이라는 반응.',
          rows: 4, relatedWorkbooks: ['experience', 'motivation', 'jobcompetency', 'personality', 'careergoal']
        }
      ]
    },
    {
      id: 2,
      title: 'Q2: 계획 수립',
      subtitle: '어떻게 달성할 것인가 — 계획의 논리와 근거',
      questions: [
        {
          id: 'q1_2_1',
          label: 'Q2-1. 목표를 달성하기 위해 수립한 계획은 무엇인가요?',
          hint: '단계별 실행 계획 — 왜 그 순서·방법을 선택했는지 포함',
          guide: {
            description: '계획은 "무엇을"만이 아니라 "왜 그 방법인가"가 함께 드러나야 합니다. 여러 선택지 중 이 방법을 택한 논리가 있어야 준비된 사람처럼 읽힙니다.',
            diagnosis: '즉석자가진단: "왜 하필 그 방법이었나요? 다른 방법은 안 됐나요?"라고 물으면 즉답 가능한가?',
            helpQuestions: ['전체 계획을 단계로 나눈다면 몇 단계였나요?', '왜 그 순서였나요? (앞 단계가 뒷 단계의 기반이 되는 이유)', '참고한 자료나 조언이 있었나요?', '대안적 접근법과 비교해서 이 방법을 택한 이유는?'],
            ifDifficult: '계획을 수립할 때 참고했던 자료(로드맵, 선배 조언 등)를 떠올려보세요.',
            ifStillDifficult: '계획의 핵심은 "논리적 순서"입니다. 왜 A를 먼저 하고 B를 나중에 했는지 인과관계로 설명해보세요.'
          },
          placeholder: '예: 3단계로 설계했습니다. 1단계(1개월): SolidWorks 기초 모델링 — 체계적 커리큘럼이 필요하다 판단해 온라인 강의 선택. 2단계(1개월): 공차·조립 구속 실습 — 실제 부품 도면으로 반복 훈련. 3단계(1개월): 실전 기구 설계 프로젝트 3개 완성. 이 순서는 현직 기구 설계 엔지니어 선배 3명에게 물어 수렴된 방식이었습니다.',
          rows: 5, relatedWorkbooks: ['career_roadmap', 'experience', 'motivation', 'jobcompetency', 'personality', 'careergoal']
        },
        {
          id: 'q1_2_2',
          label: 'Q2-2. 계획을 수립하는 과정에서 기대한 것은 무엇이었나요?',
          hint: '이 계획대로 했을 때 어떤 결과를 예상했는가 — 중간 지점의 기대',
          guide: {
            description: '"이렇게 하면 이렇게 될 것이다"라는 예측이 있었을 것입니다. 그 예측을 구체적으로 적으세요. 이것이 나중에 실제 결과와 비교되어 스토리의 깊이를 만들어냅니다.',
            diagnosis: '즉석자가진단: "계획대로 됐을 때 어떤 상태일 것이라 예상했나요?"라고 물으면 즉답 가능한가?',
            helpQuestions: ['1개월 후, 2개월 후 각각 어떤 상태일 것이라 예상했나요?', '가장 어려울 것이라 예상한 구간은?', '최종적으로 어떤 결과물이 나올 것이라 예상했나요?'],
            ifDifficult: '계획을 처음 세울 때의 기대감을 떠올려보세요.',
            ifStillDifficult: '"이 방법으로 이 기간 동안 하면 이 수준에 도달할 것"이라는 형식으로 적어보세요.'
          },
          placeholder: '예: 1단계 완료 시 기본 부품 모델링·수정 가능, 2단계 완료 시 조립 공차를 직접 설정하고 간섭을 검토 가능, 3단계 완료 시 포트폴리오 3개 완성을 기대했습니다. 가장 어려울 것이라 예상한 구간은 1→2단계 전환 시점(단품 모델링에서 조립·공차로 넘어가는 지점)이었고, 이 구간에 시간을 더 배분했습니다.',
          rows: 4, relatedWorkbooks: ['experience', 'motivation', 'jobcompetency', 'personality', 'careergoal']
        }
      ]
    },
    {
      id: 3,
      title: 'Q3: 실행과 극복',
      subtitle: '계획과 현실의 차이 — 예상치 못한 것들을 어떻게 넘었는가',
      questions: [
        {
          id: 'q1_3_1',
          label: 'Q3-1. 계획을 실행하면서 실제로 계획과 달랐던 점은 무엇이었나요?',
          hint: '예상과 현실의 차이 — 구체적인 갭과 상황',
          guide: {
            description: '"다 계획대로 됐다"는 답변은 설득력이 없습니다. 실제로 어떤 부분에서 계획이 틀어졌는지 솔직하고 구체적으로 서술하세요.',
            diagnosis: '즉석자가진단: "계획 중 가장 크게 빗나간 것은 무엇이었나요?"라고 물으면 즉답 가능한가?',
            helpQuestions: ['예상보다 훨씬 어려웠던 부분은?', '예상보다 오래 걸린 구간은?', '아예 계획에 없던 문제가 생긴 적이 있나요?', '중간에 방향을 수정한 것이 있나요?'],
            ifDifficult: '"계획에 있었던 것"과 "실제 한 것"을 나란히 비교해보세요.',
            ifStillDifficult: '가장 힘들었던 순간이 언제였는지 떠올려보세요. 그 순간이 계획과 현실의 가장 큰 갭입니다.'
          },
          placeholder: '예: 두 가지 큰 차이가 있었습니다. ① 속도 차이: 1단계를 1개월에 끝낼 계획이었지만 6주가 걸렸습니다. "조립 구속(Mate)과 공차 누적" 개념에서 일주일이 통째로 막혔기 때문입니다. ② 방법 차이: 혼자 강의를 따라가는 방식이 막힌 개념 앞에서 완전히 정체됐습니다. 계획에 없던 "질문할 사람"이 필요해졌습니다.',
          rows: 4, relatedWorkbooks: ['experience', 'motivation', 'jobcompetency', 'personality', 'careergoal']
        },
        {
          id: 'q1_3_2',
          label: 'Q3-2. 계획과 달랐던 것들을 어떻게 극복했나요?',
          hint: '극복 방법 — 시도한 것들, 실패한 것들, 결국 효과가 있었던 것',
          guide: {
            description: '처음 시도한 방법이 안 되어서 다른 방법을 쓰는 과정 자체가 스토리입니다. 한 번에 해결된 것보다 여러 시도를 거친 것이 오히려 더 설득력 있습니다.',
            diagnosis: '즉석자가진단: "처음 시도한 방법이 안 됐을 때 다음에 뭘 했나요?"라고 물으면 즉답 가능한가?',
            helpQuestions: ['가장 먼저 어떻게 해결하려 했나요?', '그 방법이 효과가 없었다면 다음에는?', '최종적으로 효과가 있었던 방법은?', '극복하고 나서 계획을 어떻게 조정했나요?'],
            ifDifficult: '"이 방법이 한계가 있어서 저 방법으로 전환했다"는 것도 훌륭한 극복입니다.',
            ifStillDifficult: '"처음 시도 → 실패 또는 한계 → 다른 방법 → 결과"의 흐름으로 적어보세요.'
          },
          placeholder: '예: 방법 문제는 세 단계로 해결했습니다. ① 캐드 사용자 커뮤니티 검색 → 내 상황과 딱 맞는 답변 없음. ② 유튜브 다른 강사 영상 → 부분적 해결. ③ 자작자동차 동아리 선배에게 도면 리뷰 요청 → 공차 설정 기준을 실물 사례로 설명받아 막힌 개념을 3시간 만에 해결. 이후 선배 리뷰가 이 프로젝트 전체에서 가장 중요한 자원이 됐습니다.',
          rows: 5, relatedWorkbooks: ['experience', 'motivation', 'jobcompetency', 'personality', 'careergoal']
        }
      ]
    },
    {
      id: 4,
      title: 'Q4: 결과와 임팩트',
      subtitle: '달성한 것과 그것이 만들어낸 변화 — 수치와 사실로',
      questions: [
        {
          id: 'q1_4_1',
          label: 'Q4-1. 목표를 달성한 결과는 어떠했나요?',
          hint: '구체적 성과 — 수치·사실·Before & After',
          guide: {
            description: '결과는 수치와 사실로 표현해야 합니다. Q1에서 정의한 달성 기준에 비춰 실제로 어떤 결과가 나왔는지를 서술하세요.',
            diagnosis: '즉석자가진단: "그 결과를 숫자로 표현한다면?"이라고 물으면 즉답 가능한가?',
            helpQuestions: ['Q1에서 정의한 목표 기준을 달성했나요?', '숫자로 표현할 수 있는 결과는?', '달성 전과 달성 후를 비교하면?', '객관적으로 증명할 수 있는 결과물이 있나요?'],
            ifDifficult: '"100% 달성"하지 못했더라도 괜찮습니다. "80% 달성, 미달된 부분은 이런 이유"처럼 솔직하게 서술하는 것이 오히려 신뢰를 줍니다.',
            ifStillDifficult: '"처음 상태"와 "지금 상태"를 비교하면 결과가 보입니다.'
          },
          placeholder: '예: 목표 대비 실제 결과: 기구 설계 프로젝트 3개 완성(목표 달성), 그중 1개는 교내 캡스톤 경진대회 우수상 수상(목표 초과). 처음에는 단품 모델링도 버벅이던 상태에서, 실제 부품을 공차까지 설정해 설계하고 3D프린팅으로 조립 검증까지 하는 수준이 됐습니다.',
          rows: 4, relatedWorkbooks: ['job_analysis', 'experience', 'motivation', 'jobcompetency', 'personality', 'careergoal']
        },
        {
          id: 'q1_4_2',
          label: 'Q4-2. 처음 목표를 수립할 때의 목적(기대효과)을 달성했나요?',
          hint: 'Q1에서 기대했던 효과가 실제로 실현됐는가 — 예상과 현실의 비교',
          guide: {
            description: 'Q1-2에서 적었던 기대효과를 다시 꺼내어, 그것이 실제로 충족됐는지 직접 비교해보세요. "기대했던 것 → 실제 된 것"의 구조로 서술하면 스토리의 완결성이 높아집니다.',
            diagnosis: '즉석자가진단: "목표를 세운 이유가 결국 해결됐나요?"라고 물으면 즉답 가능한가?',
            helpQuestions: ['기대효과를 하나씩 확인해보세요. 실현됐나요?', '기대했던 것 중 실현되지 않은 것이 있나요? 왜?', '기대하지 않았는데 생긴 긍정적 변화가 있나요?'],
            ifDifficult: '"이 목표를 왜 세웠는지" 처음으로 돌아가서 그 이유가 지금 해결됐는지 확인해보세요.',
            ifStillDifficult: '기대효과를 100% 달성하지 못했더라도 좋습니다. 왜 일부는 충족됐고 일부는 안 됐는지 분석하는 것이 오히려 더 깊은 이야기입니다.'
          },
          placeholder: '예: Q1에서 세운 세 가지 기대효과를 점검하면 — ① 직무 역량 확보: 충족. ② 업무 의존도 감소: 충족. 기구 설계 인턴 시작 후 첫 주부터 직접 부품 도면을 수정했습니다. ③ 자기 확신: 충족 이상. "혼자서도 끝까지 설계한다"를 넘어 더 큰 자신감이 생겼습니다.',
          rows: 4, relatedWorkbooks: ['job_analysis', 'experience', 'motivation', 'jobcompetency', 'personality', 'careergoal']
        },
        {
          id: 'q1_4_3',
          label: 'Q4-3. 이 목표를 달성한 것의 임팩트는 어떤 것들이 있었나요?',
          hint: '달성이 만들어낸 파급효과 — 나·주변·조직에 미친 영향',
          guide: {
            description: '임팩트는 목표 달성 자체를 넘어선 영향입니다. 나 개인에게만 그친 것인지, 주변이나 팀에도 영향을 미쳤는지 서술하세요.',
            diagnosis: '즉석자가진단: "이 결과가 당신과 주변에 어떤 영향을 미쳤나요?"라고 물으면 즉답 가능한가?',
            helpQuestions: ['나 자신에게 미친 영향은?', '주변 사람(팀원·동료·후배)에게 미친 영향은?', '이 경험으로 인해 추가로 요청받거나 인정받은 것이 있나요?'],
            ifDifficult: '임팩트가 크게 느껴지지 않아도 괜찮습니다. 작은 변화라도 구체적이고 사실적으로 서술하면 됩니다.',
            ifStillDifficult: '"이 달성이 없었다면 일어나지 않았을 일"들을 나열해보세요. 그것이 임팩트입니다.'
          },
          placeholder: '예: 세 차원의 임팩트가 있었습니다. ① 개인: "새로운 설계 툴을 혼자 익힐 수 있다"는 학습 자기효능감 확립 — 이후 공차 분석 기법을 2주 만에 실무 수준으로 독학했습니다. ② 주변: 동아리 후배 2명이 제 설계 체크리스트를 채택해 함께 프로젝트를 완성했습니다. ③ 조직: 인턴십에서 팀이 수기로 관리하던 부품 공차 검토를 표준 양식으로 정리해 검토 시간을 주간 4시간 절약하는 효과를 냈습니다.',
          rows: 5, relatedWorkbooks: ['job_analysis', 'experience', 'motivation', 'jobcompetency', 'personality', 'careergoal']
        }
      ]
    },
    {
      id: 5,
      title: 'Q5: 노력 과정',
      subtitle: '과정이 제대로 드러났는가 — 노력의 질과 방식',
      questions: [
        {
          id: 'q1_5_1',
          label: 'Q5-1. 목표를 달성하기 위해 가장 집중적으로 노력한 순간과 방식은?',
          hint: '"열심히 했다"를 넘어 — 어떤 방식으로, 어떤 강도로 노력했는가',
          guide: {
            description: '"열심히 했다"는 누구나 쓰는 표현입니다. 구체적으로 언제, 어떤 방식으로, 어떤 강도로 노력했는지가 드러나야 합니다.',
            diagnosis: '즉석자가진단: "그 기간 동안 하루 일과가 어땠나요?"라고 물으면 구체적으로 답할 수 있는가?',
            helpQuestions: ['하루 일과를 구체적으로 묘사해보면?', '가장 힘들었지만 포기하지 않았던 순간은?', '이 목표만을 위해 포기한 것이 있었나요?', '스스로 만든 규칙이나 루틴이 있었나요?'],
            ifDifficult: '일주일 중 가장 대표적인 하루를 아침부터 밤까지 묘사해보세요.',
            ifStillDifficult: '"이 정도면 충분히 열심히 했다"고 느꼈던 순간을 중심으로 쓰세요.'
          },
          placeholder: '예: 평일은 저녁 9시~자정까지 3시간, 주말은 오전 9시~오후 6시까지 9시간 집중했습니다. 스스로 세운 규칙은 "오늘 막힌 설계 문제를 이해 안 된 채로 자지 않기"였고, 이 규칙 덕분에 다음 날로 넘기는 습관을 막을 수 있었습니다.',
          rows: 4, relatedWorkbooks: ['job_analysis', 'experience', 'motivation', 'jobcompetency', 'personality', 'careergoal']
        },
        {
          id: 'q1_5_2',
          label: 'Q5-2. 이 과정에서 당신만의 차별화된 접근법이 있었다면?',
          hint: '남들과 다른 나만의 방법 — 창의적 접근이나 독특한 방식',
          guide: {
            description: '거창한 차별화가 아니어도 됩니다. 일반적인 방법에서 본인이 조금이라도 다르게 한 것, 스스로 고안한 방법이 있다면 서술하세요.',
            diagnosis: '즉석자가진단: "이 방법은 본인이 만든 건가요, 아니면 일반적인 방법인가요?"라고 물으면 즉답 가능한가?',
            helpQuestions: ['주변에서 이 방법을 보고 신기하다거나 좋다고 했던 것이 있나요?', '다른 분야에서 아이디어를 빌려온 것이 있나요?', '이 접근법이 효과적이었던 이유는?'],
            ifDifficult: '"이 방법을 남들보다 더 체계적으로 사용했다"는 것도 차별화입니다.',
            ifStillDifficult: '없어도 됩니다. Q5-1의 노력 과정이 충분히 구체적이라면 이 질문은 보조적입니다.'
          },
          placeholder: '예: 저는 설계 학습에 "교사 효과"를 적용했습니다. 매일 배운 설계 개념을 "후배도 이해할 수 있게" 노션에 정리하는 습관을 만든 것입니다. 설명문 형식으로 쓰다 보니 이해가 안 된 부분이 즉시 드러났고, 그 빈칸을 채우는 방식으로 학습 완성도가 높아졌습니다.',
          rows: 4, relatedWorkbooks: ['job_analysis', 'experience', 'motivation', 'jobcompetency', 'personality', 'careergoal']
        }
      ]
    },
    {
      id: 6,
      title: 'Q6: 배움과 기여',
      subtitle: '이 경험이 직무에서 어떤 역량이 되는가 — 연결의 논리',
      questions: [
        {
          id: 'q1_6_1',
          label: 'Q6-1. 이 목표를 세우고 달성하는 과정에서 배운 것은 무엇인가요?',
          hint: '기술적 배움과 비기술적 배움 모두 — 행동·사고·태도의 변화',
          guide: {
            description: '배움은 기술 습득만이 아닙니다. 이 과정에서 변화된 행동 방식, 사고 패턴, 태도까지 포함됩니다.',
            diagnosis: '즉석자가진단: "이 경험 이전과 이후 당신이 달라진 점은?"이라고 물으면 즉답 가능한가?',
            helpQuestions: ['기술적으로 새롭게 할 수 있게 된 것은?', '일하는 방식이나 문제를 대하는 태도가 어떻게 달라졌나요?', '실패나 계획 차질을 겪으며 배운 것은?'],
            ifDifficult: '배움을 "기술 + 방법론 + 태도" 세 가지로 나눠서 각각 한 줄씩 써보세요.',
            ifStillDifficult: '"이 경험이 없었다면 몰랐을 것"들을 나열해보세요. 그것이 배움입니다.'
          },
          placeholder: '예: 세 가지를 배웠습니다. ① 기술: SolidWorks 모델링·공차 분석 실무 활용 능력. ② 방법론: "큰 조립체를 단품 단위로 분해한 뒤 하나씩 검증하는" 문제해결 방식. ③ 태도: 설계는 한 번에 완성되지 않고 시제품 검증으로 계속 바뀌는 것이 정상이며, 변화에 맞춰 조정하는 유연성이 포기보다 훨씬 강한 전략입니다.',
          rows: 4, relatedWorkbooks: ['experience', 'self_introduction', 'motivation', 'jobcompetency', 'personality', 'careergoal']
        },
        {
          id: 'q1_6_2',
          label: 'Q6-2. 이 배움이 지원하는 직무와 어떻게 연결되나요?',
          hint: '경험 → 직무 연결 — 구체적인 업무 상황으로',
          guide: {
            description: '"도움이 될 것 같다"는 설득력이 없습니다. "이 직무의 이 업무에서 이 역량이 이렇게 쓰인다"는 구체적인 연결이 필요합니다.',
            diagnosis: '즉석자가진단: "입사 첫 달에 이 역량이 어떤 업무에서 쓰일 것 같나요?"라고 물으면 즉답 가능한가?',
            helpQuestions: ['지원 직무의 주요 업무를 꺼내어, 각 업무에 어떤 역량이 연결되는지 매핑해보세요.', '기술적 역량이 아닌 방법론·태도는 어떤 업무 상황에서 쓰일까요?', '이 역량이 없었다면 이 직무를 하는 데 어떤 한계가 있었을까요?'],
            ifDifficult: '지원 직무 채용공고의 "주요 업무" 항목을 열어두고, 각 업무에 내 역량을 1:1로 연결해보세요.',
            ifStillDifficult: '"이 역량이 있어서 이 업무를 할 수 있다" / "없었다면 이 업무를 할 수 없었을 것"이라는 문장으로 연결하세요.'
          },
          placeholder: '예: 지원 직무(기구 설계)의 주요 업무와 연결하면 — ① 부품 3D 모델링: SolidWorks 모델링 역량이 직접 연결됩니다. ② 조립 공차 검토: "조립체 분해 → 간섭 검토 → 공차 누적 분석"의 방법론이 그대로 쓰입니다. ③ 설계 문서 작성: 노션 정리 습관으로 키운 "복잡한 구조를 단순하게 설명하는 능력"이 도면·검토서 작성에 연결됩니다.',
          rows: 5, relatedWorkbooks: ['job_analysis', 'experience', 'motivation', 'jobcompetency', 'personality', 'careergoal']
        },
        {
          id: 'q1_6_3',
          label: 'Q6-3. 이렇게 체득한 역량으로 지원 직무에 어떻게 기여할 수 있나요?',
          hint: '기여의 구체적 그림 — "도움이 되겠다"가 아닌 인과의 결론',
          guide: {
            description: '기여는 의지 선언이 아닙니다. "이 역량이 있기 때문에 이 업무에서 이렇게 기여할 수 있다"는 논리적 인과관계가 보여야 합니다.',
            diagnosis: '즉석자가진단: "왜 그 기여가 가능하다고 생각하나요?"라고 물으면 경험을 근거로 즉답 가능한가?',
            helpQuestions: ['"이 역량 때문에" + "이 직무에서" + "이렇게 기여할 수 있다"를 한 문장으로 써보세요.', '기여의 근거가 "열심히 하겠다"가 아닌 "이미 해봤다"는 경험에 있나요?', '지금 부족한 역량은 무엇이고, 일하면서 어떻게(방법·기간) 채워 기여를 넓힐 건가요?'],
            ifDifficult: 'Q6-2에서 연결한 직무-역량 연결을 다시 보고, "지금 할 수 있는 기여 + 부족한 건 채우며 넓힐 기여"로 이어보세요.',
            ifStillDifficult: '"이 경험 덕분에 이 직무에서 하지 않아도 되는 실수"가 있다면 그것도 기여입니다.'
          },
          placeholder: '예: "CAD 설계 독학으로 기구 프로젝트 3개 완성" 경험이 세 가지 기여로 이어집니다. ① 지금 할 수 있는 기여: 입사 직후부터 SolidWorks로 독립적인 부품 모델링·공차 검토가 가능해 선임 의존 없이 단품 설계를 맡을 수 있습니다. ② 방법론 기여: "설계 → 시제품 검증 → 차이 발견 → 보완" 사이클로 처음 맡는 부품도 단계적으로 접근합니다. ③ 부족한 역량을 채우며 넓히는 기여: 아직 약한 FEA 구조해석은 사내 해석 실무와 강의를 병행하며 6개월 안에 보완해, 단순 형상 설계를 넘어 강성·내구까지 검증하는 설계까지 기여 범위를 넓히겠습니다.',
          rows: 5, relatedWorkbooks: ['job_analysis', 'experience', 'motivation', 'jobcompetency', 'personality', 'careergoal']
        }
      ]
    }
  ];

  // ── 2라운드 심화 질문 ──────────────────────────────────────
  const round2Questions = {
    1: [
      {
        id: 'q2_1_1',
        label: 'Q1 심화-1. 이 목표를 세우게 된 결정적 순간을 장면으로 묘사해보세요.',
        hint: '날짜·장소·대화·감정 — 영화의 한 씬처럼',
        guide: {
          description: '목표의 출발점이 되는 순간을 생생하게 묘사하면 읽는 사람이 공감합니다.',
          diagnosis: '즉석자가진단: "그날 뭘 보거나 들었나요?"라고 물으면 즉답 가능한가?',
          helpQuestions: ['정확히 어디에서였나요?', '무엇을 보거나 듣고 결심했나요?', '그 순간 어떤 감정이었나요?'],
          ifDifficult: '"이대로는 안 되겠다"는 생각이 든 순간을 떠올려보세요.',
          ifStillDifficult: '정확한 날짜가 기억 안 나도 됩니다. 어떤 상황이었는지 상황을 중심으로 묘사해보세요.'
        },
        placeholder: '예: 2023년 9월 첫 주 월요일, 전공 수업에서 교수님이 SolidWorks로 조립체를 화면에 띄우셨을 때입니다. 옆자리 친구는 "이거 저번에 해봤는데 쉽던데"라고 속삭였고, 저는 화면에 있는 게 무엇인지조차 몰랐습니다. "이대로 졸업하면 나는 기구 설계 엔지니어가 될 수 없겠구나"라는 생각이 들었습니다.',
        rows: 5, relatedWorkbooks: ['job_analysis', 'experience', 'motivation', 'jobcompetency', 'personality', 'careergoal']
      },
      {
        id: 'q2_1_2',
        label: 'Q1 심화-2. 이 목표 대신 더 쉬운 선택지가 있었다면 왜 이 목표를 택했나요?',
        hint: '목표 선택의 이유 — 쉬운 길을 두고 어려운 길을 택한 이유',
        guide: {
          description: '"더 쉬운 선택지가 있었는데도 이것을 택했다"는 논리가 가치관을 드러냅니다.',
          diagnosis: '즉석자가진단: "왜 그냥 더 쉬운 방법을 택하지 않았나요?"라고 물으면 즉답 가능한가?',
          helpQuestions: ['더 쉬운 선택지는 무엇이었나요?', '그 선택지를 택하지 않은 이유는?', '이 어려운 목표를 택하게 만든 가치관이나 신념은?'],
          ifDifficult: '"안 했다면 후회했을까요?"라고 자문해보세요.',
          ifStillDifficult: '목표 달성 후 "이걸 안 했다면 어떻게 됐을까"를 생각해보고 역으로 서술해보세요.'
        },
        placeholder: '예: 더 쉬운 선택지는 "한 달 학원 등록으로 CAD 자격증(GSDM)만 취득"하는 것이었습니다. 기간도 1개월로 짧고 합격 여부도 명확해 안전했습니다. 그럼에도 "3개월·프로젝트 3개 완성"이라는 더 어려운 목표를 택한 이유는, 현직 기구 설계 엔지니어 3명에게 물었을 때 "자격증은 기초 증명일 뿐 실제 조립 공차를 설정한 도면이 없으면 신입 평가에서 변별력이 없다"는 공통된 답을 들었기 때문입니다. 저는 "남들과 같은 자격증 한 줄"보다 "혼자 끝까지 완성한 결과물"로 증명하는 것을 우선하는 가치관을 가지고 있어, 2개월 더 걸리더라도 포트폴리오를 택했습니다. 결과적으로 인턴 면접에서 면접관이 자격증이 아닌 공차 설정 방식을 집중적으로 물었고, 이 선택이 옳았음을 확인했습니다.',
        rows: 4, relatedWorkbooks: ['career_roadmap', 'job_analysis', 'motivation', 'jobcompetency', 'personality', 'careergoal']
      }
    ],
    2: [
      {
        id: 'q2_2_1',
        label: 'Q2 심화-1. 계획을 수립하는 과정에서 고려하고 버린 대안들은 무엇이었나요?',
        hint: '선택하지 않은 방법들 — 왜 버렸는가',
        guide: {
          description: '고려했지만 버린 대안들을 함께 서술하면 계획의 논리가 더 강해집니다.',
          diagnosis: '즉석자가진단: "다른 방법도 있었을 텐데 왜 이 방법이었나요?"라고 물으면 즉답 가능한가?',
          helpQuestions: ['처음에 고려했다가 포기한 방법은?', '그 방법을 버린 이유는?', '최종적으로 선택한 방법의 장점은?'],
          ifDifficult: '계획을 세울 때 "이렇게 할까, 저렇게 할까" 고민했던 것을 떠올려보세요.',
          ifStillDifficult: '오프라인 학원 vs 온라인 독학, 자격증 vs 프로젝트 등 일반적인 선택지와 비교해보세요.'
        },
        placeholder: '예: "3개월·하루 2~3시간·비용 최소"라는 제약을 기준으로 세 가지 대안을 검토하고 버렸습니다. ① 오프라인 CAD 학원: 정해진 시간표가 학기 중 수업과 겹쳐 시간 확보 불가로 제외. ② 설계 부트캠프: 비용 200만원 이상으로 예산 초과. ③ 유튜브 무료 독학: 무료지만 커리큘럼이 없어 "조립 공차" 같은 핵심 개념을 건너뛸 위험이 컸습니다. 최종 선택(월 3만원대 유료 온라인 강의로 체계를 잡고 + 동아리 선배 도면 리뷰로 막힌 부분 해소)은 비용·시간·체계라는 세 가지 약점을 모두 보완하면서 목표 기한 안에 들어맞는 유일한 조합이었습니다.',
        rows: 4, relatedWorkbooks: ['experience', 'motivation', 'jobcompetency', 'personality', 'careergoal']
      },
      {
        id: 'q2_2_2',
        label: 'Q2 심화-2. 계획을 수립할 때 참고한 정보나 조언이 있나요?',
        hint: '근거 있는 계획 — 어떤 정보를 어떻게 수집했는가',
        guide: {
          description: '누구에게 물어봤는지, 어떤 자료를 참고했는지가 드러나면 계획 수립 능력이 증명됩니다.',
          diagnosis: '즉석자가진단: "그 계획이 옳다는 것을 어떻게 알았나요?"라고 물으면 즉답 가능한가?',
          helpQuestions: ['현직자, 선배, 커뮤니티 등 누군가에게 조언을 구했나요?', '참고한 로드맵이나 자료가 있나요?', '그 정보가 계획에 어떻게 반영됐나요?'],
          ifDifficult: '유튜브 추천 영상, 블로그 로드맵, 커뮤니티 글도 모두 참고 자료입니다.',
          ifStillDifficult: '아무런 참고 없이 계획을 세운 사람은 없습니다. 아주 작은 것이라도 참고한 것을 떠올려보세요.'
        },
        placeholder: '예: 세 갈래로 근거를 모아 계획에 반영했습니다. ① 현직 기구 설계 엔지니어 선배 3명에게 "처음 CAD 독학 시 가장 비효율적이었던 방법이 무엇이었나요?"라고 물었고, "공차 개념 없이 모델링부터 손댔다가 다시 처음부터 했다"는 답이 공통적이어서 "기초 모델링 → 공차·조립 → 실전 프로젝트" 순서를 확정했습니다. ② "기구 설계 독학 로드맵" 블로그 5개를 비교해 공통 학습 순서와 각 단계 평균 소요 기간을 표로 정리했고, 이를 근거로 단계별 한 달씩 배분했습니다. ③ 실제 신입 공고 10개의 자격요건을 정리해 "SolidWorks 조립·공차 검토 가능"이 최다 등장한다는 것을 확인하고, 이를 목표 달성 기준으로 설정했습니다. 막연한 감이 아니라 사람·자료·시장이라는 세 출처가 같은 결론을 가리킨 덕분에 계획에 확신을 가질 수 있었습니다.',
        rows: 5, relatedWorkbooks: ['job_analysis', 'experience', 'motivation', 'jobcompetency', 'personality', 'careergoal']
      }
    ],
    3: [
      {
        id: 'q2_3_1',
        label: 'Q3 심화-1. 계획이 틀어진 순간을 가장 생생하게 묘사해보세요.',
        hint: '그 순간의 상황·감정·생각 — 구체적인 장면으로',
        guide: {
          description: '위기의 순간을 생생하게 묘사할수록 극복의 의미가 커집니다.',
          diagnosis: '즉석자가진단: "그때 어떤 생각을 했나요?"라고 물으면 즉답 가능한가?',
          helpQuestions: ['정확히 어떤 상황이었나요?', '그 순간 어떤 생각이 들었나요?', '"포기할까"라는 생각이 든 적이 있나요?'],
          ifDifficult: '가장 힘들었던 밤을 떠올려보세요.',
          ifStillDifficult: '계획이 예상대로 안 됐을 때 처음 느낀 감정부터 시작해보세요.'
        },
        placeholder: '예: "3개월에 설계 프로젝트 3개"라는 목표가 가장 흔들렸던 순간은 3주차 금요일 밤 11시였습니다. 조립체에서 같은 부품끼리 부딪히는 간섭 오류를 6시간째 잡고 있었고, 같은 구속(Mate)을 풀었다 걸기를 스무 번 넘게 반복해도 빨간 경고가 사라지지 않았습니다. "나는 이 분야에 재능이 없는 게 아닐까", "한 달 안에 끝낼 계획이었는데 첫 단계도 못 넘기는구나"라는 생각이 처음으로 들었습니다. 노트북을 덮고 한참을 멍하니 앉아 있었는데, 결국 "내일 선배에게 도면을 보여주고 물어보자"고 메모를 남기고서야 잠들 수 있었던, 계획이 가장 크게 틀어졌다고 느낀 밤이었습니다.',
        rows: 4, relatedWorkbooks: ['experience', 'motivation', 'jobcompetency', 'personality', 'careergoal']
      },
      {
        id: 'q2_3_2',
        label: 'Q3 심화-2. 극복 과정에서 처음에 시도한 방법이 실패했다면 어떻게 됐나요?',
        hint: '시행착오 — 처음 시도가 안 됐을 때 어떻게 했는가',
        guide: {
          description: '극복이 한 번에 된 것보다 여러 번의 시도를 거친 것이 더 강합니다.',
          diagnosis: '즉석자가진단: "처음 시도한 방법이 안 됐을 때 어떻게 했나요?"라고 물으면 즉답 가능한가?',
          helpQuestions: ['처음에 어떻게 해결하려 했나요?', '두 번째, 세 번째로 무엇을 시도했나요?', '최종적으로 효과가 있었던 방법을 찾기까지 얼마나 걸렸나요?'],
          ifDifficult: '극복에 사용한 방법이 여러 개라면 시간 순서대로 나열해보세요.',
          ifStillDifficult: '"처음 시도 → 결과 → 다음 시도 → 결과"의 반복으로 서술해보세요.'
        },
        placeholder: '예: ① 혼자 구글링(3시간) → 내 간섭 오류와 같은 케이스 없음. ② 공식 도움말 탐독(1시간) → 더 혼란스러워짐. ③ 동아리 단체 채팅방에 도면 캡처와 함께 질문 게시 → 30분 후 선배가 조립 구속 설정 오류를 짚어줌 → 해결. 결국 "혼자 해결"의 한계를 인정하고 질문하는 것이 최선이었다는 교훈을 얻었습니다.',
        rows: 4, relatedWorkbooks: ['experience', 'motivation', 'jobcompetency', 'personality', 'careergoal']
      }
    ],
    4: [
      {
        id: 'q2_4_1',
        label: 'Q4 심화-1. 기대효과 중 충족되지 않은 것이 있다면 왜 그랬나요?',
        hint: '미달된 기대효과 분석 — 솔직한 평가',
        guide: {
          description: '기대효과를 100% 달성하지 못한 것이 있다면 솔직하게 인정하고 이유를 분석하는 것이 신뢰를 높입니다.',
          diagnosis: '즉석자가진단: "기대했던 것 중 아직 안 된 것이 있나요?"라고 물으면 솔직하게 즉답 가능한가?',
          helpQuestions: ['기대효과 목록을 다시 보면 달성되지 않은 것이 있나요?', '왜 그것이 달성되지 않았나요?', '앞으로 달성하기 위한 계획이 있나요?'],
          ifDifficult: '모든 기대효과가 달성됐다면 "예상보다 더 큰 효과가 있었던 것"을 서술해보세요.',
          ifStillDifficult: '기대했던 것과 실제 결과 사이의 갭을 솔직하게 비교해보세요.'
        },
        placeholder: '예: "한 달 만에 실무 설계 가능한 수준 도달"이라는 초기 기대는 미달됐습니다. 단품 모델링까지는 한 달에 됐지만, 조립 공차와 간섭 검토까지 자립적으로 하는 수준은 결국 3개월이 걸렸고 인턴 면접 통과까지는 6개월이 필요했습니다. 원인을 분석해보니 "강의 한 번 들으면 할 수 있다"고 학습 곡선을 단순하게 잡았던 탓이었습니다. 최종 목표(프로젝트 3개 완성)는 달성했지만, 이 경험으로 "일정은 가장 어려운 단계 기준으로 1.5배 여유를 둔다"는 기준을 얻어 이후 공차 분석 독학 계획에는 처음부터 버퍼를 반영했습니다.',
        rows: 4, relatedWorkbooks: ['job_analysis', 'experience', 'motivation', 'jobcompetency', 'personality', 'careergoal']
      },
      {
        id: 'q2_4_2',
        label: 'Q4 심화-2. 이 달성이 다음 목표나 도전에 어떤 영향을 미쳤나요?',
        hint: '연쇄 임팩트 — 이 경험이 만들어낸 다음 변화',
        guide: {
          description: '하나의 목표 달성이 다음 도전에 영향을 미쳤다면 임팩트가 더 깊어집니다.',
          diagnosis: '즉석자가진단: "이 경험 덕분에 그다음에 무엇을 다르게 했나요?"라고 물으면 즉답 가능한가?',
          helpQuestions: ['이 경험이 없었다면 시도하지 않았을 다음 도전이 있나요?', '이 경험의 방법론을 다른 목표에 적용한 것이 있나요?'],
          ifDifficult: '이 경험 이후 달라진 행동이나 결정이 있다면 무엇인지 떠올려보세요.',
          ifStillDifficult: '이 목표 달성에서 쓴 방법(수치화·단계 분해·질문 등) 중 다른 도전에도 옮겨 쓴 것이 있는지 찾아보세요.'
        },
        placeholder: '예: CAD 독학 성공이 두 가지 연쇄 도전으로 이어졌습니다. ① 곧바로 다음 목표를 "2주 안에 공차 분석(Tolerance Stack-up) 기법을 실무 수준으로 익힌다"로 수치화해 세웠고, CAD 때 검증된 "큰 개념을 단품 단위로 쪼개 하나씩 검증" 방식을 그대로 적용해 14일 만에 달성했습니다. CAD 독학으로 "낯선 영역도 단계로 나누면 된다"는 자신감이 없었다면 시도조차 안 했을 도전입니다. ② 취업 준비 자체에도 같은 방법론을 옮겨, "막연히 열심히"가 아니라 "3개월간 서류 합격률 50% 달성"이라는 수치 목표와 주차별 점검표로 관리했습니다. 결과적으로 하나의 목표 달성법이 이후 모든 도전의 공통 운영체제가 됐습니다.',
        rows: 4, relatedWorkbooks: ['experience', 'motivation', 'jobcompetency', 'personality', 'careergoal']
      }
    ],
    5: [
      {
        id: 'q2_5_1',
        label: 'Q5 심화-1. 가장 포기하고 싶었던 순간과 그것을 이겨낸 이유는?',
        hint: '한계점에서의 선택 — 포기하지 않은 이유',
        guide: {
          description: '포기하고 싶었던 순간이 있었다는 것 자체가 이 목표가 진짜 도전이었음을 증명합니다.',
          diagnosis: '즉석자가진단: "왜 그때 포기하지 않았나요?"라고 물으면 즉답 가능한가?',
          helpQuestions: ['가장 포기하고 싶었던 순간은 언제였나요?', '그 순간 무슨 생각이 들었나요?', '포기하지 않은 결정적 이유는?'],
          ifDifficult: '포기하고 싶다는 생각이 구체적으로 든 날이 있었나요?',
          ifStillDifficult: '"계속해야 할 이유"를 스스로에게 말했던 것을 떠올려보세요.'
        },
        placeholder: '예: 가장 포기하고 싶었던 순간은 4주차, "1단계를 1개월에"라는 계획이 2주나 밀렸을 때입니다. 진도표를 보니 남은 기간으로는 프로젝트 3개는커녕 1개도 못 끝낼 것 같았고, 실제로 이틀 동안 CAD를 아예 켜지 않았습니다. 그때 이겨낸 결정적 이유는 두 가지였습니다. 첫째, "3개월 안에 설계 포트폴리오로 내 실력을 증명한다"는 목표를 세운 이유 자체 — 자격증만으로는 증명되지 않더라는 현직자 조언 — 가 여전히 유효했기 때문입니다. 둘째, 목표를 통째로 보지 않고 "오늘 30분만, 막힌 간섭 오류 하나만"으로 잘게 쪼개 자신과 타협한 덕분입니다. 그 30분이 2시간이 됐고, 다음 날 다시 책상에 앉으면서 결국 1단계를 6주 만에 마무리했습니다.',
        rows: 4, relatedWorkbooks: ['career_roadmap', 'experience', 'motivation', 'jobcompetency', 'personality', 'careergoal']
      },
      {
        id: 'q2_5_2',
        label: 'Q5 심화-2. 이 과정에서 당신의 노력을 인정해준 사람이나 순간이 있었나요?',
        hint: '외부 인정 — 주변의 반응과 피드백',
        guide: {
          description: '자신의 노력이 외부에서 어떻게 인식됐는지를 서술하면 객관성이 생깁니다.',
          diagnosis: '즉석자가진단: "이 과정을 주변에서 어떻게 봤나요?"라고 물으면 즉답 가능한가?',
          helpQuestions: ['누군가가 이 노력을 직접 언급하거나 인정한 적이 있나요?', '이 경험으로 인해 어떤 요청이나 제안을 받은 적이 있나요?'],
          ifDifficult: '"대단하다", "어떻게 했어?"라는 말도 인정입니다.',
          ifStillDifficult: '주변의 반응이 없었다면 그것도 솔직하게 쓰고, 스스로 느낀 성취감을 서술해도 됩니다.'
        },
        placeholder: '예: 세 순간이 노력을 객관적으로 비춰줬습니다. ① 자작자동차 동아리 선배가 제 도면을 보고 "니 정리 방식이 신입들 보기에 제일 이해하기 쉽다"며 다음 설계 리뷰 발표를 맡아달라 요청했고, 이후 후배 2명이 제 체크리스트를 그대로 가져다 썼습니다. ② 인턴십 면접에서 포트폴리오를 넘기던 면접관이 "이거 정말 혼자 한 거 맞아요? 공차 설정이 신입치고 이상하게 꼼꼼하네요"라고 물었습니다. ③ 캡스톤 경진대회 심사위원이 "조립 검증까지 한 점"을 우수상 선정 이유로 언급했습니다. 스스로는 "겨우 따라간다"고 느꼈던 과정이, 결과물을 본 사람들에게는 "꼼꼼함"과 "이해하기 쉬운 정리력"으로 읽힌다는 것을 외부 반응으로 확인했습니다.',
        rows: 4, relatedWorkbooks: ['interview_new', 'interview_career', 'motivation', 'jobcompetency', 'personality', 'careergoal']
      }
    ],
    6: [
      {
        id: 'q2_6_1',
        label: 'Q6 심화-1. 이 경험에서 배운 방법론을 다른 상황에 적용한 사례가 있나요?',
        hint: '범용성 증명 — 한 번만 쓴 것이 아닌 반복 활용',
        guide: {
          description: '배운 방법론이 다른 상황에서도 적용됐다면, 그것이 단순한 운이 아닌 진짜 역량임을 증명합니다.',
          diagnosis: '즉석자가진단: "이 방법을 다른 곳에도 썼나요?"라고 물으면 즉답 가능한가?',
          helpQuestions: ['이 경험의 방식을 다른 학업·취업·일상에 적용한 것이 있나요?', '같은 방법으로 다른 목표도 달성한 것이 있나요?'],
          ifDifficult: '이 경험 이후에 시도한 다른 도전들을 떠올려보세요.',
          ifStillDifficult: '아직 다른 곳에 적용하지 못했다면, 앞으로 이 직무에서 어떻게 적용할지를 서술해도 됩니다.'
        },
        placeholder: '예: 같은 방법론을 세 번 반복 적용해 범용성을 검증했습니다. ① 공차 분석 학습: CAD 때의 "단계별로 쪼개 하나씩 검증" 방식을 그대로 적용해 2주 만에 실무 수준에 도달했습니다. ② 취업 준비: "목표 수치화"를 적용해 "3개월 서류 합격률 50%"를 목표로 잡고 주차별 결과를 기록·조정해 실제 48%를 달성했습니다. ③ 동아리 신규 부품 설계: "막히면 결과물을 들고 질문" 원칙으로 2주 일정 안에 마쳤습니다. 세 번 모두 성공하면서, 제가 익힌 것이 "한 번의 운"이 아니라 어떤 새 과제에도 적용 가능한 재현성 있는 일하는 방식이라는 확신을 얻었습니다.',
        rows: 4, relatedWorkbooks: ['job_analysis', 'experience', 'motivation', 'jobcompetency', 'personality', 'careergoal']
      },
      {
        id: 'q2_6_2',
        label: 'Q6 심화-2. 이 역량으로 입사 후 실제로 어떤 업무에 기여할 수 있는지 구체적으로 그려보세요.',
        hint: '입사 후 첫 3개월 시나리오 — 구체적 업무 상황',
        guide: {
          description: '"잘 할 수 있을 것 같다"가 아닌 실제 업무 시나리오로 기여를 그려보세요.',
          diagnosis: '즉석자가진단: "입사 첫 주에 어떤 업무를 독립적으로 할 수 있나요?"라고 물으면 즉답 가능한가?',
          helpQuestions: ['지원 직무 채용공고의 주요 업무 3가지를 적어보세요.', '그 업무 각각에 내 역량이 어떻게 연결되나요?', '처음 맡게 될 업무에서 남들보다 빠르게 기여할 수 있는 것은?'],
          ifDifficult: '지원 직무의 일상적인 하루 업무를 상상해보고, 내가 바로 할 수 있는 것을 찾아보세요.',
          ifStillDifficult: '"이 역량이 없는 신입과 있는 신입의 첫 3개월 차이"를 상상해보고 그 차이를 서술해보세요.'
        },
        placeholder: '예: 입사 후 첫 3개월을 단계로 그려보면 — ① 1개월차: 팀의 단품 부품 설계를 맡아 SolidWorks로 모델링하고 조립 간섭·공차를 검토해 선임 의존 없이 독립적으로 완성합니다. 이미 프로젝트 3개로 검증한 작업이라 적응 기간이 짧습니다. ② 2개월차: 동아리에서 후배 2명이 채택했던 "공차 체크리스트"를 팀 양식에 맞게 다듬어, 신입이 자주 놓치는 간섭 검토 항목을 표준화합니다. ③ 3개월차: 반복되는 유사 부품에 설계 템플릿을 만들어, 인턴 때 수기 공차 검토를 표준 양식화해 주간 4시간을 절약했던 것처럼 팀 검토 시간을 정량적으로 줄이는 기여를 목표로 합니다. 이 역량이 없는 신입은 첫 3개월을 툴 적응에 쓰지만, 저는 그 기간을 "표준을 만드는 데" 쓸 수 있다는 점이 차이입니다.',
        rows: 5, relatedWorkbooks: ['job_analysis', 'motivation', 'jobcompetency', 'personality', 'careergoal']
      }
    ]
  };

  // ── 3라운드 연결 질문 ──────────────────────────────────────
  const round3Questions = [
    {
      id: 'connect_q1q2',
      label: '연결 Q1→Q2: 목표 정의에서 계획 수립으로',
      hint: 'Q1에서 정의한 목표와 기대효과가 Q2의 계획으로 어떻게 논리적으로 이어지나요? "이 목표였기 때문에 이 계획이었다"는 연결이 드러나야 합니다.',
      placeholder: '예: 제 목표는 "3개월 안에 SolidWorks를 독학해 조립 공차까지 직접 설정한 기구 설계 프로젝트 3개를 완성한다"는 수치형 목표였고, 그 이유는 자격증만으로는 "할 수 있다"가 증명되지 않는다는 현직자 조언에 있었습니다. 이 목표가 "수강"이 아니라 "결과물"을 요구했기 때문에, 계획도 자연스럽게 강의 듣기에 머무르지 않고 1단계 기초 모델링·2단계 공차와 조립 구속·3단계 실전 프로젝트 3개라는 결과물 중심 3단계로 설계됐습니다. 즉 "무엇을 만들어야 하는가"라는 목표가 "어떤 순서로 만들 것인가"라는 계획을 결정한 것이며, 한 달에 한 단계씩이라는 기한도 3개월이라는 목표 기간을 단계별로 나눈 결과였습니다.',
      rows: 4,
      referenceSteps: [1, 2],
      referenceQuestions: ['q1_1_1', 'q1_1_2', 'q1_2_1']
    },
    {
      id: 'connect_q2q3',
      label: '연결 Q2→Q3: 계획에서 실행·극복으로',
      hint: 'Q2의 계획이 Q3에서 현실과 부딪혔을 때 어떻게 연결되나요? "계획대로 됐다"가 아닌 "계획과 달랐고, 그래서 이렇게 했다"는 인과 흐름이 중요합니다.',
      placeholder: '예: "한 달에 1단계씩, 혼자 강의를 따라간다"는 계획은 2단계인 조립 공차 구간에서 그대로 무너졌습니다. 1단계가 계획보다 2주 밀려 6주가 걸렸고, "조립 구속과 공차 누적" 개념 앞에서는 강의를 다시 돌려봐도 일주일째 진도가 멈췄기 때문입니다. 계획에 없던 "막혔을 때 물어볼 사람"이 필요하다는 것을 그때 깨달았고, 그래서 동아리 선배에게 도면 리뷰를 요청하는 방식으로 계획을 수정했습니다. 결과적으로 혼자 6시간 붙잡던 간섭 오류를 선배 리뷰로 3시간 만에 풀었고, 이 "막히면 결과물을 들고 질문한다"는 보완책이 이후 3단계 프로젝트 전체에서 가장 핵심적인 자원이 됐습니다. 즉 계획이 틀어진 지점이 오히려 더 나은 방법을 찾게 한 계기였습니다.',
      rows: 4,
      referenceSteps: [2, 3],
      referenceQuestions: ['q1_2_1', 'q1_2_2', 'q1_3_1']
    },
    {
      id: 'connect_q3q4',
      label: '연결 Q3→Q4: 극복에서 결과·임팩트로',
      hint: 'Q3의 극복 과정이 Q4의 결과와 임팩트로 어떻게 이어지나요? 극복의 방식이 결과의 질을 어떻게 높였는지 연결하세요.',
      placeholder: '예: 막힐 때마다 "결과물을 들고 선배에게 묻는다"는 방식으로 극복한 것이 결과의 질을 직접 높였습니다. 혼자였다면 어설프게 넘어갔을 공차 설정 기준을 실물 사례로 배운 덕분에, 최종 프로젝트 3개는 단순히 "완성"에 그치지 않고 조립 공차까지 검토된 도면이 됐고 그중 1개는 교내 캡스톤 경진대회 우수상을 받아 목표를 초과 달성했습니다. 더 나아가 이 극복 과정 자체가 예상 밖 임팩트로 이어졌는데, 선배가 "네 도면 정리 방식이 제일 이해하기 쉽다"며 설계 리뷰 발표를 맡겼고, 인턴 면접관은 "공차 설정이 신입치고 이상하게 꼼꼼하다"고 평했습니다. 혼자 끝까지 버텼다면 결과물도 평범했을 것이고, 막혔을 때 질문하는 법을 익혔기에 결과와 주변의 인정이라는 두 가지 임팩트가 함께 따라왔습니다.',
      rows: 4,
      referenceSteps: [3, 4],
      referenceQuestions: ['q1_3_1', 'q1_3_2', 'q1_4_1']
    },
    {
      id: 'connect_q4q6',
      label: '연결 Q4→Q6: 결과·임팩트에서 배움과 기여로',
      hint: 'Q4의 결과와 임팩트가 Q6의 배움 및 직무 기여로 어떻게 이어지나요? "이 경험 덕분에 이것을 배웠고, 그래서 이 직무에서 이렇게 기여할 수 있다"는 흐름이 핵심입니다.',
      placeholder: '예: 프로젝트 3개 완성과 경진대회 우수상이라는 결과보다 더 오래 남은 것은 "큰 조립체를 단품으로 분해해 하나씩 검증하고, 막히면 결과물을 들고 질문해 보완한다"는 학습 방법 자체였습니다. 실제로 이 방법을 그대로 적용해 공차 분석 기법을 2주 만에 실무 수준으로 독학했는데, 이는 제가 익힌 것이 SolidWorks 사용법이라는 단발 기술이 아니라 "낯선 설계 영역을 스스로 익히는 방법"이라는 증거입니다. 기구 설계 직무는 신입에게도 새 부품·새 해석 툴을 끊임없이 익힐 것을 요구하기에, 이 "분해해서 단계로 익히고 검증으로 보완하는" 역량은 입사 후 가장 빠르게 발휘됩니다. 구체적으로는 처음 맡는 부품도 설계→시제품 검증→차이 발견→보완 사이클로 접근해 선임 의존을 줄이며 기여하고, 아직 약한 FEA 구조해석도 같은 방식으로 6개월 안에 보완해 기여 범위를 넓히겠습니다.',
      rows: 5,
      referenceSteps: [4, 6],
      referenceQuestions: ['q1_4_1', 'q1_4_3', 'q1_6_1', 'q1_6_2']
    },
    {
      id: 'connect_full',
      label: '최종 연결: 전체 흐름으로 스토리 완성',
      hint: '목표 정의 → 계획 → 실행·극복 → 결과·임팩트 → 배움·기여의 전체 흐름을 하나의 완결된 스토리로 연결하세요.',
      placeholder: '예: 저는 자격증 한 줄보다 "혼자 끝까지 완성한 결과물"로 실력을 증명하려 했습니다. 기계공학 전공이지만 실무 CAD 경험이 없었기에, "3개월 안에 SolidWorks를 독학해 조립 공차까지 직접 설정한 기구 설계 프로젝트 3개를 완성한다"는 수치형 목표를 세웠습니다(목표). 목표가 "수강"이 아니라 "결과물"을 요구했기에 계획도 결과물 중심 3단계(기초 모델링 → 공차·조립 → 실전 프로젝트 3개)로, 현직자 3명의 조언과 신입 공고 10개 분석을 근거로 한 달씩 배분해 설계했습니다(계획). 그러나 2단계 공차 구간에서 계획은 무너졌고, 6시간을 붙잡아도 풀리지 않던 간섭 오류 앞에서 "혼자 강의만 따라간다"는 방식의 한계를 인정했습니다. 그래서 동아리 선배에게 도면을 들고 질문하는 방식으로 계획을 수정했고, 막힌 개념을 3시간 만에 풀었습니다(실행·극복). 이 "막히면 결과물을 들고 질문한다"는 보완책 덕분에 프로젝트 3개는 단순 완성을 넘어 공차까지 검토된 도면이 됐고, 그중 하나는 캡스톤 경진대회 우수상을 받아 목표를 초과 달성했으며, 선배는 발표를, 면접관은 "신입치고 꼼꼼한 공차 설정"을 인정해줬습니다(결과·임팩트). 무엇보다 제가 얻은 것은 SolidWorks 사용법이 아니라 "낯선 영역을 단계로 쪼개 익히고 막히면 질문해 보완하는" 일하는 방식이었고, 이를 그대로 적용해 공차 분석을 2주 만에 독학했습니다. 기구 설계 직무는 신입에게도 끊임없이 새 부품과 새 툴을 요구하기에, 입사 후 이 역량으로 처음 맡는 부품도 설계→검증→보완 사이클로 독립 수행하고, 아직 약한 FEA 구조해석도 같은 방식으로 6개월 안에 보완해 기여 범위를 넓히겠습니다(배움·기여).',
      rows: 8,
      referenceSteps: [1, 2, 3, 4, 5, 6],
      referenceQuestions: ['q1_1_1', 'q1_1_2', 'q1_2_1', 'q1_3_1', 'q1_4_1', 'q1_4_3', 'q1_6_1', 'q1_6_3']
    }
  ];

  // ── 핸들러 ─────────────────────────────────────────────────

  // ── 핸들러 ─────────────────────────────────────────────────
  const handleAnswerChange = (qid, val) => setAnswers(p => ({ ...p, [qid]: val }));
  const handleBasicInfoChange = (f, v) => setBasicInfo(p => ({ ...p, [f]: v }));
  const toggleGuide = (qid) => setShowGuide(p => ({ ...p, [qid]: !p[qid] }));
  const toggleStepSelection = (sid) => setSelectedSteps(p => p.includes(sid) ? p.filter(i => i !== sid) : [...p, sid]);

  const goToNextStep = () => {
    if (currentPhase === 'round1') { if (currentStep < round1Steps.length - 1) setCurrentStep(s => s + 1); else setCurrentPhase('evaluation'); }
    else if (currentPhase === 'evaluation') { setSelectedSteps(p => [...p].sort((a, b) => a - b)); setCurrentPhase('round2'); setCurrentStep(0); }
    else if (currentPhase === 'round2') { if (currentStep < selectedSteps.length - 1) setCurrentStep(s => s + 1); else { setCurrentPhase('round3'); setCurrentStep(0); } }
    else if (currentPhase === 'round3') { if (currentStep < round3Questions.length - 1) setCurrentStep(s => s + 1); else { setFinalText(prev => (prev && prev.trim()) ? prev : generateGoalStory()); setCurrentPhase('completed'); } }
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

  const generateGoalStory = () => {
    const parts = [];
    if (answers.connect_full) {
      parts.push(answers.connect_full);
    } else {
      if (answers.connect_q1q2) parts.push(answers.connect_q1q2);
      else { if (answers.q1_1_1) parts.push(answers.q1_1_1); if (answers.q1_1_2) parts.push(answers.q1_1_2); }
      if (answers.connect_q2q3) parts.push('\n' + answers.connect_q2q3);
      else { if (answers.q1_2_1) parts.push('\n' + answers.q1_2_1); if (answers.q1_3_1) parts.push(answers.q1_3_1); if (answers.q1_3_2) parts.push(answers.q1_3_2); }
      if (answers.connect_q3q4) parts.push('\n' + answers.connect_q3q4);
      else { if (answers.q1_4_1) parts.push('\n' + answers.q1_4_1); if (answers.q1_4_2) parts.push(answers.q1_4_2); }
      if (answers.connect_q4q6) parts.push('\n' + answers.connect_q4q6);
      else { if (answers.q1_4_3) parts.push('\n' + answers.q1_4_3); if (answers.q1_6_1) parts.push(answers.q1_6_1); if (answers.q1_6_2) parts.push(answers.q1_6_2); if (answers.q1_6_3) parts.push('\n' + answers.q1_6_3); }
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

    window.__CE_DOWNLOAD = { fn: () => __ceDlRef.current?.(), key: 'goalachievement' };

    return () => { if (window.__CE_DOWNLOAD?.key === 'goalachievement') window.__CE_DOWNLOAD = null; };

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
      
      const children = buildEssayDocxChildren('goalachievement', { basicInfo, finalText, answers }, docxLib);

      try { children.push(...buildWorkbookBackupParagraphs(docxLib, buildWorkbookPayload('goalachievement', '목표수립·달성', 'careerengineer_goalachievement_v1'))); } catch (e) { console.warn('[goalachievement] backup embed skipped:', e); }
      try { children.unshift(...buildCopyrightParagraphs(docxLib)); } catch (e) { console.warn('copyright skip', e); }
      const doc = new Document({
        creator: '',
        title: '목표수립 및 달성',
        sections: [{
          properties: { page: { margin: { top: 1400, right: 1133, bottom: 1400, left: 1133 } } },
          children: children
        }]
      });
      
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `목표수립 및 달성_${(basicInfo.company || '미입력').replace(/[^a-zA-Z0-9가-힣\s]/g, '_')}_${today}.docx`;
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

  const getRawAnswersText = () =>
    `원본 답변 모음\n\n[기본 정보]\n직무: ${basicInfo.position||'-'}\n회사: ${basicInfo.company||'-'}\n목표달성 경험: ${basicInfo.experience||'-'}\n\n[Q1: 목표 정의]\nQ1-1 목표 정의: ${answers.q1_1_1||'-'}\nQ1-2 기대효과: ${answers.q1_1_2||'-'}\nQ1-3 쉽지 않은 이유: ${answers.q1_1_3||'-'}\n\n[Q2: 계획 수립]\nQ2-1 계획: ${answers.q1_2_1||'-'}\nQ2-2 계획의 기대: ${answers.q1_2_2||'-'}\n\n[Q3: 실행과 극복]\nQ3-1 달랐던 점: ${answers.q1_3_1||'-'}\nQ3-2 극복 방법: ${answers.q1_3_2||'-'}\n\n[Q4: 결과와 임팩트]\nQ4-1 달성 결과: ${answers.q1_4_1||'-'}\nQ4-2 기대효과 달성: ${answers.q1_4_2||'-'}\nQ4-3 임팩트: ${answers.q1_4_3||'-'}\n\n[Q5: 노력 과정]\nQ5-1 노력 방식: ${answers.q1_5_1||'-'}\nQ5-2 차별화 접근: ${answers.q1_5_2||'-'}\n\n[Q6: 배움과 기여]\nQ6-1 배운 것: ${answers.q1_6_1||'-'}\nQ6-2 직무 연결: ${answers.q1_6_2||'-'}\nQ6-3 기여 방안: ${answers.q1_6_3||'-'}\n\n[3라운드 연결]\nQ1→Q2: ${answers.connect_q1q2||'-'}\nQ2→Q3: ${answers.connect_q2q3||'-'}\nQ3→Q4: ${answers.connect_q3q4||'-'}\nQ4→Q6: ${answers.connect_q4q6||'-'}\n최종 완성: ${answers.connect_full||'-'}`;

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

    window.__CE_HOME = { fn: () => __ceHomeRef.current?.(), key: 'goalachievement' };

    return () => { if (window.__CE_HOME?.key === 'goalachievement') window.__CE_HOME = null; };

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
                        const link = it.directUrl ? { url: it.directUrl } : ((it.key && it.key !== currentKey && !isWorkbookInVariant(it.key)) ? null : WORKBOOK_LINKS[it.key]);
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
                      const link = it.directUrl ? { url: it.directUrl } : ((it.key && it.key !== currentKey && !isWorkbookInVariant(it.key)) ? null : WORKBOOK_LINKS[it.key]);
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
              const link = g.directUrl ? { url: g.directUrl } : ((g.key && g.key !== currentKey && !isWorkbookInVariant(g.key)) ? null : WORKBOOK_LINKS[g.key]);
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
  const CE_LOCKUP_B64 = "data:image/png;base64,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";

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

const IntroFooterCopyright = () => null;

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
      workbookKey='goalachievement'
      StepNavComponent={StepNavigatorDropdown}
      stepLabel='STEP 4 · 목표수립 및 달성 작성'
      title='목표수립 및 달성'
      subtitle='3라운드 체계적 작성으로 완성하는 목표 달성 경험'
      flow={[
          { label: '1라운드', desc: '목표 달성 6단계 — Q1 목표 정의 / Q2 계획 수립 / Q3 실행과 극복 / Q4 결과·임팩트 / Q5 노력 과정 / Q6 배움·기여' },
          { label: '2라운드', desc: '약한 부분 보강 — 부족한 Q를 심화 질문으로 구체화' },
          { label: '3라운드', desc: '연결 및 완성 — 6개 Q를 자연스러운 흐름으로 정리' },
        ]}
      flowTitle={'3라운드 작성 시스템'}
      prerequisites={[
          {
            text: '지원할 회사의 채용공고 (직무상세내용)',
            recommend: {
              workbookId: 'job_analysis',
              condition: '직무 분석이 필요하다면',
              linkLabel: '채용공고 분석 & 직무분석 가이드',
            },
          },
          {
            text: '목표를 세우고 달성한 본인의 경험',
            recommend: {
              workbookId: 'experience',
              condition: '경험 정리가 안 되어 있다면',
              linkLabel: '경험정리 가이드 워크북',
            },
          },
        ]}
      helpModal={<FirstVisitModal open={showHelp} onClose={() => setShowHelp(false)} title='목표수립 및 달성 워크북 사용 안내' steps={[
          '<strong>1라운드 → 2라운드 → 3라운드</strong> 순서로 진행하세요.',
          '목표·과정·결과는 <strong>구체적 숫자와 사실</strong>로 표현합니다.',
          '노력 과정과 배움·기여까지 6단계로 정리해야 깊이 있는 답변이 됩니다.',
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
            <h2 style={{ ...S.h2, textAlign: 'center', marginBottom: 4 }}>목표 수립 및 달성 완성</h2>
            <p style={S.subtitle}>아래 내용을 확인하고 자유롭게 수정하세요</p>
          </div>

          <div style={{ ...S.boxNeutral, textAlign: 'center', marginBottom: SPACING.lg }}>
            <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0 }}>
              <strong>{basicInfo.position}</strong> / <strong>{basicInfo.company}</strong> / <strong>{basicInfo.experience}</strong>
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
                <p style={{ fontSize: FONT.size.xs, fontWeight: FONT.weight.bold, color: COLORS.accent2, margin: 0, marginBottom: SPACING.sm }}>도입부 — 목표 정의 + 기대효과 (Q1)</p>
                {answers.connect_q1q2 && (
                  <div style={{ background: COLORS.blueBg, borderRadius: RADIUS.sm, padding: SPACING.sm, marginBottom: 6 }}>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.blue, fontWeight: FONT.weight.semibold, margin: 0 }}>연결 Q1→Q2 (권장)</p>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.accent, margin: 0, marginTop: 4, lineHeight: FONT.lineHeight.base }}>{answers.connect_q1q2.substring(0,200)}{answers.connect_q1q2.length>200?'...':''}</p>
                  </div>
                )}
                {answers.q1_1_1 && (
                  <div style={{ background: COLORS.bgAlt, borderRadius: RADIUS.sm, padding: SPACING.sm, marginBottom: 4 }}>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.sub, fontWeight: FONT.weight.semibold, margin: 0 }}>목표 정의 (Q1-1)</p>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.accent, margin: 0, marginTop: 4, lineHeight: FONT.lineHeight.base }}>{answers.q1_1_1.substring(0,200)}{answers.q1_1_1.length>200?'...':''}</p>
                  </div>
                )}
                <p style={{ fontSize: FONT.size.xs, color: COLORS.accent2, margin: 0, marginTop: SPACING.sm, fontStyle: 'italic' }}>연결 예시: "\"이 목표였기 때문에 이 계획이 필요했습니다...\""</p>
              </div>

              <div style={{ background: COLORS.bg, borderLeft: `3px solid ${COLORS.accent2}`, borderRadius: `0 ${RADIUS.sm}px ${RADIUS.sm}px 0`, padding: SPACING.base, marginBottom: SPACING.sm }}>
                <p style={{ fontSize: FONT.size.xs, fontWeight: FONT.weight.bold, color: COLORS.accent2, margin: 0, marginBottom: SPACING.sm }}>중반부 — 계획과 실행·극복 (Q2·Q3)</p>
                {answers.connect_q2q3 && (
                  <div style={{ background: COLORS.blueBg, borderRadius: RADIUS.sm, padding: SPACING.sm, marginBottom: 6 }}>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.blue, fontWeight: FONT.weight.semibold, margin: 0 }}>연결 Q2→Q3 (권장)</p>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.accent, margin: 0, marginTop: 4, lineHeight: FONT.lineHeight.base }}>{answers.connect_q2q3.substring(0,200)}{answers.connect_q2q3.length>200?'...':''}</p>
                  </div>
                )}
                {answers.q1_3_1 && (
                  <div style={{ background: COLORS.bgAlt, borderRadius: RADIUS.sm, padding: SPACING.sm, marginBottom: 4 }}>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.sub, fontWeight: FONT.weight.semibold, margin: 0 }}>달랐던 점 (Q3-1)</p>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.accent, margin: 0, marginTop: 4, lineHeight: FONT.lineHeight.base }}>{answers.q1_3_1.substring(0,200)}{answers.q1_3_1.length>200?'...':''}</p>
                  </div>
                )}
                <p style={{ fontSize: FONT.size.xs, color: COLORS.accent2, margin: 0, marginTop: SPACING.sm, fontStyle: 'italic' }}>연결 예시: "\"계획과 달랐고, 그래서 이렇게 했습니다...\""</p>
              </div>

              <div style={{ background: COLORS.bg, borderLeft: `3px solid ${COLORS.accent2}`, borderRadius: `0 ${RADIUS.sm}px ${RADIUS.sm}px 0`, padding: SPACING.base, marginBottom: SPACING.sm }}>
                <p style={{ fontSize: FONT.size.xs, fontWeight: FONT.weight.bold, color: COLORS.accent2, margin: 0, marginBottom: SPACING.sm }}>후반부 — 결과와 임팩트 (Q4)</p>
                {answers.connect_q3q4 && (
                  <div style={{ background: COLORS.blueBg, borderRadius: RADIUS.sm, padding: SPACING.sm, marginBottom: 6 }}>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.blue, fontWeight: FONT.weight.semibold, margin: 0 }}>연결 Q3→Q4 (권장)</p>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.accent, margin: 0, marginTop: 4, lineHeight: FONT.lineHeight.base }}>{answers.connect_q3q4.substring(0,200)}{answers.connect_q3q4.length>200?'...':''}</p>
                  </div>
                )}
                {answers.q1_4_1 && (
                  <div style={{ background: COLORS.bgAlt, borderRadius: RADIUS.sm, padding: SPACING.sm, marginBottom: 4 }}>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.sub, fontWeight: FONT.weight.semibold, margin: 0 }}>달성 결과 (Q4-1)</p>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.accent, margin: 0, marginTop: 4, lineHeight: FONT.lineHeight.base }}>{answers.q1_4_1.substring(0,200)}{answers.q1_4_1.length>200?'...':''}</p>
                  </div>
                )}
                <p style={{ fontSize: FONT.size.xs, color: COLORS.accent2, margin: 0, marginTop: SPACING.sm, fontStyle: 'italic' }}>연결 예시: "\"이 과정의 결과는 이렇게 검증됐습니다...\""</p>
              </div>

              <div style={{ background: COLORS.bg, borderLeft: `3px solid ${COLORS.accent2}`, borderRadius: `0 ${RADIUS.sm}px ${RADIUS.sm}px 0`, padding: SPACING.base, marginBottom: SPACING.sm }}>
                <p style={{ fontSize: FONT.size.xs, fontWeight: FONT.weight.bold, color: COLORS.accent2, margin: 0, marginBottom: SPACING.sm }}>마무리 — 배움과 기여 (Q6)</p>
                {answers.connect_q4q6 && (
                  <div style={{ background: COLORS.blueBg, borderRadius: RADIUS.sm, padding: SPACING.sm, marginBottom: 6 }}>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.blue, fontWeight: FONT.weight.semibold, margin: 0 }}>연결 Q4→Q6 (권장)</p>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.accent, margin: 0, marginTop: 4, lineHeight: FONT.lineHeight.base }}>{answers.connect_q4q6.substring(0,200)}{answers.connect_q4q6.length>200?'...':''}</p>
                  </div>
                )}
                {answers.q1_6_1 && (
                  <div style={{ background: COLORS.bgAlt, borderRadius: RADIUS.sm, padding: SPACING.sm, marginBottom: 4 }}>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.sub, fontWeight: FONT.weight.semibold, margin: 0 }}>배운 것 (Q6-1)</p>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.accent, margin: 0, marginTop: 4, lineHeight: FONT.lineHeight.base }}>{answers.q1_6_1.substring(0,200)}{answers.q1_6_1.length>200?'...':''}</p>
                  </div>
                )}
                <p style={{ fontSize: FONT.size.xs, color: COLORS.accent2, margin: 0, marginTop: SPACING.sm, fontStyle: 'italic' }}>연결 예시: "\"이 경험이 입사 후 이런 방식으로 발휘됩니다...\""</p>
              </div>

              <div style={{ background: COLORS.bg, borderLeft: `3px solid ${COLORS.accent2}`, borderRadius: `0 ${RADIUS.sm}px ${RADIUS.sm}px 0`, padding: SPACING.base, marginBottom: SPACING.sm }}>
                <p style={{ fontSize: FONT.size.xs, fontWeight: FONT.weight.bold, color: COLORS.accent2, margin: 0, marginBottom: SPACING.sm }}>최종 — 하나의 완결된 스토리</p>
                {answers.connect_full && (
                  <div style={{ background: COLORS.blueBg, borderRadius: RADIUS.sm, padding: SPACING.sm, marginBottom: 6 }}>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.blue, fontWeight: FONT.weight.semibold, margin: 0 }}>최종 연결 (권장)</p>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.accent, margin: 0, marginTop: 4, lineHeight: FONT.lineHeight.base }}>{answers.connect_full.substring(0,200)}{answers.connect_full.length>200?'...':''}</p>
                  </div>
                )}
                <p style={{ fontSize: FONT.size.xs, color: COLORS.accent2, margin: 0, marginTop: SPACING.sm, fontStyle: 'italic' }}>연결 예시: "\"전체 흐름을 하나의 이야기로...\""</p>
              </div>
            </div>

            <div style={{ ...S.boxSuccess, marginBottom: SPACING.md }}>
              <p style={{ ...labelStyle(COLORS.green), marginBottom: SPACING.sm }}>SUCCESS · 수정 전 최종 확인</p>
              <p style={{ fontSize: FONT.size.xs, color: COLORS.sub, margin: `0 0 ${SPACING.sm}px`, lineHeight: FONT.lineHeight.base }}>각 항목을 확인하며 체크하세요. 통과하지 못한 항목이 있다면 해당 Q로 돌아가 보완합니다.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { n: "①", q: "Q1: 목표가 수치·기한·범위로 측정 가능한가? (SMART)", miss: "Q1-1, Q1-2" },
                { n: "②", q: "Q2: 계획이 단계별로 구체적이고 논리적인가?", miss: "Q2-1" },
                { n: "③", q: "Q3: 예상과 달랐던 점과 극복 방식이 드러나는가?", miss: "Q3-1, Q3-2" },
                { n: "④", q: "Q4: 결과가 숫자와 임팩트로 증명되는가?", miss: "Q4-1, Q4-3" },
                { n: "⑤", q: "Q6: 배움이 직무 기여로 이어지는가?", miss: "Q6-1, Q6-2, Q6-3" }
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

            <JdBridgeGuide />
            <textarea className="ce-textarea" value={finalText} onChange={e => setFinalText(e.target.value)} rows={20} style={{ ...S.textarea, fontFamily: `'Noto Serif KR', '맑은 고딕', 'Malgun Gothic', serif`, lineHeight: 1.8 }} />
            <AnswerQualityCheck text={finalText} focusArea={['difficulty','number','autonomy','motivation']} />
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
            워드 파일로 다운로드 (.docx)
          </button>

          {downloadSuccess && <p style={{ fontSize: FONT.size.sm, color: COLORS.green, textAlign: 'center', marginTop: SPACING.md, fontWeight: FONT.weight.semibold }}>✓ 다운로드 완료</p>}

          <div style={{ ...S.boxInfo, marginTop: SPACING.base, marginBottom: 0, textAlign: 'center' }}>
            <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0 }}><strong>워드에서 편집 가능:</strong> .docx 파일을 Word에서 열어 자유롭게 편집하세요.</p>
          </div>

          <div style={{ marginTop: SPACING.md }}>
            <button onClick={goToPrevStep} style={S.btnSecondary}>이전</button>
          </div>
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
              {[["position", "지원하고자 하는 직무", "예: 마케팅, 개발, 기획 등"], ["company", "지원하고자 하는 회사명", "예: 삼성전자, 네이버 등"], ["experience", "목표달성 경험 (간단히)", "예: 기구 설계 프로젝트 3개 완성"]].map(([f, l, p]) => (
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
                      <ToggleLink open={!!showGuide[q.id]} onToggle={() => toggleGuide(q.id)} label="가이드" />
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
                        {q.relatedWorkbooks && <RelatedWorkbookInline ids={q.relatedWorkbooks} questionId={q.id || q.label} workbookKey="goalachievement" />}
                      </div>
                    </div>
                  )}

                  <ExampleToggle text={q.placeholder} />

                  <textarea className="ce-textarea" value={answers[q.id] || ''} onChange={e => handleAnswerChange(q.id, e.target.value)} rows={q.rows || 3} style={S.textarea} placeholder="" />
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

        <StickyFooter />
      </div>
    </div>
  );
};

export default GoalAchievementWorkbook;
