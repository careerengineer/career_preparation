import { DEFAULT_MASTER, APP_VERSION } from './schema';

const FORMAT_TAG = 'careerengineer-export';

function checksum(obj) {
  const str = JSON.stringify(obj);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString(16);
}

export function exportToFile(master) {
  const payload = {
    format: FORMAT_TAG,
    version: 1,
    appVersion: APP_VERSION,
    exportedAt: new Date().toISOString(),
    data: master,
  };
  payload.checksum = checksum(payload.data);

  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: 'application/json' });

  const safe = (s) => (s || '').replace(/[^가-힣a-zA-Z0-9]/g, '_').slice(0, 20);
  const ind = safe(master.profile.industry) || 'backup';
  const pos = safe(master.profile.position);
  const date = new Date().toISOString().slice(0, 10);
  const filename = pos
    ? `careerengineer_${ind}_${pos}_${date}.json`
    : `careerengineer_${ind}_${date}.json`;

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);

  return filename;
}

export function parseImportFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);

        if (parsed.format !== FORMAT_TAG) {
          return reject(new Error('CareerEngineer 백업 파일이 아닙니다.'));
        }
        if (!parsed.data || typeof parsed.data !== 'object') {
          return reject(new Error('파일 형식이 손상되었습니다.'));
        }
        if (parsed.checksum) {
          const expected = checksum(parsed.data);
          if (expected !== parsed.checksum) {
            return reject(new Error('파일이 손상되었습니다 (체크섬 불일치).'));
          }
        }
        if (parsed.version > 1) {
          return reject(new Error('이 백업 파일은 더 새로운 버전입니다. 앱을 업데이트해주세요.'));
        }

        const merged = mergeWithDefaults(parsed.data);
        resolve({
          data: merged,
          meta: {
            exportedAt: parsed.exportedAt,
            appVersion: parsed.appVersion,
          },
        });
      } catch (e) {
        reject(new Error('JSON 파싱 실패: ' + e.message));
      }
    };
    reader.onerror = () => reject(new Error('파일을 읽을 수 없습니다.'));
    reader.readAsText(file);
  });
}

function mergeWithDefaults(data) {
  return {
    ...DEFAULT_MASTER,
    ...data,
    profile: { ...DEFAULT_MASTER.profile, ...(data.profile || {}) },
    roadmap: { ...DEFAULT_MASTER.roadmap, ...(data.roadmap || {}) },
    careergoal: { ...DEFAULT_MASTER.careergoal, ...(data.careergoal || {}) },
    jobAnalysis: { ...DEFAULT_MASTER.jobAnalysis, ...(data.jobAnalysis || {}) },
    experiences: Array.isArray(data.experiences) ? data.experiences : [],
    outputs: { ...DEFAULT_MASTER.outputs, ...(data.outputs || {}) },
    workbookRaw: { ...DEFAULT_MASTER.workbookRaw, ...(data.workbookRaw || {}) },
  };
}

export function detectConflicts(currentMaster, incomingMaster) {
  const conflicts = [];

  if (
    currentMaster.profile.industry &&
    currentMaster.profile.industry !== incomingMaster.profile.industry
  ) {
    conflicts.push({
      field: 'profile.industry',
      current: currentMaster.profile.industry,
      incoming: incomingMaster.profile.industry,
    });
  }
  if (
    currentMaster.profile.position &&
    currentMaster.profile.position !== incomingMaster.profile.position
  ) {
    conflicts.push({
      field: 'profile.position',
      current: currentMaster.profile.position,
      incoming: incomingMaster.profile.position,
    });
  }
  if (currentMaster.experiences.length > 0 && incomingMaster.experiences.length > 0) {
    conflicts.push({
      field: 'experiences',
      current: `${currentMaster.experiences.length}개`,
      incoming: `${incomingMaster.experiences.length}개`,
    });
  }
  Object.keys(incomingMaster.outputs || {}).forEach((k) => {
    const cur = currentMaster.outputs[k]?.finalText;
    const inc = incomingMaster.outputs[k]?.finalText;
    if (cur && inc && cur !== inc) {
      conflicts.push({ field: `outputs.${k}`, current: '작성됨', incoming: '작성됨' });
    }
  });

  return conflicts;
}
