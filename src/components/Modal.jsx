import { useEffect, useId, useRef } from 'react';

/**
 * Accessible modal built on the native <dialog> element (NFR4).
 * - showModal() makes the rest of the page inert and keeps Tab inside the dialog
 * - Esc and the close button both close it
 * - focus goes back to whatever opened it (e.g. the card)
 */
export default function Modal({ open, onClose, title, children }) {
  const dialogRef = useRef(null);
  const openerRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      openerRef.current = document.activeElement;
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
      // Return focus to the opener; if it no longer exists (e.g. a deleted card), go to the board.
      const opener = openerRef.current;
      if (opener && document.body.contains(opener)) opener.focus();
      else document.getElementById('board')?.focus();
    }
  }, [open]);

  // Clicking the dimmed backdrop (outside the panel) also closes it.
  function handleClick(event) {
    if (event.target === dialogRef.current) onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault(); // let React state decide when it closes
        onClose();
      }}
      onClick={handleClick}
      className="m-auto w-[calc(100%-2rem)] max-w-xl rounded-xl bg-surface-card p-0 text-ink shadow-2xl backdrop:bg-slate-900/60"
    >
      {open && (
        <div className="p-5 sm:p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <h2 id={titleId} className="text-xl font-bold">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="-m-1 flex h-11 w-11 items-center justify-center rounded-md text-2xl leading-none text-ink-muted hover:bg-surface-hover hover:text-ink"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}
