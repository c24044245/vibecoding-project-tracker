import { useState } from 'react';
import CopyContextButton from './CopyContextButton';
import { AlertIcon, CheckIcon, ClockIcon } from './Icons';
import TypeBadge from './TypeBadge';
import { STAGES } from '../lib/constants';
import { getDueState } from '../lib/due';
import { formatShortDate, getInitials } from '../lib/utils';

// Card tint and due-label style for each due state (FR16).
const CARD_TINT = {
  overdue: 'bg-due-overdue-soft border-due-overdue border-2',
  warning: 'bg-due-warning-soft border-due-warning-line border-2',
  done: 'bg-surface-muted border-line',
  calm: 'bg-surface-card border-line',
  none: 'bg-surface-card border-line',
};
const DUE_LABEL = {
  overdue: { Icon: AlertIcon, className: 'text-due-overdue font-bold' },
  warning: { Icon: ClockIcon, className: 'text-due-warning font-bold' },
  calm: { Icon: ClockIcon, className: 'text-due-calm' },
  done: { Icon: CheckIcon, className: 'text-ink-muted' },
};

// A single task on the board: type, title, assignee and due date are all visible at a glance (FR7).
// Clicking the card (or pressing Enter on its title button) opens it for editing (FR9).
// The "Hand off to" dropdown reassigns the task without opening it (FR14).
// The "Move to" dropdown changes column by keyboard or touch, the alternative to dragging (FR24, NFR9).
export default function TaskCard({ task, assignee, members, highlighted, onOpen, onHandOff, onMove }) {
  const due = getDueState(task);
  const [dragging, setDragging] = useState(false);

  return (
    <article
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData('text/plain', task.id);
        event.dataTransfer.effectAllowed = 'move';
        setDragging(true);
      }}
      onDragEnd={() => setDragging(false)}
      // Mouse convenience: a click anywhere on the card opens it, except on its own controls.
      // Keyboard and screen-reader users use the title button, which does the same thing.
      onClick={(event) => {
        if (!event.target.closest('button, select, a, input, label')) onOpen(task);
      }}
      className={`relative cursor-grab rounded-lg border p-3 shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing ${
        CARD_TINT[due.state]
      } ${highlighted ? 'ring-4 ring-brand-ring' : ''} ${dragging ? 'opacity-50' : ''}`}
    >
      <p className="mb-2">
        <TypeBadge type={task.type} />
      </p>

      <h4 className="mb-3 font-bold leading-snug">
        <button type="button" onClick={() => onOpen(task)} className="text-left hover:underline">
          {task.title}
        </button>
      </h4>

      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-sm">
        <Assignee person={assignee} />
        <DueLabel due={due} date={task.dueDate} />
      </div>

      <div className="mt-3 flex flex-col gap-2 border-t border-line-soft pt-3 text-sm">
        <div className="grid grid-cols-[auto_1fr] items-center gap-x-2 gap-y-2">
          <label htmlFor={`handoff-${task.id}`} className="font-bold text-ink-muted">
            Hand off to<span className="sr-only"> (task: {task.title})</span>
          </label>
          <select
            id={`handoff-${task.id}`}
            value={task.assigneeId ?? ''}
            onChange={(event) => onHandOff(task, event.target.value || null)}
            className="min-h-[36px] min-w-0 rounded-md border border-line-strong bg-surface-card px-2 text-sm"
          >
            <option value="">Unassigned</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>

          <label htmlFor={`move-${task.id}`} className="font-bold text-ink-muted">
            Move to<span className="sr-only"> (task: {task.title})</span>
          </label>
          <select
            id={`move-${task.id}`}
            value={task.status}
            onChange={(event) => onMove(task, event.target.value)}
            className="min-h-[36px] min-w-0 rounded-md border border-line-strong bg-surface-card px-2 text-sm"
          >
            {STAGES.map((stage) => (
              <option key={stage.id} value={stage.id}>
                {stage.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <CopyContextButton task={task} assignee={assignee} compact />
        </div>
      </div>
    </article>
  );
}

function DueLabel({ due, date }) {
  if (due.state === 'none') return null;
  const { Icon, className } = DUE_LABEL[due.state];
  return (
    <p className={`flex items-center gap-1 ${className}`}>
      <Icon />
      <span>
        {due.label}
        {due.state !== 'done' && (
          <span className="sr-only">
            , <time dateTime={date}>{formatShortDate(date)}</time>
          </span>
        )}
      </span>
    </p>
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
