// 클릭 가능한 div를 키보드(Enter/Space)·스크린리더로도 조작 가능하게 하는 공용 헬퍼.
// <div {...clickable(() => 핸들러())}> 형태로 onClick과 함께 role/tabIndex/onKeyDown를 한 번에 부여.
export function clickable(handler) {
  return {
    role: 'button',
    tabIndex: 0,
    onClick: handler,
    onKeyDown: (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(e); }
    },
  };
}
