import { useEffect, useRef, useState } from 'react';
import CopyContextButton from './CopyContextButton';
import TypeBadge from './TypeBadge';
import { AI_TOOLS, CONTEXT_TEMPLATE, STAGES, TASK_TYPES } from '../lib/constants';
import { nowISO, timeAgo } from '../lib/utils';

const inputClass =
  'mt-1 block w-full rounded-md border border-slate-400 bg-white px-3 py-2 text-base text-ink placeholder:text-slate-500';
const labelClass = 'block font-bold';

// The add / edit task form shown inside the modal (FR8, FR9, FR10, FR11, FR17).
export default function TaskForm({ task, members, onSave, onCancel, onDelete }) {
  const [values, setValues] = useState({
    title: task?.title ?? '',
    description: task?.description ?? '',
    type: task?.type ?? 'feature',
    status: task?.status ?? 'todo',
    assigneeId: task?.assigneeId ?? '',
    dueDate: task?.dueDate ?? '',
    contextBody: task?.context?.body ?? CONTEXT_TEMPLATE,
    contextTool: task?.context?.tool ?? '',
  });
  const [error, setError] = useState('');
  const titleRef = useRef(null);

  // Deleting asks for confirmation first (FR10, NFR17).
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const keepButtonRef = useRef(null);
  useEffect(() => {
    if (confirmingDelete) keepButtonRef.current?.focus();
  }, [confirmingDelete]);

  function update(field) {
    return (event) => setValues((v) => ({ ...v, [field]: event.target.value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const title = values.title.trim();

    if (!title) {
      setError('Enter a title for the task.');
      titleRef.current?.focus();
      return;
    }

    // Stamp the context with the time only when it actually changed (FR17).
    const oldContext = task?.context;
    const contextChanged =
      !oldContext || oldContext.body !== values.contextBody || (oldContext.tool ?? '') !== values.contextTool;

    const { contextBody, contextTool, ...rest } = values;
    onSave({
      ...rest,
      title,
      description: values.description.trim(),
      assigneeId: values.assigneeId || null,
      dueDate: values.dueDate || null,
      context: {
        body: contextBody,
        tool: contextTool || null,
        updatedAt: contextChanged ? nowISO() : oldContext.updatedAt,
      },
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div>
        <label htmlFor="task-title" className={labelClass}>
          Title <span className="font-normal text-ink-muted">(required)</span>
        </label>
        <input
          id="task-title"
          ref={titleRef}
          type="text"
          value={values.title}
          onChange={update('title')}
          maxLength={100}
          autoFocus
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? 'task-title-error' : undefined}
          className={`${inputClass} ${error ? 'border-bug ring-1 ring-bug' : ''}`}
        />
        {error && (
          <p id="task-title-error" className="mt-1 text-sm font-bold text-bug">
            {error}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="task-description" className={labelClass}>
          Description
        </label>
        <textarea
          id="task-description"
          rows={3}
          value={values.description}
          onChange={update('description')}
          maxLength={2000}
          className={inputClass}
        />
      </div>

      <fieldset>
        <legend className={labelClass}>Type</legend>
        <div className="mt-1 flex gap-3">
          {Object.values(TASK_TYPES).map((type) => (
            <label
              key={type.id}
              className="flex min-h-[44px] cursor-pointer items-center gap-2 rounded-md border border-slate-400 px-4 has-[:checked]:border-brand has-[:checked]:bg-brand-soft"
            >
              <input
                type="radio"
                name="task-type"
                value={type.id}
                checked={values.type === type.id}
                onChange={update('type')}
                className="h-4 w-4 accent-brand"
              />
              <TypeBadge type={type.id} />
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="task-status" className={labelClass}>
            Status
          </label>
          <select id="task-status" value={values.status} onChange={update('status')} className={inputClass}>
            {STAGES.map((stage) => (
              <option key={stage.id} value={stage.id}>
                {stage.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="task-assignee" className={labelClass}>
            Assignee
          </label>
          <select id="task-assignee" value={values.assigneeId} onChange={update('assigneeId')} className={inputClass}>
            <option value="">Unassigned</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="task-due" className={labelClass}>
            Due date
          </label>
          <input id="task-due" type="date" value={values.dueDate} onChange={update('dueDate')} className={inputClass} />
        </div>
      </div>

      <fieldset className="rounded-lg border border-slate-300 p-4">
        <legend className="px-1 text-lg font-bold">Context</legend>
        <p id="context-help" className="mb-3 text-sm text-ink-muted">
          A briefing for the next teammate or AI tool: what you were trying to do, what got in the way, and where to
          pick up. Markdown works here.
        </p>

        <label htmlFor="task-context" className={labelClass}>
          Context notes
        </label>
        <textarea
          id="task-context"
          rows={8}
          value={values.contextBody}
          onChange={update('contextBody')}
          maxLength={10000}
          aria-describedby="context-help context-updated"
          className={`${inputClass} font-mono text-sm`}
        />

        <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <label htmlFor="task-context-tool" className={labelClass}>
              AI tool used <span className="font-normal text-ink-muted">(optional)</span>
            </label>
            <select
              id="task-context-tool"
              value={values.contextTool}
              onChange={update('contextTool')}
              className={`${inputClass} w-auto`}
            >
              <option value="">Not set</option>
              {AI_TOOLS.map((tool) => (
                <option key={tool} value={tool}>
                  {tool}
                </option>
              ))}
            </select>
          </div>
          <CopyContextButton
            task={{
              title: values.title.trim() || 'Untitled task',
              description: values.description,
              type: values.type,
              status: values.status,
              dueDate: values.dueDate || null,
              context: { body: values.contextBody, tool: values.contextTool || null, updatedAt: task?.context?.updatedAt },
            }}
            assignee={members.find((m) => m.id === values.assigneeId)}
          />
        </div>
        <div className="mt-2 flex justify-end">
          <p id="context-updated" className="text-sm text-ink-muted">
            {task?.context?.updatedAt ? (
              <>
                Last updated <time dateTime={task.context.updatedAt}>{timeAgo(task.context.updatedAt)}</time>
              </>
            ) : (
              'Not updated yet'
            )}
          </p>
        </div>
      </fieldset>

      {confirmingDelete ? (
        <div role="group" aria-labelledby="delete-confirm-text" className="mt-2 rounded-lg border-2 border-bug bg-bug-soft p-4">
          <p id="delete-confirm-text" className="mb-3 font-bold">
            Delete this task? This cannot be undone.
          </p>
          <div className="flex flex-wrap justify-end gap-3">
            <button
              ref={keepButtonRef}
              type="button"
              onClick={() => setConfirmingDelete(false)}
              className="min-h-[44px] rounded-md border border-slate-400 bg-white px-4 font-bold hover:bg-slate-100"
            >
              Keep task
            </button>
            <button
              type="button"
              onClick={() => onDelete(task)}
              className="min-h-[44px] rounded-md bg-bug px-5 font-bold text-white hover:bg-red-800"
            >
              Yes, delete task
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-2 flex flex-wrap items-center gap-3">
          {task && onDelete && (
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              className="min-h-[44px] rounded-md px-3 font-bold text-bug underline-offset-4 hover:underline"
            >
              Delete task
            </button>
          )}
          <div className="ml-auto flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="min-h-[44px] rounded-md border border-slate-400 bg-white px-4 font-bold hover:bg-slate-100"
            >
              Cancel
            </button>
            <button type="submit" className="min-h-[44px] rounded-md bg-brand px-5 font-bold text-white hover:bg-brand-hover">
              {task ? 'Save changes' : 'Add task'}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
