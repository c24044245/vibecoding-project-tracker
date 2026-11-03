import { CARD_TINT, DUE_LABEL } from './TaskCard';

// What the due-date colours mean (FR16), shown once above the board so nobody has to guess.
// Uses the same styles as the cards, so the key always matches them.
const ITEMS = [
  { state: 'calm', label: 'Due in 2 or more days' },
  { state: 'warning', label: 'Due today or tomorrow' },
  { state: 'overdue', label: 'Overdue' },
  { state: 'done', label: 'Done (always neutral)' },
];

export default function DueKey() {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
      <p id="due-key-heading" className="font-bold text-ink-muted">
        Due-date key:
      </p>
      <ul aria-labelledby="due-key-heading" className="flex flex-wrap gap-x-4 gap-y-2">
        {ITEMS.map(({ state, label }) => {
          const { Icon, className } = DUE_LABEL[state];
          return (
            <li key={state} className="flex items-center gap-2">
              <span aria-hidden="true" className={`h-4 w-6 rounded border ${CARD_TINT[state]}`} />
              <span className={`flex items-center gap-1 ${className}`}>
                <Icon />
                {label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
