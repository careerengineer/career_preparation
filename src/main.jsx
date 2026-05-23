import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// 새 배포 후 옛 청크 파일이 404 (SPA fallback이 HTML 반환) → 자동 새로고침
// vite의 preloadError 이벤트는 lazy import 실패 시 발생
if (typeof window !== 'undefined') {
  window.addEventListener('vite:preloadError', (event) => {
    console.warn('[ce] chunk load failed, reloading for new deploy', event.payload?.message);
    // 한 번만 reload (무한 루프 방지: sessionStorage 플래그)
    const key = 'ce_chunk_reload_ts';
    const last = parseInt(sessionStorage.getItem(key) || '0', 10);
    const now = Date.now();
    if (now - last > 10000) {
      sessionStorage.setItem(key, String(now));
      window.location.reload();
    }
  });

  // 추가 안전망: dynamic import 자체 reject → 직접 캐치
  window.addEventListener('unhandledrejection', (event) => {
    const msg = event.reason?.message || '';
    if (/Failed to fetch dynamically imported module|Importing a module script failed|MIME type of "text\/html"/.test(msg)) {
      const key = 'ce_chunk_reload_ts';
      const last = parseInt(sessionStorage.getItem(key) || '0', 10);
      const now = Date.now();
      if (now - last > 10000) {
        sessionStorage.setItem(key, String(now));
        window.location.reload();
      }
    }
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
