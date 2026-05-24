// 경험정리 역량은 {name, score}(0~10) 배열로 저장된다.
// 여러 곳에서 배열을 그냥 join하면 "[object Object]"가 되므로, 공용 포맷터로 통일.
// 문자열 배열(예전 형식)도 안전하게 처리.

export function formatComps(arr) {
  if (!Array.isArray(arr)) return typeof arr === 'string' ? arr : '';
  return arr
    .map((c) => {
      if (c == null) return '';
      if (typeof c === 'string') return c;
      const name = c.name || '';
      if (!name) return '';
      return (c.score !== '' && c.score != null) ? `${name} (${c.score})` : name;
    })
    .filter(Boolean)
    .join(', ');
}
