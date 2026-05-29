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
//  CareerEngineer 성장과정 워크북
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
  primary: { background: COLORS.accent, color: COLORS.white, border: 'none', borderRadius: RADIUS.md, padding: '14px 32px', fontSize: FONT.size.md, fontWeight: FONT.weight.semibold, cursor: 'pointer' },
  secondary: { background: COLORS.white, color: COLORS.accent, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.md, padding: '14px 32px', fontSize: FONT.size.md, fontWeight: FONT.weight.medium, cursor: 'pointer' },
  text: { background: 'transparent', color: COLORS.accent2, border: 'none', padding: '8px 0', fontSize: FONT.size.base, fontWeight: FONT.weight.medium, cursor: 'pointer', textDecoration: 'underline' },
};


const FormativeExperiencesWorkbook = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [currentPhase, setCurrentPhase] = useState('round1');
  const [currentPart, setCurrentPart] = useState(() => { try { const __d = JSON.parse(localStorage.getItem('careerengineer_formative_experiences_v1') || '{}'); return (__d.basicInfo && (__d.basicInfo.industry || __d.basicInfo.position || __d.basicInfo.company)) ? 1 : 0; } catch { return 0; } });
  const [selectedSteps, setSelectedSteps] = useState([]);
  const [showGuide, setShowGuide] = useState({});
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [showRawAnswers, setShowRawAnswers] = useState(false);
  const [finalText, setFinalText] = useState('');
  const [checklistState, setChecklistState] = useState({});
  const [basicInfo, setBasicInfo] = useState({ position: '', company: '' });
  const [answers, setAnswers] = useState({});
  const [confirmingClear, setConfirmingClear] = useState(false);

  // 자동 저장 키
  const STORAGE_KEY = 'careerengineer_formative_experiences_v1';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      setBasicInfo({ position: '', company: '' });
      setFinalText('');
      setConfirmingClear(false);
      setTimeout(() => { localStorage.removeItem(STORAGE_KEY); }, 50);
      setTimeout(() => { localStorage.removeItem(STORAGE_KEY); }, 1500);
    } else {
      setConfirmingClear(true);
      setTimeout(() => setConfirmingClear(false), 5000);
    }
  };

  // ── 1라운드: Q1(가치관 7문항) + Q2(성장 서사 4문항) ──────────
  const round1Steps = [
    { id: 0, title: '기본 정보 입력', subtitle: '지원할 직무와 회사를 입력하세요' },
    {
      id: 1,
      title: 'Q1: 가치관 형성',
      subtitle: '나의 핵심 가치관은 무엇이며, 어떤 사건·사람·환경에서 형성됐고, 어떤 결정적 전환점이 있었으며, 어떻게 일관되게 나타나는가 (직무 연결은 옵션)',
      questions: [
        {
          id: 'q1_1',
          label: 'Q1-1. 나의 핵심 가치관은 무엇인가?',
          hint: '추상적 단어가 아닌, 실제 행동과 선택에서 드러난 기준 — 일·관계·결정에서 반복적으로 따르는 한 가지',
          guide: {
            description: '내가 중요하다고 생각하는 가치를 추상적 단어가 아닌, 실제 선택과 행동의 기준으로 표현하세요.',
            diagnosis: '즉석자가진단: "왜 그렇게 행동했나요?"라는 질문에 이 가치관으로 즉답 가능한가?',
            helpQuestions: [
              '내가 절대 양보하지 못하는 한 가지는 무엇인가요?',
              '여러 선택지 앞에서 항상 같은 방향으로 결정하게 만드는 기준은?',
              '"이런 것만은 못한다"고 거절했던 경험이 있다면, 그 이유의 공통점은?',
              '주변 사람들이 "OO 너답다"고 표현하는 행동 패턴은?'
            ],
            ifDifficult: '최근 1년간 가장 중요했던 결정 3가지를 떠올리고, 그 선택의 공통된 기준을 찾아보세요.',
            ifStillDifficult: '"정직", "성실", "도전" 같은 단어 대신, "어떤 상황에서 무엇을 어떻게 한다"로 풀어 쓰세요.',
            warning: '"정직", "성실", "책임감" 같은 추상적 단어는 누구나 쓸 수 있어 변별력이 없습니다. 행동으로 검증되는 가치관을 작성하세요.'
          },
          placeholder: "예: 저의 핵심 가치관은 \"한 번 맡은 설계는 도면에서 끝내지 않고, 현장에서 작동할 때까지 책임진다\"입니다.\n— 단순히 \"꼼꼼하다\"가 아니라, 내가 그린 도면이 가공·조립·검증을 통과해 실제로 맞물려 돌아가는 것을 확인해야 일이 끝났다고 여깁니다.\n— 마감이 급해도 \"현장에서 갈아 맞추면 된다\"는 식으로 공차를 넘기지 않고, 조립까지 책임지는 수치를 끝까지 계산합니다.\n— 자작자동차 동아리에서 늘 \"도현이 도면은 현장에서 안 갈아낸다\"는 말을 들었고, 부품 마감·검차 대응 역할이 자연스럽게 저에게 돌아왔습니다.\n— 이 기준은 동아리에서 도면이 현장에서 갈려나가는 것을 본 1학년 겨울 이후 명확한 행동 기준으로 자리잡았고, 인턴십·캡스톤을 거치며 단단해졌습니다.",
          rows: 5, relatedWorkbooks: ['experience']
        },
        {
          id: 'q1_2',
          label: 'Q1-2. 이 가치관을 형성한 결정적 사건은?',
          hint: '"원래부터 그랬다"는 답이 아닙니다 — 가치관이 만들어진 구체적 장면이 있어야 합니다',
          guide: {
            description: '가치관이 처음 만들어지거나 강화된 구체적 사건을 STAR 구조로 작성하세요.',
            diagnosis: '즉석자가진단: "그때 무슨 일이 있었나요?"에 5W1H로 답변 가능한가?',
            helpQuestions: [
              '이 가치관이 처음으로 빛을 발한 경험은?',
              '이 가치관이 없었다면 후회했을 것 같은 순간은?',
              '"이 일을 계기로 나는 달라졌다"고 말할 수 있는 사건은?',
              '가족·학교·동아리·아르바이트 중 가장 영향을 준 사건은?'
            ],
            ifDifficult: '가장 선명하게 기억나는 한 장면부터 시작하세요. 그날 누가 있었고, 무슨 일이 있었고, 어떤 감정이었는지.',
            ifStillDifficult: '큰 사건이 아니어도 됩니다. 작은 일이라도 가치관에 영향을 준 장면이라면 충분합니다.',
            warning: '"어릴 때부터 그랬다", "부모님이 그렇게 가르쳐주셨다"는 답은 약합니다. 본인의 경험에서 나온 사건이어야 합니다.'
          },
          placeholder: "예:\n[형성 사건 — 누가 봐도 그럴만한 계기]\n자작자동차 동아리에 들어간 1학년 겨울, 첫 차량 제작 현장에서 선배가 그린 서스펜션 마운트 브래킷이 조립 시 2~3mm씩 안 맞아 그라인더로 갈아 끼우는 것을 봤습니다. \"도면은 분명 맞는데 왜 현장에서 갈지?\"라는 의문이 강하게 남았고, 알루미늄 가루를 치우며 \"도면이 예쁜 것과 현장에서 맞는 것은 다른 일\"이라는 걸 처음 알았습니다.\n다음 시즌, 그 마운트 설계를 제가 맡겠다고 자원했습니다. 마감이 빠듯해 \"대충 공차 넉넉히 주고 현장에서 맞추자\"는 의견도 있었지만, 같은 일을 반복하기 싫었습니다. GD&T로 데이텀을 통일하고 공차 누적을 끝까지 계산해 ±1.8mm였던 누적 공차를 ±0.6mm로 잡았습니다.\n\n[강점으로 자리잡은 과정]\n그 시즌 조립에서 현장 가공이 0건으로 나왔고, 동아리 사상 처음으로 검차를 무수정 통과했습니다. 이 경험 이후 \"내 도면은 현장에서 작동할 때까지 내 책임\"이라는 것이 행동 기준이 되었고, 인턴십 도면 검도·캡스톤 해석 검증에서도 같은 패턴이 반복되었습니다.",
          rows: 8, relatedWorkbooks: ['experience']
        },
        {
          id: 'q1_3',
          label: 'Q1-3. 이 가치관에 영향을 준 사람 또는 환경은?',
          hint: '구체적 인물·환경의 이름과 영향 방식 — "어떤 분이 어떤 말을 했고 그래서 어떻게 달라졌다"',
          guide: {
            description: '가치관 형성에 영향을 준 인물(가족·선생님·선후배·롤모델) 또는 환경(가정·학교·문화·경험)을 구체적으로 작성하세요. 그 사람의 어떤 모습이나 말이 왜 영향을 주었는지가 핵심입니다.',
            diagnosis: '즉석자가진단: "그분이 정확히 어떤 말을 하셨나요?" 혹은 "그 환경에서 어떤 일이 있었나요?"에 구체적으로 답변 가능한가?',
            helpQuestions: [
              '가장 존경하는 사람의 행동에서 어떤 점이 마음에 새겨졌나요?',
              '"그 말 한마디가 평생 남았다"는 경험이 있나요?',
              '나를 가장 변화시킨 환경(가정 분위기, 학창시절, 어떤 모임)은 무엇이며 어떻게 영향을 줬나요?',
              '닮고 싶은 사람의 어떤 특정 행동이 내 가치관의 모델이 되었나요?'
            ],
            ifDifficult: '"누군가의 어떤 모습에서 무엇을 배웠다"의 구조로 한 줄씩 써보세요.',
            ifStillDifficult: '거창한 인물이 아니어도 됩니다. 일상에서 마주친 평범한 사람의 작은 모습도 영향이 될 수 있습니다.',
            warning: '"부모님께서 정직하게 살라고 하셨다"처럼 일반적인 가르침만 쓰면 변별력이 없습니다. 구체적 장면이나 말이 있어야 합니다.'
          },
          placeholder: "예: 가장 큰 영향을 준 사람은 자작자동차 동아리 졸업 선배(OB)이자 현직 기구설계 엔지니어였던 분이었습니다.\n현역 시절 도면 갈림 문제로 고생했던 분이라, 멘토링 때마다 \"도면은 출도가 아니라 가공·조립이 끝나야 완성이다\"라고 반복해서 말씀하셨습니다.\n특히 제 마운트 설계 리뷰에서 결과 수치보다 \"이 공차를 협력 업체가 실제로 낼 수 있는지 확인했냐\"를 먼저 물으셨고, 제가 가공 업체에 직접 전화해 공정 능력(±0.1mm)을 확인해 오자 \"그게 설계자의 책임\"이라고 하셨습니다.\n그날 이후, 동아리에서 막연하게 느꼈던 \"현장에서 작동할 때까지 책임진다\"는 감각이 \"설계는 가공·조립까지\"라는 명확한 언어를 얻었고, 그분의 기준이 제 가치관의 직접적인 모델이 되었습니다.",
          rows: 5, relatedWorkbooks: ['experience']
        },
        {
          id: 'q1_4',
          label: 'Q1-4. 가치관이 시험받았던 결정적 전환점은?',
          hint: '편할 때가 아닌, 흔들렸을 때 — 가치관이 진짜인지 검증된 순간',
          guide: {
            description: '이 가치관을 포기하기 쉬웠던 상황에서 어떤 선택을 했는지 작성하세요. 가치관은 평소가 아닌 어려운 순간에 진짜로 드러납니다.',
            diagnosis: '즉석자가진단: "그때 다른 선택을 할 수도 있었나요?"라고 물었을 때, 다른 선택지가 명확하게 있었던 순간을 떠올릴 수 있는가?',
            helpQuestions: [
              '이 가치관을 지키느라 손해를 본 경험이 있나요?',
              '주변에서 다른 선택을 권유했지만 가치관대로 행동한 순간은?',
              '"이렇게까지 해야 하나"라는 회의가 들었던 순간에 어떻게 결정했나요?',
              '가치관과 현실적 이익이 충돌했을 때의 선택은?'
            ],
            ifDifficult: '가장 힘들었던 순간을 떠올리고, 그때 무엇을 포기하고 무엇을 지켰는지 생각해보세요.',
            ifStillDifficult: '큰 사건이 아니어도 됩니다. 일상에서 작은 갈등의 순간도 가치관을 검증하는 전환점이 될 수 있습니다.',
            warning: '갈등 없는 미담은 가치관의 증거가 되지 않습니다. 흔들림이 있었고, 그럼에도 선택한 이유가 핵심입니다.'
          },
          placeholder: "예: 가치관이 가장 크게 시험받은 것은 4학년 캡스톤 마감 직전이었습니다.\n방열 구조의 열해석 결과와 시제품 실측값이 6℃ 차이가 났는데, 마감이 사흘 남은 상황에서 팀원들은 \"6℃는 오차 범위니 그냥 제출하자\"고 했습니다.\n저도 흔들렸지만, \"검증되지 않은 수치를 결과라고 제출하는 것은 책임 완결이 아니다\"라고 생각했습니다. 이틀 밤을 들여 경계조건을 다시 잡았고, 접촉 열저항 설정 오류를 찾아 해석과 실측 오차를 1℃ 안으로 맞춘 뒤 제출했습니다.\n이때 처음으로 \"이 가치관은 편할 때가 아니라 마감에 쫓겨 흔들릴 때 지키는 것\"이라는 것을 알았습니다.",
          rows: 6, relatedWorkbooks: ['experience']
        },
        {
          id: 'q1_5',
          label: 'Q1-5. 이 가치관이 지속적으로 작동한다는 증거는?',
          hint: '하나의 사례로는 부족합니다 — 다른 맥락, 다른 사람, 다른 시점에서 반복되는 패턴이 증거입니다',
          guide: {
            description: '"이 가치관은 진짜다"라는 말은 증명이 필요합니다. 아래 3가지 방법으로 패턴을 보여주세요.',
            diagnosis: '즉석자가진단: 3가지 방법 중 2가지 이상을 채울 수 있는가?',
            helpQuestions: [
              '[방법 1] 다른 맥락에서 반복: 학교·알바·동아리·일상에서도 같은 가치관이 나타난 상황 3가지는?',
              '[방법 2] 다른 사람들이 같은 말을 한다: 서로 다른 관계의 2명 이상이 이 모습에 대해 한 비슷한 말은?',
              '[방법 3] 시간적 일관성: 가장 오래된 사례는? 가장 최근 사례는? 그 사이 몇 년인가요?'
            ],
            ifDifficult: '방법 1부터 시작하세요. 맥락만 달라도 충분합니다.',
            ifStillDifficult: '하나의 큰 사례보다 작은 일상 사례 3개의 반복이 더 강한 증거입니다.'
          },
          placeholder: "예:\n[방법 1 — 다른 맥락에서 반복]\n동아리: 마운트 공차를 끝까지 계산해 현장 가공 0건 / 인턴: 양산 도면 200장의 공차 표기를 끝까지 표준화해 협력사 문의 감소 / 캡스톤: 해석-실측 6℃ 오차를 끝까지 추적해 원인 규명\n\n[방법 2 — 다른 사람들이 같은 말]\n동아리 선배: \"도현이 도면은 현장에서 안 갈아낸다\" / 인턴 사수: \"인턴인데 끝까지 파고들어 표준을 만들었다\" / 캡스톤 교수님: \"오차를 그냥 넘기지 않는 게 인상적\"\n\n[방법 3 — 시간적 일관성]\n1학년 겨울(2022): 도면 갈림 목격 → 2학년(2023): 마운트 무가공 달성 → 3학년 여름(2024): 인턴 공차 표준화 → 4학년(2025): 캡스톤 6℃ 추적 / 4년간 \"검증 전엔 끝이 아니다\"는 기준을 한 번도 놓지 않았습니다.",
          rows: 6, relatedWorkbooks: ['experience']
        },
        {
          id: 'q1_6',
          label: 'Q1-6. 이 가치관이 가장 잘 드러난 대표 경험은?',
          hint: 'STAR(상황-과제-행동-결과) + 타인의 평가 — 하나를 깊게',
          guide: {
            description: 'STAR 구조로 가장 대표적인 경험 하나를 깊게 서술하세요. 가치관이 어떻게 행동으로 이어졌고, 어떤 결과를 만들었는지가 핵심입니다.',
            diagnosis: '즉석자가진단: "그 상황을 자세히 설명해주세요"라고 하면 3분간 막힘없이 설명 가능한가?',
            helpQuestions: [
              'S(상황): 언제, 어디서, 어떤 역할이었나요?',
              'T(과제): 해결해야 했던 문제나 목표는?',
              'A(행동): 가치관을 어떻게 행동으로 보여줬나요? 구체적으로?',
              'R(결과): 숫자나 타인의 평가로 표현 가능한 결과는?',
              '타인 평가: 그 경험에 대해 누가 어떻게 평가했나요?'
            ],
            ifDifficult: '크고 화려한 성과가 아니어도 됩니다. 작아도 가치관이 드러나는 경험이면 의미 있습니다.',
            ifStillDifficult: '"그때 어떤 상황이었나요?"부터 시작해 한 줄씩 채워보세요. 구체적 숫자나 인용이 없으면 그 후 나에게 달라진 것을 써도 됩니다.'
          },
          placeholder: "예:\n[STAR 경험]\nS: 2학년 자작자동차 신규 차량에서 섀시 프레임과 서스펜션 마운트 설계를 맡았습니다. 전년 차량은 마운트 공차 누적으로 조립 때마다 브래킷을 갈아 끼워야 했습니다.\nT: 경량화(28kg 이하)와 조립 무가공(현장 가공 0건)이라는 상충하는 두 목표를 동시에 달성해야 했습니다.\nA: SolidWorks로 재모델링하고 ANSYS 구조해석으로 약한 부재만 보강해 경량화하면서 강성을 +9% 확보했고, GD&T 공차 누적 분석으로 누적 공차를 ±1.8mm에서 ±0.6mm로 잡았습니다. 가공 업체에 직접 공정 능력을 확인해 탁상공론을 막았습니다.\nR: 프레임 27.4kg, 강성 +9%, 조립 현장 가공 0건을 달성했고, 동아리 사상 처음 검차를 무수정 통과했습니다.\n\n[타인의 평가]\n지도 선배: \"설계와 양산 사이를 메운 첫 후배\" / 검차 위원: \"신입팀치고 도면 완성도가 높다\"",
          rows: 7, relatedWorkbooks: ['experience', 'self_introduction']
        },
        {
          id: 'q1_7',
          label: 'Q1-7. (옵션) 이 가치관이 지원 직무·회사와 연결되는 지점은?',
          hint: '다른 자소서 항목(지원동기·직무역량)이 있다면 가볍게, 성장과정만 있다면 깊게 — 억지스러우면 비워두세요',
          guide: {
            description: '⚠️ 옵션 질문: 지원동기·직무역량 등 다른 자소서 항목이 있는 경우 이 질문은 가볍게 다루거나 비워둬도 됩니다.\n\n다른 항목이 없거나 성장과정 항목 안에서 직무 연결까지 요구하는 경우만 깊게 작성하세요. 가치관이 직무·회사 문화와 자연스럽게 맞물리는 지점을 찾되, 억지 연결은 피하세요.',
            diagnosis: '즉석자가진단: 다른 자소서 항목에 이미 직무 연결이 들어가 있다면, 여기서는 한 문장 정도로 충분합니다.',
            helpQuestions: [
              '[직무 연결] 이 가치관이 지원 직무에서 어떤 업무 태도로 나타날 수 있나요?',
              '[회사 연결] 회사의 인재상·가치관·문화 중 내 가치관과 자연스럽게 맞물리는 지점은?',
              '[옵션 분기] 다른 자소서 항목에 직무 연결이 이미 있다면, 여기서는 가치관의 자연스러운 연장으로 한 문장만.'
            ],
            ifDifficult: '연결이 억지스럽다면 작성하지 마세요. 비어 있어도 괜찮습니다 — 가치관 자체가 강하면 충분합니다.',
            ifStillDifficult: '"이 가치관을 가진 사람이 이 직무·회사에 있다면 어떤 모습일까?"로 한 문장만 작성하세요.',
            warning: '"열심히 하겠습니다", "기여하고 싶습니다" 같은 미래 약속은 피하세요. 가치관이 어떻게 직무에서 일하는 방식으로 드러나는지가 핵심입니다.'
          },
          placeholder: "예:\n[다른 자소서 항목이 있는 경우 — 한 문장]\n이 가치관은 공차·양산성을 설계 초기에 녹여 재작업을 줄이는 업무 태도로 자연스럽게 이어집니다.\n\n[성장과정 항목만 있는 경우 — 깊게]\n\"현장에서 작동할 때까지 책임진다\"는 가치관은 기구설계 직무의 본질과 그대로 맞물립니다.\n도면 출도로 일을 끝내지 않고 공차·양산성·해석으로 조립과 검증까지 책임지는 일관성,\n마감에 쫓겨도 검증되지 않은 수치를 결과로 내보내지 않는 신중함이 설계 검증(DR)의 핵심 태도와 같습니다.\n또한 귀사의 \"검증을 중시하는 설계 문화\"는 제 가치관의 또 다른 표현이라고 생각합니다.",
          rows: 6, relatedWorkbooks: ['job_analysis', 'experience']
        }
      ]
    },
    {
      id: 2,
      title: 'Q2: 성장 서사 — 없었던 것이 만들어진 과정',
      subtitle: '과거에 부족했거나 없었던 강점·가치관이 어떤 계기·환경을 거쳐 지금의 모습으로 만들어졌고, 어떻게 자리잡았으며, 앞으로 어떻게 확장될 것인가',
      questions: [
        {
          id: 'q2_1',
          label: 'Q2-1. 과거에 부족했거나 아예 없었던 강점·가치관 하나를 떠올려보세요.',
          hint: '지금은 강점이지만 과거에는 약하거나 없었던 것 — Q1과 다른 축의 두 번째 성장 서사',
          guide: {
            description: '지금은 본인의 강점·가치관이지만 과거에는 부족하거나 아예 없었던 것 하나를 떠올려 작성하세요.\nQ1이 일찍부터 형성된 핵심 가치관이라면, Q2는 살아오면서 "새로 만들어진" 강점·가치관입니다. 두 축이 함께 있을 때 성장과정이 입체적으로 보입니다.',
            diagnosis: '즉석자가진단: "예전에는 못했는데 지금은 한다"의 구체적 비교가 가능한가?',
            helpQuestions: [
              '대학 입학 시점의 나와 지금의 나를 비교했을 때, 가장 크게 달라진 점은?',
              '"예전에는 OO하지 못했지만 지금은 OO한다"의 빈칸에 들어갈 것은?',
              '지금 강점·가치관 중 Q1과 다른 축의 하나는?',
              '주변에서 "쟤 많이 달라졌어"라고 말하는 부분은?'
            ],
            ifDifficult: '강점 후보를 3개 적고, 그중 "예전에는 없었는데 지금은 있다"가 가장 선명한 것 하나를 고르세요.',
            ifStillDifficult: '극적인 변화가 아니어도 됩니다. "예전엔 어려웠던 것이 이제는 자연스럽다"면 충분합니다.',
            warning: '"약점"으로 표현하지 마세요. 자소서 성격 장단점 항목과 구분됩니다. 성장과정은 "없던 것 → 만들어진 것"의 흐름입니다.'
          },
          placeholder: "예:\n[과거의 부족함]\n동아리 초반까지 저는 설계 의견이 갈리면 \"내 감으로는 이게 맞다\"고 우기거나, 반대로 선배 말이면 근거 없이 그냥 따르는 사람이었습니다.\n제 주장을 데이터로 증명하거나, 상대 의견을 데이터로 검토해 본 적이 거의 없었습니다.\n\"근거로 의견 차이를 좁히는 능력\"은 거의 없었고, 설계 리뷰에서 목소리 큰 쪽이나 선배 쪽으로 결론이 기우는 것을 당연하게 여겼습니다.\n\n[지금은 강점이 된 모습]\n현재는 의견이 갈리면 가장 먼저 \"그럼 해석/실측으로 확인해보자\"고 말하는 사람으로 평가받습니다.\n동아리·캡스톤·인턴에서 \"의견이 갈리면 도현이가 데이터로 정리한다\"는 위치가 되었고,\n\"설계 논쟁은 목소리가 아니라 데이터로 좁힌다\"는 것이 자리잡은 일하는 방식이 되었습니다.\n→ 가지고 있지 않았던 강점이 4년에 걸쳐 만들어진 사례입니다.",
          rows: 8, relatedWorkbooks: ['experience']
        },
        {
          id: 'q2_2',
          label: 'Q2-2. 이 강점·가치관이 만들어지기 시작한 결정적 계기는 무엇이었는가?',
          hint: '"없었던 것이 만들어진" 그 순간 — 외부 자극(사건·사람·환경)이 본인 안의 변화로 이어진 장면',
          guide: {
            description: '강점·가치관이 처음으로 싹튼 사건·사람·환경을 구체적으로 작성하세요. "원래 그렇게 컸다"가 아닌, 명확한 출발점이 있어야 합니다.',
            diagnosis: '즉석자가진단: "그 사건이 없었다면 지금도 못했을 것 같다"라고 말할 수 있는가?',
            helpQuestions: [
              '"이 일을 계기로 나는 달라져야겠다고 결심했다"고 말할 수 있는 사건은?',
              '누군가의 한마디 또는 행동이 결정적이었다면, 누가 무슨 말을 했나요?',
              '새로운 환경(전공·동아리·인턴·해외 경험 등)이 변화를 강제했다면, 어떤 환경이었나요?',
              '"피할 수 없는 상황"에서 처음으로 다른 방식을 시도해야 했던 순간은?'
            ],
            ifDifficult: '결정적 한 사건이 떠오르지 않으면, 같은 방향의 작은 사건 2~3개를 모아도 됩니다.',
            ifStillDifficult: '"피할 수 없어서 처음 해본 일"이 가장 강력한 계기인 경우가 많습니다.',
            warning: '"점점 자연스럽게 그렇게 됐다"는 약합니다. 외부 자극과 내부 결심이 만난 구체적 장면이 필요합니다.'
          },
          placeholder: "예:\n[결정적 계기 — 외부 자극]\n2학년 동아리 설계 리뷰에서 프레임 보강 위치를 두고 선배와 일주일간 대립한 일이 출발점이었습니다.\n저는 \"느낌상 앞쪽이 약하다\"고 우겼고, 선배는 뒤쪽을 주장했습니다. 며칠을 평행선으로 가다, 선배가 \"느낌 말고 해석 돌려서 데이터로 가져와\"라고 했습니다.\n실제로 ANSYS 구조해석을 돌리니 제가 주장한 앞쪽이 아니라 선배가 짚은 뒤쪽 비틀림이 더 컸습니다. 제 \"감\"이 데이터 앞에서 틀린 순간이었습니다.\n\n[내부 결심]\n그날 이후 \"의견 차이는 누가 맞냐의 싸움이 아니라, 데이터로 함께 확인하면 끝나는 일\"이라는 것을 알았습니다.\n그다음부터는 설계 의견이 갈릴 때마다 제가 먼저 해석·실측 조건을 제안해 데이터로 좁히는 방식을 기본 자세로 삼았습니다.",
          rows: 8, relatedWorkbooks: ['experience']
        },
        {
          id: 'q2_3',
          label: 'Q2-3. 이 강점·가치관이 진짜로 자리잡았다는 증거는 무엇인가?',
          hint: '한 번의 결심이 아닌 반복된 적용 — 다른 맥락·다른 사람·시간 경과에서 같은 패턴이 보여야 합니다',
          guide: {
            description: '계기 이후 강점·가치관이 어떻게 행동으로 반복되었는지, 객관적 증거를 모아 작성하세요. 수치·인용·반복 패턴이 함께 있어야 "자리잡았다"가 증명됩니다.',
            diagnosis: '즉석자가진단: 같은 패턴의 사례를 3개 이상 다른 맥락에서 댈 수 있는가?',
            helpQuestions: [
              '[다른 맥락 반복] 학회·동아리·인턴·일상에서 이 강점이 나타난 사례 3가지는?',
              '[타인의 인용] 주변 사람이 이 강점에 대해 직접 한 말은? (가능하면 인용으로)',
              '[수치·관찰] 이전에는 X였던 것이 지금은 Y인 비교가 가능한가요?',
              '[시간 경과] 가장 처음 적용한 시점과 가장 최근 사례 사이의 간격은?'
            ],
            ifDifficult: '큰 사례 하나보다 작은 사례 3개의 반복이 "자리잡았다"의 더 강한 증거입니다.',
            ifStillDifficult: '"가족도 인정할 만한 일관성"이 보이면 충분합니다.',
            warning: '"앞으로 더 발전시키겠습니다"는 증거가 아닙니다. 이미 일어난 일의 증거를 모으세요.'
          },
          placeholder: "예:\n[1단계 — 반복]\n동아리 설계 리뷰(대2~3): 의견 갈릴 때 해석/실측으로 확인하자 제안 5회 이상 / 캡스톤(대4): 방열 핀 구조 3개 안을 감이 아닌 해석값으로 비교해 채택\n→ 같은 종류의 설계 논쟁에서 같은 행동이 반복됨\n\n[2단계 — 확장]\n인턴십(대4 여름): 사수와 공차 표기 방식이 갈렸을 때, 내 의견이 아니라 \"ISO 표준이 이렇게 권장한다\"는 근거 자료를 만들어 설득\n→ 동아리 동기가 아닌, 권한 차이가 큰 실무 사수로 확장됨\n\n[3단계 — 자동화]\n인턴 후반, 도면 검도 회의에서 의견이 갈리자 의식적 결심 없이 \"그 케이스 해석값 있나요? 없으면 제가 돌려볼게요\"라고 자연스럽게 말이 나옴\n→ \"해야겠다고 결심하는 단계\"를 넘어 \"자동으로 나오는 단계\"에 도달",
          rows: 10, relatedWorkbooks: ['experience']
        },
        {
          id: 'q2_4',
          label: 'Q2-4. 이 성장이 앞으로 어떻게 확장될 것인가?',
          hint: '"열심히 살겠다"는 다짐이 아닌 — 만들어진 강점이 더 큰 범위·더 어려운 상황에서 발휘되는 모습',
          guide: {
            description: 'Q1의 핵심 가치관과 Q2의 새로 만들어진 강점·가치관이 함께 도달할 다음 모습을 작성하세요. 입사 후 다짐이 아닌, 인생의 방향성으로 표현하세요.',
            diagnosis: '즉석자가진단: 확장 방향이 Q1과 Q2의 자연스러운 다음 단계인가? 새로운 약속이 아닌 이어지는 흐름인가?',
            helpQuestions: [
              'Q1 가치관 + Q2 새로 만들어진 강점이 합쳐지면 어떤 사람이 되는가?',
              '같은 강점을 더 큰 범위(개인 → 팀 → 조직)나 더 어려운 상황(낯선 사람 → 이해관계자 → 외부 파트너)에서 발휘한다면?',
              '5년 뒤 "이 사람은 OO한 사람"이라고 평가받고 싶은 한 줄은?',
              '(옵션) 이 성장이 직무·회사 생활로 어떻게 자연스럽게 이어지는가?'
            ],
            ifDifficult: 'Q1 + Q2 = 미래의 나의 모습으로 자연스럽게 이어집니다. 두 축이 만나는 지점을 찾으세요.',
            ifStillDifficult: '"열심히 살겠습니다"가 아닌 "이런 사람이 되어 있을 것입니다"의 구체적 모습으로 표현하세요.',
            warning: '"입사 후 열심히 하겠습니다"로 끝내지 마세요. 성장과정의 마무리는 인생의 방향성입니다.'
          },
          placeholder: "예:\n[Q1 + Q2가 합쳐진 모습]\n현장에서 작동할 때까지 책임지는 사람(Q1) + 의견 차이를 데이터로 좁히는 사람(Q2)이 합쳐지면,\n\"끝까지 책임지되, 그 판단을 감이 아니라 근거로 세우는 설계자\"가 됩니다.\n이 두 축이 함께 있을 때 비로소 \"신뢰할 수 있는 설계 검증\"이 가능하다는 것을 4년의 경험으로 알게 되었습니다.\n\n[확장 방향]\n지금까지는 동아리·캡스톤·인턴 같은 작은 범위에서 두 강점을 작동시켰다면,\n앞으로는 협력사·타 부서·양산 현장처럼 이해관계가 더 큰 협업에서 같은 패턴을 확장하는 것이 저의 방향입니다.\n\n[5년 뒤 평가받고 싶은 한 줄]\n\"이 사람 도면은 현장에서 안 갈아내고, 설계 판단에 근거가 있다.\"\n이 한 줄이 Q1·Q2가 함께 도달하는 모습이며, 조직에서 일하게 되어도 동료·협력사와의 관계에서 자연스럽게 이어질 것입니다.",
          rows: 9, relatedWorkbooks: ['experience']
        }
      ]
    }
  ];

  // ── 2라운드: 심화 질문 ─────────────────────────────────
  const round2Questions = {
    1: [ // Q1 가치관 형성 심화 (5개)
      {
        id: 'q1_d1',
        label: 'Q1-심화1. "가치관"이라는 단어를 빼고도 같은 의미가 전달되도록 풀어 써보세요.',
        hint: '추상적 단어 없이 — 행동·기준·선택의 묘사만으로 가치관이 전달돼야 합니다',
        guide: {
          description: '"저의 가치관은 OO입니다"라는 문장을 빼고, 행동 패턴만으로 가치관을 드러내는 한 단락을 다시 써보세요.',
          diagnosis: '즉석자가진단: 가치관 단어를 빼고도 같은 메시지가 전달되는가?',
          helpQuestions: [
            '내가 하는 선택의 기준을 한 문장으로 표현하면?',
            '나의 행동 패턴을 누군가 옆에서 본다면 어떻게 묘사할까요?',
            '"OO한 사람이다"라는 표현을 추상명사가 아니라 행동 묘사로 바꾸면?'
          ],
          ifDifficult: '"이런 상황에서는 이렇게 합니다"의 구체적 행동 묘사로 시작하세요.',
          ifStillDifficult: '추상적 단어가 1개 이하로 줄어들면 성공입니다.'
        },
        placeholder: "예: 한 번 그린 도면은 가공과 조립을 통과해 실제로 맞물려 돌아가는 것을 확인하기 전까지 끝내지 않습니다.\n마감이 급해도 \"현장에서 갈아 맞추자\"는 말 대신 조립까지 책임지는 공차를 끝까지 계산합니다.\n그래서 동아리 선배들이 \"도현이 도면은 현장에서 안 갈아낸다\"고 표현합니다.\n→ \"책임\"이라는 단어를 한 번도 쓰지 않았지만 가치관이 명확하게 드러납니다.",
        rows: 5, relatedWorkbooks: ['experience']
      },
      {
        id: 'q1_d2',
        label: 'Q1-심화2. 형성 사건의 결정적 순간을 장면 단위로 구체화해보세요.',
        hint: '"언제·어디서·누가·무슨 말을·어떤 표정으로" — 영상을 정지시켜 한 장면씩 풀어 쓰기',
        guide: {
          description: 'Q1-2에서 쓴 형성 사건의 가장 결정적인 1분을 장면 단위로 풀어 쓰세요. 시간·장소·인물·발언·표정·내 반응까지 한 항목씩 분리해 적으면 추상적 묘사가 사라집니다.',
          diagnosis: '즉석자가진단: 그 장면을 모르는 사람이 읽어도 영상처럼 떠올릴 수 있는가?',
          helpQuestions: [
            '그 순간의 장소·시간·요일·주변 분위기는?',
            '누가 정확히 무슨 말을 했나요? 직접 인용으로 적어보세요.',
            '그때 상대방의 표정·말투·몸짓은 어땠나요?',
            '내 머릿속에 어떤 생각이 스쳤고, 그 직후 무엇을 했나요?'
          ],
          ifDifficult: '한 줄짜리 추상적 묘사를 [시간·장소], [발언], [표정·반응], [내 행동]의 네 항목으로 나눠 쓰는 작업입니다.',
          ifStillDifficult: '네 항목 중 기억나는 항목만이라도 채워 보세요. 흐릿한 부분은 비워두고, 선명한 항목만으로도 장면이 살아납니다.'
        },
        placeholder: "예:\n[시간·장소]\n1학년 겨울 1월, 자작자동차 동아리 첫 차량 조립 현장. 차고 한쪽에서 선배가 서스펜션 마운트 브래킷을 그라인더로 갈고 있었습니다.\n\n[발언]\n선배: \"도면은 맞는데 조립하면 항상 이래. 매년 이렇게 갈아.\"\n\n[표정·반응]\n선배는 익숙하다는 듯 말했지만, 갈려나간 알루미늄 가루와 틀어진 체결 구멍을 보며 저는 \"도면이 맞는데 왜 매년 갈지?\"라는 의문이 강하게 들었습니다.\n\n[내 생각·행동]\n그 순간 \"도면이 예쁜 것과 현장에서 맞는 것은 다른 일이구나\"라는 생각이 처음 들었습니다. 그날 저녁 노트에 \"다음 시즌 이 부품은 갈지 않게 만든다\"고 적었고, 공차 누적 분석을 공부하기 시작한 출발점이 되었습니다.",
        rows: 10, relatedWorkbooks: ['experience']
      },
      {
        id: 'q1_d3',
        label: 'Q1-심화3. 영향을 준 인물/환경의 영향이 약하다면 — "왜 다른 사람은 그렇지 않은가"로 검증',
        hint: '같은 환경의 다른 사람이 같은 가치관을 갖지 않는다면, 환경이 아닌 본인의 선택이 핵심',
        guide: {
          description: '같은 부모, 같은 학교, 같은 친구 그룹의 다른 사람들도 같은 가치관을 가졌나요? 그렇지 않다면, 그 차이가 바로 본인의 가치관 형성의 핵심입니다.',
          diagnosis: '즉석자가진단: 같은 환경의 사람과 나의 차이를 명확하게 설명할 수 있는가?',
          helpQuestions: [
            '같은 환경에 있던 다른 사람은 어떻게 다르게 자랐나요?',
            '왜 다른 사람이 아닌 내가 이 가치관을 받아들였나요?',
            '환경의 어떤 메시지를 내가 특별히 강하게 받아들였나요?'
          ],
          ifDifficult: '같은 사건을 겪고도 다른 가치관을 가진 친구·형제와 나의 차이를 떠올려보세요.',
          ifStillDifficult: '"환경 + 본인의 선택"이 합쳐서 가치관이 만들어진다고 표현하면 됩니다.'
        },
        placeholder: "예: 같은 조립 현장에 있던 동아리 동기들도 도면이 갈려나가는 것을 똑같이 봤습니다.\n하지만 대부분은 \"원래 자작차는 다 그렇게 맞춰\"라며 당연하게 넘겼고, \"갈지 않게 만들자\"고 결심한 사람은 저뿐이었습니다.\n제가 그 장면을 특히 강하게 받아들인 이유는, 그 직전 학기 고체역학 과제에서 \"계산은 맞는데 현실 조건을 안 넣어 틀린\" 경험을 한 직후였기 때문입니다.\n그 답답함이 막 가시지 않은 상태에서 도면 갈림을 봤기 때문에, 같은 현장의 다른 동기들보다 훨씬 깊게 새겨졌습니다.\n→ 환경의 영향만이 아니라, 그 시점 제 경험이 그 장면을 가치관으로 굳혀놓았다고 생각합니다.",
        rows: 5, relatedWorkbooks: ['experience']
      },
      {
        id: 'q1_d4',
        label: 'Q1-심화4. 가치관이 흔들렸던 또 다른 순간 — "한 번이 아니라 여러 번 시험받았다"',
        hint: '결정적 전환점 하나에 더해, 다른 시점에서도 시험받았던 경험을 추가하면 신뢰성이 올라갑니다',
        guide: {
          description: 'Q1-4에서 쓴 결정적 전환점 외에, 다른 시점에서도 비슷한 시험을 받은 경험을 작성하세요. 한 번이 아닌 반복된 검증이 가치관의 진정성을 보여줍니다.',
          diagnosis: '즉석자가진단: 가치관이 시험받은 또 다른 시점을 2개 이상 떠올릴 수 있는가?',
          helpQuestions: [
            '시기·장소·맥락이 다른 또 다른 시험의 순간은?',
            '가장 최근에 가치관이 시험받았던 순간은?',
            '시험받았을 때 흔들렸던 정도가 시간에 따라 어떻게 달라졌나요?'
          ],
          ifDifficult: '같은 가치관이 다른 상황에서 검증된 순간을 떠올려보세요.',
          ifStillDifficult: '한 번 더 시험받은 경험만 추가해도 충분합니다.'
        },
        placeholder: "예: 가치관이 시험받은 두 번째 순간은 3학년 여름 부품사 인턴 때였습니다.\n양산 도면 검도 중 공차 표기가 작성자마다 제각각인 것을 발견했지만, \"인턴이 굳이 기존 방식을 건드릴 필요 없다, 시킨 모델링만 하자\"는 마음이 들었습니다. 그러나 \"발견하고도 넘기는 것은 책임 완결이 아니다\"라고 생각해, 도면 200장을 전수 조사하고 ISO 기준 표준 가이드를 만들어 사수 검토를 받았습니다.\n\n세 번째 순간은 4학년 캡스톤 마감 직전, 해석-실측 6℃ 오차를 두고 팀이 \"그냥 제출하자\"고 했을 때였습니다. 이틀 밤을 들여 경계조건 오류를 찾아 오차를 1℃ 안으로 맞춰 제출했습니다.\n\n인턴 때는 며칠을 망설였지만, 캡스톤 때는 거의 망설임 없이 결정했습니다.\n→ 같은 가치관이 더 빠르고 단단하게 작동하는 것이 가치관의 성숙입니다.",
        rows: 8, relatedWorkbooks: ['experience']
      },
      {
        id: 'q1_d5',
        label: 'Q1-심화5. (옵션) 직무·회사 연결이 약하다면 — "가치관이 일하는 방식으로 변환되는 지점" 확인',
        hint: '다른 자소서 항목이 있다면 비워둬도 됩니다 — 직무 연결을 깊게 하려면 이 질문',
        guide: {
          description: '⚠️ 옵션 질문: 다른 자소서 항목(지원동기·직무역량·입사후포부)이 있다면 이 질문은 비워둬도 됩니다.\n\n성장과정만 단독으로 작성하거나, 직무 연결까지 깊게 다루고 싶을 때만 작성하세요.',
          diagnosis: '즉석자가진단: 가치관이 어떤 업무 태도로 변환되는지 한 문장으로 표현 가능한가?',
          helpQuestions: [
            '이 가치관을 가진 사람이 회의·프로젝트·고객 응대에서 어떻게 일할까요?',
            '회사의 인재상·핵심가치와 본인의 가치관이 어떻게 맞물리나요?',
            '같은 직무를 다른 가치관을 가진 사람이 한다면 어떤 차이가 생길까요?'
          ],
          ifDifficult: '비워두세요. 가치관 자체가 강하면 직무 연결이 약해도 괜찮습니다.',
          ifStillDifficult: '"이 가치관이 있는 사람이 이 일을 하면 OO한 방식으로 한다"의 한 문장만 작성하세요.'
        },
        placeholder: "예: \"현장에서 작동할 때까지 책임진다\"는 가치관은 기구설계 직무에서 다음의 일하는 방식으로 나타납니다.\n— 도면 출도 시점이 아니라 시작품·양산 조립이 통과해야 일이 끝났다고 보는 기준\n— 마감에 쫓겨도 검증되지 않은 공차·해석값을 결과로 내보내지 않는 신중함\n— 협력사 공정 능력을 직접 확인해 탁상공론을 막는 실무 감각\n→ 가치관 → 일하는 방식으로 자연스럽게 변환됩니다.",
        rows: 5, relatedWorkbooks: ['job_analysis', 'experience']
      }
    ],
    2: [ // Q2 성장 서사 심화 (6개) — "없었던 것이 만들어진 과정"의 깊이 보강
      {
        id: 'q2_d1',
        label: 'Q2-심화1. 부족했던 것의 근원 — "왜 그게 부족했는가"를 솔직하게 추적',
        hint: '환경·습관·경험 부족 — 부끄러운 것이 아니라 만들어진 강점의 출발점',
        guide: {
          description: '과거에 부족했던 것이 단순히 "성격 탓"이 아닌, 어떤 환경·습관·경험 부족에서 비롯되었는지 추적해 보세요. 근원이 보이면 그것이 만들어진 과정이 더 설득력 있게 됩니다.',
          diagnosis: '즉석자가진단: "왜 그게 없었는가?"에 환경·경험 차원에서 답변 가능한가?',
          helpQuestions: [
            '어린 시절·청소년기의 환경 중 어떤 부분이 이 강점을 키울 기회를 주지 않았나요?',
            '주변에 같은 또래·관계 안에서만 머물렀던 시간이 길었다면, 그 영향은?',
            '"이렇게 살아도 큰 문제가 없었던" 환경적 이유는?',
            '같은 환경의 다른 사람도 같은 부족함이 있었나요?'
          ],
          ifDifficult: '"환경이 그랬다 → 그래서 이 능력이 자랄 기회가 없었다"의 한 문장으로 시작하세요.',
          ifStillDifficult: '근원 추적은 변명이 아닙니다. 출발점을 인정해야 만들어진 과정이 더 분명해집니다.',
          warning: '"성격이 원래 그랬다"는 답이 아닙니다. 만들어진 환경·경험의 영향을 추적해야 합니다.'
        },
        placeholder: "예: 데이터로 의견 차이를 좁히는 능력이 부족했던 것은 단순히 성격 탓이 아니었습니다.\n고등학교까지 정답이 정해진 문제만 풀어왔고, \"내 답이 맞다\"를 증명하는 방식은 채점표뿐이었습니다.\n설계처럼 정답이 하나가 아닌 문제를 두고 의견을 조율해 본 경험이 없었기에, 갈리면 감으로 우기거나 권위(선배)에 따르는 것 외에 다른 방법을 몰랐습니다.\n같은 동아리 동기들도 비슷했기에, 이 부족함을 인식할 기회조차 거의 없었습니다.\n→ 동아리에서 정답이 없는 설계 논쟁에 부딪히고서야, 근거로 좁히는 능력이 길러질 기회가 그동안 없었다는 것을 알게 되었습니다.",
        rows: 6, relatedWorkbooks: ['experience']
      },
      {
        id: 'q2_d2',
        label: 'Q2-심화2. 결정적 계기의 순간 — 장면 단위로 구체화',
        hint: '"누가·언제·어디서·무슨 말을·어떤 표정으로" — 영상을 정지시켜 한 장면씩 풀어 쓰기',
        guide: {
          description: 'Q2-2에서 쓴 결정적 계기의 가장 결정적인 1분을 장면 단위로 풀어 쓰세요. 시간·장소·인물·발언·표정·내 반응까지 한 항목씩 분리해 적으면 추상적 묘사가 사라집니다.',
          diagnosis: '즉석자가진단: 그 장면을 모르는 사람이 읽어도 영상처럼 떠올릴 수 있는가?',
          helpQuestions: [
            '그 순간의 장소·시간·요일·주변 분위기는?',
            '누가 정확히 무슨 말을 했나요? 직접 인용으로 적어보세요.',
            '그때 상대방의 표정·말투·몸짓은 어땠나요?',
            '내 머릿속에 어떤 생각이 스쳤고, 그 직후 무엇을 했나요?'
          ],
          ifDifficult: '한 줄짜리 추상적 묘사를 [시간·장소], [발언], [표정·반응], [내 행동]의 네 항목으로 나눠 쓰는 작업입니다.',
          ifStillDifficult: '네 항목 중 기억나는 항목만이라도 채워 보세요.'
        },
        placeholder: "예:\n[시간·장소]\n2학년 3월 어느 화요일 저녁, 동아리 작업실. 프레임 보강 위치를 두고 선배와 며칠째 평행선이던 날, 화이트보드 앞에서 다시 부딪혔습니다.\n\n[발언]\n선배: \"느낌 말고 해석 돌려서 데이터로 가져와. 그럼 끝나는 얘기야.\"\n\n[표정·반응]\n선배는 화를 내지 않고 담담하게 말했고, 옆 동기들도 고개를 끄덕였습니다. 그 말이 비난이 아니라 \"이걸로 결론 내자\"는 제안으로 느껴졌습니다.\n\n[내 생각·행동]\n그 순간 \"내가 감으로 우기고 있었구나\"를 처음 자각했습니다. 그날 밤 ANSYS로 두 안을 모두 해석했고, 제 주장과 반대로 뒤쪽 비틀림이 더 크다는 결과를 들고 다음 날 선배에게 먼저 \"제가 틀렸네요, 뒤쪽으로 가시죠\"라고 말했습니다.\n그날 이후 의견이 갈리면 먼저 데이터로 확인하자고 제안하는 것이 새로운 행동 기준이 되었습니다.",
        rows: 10, relatedWorkbooks: ['experience']
      },
      {
        id: 'q2_d3',
        label: 'Q2-심화3. "자리잡았다"의 증거를 더 깊게 — 반복·확장·자동화의 3단계',
        hint: '같은 행동의 단순 반복을 넘어, 더 어려운 상황에서도 자동적으로 작동하는지가 진짜 증거',
        guide: {
          description: '강점이 "자리잡았다"는 것은 3단계의 증거가 모두 있을 때 완성됩니다. 단순 반복(같은 상황) → 확장(더 어려운 상황) → 자동화(생각하지 않고도 작동).',
          diagnosis: '즉석자가진단: 3단계 증거를 각각 1개 이상 댈 수 있는가?',
          helpQuestions: [
            '[1단계 — 반복] 같은 종류의 상황에서 같은 행동을 반복한 사례 2~3개는?',
            '[2단계 — 확장] 처음보다 더 어려운(이해관계가 큰·낯선 사람이 많은) 상황에서도 같은 행동을 한 사례는?',
            '[3단계 — 자동화] "의식하지 않아도 자연스럽게" 그 행동이 나오는 최근 사례는?',
            '3단계 중 약한 단계가 있다면, 그 부분이 앞으로의 확장 여지입니다.'
          ],
          ifDifficult: '1단계 → 3단계로 갈수록 사례가 적어지는 게 자연스럽습니다. 모두 채울 필요 없습니다.',
          ifStillDifficult: '아직 자동화 단계에 도달하지 못했다면, "지금 자리잡는 중"이라고 솔직하게 쓰는 것이 진정성입니다.'
        },
        placeholder: "예:\n[1단계 — 반복]\n동아리 설계 리뷰(대2~3) 데이터로 확인하자 제안 5회 이상 / 캡스톤(대4) 방열 핀 3개 안을 해석값으로 비교해 채택\n→ 같은 종류의 설계 논쟁에서 같은 행동이 반복됨\n\n[2단계 — 확장]\n인턴십(대4 여름) 사수와 공차 표기 방식이 갈렸을 때, 내 의견이 아닌 ISO 표준 근거 자료를 만들어 설득\n→ 동기가 아닌 권한 차이 큰 실무 사수로 확장됨\n\n[3단계 — 자동화]\n인턴 후반 도면 검도 회의에서 의견이 갈리자 의식적 결심 없이 \"그 케이스 해석값 있나요? 없으면 제가 돌려볼게요\"라고 자연스럽게 제안\n→ \"결심하는 단계\"를 넘어 \"자동으로 나오는 단계\"에 도달",
        rows: 9, relatedWorkbooks: ['experience']
      },
      {
        id: 'q2_d4',
        label: 'Q2-심화4. Q1 + Q2 두 축이 한 인격으로 보이는지 — 연결 지점 검증',
        hint: '본래 가지고 있던 가치관(Q1) + 새로 만들어진 강점(Q2) = 지금의 나, 라는 그림이 자연스러운가',
        guide: {
          description: 'Q1과 Q2가 별개의 이야기로 읽히지 않고, 한 사람의 입체적인 모습으로 보이는지 검토하세요. 두 축이 어떤 지점에서 만나는지가 핵심입니다.',
          diagnosis: '즉석자가진단: "Q1과 Q2가 함께 작동한 사례 1개"를 댈 수 있는가?',
          helpQuestions: [
            'Q1 가치관과 Q2 새 강점이 동시에 필요했던 상황은?',
            '두 축 중 하나만 있었다면 부족했을 경험은?',
            '두 축이 함께 있어서 더 큰 결과를 만들어낸 사례는?',
            '주변 사람이 두 축을 한 묶음으로 표현한 적이 있는가?'
          ],
          ifDifficult: '"Q1만 있는 사람"과 "Q1+Q2가 있는 사람"의 차이를 한 문장으로 표현해 보세요.',
          ifStillDifficult: '두 축이 만난 가장 최근 사례 하나만 떠올려도 충분합니다.'
        },
        placeholder: "예:\n[두 축이 함께 작동한 사례]\n4학년 캡스톤 마감 직전, 방열 해석값과 실측값이 6℃ 차이 났습니다.\nQ1(끝까지 책임)만 있었다면 \"무조건 원인 찾을 때까지 붙잡자\"로 팀을 마감 위험에 빠뜨렸을 것이고,\nQ2(데이터로 조율)만 있었다면 \"데이터상 오차범위니 그냥 넘기자\"가 됐을 것입니다.\n두 축이 함께 있었기에 — \"오차 범위인지 진짜 오류인지 경계조건부터 데이터로 확인하자\"고 팀을 설득해, 이틀 만에 접촉 열저항 오류를 찾아 1℃ 안으로 맞춰 마감도 지켰습니다.\n\n[주변의 평가]\n팀원: \"끝까지 파는데 근거로 설득하니 따라갈 수 있었다\"\n→ 두 축이 함께 있을 때 비로소 \"신뢰할 수 있는 설계자\"가 된다는 것을 한 사람이 한 줄로 표현해준 순간이었습니다.",
        rows: 8, relatedWorkbooks: ['experience']
      },
      {
        id: 'q2_d5',
        label: 'Q2-심화5. (옵션) "성장 중인 강점"을 자소서에 쓰는 게 부담스럽다면',
        hint: '"아직 완성되지 않은 것"을 쓰는 것이 오히려 신뢰를 높이는 3가지 조건',
        guide: {
          description: '"이미 다 만들어진 강점만 써야 하지 않을까?"라는 걱정이 있다면, 아래 3가지 조건을 점검해보세요. 진행 중인 성장이 오히려 진정성의 증거가 됩니다.',
          diagnosis: '즉석자가진단: 내 성장 서사가 아래 3가지 조건을 충족하는가?',
          helpQuestions: [
            '[조건 1] Q2-2에 결정적 계기(외부 자극 + 내부 결심)가 명확한가?',
            '[조건 2] Q2-3에 반복·확장·자동화 중 최소 2단계의 증거가 있는가?',
            '[조건 3] Q2-4 확장 방향이 "막연한 다짐"이 아닌 "Q1+Q2의 자연스러운 다음 단계"인가?'
          ],
          ifDifficult: '3가지 조건 중 2개 이상 충족하면 충분합니다. "완벽한 강점"보다 "자라고 있는 강점"이 더 매력적입니다.',
          ifStillDifficult: '조건이 부족하면 채용담당자도 부족함을 알아챕니다. 조건 충족이 먼저입니다.',
          warning: '"앞으로 잘하겠습니다"의 미래 약속만으로는 통하지 않습니다. 이미 일어난 변화의 증거가 있어야 합니다.'
        },
        placeholder: "예:\n[내 성장 서사의 조건 확인]\n① 결정적 계기: 2학년 설계 리뷰에서 선배의 \"해석으로 가져와\" 한마디 + 해석 결과 내 감이 틀림을 확인 → 외부 자극 + 내부 결심 모두 있음\n② 자리잡은 증거: 동아리·캡스톤 반복(1단계) + 인턴 사수로 확장(2단계) + 인턴 후반 자동 제안(3단계) → 3단계 모두 충족\n③ 확장 방향: Q1(현장까지 책임) + Q2(데이터로 조율) = \"끝까지 책임지되 근거로 판단하는 설계자\" → 자연스러운 다음 단계\n\n→ 3가지 조건이 충족되면 \"성장 중인 강점\"은 부담이 아닌 진정성의 증거가 됩니다.\n→ 채용담당자는 \"완성된 사람\"이 아닌 \"자라고 있는 사람\"을 더 신뢰합니다.",
        rows: 8, relatedWorkbooks: ['experience']
      },
      {
        id: 'q2_d6',
        label: 'Q2-심화6. 내가 쓴 성장 서사가 진짜인지 3가지 시각으로 점검',
        hint: '글로 쓴 것과 실제 나 사이의 간극 — 3가지 확인 통과해야 완성',
        guide: {
          description: '성장 서사를 쓰고 나서 읽어봤을 때 어색하다면 아래 3가지로 확인해보세요.',
          diagnosis: '즉석자가진단: 3가지 확인을 모두 통과했나요?',
          helpQuestions: [
            '[확인 1] 나를 잘 아는 사람에게 Q2를 보여주고 "맞아?"라고 물어보세요. "맞아, 너 그렇게 달라졌지"가 나오면 진짜입니다.',
            '[확인 2] Q2-3에서 쓴 자리잡은 행동이 최근 1주일 안에 실제로 나타났나요?',
            '[확인 3] 처음부터 끝까지 소리 내어 읽어보세요. 부족함 → 계기 → 자리잡음 → 확장의 흐름이 끊기는 부분은 없나요?'
          ],
          ifDifficult: '확인 1부터 시작하세요. 주변 사람 한 명에게 읽어달라고 부탁하는 것이 가장 빠릅니다.',
          ifStillDifficult: '확인 2가 "아니오"라면, 자리잡은 단계가 아직 진행 중인 것입니다. 솔직하게 그렇게 쓰는 것이 더 진정성 있습니다.'
        },
        placeholder: "예:\n[확인 1 — 타인에게 확인]\n동아리 선배에게 Q2를 읽어줬더니 \"맞아, 그때부터 너 달라졌어. 해석 돌려오라니까 진짜 돌려와서 내 말이 틀렸다고 들고 왔잖아\"라고 했습니다.\n→ 구체적 사건을 선배가 같은 기억으로 떠올렸다는 것이 진짜라는 증거입니다.\n\n[확인 3 — 흐름 점검]\n부족함(감으로 우기거나 권위에 따름) → 근원(정답 정해진 문제만 풀어온 환경) → 결정적 계기(2학년 설계 리뷰 \"해석으로 가져와\" + 해석으로 내 감이 틀림 확인) → 1단계 반복(동아리·캡스톤) → 2단계 확장(인턴 사수) → 3단계 자동화(인턴 후반) → Q1과 합쳐진 모습(끝까지 + 근거로) → 확장 방향(협력사·타 부서)\n→ 모든 단계가 자연스럽게 이어지면 완성입니다.",
        rows: 9, relatedWorkbooks: ['experience']
      }
    ]
  };

  // ── 3라운드: 연결 질문 (가치관 흐름 → 성장 흐름) ─────────
  const round3Questions = [
    {
      id: 'connect_value_core',
      label: '연결 ①→③: 핵심 가치관 + 형성 사건 + 영향 인물·환경을 하나의 단락으로',
      hint: '"저의 핵심 가치관은 [가치관]입니다. [형성 사건]을 통해 만들어졌고, [영향 인물/환경]을 통해 강화되었습니다."',
      placeholder: "예: 저의 핵심 가치관은 \"한 번 맡은 설계는 현장에서 작동할 때까지 책임진다\"는 것입니다. 자작자동차 동아리 1학년 겨울, 선배가 그린 마운트 브래킷이 조립 현장에서 그라인더로 갈려나가는 것을 본 뒤 \"도면이 예쁜 것과 현장에서 맞는 것은 다른 일\"임을 깨달았고, 다음 시즌 그 부품을 직접 맡아 공차 누적을 ±0.6mm로 잡아 현장 가공 0건·검차 무수정 통과를 만들며 책임 완결을 기준으로 삼게 되었습니다. 이 가치관은 \"도면은 가공·조립이 끝나야 완성\"이라고 늘 말씀하신 동아리 OB 선배(현직 기구설계 엔지니어)를 통해 \"설계는 가공·조립까지\"라는 명확한 언어를 얻으며 단단해졌습니다.",
      rows: 5,
      referenceQuestions: ['q1_1', 'q1_2', 'q1_3']
    },
    {
      id: 'connect_value_test',
      label: '연결 ④→⑤: 결정적 전환점 + 지속성 증거를 자연스럽게 연결',
      hint: '"이 가치관은 [시험받은 순간]에서 검증되었고, 이후에도 [다른 맥락·시점에서] 일관되게 작동하고 있습니다."',
      placeholder: "예: 3학년 인턴 시절 발견한 공차 표기 문제를 \"인턴이 굳이\"라며 넘기지 않고 도면 200장을 표준화한 순간, 그리고 4학년 캡스톤 마감 직전 해석-실측 6℃ 오차를 \"그냥 제출하자\"는 팀 의견에 맞서 경계조건 오류를 찾아 1℃ 안으로 맞춘 순간이, 가치관이 편할 때가 아니라 마감에 쫓겨 흔들릴 때 지키는 것임을 검증한 결정적 사건이었습니다. 이후에도 동아리·인턴·캡스톤 모든 맥락에서 같은 모습이 반복되었고, 동아리 선배·인턴 사수·캡스톤 교수님이 모두 \"검증 전엔 끝내지 않는 사람\"이라는 같은 표현을 씁니다.",
      rows: 5,
      referenceQuestions: ['q1_4', 'q1_5']
    },
    {
      id: 'connect_value_proof',
      label: '연결 ⑥→⑦: 대표 경험 + (옵션) 직무·회사 연결',
      hint: '"이 가치관은 [STAR 대표 경험]으로 가장 잘 드러나며, [직무·회사 연결은 선택적]"',
      placeholder: "예: 2학년 자작자동차 섀시 설계에서 경량화(28kg 이하)와 조립 무가공이라는 상충 목표를 두고, 약한 부재만 보강해 강성을 +9% 확보하면서 공차 누적을 ±1.8mm에서 ±0.6mm로 잡아 프레임 27.4kg·현장 가공 0건·검차 무수정 통과를 만든 경험은 이 가치관이 어떻게 결과로 이어지는지를 가장 잘 보여줍니다. (옵션 — 다른 자소서 항목 없는 경우) 이 가치관은 공차·양산성·검증이 핵심 태도가 되는 기구설계 직무에서 자연스럽게 일하는 방식으로 이어집니다.",
      rows: 5,
      referenceQuestions: ['q1_6', 'q1_7']
    },
    {
      id: 'connect_growth_recognition',
      label: '연결 ⑧→⑨: 과거의 부족함 + 결정적 계기를 자연스럽게 전환',
      hint: '"한편 과거에는 [부족했던 강점·가치관]이 없었습니다. [결정적 계기]를 통해 새롭게 만들어지기 시작했습니다."',
      placeholder: "예: 한편 동아리 초반까지 저에게는 정답이 하나가 아닌 설계 문제에서 의견 차이를 근거로 좁히는 능력이 거의 없었습니다. 고등학교까지 정답이 정해진 문제만 풀며 \"내 답이 맞다\"를 채점표로만 증명해온 환경의 영향이었습니다. 그러나 2학년 동아리 설계 리뷰에서 프레임 보강 위치를 두고 선배와 대립하던 중 \"느낌 말고 해석 돌려서 데이터로 가져와\"라는 말을 듣고 직접 해석을 돌려 제 감이 틀렸음을 확인한 직후, 의견 차이를 \"누가 맞냐의 싸움\"이 아닌 \"데이터로 함께 확인하면 끝나는 일\"로 재정의한 것이 새 강점의 시작이었습니다.",
      rows: 6,
      referenceQuestions: ['q2_1', 'q2_2']
    },
    {
      id: 'connect_growth_direction',
      label: '연결 ⑩→⑪: 자리잡은 증거 + 앞으로의 확장 방향으로 마무리',
      hint: '"이후 [반복·확장·자동화의 증거]를 통해 강점으로 자리잡았으며, 앞으로 [Q1+Q2가 합쳐진 방향]으로 확장될 것입니다."',
      placeholder: "예: 이후 동아리 설계 리뷰·캡스톤 방열안 비교에서 같은 패턴이 반복되었고, 3학년 인턴 시절에는 사수와 공차 표기가 갈렸을 때 ISO 표준 근거 자료로 설득했으며, 인턴 후반에는 의식하지 않아도 \"그 케이스 해석값 있나요?\"라고 먼저 제안할 만큼 자리잡았습니다. 현장에서 작동할 때까지 책임지는 사람(Q1)과 의견 차이를 데이터로 좁히는 사람(Q2)이 합쳐진 \"끝까지 책임지되 근거로 판단하는 설계자\"가 저의 방향이며, 조직에서 일하게 된다면 협력사·타 부서·양산 현장처럼 더 큰 협업으로 자연스럽게 확장될 것입니다.",
      rows: 6,
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
    if (currentPhase === 'round1') { if (currentPart < round1Steps.length - 1) setCurrentPart(s => s + 1); else setCurrentPhase('evaluation'); }
    else if (currentPhase === 'evaluation') { setSelectedSteps(p => [...p].sort((a, b) => a - b)); setCurrentPhase('round2'); setCurrentPart(0); }
    else if (currentPhase === 'round2') { if (currentPart < selectedSteps.length - 1) setCurrentPart(s => s + 1); else { setCurrentPhase('round3'); setCurrentPart(0); } }
    else if (currentPhase === 'round3') { if (currentPart < round3Questions.length - 1) setCurrentPart(s => s + 1); else { setFinalText(prev => (prev && prev.trim()) ? prev : generateFinalText()); setCurrentPhase('completed'); } }
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

  const generateFinalText = () => {
    const parts = [];
    if (answers.connect_value_core) parts.push(answers.connect_value_core);
    if (answers.connect_value_test) parts.push('\n' + answers.connect_value_test);
    if (answers.connect_value_proof) parts.push('\n' + answers.connect_value_proof);
    if (answers.connect_growth_recognition) parts.push('\n' + answers.connect_growth_recognition);
    if (answers.connect_growth_direction) parts.push('\n' + answers.connect_growth_direction);
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

    window.__CE_DOWNLOAD = { fn: () => __ceDlRef.current?.(), key: 'formative_experiences' };

    return () => { if (window.__CE_DOWNLOAD?.key === 'formative_experiences') window.__CE_DOWNLOAD = null; };

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
      
      const children = buildEssayDocxChildren('formative_experiences', { basicInfo, finalText, answers }, docxLib);

      try { children.push(...buildWorkbookBackupParagraphs(docxLib, buildWorkbookPayload('formative_experiences', '성장과정', 'careerengineer_formative_experiences_v1'))); } catch (e) { console.warn('[formative_experiences] backup embed skipped:', e); }
      try { children.unshift(...buildCopyrightParagraphs(docxLib)); } catch (e) { console.warn('copyright skip', e); }
      const doc = new Document({
        creator: '',
        title: '성장과정',
        sections: [{
          properties: { page: { margin: { top: 1400, right: 1133, bottom: 1400, left: 1133 } } },
          children: children
        }]
      });
      
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `성장과정_${(basicInfo.company || '미입력').replace(/[^a-zA-Z0-9가-힣\s]/g, '_')}_${today}.docx`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setDownloadSuccess(true); setTimeout(() => setDownloadSuccess(false), 5000);
    } catch (err) {
      console.error('docx 생성 실패:', err);
      alert('.docx 파일 생성에 실패했습니다.\n' + (err.message || ''));
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
    `[Q1 가치관 형성]\nQ1-1 (핵심 가치관): ${answers.q1_1||'-'}\nQ1-2 (형성 사건+강점 형성): ${answers.q1_2||'-'}\nQ1-3 (영향 인물·환경): ${answers.q1_3||'-'}\nQ1-4 (결정적 전환점): ${answers.q1_4||'-'}\nQ1-5 (지속성 증거): ${answers.q1_5||'-'}\nQ1-6 (대표 경험): ${answers.q1_6||'-'}\nQ1-7 (옵션 직무 연결): ${answers.q1_7||'-'}\n\n` +
    `[Q2 성장 서사 — 없었던 것이 만들어진 과정]\nQ2-1 (과거의 부족함): ${answers.q2_1||'-'}\nQ2-2 (결정적 계기): ${answers.q2_2||'-'}\nQ2-3 (자리잡은 증거): ${answers.q2_3||'-'}\nQ2-4 (확장 방향): ${answers.q2_4||'-'}\n\n` +
    `[3라운드 연결]\n①→③ 가치관+형성+영향: ${answers.connect_value_core||'-'}\n④→⑤ 전환점+지속성: ${answers.connect_value_test||'-'}\n⑥→⑦ 대표경험+직무연결: ${answers.connect_value_proof||'-'}\n⑧→⑨ 부족함+계기: ${answers.connect_growth_recognition||'-'}\n⑩→⑪ 자리잡음+확장: ${answers.connect_growth_direction||'-'}`;
  };

  const canGoNext = () => { if (currentPhase === 'evaluation') return selectedSteps.length >= 1; return true; };
  // 진행률은 현재 단계가 아니라 실제 작성한 핵심 답변 기반
  const ALL_ANS_KEYS = ['q1_1','q1_2','q1_3','q1_4','q1_5','q1_6','q1_7','q2_1','q2_2','q2_3','q2_4','connect_value_core','connect_value_test','connect_value_proof','connect_growth_direction','connect_growth_recognition'];
  const progress = Math.round(ALL_ANS_KEYS.filter((k) => (answers[k] || '').trim().length > 1).length / ALL_ANS_KEYS.length * 100);


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

  // [CE-HOME] WorkbookShell '처음으로' 버튼에서 호출

  const __ceHomeRef = useRef(null);

  useEffect(() => {

    if (typeof window === 'undefined') return;

    window.__CE_HOME = { fn: () => __ceHomeRef.current?.(), key: 'formative_experiences' };

    return () => { if (window.__CE_HOME?.key === 'formative_experiences') window.__CE_HOME = null; };

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

  // 인라인 참고 워크북 (가이드 PART 7-15)
  const RelatedWorkbookInline = ReferenceInline; // master 기반 inline 참고 패널 (shared)

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
  const CE_SYMBOL_B64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGYAAABgCAYAAADvhgd/AAABCGlDQ1BJQ0MgUHJvZmlsZQAAeJxjYGA8wQAELAYMDLl5JUVB7k4KEZFRCuwPGBiBEAwSk4sLGHADoKpv1yBqL+viUYcLcKakFicD6Q9ArFIEtBxopAiQLZIOYWuA2EkQtg2IXV5SUAJkB4DYRSFBzkB2CpCtkY7ETkJiJxcUgdT3ANk2uTmlyQh3M/Ck5oUGA2kOIJZhKGYIYnBncAL5H6IkfxEDg8VXBgbmCQixpJkMDNtbGRgkbiHEVBYwMPC3MDBsO48QQ4RJQWJRIliIBYiZ0tIYGD4tZ2DgjWRgEL7AwMAVDQsIHG5TALvNnSEfCNMZchhSgSKeDHkMyQx6QJYRgwGDIYMZAKbWPz9HbOBQAAAdlklEQVR42u1dd5hU1fl+v3PunbYz21iaEMWgSxH9BcESS5aVXoSlzICgYmWt0SQaTWIyuzF2ozEUWYhIFZgFpEiTsgtIUbChqNgAhSDFhV22zNx7z/l+f8wsEkREWMom+z3PffYy3Htn5rzna+/3nTNAndRJndRJnZwuiUQikpmpbiTOEGFmCgYj8pB/i7pROQNAqT7/bOv2K5i5YbX21I3OaZJwOCwS4DQcPXnG6J4DbuI//W3Epzt277v4vxEco7ZoSm7uGMnM6S9OnnfjjDmrcpcveTf67qe7znd53VOYuSMR/RsAAeC6aXyKZNiwAhMAXnmt6O/tutym0aBLNKXNDew6r5udkdmFn/rnlO3MnBEOh41wnc85RaAUFJggYObra19qkzWw1HNOZ+VvdR17WgzmQKsg+5r1Uo0v6MWPPffSJ35/0n9NQHDGfgFmpmHDCswxubl2pLA4PHLkKzd+sa0k2eXzkUYUBixIR8D0esW+CodHjZ2Z+ae/jlzEzI2JSNd2n3PG+hgiAMi1Z81efd+/Jr765zfe+kR4UgJaQQuCAwGGYECxDbcvib4trdSFc1Z0jUatB5k5TEQVYWaRT6TrgKkhTCKRiAiFSC1f/eFDoyfMe3LB2g91IDUdii2hwQABRBqaFIAYtLbhTQ6IjZu3W8J89ze+lFdczHwvEYGZiYi4DpgTD4vNUChkvbfxy3v/OXrik5E5y21/+lmG0DEiJrBwA3BARMzCICgBEMEihjfd73r7401W1Cq9OyngjzHzI7m5YxxmdmobOHSGgWLk5+c76zZtyfnHiAmvvjpvqe31pxpgk0gDDIKWBFtZKlpZIb2mR3tc6cJmDTYsaI7BkIxYWcxpk/kz43d33zBlcL/s6wFIAKrO+R8PKEVFRn5+vrPqrfe7/3Pky1MiC1cr+BsYmgxiraHJhJACdtUe3ShdyD/+/jZ1ySXnidLS7do0bYBtkBaA44EvKcXY9PHXasSoyddNmrZwlMvlUllZWUZt4tbOiMhlWEGB+dyAAc7a9Zt7TIrMnTN11usejycAg0wBxQARpCBYsQrVMM0rr+106epn/nR3KGZbnm/37PnFjh072DQ9xCzBIAAahtcnPt+6jW07eulfHw03fuaJR+cCMIqLizk/P7/OxxyT+crNtT/4aHuvsVNnT38pssjwegPaFBA2OwAJSMOEFXOU1yVkj05XrHvhiT/0I6LdzHybZPieGz4+Z9tOm6Uv1XDYgRIWQBrJ9RvSa0vX2VHLzn319TVf9e1yxeN5yBO1gR04rRpTUFBgPvDAA06VzV2fHT658MWJs5KkP4MFC0HMAAlAEKxohXIbSg7p33HL8Ccf7EBEeyPMsg2Rnjdr2vS/Pfb4eVu2/bvtV1/vtLxJXknKgsEEtgUFfKnys8+2qd0luzuNLBhpn3fjWW8AoBUrVnAdMD9As+Tn59pzF6/q/vyoaXOnzFrmES63FkKIuCsQkEKiMlqhmjTyy54d2857NO/X/ZJcrt3hcFjck52tmZk++ugC8dRj/ReRSzQqryq75MvPvrR97iQJLUAQYGKYPg99tPlLx+emzhe2bP5e35zeHxcVFRkTJkzQdabsEIlEIjIUCtlr3/m8R8H4aZFJkUWG15+hDQGhlAMNN7R0waoqdZqkeo1BvTuseewPd4eIKBoOh0V+fr6OJ6GkE3lKpctl3jZ5zjKyyqtuWb9xu+0NpJhaOwBpQLoJwk179h7gWEwH6qKyI0hRUZERCoXUjr0HOo+ZOD0ybe6ypEBaPTZk/LOQEBAkEbNiyuvWxp3X997x2G9vu52IopFIRFaD8h1DQBwOh4Vl2XJQj6xbf3fP0En/d2FTs+zAXseQgFAOiAEIAiSIDNOpA+Z7PmWDmZ2d7ezZU3HJE0+PfG3GvKVJwh3QDtyCWcJxAAkCW2Uq2aiQ990+YHdO/26dyeP5KKFlR8xF8vPzNTNz/wEDZL8eV935m7uCSy9q2dSo2l/quKQEYAOaIADYuorqgDnM0efmtrc/31p25VOjJs+bNOt104FHS+kS0BoaBGGYsKLlOs2n5LDre+zo3/OqgS3OPevjai07OrdGunXr1kxEFYOv7dJn2PXB5W0yzzXKS/bZJrkBFmAwIGoHdXZKfAwzCyKy3/1w56Ujxk56ceLs1xtWsVt5PT4JOwoCwxFu2I7SLsncv0/2zt/cfeN1DdKTVxUUFJjZ2dn2sbxPQnMEEVUyc5+qyn2zJk8v7fzx1v2OIAmGrjXp/0kHJhwfKM0VFU3zRs6ePeHVlY3LbCifx5TsxCAgwJLA0AzrAG69qa988P5br2uQ7lu1YcMGs3379vZPeb9EQCCIqJyZg5aunDVuSvE1X3yyLyqF10AdMAc1RTNzo/wnX1wzcvzcxgccn+Nzm4ZWUQBusDABstgq24PcG/qKO24Z2OusdN+KoiI22rcn+3je9xBwSpm5t0byvH88/0p27ECFY0qf/p8G5hBQ6j36j/GrX5y66GcHbKGTTRjCiqLScMMWAbjY0c7+7bh1YGc1dEifwS2aNZgfDodFdjadUPR0CDgVn376ac7Or74s9Eqzi11W5f6fBYaZKS8vD8zsvf2+8ONF6z/++e4y5ST5Aoa2qkBEEIJh6Cg7B0rE0P5dMaRfx2GXtGk+Ix4k5No18TmISIfDYZGZmVm2YMGC4Bdbv7mztGT3egAoLi6ulQW0EwIFCAsiwgN/+ftLLa8Isnn2NXag9QD2n9+PUzP7caBVf/a37K79zTqo0I2/ryxaueH2ROLpSjDANXkcbH06FLND/p7Qs2uFhMMs2rVrZzKzyHtq/PPnXjqI5Tkd7fTWfTjlvGs5+fwc9rcMsq9Nf2U2zbIG3PAQr3jjg4GnkB6StWVAjZrUFCLSgkgPHzt7amTu0kHb9+x3fL6A4SgFIQwwCAzmqpL9onenK8Sv77xpWIcrW05nZnc8CzzpeRXX8Gznk1UZpRoCRRCRLi0trTfi5VdHTpm1YuCn23Y5SUmmoTWgOU4oEhxWdqXqld3eHjKg2xN9umc9OmrclEn7Sp0r7ZitNCCYBJgSo8cn4AaIATCYBQgG+NBYguM1nmMZUkEaKoGlyRY0CcSUVOkBn7wg82cLe3T51T1HYyVOm8aEw2FBRMzMaU+PmDJ54vQF3T77uszxJ6cYWlWCyQCEG4IYlSU7nZsGdjXv//X1N7Vp3nwKM9cfetefc6bNWef3+v3QrKHB4MSI0XHPNj5EOapV5fieJqChyAABcKkoNBmo0grpySZuva5HEwAYOXIknVGmrJrpZWb3yPGzVhS8Mu/Cr3eW2ilJPlPbUZAUcFiCheSyfbvU4N6dzNuu6zO0TfPmU4Lxvi8t3B5tG9Bu6WWtHSJoEDGYjn8wwd/dyWAQAXRYDyADOJZCMzPAZIIYYJIASZAgB6QNZmGdcT4m4VOImeXIlwqXjJgw88ItO/Y7gaRUUzsWwBrQDFMQl5XsQbB3R+O6AV0fuPzyX0wMRiKyMBRSYGalBRgQQIwlNAlmCA1oAjTRYa7hp5wfhgL0Idabqz3Ejz6PmCFJgXTc9EkwDK2ES2vh1jadUcAwM4VCISGlUCPGzoxMmrHo6s+/3O6kpTQ0lGODSYIFgUmzU1HK3bPaUr8eVzxybZfL/h6MRGQkGDw4WQUzGyAWUrEmDc3fDavUOOhvDr5IRzinxB/+TguO9fzQe7/Xkk7fRdREDCKKX0KStTBYUfXwdQCw4vQCE08ei+WMwkJn1Lg5T/9r2sLg25u+duqlNjTYjgGQ0GQAgjkarVJXtW9l3HpDzqP9enV4LCsrbESCwUOdJAlbGVwZI2X4SGmARVxbiAHB303qY9WXo+F3LOffex4xQA6IKTFBGJZiGbMNsr5T6dOrMXHzFRJAoTNhWvEzI8ZNfeC9j7c6gbR6hmVXQUKASUAIYjtaym0zmxpDQj3v7derw4h2w4aZK8bk20T5OCSJjBFX7WiYajRzeUgrFoLp2O3/qRAiTqiTBnHcX8WsmFMvyW34PTrBUBSfXmCIQkKIGWrMpNnPjpgw7XfvfPKV4w/4pHKiYCGgWcKQBleUfasvbtlEDurT+Z7br+s5MhiMyMIxIfsQqqR6ola0bJ6WtaukqfR5vbUmka6sqkK9dC8ym2ZUAcCKFStOT1WUmWlYQYFpGAYmzVryZIf+9zA1zbZTWvbl9Mxe7GvVh92tQpx0wQ1aNO5kXdn5Rn76ubEPxyO3olpDtZ9JckwGIxiMyMLCkJr52rKnJkYW/X7OorVOIKOhhGOTBMESEoZwo2zft85lv2huXJ9zzcR7hg24uUNenijOy1NHy46rozsgXIuGLR9AGMx5fNp6oouK4jN+cdGGB/tcfz+j/mVOSutB7Gs5gJNb9OHkBCnpO6eL0zbrBh41fvYbzOwBQHXLvU+M1DsKS3yB6+abe9mr39py15iJs/4xc2Gxk1y/sdRKkQADkJCmC5VV++yfN/AZ99wyYNYdN/frSUR2vKaSXWOzKQGyONMb9WqK+qIf+T9+d+O23KefHze6cPFq25sSMBQrMojB2gCTB+XlJXbzc9PNe4f2Kb7v1oHd4qAw8vNPzoIhabjAmqtXNiV4r8OTyRqKl492DR9tBKsviOc+yrFPHElmpsLCQhEMBrFk2Zr7X5659NkZC9ZqlztAQljEcMCQIBFArPKAanVumrxlcM66waGcoQ1S6NNqQrOGNQXbtr3dqHTHB+OlXdrM0mCLPGSwAwkHXJ1j4PiSzeoElhP5UzUp8B+vH35N4n2qcyyd+MrxJikJQIA0tMcjhSXTNl10ebD/YRHpTwuXQ4WFojAUUovXbPzDi1MXPT577lIntV4j6cAhhgbBgCQPKsr26JbN0+Rv7x0ye2jfzkEicsLhmgUlLnlElK+//mJpfY+zu0vV7s0gg0BkQGg7QVjSEWcb/cAMPDnnh6jTQeQY0f0GKPWCpsCBDKLkPcxhQZSvfxIwkUhEDhw4UE2d+dpDz4+e+Oji4o1WckYTkx2bSGhoIggSsCpi6qLMn4s7bu22aGjfzkOISMWpbzpp3UFSuZxYmUtZFUkk3Yg3nGsTmgmaxPdNCx/n+bE8h49kaw6zgaRgUIXWQglB1j4gUJWI6H66xhQCEEJg644dXT/Y+KE0Dakpzs0m6AkBQMCOlXOL8zKpZ5c+k4mo8oUFC9yhHj1iJweSPAD5sG032Qak5YrCcDFsGCAFMAQ0JXwNjmaXjnb+A/bvcCKNj2D/DiKlE9fQwbjK4TRISSKmDEcaZvlxZ/6RYJARDNL6TV9Me+f9zwLLV73XPmpFtTTcghOEntYafr+Xileu1g+HK+5ctu6dDztefvH71bnOyQEGsGBBU6nSXMKsAcEmoAwAbvAZsDDuoAXn6uq1A5DmaJV20hqd36Bq/8cXuAPnbwLCdCxaY/znw0kn1kGO2b5975d/febF6S8Xvh5w+euTJBdBOwAx2CBZYVlq8fI3r0xL8UUqKviapCTacWgnfk1rDLkDlBw4W/qFhiEFhAZIe8FkAWSfdmCY+PtRGWnElAG3y+M4FZWBeCBTeEyh8xEv2rBhg9muXTu1dVfVZY8/9481L0+ez4GkJnBIEwsNAQUBAW2zY7Bl3HZjn51PhYe1IqLSkwEOMxO2bnV/VrGtn9stzo1WHmBAktAuQFjx2Xna5fCvLGCw1ElJAXGgPLqkedtOb9XI2ITDLJhZbvj408E3/TpPuxtcreu17KsDmX3Z36Iv+1v04uSWfdh/Xm9Vv1VXvj/v7+8yc/3qIKIudz+pGWlYAPm6aM3Ge/41adrz02cthze1idRkkmALDAUyDMTK96lzGmXI3p2uKnr2b/f2IqLKk6E5RUVFRocOtWh0ixGvoaGDrvE0IhyOuADg9VXr7rnurj+z0STb9meGdCAzxIFWOZzU6lpOaZXD7qY97BYXD+W/PDGumJmTq7Wubu4fn/woJZ+XF7SBsNH5qssKPEn+hiUl+x8pXr1Jub2pAiSItANmDW8gYHy1e58zZdZrWckZ7pl79+7tn5FBZTXNBNTJYRIMBiUALF7z/oMdg3eweVaWk95ioE7NHMApmf05ObMvp7box95mna3zLwvx8IK5y5jZB8SXYpwCk1zrjnA4LH6IgT9m1pOZqbi4WGZnZzsTZsx9eMLkBU+sXL3JSU1tIG0I0mSDBUNKgVhZzDn/Z/WNu27NWX7HLTm9iCha3alZN8VryJQdkuMwACcrHDaGDuj95HNjp8DlMZ5Ytepjx/SlS4IgQMNRDjwBr/HJlzud8dMXXbO/sryAmW+Jc2knJ5QuLi52FxcXo1ltGPHEh6xIqm+0bfLLeoGmGWUXnXPOvuMG5mCgkZen8tDBeGDYNU+ufn8zP/3sv56cu2iNSqnXWNjaIJADm20kpfmMdzd9bu/au/sGR6EBMweJ6EBN+ZxD9iI7Z9majavHTFpCvkA6QznEgqCI4msuD+lHOpZOmhOl2n6IUouf6/jBJgx2UZJvafLddw3Z5PG4L41GYycGTLXmBIMR+cuLMp96dWGx1KQfm7twnUpOP1s4DGJywOwgKSVgfrOnwpk2fVFXl0YhM+cQUbSGN3gzY7Y8a285wyMEoASYCEoQNMWb1ATHOzKPafRPtJ5zFJSJBQQYpA2QJuDbfSiPWelCEE5YYw4SnoUhnZWVZfTt3uHx8TPnI1rlPLZk5QeOLzXNYDYAYthawe33G59u3WtPn13c1eWR8xLgVJyoWYsTNfGvbUBrw+Ull8vHUDYBDEWAFnH6lfjM2VyWEWfDhYaWHo8QBtnMXHPAAODi4mKVm5tr3jyg5+NTXl2WbGv7oVXrPrCT/PVNR8W7Fx3NCKSlmx98ts15efr8TikZGYXMHIqDw6ImKp2SFZHWRFqBtEUEdXCGEgTABDqMMuFTZMr+syBAsCWg4lupEOkoAQ4dKQY7odaiRJe/s3lzY2NosOvDkQVF51ix6KB167dYgeT6rnjVV8PWVfCkeY2PvvzGeX5kpHuyRxYyc99DorUTms6W4WFbuuFIF0vYiYpifGbSQbZXf09rThUwB9kzBkzENy8SbLCL3Sy1W59QVPYj4Ciij2ROp6tui1XGtipnysPr391mB1LPMklXAmSBAfj9Scann39lPzMq0i0G9wRmvr5Dhw4MsAKOHxxtR4Wu3I9Kt4dY2RAc39KUE2ZMagCkoEkk1ssQRHVd+BSKONj2S2CukDGnDGRrH9W0xhwGjiaiCinFH555cQprFP1h/XtbnNTUVGlpk6prS75kv7nhwy/sgnFTQxLRqpUrV9zUbliuuaHgp+1bmYjsCMC2tq1//uYff3tLa4vdSrOSBBscr+9BaIJkgJEAiwkEgkz04p5ozf975zjCNd/TTAHAVl5TybMapc2OWRYON+s12veVCIXZ5/Ny+Omx4yfNmDf0iy0lMD0prCAIpAA4EEJyecku55pftjFuvzE4fFDfTvclCm36eKZxgpszfwJheya1QJUSkfOf0+IkSGKFMHm9Hjz54rglTS/qZgV+3lMntxjI/pYDOKnVtexr1YdTWvfXRqMs1SP0W569aMPDABCsKxec9KCQAJAgwrNjpr/dqFV3y9fsWie55QBObn0tJ7XsxUktBnBqy0FaNshyeg1+kJdv+HAoEN8M6Hiy/x86qjtJi157s9Hi4pVvFm944+rq149236k8juiPThKnyAD4tttHm9cN6t71jlt6L2tUj6RVUWZJ7YWhXSBWcDhK/rQ0sbj4Xfv54dPHL1u36Ybc3Fz7hRdecP9UH3eko7CwUGRnZzvM3GjqklVzZs5ccWm9wFnnVvuyH7rvVB8nJSo7mjRu/G/VJDl574EYP2SY3uSC8bOv2LW3zPH7Ug1NCgo2QJq8yT5jedGbSlWWPb90xdtJnbLajT7RlcDV9zNz/T89MXbBnAXL2/7yklbKJd12bbA5JxWY/Px8HYlEZMBNG/eV8z2KadJLE2desGdPmeP2+w0NA1o4ACsyXD5avf7zet6XZj0xddai7aF+3V4bNqzAHDPmp29fkghCVPmWLY0ef2bs/BnzVrXdtbc0aiYleWyt6H8eGAAIhUIqEmGZ5qd3mfmyRvXS5w0fOzV78xf/tpLSGroslVidLFkoYeq5y95IjtoV8+YuWvdg726XPxt++WVP/s03R3+KphCRYuYGt98Tnrto+ZsXl0Q9DgVSDUdryFoSXpySRUWhEKmioiKDiCqYeWiVVTV11L+mX7lle4nyBDKk1gIKVdAGCXeyX6944wMVK8dDc+a/5erT89LHg8GgLCwsVD/BfGXc/dBTCxav/ajdt1HheH0+o7K0xKlNa0JOWU0+OzvbSczmr++7Ndj/+oHd3m5QzyWjFfs1CSO+RbwGBAshvMn05ntfZIybNONPc5asvHPGjEJ1hI16jgjKAeaGjzwzeuG8JW+02/VtuePypBhKA/HtfjVqyxb/p3QZXrVZI6JdzNyZ4N48fMy0+uWxUmW4fBI6vhCVCEImmXp+8Vpfcrp/1OIVb3/a5VftllX/KMMP+ZQdZWUZY8cWznlp8sL2+8uU4/WlGFopCBlv7WUIZpZcB8wPmLWE5uxj5qu1souGj57UOBaDMkyP1Jqg4cCRSrhT0/X0WSu0iulFb7+/uWO7/2uxMlxUZORnZzuHsw3M3PC5cZHXXnhxWvuSA4bj9voNpSyI6pSfHYa2CcxmHTBH1ZyIJKLN335b2p9gLXxmxNQU7ZAi6ZOCBEAOGEJ4A8k09/UVkB696PM9+3qdVz9teUHBBjM3t719iKMXoybOXzpyzMw2O/fFHK83zWAVhWQHJEywMBnqANVP93FquncPAOzZs4frgPkBcIqK2KhXj9Zu/mpnlypHzB89pjDDUYaWblMgUe2DUEQer56zZL1X4Z+FX3y1t3vzszPeCkcirlAoZDFzYOS4WXNGjXu1zVc7yxxPIGBopwoGMUR8JycuLdnNOT07GFdfeemdZ9VrsDAcDoua3i3pvwaYeEBATiQSkS3ObvzWJ1t35BwoLZ39yqvLMyqjSrncSVLDAcOCMFzCipnOwtc3prupoOCNNz+8+arL2rzHzI0mz1gyZsL0edkfbd2mktMbG8qyIMiBIh80S9jle9Ht6tYi2P3qO4b0615wMraw+q8DplpzwuEio2WzJqu3l5b2KasoXThn/tvJytIKpimJAM0OTA8bVoydeYtW/8Jl8PS1b2/JeW74S71mLX7z2vUbv7RSMxq5LEtBMiAZUEJzeXmFc3mbZjSkf7f7h4S6F2RlZRmhUKhWbCF/xoT2RUVFRnZ2trPlm28u/0v+6Pmz5q9NF26fJmkIJg3NDqTQgBNlchT16dEbG9/5EB9u+1p5U9Kkdpz4KgTWMCWjZN9+q8OvLnH97u4hz/fscPFvg8Gwq7Aw30ItkTMq54owyxCRWrbi7V+NL5wze/qcpak+bz0GuYViBZADQQStJds2kyFNsCEAaEgdB05Kif0l+5wrLj7fuOu20AMDczoOz8vL03k/shFEnSk7mlkjUgUFBWbHrHYrF61ed4thyJmTprzOgdSmWkIIZglNBCaQ6WEw2zBYgyDi9X2S2F+yx2nb5jyjb6/sRwb17fT3QUCt/MnFM64bPzc31x5WUGB2u/Ly2TeFet83ONhFVlXuZWZbk2AwOdCwAdYQSkCoeL2XpJv3l5bZF1/Ywgj2ufqlB++9/rFgMChr6+9gnrESDocNAPhsx66ud/3x6ZjvZ1nsz7xW+S/oy95W/TmpxQBOyRzAyS0GcUrrwUwNsu1eQx7maXNXP0IAatuv+NVKcIrf+qDfzfc++a2/WTb7MruopFZ9OdAqyIHM/uxvdR2LJl1VVq87ePK0RY8xs1mtKXUjeFLBiZeGV675KCvnht8cSD43i5Oad1fJrfuzv3VfxtnXOG0738Ljpsx7WcS3ManbXOhUSXUfwKoNn1zVqe+dJUnnduTk1v2UPKe7dUHWII68VrwWAFBnvk4fOAtXvNOnx+DflCP1Qrt9l2E8bvKCGcyckpUVNlCb9tv/rzJriY6XF8a+3O2+B//MTz07cjQzpwDfbQZUJ6dBqjc5ZWbjmx1bcpjZlQgS6hbhnqFg1ckZQ99EInUhcZ3USZ0k5P8BC5EiijONfgkAAAAASUVORK5CYII=";
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


  // ══════════════════ 인트로 ══════════════════
      if (showIntro) return (
    <IntroPage
      workbookKey='formative_experiences'
      stepLabel='STEP 4 · 성장과정 작성'
      title='성장과정'
      subtitle='3라운드 체계적 작성으로 완성하는 성장과정 항목'
      flow={[
          { label: '1라운드', desc: '두 축의 성장 — Q1 가치관 형성(핵심 가치관·형성사건·영향인물·전환점·일관성·대표경험·옵션직무연결) / Q2 없었던 것이 만들어진 과정(과거의 부족함·결정적 계기·자리잡은 증거·확장 방향)' },
          { label: '2라운드', desc: '약한 부분 보강 — 부족한 답변을 심화 질문으로 구체화 (Q1 5개 + Q2 6개 심화)' },
          { label: '3라운드', desc: '연결 및 완성 — Q1·Q2 두 축이 한 인격으로 보이도록 연결' },
        ]}
      flowTitle={'3라운드 작성 시스템'}
      prerequisites={[
          {
            text: '지원할 회사의 채용공고 (직무상세내용) — 직무 연결을 다루는 경우',
            recommend: {
              workbookId: 'job_analysis',
              condition: '가치관과 직무 연결까지 다루려면',
              linkLabel: '채용공고 및 직무분석 가이드',
            },
          },
          {
            text: '두 축(가치관 + 새 강점)의 성장 서사를 증명할 구체 경험',
            recommend: {
              workbookId: 'experience',
              condition: '경험을 아직 정리하지 못했다면',
              linkLabel: '경험정리 가이드 워크북',
            },
          },
        ]}
      helpModal={<FirstVisitModal open={showHelp} onClose={() => setShowHelp(false)} title='성장과정 워크북 사용 안내' steps={[
          '<strong>1라운드 → 2라운드 → 3라운드</strong> 순서로 진행하세요.',
          '<strong>Q1은 이미 가진 가치관</strong>, <strong>Q2는 과거에 없었다가 새로 만들어진 강점</strong>입니다. 두 축이 함께 있어야 입체적인 성장과정이 됩니다.',
          '가치관·강점은 <strong>추상적 단어</strong>가 아닌 <strong>행동·기준·선택의 묘사</strong>로 표현하세요.',
          '직무 연결(Q1-7, Q1-심화5)은 <strong>옵션</strong>입니다 — 다른 자소서 항목이 있다면 가볍게, 없다면 깊게 작성하세요.',
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
            <button onClick={() => window.__CE_RESET?.fn?.()} title="이 워크북 작성 내용을 모두 지우고 처음부터 다시 작성" style={{ background: 'transparent', color: COLORS.red, border: `1px solid ${COLORS.red}66`, borderRadius: 10, padding: '0 14px', fontSize: 16, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', height: 40, display: 'inline-flex', alignItems: 'center', marginRight: 6 }}>삭제하고 다시 작성</button><button onClick={goHome} title="처음 페이지로 이동 (작성 내용 유지)" style={{ background: 'transparent', color: COLORS.sub, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: '0 14px', fontSize: 16, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', height: 40, display: 'inline-flex', alignItems: 'center' }}>처음으로</button>
            
            
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
            <button onClick={() => window.__CE_RESET?.fn?.()} title="이 워크북 작성 내용을 모두 지우고 처음부터 다시 작성" style={{ background: 'transparent', color: COLORS.red, border: `1px solid ${COLORS.red}66`, borderRadius: 10, padding: '0 14px', fontSize: 16, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', height: 40, display: 'inline-flex', alignItems: 'center', marginRight: 6 }}>삭제하고 다시 작성</button><button onClick={goHome} title="처음 페이지로 이동 (작성 내용 유지)" style={{ background: 'transparent', color: COLORS.sub, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: '0 14px', fontSize: 16, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', height: 40, display: 'inline-flex', alignItems: 'center' }}>처음으로</button>
            
            
          </div>
        </div>

        <div style={S.cardLarge}>
          <div style={{ textAlign: 'center', marginBottom: SPACING.xl }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, background: COLORS.greenBg, borderRadius: RADIUS.pill, marginBottom: SPACING.base }}>
              </div>
            <h2 style={{ ...S.h2, textAlign: 'center', marginBottom: 4 }}>성장과정 완성</h2>
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
              새로고침하면 <strong>모든 내용이 삭제</strong>됩니다. 아래 <strong>"다운로드 (.docx)"</strong> 버튼을 눌러 저장하세요.
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
                <p style={{ fontSize: FONT.size.xs, fontWeight: FONT.weight.bold, color: COLORS.accent2, margin: 0, marginBottom: SPACING.sm }}>도입부 — 핵심 가치관 + 형성 (①→③)</p>
                {answers.connect_value_core && (
                  <div style={{ background: COLORS.blueBg, borderRadius: RADIUS.sm, padding: SPACING.sm, marginBottom: 6 }}>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.blue, fontWeight: FONT.weight.semibold, margin: 0 }}>연결 ①→③ (권장)</p>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.accent, margin: 0, marginTop: 4, lineHeight: FONT.lineHeight.base }}>{answers.connect_value_core.substring(0,200)}{answers.connect_value_core.length>200?'...':''}</p>
                  </div>
                )}
                <p style={{ fontSize: FONT.size.xs, color: COLORS.accent2, margin: 0, marginTop: SPACING.sm, fontStyle: 'italic' }}>연결 예시: "\"제 핵심 가치관 ○○은 ○○ 사건에서 ○○의 영향으로 형성됐습니다...\""</p>
              </div>

              <div style={{ background: COLORS.bg, borderLeft: `3px solid ${COLORS.accent2}`, borderRadius: `0 ${RADIUS.sm}px ${RADIUS.sm}px 0`, padding: SPACING.base, marginBottom: SPACING.sm }}>
                <p style={{ fontSize: FONT.size.xs, fontWeight: FONT.weight.bold, color: COLORS.accent2, margin: 0, marginBottom: SPACING.sm }}>중반부 — 전환점과 지속성 (④→⑤)</p>
                {answers.connect_value_test && (
                  <div style={{ background: COLORS.blueBg, borderRadius: RADIUS.sm, padding: SPACING.sm, marginBottom: 6 }}>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.blue, fontWeight: FONT.weight.semibold, margin: 0 }}>연결 ④→⑤ (권장)</p>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.accent, margin: 0, marginTop: 4, lineHeight: FONT.lineHeight.base }}>{answers.connect_value_test.substring(0,200)}{answers.connect_value_test.length>200?'...':''}</p>
                  </div>
                )}
                <p style={{ fontSize: FONT.size.xs, color: COLORS.accent2, margin: 0, marginTop: SPACING.sm, fontStyle: 'italic' }}>연결 예시: "\"결정적 전환점은 ○○이었고, 그 이후 ○○로 일관되게 이어졌습니다...\""</p>
              </div>

              <div style={{ background: COLORS.bg, borderLeft: `3px solid ${COLORS.accent2}`, borderRadius: `0 ${RADIUS.sm}px ${RADIUS.sm}px 0`, padding: SPACING.base, marginBottom: SPACING.sm }}>
                <p style={{ fontSize: FONT.size.xs, fontWeight: FONT.weight.bold, color: COLORS.accent2, margin: 0, marginBottom: SPACING.sm }}>후반부 — 대표 경험 + 직무 연결 (⑥→⑦)</p>
                {answers.connect_value_proof && (
                  <div style={{ background: COLORS.blueBg, borderRadius: RADIUS.sm, padding: SPACING.sm, marginBottom: 6 }}>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.blue, fontWeight: FONT.weight.semibold, margin: 0 }}>연결 ⑥→⑦ (권장)</p>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.accent, margin: 0, marginTop: 4, lineHeight: FONT.lineHeight.base }}>{answers.connect_value_proof.substring(0,200)}{answers.connect_value_proof.length>200?'...':''}</p>
                  </div>
                )}
                <p style={{ fontSize: FONT.size.xs, color: COLORS.accent2, margin: 0, marginTop: SPACING.sm, fontStyle: 'italic' }}>연결 예시: "\"이 가치관은 ○○ 경험에서 가장 잘 드러났고, 이 직무에서 이렇게 작동합니다...\""</p>
              </div>

              <div style={{ background: COLORS.bg, borderLeft: `3px solid ${COLORS.accent2}`, borderRadius: `0 ${RADIUS.sm}px ${RADIUS.sm}px 0`, padding: SPACING.base, marginBottom: SPACING.sm }}>
                <p style={{ fontSize: FONT.size.xs, fontWeight: FONT.weight.bold, color: COLORS.accent2, margin: 0, marginBottom: SPACING.sm }}>성장 — 부족함 인식과 계기 (⑧→⑨)</p>
                {answers.connect_growth_recognition && (
                  <div style={{ background: COLORS.blueBg, borderRadius: RADIUS.sm, padding: SPACING.sm, marginBottom: 6 }}>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.blue, fontWeight: FONT.weight.semibold, margin: 0 }}>연결 ⑧→⑨ (권장)</p>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.accent, margin: 0, marginTop: 4, lineHeight: FONT.lineHeight.base }}>{answers.connect_growth_recognition.substring(0,200)}{answers.connect_growth_recognition.length>200?'...':''}</p>
                  </div>
                )}
                <p style={{ fontSize: FONT.size.xs, color: COLORS.accent2, margin: 0, marginTop: SPACING.sm, fontStyle: 'italic' }}>연결 예시: "\"과거엔 ○○이 부족했지만, ○○ 계기로 만들어지기 시작했습니다...\""</p>
              </div>

              <div style={{ background: COLORS.bg, borderLeft: `3px solid ${COLORS.accent2}`, borderRadius: `0 ${RADIUS.sm}px ${RADIUS.sm}px 0`, padding: SPACING.base, marginBottom: SPACING.sm }}>
                <p style={{ fontSize: FONT.size.xs, fontWeight: FONT.weight.bold, color: COLORS.accent2, margin: 0, marginBottom: SPACING.sm }}>마무리 — 자리잡음과 확장 (⑩→⑪)</p>
                {answers.connect_growth_direction && (
                  <div style={{ background: COLORS.blueBg, borderRadius: RADIUS.sm, padding: SPACING.sm, marginBottom: 6 }}>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.blue, fontWeight: FONT.weight.semibold, margin: 0 }}>연결 ⑩→⑪ (권장)</p>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.accent, margin: 0, marginTop: 4, lineHeight: FONT.lineHeight.base }}>{answers.connect_growth_direction.substring(0,200)}{answers.connect_growth_direction.length>200?'...':''}</p>
                  </div>
                )}
                <p style={{ fontSize: FONT.size.xs, color: COLORS.accent2, margin: 0, marginTop: SPACING.sm, fontStyle: 'italic' }}>연결 예시: "\"이제 ○○이 자리잡았고, 앞으로 ○○로 확장해 가겠습니다...\""</p>
              </div>
            </div>

            <div style={{ ...S.boxSuccess, marginBottom: SPACING.md }}>
              <p style={{ ...labelStyle(COLORS.green), marginBottom: SPACING.sm }}>SUCCESS · 수정 전 최종 확인</p>
              <p style={{ fontSize: FONT.size.xs, color: COLORS.sub, margin: `0 0 ${SPACING.sm}px`, lineHeight: FONT.lineHeight.base }}>각 항목을 확인하며 체크하세요. 통과하지 못한 항목이 있다면 해당 Q로 돌아가 보완합니다.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { n: "①", q: "Q1: 핵심 가치관이 추상적 단어가 아닌 행동·기준으로 드러나는가? 형성 사건과 강점 형성 과정이 보이는가?", miss: "Q1-1, Q1-2" },
                { n: "②", q: "Q2: 과거의 부족함 + 결정적 계기 + 자리잡은 증거(반복·확장·자동화)가 모두 있는가?", miss: "Q2-1, Q2-2, Q2-3" },
                { n: "③", q: "통합: Q1(이미 가진 가치관) + Q2(새로 만들어진 강점)가 한 인격으로 보이는가?", miss: "Q2-심화4" }
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
            <p style={{ fontSize: FONT.size.xs, color: COLORS.sub, textAlign: 'right', margin: '4px 0 0', fontVariantNumeric: 'tabular-nums' }}>
              {(finalText || '').length}자
            </p>
            <AnswerQualityCheck text={finalText} focusArea={['motivation','difficulty','number','autonomy']} />
          </div>

          {showRawAnswers && (
            <div style={S.boxNeutral}>
              <h4 style={{ fontSize: FONT.size.md, fontWeight: FONT.weight.semibold, color: COLORS.accent, marginTop: 0, marginBottom: SPACING.sm }}>원본 답변 참고</h4>
              <pre style={{ fontSize: FONT.size.sm, color: COLORS.accent, whiteSpace: 'pre-wrap', fontFamily: FONT.family, margin: 0, lineHeight: FONT.lineHeight.relaxed }}>{getRawAnswersText()}</pre>
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

  // ══════════════════ 메인 질문 화면 ══════════════════
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
            {/* 좌: 워드마크 */}
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

          {currentPart === 0 && currentPhase === 'round1' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
              {[["position", "지원하고자 하는 직무", "예: 기구 설계, 기계 설계, 전자 설계 등"], ["company", "지원하고자 하는 회사명", "예: 삼성전자, 현대자동차 등"]].map(([f, l, p]) => (
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
                        {q.relatedWorkbooks && <RelatedWorkbookInline ids={q.relatedWorkbooks} questionId={q.id || q.label} workbookKey="formative_experiences" />}
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

        <StickyFooter />
      </div>
    </div>
  );
};

export default FormativeExperiencesWorkbook;
