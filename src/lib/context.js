import { STAGES, TASK_TYPES } from './constants';

const longDate = (iso) =>
  new Date(iso.length === 10 ? `${iso}T00:00:00` : iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

/**
 * Turns a task into a Markdown briefing that reads cleanly when pasted into any AI chat (FR18).
 */
export function buildContextMarkdown(task, assignee) {
  const status = STAGES.find((s) => s.id === task.status)?.label ?? task.status;
  const type = TASK_TYPES[task.type]?.label ?? task.type;
  const context = task.context ?? {};

  const lines = [
    `# ${task.title}`,
    '',
    `- **Type:** ${type}`,
    `- **Status:** ${status}`,
    `- **Assignee:** ${assignee?.name ?? 'Unassigned'}`,
  ];
  if (task.dueDate) lines.push(`- **Due:** ${longDate(task.dueDate)}`);

  lines.push('', '## Description', task.description?.trim() || 'No description yet.', '', '## Context');

  const meta = [];
  if (context.tool) meta.push(`last worked on with ${context.tool}`);
  if (context.updatedAt) meta.push(`updated ${longDate(context.updatedAt)}`);
  if (meta.length) lines.push(`_${meta.join(', ').replace(/^./, (c) => c.toUpperCase())}._`, '');

  lines.push(context.body?.trim() || 'No context written yet.');
  lines.push('', '---', 'I am continuing this task. Use the details above to pick up where it was left off.');

  return lines.join('\n');
}
