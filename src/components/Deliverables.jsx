import { useState } from 'react';
import { CheckIcon, LinkIcon } from './Icons';
import { nowISO } from '../lib/utils';

/**
 * Four pinned cards for the final-project deliverables (FR19, FR20).
 * Each holds one https link; the status shows by icon AND text, not colour alone.
 */
export default function Deliverables({ deliverables, onChange }) {
  const filled = deliverables.filter((d) => d.url).length;

  return (
    <section aria-labelledby="deliverables-heading" className="mb-8">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="deliverables-heading" className="text-xl font-bold">
          Final deliverables
        </h2>
        <p className="text-sm text-ink-muted">
          {filled} of {deliverables.length} links added
        </p>
      </div>

      <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] gap-3">
        {deliverables.map((item) => (
          <li key={item.id}>
            <DeliverableCard
              item={item}
              onSave={(url) => onChange(item.id, { url, updatedAt: nowISO() })}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

function DeliverableCard({ item, onSave }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item.url ?? '');
  const [error, setError] = useState('');
  const inputId = `deliverable-${item.id}`;
  const errorId = `${inputId}-error`;

  function handleSubmit(event) {
    event.preventDefault();
    const url = draft.trim();
    if (!url) {
      onSave(null);
      setEditing(false);
      setError('');
      return;
    }
    if (!/^https:\/\/[^\s.]+\.[^\s]+$/.test(url)) {
      setError('Enter a full link starting with https://');
      return;
    }
    onSave(url);
    setEditing(false);
    setError('');
  }

  const showForm = editing || !item.url;

  return (
    <div
      className={`flex h-full flex-col gap-2 rounded-xl border-2 p-3 ${
        item.url ? 'border-feature bg-surface-card' : 'border-dashed border-line-strong bg-surface-card'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
        <h3 className="font-bold">{item.label}</h3>
        {item.url ? (
          <span className="inline-flex items-center gap-1 text-sm font-bold text-feature">
            <CheckIcon /> Link added
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-sm text-ink-muted">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full border-2 border-line-strong" /> Not added yet
          </span>
        )}
      </div>

      {showForm ? (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-2">
          <label htmlFor={inputId} className="text-sm font-bold">
            {item.label} link
          </label>
          <div className="flex gap-2">
            <input
              id={inputId}
              type="url"
              inputMode="url"
              placeholder="https://"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              aria-invalid={error ? 'true' : undefined}
              aria-describedby={error ? errorId : undefined}
              className={`min-h-[40px] min-w-0 flex-1 rounded-md border px-2 text-sm ${
                error ? 'border-bug ring-1 ring-bug' : 'border-line-strong'
              }`}
            />
            <button type="submit" className="min-h-[40px] rounded-md bg-brand px-3 text-sm font-bold text-white hover:bg-brand-hover">
              Save
            </button>
          </div>
          {error && (
            <p id={errorId} className="text-sm font-bold text-bug">
              {error}
            </p>
          )}
        </form>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-w-0 items-center gap-1 font-bold text-brand-ink underline underline-offset-2"
          >
            <LinkIcon />
            <span className="truncate">Open {item.label.toLowerCase()}</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <button
            type="button"
            onClick={() => {
              setDraft(item.url);
              setEditing(true);
            }}
            className="min-h-[36px] rounded-md px-2 font-bold text-ink-muted underline-offset-2 hover:underline"
          >
            Change<span className="sr-only"> {item.label} link</span>
          </button>
        </div>
      )}
    </div>
  );
}
