/**
 * Shows the latest confirmation message at the bottom of the screen.
 * The live region is always in the page (even when empty) so screen readers announce
 * each new message without moving focus (NFR7, WCAG 4.1.3).
 */
export default function Toast({ toast }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4"
    >
      {toast && (
        <p
          key={toast.id}
          className="pointer-events-auto flex items-center gap-2 rounded-lg bg-ink px-4 py-3 font-bold text-white shadow-lg"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
            <circle cx="10" cy="10" r="9" fill="#34D399" />
            <path d="M6 10.5l2.5 2.5L14 7.5" fill="none" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {toast.message}
        </p>
      )}
    </div>
  );
}
