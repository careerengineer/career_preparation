import { useRef, useState } from 'react';
import { useDataStore } from '../../store/DataContext.jsx';
import { exportToFile, parseImportFile, detectConflicts } from '../../store/exportImport.js';
import { COLORS, FONT, SPACING, RADIUS } from '../design/tokens.js';
import { OverwriteModal } from './OverwriteModal.jsx';

export function ExportImportBar() {
  const { master, replaceMaster } = useDataStore();
  const fileRef = useRef(null);
  const [toast, setToast] = useState(null);
  const [conflictState, setConflictState] = useState(null); // { conflicts, incoming }

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  const handleExport = () => {
    const filename = exportToFile(master);
    showToast(`백업 파일이 다운로드되었습니다: ${filename}`);
  };

  const handleImportClick = () => fileRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const { data: incoming } = await parseImportFile(file);
      const conflicts = detectConflicts(master, incoming);
      if (conflicts.length === 0) {
        replaceMaster(incoming);
        showToast('데이터를 불러왔습니다.');
      } else {
        setConflictState({ conflicts, incoming });
      }
    } catch (err) {
      showToast('오류: ' + err.message);
    }
  };

  const handleReplace = () => {
    if (conflictState) replaceMaster(conflictState.incoming);
    setConflictState(null);
    showToast('현재 데이터를 교체했습니다.');
  };

  const handleBackupAndReplace = () => {
    if (!conflictState) return;
    exportToFile(master);
    replaceMaster(conflictState.incoming);
    setConflictState(null);
    showToast('현재 데이터를 백업하고 교체했습니다.');
  };

  return (
    <div style={{ display: 'flex', gap: SPACING.sm, alignItems: 'center' }}>
      <button onClick={handleImportClick} style={btnStyle}>📥 가져오기</button>
      <button onClick={handleExport} style={btnStyle}>📤 내보내기</button>
      <input
        ref={fileRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      {toast && (
        <div style={{
          position: 'fixed', bottom: SPACING.lg, left: '50%', transform: 'translateX(-50%)',
          background: COLORS.accent, color: COLORS.white,
          padding: `${SPACING.sm}px ${SPACING.md}px`, borderRadius: RADIUS.md,
          fontFamily: FONT.family, fontSize: FONT.size.sm,
          boxShadow: '0 6px 18px rgba(0,0,0,0.18)', zIndex: 1100,
        }}>
          {toast}
        </div>
      )}
      {conflictState && (
        <OverwriteModal
          conflicts={conflictState.conflicts}
          onReplace={handleReplace}
          onBackupAndReplace={handleBackupAndReplace}
          onCancel={() => setConflictState(null)}
        />
      )}
    </div>
  );
}

const btnStyle = {
  background: COLORS.white,
  color: COLORS.accent2,
  border: `1px solid ${COLORS.accent2}`,
  padding: '8px 14px',
  borderRadius: RADIUS.md,
  fontFamily: FONT.family,
  fontSize: FONT.size.sm,
  fontWeight: FONT.weight.semibold,
  cursor: 'pointer',
};
