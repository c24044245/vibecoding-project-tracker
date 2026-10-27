import { formatShortDate } from './utils';

const DAY_MS = 24 * 60 * 60 * 1000;

// Whole days from today to an ISO date ("YYYY-MM-DD"): 0 = today, 1 = tomorrow, -1 = yesterday.
function daysUntil(isoDate, today = new Date()) {
  const [y, m, d] = isoDate.split('-').map(Number);
  const due = new Date(y, m - 1, d);
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((due - start) / DAY_MS);
}

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

/**
 * Works out a task's due state from its due date and status (FR16). Derived, never stored.
 *   calm     – 2 or more days away
 *   warning  – due today or tomorrow (24–48 h counts as warning, to confirm at Q&A)
 *   overdue  – past the due date
 *   done     – task is Done: always neutral, even if it was overdue
 *   none     – no due date
 * Every state has a text label so colour is never the only signal (NFR2).
 */
export function getDueState(task, today = new Date()) {
  if (!task.dueDate) return { state: 'none', label: 'No due date' };
  if (task.status === 'done') return { state: 'done', label: `Was due ${formatShortDate(task.dueDate)}` };

  const days = daysUntil(task.dueDate, today);
  if (days < 0) return { state: 'overdue', label: `Overdue by ${plural(-days, 'day')}` };
  if (days === 0) return { state: 'warning', label: 'Due today' };
  if (days === 1) return { state: 'warning', label: 'Due tomorrow' };
  return { state: 'calm', label: `Due in ${plural(days, 'day')}` };
}
