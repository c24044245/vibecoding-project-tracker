// Small helper functions used across the app.

// A random, non-guessable ID (UUID v4) for every record (DR1–DR3).
export function createId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers.
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

// Current date-time as an ISO 8601 string, e.g. "2026-10-27T09:00:00.000Z".
export function nowISO() {
  return new Date().toISOString();
}

// A date `days` from today as "YYYY-MM-DD" (negative numbers go back in time).
export function dateFromToday(days = 0) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

// "2026-10-29" -> "29 Oct". Returns an empty string for no date.
export function formatShortDate(isoDate) {
  if (!isoDate) return '';
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

// "Priya Shah" -> "PS"
export function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

// "2026-10-27T09:00:00Z" -> "just now", "5 min ago", "2 h ago", "3 days ago".
export function timeAgo(isoDateTime, now = new Date()) {
  if (!isoDateTime) return '';
  const seconds = Math.round((now - new Date(isoDateTime)) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}
