import { useCallback, useState } from 'react';

export function useImport(currentValue, onApply) {
  const [pendingItem, setPendingItem] = useState(null);

  const handleImport = useCallback((item) => {
    if (!currentValue) {
      onApply(item);
      return;
    }
    setPendingItem(item);
  }, [currentValue, onApply]);

  const confirmOverwrite = useCallback(() => {
    if (pendingItem) onApply(pendingItem);
    setPendingItem(null);
  }, [pendingItem, onApply]);

  const confirmAppend = useCallback(() => {
    if (pendingItem) onApply(pendingItem, { mode: 'append' });
    setPendingItem(null);
  }, [pendingItem, onApply]);

  const cancel = useCallback(() => setPendingItem(null), []);

  return { pendingItem, handleImport, confirmOverwrite, confirmAppend, cancel };
}
