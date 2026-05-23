import { useRef, useState } from 'react';
import { useDataStore } from '../../store/DataContext.jsx';
import { exportToFile, parseImportFile, detectConflicts } from '../../store/exportImport.js';
import { exportFullDocx, importExperiencesXlsx } from '../../store/docExport.js';
import { COLORS, FONT, SPACING, RADIUS } from '../design/tokens.js';
import { OverwriteModal } from './OverwriteModal.jsx';

export function ExportImportBar() {
  const { master, replaceMaster } = useDataStore();
  const fileRef = useRef(null);
  const [toast, setToast] = useState(null);
  const [conflictState, setConflictState] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2600); };

  const handleExportJson = () => {
    const filename = exportToFile(master);
    showToast(`백업: ${filename}`);
  };
  const handleExportDocx = async () => {
    try {
      const name = await exportFullDocx(master);
      showToast(`문서: ${name}`);
    } catch (e) { showToast('오류: ' + e.message); }
  };

  const handleImportClick = () => fileRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const lower = file.name.toLowerCase();

    // xlsx → experience 카드 import
    if (lower.endsWith('.xlsx')) {
      if (!window.confirm('경험 카드를 xlsx 파일로 교체합니다. 기존 경험 데이터가 덮어쓰기됩니다. 계속할까요?')) return;
      try {
        const { experiences } = await importExperiencesXlsx(file);
        replaceMaster({ ...master, experiences });
        showToast(`경험 카드 ${experiences.length}개를 불러왔습니다.`);
      } catch (err) { showToast('오류: ' + err.message); }
      return;
    }

    // json
    try {
      const result = await parseImportFile(file);
      if (result.workbookOnly) {
        const p = result.parsed;
        const wbKey = p.workbookKey;
        const title = p.workbookTitle || wbKey;
        if (!window.confirm(`'${title}' 워크북 결과를 가져옵니다.\n현재 데이터의 해당 워크북 부분만 교체됩니다. 계속할까요?`)) return;
        const d = p.data || {};
        const next = { ...master };
        if (d.profile) next.profile = { ...master.profile, ...d.profile };
        if (d.raw) next.workbookRaw = { ...master.workbookRaw, [wbKey]: d.raw };
        if (d.output) next.outputs = { ...master.outputs, [wbKey]: d.output };
        if (d.roadmap) next.roadmap = d.roadmap;
        if (d.careergoal) next.careergoal = d.careergoal;
        if (d.jobAnalysis) next.jobAnalysis = d.jobAnalysis;
        if (Array.isArray(d.experiences)) next.experiences = d.experiences;
        replaceMaster(next);
        showToast(`'${title}' 결과를 불러왔습니다.`);
        return;
      }
      const incoming = result.data;
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
    <div style={{ display: 'flex', gap: SPACING.sm, alignItems: 'center', flexWrap: 'wrap' }}>
      <button onClick={handleImportClick} style={btnStyle}>가져오기 (.json/.xlsx)</button>
      <button onClick={handleExportJson} style={btnStyle}>백업 (.json)</button>
      <button onClick={handleExportDocx} style={btnPrimaryStyle}>전체 문서 (.docx)</button>
      <input
        ref={fileRef}
        type="file"
        accept=".json,.xlsx,application/json,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      {toast && (
        <div style={{
          position: 'fixed', bottom: SPACING.lg, left: '50%', transform: 'translateX(-50%)',
          background: COLORS.accent, color: COLORS.white,
          padding: `${SPACING.sm}px ${SPACING.md}px`,
          fontFamily: FONT.family, fontSize: FONT.size.body,
          boxShadow: '0 6px 18px rgba(0,0,0,0.18)', zIndex: 1100,
        }}>{toast}</div>
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
  fontFamily: FONT.family,
  fontSize: FONT.size.body,
  fontWeight: FONT.weight.semibold,
  cursor: 'pointer',
};
const btnPrimaryStyle = {
  ...btnStyle,
  background: COLORS.accent2,
  color: COLORS.white,
};
