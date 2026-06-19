import React, { useState, useMemo, useEffect, useRef } from 'react';
import * as DOCX from 'docx';
import { clickable } from '../../shared/a11y.js';
import { COLORS, FONT, SPACING, RADIUS } from '../../shared/design/tokens.js';
import { ReferenceInline } from '../../shared/components/ReferenceInline.jsx';
import { saveExperienceXlsx } from '../../store/experienceXlsx.js';
import { EXPERIENCE_CATEGORIES, PERSONA_QUESTIONS, SCORE_GUIDE, SCORE_NOTES, DISCOVERY_CHECKLIST, COMMUNICATION_COMPETENCIES, ATTITUDE_COMPETENCIES } from './data.js';
import { _INTRO_FONT, StickyFooter, FocusStyles } from '../_shared/brandKit.jsx';
import { _INTRO_INK, _INTRO_INK2, _INTRO_PAPER, _INTRO_GOLD, _INTRO_MUTE, CELockupA, FirstVisitModal, BrandHero, IntroCTA, IntroFlowCard, IntroCopyright } from '../_shared/brandKit.jsx';
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
    <div style={{ background: 'COLORS.bg', border: `1px solid ${_INTRO_GOLD}33`, color: _INTRO_INK, padding: 16, borderRadius: RADIUS.base, marginBottom: 16 }}>
      <p style={{ fontSize: 15, fontWeight: 700, color: _INTRO_INK, margin: 0, marginBottom: 10 }}>사전 준비물</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((item, i) => {
          // item은 string이거나 { text, recommend: { workbookId, condition } } 형태
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
const BOX = {
  tip:     { background: COLORS.yellowBg, border: `1px solid ${COLORS.yellow}33`, color: COLORS.accent },
  warning: { background: COLORS.redBg,    border: `1px solid ${COLORS.red}33`,    color: COLORS.accent },
  success: { background: COLORS.greenBg,  border: `1px solid ${COLORS.green}33`,  color: COLORS.accent },
  info:    { background: COLORS.blueBg,   border: `1px solid ${COLORS.blue}33`,   color: COLORS.accent },
};
// ────────────────────────────────────────────────────────────
//  경험 카테고리 (xlsx 원본 7개 + 유도질문)

// 경험 category 문자열을 7개 표준 카테고리 id로 관용 매칭 (정확 라벨/약식/임포트 표기 모두 수용)
// → 인벤토리에서 "카운트만 잡히고 카드가 안 보이는" 문제 방지
function categoryIdOf(raw) {
  const c = (raw || '').trim();
  if (!c) return 'school';
  const exact = EXPERIENCE_CATEGORIES.find((x) => x.label === c);
  if (exact) return exact.id;
  if (/학교|수업|학업|전공|학술|과제|발표/.test(c)) return 'school';
  if (/동아리|학회|학생회/.test(c)) return 'club';
  if (/인턴|아르바이트|알바|근무|현장실습/.test(c)) return 'intern';
  if (/대외|공모전|봉사|서포터즈/.test(c)) return 'extern';
  if (/자격|교육|수료|부트캠프|강의|자기계발|독학|온라인/.test(c)) return 'cert';
  if (/개인|블로그|취미|여행|프로젝트/.test(c)) return 'personal';
  if (/일상|가족|모임|친구/.test(c)) return 'daily';
  return 'school'; // 미매칭도 보이도록 학교 활동으로 귀속
}

// 카테고리 재정렬 (페르소나 상태별)
const orderCategoriesByPersona = (status) => {
  const order = (() => {
    if (status === 'career' || status === 'transfer') {
      // 경력직/전환: 인턴·대외활동 우선
      return ['intern', 'extern', 'cert', 'personal', 'school', 'club', 'daily'];
    }
    if (status === 'fresh_done') {
      // 졸업 후: 자격증·개인경험 상위 (공백기 소재화)
      return ['cert', 'personal', 'intern', 'extern', 'school', 'club', 'daily'];
    }
    // 재학생/졸업예정(기본): 원래 순서
    return ['school', 'club', 'intern', 'extern', 'cert', 'personal', 'daily'];
  })();
  return order.map(id => EXPERIENCE_CATEGORIES.find(c => c.id === id)).filter(Boolean);
};
// ────────────────────────────────────────────────────────────
//  페르소나 진단 (2문항)

// 페르소나별 intro/list hint 메시지
const getPersonaHints = (persona) => {
  const hints = [];
  if (persona.experience_count === 'few') {
    hints.push({
      type: 'tip',
      text: '경험이 없다고 느끼셨군요. 아래 <strong>"경험 발굴 체크리스트"</strong>를 먼저 확인하세요 — 사소해 보이는 경험도 자소서 소재가 됩니다.'
    });
  }
  if (persona.status === 'career' || persona.status === 'transfer') {
    hints.push({
      type: 'info',
      text: '경력직/전환자는 <strong>인턴·아르바이트, 대외활동</strong>이 핵심 소재입니다. 직무 경험을 STAR로 풀면 이력서의 경력기술서와도 연동됩니다.'
    });
  }
  if (persona.status === 'fresh_done') {
    hints.push({
      type: 'info',
      text: '졸업 후 기간은 공백이 아닙니다. <strong>자격증, 개인 프로젝트, 독학 경험</strong>을 우선 정리하세요.'
    });
  }
  return hints;
};
// ────────────────────────────────────────────────────────────
//  역량 점수 기준표

// 점수 select 옵션 (5구간)
const SCORE_OPTIONS = SCORE_GUIDE.map(s => ({
  value: s.range,
  label: `${s.range} · ${s.level}`,
}));

// ────────────────────────────────────────────────────────────
//  경험 부족 시 대응 체크리스트

// ────────────────────────────────────────────────────────────
//  직무역량 / 소통역량 / 태도역량 사전
// ────────────────────────────────────────────────────────────
const JOB_COMPETENCIES = {
  '마케팅 · 광고': ['디지털 마케팅 전략 수립','소셜 미디어 마케팅','콘텐츠 마케팅','SEO/SEM 최적화','데이터 기반 마케팅','GA 활용','마케팅 자동화','CRM 관리','그래픽 디자인','광고 기획 및 집행','브랜드 전략 수립','A/B 테스트 설계','마케팅 ROI 분석','퍼포먼스 마케팅','경쟁사 분석','영상 콘텐츠 제작','이메일 마케팅','인플루언서 마케팅','커뮤니티 관리','고객 세그먼테이션','마케팅 카피라이팅','트렌드 분석','마케팅 기획서 작성','구글 애즈 운영','네이버 광고 관리','상품 기획','매장 프로모션 기획','온라인 PR','웹사이트 분석','마케팅 리서치'],
  '개발 · IT': ['프로그래밍 언어 활용','웹 개발','모바일 앱 개발','데이터베이스 설계/관리','클라우드 서비스 활용','DevOps','시스템 아키텍처 설계','네트워크 관리','보안 관리','버전 관리 시스템','API 개발','테스트 자동화','애자일/스크럼 방법론','UI/UX 구현','프론트엔드 프레임워크','백엔드 프레임워크','컨테이너화 기술','마이크로서비스 아키텍처','성능 최적화','IT 인프라 관리','기술 문서 작성','코드 리뷰','문제 디버깅','오픈소스 기여','기술 트렌드 분석','소프트웨어 배포','요구사항 분석','프로젝트 관리','빅데이터 처리','머신러닝/AI 활용'],
  '데이터 분석 · 과학': ['통계 분석','데이터 시각화','머신러닝/딥러닝','데이터 전처리','SQL 활용','Python/R 활용','빅데이터 처리','A/B 테스트 설계','예측 모델링','자연어 처리','컴퓨터 비전','데이터 마이닝','데이터 스토리텔링','비즈니스 인텔리전스','ETL 프로세스','Tableau/PowerBI 활용','Hadoop/Spark 활용','시계열 분석','이상치 탐지','데이터 거버넌스','데이터 품질 관리','실험 설계','가설 검증','데이터 기반 의사결정','클러스터링 기법','추천 시스템 설계','딥러닝 프레임워크','데이터 파이프라인 구축','KPI 설정 및 측정','데이터 정책 수립'],
  '재무 · 회계': ['재무제표 분석','회계 원칙 적용','예산 수립 및 관리','재무 모델링','원가 분석','세무 관리','내부 통제 시스템','재무 감사','투자 분석','자금 관리','위험 관리','ERP 시스템 활용','회계 소프트웨어 활용','M&A 분석','주식/채권 평가','현금 흐름 관리','국제 회계 기준','기업 가치 평가','재무 보고','부동산 금융 분석','보험 분석','재무 예측','세금 최적화','재무 컨설팅','자산 관리','자본 구조 분석','재무 비율 분석','회계 규정 준수','금융 상품 분석','환율 리스크 관리'],
  '인사 · HR': ['채용 프로세스 관리','성과 평가 시스템','보상 체계 설계','인력 계획 수립','교육 훈련 프로그램','노사 관계 관리','조직 문화 개발','리더십 개발','인재 유지 전략','HR 분석','직무 분석','승계 계획','복리후생 관리','인사 정보 시스템','조직 설계','다양성 관리','갈등 관리','인사 정책 수립','코칭 및 멘토링','HR 프로세스 자동화','평가 도구 개발','인재 브랜딩','퇴직 관리','인력 개발 전략','HR 법규 준수','인터뷰 기법','직원 참여 프로그램','글로벌 HR','조직 진단','HR 기술 활용'],
  '영업 · 세일즈': ['영업 전략 수립','고객 니즈 분석','제안서 작성','계약 협상','세일즈 퍼널 관리','고객 관계 관리','영업 예측','파트너십 개발','B2B 영업','B2C 영업','국제 영업','세일즈 프레젠테이션','가격 전략','영업 팀 관리','계정 관리','신규 고객 개발','크로스셀링','업셀링','경쟁사 분석','판매 성과 분석','지역 관리','채널 관리','영업 자동화','고객 세분화','세일즈 프로세스 최적화','영업 교육','딜 클로징','영업 KPI 관리','영업 인센티브 설계','소매 영업'],
  '기획 · 전략': ['시장 분석','경영 전략 수립','비즈니스 모델 개발','전략적 기획','산업 트렌드 분석','경쟁사 분석','SWOT 분석','전략 실행 관리','비즈니스 인텔리전스','포트폴리오 관리','조직 전략 수립','디지털 전환 전략','해외 진출 전략','M&A 전략','장기 전략 계획','리스크 관리','경영 컨설팅','프로세스 혁신','사업 개발','벤치마킹 분석','시나리오 플래닝','비즈니스 케이스 작성','변화 관리','기업 가치 창출','경영 성과 관리','사업 타당성 분석','비즈니스 로드맵 설계','전략적 파트너십','KPI 설정','혁신 관리'],
  '생산 · 물류 · SCM': ['생산 계획 수립','재고 관리','품질 관리','공급망 최적화','원가 절감','린 생산 시스템','Six Sigma 적용','공정 관리','물류 네트워크 설계','창고 관리','구매 관리','ERP 시스템 활용','수요 예측','조달 전략','국제 물류','운송 관리','물류 비용 분석','SCM 리스크 관리','공급업체 관리','생산성 향상','작업 안전 관리','프로세스 개선','품질 시스템 인증','생산 설비 관리','자동화 시스템 구축','포장 및 배송 관리','글로벌 소싱','지속가능 공급망','공급망 디지털화','재고 최적화'],
};

// ════════════════════════════════════════════════════════════
//  공용 컴포넌트
// ════════════════════════════════════════════════════════════
const Hint = ({ type = 'info', children, icon: Icon }) => (
  <div style={{ ...BOX[type], padding: SPACING.base, borderRadius: RADIUS.base, fontSize: FONT.size.sm, lineHeight: FONT.lineHeight.relaxed, display: 'flex', gap: SPACING.sm, alignItems: 'flex-start' }}>
    {Icon && <Icon size={16} style={{ marginTop: 2, flexShrink: 0 }} />}
    <div style={{ flex: 1 }}>{children}</div>
  </div>
);
const ConfirmModal = ({ open, title, message, confirmLabel = '확인', cancelLabel = '취소', onConfirm, onCancel, variant = 'warning' }) => {
  if (!open) return null;
  const boxStyle = variant === 'warning' ? BOX.warning : BOX.info;
  const btnColor = variant === 'warning' ? COLORS.red : COLORS.accent;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(14, 39, 80,0.35)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: SPACING.md }} onClick={onCancel}>
      <div onClick={e => e.stopPropagation()}
        style={{ background: COLORS.white, borderRadius: RADIUS.md, padding: SPACING.lg, maxWidth: 420, width: '100%', boxShadow: '0 16px 48px rgba(14, 39, 80,0.25)' }}>
        <div style={{ ...boxStyle, padding: SPACING.base, borderRadius: RADIUS.base, marginBottom: SPACING.md, display: 'flex', gap: SPACING.sm, alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: FONT.size.md, fontWeight: FONT.weight.semibold, color: COLORS.accent, margin: 0, marginBottom: 4 }}>{title}</p>
            <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0, lineHeight: FONT.lineHeight.relaxed }}>{message}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: SPACING.sm, justifyContent: 'flex-end' }}>
          <button className="ce-btn" onClick={onCancel}
            style={{ background: COLORS.white, color: COLORS.accent, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.base, padding: `${SPACING.sm}px ${SPACING.md}px`, fontSize: FONT.size.sm, fontWeight: FONT.weight.medium, cursor: 'pointer' }}>
            {cancelLabel}
          </button>
          <button className="ce-btn" onClick={onConfirm}
            style={{ background: btnColor, color: COLORS.white, border: 'none', borderRadius: RADIUS.base, padding: `${SPACING.sm}px ${SPACING.md}px`, fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, cursor: 'pointer' }}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
// ════════════════════════════════════════════════════════════
//  사이드 패널
// ════════════════════════════════════════════════════════════
const ScorePanel = () => (
  <div>
    <h3 style={{ fontSize: FONT.size.lg, fontWeight: FONT.weight.semibold, color: COLORS.accent, margin: 0, marginBottom: SPACING.sm }}>역량 점수 기준표 (0-10)</h3>
    <p style={{ fontSize: FONT.size.sm, color: COLORS.sub, lineHeight: FONT.lineHeight.relaxed, margin: 0, marginBottom: SPACING.md }}>정확한 자기 평가가 자소서와 면접의 설득력을 높입니다.</p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.sm }}>
      {SCORE_GUIDE.map((s, i) => (
        <div key={i} style={{ border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.base, padding: SPACING.base }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.sm, marginBottom: 6 }}>
            <span style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color: COLORS.accent2, background: COLORS.blueBg, padding: `2px 8px`, borderRadius: RADIUS.sm }}>{s.range}점</span>
            <span style={{ fontSize: FONT.size.md, fontWeight: FONT.weight.semibold, color: COLORS.accent }}>{s.level}</span>
          </div>
          <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, lineHeight: FONT.lineHeight.relaxed, margin: 0, marginBottom: 6 }}>{s.desc}</p>
          <p style={{ fontSize: FONT.size.xs, color: COLORS.sub, margin: 0, fontStyle: 'italic' }}>자가 검증: {s.check}</p>
        </div>
      ))}
    </div>
    <div style={{ ...BOX.tip, padding: SPACING.base, borderRadius: RADIUS.base, marginTop: SPACING.md }}>
      <p style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color: COLORS.accent, margin: 0, marginBottom: SPACING.sm }}>점수 매기기 전 확인 사항</p>
      <ul style={{ margin: 0, paddingLeft: 18, fontSize: FONT.size.sm, color: COLORS.accent, lineHeight: FONT.lineHeight.relaxed }}>
        {SCORE_NOTES.map((n, i) => <li key={i} style={{ marginBottom: 4 }}>{n}</li>)}
      </ul>
    </div>
  </div>
);
// ── 가이드 토글 박스 (워크북 표준: GUIDE · 좌측 골드 보더) ──
const GuideToggle = ({ open, onToggle, label, children }) => (
  <div style={{ marginBottom: 16 }}>
    <button
      onClick={onToggle}
      style={{
        background: open ? 'COLORS.bg' : 'COLORS.bg',
        border: `1px solid ${COLORS.accent2}66`,
        borderLeft: `3px solid ${COLORS.accent2}`,
        cursor: 'pointer',
        color: COLORS.accent, fontWeight: 700, fontSize: 16,
        padding: '12px 16px',
        borderRadius: RADIUS.sm,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
        lineHeight: 1.5, width: '100%', textAlign: 'left',
      }}
    >
      <span>{label}</span>
      <span style={{ fontSize: 16, color: COLORS.accent2, flexShrink: 0 }}>{open ? '숨기기 ▲' : '보기 ▼'}</span>
    </button>
    {open && (
      <div style={{
        marginTop: 8,
        background: COLORS.cream,
        border: `1px solid ${COLORS.border}`,
        borderLeft: `3px solid ${COLORS.accent2}`,
        borderRadius: RADIUS.md, padding: 16,
      }}>
        <p style={{ fontSize: 16, fontWeight: 700, letterSpacing: 1, color: COLORS.accent2, margin: 0, marginBottom: 12 }}>
          GUIDE · 작성 가이드
        </p>
        {children}
      </div>
    )}
  </div>
);
const DiscoveryPanel = () => {
  const [checked, setChecked] = useState(new Set());
  const toggle = (i) => setChecked(prev => {
    const next = new Set(prev);
    if (next.has(i)) next.delete(i); else next.add(i);
    return next;
  });
  return (
    <div>
      <h3 style={{ fontSize: FONT.size.lg, fontWeight: FONT.weight.semibold, color: COLORS.accent, margin: 0, marginBottom: SPACING.sm }}>경험 발굴 체크리스트</h3>
      <p style={{ fontSize: FONT.size.sm, color: COLORS.sub, lineHeight: FONT.lineHeight.relaxed, margin: 0, marginBottom: SPACING.md }}>
        "경험이 없다"고 느낄 때, 자소서에 쓸 만한 경험으로 인식하지 못했을 뿐입니다. 해당되는 항목에 체크하면 <strong style={{ color: COLORS.accent2 }}>어떤 카테고리·역량으로 정리할지 솔루션</strong>이 나타납니다.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.sm }}>
        {DISCOVERY_CHECKLIST.map((c, i) => {
          const isChecked = checked.has(i);
          return (
            <div key={i}
              onClick={() => toggle(i)}
              style={{
                border: `1px solid ${isChecked ? COLORS.green : COLORS.border}`,
                background: isChecked ? COLORS.greenBg : COLORS.white,
                borderRadius: RADIUS.base,
                padding: SPACING.base,
                cursor: 'pointer',
                transition: 'background 0.15s, border-color 0.15s',
              }}>
              <div style={{ display: 'flex', gap: SPACING.sm, alignItems: 'flex-start' }}>
                <div style={{
                  width: 20, height: 20, borderRadius: RADIUS.sm,
                  border: `2px solid ${isChecked ? COLORS.green : COLORS.border}`,
                  background: isChecked ? COLORS.green : COLORS.white,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, marginTop: 1,
                }}>
                  {/* 체크 표시는 배경색으로 표현 */}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, lineHeight: FONT.lineHeight.relaxed, margin: 0, fontWeight: FONT.weight.medium }}>{c.q}</p>
                  {isChecked && (
                    <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px dashed ${COLORS.green}66` }}>
                      <p style={{ fontSize: FONT.size.xs, color: COLORS.accent, margin: 0, lineHeight: FONT.lineHeight.relaxed }}>
                        <span style={{ fontWeight: FONT.weight.semibold, color: COLORS.green }}>✓ 솔루션 · </span>{c.hint}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {checked.size > 0 && (
        <div style={{ ...BOX.success, padding: SPACING.base, borderRadius: RADIUS.base, marginTop: SPACING.md }}>
          <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0, lineHeight: FONT.lineHeight.relaxed }}>
            <strong>{checked.size}개 해당</strong> — 최소 {checked.size}개의 자소서 소재가 있습니다. 패널을 닫고 목록 화면에서 해당 카테고리에 경험을 추가하세요.
          </p>
        </div>
      )}
      <div style={{ ...BOX.tip, padding: SPACING.base, borderRadius: RADIUS.base, marginTop: SPACING.md }}>
        <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0, lineHeight: FONT.lineHeight.relaxed }}>
          <strong>기억하세요:</strong> 경험의 양이 아니라 깊이가 중요합니다. 1개 경험이라도 STAR로 구체적으로 풀고 역량을 정확히 연결하면, 경험 10개를 대충 나열한 것보다 훨씬 설득력 있습니다.
        </p>
      </div>
    </div>
  );
};
const DictionaryPanel = ({ onPick }) => {
  const [selected, setSelected] = useState(Object.keys(JOB_COMPETENCIES)[0]);
  const [query, setQuery] = useState('');
  const filterFn = (list) => query ? list.filter(x => x.toLowerCase().includes(query.toLowerCase())) : list;
  return (
    <div>
      <h3 style={{ fontSize: FONT.size.lg, fontWeight: FONT.weight.semibold, color: COLORS.accent, margin: 0, marginBottom: SPACING.sm }}>역량 사전</h3>
      <p style={{ fontSize: FONT.size.sm, color: COLORS.sub, lineHeight: FONT.lineHeight.relaxed, margin: 0, marginBottom: SPACING.md }}>
        직무역량 30개 + 소통역량 50개 + 태도역량 50개.
        {onPick && <span style={{ color: COLORS.accent2, fontWeight: FONT.weight.semibold }}> 역량을 클릭하면 현재 작성 중인 경험에 추가됩니다.</span>}
      </p>
      <input className="ce-input" type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="역량 검색 (예: 커뮤니케이션)"
        style={{ width: '100%', padding: SPACING.sm, borderRadius: RADIUS.base, border: `1px solid ${COLORS.border}`, fontSize: FONT.size.sm, fontFamily: FONT.family, color: COLORS.accent, outline: 'none', marginBottom: SPACING.md, boxSizing: 'border-box' }} />
      <div style={{ marginBottom: SPACING.md }}>
        <p style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color: COLORS.accent, margin: 0, marginBottom: SPACING.sm }}>직무역량 (직무 선택)</p>
        <select className="ce-select" value={selected} onChange={e => setSelected(e.target.value)}
          style={{ width: '100%', padding: SPACING.sm, borderRadius: RADIUS.base, border: `1px solid ${COLORS.border}`, fontSize: FONT.size.sm, fontFamily: FONT.family, color: COLORS.accent, outline: 'none', background: COLORS.white, boxSizing: 'border-box', marginBottom: SPACING.sm }}>
          {Object.keys(JOB_COMPETENCIES).map(k => <option key={k} value={k}>{k}</option>)}
        </select>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {filterFn(JOB_COMPETENCIES[selected]).map(c => (
            <span key={c}
              className={`ce-chip ${onPick ? 'ce-chip-clickable' : ''}`}
              onClick={onPick ? () => onPick('job_comps', c) : undefined}
              style={{ fontSize: FONT.size.xs, color: COLORS.accent, background: COLORS.bgAlt, border: `1px solid ${COLORS.border}`, padding: `4px 8px`, borderRadius: RADIUS.pill }}>{c}</span>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: SPACING.md }}>
        <p style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color: COLORS.accent, margin: 0, marginBottom: SPACING.sm }}>소통역량 (50개)</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {filterFn(COMMUNICATION_COMPETENCIES).map(c => (
            <span key={c}
              className={`ce-chip ${onPick ? 'ce-chip-clickable' : ''}`}
              onClick={onPick ? () => onPick('comm_comps', c) : undefined}
              style={{ fontSize: FONT.size.xs, color: COLORS.accent, background: COLORS.bgAlt, border: `1px solid ${COLORS.border}`, padding: `4px 8px`, borderRadius: RADIUS.pill }}>{c}</span>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: SPACING.md }}>
        <p style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color: COLORS.accent, margin: 0, marginBottom: SPACING.sm }}>태도역량 (50개)</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {filterFn(ATTITUDE_COMPETENCIES).map(c => (
            <span key={c}
              className={`ce-chip ${onPick ? 'ce-chip-clickable' : ''}`}
              onClick={onPick ? () => onPick('att_comps', c) : undefined}
              style={{ fontSize: FONT.size.xs, color: COLORS.accent, background: COLORS.bgAlt, border: `1px solid ${COLORS.border}`, padding: `4px 8px`, borderRadius: RADIUS.pill }}>{c}</span>
          ))}
        </div>
      </div>
    </div>
  );
};
// ════════════════════════════════════════════════════════════
//  메인 컴포넌트
// ════════════════════════════════════════════════════════════
// === 외부 정의 컴포넌트 (input 포커스 손실 방지) ===
const ExpField = ({ label, hint, children }) => (
  <div style={{ marginBottom: SPACING.md }}>
    <label style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color: COLORS.accent, display: 'block', marginBottom: 4 }}>{label}</label>
    {hint && <p style={{ fontSize: FONT.size.xs, color: COLORS.sub, margin: 0, marginBottom: 6, lineHeight: FONT.lineHeight.relaxed }}>{hint}</p>}
    {children}
  </div>
);
const ExpCompSection = ({ type, title, hint, placeholder, expId, list, updateComp, addComp, removeComp, inputStyle }) => {
  return (
    <div style={{ marginBottom: SPACING.md, padding: SPACING.md, background: COLORS.bgAlt, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.base }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4, flexWrap: 'wrap', gap: 6 }}>
        <label style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color: COLORS.accent }}>{title}</label>
        <span style={{ fontSize: FONT.size.xs, color: COLORS.sub }}>최대 4개</span>
      </div>
      <p style={{ fontSize: FONT.size.xs, color: COLORS.sub, margin: 0, marginBottom: SPACING.sm, lineHeight: FONT.lineHeight.relaxed }}>{hint}</p>
      {list.map((c, idx) => (
        <div key={idx} style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6 }}>
          <input className="ce-input" type="text" value={c.name}
            onChange={ev => updateComp(expId, type, idx, 'name', ev.target.value)}
            placeholder={placeholder}
            style={{ ...inputStyle, flex: 1, background: COLORS.white, padding: `6px ${SPACING.sm}px`, fontSize: FONT.size.sm }} />
          <select className="ce-select" value={c.score}
            onChange={ev => updateComp(expId, type, idx, 'score', ev.target.value)}
            style={{ ...inputStyle, width: 140, background: COLORS.white, padding: `6px ${SPACING.sm}px`, fontSize: FONT.size.sm }}>
            <option value="">점수 선택</option>
            {SCORE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <button onClick={() => removeComp(expId, type, idx)}
            style={{ background: 'transparent', border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.sm, padding: 6, cursor: 'pointer', color: COLORS.red, display: 'inline-flex' }}
            disabled={list.length <= 1}
            title="삭제">
            </button>
        </div>
      ))}
      {list.length < 4 && (
        <button className="ce-btn" onClick={() => addComp(expId, type)}
          style={{ background: COLORS.white, color: COLORS.accent, border: `1px dashed ${COLORS.border}`, borderRadius: RADIUS.base, padding: `6px ${SPACING.sm}px`, fontSize: FONT.size.sm, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
          역량 추가
        </button>
      )}
    </div>
  );
};
const ExperienceWorkbook = () => {
  const [phase, setPhase] = useState('intro');
  // 다운로드 로딩 state
  const [isSavingXlsx, setIsSavingXlsx] = useState(false);
  const [savedXlsx, setSavedXlsx] = useState(false);
  // 가이드 박스 펼침 state (사이드 패널 대체)
  const [showDiscovery, setShowDiscovery] = useState(false);
  const [showScore, setShowScore] = useState(false);
  const [showDictionary, setShowDictionary] = useState(false);
  const [showHelp, setShowHelp] = useState(true);
  const [basicInfo, setBasicInfo] = useState({ industry: '', position: '', target: '' });
  const [personaAnswers, setPersonaAnswers] = useState({});
  // 페르소나에서 경험이 적다고 답하면 발굴 체크리스트 자동 펼침
  React.useEffect(() => {
    if (personaAnswers && personaAnswers.experience_count === 'few') {
      setShowDiscovery(true);
    }
  }, [personaAnswers]);
  const [jdKeywords, setJdKeywords] = useState({ core: '', tools: '', soft: '', memo: '' });
  // 경험 카드: job_comps/comm_comps/att_comps는 배열 [{name, score}]
  // [CE-HOME] WorkbookShell '처음으로' 버튼에서 호출
  const __ceHomeRef = useRef(null);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.__CE_HOME = { fn: () => __ceHomeRef.current?.(), key: 'experience' };
    return () => { if (window.__CE_HOME?.key === 'experience') window.__CE_HOME = null; };
  }, []);
  const goHome = () => {
    setPhase('intro');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  __ceHomeRef.current = goHome; // [CE-HOME] ref 갱신
  const [experiences, setExperiences] = useState([]);
  // 회사별 직무 연결: { [회사명]: { keywords: '...', links: { [expId]: '연결 메모' } } }
  const [companyLinks, setCompanyLinks] = useState({});
  const [activeCompany, setActiveCompany] = useState('');
  const [newCompanyName, setNewCompanyName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [detailStep, setDetailStep] = useState(1); // 1~4
  // 사이드 패널
  // 모달
  const [modal, setModal] = useState({ open: false, title: '', message: '', onConfirm: null, variant: 'warning', confirmLabel: '확인' });
  const [showRaw, setShowRaw] = useState({});
  const [confirmingClear, setConfirmingClear] = useState(false);
  const STORAGE_KEY = 'careerengineer_experience_v1';
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if ((data.experiences && data.experiences.length > 0) || 
            (data.jdKeywords && Object.values(data.jdKeywords).some(v => v))) {
          const savedDate = data.savedAt ? new Date(data.savedAt).toLocaleString('ko-KR') : '이전';
          if (true /* auto-restore */) {
            if (data.basicInfo) setBasicInfo(data.basicInfo);
            if (data.personaAnswers) setPersonaAnswers(data.personaAnswers);
            if (data.jdKeywords) setJdKeywords(data.jdKeywords);
            if (data.experiences) setExperiences(data.experiences);
            if (data.companyLinks) setCompanyLinks(data.companyLinks);
            // editingId 복원 + 유효성 검증 (저장 시점 경험 카드가 삭제됐을 수 있음)
            if (data.editingId && Array.isArray(data.experiences) && data.experiences.some(e => e.id === data.editingId)) {
              setEditingId(data.editingId);
            }
            // phase가 'detail'인데 편집할 경험 없으면 'list'로 폴백 (이미 renderDetail에 안전망 있지만 사전 정합)
            if (data.phase) {
              let nextPhase = data.phase;
              if (nextPhase === 'detail' && !(data.editingId && Array.isArray(data.experiences) && data.experiences.some(e => e.id === data.editingId))) {
                nextPhase = 'list';
              }
              setPhase(nextPhase);
            }
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      }
    } catch (e) { console.warn(e); }
  }, []);
  useEffect(() => {
    if (experiences.length === 0 && Object.values(jdKeywords).every(v => !v) && !(basicInfo?.industry || basicInfo?.position || basicInfo?.target)) return;
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          basicInfo, personaAnswers, jdKeywords, experiences, companyLinks, phase, editingId,
          savedAt: new Date().toISOString()
        }));
      } catch { /* ignore */ }
    }, 1000);
    return () => clearTimeout(timer);
  }, [basicInfo, personaAnswers, jdKeywords, experiences, companyLinks, phase, editingId]);
  // 페르소나에 따라 정렬된 카테고리
  const orderedCategories = useMemo(
    () => orderCategoriesByPersona(personaAnswers.status),
    [personaAnswers.status]
  );
  // ── 경험 CRUD ──────────────────────────────────────────
  const emptyExperience = (category) => ({
    id: `exp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    category: category || '', period: '', org: '', role: '', summary: '', motivation: '',
    star_s: '', star_t: '', star_a: '', star_r: '', difficulty: '', learning: '',
    job_comps: [{ name: '', score: '' }],
    comm_comps: [{ name: '', score: '' }],
    att_comps: [{ name: '', score: '' }],
    jd_match: '',
  });
  const addExperience = (category) => {
    const newExp = emptyExperience(category);
    setExperiences(prev => [...prev, newExp]);
    setEditingId(newExp.id);
    setDetailStep(1);
    setPhase('detail');
  };
  const updateExperience = (id, field, value) => {
    setExperiences(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e));
  };
  const deleteExperience = (id) => {
    setModal({
      open: true,
      title: '경험 카드 삭제',
      message: '이 경험 카드를 삭제하시겠습니까? 되돌릴 수 없습니다.',
      variant: 'warning',
      confirmLabel: '삭제',
      onConfirm: () => {
        setExperiences(prev => prev.filter(e => e.id !== id));
        setModal(m => ({ ...m, open: false }));
      }
    });
  };
  const editExperience = (id) => {
    setEditingId(id);
    setDetailStep(1);
    setPhase('detail');
  };
  // 역량-점수 페어 CRUD
  const addComp = (expId, type, name = '') => {
    setExperiences(prev => prev.map(e =>
      e.id === expId
        ? { ...e, [type]: [...(e[type] || []), { name, score: '' }] }
        : e
    ));
  };
  const removeComp = (expId, type, idx) => {
    setExperiences(prev => prev.map(e =>
      e.id === expId
        ? { ...e, [type]: e[type].filter((_, i) => i !== idx) }
        : e
    ));
  };
  const updateComp = (expId, type, idx, field, value) => {
    setExperiences(prev => prev.map(e =>
      e.id === expId
        ? { ...e, [type]: e[type].map((c, i) => i === idx ? { ...c, [field]: value } : c) }
        : e
    ));
  };
  // ── 회사별 직무 연결 핸들러 ──
  const addCompanyLink = () => {
    const name = (newCompanyName || '').trim();
    if (!name) return;
    setCompanyLinks(prev => (prev[name] ? prev : { ...prev, [name]: { keywords: '', links: {} } }));
    setActiveCompany(name);
    setNewCompanyName('');
  };
  const setCompanyKeywords = (company, val) => {
    setCompanyLinks(prev => ({ ...prev, [company]: { ...(prev[company] || { links: {} }), keywords: val } }));
  };
  const setExpLink = (company, expId, val) => {
    setCompanyLinks(prev => ({ ...prev, [company]: { ...(prev[company] || { keywords: '' }), links: { ...((prev[company] || {}).links || {}), [expId]: val } } }));
  };
  const removeCompanyLink = (company) => {
    setCompanyLinks(prev => { const n = { ...prev }; delete n[company]; return n; });
    setActiveCompany('');
  };

  // STEP 1 채용공고 및 직무분석에서 분석한 내용을 가져온다 (경험과 연결할 키워드 자동 확보)
  const getJdFromAnalysis = () => {
    try {
      const d = JSON.parse(localStorage.getItem('careerengineer_job_analysis_v1') || '{}');
      const fa = d.formAnswers || {};
      const duties = (fa.form_02 && fa.form_02.jd_duties) || '';
      const keywords = (fa.form_02 && fa.form_02.keywords) || '';
      const must = (fa.form_03 && fa.form_03.required_must) || '';
      const plus = (fa.form_03 && fa.form_03.required_plus) || '';
      const postings = (d.jobPostings || []).filter(j => j && (j.company || j.job_title));
      return { duties, keywords, must, plus, postings, has: !!(duties || keywords || must || plus || postings.length) };
    } catch { return { has: false, duties: '', keywords: '', must: '', plus: '', postings: [] }; }
  };
  // 직무상세내용 항목을 한 줄에 하나씩(쉼표 구분도 허용) 정규화 → 경험과 1:1 매핑 가능한 목록
  const normalizeDuties = (text) => (text || '')
    .split(/\r?\n|·|•|^\s*[-*]\s*/gm)
    .flatMap(s => s.split(','))
    .map(s => s.replace(/^[-*\s]+/, '').trim())
    .filter(Boolean);
  const importJdFromAnalysis = () => {
    const j = getJdFromAnalysis();
    if (!j.has) return;
    // 직무상세내용(주요 업무) 항목이 있으면 그것을 핵심 매핑 대상으로, 없으면 키워드/필수요건 사용
    const dutyList = normalizeDuties(j.duties);
    const core = dutyList.length ? dutyList.join(', ') : (j.keywords || j.must || '');
    setJdKeywords(prev => ({
      ...prev,
      core: prev.core || core,
      memo: prev.memo || [j.must && ('필수: ' + j.must), j.plus && ('우대: ' + j.plus)].filter(Boolean).join('\n'),
    }));
  };

  // 역량 사전에서 클릭 시: 현재 편집 중인 경험의 해당 타입에 빈 슬롯 채우기(또는 추가)
  const currentExp = experiences.find(e => e.id === editingId);
  // ── 완성도 계산 ──────────────────────────────────────
  const getExpStatus = (exp) => {
    const reqFields = ['category', 'period', 'org', 'role', 'summary', 'star_s', 'star_t', 'star_a', 'star_r', 'learning'];
    const filled = reqFields.filter(k => (exp[k] || '').trim()).length;
    if (filled === 0) return { level: 0, label: '미작성', color: COLORS.sub, bg: COLORS.bgAlt };
    if (filled < 4) return { level: 1, label: '시작', color: COLORS.blue, bg: COLORS.blueBg };
    if (filled < reqFields.length) return { level: 2, label: '작성 중', color: COLORS.yellow, bg: COLORS.yellowBg };
    return { level: 3, label: '완료', color: COLORS.green, bg: COLORS.greenBg };
  };
  // ── 유틸: 역량 배열 요약 ──────────────────────────────
  const compSummary = (arr) => {
    if (!arr || arr.length === 0) return '';
    return arr.filter(c => c.name).map(c => c.score ? `${c.name} (${c.score})` : c.name).join(', ');
  };
  // ── 저장 (DOCX) ────────────────────────────────────
  // docx-js 동적 로드
  const loadDocxLib = () => Promise.resolve(DOCX);
  // ── 저장 (XLSX) ────────────────────────────────────
  // [CE-DL] 외부 WorkbookShell 버튼에서 호출 위한 등록
  const __ceDlRef = useRef(null);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.__CE_DOWNLOAD = { fn: () => __ceDlRef.current?.(), key: 'experience' };
    return () => { if (window.__CE_DOWNLOAD?.key === 'experience') window.__CE_DOWNLOAD = null; };
  }, []);
  const handleSaveXlsx = async () => {
    if (isSavingXlsx) return;
    setIsSavingXlsx(true);
    try {
      await saveExperienceXlsx({
        experiences,
        companyLinks,
        jdKeywords,
        basicInfo: { industry: basicInfo.industry, position: basicInfo.position, target: basicInfo.target || basicInfo.company },
        personaAnswers,
      });
    } catch (err) {
      console.error('xlsx 생성 실패:', err);
      alert('.xlsx 파일 생성에 실패했습니다.\n' + (err.message || err));
    } finally {
      setIsSavingXlsx(false);
      setSavedXlsx(true);
      setTimeout(() => setSavedXlsx(false), 3000);
    }
  };
  __ceDlRef.current = handleSaveXlsx; // [CE-DL] ref 갱신
  // ════════════════════════════════════════════════════════
  //  Phase 렌더러
  // ════════════════════════════════════════════════════════
  // ── Intro ─────────────────────────────────────────────
      const renderIntro = () => (
    <IntroPage
      workbookKey='experience'
      stepLabel='STEP 2 · 경험 정리'
      title='경험 정리'
      subtitle='STAR 프레임으로 자소서·면접에 쓸 경험 인벤토리를 만듭니다'
      flow={[
          { label: 'PART 1', desc: '기본 정보 + 페르소나 진단 (산업·직무·경험량)' },
          { label: 'PART 2', desc: '채용공고 키워드 입력 (선택) — 역량 매칭의 출발점' },
          { label: 'PART 3', desc: '경험 인벤토리 — 보유 경험 목록 만들기' },
          { label: 'PART 4', desc: 'STAR 상세 작성 — 상황·과제·행동·결과로 경험 정리' },
          { label: 'PART 5', desc: '최종 검토 및 역량 태깅' },
        ]}
      flowTitle={'이 워크북의 진행 순서'}
      prerequisites={[
          {
            text: '지원 산업·직무 (선택, 입력하면 역량 자동 매칭)',
            recommend: {
              workbookId: 'job_analysis',
              condition: '직무 분석이 필요하다면',
              linkLabel: '채용공고 및 직무분석 가이드',
            },
          },
          { text: '지난 5년 이내의 경험 (학교·회사·동아리·아르바이트·프로젝트 등)' },
        ]}
      helpModal={<FirstVisitModal open={showHelp} onClose={() => setShowHelp(false)} title='경험 정리 사용 안내' steps={[
          '경험이 부족하다고 느낀다면 채용공고 입력 화면의 <strong>경험 발굴 체크리스트</strong>를 펼쳐보세요.',
          '각 경험은 <strong>STAR 프레임</strong>(상황·과제·행동·결과)으로 작성합니다.',
          '역량 도출 단계에서 <strong>점수 기준</strong>·<strong>역량 사전</strong> 가이드를 펼쳐 참고할 수 있습니다.',
          '최종 검토 후 다운로드하여 <strong>자소서·면접 답변의 재료</strong>로 활용하세요.',
        ]} />}
      onStart={() => { setPhase('info'); }}
    />
  );
  // ── Info (기본 정보 + 페르소나 진단) ──────────────────
  const renderInfo = () => {
    const canProceed = Object.keys(personaAnswers).length === PERSONA_QUESTIONS.length;
    return (
      <div style={{ maxWidth: 1350, margin: '0 auto', padding: `${SPACING.xl}px ${SPACING.md}px` }}>
        <h2 style={{ fontSize: FONT.size.h2, fontWeight: FONT.weight.semibold, color: COLORS.accent, margin: 0, marginBottom: SPACING.sm }}>기본 정보</h2>
        <p style={{ fontSize: FONT.size.sm, color: COLORS.sub, margin: 0, marginBottom: SPACING.lg, lineHeight: FONT.lineHeight.relaxed }}>지원하려는 산업과 직무를 입력하면, 경험 정리 과정에서 관련 역량을 연결하는 데 도움이 됩니다.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md, marginBottom: SPACING.xl }}>
          {[
            { key: 'industry', label: '지원 산업', placeholder: '예: IT · 커머스 · 금융' },
            { key: 'position', label: '지원 직무', placeholder: '예: 공정엔지니어 · 기구설계 엔지니어' },
            { key: 'target', label: '대상 기업 (선택)', placeholder: '예: 네이버 · 카카오 · 배민' },
          ].map(f => (
            <div key={f.key}>
              <label style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color: COLORS.accent, display: 'block', marginBottom: 4 }}>{f.label}</label>
              <input className="ce-input" type="text" value={basicInfo[f.key]} onChange={e => setBasicInfo({ ...basicInfo, [f.key]: e.target.value })} placeholder={f.placeholder}
                style={{ width: '100%', padding: SPACING.sm, borderRadius: RADIUS.base, border: `1px solid ${COLORS.border}`, fontSize: FONT.size.base, fontFamily: FONT.family, color: COLORS.accent, outline: 'none', boxSizing: 'border-box' }} />
            </div>
          ))}
        </div>
        <h2 style={{ fontSize: FONT.size.h2, fontWeight: FONT.weight.semibold, color: COLORS.accent, margin: 0, marginBottom: SPACING.sm }}>페르소나 진단</h2>
        <p style={{ fontSize: FONT.size.sm, color: COLORS.sub, margin: 0, marginBottom: SPACING.lg, lineHeight: FONT.lineHeight.relaxed }}>두 문항에 답하시면 경험 발굴·카테고리 순서·가이드가 상황에 맞게 조정됩니다.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.lg, marginBottom: SPACING.xl }}>
          {PERSONA_QUESTIONS.map(q => (
            <div key={q.id}>
              <p style={{ fontSize: FONT.size.md, fontWeight: FONT.weight.semibold, color: COLORS.accent, margin: 0, marginBottom: SPACING.sm }}>{q.label}</p>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {q.options.map(o => {
                  const active = personaAnswers[q.id] === o.value;
                  // "—" 또는 " - "로 라벨/설명 분리
                  const sepMatch = o.label.match(/^(.+?)\s*[—–-]\s*(.+)$/);
                  const labelText = sepMatch ? sepMatch[1].trim() : o.label;
                  const descText = sepMatch ? sepMatch[2].trim() : null;
                  return (
                    <div key={o.value} {...clickable(() => setPersonaAnswers(prev => ({ ...prev, [q.id]: o.value })))}
                      style={{ padding: '16px 18px', borderRadius: RADIUS.lg, marginBottom: 8, border: `1.5px solid ${active ? COLORS.accent2 : COLORS.border}`, background: active ? COLORS.blueBg : COLORS.white, cursor: 'pointer', transition: 'all 150ms' }}
                      onMouseEnter={e => { if (!active) e.currentTarget.style.borderColor = COLORS.accent2 + '60'; }}
                      onMouseLeave={e => { if (!active) e.currentTarget.style.borderColor = COLORS.border; }}>
                      <div style={{ fontSize: 16, fontWeight: 600, color: active ? COLORS.accent2 : COLORS.accent, marginBottom: descText ? 2 : 0 }}>{labelText}</div>
                      {descText && <div style={{ fontSize: 16, color: COLORS.sub }}>{descText}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        {canProceed && getPersonaHints(personaAnswers).length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.sm, marginBottom: SPACING.xl }}>
            {getPersonaHints(personaAnswers).map((h, i) => (
              <Hint key={i} type={h.type} icon={h.icon}>
                <span dangerouslySetInnerHTML={{ __html: h.text }} />
              </Hint>
            ))}
            {/* 경험 적은 사용자에게 인라인 가이드 토글 노출 */}
            {personaAnswers.experience_count === 'few' && (
              <GuideToggle
                open={showDiscovery}
                onToggle={() => setShowDiscovery(v => !v)}
                label="경험 발굴 체크리스트 펼쳐보기"
              >
                <DiscoveryPanel />
              </GuideToggle>
            )}
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: SPACING.xl, gap: SPACING.sm, flexWrap: 'wrap' }}>
          <button className="ce-btn" onClick={() => setPhase('intro')}
            style={{ background: COLORS.white, color: COLORS.accent, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.md, padding: `${SPACING.base}px ${SPACING.lg}px`, fontSize: FONT.size.base, fontWeight: FONT.weight.medium, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            이전
          </button>
          <button className="ce-btn" onClick={() => {
            setPhase('jd');
            // 페르소나 기반 자동 도움: 경험 few면 발굴 체크리스트 자동 펼침
            if (personaAnswers.experience_count === 'few') {
              setShowDiscovery(true);
            }
          }}
            disabled={!canProceed}
            style={{ background: canProceed ? COLORS.accent : COLORS.sub, color: COLORS.white, border: 'none', borderRadius: RADIUS.md, padding: `${SPACING.base}px ${SPACING.lg}px`, fontSize: FONT.size.base, fontWeight: FONT.weight.semibold, cursor: canProceed ? 'pointer' : 'not-allowed', display: 'inline-flex', alignItems: 'center', gap: 6, opacity: canProceed ? 1 : 0.6 }}>
            다음 </button>
        </div>
      </div>
    );
  };
  // ── 직무상세내용 키워드 입력 ───────────────────────────────────
  const renderJd = () => (
    <div style={{ maxWidth: 1350, margin: '0 auto', padding: `${SPACING.xl}px ${SPACING.md}px` }}>
      <h2 style={{ fontSize: FONT.size.h2, fontWeight: FONT.weight.semibold, color: COLORS.accent, margin: 0, marginBottom: SPACING.sm }}>채용공고 키워드 (선택)</h2>
      <p style={{ fontSize: FONT.size.sm, color: COLORS.sub, margin: 0, marginBottom: SPACING.lg, lineHeight: FONT.lineHeight.relaxed }}>
        지원하려는 채용공고의 "주요업무·자격요건"에서 반복·강조되는 키워드를 뽑아 입력해두면, 경험 카드 작성 시 <strong>어떤 경험이 어떤 직무상세내용 키워드를 커버하는지</strong> 자동으로 연결하기 쉬워집니다.
      </p>
      <Hint type="info">
        아직 채용공고가 없어도 괜찮습니다. 이 단계는 건너뛰고 나중에 돌아와도 됩니다.
      </Hint>
      <div style={{ marginTop: SPACING.sm }}>
        {(() => {
          const jd = getJdFromAnalysis();
          if (jd.has) {
            return (
              <div style={{ background: COLORS.blueBg || COLORS.bgAlt, border: `1px solid ${COLORS.accent2}`, borderRadius: RADIUS.base, padding: SPACING.md }}>
                <p style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.bold, color: COLORS.accent, margin: 0, marginBottom: 6 }}>STEP 1 채용공고 및 직무분석에서 가져온 직무상세내용</p>
                {jd.duties && <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: '0 0 4px', whiteSpace: 'pre-wrap' }}><strong>주요 업무(직무상세내용):</strong>{'\n'}{jd.duties}</p>}
                {jd.keywords && <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: '0 0 4px' }}><strong>핵심 키워드:</strong> {jd.keywords}</p>}
                {jd.must && <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: '0 0 4px' }}><strong>필수 요건:</strong> {jd.must}</p>}
                {jd.plus && <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: '0 0 4px' }}><strong>우대 사항:</strong> {jd.plus}</p>}
                {jd.postings.length > 0 && <p style={{ fontSize: FONT.size.xs, color: COLORS.sub, margin: '0 0 8px' }}>분석한 공고: {jd.postings.map(p => `${p.company || ''} ${p.job_title || ''}`.trim()).filter(Boolean).join(' · ')}</p>}
                <button onClick={importJdFromAnalysis} style={{ background: COLORS.accent2, color: COLORS.white, border: 'none', borderRadius: RADIUS.sm, padding: '6px 12px', fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, cursor: 'pointer', fontFamily: FONT.family }}>직무상세내용을 매핑 대상으로 불러오기</button>
              </div>
            );
          }
          return (
            <Hint type="tip">
              <strong>STEP 1 채용공고 및 직무분석을 먼저 진행하면</strong> 여기에서 해당 직무와 자신의 경험을 바로 연결할 수 있습니다.
            </Hint>
          );
        })()}
      </div>
      {/* 경험 발굴 체크리스트 (가이드 박스) */}
      <div style={{ marginTop: SPACING.md }}>
        <GuideToggle
          open={showDiscovery}
          onToggle={() => setShowDiscovery(v => !v)}
          label="경험이 부족하다고 느낀다면 — 경험 발굴 체크리스트"
        >
          <DiscoveryPanel />
        </GuideToggle>
      </div>
      {/* 채용공고 및 직무분석 워크북에서 작성한 내용 참고 */}
      <div style={{ marginTop: SPACING.md }}>
        <ReferenceInline ids={['job_analysis']} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md, marginTop: SPACING.lg, marginBottom: SPACING.xl }}>
        {[
          { key: 'core', label: '핵심 직무 키워드', hint: '채용공고에서 가장 자주 등장하는 직무 관련 단어', placeholder: '예: 기구 설계, 공차 분석, 구조해석(FEA)' },
          { key: 'tools', label: '도구·기술 키워드', hint: '특정 툴, 프로그램, 기술 스택', placeholder: '예: SolidWorks, CATIA, ANSYS, 3D 프린팅' },
          { key: 'soft', label: '소프트스킬 키워드', hint: '협업·커뮤니케이션 관련 요구사항', placeholder: '예: 커뮤니케이션, 주도적 문제해결, 협업 역량' },
          { key: 'memo', label: '기타 메모 (선택)', hint: '자격요건 중 특이사항, 우대사항 등', placeholder: '예: 우대사항 - 사출/금형 경험, 양산 대응 경험' },
        ].map(f => (
          <div key={f.key}>
            <label style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color: COLORS.accent, display: 'block', marginBottom: 4 }}>{f.label}</label>
            <p style={{ fontSize: FONT.size.xs, color: COLORS.sub, margin: 0, marginBottom: 6 }}>{f.hint}</p>
            <input className="ce-input" type="text" value={jdKeywords[f.key]} onChange={e => setJdKeywords({ ...jdKeywords, [f.key]: e.target.value })} placeholder={f.placeholder}
              style={{ width: '100%', padding: SPACING.sm, borderRadius: RADIUS.base, border: `1px solid ${COLORS.border}`, fontSize: FONT.size.base, fontFamily: FONT.family, color: COLORS.accent, outline: 'none', boxSizing: 'border-box' }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: SPACING.xl, gap: SPACING.sm, flexWrap: 'wrap' }}>
        <button className="ce-btn" onClick={() => setPhase('info')}
          style={{ background: COLORS.white, color: COLORS.accent, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.md, padding: `${SPACING.base}px ${SPACING.lg}px`, fontSize: FONT.size.base, fontWeight: FONT.weight.medium, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          이전
        </button>
        <button className="ce-btn" onClick={() => setPhase('list')}
          style={{ background: COLORS.accent, color: COLORS.white, border: 'none', borderRadius: RADIUS.md, padding: `${SPACING.base}px ${SPACING.lg}px`, fontSize: FONT.size.base, fontWeight: FONT.weight.semibold, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          시작하기 </button>
      </div>
    </div>
  );
  // ── List (경험 목록) ─────────────────────────────────
  const renderList = () => {
    const personaHints = getPersonaHints(personaAnswers);
    return (
      <div style={{ maxWidth: 1350, margin: '0 auto', padding: `${SPACING.xl}px ${SPACING.md}px` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: SPACING.md, flexWrap: 'wrap', marginBottom: SPACING.md }}>
          <div>
            <h2 style={{ fontSize: FONT.size.h2, fontWeight: FONT.weight.semibold, color: COLORS.accent, margin: 0, marginBottom: 4 }}>경험 인벤토리</h2>
            <p style={{ fontSize: FONT.size.sm, color: COLORS.sub, margin: 0, lineHeight: FONT.lineHeight.relaxed }}>
              현재 <strong style={{ color: COLORS.accent2 }}>{experiences.length}개</strong>의 경험이 기록되어 있습니다. 7개 카테고리 중 골라서 원하는 만큼 추가하세요.
            </p>
          </div>
          {experiences.length >= 2 && (
            <button className="ce-btn" onClick={() => setPhase('review')}
              style={{ background: COLORS.white, color: COLORS.accent, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.base, padding: `${SPACING.sm}px ${SPACING.md}px`, fontSize: FONT.size.sm, fontWeight: FONT.weight.medium, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              전체 검토
            </button>
          )}
        </div>
        {/* 전체 경험 평면 목록 — 카테고리 매칭과 무관하게 항상 표시 (불러온 경험이 무조건 보이도록) */}
        {experiences.length > 0 && (
          <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.lg }}>
            <p style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color: COLORS.accent, margin: 0, marginBottom: SPACING.sm }}>전체 경험 목록 ({experiences.length})</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {experiences.map((e, idx) => {
                const status = getExpStatus(e);
                return (
                  <div key={e.id || idx} style={{ display: 'flex', alignItems: 'center', gap: SPACING.sm, padding: `${SPACING.xs}px ${SPACING.sm}px`, background: COLORS.bgAlt, borderRadius: RADIUS.sm }}>
                    <span style={{ fontSize: FONT.size.xs, color: status.color, background: status.bg, padding: '2px 6px', borderRadius: RADIUS.sm, fontWeight: FONT.weight.semibold, flexShrink: 0 }}>{status.label}</span>
                    <span style={{ fontSize: FONT.size.xs, color: COLORS.sub, flexShrink: 0, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.category || '미분류'}</span>
                    <span style={{ fontSize: FONT.size.sm, color: COLORS.accent, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.org || e.summary || `경험 ${idx + 1}`}</span>
                    <button onClick={() => editExperience(e.id)} style={{ background: 'transparent', border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.sm, cursor: 'pointer', color: COLORS.accent, fontSize: FONT.size.xs, padding: '2px 8px', fontFamily: FONT.family }}>편집</button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {/* 회사별 직무 연결 — 회사 채용공고 키워드에 내 경험을 연결 (회사별 따로 관리, 엑셀에 회사별 시트로 저장) */}
        {experiences.length > 0 && (() => {
          const companies = Object.keys(companyLinks);
          const active = (activeCompany && companyLinks[activeCompany]) ? activeCompany : (companies[0] || '');
          const cur = active ? companyLinks[active] : null;
          const inStyle = { width: '100%', padding: '8px 10px', border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.sm, fontSize: FONT.size.sm, fontFamily: FONT.family, color: COLORS.accent, outline: 'none', boxSizing: 'border-box', background: COLORS.bg };
          return (
            <div style={{ background: COLORS.white, border: `1px solid ${COLORS.accent2}`, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.lg }}>
              <p style={{ fontSize: FONT.size.md, fontWeight: FONT.weight.bold, color: COLORS.accent, margin: 0 }}>회사별 직무 연결</p>
              <p style={{ fontSize: FONT.size.sm, color: COLORS.sub, margin: '4px 0 12px', lineHeight: FONT.lineHeight.base }}>
                지원할 회사의 채용공고 키워드를 적고, 내 경험 중 맞는 것을 연결하세요. 회사를 추가하면 <strong>회사별로 따로 관리</strong>되고, 엑셀 저장 시 <strong>회사별 시트</strong>로 저장됩니다. (다른 회사 지원 시 기존 경험을 재활용)
              </p>
              <div style={{ display: 'flex', gap: SPACING.xs, flexWrap: 'wrap', alignItems: 'center', marginBottom: SPACING.md }}>
                {companies.map(c => (
                  <button key={c} onClick={() => setActiveCompany(c)}
                    style={{ padding: '6px 12px', borderRadius: RADIUS.pill || 999, border: `1px solid ${c === active ? COLORS.accent2 : COLORS.border}`, background: c === active ? COLORS.blueBg : COLORS.white, color: c === active ? COLORS.accent2 : COLORS.sub, fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, cursor: 'pointer', fontFamily: FONT.family }}>{c}</button>
                ))}
                <input type="text" value={newCompanyName} onChange={ev => setNewCompanyName(ev.target.value)}
                  placeholder="회사명 입력 (예: 토스)" onKeyDown={ev => { if (ev.key === 'Enter') addCompanyLink(); }}
                  style={{ ...inStyle, width: 170 }} />
                <button onClick={addCompanyLink} style={{ background: COLORS.white, color: COLORS.accent2, border: `1px solid ${COLORS.accent2}`, borderRadius: RADIUS.sm, padding: '6px 12px', fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, cursor: 'pointer', fontFamily: FONT.family, whiteSpace: 'nowrap' }} className="ce-btn">회사 추가</button>
              </div>
              {!active ? (
                <p style={{ fontSize: FONT.size.sm, color: COLORS.sub, margin: 0 }}>회사를 추가하면 그 회사 공고 키워드에 경험을 연결할 수 있습니다.</p>
              ) : (
                <div>
                  <label style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color: COLORS.accent, display: 'block', marginBottom: 4 }}>{active} — 채용공고 핵심 키워드</label>
                  <textarea value={cur.keywords || ''} onChange={ev => setCompanyKeywords(active, ev.target.value)} rows={2}
                    style={{ ...inStyle, marginBottom: SPACING.md, resize: 'vertical', lineHeight: 1.6 }} placeholder="예: SolidWorks, 공차 분석, FEA 구조해석, DOE 실험계획" />
                  <p style={{ fontSize: FONT.size.xs, color: COLORS.sub, margin: '0 0 6px' }}>↓ 위 키워드에 맞는 경험을 골라 연결을 적으세요 (모두 채울 필요 없음)</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.sm }}>
                    {experiences.map((e, idx) => (
                      <div key={e.id || idx} style={{ paddingLeft: SPACING.sm, borderLeft: `2px solid ${(cur.links && cur.links[e.id]) ? COLORS.accent2 : COLORS.bgAlt}` }}>
                        <p style={{ margin: '0 0 2px', fontSize: FONT.size.xs, fontWeight: FONT.weight.semibold, color: COLORS.accent }}>{e.org || e.category || `경험 ${idx + 1}`}{e.summary ? ` — ${e.summary}` : ''}</p>
                        <input type="text" value={(cur.links && cur.links[e.id]) || ''} onChange={ev => setExpLink(active, e.id, ev.target.value)}
                          style={inStyle} placeholder="이 경험이 충족하는 키워드·요건 (예: 'SQL' → 인턴에서 직접 추출)" />
                      </div>
                    ))}
                  </div>
                  <button onClick={() => removeCompanyLink(active)} style={{ background: 'transparent', color: COLORS.red, border: 'none', cursor: 'pointer', fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, marginTop: SPACING.sm, fontFamily: FONT.family, padding: 0 }}>이 회사 삭제</button>
                </div>
              )}
            </div>
          );
        })()}
        {personaHints.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.sm, marginBottom: SPACING.lg }}>
            {personaHints.map((h, i) => (
              <Hint key={i} type={h.type} icon={h.icon}>
                <span dangerouslySetInnerHTML={{ __html: h.text }} />
              </Hint>
            ))}
            {/* 경험 적은 사용자에게 인라인 가이드 토글 노출 */}
            {personaAnswers.experience_count === 'few' && (
              <GuideToggle
                open={showDiscovery}
                onToggle={() => setShowDiscovery(v => !v)}
                label="경험 발굴 체크리스트 펼쳐보기"
              >
                <DiscoveryPanel />
              </GuideToggle>
            )}
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: SPACING.md, marginBottom: SPACING.xl }}>
          {orderedCategories.map(cat => {
            const catExps = experiences.filter(e => categoryIdOf(e.category) === cat.id);
            return (
              <div key={cat.id} style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.md, padding: SPACING.md, display: 'flex', flexDirection: 'column', gap: SPACING.sm }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.sm }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: FONT.size.md, fontWeight: FONT.weight.semibold, color: COLORS.accent, margin: 0 }}>{cat.label}</p>
                    <p style={{ fontSize: FONT.size.xs, color: COLORS.sub, margin: 0, lineHeight: FONT.lineHeight.relaxed }}>{cat.desc}</p>
                  </div>
                </div>
                {catExps.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {catExps.map((e, idx) => {
                      const status = getExpStatus(e);
                      return (
                        <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: SPACING.sm, padding: `${SPACING.xs}px ${SPACING.sm}px`, background: COLORS.bgAlt, borderRadius: RADIUS.sm }}>
                          <span style={{ fontSize: FONT.size.xs, color: status.color, background: status.bg, padding: `2px 6px`, borderRadius: RADIUS.sm, fontWeight: FONT.weight.semibold, flexShrink: 0 }}>{status.label}</span>
                          <span style={{ fontSize: FONT.size.sm, color: COLORS.accent, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.org || `경험 ${idx + 1}`}</span>
                          <button onClick={() => editExperience(e.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: COLORS.accent2, padding: 2 }}></button>
                          <button onClick={() => deleteExperience(e.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: COLORS.red, padding: 2 }}></button>
                        </div>
                      );
                    })}
                  </div>
                )}
                <button className="ce-btn" onClick={() => addExperience(cat.label)}
                  style={{ background: COLORS.bgAlt, color: COLORS.accent, border: `1px dashed ${COLORS.border}`, borderRadius: RADIUS.base, padding: `${SPACING.sm}px ${SPACING.md}px`, fontSize: FONT.size.sm, fontWeight: FONT.weight.medium, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 'auto' }}>
                  경험 추가
                </button>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: SPACING.xl, gap: SPACING.sm, flexWrap: 'wrap' }}>
          <button className="ce-btn" onClick={() => setPhase('jd')}
            style={{ background: COLORS.white, color: COLORS.accent, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.md, padding: `${SPACING.base}px ${SPACING.lg}px`, fontSize: FONT.size.base, fontWeight: FONT.weight.medium, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            이전
          </button>
          <button className="ce-btn" onClick={() => setPhase('review')}
            disabled={experiences.length === 0}
            style={{ background: experiences.length === 0 ? COLORS.sub : COLORS.accent, color: COLORS.white, border: 'none', borderRadius: RADIUS.md, padding: `${SPACING.base}px ${SPACING.lg}px`, fontSize: FONT.size.base, fontWeight: FONT.weight.semibold, cursor: experiences.length === 0 ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, opacity: experiences.length === 0 ? 0.6 : 1 }}>
            최종 검토 </button>
        </div>
      </div>
    );
  };
  // ── Detail (4 step) ──────────────────────────────────
  const renderDetail = () => {
    if (!currentExp) {
      return (
        <div style={{ maxWidth: 1350, margin: '0 auto', padding: `${SPACING.xl}px ${SPACING.md}px`, textAlign: 'center' }}>
          <Hint type="warning">편집할 경험을 찾을 수 없습니다.</Hint>
          <button className="ce-btn" onClick={() => setPhase('list')}
            style={{ marginTop: SPACING.md, background: COLORS.accent, color: COLORS.white, border: 'none', borderRadius: RADIUS.md, padding: `${SPACING.base}px ${SPACING.lg}px`, fontSize: FONT.size.base, fontWeight: FONT.weight.semibold, cursor: 'pointer' }}>
            목록으로
          </button>
        </div>
      );
    }
    const e = currentExp;
    const upd = (field, value) => updateExperience(e.id, field, value);
    const categoryPrompts = EXPERIENCE_CATEGORIES.find(c => c.label === e.category)?.prompts || [];
    const steps = [
      { n: 1, label: '기본 정보' },
      { n: 2, label: 'STAR · 배운 점' },
      { n: 3, label: '역량 도출' },
      { n: 4, label: '직무상세내용 연결' },
    ];
    const stepDot = (active, done) => ({
      width: 28, height: 28, borderRadius: RADIUS.pill,
      background: done ? COLORS.green : (active ? COLORS.accent : COLORS.bgAlt),
      color: (done || active) ? COLORS.white : COLORS.sub,
      border: `1px solid ${done ? COLORS.green : (active ? COLORS.accent : COLORS.border)}`,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, flexShrink: 0,
    });
    const inputStyle = { width: '100%', padding: SPACING.sm, borderRadius: RADIUS.base, border: `1px solid ${COLORS.border}`, fontSize: FONT.size.base, fontFamily: FONT.family, color: COLORS.accent, outline: 'none', boxSizing: 'border-box' };
    const textareaStyle = { ...inputStyle, resize: 'vertical', lineHeight: FONT.lineHeight.relaxed };
    return (
      <div style={{ maxWidth: 1350, margin: '0 auto', padding: `${SPACING.xl}px ${SPACING.md}px` }}>
        {/* 스텝 네비게이션 */}
        <div style={{ marginBottom: SPACING.lg }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm, flexWrap: 'wrap', gap: SPACING.sm }}>
            <p style={{ fontSize: FONT.size.sm, color: COLORS.sub, margin: 0 }}>
              <span style={{ color: COLORS.accent2, fontWeight: FONT.weight.semibold }}>경험 작성</span> · {e.category || '(카테고리 미선택)'}
            </p>
            <button className="ce-btn" onClick={() => setPhase('list')}
              style={{ background: 'transparent', color: COLORS.sub, border: 'none', fontSize: FONT.size.sm, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              목록으로
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.xs, overflowX: 'auto', paddingBottom: 4 }}>
            {steps.map((s, i) => (
              <React.Fragment key={s.n}>
                <button onClick={() => setDetailStep(s.n)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <span style={stepDot(detailStep === s.n, detailStep > s.n)}>{detailStep > s.n ? '·' : s.n}</span>
                  <span style={{ fontSize: FONT.size.sm, color: detailStep === s.n ? COLORS.accent : COLORS.sub, fontWeight: detailStep === s.n ? FONT.weight.semibold : FONT.weight.regular, whiteSpace: 'nowrap' }}>{s.label}</span>
                </button>
                {i < steps.length - 1 && <div style={{ flex: 1, minWidth: 12, height: 1, background: COLORS.border }} />}
              </React.Fragment>
            ))}
          </div>
        </div>
        {/* Step 1: 기본 정보 */}
        {detailStep === 1 && (
          <div>
            <h3 style={{ fontSize: FONT.size.xl, fontWeight: FONT.weight.semibold, color: COLORS.accent, margin: 0, marginBottom: SPACING.sm }}>1단계 · 기본 정보</h3>
            <p style={{ fontSize: FONT.size.sm, color: COLORS.sub, margin: 0, marginBottom: SPACING.md, lineHeight: FONT.lineHeight.relaxed }}>이 경험의 기본 사항을 입력하세요.</p>
            {categoryPrompts.length > 0 && (
              <Hint type="tip">
                <strong>{e.category} 유도 질문</strong>
                <ul style={{ margin: 0, marginTop: 6, paddingLeft: 18, lineHeight: FONT.lineHeight.relaxed }}>
                  {categoryPrompts.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </Hint>
            )}
            <div style={{ marginTop: SPACING.md }}>
              <ExpField label="카테고리">
                <select className="ce-select" value={e.category} onChange={ev => upd('category', ev.target.value)}
                  style={{ ...inputStyle, background: COLORS.white }}>
                  <option value="">선택하세요</option>
                  {EXPERIENCE_CATEGORIES.map(c => <option key={c.id} value={c.label}>{c.label}</option>)}
                </select>
              </ExpField>
              <ExpField label="기간" hint="예: 2023.03 - 2023.06">
                <input className="ce-input" type="text" value={e.period} onChange={ev => upd('period', ev.target.value)} placeholder="YYYY.MM - YYYY.MM" style={inputStyle} />
              </ExpField>
              <ExpField label="활동 / 단체 / 기관명">
                <input className="ce-input" type="text" value={e.org} onChange={ev => upd('org', ev.target.value)} placeholder="예: 대학 자작자동차 동아리 'Racing Lab'" style={inputStyle} />
              </ExpField>
              <ExpField label="역할 / 직책" hint="리더 역할이 아니어도 괜찮습니다. '팀원', '자원봉사자' 등도 가능합니다.">
                <input className="ce-input" type="text" value={e.role} onChange={ev => upd('role', ev.target.value)} placeholder="예: 기구 설계 팀장 / 팀원 / 자원봉사자" style={inputStyle} />
              </ExpField>
              <ExpField label="주요 활동 / 업무 내용" hint="2~3줄로 간단히 요약. 상세는 STAR에서 풀어씁니다.">
                <textarea className="ce-textarea" value={e.summary} onChange={ev => upd('summary', ev.target.value)} rows={3} placeholder="예: 섀시 프레임 CAD 설계 및 시제품 제작, 팀원 관리" style={textareaStyle} />
              </ExpField>
              <ExpField label="하게 된 이유" hint="시작한 동기. 지원동기 자소서와 연결되는 중요한 부분입니다.">
                <textarea className="ce-textarea" value={e.motivation} onChange={ev => upd('motivation', ev.target.value)} rows={3} placeholder="예: 기구 설계에 관심이 있어 실무 경험을 쌓고 싶었고, 직접 손으로 구조를 설계하고 만드는 과정을 즐겨서 지원함" style={textareaStyle} />
              </ExpField>
            </div>
          </div>
        )}
        {/* Step 2: STAR + 배운 점 (통합) */}
        {detailStep === 2 && (
          <div>
            <h3 style={{ fontSize: FONT.size.xl, fontWeight: FONT.weight.semibold, color: COLORS.accent, margin: 0, marginBottom: SPACING.sm }}>2단계 · STAR 분석 · 배운 점</h3>
            <p style={{ fontSize: FONT.size.sm, color: COLORS.sub, margin: 0, marginBottom: SPACING.md, lineHeight: FONT.lineHeight.relaxed }}>경험을 구조화하는 핵심 단계입니다. 자소서와 면접의 설득력은 여기서 결정됩니다.</p>
            <Hint type="info">
              <strong>STAR 작성 원칙:</strong> 경험의 규모가 작아도 <em>"문제 발견 → 해결 행동 → 결과"</em> 구조로 풀면 의미 있는 소재가 됩니다. 편의점 6개월 아르바이트도 STAR로 풀면 프로세스 최적화 경험이 됩니다.
            </Hint>
            <div style={{ marginTop: SPACING.md }}>
              <ExpField label="S (Situation) — 상황" hint="언제, 어디서, 어떤 환경, 누구와 함께했는지. 구체적 배경.">
                <textarea className="ce-textarea" value={e.star_s} onChange={ev => upd('star_s', ev.target.value)} rows={3} placeholder="예: 5명으로 구성된 팀에서 소형 구동 모듈 기구 설계 캡스톤 프로젝트 진행" style={textareaStyle} />
              </ExpField>
              <ExpField label="T (Task) — 과제 / 목표" hint="그 상황에서 해결해야 했던 구체적 과제나 목표. 측정 가능한 형태가 이상적.">
                <textarea className="ce-textarea" value={e.star_t} onChange={ev => upd('star_t', ev.target.value)} rows={3} placeholder="예: 요구사양 분석, 부품 레이아웃 설계, 조립 공차 설정, 시제품 제작 방식 선정 및 비용 배분" style={textareaStyle} />
              </ExpField>
              <ExpField label="A (Action) — 행동" hint="내가 구체적으로 무엇을 했는지. 팀 행동이 아닌 개인 행동을 명시.">
                <textarea className="ce-textarea" value={e.star_a} onChange={ev => upd('star_a', ev.target.value)} rows={4} placeholder="예: 팀장으로서 업무 분담, 일정 관리, 최종 발표 자료 취합. 특히 조립 공차 분석과 시제품 제작 방식(3D 프린팅) 선정 담당" style={textareaStyle} />
              </ExpField>
              <ExpField label="R (Result) — 결과" hint="정량적(숫자) + 정성적(영향) 결과 모두 기록. 수치가 없어도 괜찮지만, 가능하면 Before/After 비교.">
                <textarea className="ce-textarea" value={e.star_r} onChange={ev => upd('star_r', ev.target.value)} rows={3} placeholder="예: 조립 공차 재설계로 시제품 불량률 30% 감소, A+ 획득. 공차 기반 설계 역량 향상. 팀원 만족도 90% 이상" style={textareaStyle} />
              </ExpField>
            </div>
            <div style={{ marginTop: SPACING.lg, paddingTop: SPACING.md, borderTop: `1px dashed ${COLORS.border}` }}>
              <div style={{ background: COLORS.redBg, borderLeft: `3px solid ${COLORS.red}`, borderRadius: RADIUS.base, padding: SPACING.md, marginBottom: SPACING.md }}>
                <p style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color: COLORS.red, margin: 0, marginBottom: 6 }}>실무자가 확인하고 싶어 하는 것 — 객관적 어려움</p>
                <p style={{ fontSize: FONT.size.xs, color: COLORS.accent, margin: 0, marginBottom: 6, lineHeight: FONT.lineHeight.relaxed }}>
                  ① 왜 힘들었나 ② 누가 들어도 "아 힘들었겠다" 공감하는가 ③ 그런데도 해냈는가. <strong>어려움이 약하면 결과도 약해 보입니다</strong> — 난이도가 명확해야 해결력이 부각됩니다.
                </p>
                <p style={{ fontSize: 11, color: COLORS.sub, margin: 0, fontStyle: 'italic' }}>
                  예: "수업에서 안 배운 FEA 해석을 3주 만에 익혀야 했음" · "팀원 3명이 빠져 혼자 진행" · "참고할 설계 선례가 없어 논문·기술자료를 직접 발굴"
                </p>
              </div>
              <ExpField label="객관적 어려움 (선택)" hint="이 경험이 왜 어려웠는지 한두 줄. 자소서·면접에서 해결력을 부각하는 핵심 재료가 됩니다.">
                <textarea className="ce-textarea" value={e.difficulty || ''} onChange={ev => upd('difficulty', ev.target.value)} rows={3}
                  placeholder="예: 학부 수업에서 FEA 구조해석은 처음이었고, 참고할 선례도 없어 3주 만에 ANSYS와 공차 분석을 독학하며 진행해야 했다."
                  style={textareaStyle} />
              </ExpField>
            </div>
            <div style={{ marginTop: SPACING.lg, paddingTop: SPACING.md, borderTop: `1px dashed ${COLORS.border}` }}>
              <Hint type="tip">
                "열심히 했다", "많이 배웠다"는 막연한 표현은 피하세요. <strong>"구체적으로 어떤 통찰을 얻었는지"</strong>, <strong>"이후 어떤 상황에 적용하게 되었는지"</strong>를 쓰면 성찰이 드러납니다.
              </Hint>
              <div style={{ marginTop: SPACING.md }}>
                <ExpField label="배운 점 / 느낀 점 — 이 경험의 의미·가치" hint='이 경험이 "사소해 보여도" 무엇을 보여주는지 찾아보세요. ① 어떤 역량·태도가 드러났는가 ② 그래서 지원 직무에 어떤 가치로 연결되는가까지 한 줄씩 적으면, 작은 경험도 강력한 소재가 됩니다.'>
                  <textarea className="ce-textarea" value={e.learning} onChange={ev => upd('learning', ev.target.value)} rows={4}
                    placeholder='예: 설계 완성도보다 "조립 공차를 정확히 정의하고 부품 간 간섭을 사전에 검증하는 것"이 중요함을 깨달음(통찰). → 공차를 정량적으로 분석하는 설계력을 보여줌(역량). → 지원 직무의 "공차 기반 기구 설계"와 직접 연결됨(직무 가치).'
                    style={textareaStyle} />
                </ExpField>
                <div style={{ ...BOX.tip, padding: SPACING.sm, borderRadius: RADIUS.base, marginTop: SPACING.sm }}>
                  <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0, lineHeight: FONT.lineHeight.relaxed }}>
                    <strong>작은 경험에서 가치를 찾는 3단계</strong> — ① 무엇을 했나(사실) → ② 그게 어떤 역량·태도를 증명하나(의미) → ③ 그 역량이 지원 직무의 어떤 업무·요건과 연결되나(가치). 경험의 "크기"가 아니라 이 연결의 "선명함"이 합격을 가릅니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Step 3: 역량 도출 */}
        {detailStep === 3 && (
          <div>
            <h3 style={{ fontSize: FONT.size.xl, fontWeight: FONT.weight.semibold, color: COLORS.accent, margin: 0, marginBottom: SPACING.sm }}>3단계 · 역량 도출</h3>
            <p style={{ fontSize: FONT.size.sm, color: COLORS.sub, margin: 0, marginBottom: SPACING.md, lineHeight: FONT.lineHeight.relaxed }}>
              이 경험에서 실제로 키워진 역량을 직무/소통/태도 세 범주로 태깅합니다. 각 역량마다 점수를 5구간 중에서 선택하세요.
            </p>
            {/* 점수 기준 가이드 박스 */}
            <GuideToggle
              open={showScore}
              onToggle={() => setShowScore(v => !v)}
              label="점수 기준 — 어떻게 점수를 매겨야 하나요?"
            >
              <ScorePanel />
            </GuideToggle>
            {/* 역량 사전 가이드 박스 */}
            <GuideToggle
              open={showDictionary}
              onToggle={() => setShowDictionary(v => !v)}
              label="역량 사전 — 직무·소통·태도 역량 단어 참고"
            >
              <DictionaryPanel onPick={null} />
            </GuideToggle>
            {/* (A) STAR 요약 카드 — 역량 도출의 근거 */}
            {(e.star_s || e.star_t || e.star_a || e.star_r) && (
              <details open style={{ background: COLORS.bgAlt, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.base, padding: SPACING.base, marginBottom: SPACING.md }}>
                <summary style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color: COLORS.accent, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, listStyle: 'none' }}>
                  내가 작성한 STAR 다시 보기 <span style={{ fontSize: FONT.size.xs, color: COLORS.sub, fontWeight: FONT.weight.regular, marginLeft: 'auto' }}>(역량 도출의 근거)</span>
                </summary>
                <div style={{ marginTop: SPACING.sm, paddingTop: SPACING.sm, borderTop: `1px dashed ${COLORS.border}`, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {e.star_s && <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0, lineHeight: FONT.lineHeight.relaxed }}><strong style={{ color: COLORS.accent2 }}>S:</strong> {e.star_s}</p>}
                  {e.star_t && <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0, lineHeight: FONT.lineHeight.relaxed }}><strong style={{ color: COLORS.accent2 }}>T:</strong> {e.star_t}</p>}
                  {e.star_a && <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0, lineHeight: FONT.lineHeight.relaxed }}><strong style={{ color: COLORS.accent2 }}>A:</strong> {e.star_a}</p>}
                  {e.star_r && <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0, lineHeight: FONT.lineHeight.relaxed }}><strong style={{ color: COLORS.accent2 }}>R:</strong> {e.star_r}</p>}
                </div>
              </details>
            )}
            {/* (B) 역량 도출 유도 질문 */}
            <details style={{ background: COLORS.blueBg, border: `1px solid ${COLORS.blue}33`, borderRadius: RADIUS.base, padding: SPACING.base, marginBottom: SPACING.md }}>
              <summary style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color: COLORS.accent, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, listStyle: 'none' }}>
                "어떤 역량을 도출해야 할지 모르겠어요" — 클릭해서 펼치기
              </summary>
              <div style={{ marginTop: SPACING.sm, paddingTop: SPACING.sm, borderTop: `1px dashed ${COLORS.blue}55` }}>
                <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0, marginBottom: SPACING.sm, lineHeight: FONT.lineHeight.relaxed }}>
                  <strong>다음 5가지 질문에 답하면서 역량을 떠올리세요.</strong> 정답은 위 STAR의 A(행동)·R(결과) 안에 이미 있습니다.
                </p>
                <ol style={{ margin: 0, paddingLeft: 20, fontSize: FONT.size.sm, color: COLORS.accent, lineHeight: FONT.lineHeight.relaxed, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <li><strong>행동(A)에서 구체적으로 뭘 했나요?</strong> 그걸 잘하기 위해 필요했던 능력은? <span style={{ color: COLORS.sub }}>(예: "도면 정리" → CAD 모델링, 공차 분석)</span></li>
                  <li><strong>결과(R)에 수치가 있다면, 어떤 분석·행동 덕분이었나요?</strong> <span style={{ color: COLORS.sub }}>(예: "불량률 30% 감소" → 조립 공차 재설계, FEA 검증)</span></li>
                  <li><strong>이 경험에서 가장 어려웠던 순간은?</strong> 그걸 극복하면서 키워진 역량은? <span style={{ color: COLORS.sub }}>(예: 갈등 → 갈등 관리, 협상)</span></li>
                  <li><strong>팀 안에서 사람들이 나에게 자주 부탁한 일은?</strong> <span style={{ color: COLORS.sub }}>(예: "발표는 ○○이가 잘해" → 프레젠테이션, 설명 능력)</span></li>
                  <li><strong>이 경험을 처음부터 다시 한다면 어떤 능력을 더 키워야 할까요?</strong> <span style={{ color: COLORS.sub }}>(현재 보유 점수가 낮은 것 = 향후 성장 계획 소재)</span></li>
                </ol>
                <p style={{ fontSize: FONT.size.xs, color: COLORS.sub, margin: 0, marginTop: SPACING.sm, lineHeight: FONT.lineHeight.relaxed }}>
                  이 5가지 질문에서 떠오른 단어들을 <strong>역량 사전</strong>에서 검색해보세요. 정확한 표현이 사전에 있으면 클릭해서 자동으로 채울 수 있습니다.
                </p>
              </div>
            </details>
            <Hint type="warning">
              <strong>보유하지 않은 역량을 개수 채우기 위해 적지 마세요.</strong> 면접에서 "구체적으로 설명해주세요"라고 하면 답변이 불가능해집니다. 실제로 키워진 역량 1~2개씩만 정직하게 적어도 충분합니다.
            </Hint>
            <div style={{ marginTop: SPACING.md }}>
              <ExpCompSection
                type="job_comps"
                title="직무역량 (기술 · 분석 능력)"
                hint="기술적·분석적 능력. 역량 사전에서 직무별 30개 참고 가능."
                placeholder="예: CAD 기구 설계, 공차 분석"
                expId={e.id}
                list={e.job_comps || []}
                updateComp={updateComp}
                addComp={addComp}
                removeComp={removeComp}
                inputStyle={inputStyle}/>
              <ExpCompSection
                type="comm_comps"
                title="소통역량 (대인관계 · 의사소통)"
                hint="팀워크, 리더십, 공감 능력 등."
                placeholder="예: 팀원 관리, 피드백 제공" 
                expId={e.id}
                list={e.comm_comps || []}
                updateComp={updateComp}
                addComp={addComp}
                removeComp={removeComp}
                inputStyle={inputStyle}/>
              <ExpCompSection
                type="att_comps"
                title="태도역량 (임하는 자세 · 가치관)"
                hint="일에 임하는 자세와 가치관."
                placeholder="예: 꾸준함, 개선 의지" 
                expId={e.id}
                list={e.att_comps || []}
                updateComp={updateComp}
                addComp={addComp}
                removeComp={removeComp}
                inputStyle={inputStyle}/>
            </div>
          </div>
        )}
        {/* Step 4: 직무상세내용 연결 */}
        {detailStep === 4 && (
          <div>
            <h3 style={{ fontSize: FONT.size.xl, fontWeight: FONT.weight.semibold, color: COLORS.accent, margin: 0, marginBottom: SPACING.sm }}>4단계 · 직무상세내용 키워드 연결</h3>
            <p style={{ fontSize: FONT.size.sm, color: COLORS.sub, margin: 0, marginBottom: SPACING.md, lineHeight: FONT.lineHeight.relaxed }}>이 경험이 채용공고의 어떤 요구 역량과 연결되는지 메모하면, STEP 3 자소서에서 바로 활용 가능합니다.</p>
            {!jdKeywords.core && !jdKeywords.tools && !jdKeywords.soft && (() => {
              const jd = getJdFromAnalysis();
              return (
                <div style={{ marginBottom: SPACING.sm }}>
                  {jd.has ? (
                    <div style={{ background: COLORS.blueBg || COLORS.bgAlt, border: `1px solid ${COLORS.accent2}`, borderRadius: RADIUS.base, padding: SPACING.md }}>
                      <p style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.bold, color: COLORS.accent, margin: 0, marginBottom: 6 }}>STEP 1 직무분석에서 가져온 직무상세내용</p>
                      {jd.duties && <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: '0 0 4px', whiteSpace: 'pre-wrap' }}><strong>주요 업무(직무상세내용):</strong>{'\n'}{jd.duties}</p>}
                      {jd.keywords && <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: '0 0 4px' }}><strong>핵심 키워드:</strong> {jd.keywords}</p>}
                      {jd.must && <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: '0 0 4px' }}><strong>필수 요건:</strong> {jd.must}</p>}
                      {jd.plus && <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: '0 0 8px' }}><strong>우대 사항:</strong> {jd.plus}</p>}
                      <p style={{ fontSize: FONT.size.xs, color: COLORS.sub, margin: '0 0 8px' }}>↓ 위 직무상세내용 항목 중 이 경험으로 뒷받침할 수 있는 것을 골라 아래에 연결을 적으세요.</p>
                      <button onClick={importJdFromAnalysis} style={{ background: COLORS.accent2, color: COLORS.white, border: 'none', borderRadius: RADIUS.sm, padding: '6px 12px', fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, cursor: 'pointer', fontFamily: FONT.family }}>직무상세내용을 매핑 대상으로 불러오기</button>
                    </div>
                  ) : (
                    <Hint type="tip">
                      <strong>STEP 1 채용공고 및 직무분석을 먼저 진행하면</strong> 여기에서 해당 직무와 자신의 경험을 바로 연결할 수 있습니다.
                    </Hint>
                  )}
                </div>
              );
            })()}
            {personaAnswers.status === 'transfer' && (
              <Hint type="warning">
                <strong>직무 전환자는 직무상세내용 매칭이 설득력의 핵심입니다.</strong> 이전 직무 경험을 지원 직무의 언어로 번역해서 기록하세요. (예: "품질관리에서 불량 원인 분석" → "기구 설계의 공차 분석 기초 역량")
              </Hint>
            )}
            {(jdKeywords.core || jdKeywords.tools || jdKeywords.soft) ? (
              <div style={{ ...BOX.info, padding: SPACING.md, borderRadius: RADIUS.base, marginBottom: SPACING.md, marginTop: personaAnswers.status === 'transfer' ? SPACING.sm : 0 }}>
                <p style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color: COLORS.accent, margin: 0, marginBottom: SPACING.sm }}>입력한 직무상세내용 키워드 (참고용)</p>
                {jdKeywords.core && <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0, marginBottom: 4 }}><strong>핵심 직무:</strong> {jdKeywords.core}</p>}
                {jdKeywords.tools && <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0, marginBottom: 4 }}><strong>도구·기술:</strong> {jdKeywords.tools}</p>}
                {jdKeywords.soft && <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0 }}><strong>소프트스킬:</strong> {jdKeywords.soft}</p>}
              </div>
            ) : (
              <Hint type="warning">
                직무상세내용 키워드가 입력되지 않았습니다. 이 단계는 건너뛰고 나중에 채용공고 분석 후 돌아와도 됩니다.
              </Hint>
            )}
            <div style={{ marginTop: SPACING.md }}>
              <ExpField label="이 경험이 커버하는 직무상세내용 키워드" hint="위 키워드 중 이 경험으로 뒷받침 가능한 것 + 구체적 연결 방식">
                <textarea className="ce-textarea" value={e.jd_match} onChange={ev => upd('jd_match', ev.target.value)} rows={4}
                  placeholder="예: 직무상세내용의 '공차 분석' → 본 경험의 '조립 공차 재설계 후 시제품 불량률 30% 감소'로 연결. 직무상세내용의 '팀 협업' → '기구 설계 팀장으로 팀원 5명 관리' 경험과 매칭."
                  style={textareaStyle} />
              </ExpField>
            </div>
            <div style={{ ...BOX.success, padding: SPACING.md, borderRadius: RADIUS.base, marginTop: SPACING.md }}>
              <p style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color: COLORS.accent, margin: 0, marginBottom: 4 }}>이 경험 완료!</p>
              <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0, lineHeight: FONT.lineHeight.relaxed }}>목록으로 돌아가 다른 경험을 추가하거나, 전체 인벤토리를 검토하세요.</p>
            </div>
          </div>
        )}
        {/* 하단 내비게이션 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: SPACING.xl, gap: SPACING.sm, flexWrap: 'wrap' }}>
          <button className="ce-btn" onClick={() => detailStep > 1 ? setDetailStep(detailStep - 1) : setPhase('list')}
            style={{ background: COLORS.white, color: COLORS.accent, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.md, padding: `${SPACING.base}px ${SPACING.lg}px`, fontSize: FONT.size.base, fontWeight: FONT.weight.medium, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            {detailStep > 1 ? '이전' : '목록으로'}
          </button>
          {detailStep < 4 ? (
            <button className="ce-btn" onClick={() => setDetailStep(detailStep + 1)}
              style={{ background: COLORS.accent, color: COLORS.white, border: 'none', borderRadius: RADIUS.md, padding: `${SPACING.base}px ${SPACING.lg}px`, fontSize: FONT.size.base, fontWeight: FONT.weight.semibold, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              다음 </button>
          ) : (
            <button className="ce-btn" onClick={() => setPhase('list')}
              style={{ background: COLORS.green, color: COLORS.white, border: 'none', borderRadius: RADIUS.md, padding: `${SPACING.base}px ${SPACING.lg}px`, fontSize: FONT.size.base, fontWeight: FONT.weight.semibold, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              이 경험 저장 & 목록으로
            </button>
          )}
        </div>
      </div>
    );
  };
  // ── Review ───────────────────────────────────────────
  const renderReview = () => {
    const byCategory = orderedCategories.map(cat => ({
      cat,
      items: experiences.filter(e => categoryIdOf(e.category) === cat.id),
    })).filter(g => g.items.length > 0);
    return (
      <div style={{ maxWidth: 1350, margin: '0 auto', padding: `${SPACING.xl}px ${SPACING.md}px` }}>
        <h2 style={{ fontSize: FONT.size.h2, fontWeight: FONT.weight.semibold, color: COLORS.accent, margin: 0, marginBottom: SPACING.sm }}>최종 검토</h2>
        <p style={{ fontSize: FONT.size.sm, color: COLORS.sub, margin: 0, marginBottom: SPACING.lg, lineHeight: FONT.lineHeight.relaxed }}>전체 경험 인벤토리를 한눈에 확인하세요. 각 카드를 눌러 원시 데이터를 펼쳐볼 수 있습니다.</p>
        {byCategory.length === 0 && (
          <Hint type="warning">아직 작성된 경험이 없습니다. 목록으로 돌아가 카테고리별로 경험을 추가하세요.</Hint>
        )}
        {/* (D) 직무상세내용 커버율 매트릭스 — 입력한 직무상세내용 키워드가 어떤 경험으로 커버되는지 진단 */}
        {experiences.length > 0 && (jdKeywords.core || jdKeywords.tools || jdKeywords.soft) && (() => {
          const splitKw = (str) => (str || '').split(/[,，·•、/\n]+/).map(s => s.trim()).filter(Boolean);
          const jdGroups = [
            { label: '핵심 직무', items: splitKw(jdKeywords.core), color: COLORS.accent2, bg: COLORS.blueBg },
            { label: '도구·기술', items: splitKw(jdKeywords.tools), color: COLORS.green, bg: COLORS.greenBg },
            { label: '소프트스킬', items: splitKw(jdKeywords.soft), color: COLORS.yellow, bg: COLORS.yellowBg },
          ].filter(g => g.items.length > 0);
          // 경험별 매칭 텍스트 풀 (jd_match + 모든 역량 이름 + summary)
          const expCorpus = (exp) => [
            exp.jd_match || '',
            ...(exp.job_comps || []).map(c => c.name),
            ...(exp.comm_comps || []).map(c => c.name),
            ...(exp.att_comps || []).map(c => c.name),
            exp.summary || '', exp.star_a || '', exp.star_r || '',
          ].join(' ').toLowerCase();
          const covers = (kw, exp) => expCorpus(exp).includes(kw.toLowerCase());
          const allKw = jdGroups.flatMap(g => g.items);
          const coveredKw = allKw.filter(kw => experiences.some(exp => covers(kw, exp)));
          const coverRate = allKw.length > 0 ? Math.round((coveredKw.length / allKw.length) * 100) : 0;
          const rateColor = coverRate >= 70 ? COLORS.green : coverRate >= 40 ? COLORS.yellow : COLORS.red;
          const rateBg = coverRate >= 70 ? COLORS.greenBg : coverRate >= 40 ? COLORS.yellowBg : COLORS.redBg;
          return (
            <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.xl }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.sm }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.sm }}>
                  <h3 style={{ fontSize: FONT.size.lg, fontWeight: FONT.weight.semibold, color: COLORS.accent, margin: 0 }}>직무상세내용 키워드 커버율</h3>
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: rateBg, color: rateColor, padding: `4px 12px`, borderRadius: RADIUS.pill, fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold }}>
                  {coveredKw.length}/{allKw.length} · {coverRate}%
                </div>
              </div>
              <p style={{ fontSize: FONT.size.sm, color: COLORS.sub, margin: 0, marginBottom: SPACING.md, lineHeight: FONT.lineHeight.relaxed }}>
                입력한 직무상세내용 키워드가 현재 경험 인벤토리(역량명·직무상세내용 메모·STAR)에서 언급되는지 자동 진단합니다. <strong>비어있는 키워드는 자소서 작성 전 추가 경험이 필요할 수 있습니다.</strong>
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.sm }}>
                {jdGroups.map(g => (
                  <div key={g.label}>
                    <p style={{ fontSize: FONT.size.xs, fontWeight: FONT.weight.semibold, color: g.color, margin: 0, marginBottom: 6 }}>{g.label}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {g.items.map((kw, i) => {
                        const matched = experiences.filter(exp => covers(kw, exp));
                        const isCovered = matched.length > 0;
                        return (
                          <span key={i} title={isCovered ? `${matched.length}개 경험에서 커버: ${matched.map(m => m.org || '경험').join(', ')}` : '커버하는 경험 없음'}
                            style={{
                              fontSize: FONT.size.xs,
                              fontWeight: FONT.weight.medium,
                              padding: `4px 10px`,
                              borderRadius: RADIUS.pill,
                              background: isCovered ? COLORS.greenBg : COLORS.redBg,
                              color: isCovered ? COLORS.green : COLORS.red,
                              border: `1px solid ${isCovered ? COLORS.green + '55' : COLORS.red + '55'}`,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                            }}>
                            {isCovered ? '[있음] ' : '[없음] '}
                            {kw}
                            {isCovered && <span style={{ fontSize: FONT.size.xs, opacity: 0.7 }}>· {matched.length}</span>}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              {coverRate < 70 && (
                <div style={{ ...BOX.warning, padding: SPACING.sm, borderRadius: RADIUS.base, marginTop: SPACING.md }}>
                  <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0, lineHeight: FONT.lineHeight.relaxed }}>
                    <strong>{allKw.length - coveredKw.length}개 키워드가 비어있습니다.</strong> 빈 키워드를 커버할 수 있는 경험을 추가하거나, 기존 경험의 STAR/역량/직무상세내용 연결 메모에 해당 키워드를 자연스럽게 포함시키세요. 역량 또는 경험이 없는 경우에는 억지로 연결시키기보다는, 자소서 작성 시 관련 역량을 어떻게 확보할지에 대한 계획으로 작성하시는 것이 좋습니다.
                  </p>
                </div>
              )}
              {coverRate >= 70 && (
                <div style={{ ...BOX.success, padding: SPACING.sm, borderRadius: RADIUS.base, marginTop: SPACING.md }}>
                  <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0, lineHeight: FONT.lineHeight.relaxed }}>
                    <strong>대부분의 직무상세내용 키워드가 커버되어 있습니다.</strong> 자소서 작성 단계에서 각 항목별로 어떤 경험을 매칭할지 결정하세요.
                  </p>
                </div>
              )}
            </div>
          );
        })()}
        {byCategory.map(g => {
          return (
            <div key={g.cat.id} style={{ marginBottom: SPACING.xl }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm }}>
                <h3 style={{ fontSize: FONT.size.lg, fontWeight: FONT.weight.semibold, color: COLORS.accent, margin: 0 }}>{g.cat.label}</h3>
                <span style={{ fontSize: FONT.size.xs, color: COLORS.sub, background: COLORS.bgAlt, padding: `2px 8px`, borderRadius: RADIUS.pill }}>{g.items.length}개</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.sm }}>
                {g.items.map((exp, idx) => {
                  const status = getExpStatus(exp);
                  const expanded = showRaw[exp.id];
                  return (
                    <div key={exp.id} style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.md, padding: SPACING.md }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: SPACING.sm, flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: 200 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.sm, marginBottom: 4, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: FONT.size.xs, color: status.color, background: status.bg, padding: `2px 6px`, borderRadius: RADIUS.sm, fontWeight: FONT.weight.semibold }}>{status.label}</span>
                            <p style={{ fontSize: FONT.size.md, fontWeight: FONT.weight.semibold, color: COLORS.accent, margin: 0 }}>{exp.org || `경험 ${idx + 1}`} · {exp.role || ''}</p>
                          </div>
                          <p style={{ fontSize: FONT.size.sm, color: COLORS.sub, margin: 0 }}>{exp.period} · {exp.summary}</p>
                        </div>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => setShowRaw(r => ({ ...r, [exp.id]: !r[exp.id] }))}
                            style={{ background: 'transparent', border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.sm, padding: `4px 8px`, fontSize: FONT.size.xs, color: COLORS.accent, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            {expanded ? '접기' : '펼치기'}
                          </button>
                          <button onClick={() => editExperience(exp.id)}
                            style={{ background: 'transparent', border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.sm, padding: `4px 8px`, fontSize: FONT.size.xs, color: COLORS.accent2, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            수정
                          </button>
                        </div>
                      </div>
                      {expanded && (
                        <div style={{ marginTop: SPACING.sm, paddingTop: SPACING.sm, borderTop: `1px dashed ${COLORS.border}`, display: 'flex', flexDirection: 'column', gap: SPACING.sm }}>
                          {exp.motivation && <DetailRow label="하게 된 이유" value={exp.motivation} />}
                          {(exp.star_s || exp.star_t || exp.star_a || exp.star_r) && (
                            <div style={{ background: COLORS.bgAlt, padding: SPACING.sm, borderRadius: RADIUS.sm }}>
                              <p style={{ fontSize: FONT.size.xs, fontWeight: FONT.weight.semibold, color: COLORS.accent2, margin: 0, marginBottom: 4 }}>STAR 분석</p>
                              {exp.star_s && <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0, marginBottom: 4, lineHeight: FONT.lineHeight.relaxed }}><strong>S:</strong> {exp.star_s}</p>}
                              {exp.star_t && <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0, marginBottom: 4, lineHeight: FONT.lineHeight.relaxed }}><strong>T:</strong> {exp.star_t}</p>}
                              {exp.star_a && <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0, marginBottom: 4, lineHeight: FONT.lineHeight.relaxed }}><strong>A:</strong> {exp.star_a}</p>}
                              {exp.star_r && <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0, lineHeight: FONT.lineHeight.relaxed }}><strong>R:</strong> {exp.star_r}</p>}
                            </div>
                          )}
                          {exp.learning && <DetailRow label="배운 점" value={exp.learning} />}
                          {(compSummary(exp.job_comps) || compSummary(exp.comm_comps) || compSummary(exp.att_comps)) && (
                            <div>
                              <p style={{ fontSize: FONT.size.xs, fontWeight: FONT.weight.semibold, color: COLORS.accent2, margin: 0, marginBottom: 4 }}>역량</p>
                              {compSummary(exp.job_comps) && <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0, marginBottom: 2, lineHeight: FONT.lineHeight.relaxed }}><strong>직무:</strong> {compSummary(exp.job_comps)}</p>}
                              {compSummary(exp.comm_comps) && <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0, marginBottom: 2, lineHeight: FONT.lineHeight.relaxed }}><strong>소통:</strong> {compSummary(exp.comm_comps)}</p>}
                              {compSummary(exp.att_comps) && <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0, lineHeight: FONT.lineHeight.relaxed }}><strong>태도:</strong> {compSummary(exp.att_comps)}</p>}
                            </div>
                          )}
                          {exp.jd_match && <DetailRow label="직무상세내용 연결" value={exp.jd_match} />}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: SPACING.xl, gap: SPACING.sm, flexWrap: 'wrap' }}>
          <button className="ce-btn" onClick={() => setPhase('list')}
            style={{ background: COLORS.white, color: COLORS.accent, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.md, padding: `${SPACING.base}px ${SPACING.lg}px`, fontSize: FONT.size.base, fontWeight: FONT.weight.medium, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            이전
          </button>
          <button className="ce-btn" onClick={() => setPhase('complete')}
            style={{ background: COLORS.accent, color: COLORS.white, border: 'none', borderRadius: RADIUS.md, padding: `${SPACING.base}px ${SPACING.lg}px`, fontSize: FONT.size.base, fontWeight: FONT.weight.semibold, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            완료 & 다음 STEP </button>
        </div>
      </div>
    );
  };
  // ── Complete ─────────────────────────────────────────
  const renderComplete = () => (
    <div style={{ maxWidth: 1350, margin: '0 auto', padding: `${SPACING.xl}px ${SPACING.md}px`, textAlign: 'center' }}>
      <div style={{ width: 72, height: 72, borderRadius: RADIUS.pill, background: COLORS.greenBg, color: COLORS.green, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md }}>
        </div>
      <h1 style={{ fontSize: FONT.size.h2, fontWeight: FONT.weight.bold, color: COLORS.accent, margin: 0, marginBottom: SPACING.sm, lineHeight: FONT.lineHeight.tight }}>
        경험 인벤토리 완성!
      </h1>
      <p style={{ fontSize: FONT.size.md, color: COLORS.sub, margin: 0, marginBottom: SPACING.xl, lineHeight: FONT.lineHeight.relaxed }}>
        총 {experiences.length}개의 경험을 정리했습니다. 이 인벤토리는 다음 단계의 모든 산출물의 재료가 됩니다.
      </p>
      <div style={{ display: 'flex', gap: SPACING.sm, justifyContent: 'center', flexWrap: 'wrap', marginBottom: SPACING.xl }}>
        <button className="ce-btn" onClick={handleSaveXlsx} disabled={isSavingXlsx}
          style={{ background: isSavingXlsx ? COLORS.sub : COLORS.green, color: COLORS.white, border: 'none', borderRadius: RADIUS.md, padding: `${SPACING.base}px ${SPACING.xl}px`, fontSize: FONT.size.md, fontWeight: FONT.weight.semibold, cursor: isSavingXlsx ? 'wait' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, opacity: isSavingXlsx ? 0.7 : 1, fontFamily: 'inherit' }}>
          {isSavingXlsx ? (
            <>
              <span style={{ display: 'inline-block', width: 14, height: 14, border: `2px solid ${COLORS.white}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'ce-spin 0.7s linear infinite' }} />
              파일 생성 중…
            </>
          ) : savedXlsx ? '✓ 저장 완료' : '저장 (.xlsx)'}
        </button>
      </div>
      <div style={{ ...BOX.tip, padding: SPACING.md, borderRadius: RADIUS.base, textAlign: 'left', marginBottom: SPACING.lg }}>
        <p style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color: COLORS.accent, margin: 0, marginBottom: 4 }}>.xlsx 파일 구조</p>
        <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0, lineHeight: FONT.lineHeight.relaxed }}>
          원본 <strong>경험정리 가이드워크북 xlsx</strong>와 동일한 시트 구조로 저장됩니다. 기본정보·페르소나·직무상세내용 / 경험정리(14컬럼 · 경험당 4행) / 직무상세내용매칭 3개 시트로 구성되어, 원본 파일과 호환되거나 대체해서 사용할 수 있습니다.
        </p>
      </div>
      <div style={{ marginTop: SPACING.xl }}>
        <button className="ce-btn" onClick={() => setPhase('review')}
          style={{ background: COLORS.white, color: COLORS.accent, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.md, padding: `${SPACING.sm}px ${SPACING.lg}px`, fontSize: FONT.size.sm, fontWeight: FONT.weight.medium, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          인벤토리 다시 보기
        </button>
      </div>
    </div>
  );
  // ── 최종 렌더 ─────────────────────────────────────────
  // intro 페이지는 외부 wrapper 헤더 없이 IntroPage 자체로 표시
  if (phase === 'intro') return renderIntro();
  return (
    <div style={{ minHeight: '100vh', background: COLORS.bg, fontFamily: FONT.family, color: COLORS.accent, lineHeight: FONT.lineHeight.base }}>
      <FocusStyles />
        <div style={{ maxWidth: 1350, margin: `${SPACING.md}px auto 0`, background: COLORS.bgAlt, borderRadius: RADIUS.md, padding: SPACING.md, border: `1px solid ${COLORS.border}`, marginBottom: SPACING.md, position: 'sticky', top: SPACING.md, zIndex: 10, boxShadow: '0 2px 8px rgba(14, 39, 80, 0.12)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: SPACING.base, flexWrap: 'wrap' }}>
            <CELockupA height={32} />
            <div style={{ position: 'relative', flex: 1, display: 'flex', justifyContent: 'center' }}>
              
              
            </div>
            {phase !== 'intro' && (
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => window.__CE_RESET?.fn?.()} title="이 워크북 작성 내용을 모두 지우고 처음부터 다시 작성" style={{ background: 'transparent', color: COLORS.red, border: `1px solid ${COLORS.red}66`, borderRadius: RADIUS.base, padding: '0 14px', fontSize: 16, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', height: 40, display: 'inline-flex', alignItems: 'center', marginRight: 6 }}>삭제하고 다시 작성</button><button onClick={goHome} title="처음 페이지로 이동 (작성 내용 유지)" style={{ background: 'transparent', color: COLORS.sub, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.base, padding: '0 14px', fontSize: 16, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', height: 40, display: 'inline-flex', alignItems: 'center' }}>처음으로</button>
                
                {/* [중복 제거] sticky 헤더 저장 버튼 → 상단 WorkbookShell '경험 정리 저장' 버튼으로 통합 */}
              </div>
            )}
          </div>
        </div>
      <style>{`@keyframes ce-spin { to { transform: rotate(360deg); } }`}</style>
      <ConfirmModal
        open={modal.open}
        title={modal.title}
        message={modal.message}
        confirmLabel={modal.confirmLabel}
        variant={modal.variant}
        onConfirm={modal.onConfirm}
        onCancel={() => setModal(m => ({ ...m, open: false }))}
      />

      {/* ═══ phase 진행 탭 ═══ */}
      {phase !== 'detail' && (
        <div style={{ maxWidth: 1350, margin: '0 auto', marginBottom: SPACING.md, paddingLeft: SPACING.md, paddingRight: SPACING.md }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: 4 }}>
            {[
              { key: 'info', label: '1. 기본 정보' },
              { key: 'jd', label: '2. 채용공고 키워드' },
              { key: 'list', label: '3. 경험 인벤토리' },
              { key: 'review', label: '4. 최종 검토' },
              { key: 'complete', label: '5. 완성' },
            ].map(({ key, label }) => {
              const phaseOrder = { info: 0, jd: 1, list: 2, detail: 2, review: 3, complete: 4 };
              const isCurrent = phase === key || (phase === 'detail' && key === 'list');
              const isPast = phaseOrder[phase] > phaseOrder[key];
              return (
                <button key={key} onClick={() => { setPhase(key); window.scrollTo(0, 0); }}
                  style={{
                    fontSize: 16, padding: '4px 10px', borderRadius: RADIUS.pill, border: 'none', cursor: 'pointer',
                    fontWeight: isCurrent ? FONT.weight.bold : FONT.weight.medium,
                    background: isCurrent ? COLORS.accent : isPast ? COLORS.greenBg : 'transparent',
                    color: isCurrent ? COLORS.white : isPast ? COLORS.green : COLORS.sub,
                    fontFamily: FONT.family, whiteSpace: 'nowrap', flexShrink: 0,
                  }}>
                  {isPast ? '✓ ' : ''}{label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {phase === 'info' && renderInfo()}
      {phase === 'jd' && renderJd()}
      {phase === 'list' && renderList()}
      {phase === 'detail' && renderDetail()}
      {phase === 'review' && renderReview()}
      {phase === 'complete' && renderComplete()}
      <StickyFooter />
    </div>
  );
};
// ── 보조 컴포넌트 ────────────────────────────────────────
const DetailRow = ({ label, value }) => (
  <div>
    <p style={{ fontSize: FONT.size.xs, fontWeight: FONT.weight.semibold, color: COLORS.accent2, margin: 0, marginBottom: 2 }}>{label}</p>
    <p style={{ fontSize: FONT.size.sm, color: COLORS.accent, margin: 0, lineHeight: FONT.lineHeight.relaxed }}>{value}</p>
  </div>
);
export default ExperienceWorkbook;