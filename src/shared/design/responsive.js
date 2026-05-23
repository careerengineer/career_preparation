// 반응형 글로벌 스타일 (mobile-first)
export const RESPONSIVE_CSS = `
/* 기본: 데스크탑 폰트 */
:root {
  font-size: 16px;
  -webkit-text-size-adjust: 100%;
}

/* 태블릿 이하 */
@media (max-width: 768px) {
  /* 대시보드 헤더 액션 줄바꿈 */
  .ce-dashboard-header { flex-direction: column !important; align-items: flex-start !important; }
  /* h1 폰트 줄임 */
  .ce-h1-display { font-size: 28px !important; line-height: 1.25 !important; }
}

/* 모바일 */
@media (max-width: 480px) {
  /* 워크북 sticky 헤더의 액션 묶음 - 더 작게, 한 줄 강제 */
  .ce-workbook-header-actions {
    width: 100% !important;
    justify-content: stretch !important;
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch !important;
    flex-wrap: nowrap !important;
  }
  .ce-workbook-header-actions button,
  .ce-workbook-header-actions a {
    padding: 6px 10px !important;
    font-size: 13px !important;
    white-space: nowrap !important;
    flex-shrink: 0 !important;
  }
  /* 워크북 sticky 헤더 패딩 축소 */
  .ce-shell-sticky {
    padding: 6px 12px !important;
  }
  /* 모달 가득 */
  .ce-modal-card {
    max-width: 100% !important;
    margin: 8px !important;
  }
  /* textarea/input 16px이상 (iOS 줌 방지) */
  textarea, input[type="text"] {
    font-size: 16px !important;
  }
}

/* 스크롤바 */
* { -webkit-overflow-scrolling: touch; }

/* 워크북 내부 멘토링·컨설팅 외부 링크 hide (latpeed.com 도메인) */
.ce-workbook-body a[href*="latpeed.com"],
.ce-workbook-body a[href*="open.kakao.com"] {
  display: none !important;
}
/* 멘토링 카드/배너 hide - 부모 컨테이너에 같은 링크 있으면 묶음으로 */
.ce-workbook-body [class*="mentoring" i],
.ce-workbook-body [data-mentoring] {
  display: none !important;
}
`;
