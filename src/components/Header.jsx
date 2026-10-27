// Top bar: skip link, logo (top left, links home) and page actions (NFR13, NFR14).
// Focus rings are white here so they show up against the brand-coloured background (NFR3).
export default function Header({ children }) {
  return (
    <header className="bg-brand text-white [&_*:focus-visible]:outline-white">
      {/* Hidden until focused with Tab, then lets keyboard users jump past the header. */}
      <a
        href="#board"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-surface-card focus:px-4 focus:py-2 focus:font-bold focus:text-brand-ink"
      >
        Skip to board
      </a>

      <div className="mx-auto flex max-w-screen-2xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a href={import.meta.env.BASE_URL} className="flex items-center gap-3 rounded-md" aria-label="Vibe Tracker, go to board">
          <Logo />
          <span className="text-xl font-bold tracking-tight">Vibe Tracker</span>
        </a>

        <div className="flex flex-wrap items-center gap-3">{children}</div>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true" focusable="false">
      <rect width="36" height="36" rx="9" fill="#FFFFFF" />
      {/* Three bars of a Kanban board, the last one ticked. */}
      <rect x="7" y="9" width="5" height="18" rx="2" fill="#3730A3" />
      <rect x="15.5" y="9" width="5" height="12" rx="2" fill="#3730A3" />
      <path d="M23 18.5l3 3 5-6.5" fill="none" stroke="#047857" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
