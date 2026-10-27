// Small inline SVG icons. They are decorative (aria-hidden): the text beside each icon carries the meaning.
const base = { width: 16, height: 16, viewBox: '0 0 16 16', 'aria-hidden': true, focusable: 'false' };

export function FeatureIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M8 1.5l1.7 4.1 4.3.4-3.3 2.8 1 4.2L8 10.8 4.3 13l1-4.2L2 6l4.3-.4z" fill="currentColor" />
    </svg>
  );
}

export function BugIcon(props) {
  return (
    <svg {...base} {...props}>
      <ellipse cx="8" cy="9.5" rx="3.6" ry="4.5" fill="currentColor" />
      <path
        d="M5.5 4.5L4 3M10.5 4.5L12 3M4.4 8H1.5M11.6 8h2.9M4.6 11.5L2.5 13M11.4 11.5l2.1 1.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
