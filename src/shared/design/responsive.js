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
  /* 워크북 sticky 헤더의 액션 묶음 작게 */
  .ce-workbook-header-actions button,
  .ce-workbook-header-actions a {
    padding: 6px 12px !important;
    font-size: 14px !important;
  }
  /* 모달 가득 */
  .ce-modal-card {
    max-width: 100% !important;
    margin: 8px !important;
  }
  /* textarea/input 18px이상 (iOS 줌 방지) */
  textarea, input[type="text"] {
    font-size: 16px !important;
  }
}

/* 스크롤바 */
* { -webkit-overflow-scrolling: touch; }

/* 워크북 본문 안의 중복 sticky 헤더 (S.headerSticky div) hide → WorkbookShell sticky만 사용 */
.ce-workbook-body > div > div[style*="sticky"] {
  display: none !important;
}
`;
