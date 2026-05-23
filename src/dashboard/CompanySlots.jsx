import { useEffect, useState } from 'react';
import { useDataStore } from '../store/DataContext.jsx';
import { COLORS, FONT, SPACING, RULE } from '../shared/design/tokens.js';

export default function CompanySlots() {
  const { master, saveCompanySlot, loadCompanySlot, deleteCompanySlot, listCompanySlots } = useDataStore();
  const [slots, setSlots] = useState([]);
  const [toast, setToast] = useState(null);
  const [newName, setNewName] = useState('');

  const refresh = () => setSlots(listCompanySlots());
  useEffect(() => { refresh(); /* eslint-disable-next-line */ }, []);

  const showToast = (m) => { setToast(m); setTimeout(() => setToast(null), 3500); };

  const handleSave = () => {
    const defaultName = master.profile.company || master.profile.position || '회사';
    const name = (newName.trim() || defaultName);
    if (slots.find((s) => s.name === name)) {
      if (!window.confirm(`'${name}' 슬롯이 이미 있습니다. 현재 데이터로 덮어쓸까요?`)) return;
    }
    saveCompanySlot(name);
    setNewName('');
    refresh();
    showToast(`'${name}' 슬롯에 저장했습니다.`);
  };

  const handleLoad = (name) => {
    if (!window.confirm(`'${name}' 슬롯의 데이터로 현재 작업을 교체합니다.\n현재 작업이 사라질 수 있으니, 먼저 별도 슬롯에 저장하거나 백업하세요.\n계속할까요?`)) return;
    try {
      loadCompanySlot(name);
      showToast(`'${name}' 슬롯을 불러왔습니다.`);
    } catch (e) { showToast('오류: ' + e.message); }
  };

  const handleDelete = (name) => {
    if (!window.confirm(`'${name}' 슬롯을 삭제하시겠습니까? 이 동작은 되돌릴 수 없습니다.`)) return;
    deleteCompanySlot(name);
    refresh();
    showToast(`'${name}' 슬롯을 삭제했습니다.`);
  };

  return (
    <section style={{
      background: COLORS.white,
      border: RULE,
      borderTop: `3px solid ${COLORS.accent2}`,
      padding: SPACING.lg,
      marginBottom: SPACING.lg,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: SPACING.md, marginBottom: SPACING.md }}>
        <div>
          <p style={{
            margin: 0, fontSize: FONT.size.caption, color: COLORS.accent2,
            letterSpacing: 3, fontWeight: FONT.weight.semibold, textTransform: 'uppercase',
          }}>
            SLOTS · 회사별 저장
          </p>
          <h2 style={{
            margin: '6px 0 0', fontSize: FONT.size.h3, color: COLORS.ink,
            fontWeight: FONT.weight.semibold, letterSpacing: '-0.3px',
          }}>
            여러 회사 지원을 동시에 관리하세요
          </h2>
          <p style={{
            margin: '6px 0 0', fontSize: FONT.size.caption, color: COLORS.sub,
            lineHeight: FONT.lineHeight.base,
          }}>
            현재 작업 전체를 슬롯에 저장 → 회사를 바꿔서 새 작업 진행 → 필요 시 슬롯 불러오기로 복귀.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: SPACING.sm, marginBottom: SPACING.md, flexWrap: 'wrap' }}>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder={master.profile.company || '슬롯 이름 (예: 삼성전자_공정엔지니어)'}
          style={{
            flex: '1 1 200px',
            fontFamily: FONT.family, fontSize: FONT.size.body, color: COLORS.ink,
            padding: '10px 12px', border: `1px solid ${COLORS.line}`,
            background: COLORS.cream, outline: 'none',
          }}
        />
        <button onClick={handleSave} style={btnPrimary}>현재 작업을 슬롯에 저장</button>
      </div>

      {slots.length === 0 ? (
        <p style={{ margin: 0, color: COLORS.sub, fontSize: FONT.size.caption }}>
          저장된 슬롯이 없습니다. 위 입력란에 이름을 적고 저장하세요.
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
                <p style={{ margin: 0, fontSize: FONT.size.body, fontWeight: FONT.weight.semibold, color: COLORS.ink }}>
                  {s.name}
                </p>
                <p style={{ margin: '2px 0 0', fontSize: FONT.size.caption, color: COLORS.sub }}>
                  {[s.industry, s.position, s.company].filter(Boolean).join(' / ') || '(빈 프로필)'}
                  {s.savedAt && ` · ${new Date(s.savedAt).toLocaleString('ko-KR')}`}
                </p>
              </div>
              <div style={{ display: 'flex', gap: SPACING.xs }}>
                <button onClick={() => handleLoad(s.name)} style={btnSecondary}>불러오기</button>
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
          fontFamily: FONT.family, fontSize: FONT.size.body,
          boxShadow: '0 6px 18px rgba(0,0,0,0.18)', zIndex: 1100,
          display: 'flex', gap: SPACING.md, alignItems: 'center',
        }}>
          <span>{toast}</span>
          <button onClick={() => setToast(null)} style={{ background: 'transparent', border: 'none', color: COLORS.accent2, cursor: 'pointer', fontWeight: FONT.weight.semibold }}>닫기</button>
        </div>
      )}
    </section>
  );
}

const btnBase = {
  fontFamily: FONT.family, fontSize: FONT.size.body, fontWeight: FONT.weight.semibold,
  padding: '8px 14px', cursor: 'pointer',
};
const btnPrimary = { ...btnBase, background: COLORS.accent2, color: COLORS.white, border: 'none' };
const btnSecondary = { ...btnBase, background: COLORS.white, color: COLORS.accent, border: `1px solid ${COLORS.accent}` };
const btnDanger = { ...btnBase, background: COLORS.white, color: COLORS.red, border: `1px solid ${COLORS.red}` };
