import { useEffect, useRef, useState } from 'react';
import { buildBackup, downloadFile, parseBackup } from '../lib/backup';
import { TEXT_SIZES, THEMES } from '../lib/constants';

/**
 * Display settings (FR22). Text size scales the whole app, because every size in the
 * app is set in rem units that follow the page's root font size (NFR8).
 * Backup exports and imports the board as a file (FR26).
 */
export default function SettingsPanel({ settings, onChange, board, onImport }) {
  return (
    <div className="flex flex-col gap-6">
      <fieldset>
        <legend className="mb-1 font-bold">Text size</legend>
        <p className="mb-3 text-sm text-ink-muted">Makes all text and controls larger. Your choice is remembered.</p>
        <div className="grid grid-cols-3 gap-3">
          {TEXT_SIZES.map((size) => (
            <label
              key={size.value}
              className="flex min-h-[64px] cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-line p-2 has-[:checked]:border-brand-ink has-[:checked]:bg-brand-soft has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-ink"
            >
              <input
                type="radio"
                name="text-size"
                value={size.value}
                checked={settings.textSize === size.value}
                onChange={() => onChange({ ...settings, textSize: size.value })}
                className="sr-only"
              />
              <span aria-hidden="true" className="font-bold" style={{ fontSize: `${size.value / 100}rem` }}>
                Aa
              </span>
              <span className="text-sm">{size.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-1 font-bold">Theme</legend>
        <p className="mb-3 text-sm text-ink-muted">Dark can be easier on the eyes in low light.</p>
        <div className="flex flex-col gap-2">
          {THEMES.map((theme) => (
            <label
              key={theme.value}
              className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-lg border-2 border-line px-3 has-[:checked]:border-brand-ink has-[:checked]:bg-brand-soft"
            >
              <input
                type="radio"
                name="theme"
                value={theme.value}
                checked={(settings.theme ?? 'system') === theme.value}
                onChange={() => onChange({ ...settings, theme: theme.value })}
                className="h-4 w-4 accent-brand"
              />
              {theme.label}
            </label>
          ))}
        </div>
      </fieldset>

      <BackupSection board={board} onImport={onImport} />
    </div>
  );
}

function BackupSection({ board, onImport }) {
  const [pending, setPending] = useState(null); // parsed backup waiting for confirmation
  const [message, setMessage] = useState({ text: '', error: false });
  const fileRef = useRef(null);
  const confirmRef = useRef(null);

  // When a valid file is chosen, move focus to the safe choice in the confirmation.
  useEffect(() => {
    if (pending) confirmRef.current?.focus();
  }, [pending]);

  function handleExport() {
    const date = new Date().toISOString().slice(0, 10);
    downloadFile(`vibe-tracker-board-${date}.json`, buildBackup(board));
    setMessage({ text: 'Board exported. Check your Downloads folder.', error: false });
  }

  function handleFile(event) {
    const file = event.target.files?.[0];
    event.target.value = ''; // lets the same file be chosen again
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = parseBackup(String(reader.result));
      if (!result.ok) {
        setPending(null);
        setMessage({ text: result.error, error: true });
        return;
      }
      setMessage({ text: '', error: false });
      setPending(result.data);
    };
    reader.readAsText(file);
  }

  return (
    <section aria-labelledby="backup-heading" className="border-t border-line-soft pt-5">
      <h3 id="backup-heading" className="mb-1 font-bold">
        Back up or share your board
      </h3>
      <p className="mb-3 text-sm text-ink-muted">
        Your board is saved only in this browser. Export it to keep a copy or send it to a teammate, who can import it
        on their computer.
      </p>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleExport}
          className="min-h-[44px] rounded-md bg-brand px-4 font-bold text-white hover:bg-brand-hover"
        >
          Export board
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="min-h-[44px] rounded-md border-2 border-brand-ink bg-surface-card px-4 font-bold text-brand-ink hover:bg-brand-soft"
        >
          Import board…
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          onChange={handleFile}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
        />
      </div>

      {pending && (
        <div role="group" aria-labelledby="import-confirm-text" className="mt-4 rounded-lg border-2 border-due-warning-line bg-due-warning-soft p-4">
          <p id="import-confirm-text" className="mb-3 font-bold">
            Replace your board with {pending.tasks.length} tasks and {pending.members.length} team members from this
            file? Your current board will be lost unless you export it first.
          </p>
          <div className="flex flex-wrap justify-end gap-3">
            <button
              ref={confirmRef}
              type="button"
              onClick={() => setPending(null)}
              className="min-h-[44px] rounded-md border border-line-strong bg-surface-card px-4 font-bold"
            >
              Keep my board
            </button>
            <button
              type="button"
              onClick={() => {
                onImport(pending);
                setPending(null);
                setMessage({ text: `Imported ${pending.tasks.length} tasks.`, error: false });
              }}
              className="min-h-[44px] rounded-md bg-brand px-4 font-bold text-white hover:bg-brand-hover"
            >
              Yes, replace board
            </button>
          </div>
        </div>
      )}

      <p role="status" className={`mt-3 text-sm font-bold ${message.error ? 'text-bug' : 'text-feature'}`}>
        {message.text}
      </p>
    </section>
  );
}
