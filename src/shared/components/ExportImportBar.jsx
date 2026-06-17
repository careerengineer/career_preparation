import { useRef, useState } from 'react';
import { useDataStore } from '../../store/DataContext.jsx';
import { parseImportFile, detectConflicts } from '../../store/exportImport.js';
import { exportExperiencesXlsx, exportFullBackupZip, importExperiencesXlsx, extractBackupFromDocx, extractTextFromDocx, extractBackupFromZip, extractAllSlots } from '../../store/docExport.js';
import { syncLegacyFromMaster } from '../../store/legacySync.js';
import { DEFAULT_MASTER } from '../../store/schema.js';
import { COLORS, FONT, SPACING } from '../design/tokens.js';
import { OverwriteModal } from './OverwriteModal.jsx';
import { SnapshotRecovery } from './SnapshotRecovery.jsx';

export function ExportImportBar() {
  const { master, replaceMaster, resetAllData, importAllSlots } = useDataStore();
  const fileRef = useRef(null);
  const [toast, setToast] = useState(null);
  const [conflictState, setConflictState] = useState(null);
  const [resetMode, setResetMode] = useState(null); // null | 'ask' | 'confirm'

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 4000); };

  // 전체/부분 데이터를 적용 후, 각 워크북 legacy storage까지 동기화하고 새로고침.
  // (각 워크북은 mount 시 legacy storage를 우선으로 읽으므로 sync+reload가 없으면 화면에 반영되지 않음)
  const applyMasterAndReload = (next, msg) => {
    replaceMaster(next);
    syncLegacyFromMaster(next);
    showToast(msg);
    setTimeout(() => window.location.reload(), 1300);
  };

  const handleResetAll = () => {
    resetAllData();
    setResetMode(null);
    showToast('전체 내용을 삭제했습니다. 페이지를 새로고침합니다…');
    setTimeout(() => window.location.reload(), 800);
  };
  const handleExportXlsx = async () => {
    try {
      const name = await exportExperiencesXlsx(master);
      showToast(`경험 정리: ${name}`);
    } catch (e) { showToast('오류: ' + e.message); }
  };
  const handleExportAll = async () => {
    const msg = '전체내용을 .zip 한 파일로 저장합니다.\n\n· 전체 내용(.docx) + 경험 정리(.xlsx)가 한 파일로 묶입니다.\n· 복원할 때는 [기존 내용 불러오기]에 이 .zip을 그대로 올리면 모두 복원됩니다.\n\n계속할까요?';
    if (!window.confirm(msg)) return;
    try {
      const { zipName } = await exportFullBackupZip(master);
      showToast(`저장 완료: ${zipName} (.docx + .xlsx 포함)`);
    } catch (e) { showToast('오류: ' + e.message); }
  };

  const handleImportClick = () => fileRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const lower = file.name.toLowerCase();

    // 전체 저장본 백업(모든 회사)인지 먼저 확인 → 회사별 저장본 복원으로 라우팅
    let allSlots = null;
    try { allSlots = await extractAllSlots(file); } catch { allSlots = null; }
    if (allSlots && Object.keys(allSlots).length) {
      // 형식 이상 감지(import 전): career_roadmap.ans/answers 형식 점검 + 미지 값 표시
      const VAL_OK = { yes: 1, mid: 1, no: 1, na: 1 };
      const issues = [];
      try {
        for (const [name, slot] of Object.entries(allSlots)) {
          const rm = slot?.master?.workbookRaw?.career_roadmap;
          if (!rm) continue;
          const ansObj = rm.ans || rm.answers;
          if (!ansObj || typeof ansObj !== 'object') continue;
          const keyMis = !rm.ans && rm.answers ? '키 이름' : null;
          const badVals = Object.entries(ansObj).filter(([k, v]) => typeof v === 'string' && k !== 'who' && !VAL_OK[String(v).toLowerCase()]);
          const oldVals = Object.entries(ansObj).filter(([k, v]) => typeof v === 'string' && k !== 'who' && VAL_OK[String(v).toLowerCase()]);
          if (keyMis || badVals.length > 0 || oldVals.length > 0) {
            issues.push({ name, keyMis, oldVals: oldVals.length, badVals: badVals.map(([k]) => k) });
          }
        }
      } catch { /* 무시 */ }
      if (issues.length > 0) {
        const lines = issues.slice(0, 4).map((it) => `· ${it.name}: ${[
          it.keyMis ? 'ans 키 누락(answers로 들어옴)' : null,
          it.oldVals > 0 ? `옛 형식 값 ${it.oldVals}개(yes/mid/no/na)` : null,
          it.badVals.length > 0 ? `알 수 없는 값 ${it.badVals.length}개(${it.badVals.slice(0, 3).join(', ')})` : null,
        ].filter(Boolean).join(' / ')}`).join('\n');
        const moreLine = issues.length > 4 ? `\n…외 ${issues.length - 4}개 슬롯` : '';
        const cont = window.confirm(`⚠ 이 파일의 일부 데이터가 옛 형식이거나 키 이름이 맞지 않습니다:\n\n${lines}${moreLine}\n\n복원 시 자동 변환을 시도합니다. 진단 결과가 비어 보일 수 있어 결과 화면을 직접 확인해 주세요.\n\n계속 복원할까요?`);
        if (!cont) return;
      }
      const mode = window.confirm(`전체 저장본 백업입니다. 저장된 ${Object.keys(allSlots).length}개 회사 저장본을 복원합니다.\n[확인]: 기존 저장본과 병합\n[취소]: 기존 저장본 완전 교체`) ? 'merge' : 'replace';
      if (mode === 'replace' && !window.confirm('기존 회사별 저장본이 모두 삭제됩니다. 계속할까요?')) return;
      try {
        const { count, total } = importAllSlots(allSlots, mode);
        const baseMsg = `전체 저장본 ${count}개를 복원했습니다 (총 ${total}개). 페이지를 새로고침합니다…`;
        showToast(issues.length > 0 ? `${baseMsg}\n\n⚠ ${issues.length}개 슬롯의 진단 데이터가 자동 변환됐습니다. 결과 화면을 확인해 주세요.` : baseMsg);
        setTimeout(() => window.location.reload(), 1300);
      } catch (err) { showToast('오류: ' + err.message); }
      return;
    }

    // zip → 저장본 백업(.docx 전체 + .xlsx 경험)을 함께 복원
    if (lower.endsWith('.zip')) {
      if (!window.confirm('저장본 백업(.zip)으로 복원합니다. 현재 작업 내용이 덮어쓰기됩니다. 계속할까요?')) return;
      try {
        const { docxPayload, experiences, experienceMeta } = await extractBackupFromZip(file);
        if (!docxPayload && !(experiences && experiences.length)) {
          showToast('이 .zip에서 CareerEngineer 백업 데이터를 찾지 못했습니다.');
          return;
        }
        const data = docxPayload?.data || {};
        const incoming = {
          ...DEFAULT_MASTER,
          ...data,
          profile: { ...DEFAULT_MASTER.profile, ...(data.profile || {}) },
          // 경험 워크북 메타(회사별 연결·JD 키워드·페르소나)는 xlsx 백업에서 복원
          workbookRaw: { ...DEFAULT_MASTER.workbookRaw, ...(data.workbookRaw || {}), ...(experienceMeta ? { experience: { ...(data.workbookRaw?.experience || {}), ...experienceMeta } } : {}) },
          outputs: { ...DEFAULT_MASTER.outputs, ...(data.outputs || {}) },
          roadmap: { ...DEFAULT_MASTER.roadmap, ...(data.roadmap || {}) },
          careergoal: { ...DEFAULT_MASTER.careergoal, ...(data.careergoal || {}) },
          jobAnalysis: { ...DEFAULT_MASTER.jobAnalysis, ...(data.jobAnalysis || {}) },
          experiences: Array.isArray(experiences) ? experiences
            : (Array.isArray(data.experiences) ? data.experiences : []),
        };
        applyMasterAndReload(incoming, '저장본(.zip)에서 전체 내용을 복원했습니다. 페이지를 새로고침합니다…');
      } catch (err) { showToast('오류: ' + err.message); }
      return;
    }

    // xlsx → experience 카드 import
    if (lower.endsWith('.xlsx')) {
      if (!window.confirm('경험 카드를 xlsx 파일로 교체합니다. 기존 경험 데이터가 덮어쓰기됩니다. 계속할까요?')) return;
      try {
        const { experiences, experienceMeta } = await importExperiencesXlsx(file);
        const nextWbRaw = experienceMeta
          ? { ...master.workbookRaw, experience: { ...(master.workbookRaw?.experience || {}), ...experienceMeta } }
          : master.workbookRaw;
        applyMasterAndReload({ ...master, experiences, workbookRaw: nextWbRaw }, `경험 카드 ${experiences.length}개를 불러왔습니다. 페이지를 새로고침합니다…`);
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
          applyMasterAndReload(next, `docx에서 ${extracted.paragraphCount}개 문단을 추출했습니다. 워크북에서 [참고 자료]로 확인하세요.`);
          return;
        }
        // 전체 백업
        if (payload.format === 'careerengineer-export') {
          // "전체내용 저장(.docx)"은 경험을 일부러 제외하고 .xlsx로 분리한다.
          // 이런 docx를 단독으로 import할 때 현재 경험 카드를 0으로 덮어쓰면 데이터 유실 →
          // excludesExperiences면 현재 경험(experiences/workbookRaw.experience)을 보존한다.
          const excludesExp = payload.excludesExperiences === true;
          const incoming = {
            ...DEFAULT_MASTER,
            ...payload.data,
            profile: { ...DEFAULT_MASTER.profile, ...(payload.data?.profile || {}) },
            workbookRaw: {
              ...DEFAULT_MASTER.workbookRaw,
              ...(payload.data?.workbookRaw || {}),
              ...(excludesExp ? { experience: master.workbookRaw?.experience ?? null } : {}),
            },
            outputs: { ...DEFAULT_MASTER.outputs, ...(payload.data?.outputs || {}) },
            roadmap: { ...DEFAULT_MASTER.roadmap, ...(payload.data?.roadmap || {}) },
            careergoal: { ...DEFAULT_MASTER.careergoal, ...(payload.data?.careergoal || {}) },
            jobAnalysis: { ...DEFAULT_MASTER.jobAnalysis, ...(payload.data?.jobAnalysis || {}) },
            experiences: excludesExp
              ? (master.experiences || [])
              : (Array.isArray(payload.data?.experiences) ? payload.data.experiences : []),
          };
          const doneMsg = excludesExp
            ? 'docx에서 전체 내용을 복원했습니다. 경험정리는 .xlsx 파일로 따로 "기존 내용 불러오기" 하세요.'
            : 'docx에서 전체 데이터를 복원했습니다.';
          const conflicts = detectConflicts(master, incoming);
          if (conflicts.length === 0) {
            applyMasterAndReload(incoming, doneMsg);
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
          applyMasterAndReload(next, `docx에서 '${title}' 결과를 복원했습니다. 페이지를 새로고침합니다…`);
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
        applyMasterAndReload(next, `'${title}' 결과를 불러왔습니다. 페이지를 새로고침합니다…`);
        return;
      }
      const incoming = result.data;
      const conflicts = detectConflicts(master, incoming);
      if (conflicts.length === 0) {
        applyMasterAndReload(incoming, '데이터를 불러왔습니다. 페이지를 새로고침합니다…');
      } else {
        setConflictState({ conflicts, incoming });
      }
    } catch (err) {
      showToast('오류: ' + err.message);
    }
  };

  const handleReplace = () => {
    if (!conflictState) return;
    const next = conflictState.incoming;
    setConflictState(null);
    applyMasterAndReload(next, '현재 데이터를 교체했습니다. 페이지를 새로고침합니다…');
  };

  const handleBackupAndReplace = async () => {
    if (!conflictState) return;
    try { await exportFullBackupZip(master); } catch (e) { showToast('백업 오류: ' + e.message); return; }
    const next = conflictState.incoming;
    setConflictState(null);
    applyMasterAndReload(next, '현재 데이터를 백업(.zip)하고 교체했습니다. 페이지를 새로고침합니다…');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end', width: '100%' }}>
    <style>{`@media (max-width:640px){ .ce-iebar-row{ gap:8px; } .ce-iebar-row > button{ flex:1 1 100%; } .ce-iebar-divider{ display:none !important; } }`}</style>
    <div className="ce-iebar-row" style={{ display: 'flex', gap: SPACING.sm, alignItems: 'center', flexWrap: 'wrap', width: '100%' }}>
      <button onClick={handleImportClick} style={btnStyle}>기존 내용 불러오기 (.zip/.docx/.xlsx)</button>
      <button onClick={handleExportXlsx} style={btnStyle}>경험 정리만 저장 (.xlsx)</button>
      <button onClick={handleExportAll} style={btnPrimaryStyle}>전체내용 저장 (.zip)</button>
      <SnapshotRecovery />
      {/* 저장 버튼들과 확실히 떨어뜨려 맨 오른쪽에 단독 배치 (오클릭 방지) */}
      <span aria-hidden className="ce-iebar-divider" style={{ alignSelf: 'stretch', width: 1, background: COLORS.line, marginLeft: 'auto', marginRight: SPACING.md }} />
      <button onClick={() => setResetMode('ask')} style={btnDangerStyle}>전체 삭제하고 다시 작성</button>
      <input
        ref={fileRef}
        type="file"
        accept=".docx,.xlsx,.json,.zip,application/json,application/zip,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
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
    <p style={{ fontSize: 14, color: COLORS.sub, margin: 0, textAlign: 'center', lineHeight: 1.6, width: '100%' }}>
      <strong>전체내용 저장</strong>을 누르면 <strong>.docx(전체 내용) + .xlsx(경험 정리)</strong>가 <strong>.zip 한 파일</strong>로 저장됩니다. 복원은 그 .zip을 "기존 내용 불러오기"에 올리면 됩니다. 각 워크북은 그 워크북 화면의 저장 파일로도 복원할 수 있습니다.
    </p>

    {resetMode && (
      <div onClick={() => setResetMode(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(14,39,80,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: SPACING.md }}>
        <div onClick={(e) => e.stopPropagation()} style={{ background: COLORS.white, maxWidth: 480, width: '100%', padding: SPACING.lg, fontFamily: FONT.family, boxShadow: '0 12px 36px rgba(0,0,0,0.18)', borderTop: `4px solid ${COLORS.red}` }}>
          <h2 style={{ margin: 0, fontSize: 24, color: COLORS.ink, fontWeight: FONT.weight.bold }}>전체 내용을 삭제하시겠습니까?</h2>
          <p style={{ color: COLORS.sub, fontSize: 20, marginTop: SPACING.sm, marginBottom: SPACING.md, lineHeight: 1.6 }}>
            모든 워크북·프로필·경험정리 작성 내용이 삭제되고 처음부터 다시 시작합니다.<br />
            <strong>회사별 저장본(슬롯)은 유지</strong>되며, 미리 받아둔 저장 파일(.zip)로 복원할 수 있습니다.
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
