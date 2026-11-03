import { getInitials } from '../lib/utils';

/**
 * "Who's driving what" strip (FR15): one chip per team member with how many tasks
 * they have in progress and still open. Pressing a chip filters the board to that
 * person (FR21); pressing it again shows everyone.
 */
export default function TeamStrip({ members, tasks, selectedId, onSelect }) {
  if (members.length === 0) return null;

  return (
    <section aria-labelledby="team-strip-heading" className="mb-4">
      <h3 id="team-strip-heading" className="mb-2 text-sm font-bold text-ink-muted">
        Who's driving what
      </h3>
      <ul className="flex flex-wrap gap-2">
        {members.map((member) => {
          const mine = tasks.filter((t) => t.assigneeId === member.id);
          const inProgress = mine.filter((t) => t.status === 'in-progress').length;
          const open = mine.filter((t) => t.status !== 'done').length;
          const pressed = selectedId === member.id;

          return (
            <li key={member.id}>
              <button
                type="button"
                aria-pressed={pressed}
                onClick={() => onSelect(pressed ? 'all' : member.id)}
                className={`flex min-h-[44px] items-center gap-2 rounded-full border-2 py-1 pl-1 pr-3 text-left text-sm ${
                  pressed ? 'border-brand-ink bg-brand-soft' : 'border-line bg-surface-card hover:border-brand-ink'
                }`}
              >
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-brand text-xs font-bold text-white"
                >
                  {getInitials(member.name)}
                </span>
                <span>
                  <span className="block font-bold leading-tight">{member.name}</span>
                  <span className="block text-xs text-ink-muted">
                    {inProgress} in progress · {open} open
                    <span className="sr-only">{pressed ? ', showing only their tasks' : ', press to show only their tasks'}</span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
