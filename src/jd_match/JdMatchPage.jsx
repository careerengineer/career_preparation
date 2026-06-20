import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDataStore } from '../store/DataContext.jsx';
import { parseImportFile } from '../store/exportImport.js';
import { buildMatchReport, SECTION_LABELS } from './matchEngine.js';
import { buildLlmPrompt, parseLlmResult } from './llmBridge.js';
import { exportMatchReportDocx } from './reportDocx.js';
import { CEMark } from '../shared/components/CELogo.jsx';
import { COLORS, FONT, RADIUS, RULE } from '../shared/design/tokens.js';

const SP = (n) => n * 8;

const PLACEHOLDER = `예시)\n[주요업무]\n- 백엔드 API 설계 및 개발\n- 데이터베이스 스키마 설계\n\n[자격요건]\n- Java/Spring 기반 개발 경험 2년 이상\n- RESTful API 설계 경험\n\n[우대사항]\n- AWS 등 클라우드 환경 운영 경험\n- 대용량 트래픽 처리 경험`;

function sectionStyle() {
  return {
    background: COLORS.white,
    border: RULE,
    borderRadius: RADIUS.lg,
    padding: SP(3),
    marginBottom: SP(3),
  };
}

function labelStyle() {
  return {
    display: 'block',
    fontFamily: FONT.family,
    fontWeight: 700,
    color: COLORS.ink,
    marginBottom: SP(1),
  };
}

export default function JdMatchPage() {
  const { master, listCompanySlots, getCompanySlotMaster } = useDataStore();
  const slots = useMemo(() => listCompanySlots(), [listCompanySlots]);

  const [source, setSource] = useState('current');
  const [importedMaster, setImportedMaster] = useState(null);
  const [importedFileName, setImportedFileName] = useState('');
  const [jdText, setJdText] = useState('');
  const [company, setCompany] = useState('');
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const [llmPrompt, setLlmPrompt] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const [llmResultText, setLlmResultText] = useState('');
  const [llmError, setLlmError] = useState('');

  const activeMaster = useMemo(() => {
    if (source === 'current') return master;
    if (source === 'imported') return importedMaster || master;
    try {
      return getCompanySlotMaster(source);
    } catch {
      return master;
    }
  }, [source, master, importedMaster, getCompanySlotMaster]);

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    parseImportFile(file)
      .then((res) => {
        if (res.workbookOnly) {
          setError('단일 워크북 백업 파일입니다. 전체 백업(.json) 파일을 불러와주세요.');
          return;
        }
        setImportedMaster(res.data);
        setImportedFileName(file.name);
        setSource('imported');
      })
      .catch((err) => setError(err.message))
      .finally(() => {
        e.target.value = '';
      });
  }

  function handleAnalyze() {
    setError('');
    if (!jdText.trim()) {
      setError('직무 상세내용을 입력해주세요.');
      return;
    }
    setBusy(true);
    try {
      const result = buildMatchReport(activeMaster, jdText);
      setReport(result);
    } catch (e) {
      setError('분석 중 오류가 발생했습니다. 입력 내용을 확인해주세요.');
    } finally {
      setBusy(false);
    }
  }

  function handleDownload() {
    if (!report) return;
    exportMatchReportDocx(report, { company: company.trim() || '지원기업' });
  }

  function handleBuildPrompt() {
    setLlmError('');
    if (!jdText.trim()) {
      setLlmError('직무 상세내용을 먼저 입력해주세요.');
      return;
    }
    const prompt = buildLlmPrompt(activeMaster, jdText, { company: company.trim() });
    setLlmPrompt(prompt);
    if (navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(prompt)
        .then(() => setCopyStatus('클립보드에 복사되었습니다. claude.ai에 붙여넣어 실행해주세요.'))
        .catch(() => setCopyStatus('클립보드 복사에 실패했습니다. 아래 텍스트를 직접 복사해주세요.'));
    } else {
      setCopyStatus('아래 텍스트를 직접 복사해주세요.');
    }
  }

  function handleApplyLlmResult() {
    setLlmError('');
    if (!llmResultText.trim()) {
      setLlmError('클로드가 응답한 결과를 붙여넣어주세요.');
      return;
    }
    try {
      const parsed = parseLlmResult(llmResultText);
      setReport(parsed);
    } catch (e) {
      setLlmError(e.message);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: COLORS.bg }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: COLORS.white,
          borderBottom: RULE,
          padding: `${SP(2)}px ${SP(3)}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: SP(1.5) }}>
          <CEMark size={28} />
          <span style={{ fontFamily: FONT.family, fontWeight: 700, color: COLORS.ink }}>
            직무 매칭 리포트
          </span>
        </div>
        <Link
          to="/"
          style={{
            fontFamily: FONT.family,
            fontSize: 13,
            color: COLORS.sub,
            textDecoration: 'none',
          }}
        >
          ← 대시보드로 돌아가기
        </Link>
      </div>

      <div style={{ maxWidth: 820, margin: '0 auto', padding: SP(3) }}>
        <p style={{ fontFamily: FONT.family, color: COLORS.sub, fontSize: 14, marginBottom: SP(3) }}>
          작성하신 경험과 자소서 내용을 기반으로, 입력한 직무 상세내용의 각 요건에 어필할 수 있는
          내용을 매칭하여 문서로 만들어 드립니다.
        </p>

        <div style={sectionStyle()}>
          <label style={labelStyle()}>데이터 소스</label>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            style={{
              width: '100%',
              padding: SP(1),
              borderRadius: RADIUS.md,
              border: RULE,
              fontFamily: FONT.family,
              fontSize: 14,
              marginBottom: SP(1.5),
            }}
          >
            <option value="current">현재 작성중인 데이터</option>
            {importedMaster && (
              <option value="imported">불러온 파일: {importedFileName}</option>
            )}
            {slots.map((slot) => (
              <option key={slot.name} value={slot.name}>
                저장된 기업: {slot.name}
                {slot.company ? ` (${slot.company})` : ''}
              </option>
            ))}
          </select>

          <label style={{ ...labelStyle(), fontWeight: 500, fontSize: 13, color: COLORS.sub }}>
            또는 외부에서 작성한 백업 파일(.json) 불러오기
          </label>
          <input
            type="file"
            accept=".json,application/json"
            onChange={handleFileChange}
            style={{
              width: '100%',
              fontFamily: FONT.family,
              fontSize: 13,
              color: COLORS.sub,
            }}
          />
          <p style={{ margin: `${SP(0.5)}px 0 0`, fontFamily: FONT.family, fontSize: 12, color: COLORS.sub }}>
            대시보드 상단의 "내보내기"로 받은 전체 백업(.json) 파일을 그대로 불러올 수 있습니다.
            다른 사람이 작성한 워크북 데이터를 받아 분석할 때 사용하세요.
          </p>
        </div>

        <div style={sectionStyle()}>
          <label style={labelStyle()}>기업/직무명 (선택)</label>
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="예) 카카오 백엔드 개발자"
            style={{
              width: '100%',
              padding: SP(1),
              borderRadius: RADIUS.md,
              border: RULE,
              fontFamily: FONT.family,
              fontSize: 14,
              marginBottom: SP(2),
              boxSizing: 'border-box',
            }}
          />

          <label style={labelStyle()}>직무 상세내용</label>
          <textarea
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder={PLACEHOLDER}
            rows={12}
            style={{
              width: '100%',
              padding: SP(1.5),
              borderRadius: RADIUS.md,
              border: RULE,
              fontFamily: FONT.family,
              fontSize: 14,
              boxSizing: 'border-box',
              resize: 'vertical',
            }}
          />

          {error && (
            <p style={{ color: COLORS.red, fontFamily: FONT.family, fontSize: 13, marginTop: SP(1) }}>
              {error}
            </p>
          )}

          <button
            onClick={handleAnalyze}
            disabled={busy}
            style={{
              marginTop: SP(2),
              padding: `${SP(1.25)}px ${SP(3)}px`,
              background: COLORS.ink,
              color: COLORS.white,
              border: 'none',
              borderRadius: RADIUS.md,
              fontFamily: FONT.family,
              fontWeight: 700,
              fontSize: 14,
              cursor: busy ? 'default' : 'pointer',
            }}
          >
            {busy ? '분석 중...' : '매칭 분석하기 (자동)'}
          </button>
        </div>

        <div style={sectionStyle()}>
          <label style={labelStyle()}>AI(클로드) 고도화 매칭 — 수동 연동</label>
          <p style={{ margin: `0 0 ${SP(1.5)}px`, fontFamily: FONT.family, fontSize: 13, color: COLORS.sub, lineHeight: 1.6 }}>
            기존 Claude 구독이 있다면, 아래 프롬프트를 생성해 claude.ai에 붙여넣고 실행한 뒤,
            그 결과를 다시 붙여넣어 더 정교한 매칭 리포트를 만들 수 있습니다. API 키나 서버가 필요 없습니다.
          </p>

          <button
            onClick={handleBuildPrompt}
            style={{
              padding: `${SP(1)}px ${SP(2)}px`,
              background: COLORS.white,
              color: COLORS.ink,
              border: `1px solid ${COLORS.accent}`,
              borderRadius: RADIUS.md,
              fontFamily: FONT.family,
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
              marginBottom: SP(1.5),
            }}
          >
            1. 프롬프트 생성 + 클립보드 복사
          </button>

          {copyStatus && (
            <p style={{ fontFamily: FONT.family, fontSize: 12, color: COLORS.sub, marginBottom: SP(1) }}>
              {copyStatus}
            </p>
          )}

          {llmPrompt && (
            <textarea
              readOnly
              value={llmPrompt}
              rows={6}
              style={{
                width: '100%',
                padding: SP(1),
                borderRadius: RADIUS.md,
                border: RULE,
                fontFamily: FONT.mono,
                fontSize: 12,
                boxSizing: 'border-box',
                marginBottom: SP(2),
                color: COLORS.sub,
              }}
            />
          )}

          <label style={labelStyle()}>2. claude.ai에서 실행한 결과(JSON)를 붙여넣기</label>
          <textarea
            value={llmResultText}
            onChange={(e) => setLlmResultText(e.target.value)}
            placeholder="클로드가 응답한 JSON 결과를 여기에 붙여넣으세요."
            rows={8}
            style={{
              width: '100%',
              padding: SP(1.5),
              borderRadius: RADIUS.md,
              border: RULE,
              fontFamily: FONT.mono,
              fontSize: 12,
              boxSizing: 'border-box',
              resize: 'vertical',
            }}
          />

          {llmError && (
            <p style={{ color: COLORS.red, fontFamily: FONT.family, fontSize: 13, marginTop: SP(1) }}>
              {llmError}
            </p>
          )}

          <button
            onClick={handleApplyLlmResult}
            style={{
              marginTop: SP(2),
              padding: `${SP(1.25)}px ${SP(3)}px`,
              background: COLORS.accent2,
              color: COLORS.ink,
              border: 'none',
              borderRadius: RADIUS.md,
              fontFamily: FONT.family,
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            결과 적용하기
          </button>
        </div>

        {report && (
          <div style={sectionStyle()}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: SP(2),
              }}
            >
              <span style={{ fontFamily: FONT.family, fontWeight: 700, color: COLORS.ink }}>
                분석 결과 (경험/자소서 {report.candidateCount}건 분석)
              </span>
              <button
                onClick={handleDownload}
                style={{
                  padding: `${SP(1)}px ${SP(2)}px`,
                  background: COLORS.accent2,
                  color: COLORS.ink,
                  border: 'none',
                  borderRadius: RADIUS.md,
                  fontFamily: FONT.family,
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                문서 다운로드 (.docx)
              </button>
            </div>

            {report.sections.map((section) =>
              section.items.length === 0 ? null : (
                <div key={section.key} style={{ marginBottom: SP(3) }}>
                  <h3
                    style={{
                      fontFamily: FONT.family,
                      color: COLORS.ink,
                      borderBottom: `2px solid ${COLORS.accent2}`,
                      paddingBottom: SP(0.5),
                      marginBottom: SP(1.5),
                    }}
                  >
                    {SECTION_LABELS[section.key] || section.key}
                  </h3>
                  {section.items.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        marginBottom: SP(2),
                        paddingBottom: SP(2),
                        borderBottom: idx < section.items.length - 1 ? RULE : 'none',
                      }}
                    >
                      <p style={{ fontFamily: FONT.family, fontWeight: 700, color: COLORS.ink, marginBottom: SP(1) }}>
                        {idx + 1}. {item.requirement}
                      </p>
                      {item.matches.length === 0 ? (
                        <p style={{ fontFamily: FONT.family, color: COLORS.sub, fontSize: 13, fontStyle: 'italic' }}>
                          매칭된 경험/자소서를 찾지 못했습니다.
                        </p>
                      ) : (
                        item.matches.map((m, mi) => (
                          <div key={mi} style={{ marginBottom: SP(1), paddingLeft: SP(1.5) }}>
                            <p style={{ fontFamily: FONT.family, fontSize: 13, color: COLORS.accent2, fontWeight: 700 }}>
                              [{m.score}% 일치] {m.label}
                            </p>
                            <p style={{ fontFamily: FONT.family, fontSize: 13, color: COLORS.sub }}>{m.appeal}</p>
                          </div>
                        ))
                      )}
                    </div>
                  ))}
                </div>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}
