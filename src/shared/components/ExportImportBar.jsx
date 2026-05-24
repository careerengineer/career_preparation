import { useRef, useState } from 'react';
import { useDataStore } from '../../store/DataContext.jsx';
import { exportToFile, parseImportFile, detectConflicts } from '../../store/exportImport.js';
import { exportFullDocx, exportExperiencesXlsx, importExperiencesXlsx, extractBackupFromDocx, extractTextFromDocx } from '../../store/docExport.js';
import { DEFAULT_MASTER } from '../../store/schema.js';
import { COLORS, FONT, SPACING, RADIUS } from '../design/tokens.js';
import { OverwriteModal } from './OverwriteModal.jsx';

export function ExportImportBar() {
  const { master, replaceMaster, resetAllData } = useDataStore();
  const fileRef = useRef(null);
  const [toast, setToast] = useState(null);
  const [conflictState, setConflictState] = useState(null);
  const [resetMode, setResetMode] = useState(null); // null | 'ask' | 'confirm'

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 4000); };

  const handleResetAll = () => {
    resetAllData();
    setResetMode(null);
    showToast('전체 내용을 삭제했습니다. 페이지를 새로고침합니다…');
    setTimeout(() => window.location.reload(), 800);
  };
  const handleExportXlsx = () => {
    try {
      const name = exportExperiencesXlsx(master);
      showToast(`경험 정리: ${name}`);
    } catch (e) { showToast('오류: ' + e.message); }
  };
  const handleExportAll = async () => {
    const hasExp = (master.experiences || []).length > 0;
    const msg = hasExp
      ? '전체내용을 저장합니다. 두 파일이 함께 다운로드됩니다:\n\n1) 전체 내용 (.docx) — 자소서·면접 등\n2) 경험 정리 (.xlsx) — 경험정리 카드\n\n두 파일 모두 나중에 "가져오기"로 복원할 수 있습니다.\n\n계속할까요?'
      : '전체 내용 (.docx)을 저장합니다. 나중에 "가져오기"로 복원할 수 있습니다.\n\n계속할까요?';
    if (!window.confirm(msg)) return;
    try {
      const docxName = await exportFullDocx(master, { excludeExperiences: true });
      if (hasExp) {
        // 두 번째 다운로드는 약간 간격을 두어 브라우저의 다중 다운로드 차단을 피함
        await new Promise((r) => setTimeout(r, 700));
        const xlsxName = exportExperiencesXlsx(master);
        showToast(`저장 완료: ${docxName} + ${xlsxName}`);
      } else {
        showToast(`저장 완료: ${docxName}`);
      }
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
        // 경험정리 워크북이 읽는 legacy localStorage에도 반영 (워크북 진입 시 카드 표시)
        try {
          const LK = 'careerengineer_experience_v1';
          let data = {};
          try { data = JSON.parse(localStorage.getItem(LK) || '{}'); } catch {}
          data.experiences = experiences;
          data.savedAt = new Date().toISOString();
          localStorage.setItem(LK, JSON.stringify(data));
        } catch {}
        showToast(`경험 카드 ${experiences.length}개를 불러왔습니다.`);
      } catch (err) { showToast('오류: ' + err.message); }
      return;
    }

    // docx → 임베드된 JSON 백업 추출 (실패 시 본문 텍스트만)
    if (lower.endsWith('.docx')) {
      try {
        let payload;
        try {
          payload = await extractBackupFromDocx(file);
        } catch {
          // 임베드 없는 일반 docx → 본문 텍스트만 추출하여 workbookRaw._docxImport에 저장
          const extracted = await extractTextFromDocx(file);
          if (!window.confirm(`이 docx에는 CareerEngineer 백업 데이터가 없습니다.\n본문 텍스트만 추출하여 참고 자료로 저장할까요?\n(워크북 답변에는 자동 입력되지 않습니다 - 모달에서 복사/붙여넣기)`)) return;
          const next = {
            ...master,
            workbookRaw: {
              ...master.workbookRaw,
              _docxImport: {
                fileName: extracted.fileName,
                savedAt: extracted.extractedAt,
                answers: { 본문: extracted.text },
              },
            },
          };
          replaceMaster(next);
          showToast(`docx에서 ${extracted.paragraphCount}개 문단을 추출했습니다. 워크북에서 [참고 자료]로 확인하세요.`);
          return;
        }
        // 전체 백업
        if (payload.format === 'careerengineer-export') {
          const incoming = {
            ...DEFAULT_MASTER,
            ...payload.data,
            profile: { ...DEFAULT_MASTER.profile, ...(payload.data?.profile || {}) },
            workbookRaw: { ...DEFAULT_MASTER.workbookRaw, ...(payload.data?.workbookRaw || {}) },
            outputs: { ...DEFAULT_MASTER.outputs, ...(payload.data?.outputs || {}) },
            experiences: Array.isArray(payload.data?.experiences) ? payload.data.experiences : [],
          };
          const conflicts = detectConflicts(master, incoming);
          if (conflicts.length === 0) {
            replaceMaster(incoming);
            showToast('docx에서 전체 데이터를 복원했습니다.');
          } else {
            setConflictState({ conflicts, incoming });
          }
          return;
        }
        // 워크북 단일 백업
        if (payload.format === 'careerengineer-workbook-export') {
          const wbKey = payload.workbookKey;
          const title = payload.workbookTitle || wbKey;
          if (!window.confirm(`docx에서 '${title}' 결과를 가져옵니다.\n현재 데이터의 해당 워크북 부분만 교체됩니다. 계속할까요?`)) return;
          const d = payload.data || {};
          const next = { ...master };
          if (d.profile) next.profile = { ...master.profile, ...d.profile };
          if (d.raw) next.workbookRaw = { ...master.workbookRaw, [wbKey]: d.raw };
          if (d.output) next.outputs = { ...master.outputs, [wbKey]: d.output };
          if (d.roadmap) next.roadmap = d.roadmap;
          if (d.careergoal) next.careergoal = d.careergoal;
          if (d.jobAnalysis) next.jobAnalysis = d.jobAnalysis;
          if (Array.isArray(d.experiences)) next.experiences = d.experiences;
          replaceMaster(next);
          showToast(`docx에서 '${title}' 결과를 복원했습니다.`);
          return;
        }
        showToast('인식할 수 없는 백업 형식입니다.');
      } catch (err) {
        showToast('오류: ' + err.message);
      }
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
    <div style={{ display: 'flex', gap: SPACING.sm, alignItems: 'center', flexWrap: 'wrap' }}>
      <button onClick={handleImportClick} style={btnStyle}>가져오기 (.docx/.xlsx)</button>
      <button onClick={handleExportXlsx} style={btnStyle}>경험 정리만 저장 (.xlsx)</button>
      <button onClick={handleExportAll} style={btnPrimaryStyle}>전체내용 저장 (.docx + .xlsx)</button>
      <button onClick={() => setResetMode('ask')} style={btnDangerStyle}>전체 삭제하고 다시 작성</button>
      <input
        ref={fileRef}
        type="file"
        accept=".docx,.xlsx,.json,application/json,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      {toast && (
        <div style={{
          position: 'fixed', bottom: SPACING.lg, left: '50%', transform: 'translateX(-50%)',
          background: COLORS.accent, color: COLORS.white,
          padding: `${SPACING.sm}px ${SPACING.md}px`,
          fontFamily: FONT.family, fontSize: 20,
          boxShadow: '0 6px 18px rgba(0,0,0,0.18)', zIndex: 1100,
          display: 'flex', alignItems: 'center', gap: SPACING.md,
        }}>
          <span>{toast}</span>
          <button onClick={() => setToast(null)} style={{
            background: 'transparent', border: 'none', color: COLORS.accent2,
            cursor: 'pointer', fontSize: 20,
            fontWeight: FONT.weight.semibold, fontFamily: FONT.family,
          }}>닫기</button>
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
    <p style={{ fontSize: 14, color: COLORS.sub, margin: 0, textAlign: 'right', lineHeight: 1.6, maxWidth: 600 }}>
      <strong>전체내용 저장</strong>을 누르면 <strong>.docx + .xlsx</strong> 두 파일이 함께 저장됩니다. 둘 다 "가져오기"로 복원됩니다.
      각 워크북은 그 워크북 화면의 저장 파일로도 복원할 수 있습니다.
    </p>

    {resetMode && (
      <div onClick={() => setResetMode(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(14,39,80,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: SPACING.md }}>
        <div onClick={(e) => e.stopPropagation()} style={{ background: COLORS.white, maxWidth: 480, width: '100%', padding: SPACING.lg, fontFamily: FONT.family, boxShadow: '0 12px 36px rgba(0,0,0,0.18)', borderTop: `4px solid ${COLORS.red}` }}>
          <h2 style={{ margin: 0, fontSize: 24, color: COLORS.ink, fontWeight: FONT.weight.bold }}>전체 내용을 삭제하시겠습니까?</h2>
          <p style={{ color: COLORS.sub, fontSize: 20, marginTop: SPACING.sm, marginBottom: SPACING.md, lineHeight: 1.6 }}>
            모든 워크북·프로필·경험정리 작성 내용이 삭제되고 처음부터 다시 시작합니다.<br />
            <strong>회사별 저장본(슬롯)은 유지</strong>되며, 미리 받아둔 저장 파일(.docx/.xlsx)로 복원할 수 있습니다.
          </p>
          {resetMode === 'confirm' && (
            <div style={{ background: COLORS.redBg, borderLeft: `3px solid ${COLORS.red}`, padding: SPACING.md, marginBottom: SPACING.md }}>
              <p style={{ margin: 0, fontSize: 20, color: COLORS.red, fontWeight: FONT.weight.semibold }}>마지막 확인 — 정말 전체 삭제할까요?</p>
              <p style={{ margin: '6px 0 0', fontSize: 20, color: COLORS.ink }}>되돌릴 수 없습니다. 백업 파일을 먼저 받아두는 것을 권합니다.</p>
            </div>
          )}
          <div style={{ display: 'flex', gap: SPACING.sm, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <button onClick={() => setResetMode(null)} style={{ ...btnStyle, color: COLORS.sub, border: `1px solid ${COLORS.line}` }}>취소</button>
            {resetMode === 'ask'
              ? <button onClick={() => setResetMode('confirm')} style={btnDangerStyle}>삭제</button>
              : <button onClick={handleResetAll} style={{ ...btnDangerStyle, background: COLORS.red, color: COLORS.white }}>네, 전체 삭제합니다</button>}
          </div>
        </div>
      </div>
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
  fontSize: 20,
  fontWeight: FONT.weight.semibold,
  cursor: 'pointer',
};
const btnPrimaryStyle = {
  ...btnStyle,
  background: COLORS.accent2,
  color: COLORS.white,
};
const btnDangerStyle = {
  ...btnStyle,
  color: COLORS.red,
  border: `1px solid ${COLORS.red}`,
};
