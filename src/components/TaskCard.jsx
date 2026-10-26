import { TASK_TYPES } from '../lib/constants';
import { formatShortDate, getInitials } from '../lib/utils';

// A single task on the board: type, title, assignee and due date are all visible at a glance (FR7).
export default function TaskCard({ task, assignee }) {
  const type = TASK_TYPES[task.type] ?? TASK_TYPES.feature;

  return (
    <article className="rounded-lg border border-slate-300 bg-surface-card p-3 shadow-sm">
      <p className="mb-1 text-xs font-bold uppercase tracking-wide text-ink-muted">{type.label}</p>

      <h3 className="mb-3 font-bold leading-snug">{task.title}</h3>

      <div className="flex items-center justify-between gap-2 text-sm">
        <Assignee person={assignee} />
        {task.dueDate && (
          <p className="text-ink-muted">
            Due <time dateTime={task.dueDate}>{formatShortDate(task.dueDate)}</time>
          </p>
        )}
      </div>
    </article>
  );
}

function Assignee({ person }) {
  if (!person) {
    return <p className="text-ink-muted">Unassigned</p>;
  }
  return (
    <p className="flex items-center gap-2">
      <span
        aria-hidden="true"
        className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-xs font-bold text-white"
      >
        {getInitials(person.name)}
      </span>
      <span>{person.name}</span>
    </p>
  );
}
