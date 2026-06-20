import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDataStore } from '../store/DataContext.jsx';
import { buildMatchReport, SECTION_LABELS } from './matchEngine.js';
import { exportMatchReportDocx } from './reportDocx.js';
import { CEMark } from '../shared/components/CELogo.jsx';
import { COLORS, FONT, SPACING, RADIUS, RULE } from '../shared/design/tokens.js';

const PLACEHOLDER = `예시)\n[주요업무]\n- 백엔드 API 설계 및 개발\n- 데이터베이스 스키마 설계\n\n[자격요건]\n- Java/Spring 기반 개발 경험 2년 이상\n- RESTful API 설계 경험\n\n[우대사항]\n- AWS 등 클라우드 환경 운영 경험\n- 대용량 트래픽 처리 경험`;

function sectionStyle() {
  return {
    background: COLORS.white,
    border: RULE,
    borderRadius: RADIUS.lg,
    padding: SPACING(3),
    marginBottom: SPACING(3),
  };
}

export default function JdMatchPage() {
  const { master, listCompanySlots, getCompanySlotMaster } = useDataStore();
  const slots = useMemo(() => listCompanySlots(), [listCompanySlots]);

  const [source, setSource] = useState('current');
  const [jdText, setJdText] = useState('');
  const [company, setCompany] = useState('');
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const activeMaster = useMemo(() => {
    if (source === 'current') return master;
    const slotMaster = getCompanySlotMaster(source);
    return slotMaster || master;
  }, [source, master, getCompanySlotMaster]);

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

  return (
    <div style={{ minHeight: '100vh', background: COLORS.bg }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: COLORS.white,
          borderBottom: RULE,
          padding: `${SPACING(2)}px ${SPACING(3)}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: SPACING(1.5) }}>
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

      <div style={{ maxWidth: 820, margin: '0 auto', padding: SPACING(3) }}>
        <p style={{ fontFamily: FONT.family, color: COLORS.sub, fontSize: 14, marginBottom: SPACING(3) }}>
          작성하신 경험과 자소서 내용을 기반으로, 입력한 직무 상세내용의 각 요건에 어필할 수 있는
          내용을 매칭하여 문서로 만들어 드립니다.
        </p>

        <div style={sectionStyle()}>
          <label
            style={{
              display: 'block',
              fontFamily: FONT.family,
              fontWeight: 700,
              color: COLORS.ink,
              marginBottom: SPACING(1),
            }}
          >
            데이터 소스
          </label>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            style={{
              width: '100%',
              padding: SPACING(1),
              borderRadius: RADIUS.md,
              border: RULE,
              fontFamily: FONT.family,
              fontSize: 14,
            }}
          >
            <option value="current">현재 작성중인 데이터</option>
            {slots.map((slot) => (
              <option key={slot} value={slot}>
                저장된 기업: {slot}
              </option>
            ))}
          </select>
        </div>

        <div style={sectionStyle()}>
          <label
            style={{
              display: 'block',
              fontFamily: FONT.family,
              fontWeight: 700,
              color: COLORS.ink,
              marginBottom: SPACING(1),
            }}
          >
            기업/직무명 (선택)
          </label>
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="예) 카카오 백엔드 개발자"
            style={{
              width: '100%',
              padding: SPACING(1),
              borderRadius: RADIUS.md,
              border: RULE,
              fontFamily: FONT.family,
              fontSize: 14,
              marginBottom: SPACING(2),
              boxSizing: 'border-box',
            }}
          />

          <label
            style={{
              display: 'block',
              fontFamily: FONT.family,
              fontWeight: 700,
              color: COLORS.ink,
              marginBottom: SPACING(1),
            }}
          >
            직무 상세내용
          </label>
          <textarea
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder={PLACEHOLDER}
            rows={12}
            style={{
              width: '100%',
              padding: SPACING(1.5),
              borderRadius: RADIUS.md,
              border: RULE,
              fontFamily: FONT.family,
              fontSize: 14,
              boxSizing: 'border-box',
              resize: 'vertical',
            }}
          />

          {error && (
            <p style={{ color: COLORS.red, fontFamily: FONT.family, fontSize: 13, marginTop: SPACING(1) }}>
              {error}
            </p>
          )}

          <button
            onClick={handleAnalyze}
            disabled={busy}
            style={{
              marginTop: SPACING(2),
              padding: `${SPACING(1.25)}px ${SPACING(3)}px`,
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
            {busy ? '분석 중...' : '매칭 분석하기'}
          </button>
        </div>

        {report && (
          <div style={sectionStyle()}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: SPACING(2),
              }}
            >
              <span style={{ fontFamily: FONT.family, fontWeight: 700, color: COLORS.ink }}>
                분석 결과 (경험/자소서 {report.candidateCount}건 분석)
              </span>
              <button
                onClick={handleDownload}
                style={{
                  padding: `${SPACING(1)}px ${SPACING(2)}px`,
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
                <div key={section.key} style={{ marginBottom: SPACING(3) }}>
                  <h3
                    style={{
                      fontFamily: FONT.family,
                      color: COLORS.ink,
                      borderBottom: `2px solid ${COLORS.accent2}`,
                      paddingBottom: SPACING(0.5),
                      marginBottom: SPACING(1.5),
                    }}
                  >
                    {SECTION_LABELS[section.key] || section.key}
                  </h3>
                  {section.items.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        marginBottom: SPACING(2),
                        paddingBottom: SPACING(2),
                        borderBottom: idx < section.items.length - 1 ? RULE : 'none',
                      }}
                    >
                      <p style={{ fontFamily: FONT.family, fontWeight: 700, color: COLORS.ink, marginBottom: SPACING(1) }}>
                        {idx + 1}. {item.line}
                      </p>
                      {item.matches.length === 0 ? (
                        <p style={{ fontFamily: FONT.family, color: COLORS.sub, fontSize: 13, fontStyle: 'italic' }}>
                          매칭된 경험/자소서를 찾지 못했습니다.
                        </p>
                      ) : (
                        item.matches.map((m, mi) => (
                          <div key={mi} style={{ marginBottom: SPACING(1), paddingLeft: SPACING(1.5) }}>
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
