import { useEffect, useRef, useState } from 'react';
import { useDataStore } from '../store/DataContext.jsx';
import { COLORS, FONT, SPACING, RULE } from '../shared/design/tokens.js';

export default function CompanySlots() {
  const {
    master, saveCompanySlot, loadCompanySlot, deleteCompanySlot, listCompanySlots,
    exportAllSlotsFile, exportSingleSlotFile, importAllSlotsFile,
  } = useDataStore();
  const [slots, setSlots] = useState([]);
  const [toast, setToast] = useState(null);
  const [newName, setNewName] = useState('');
  const importRef = useRef(null);

  const refresh = () => setSlots(listCompanySlots());
  useEffect(() => { refresh(); /* eslint-disable-next-line */ }, []);

  const showToast = (m) => { setToast(m); setTimeout(() => setToast(null), 4000); };

  const handleSave = () => {
    const defaultName = master.profile.company || master.profile.position || '회사';
    const name = (newName.trim() || defaultName);
    if (slots.find((s) => s.name === name)) {
      if (!window.confirm(`'${name}' 저장본이 이미 있습니다. 현재 데이터로 덮어쓸까요?`)) return;
    }
    saveCompanySlot(name);
    setNewName('');
    refresh();
    showToast(`'${name}' 저장본에 저장했습니다. 안전을 위해 [전체 저장본 백업]도 받아두세요.`);
  };

  const handleLoad = (name) => {
    if (!window.confirm(`'${name}' 저장본의 데이터로 현재 작업을 교체합니다.\n현재 작업이 사라질 수 있으니, 먼저 별도 저장본에 저장하거나 백업하세요.\n계속할까요?`)) return;
    try {
      loadCompanySlot(name);
      showToast(`'${name}' 저장본을 불러왔습니다.`);
    } catch (e) { showToast('오류: ' + e.message); }
  };

  const handleDelete = (name) => {
    if (!window.confirm(`'${name}' 저장본을 삭제하시겠습니까? 이 동작은 되돌릴 수 없습니다.`)) return;
    deleteCompanySlot(name);
    refresh();
    showToast(`'${name}' 저장본을 삭제했습니다.`);
  };

  const handleSlotExport = (name) => {
    try {
      const fn = exportSingleSlotFile(name);
      showToast(`'${name}' 저장본을 파일로 저장했습니다: ${fn}`);
    } catch (e) { showToast('오류: ' + e.message); }
  };

  const handleExportAll = () => {
    if (slots.length === 0) { showToast('백업할 저장본이 없습니다.'); return; }
    const fn = exportAllSlotsFile();
    showToast(`전체 ${slots.length}개 저장본을 백업했습니다: ${fn}`);
  };

  const handleImportClick = () => importRef.current?.click();
  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const mode = window.confirm('전체 저장본 백업을 불러옵니다.\n[확인]: 기존 저장본과 병합 (같은 이름은 새 것으로 덮어쓰기)\n[취소]: 기존 저장본 완전 교체') ? 'merge' : 'replace';
    if (mode === 'replace' && !window.confirm('기존 저장본이 모두 삭제됩니다. 정말 진행할까요?')) return;
    try {
      const { count, total } = await importAllSlotsFile(file, mode);
      refresh();
      showToast(`저장본 ${count}개를 ${mode === 'merge' ? '병합' : '교체'}했습니다 (총 ${total}개).`);
    } catch (err) { showToast('오류: ' + err.message); }
  };

  return (
    <section style={{
      background: COLORS.white,
      border: RULE,
      borderTop: `3px solid ${COLORS.accent2}`,
      padding: SPACING.lg,
      marginBottom: SPACING.lg,
    }}>
      <h2 style={{
        margin: `0 0 ${SPACING.md}px`, fontSize: 24, color: COLORS.ink,
        fontWeight: FONT.weight.bold, letterSpacing: '-0.3px',
      }}>
        여러 회사 지원을 동시에 관리하세요
      </h2>

      {/* 경고 안내 박스 */}
      <div style={{
        background: COLORS.yellowBg,
        borderLeft: `3px solid ${COLORS.yellow}`,
        padding: SPACING.md,
        marginBottom: SPACING.md,
      }}>
        <p style={{
          margin: 0, fontSize: 20, color: COLORS.yellow,
          fontWeight: FONT.weight.semibold, letterSpacing: 1.5, textTransform: 'uppercase',
        }}>
          꼭 파일로 백업해두세요
        </p>
        <p style={{
          margin: '6px 0 0', fontSize: 20, color: COLORS.ink,
          lineHeight: FONT.lineHeight.base,
        }}>
          저장본은 <strong>이 브라우저에만</strong> 저장됩니다.
          다른 기기에서 열거나 캐시를 지우면 사라지니, <strong>[전체 저장본 백업]</strong>으로 파일을 받아두십시오.
          그 파일을 [저장본 백업 불러오기]에 올리면 그대로 복원됩니다.
        </p>
      </div>

      {/* 새 저장본 입력 + 저장 */}
      <div style={{ display: 'flex', gap: SPACING.sm, marginBottom: SPACING.md, flexWrap: 'wrap' }}>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder={master.profile.company || '저장본 이름 (예: 삼성전자_공정엔지니어)'}
          style={{
            flex: '1 1 200px',
            fontFamily: FONT.family, fontSize: 20, color: COLORS.ink,
            padding: '10px 12px', border: `1px solid ${COLORS.line}`,
            background: COLORS.cream, outline: 'none',
          }}
        />
        <button onClick={handleSave} style={btnPrimary}>현재 작업을 저장본에 저장</button>
      </div>

      {/* 백업/복원 영역 */}
      <div style={{ display: 'flex', gap: SPACING.sm, marginBottom: SPACING.md, flexWrap: 'wrap' }}>
        <button onClick={handleExportAll} style={btnSecondary} disabled={slots.length === 0}>
          전체 저장본 백업 (.json)
        </button>
        <button onClick={handleImportClick} style={btnSecondary}>
          저장본 백업 불러오기
        </button>
        <input
          ref={importRef} type="file" accept=".json,application/json"
          onChange={handleImportFile} style={{ display: 'none' }}
        />
      </div>

      {/* 저장본 목록 */}
      {slots.length === 0 ? (
        <p style={{ margin: 0, color: COLORS.sub, fontSize: 20 }}>
          저장된 저장본이 없습니다. 위 입력란에 이름을 적고 저장하세요.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.sm }}>
          {slots.map((s) => (
            <div key={s.name} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              gap: SPACING.md, flexWrap: 'wrap',
              padding: SPACING.md, background: COLORS.cream,
              borderLeft: `3px solid ${COLORS.accent2}`,
            }}>
              <div>
                <p style={{ margin: 0, fontSize: 20, fontWeight: FONT.weight.semibold, color: COLORS.ink }}>
                  {s.name}
                </p>
                <p style={{ margin: '2px 0 0', fontSize: 20, color: COLORS.sub }}>
                  {[s.industry, s.position, s.company].filter(Boolean).join(' / ') || '(빈 프로필)'}
                  {s.savedAt && ` · ${new Date(s.savedAt).toLocaleString('ko-KR')}`}
                </p>
              </div>
              <div style={{ display: 'flex', gap: SPACING.xs, flexWrap: 'wrap' }}>
                <button onClick={() => handleLoad(s.name)} style={btnSecondary}>불러오기</button>
                <button onClick={() => handleSlotExport(s.name)} style={btnSecondary}>이 저장본 .json</button>
                <button onClick={() => handleDelete(s.name)} style={btnDanger}>삭제</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {toast && (
        <div style={{
          position: 'fixed', bottom: SPACING.lg, left: '50%', transform: 'translateX(-50%)',
          background: COLORS.accent, color: COLORS.white,
          padding: `${SPACING.sm}px ${SPACING.md}px`,
          fontFamily: FONT.family, fontSize: 20,
          boxShadow: '0 6px 18px rgba(0,0,0,0.18)', zIndex: 1100,
          display: 'flex', gap: SPACING.md, alignItems: 'center', maxWidth: '90vw',
        }}>
          <span style={{ flex: 1 }}>{toast}</span>
          <button onClick={() => setToast(null)} style={{ background: 'transparent', border: 'none', color: COLORS.accent2, cursor: 'pointer', fontWeight: FONT.weight.semibold, fontFamily: FONT.family }}>닫기</button>
        </div>
      )}
    </section>
  );
}

const btnBase = {
  fontFamily: FONT.family, fontSize: 20, fontWeight: FONT.weight.semibold,
  padding: '8px 14px', cursor: 'pointer',
};
const btnPrimary = { ...btnBase, background: COLORS.accent2, color: COLORS.white, border: 'none' };
const btnSecondary = { ...btnBase, background: COLORS.white, color: COLORS.accent, border: `1px solid ${COLORS.accent}` };
const btnDanger = { ...btnBase, background: COLORS.white, color: COLORS.red, border: `1px solid ${COLORS.red}` };
