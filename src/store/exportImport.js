import { DEFAULT_MASTER, APP_VERSION, mergeWithDefaults } from './schema';

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

function safeName(s) {
  return (s || '').replace(/[^가-힣a-zA-Z0-9]/g, '_').slice(0, 20);
}

function timestampPart() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}`;
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
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

  const co  = safeName(master.profile.company);
  const ind = safeName(master.profile.industry) || 'backup';
  const pos = safeName(master.profile.position);
  const ts = timestampPart();
  const parts = ['careerengineer', co, ind, pos].filter(Boolean);
  const filename = `${parts.join('_')}_${ts}.json`;

  triggerDownload(blob, filename);
  return filename;
}

// 단일 워크북 .json export는 docExport.exportWorkbookDocx로 대체됨 (사용 안 함)

export function parseImportFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);

        // 워크북 단일 백업도 받기 (호환)
        if (parsed.format === 'careerengineer-workbook-export') {
          return resolve({ workbookOnly: true, parsed });
        }

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
