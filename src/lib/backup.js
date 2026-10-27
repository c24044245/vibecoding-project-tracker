// Export / import the board as a JSON file (FR26). Lets a team move a board between browsers,
// since everything else is stored only in this browser.

const APP_ID = 'vibe-tracker';
const SCHEMA_VERSION = 1;

export function buildBackup({ tasks, members, deliverables }) {
  return JSON.stringify(
    { app: APP_ID, schemaVersion: SCHEMA_VERSION, exportedAt: new Date().toISOString(), members, tasks, deliverables },
    null,
    2,
  );
}

// Returns { ok: true, data } or { ok: false, error } with a message a person can act on.
export function parseBackup(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return { ok: false, error: 'This file is not a Vibe Tracker backup. Choose a .json file exported from this app.' };
  }
  if (data?.app !== APP_ID || !Array.isArray(data.tasks) || !Array.isArray(data.members)) {
    return { ok: false, error: 'This file is not a Vibe Tracker backup. Choose a .json file exported from this app.' };
  }
  const tasksValid = data.tasks.every((t) => t && typeof t.id === 'string' && typeof t.title === 'string');
  const membersValid = data.members.every((m) => m && typeof m.id === 'string' && typeof m.name === 'string');
  if (!tasksValid || !membersValid) {
    return { ok: false, error: 'This backup is damaged: some tasks or members are missing details.' };
  }
  return { ok: true, data };
}

// Starts a download of `text` as a file in the browser.
export function downloadFile(filename, text) {
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}