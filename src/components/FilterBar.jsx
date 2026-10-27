import { TASK_TYPES } from '../lib/constants';

export const NO_FILTERS = { assignee: 'all', type: 'all' };

// Keeps the tasks that match the chosen person and type (FR21).
export function applyFilters(tasks, filters) {
  return tasks.filter((task) => {
    if (filters.assignee === 'unassigned' && task.assigneeId) return false;
    if (filters.assignee !== 'all' && filters.assignee !== 'unassigned' && task.assigneeId !== filters.assignee) return false;
    if (filters.type !== 'all' && task.type !== filters.type) return false;
    return true;
  });
}

const selectClass = 'mt-1 block min-h-[40px] rounded-md border border-slate-400 bg-white px-2 text-sm';

// Filter controls above the board. Changes apply instantly and can be cleared in one click (FR21).
export default function FilterBar({ filters, onChange, members, currentUserId, shown, total }) {
  const active = filters.assignee !== 'all' || filters.type !== 'all';
  const set = (field) => (event) => onChange({ ...filters, [field]: event.target.value });
  const mine = filters.assignee === currentUserId;

  return (
    <div role="group" aria-labelledby="filter-heading" className="mb-4 flex flex-wrap items-end gap-3">
      <h3 id="filter-heading" className="sr-only">
        Filter tasks
      </h3>

      {/* A toggle button: aria-pressed tells screen readers whether it is on or off. */}
      <button
        type="button"
        aria-pressed={mine}
        onClick={() => onChange({ ...filters, assignee: mine ? 'all' : currentUserId })}
        className={`min-h-[40px] rounded-md border-2 px-4 text-sm font-bold ${
          mine ? 'border-brand bg-brand text-white' : 'border-brand bg-white text-brand hover:bg-brand-soft'
        }`}
      >
        My tasks
      </button>

      <div>
        <label htmlFor="filter-assignee" className="block text-sm font-bold">
          Person
        </label>
        <select id="filter-assignee" value={filters.assignee} onChange={set('assignee')} className={selectClass}>
          <option value="all">Everyone</option>
          <option value="unassigned">Unassigned</option>
          {members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="filter-type" className="block text-sm font-bold">
          Type
        </label>
        <select id="filter-type" value={filters.type} onChange={set('type')} className={selectClass}>
          <option value="all">All types</option>
          {Object.values(TASK_TYPES).map((type) => (
            <option key={type.id} value={type.id}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {active && (
        <button
          type="button"
          onClick={() => onChange(NO_FILTERS)}
          className="min-h-[40px] rounded-md px-3 text-sm font-bold text-brand underline underline-offset-2 hover:bg-brand-soft"
        >
          Clear filters
        </button>
      )}

      {/* Announced when the number of shown tasks changes. */}
      <p role="status" className="ml-auto text-sm text-ink-muted">
        {active ? `Showing ${shown} of ${total} tasks` : `${total} tasks`}
      </p>
    </div>
  );
}
