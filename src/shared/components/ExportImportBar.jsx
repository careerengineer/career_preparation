import { useRef, useState } from 'react';
import { useDataStore } from '../../store/DataContext.jsx';
import { exportToFile, parseImportFile, detectConflicts } from '../../store/exportImport.js';
import { exportFullDocx, exportExperiencesXlsx, importExperiencesXlsx, extractBackupFromDocx, extractTextFromDocx } from '../../store/docExport.js';
import { DEFAULT_MASTER } from '../../store/schema.js';
import { COLORS, FONT, SPACING, RADIUS } from '../design/tokens.js';
import { OverwriteModal } from './OverwriteModal.jsx';

export function ExportImportBar() {
  const { master, replaceMaster } = useDataStore();
  const fileRef = useRef(null);
  const [toast, setToast] = useState(null);
  const [conflictState, setConflictState] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 4000); };

  const handleExportJson = () => {
    const filename = exportToFile(master);
    showToast(`백업: ${filename}`);
  };
  const handleExportXlsx = () => {
    try {
      const name = exportExperiencesXlsx(master);
      showToast(`경험 정리: ${name}`);
    } catch (e) { showToast('오류: ' + e.message); }
  };
  const handleExportRestDocx = async () => {
    const hasExp = (master.experiences || []).length > 0;
    const msg = hasExp
      ? '"전체내용 저장(.docx)"은 읽기·제출용 통합 문서입니다.\n\n경험정리는 이 파일에 포함되지 않습니다 → 경험정리는 "경험 정리 저장(.xlsx)"로 따로 저장하세요.\n\n나중에 다시 불러올 백업이 목적이면 "완전 백업(.json)" 하나면 전부 복원됩니다.\n\n계속할까요?'
      : '"전체내용 저장(.docx)"은 읽기·제출용 통합 문서입니다.\n\n다시 불러올 백업이 목적이면 "완전 백업(.json)"을 사용하세요.\n\n계속할까요?';
    if (!window.confirm(msg)) return;
    try {
      const name = await exportFullDocx(master, { excludeExperiences: true });
      showToast(hasExp ? `저장 완료: ${name} · 경험정리는 .xlsx로 따로 저장하세요` : `저장 완료: ${name}`);
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
      <button onClick={handleImportClick} style={btnStyle}>가져오기 (.json/.xlsx/.docx)</button>
      <button onClick={handleExportXlsx} style={btnStyle}>경험 정리 저장 (.xlsx)</button>
      <button onClick={handleExportRestDocx} style={btnPrimaryStyle}>전체내용 저장 (.docx)</button>
      <button onClick={handleExportJson} style={btnStyle} title="모든 데이터 한 파일로 (다른 기기 복원용)">완전 백업 (.json)</button>
      <input
        ref={fileRef}
        type="file"
        accept=".json,.xlsx,.docx,application/json,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
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
    <p style={{ fontSize: 14, color: COLORS.sub, margin: 0, textAlign: 'right', lineHeight: 1.6, maxWidth: 560 }}>
      나중에 다시 불러오려면 <strong>완전 백업(.json)</strong>이 가장 안전합니다(전부 한 파일).
      전체내용 저장(.docx)은 읽기·제출용이며 <strong>경험정리는 경험 정리 저장(.xlsx)로 따로</strong> 저장하세요.
    </p>
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
