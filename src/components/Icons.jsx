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

export function ClockIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="8" cy="8" r="6.3" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 4.5V8l2.5 1.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function AlertIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M8 1.5L15 14H1z" fill="currentColor" />
      <path d="M8 6v3.5" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="8" cy="11.6" r="0.9" fill="#FFFFFF" />
    </svg>
  );
}

export function CheckIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CopyIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="5" y="5" width="9" height="9" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M11 3V2.5A1.5 1.5 0 009.5 1h-7A1.5 1.5 0 001 2.5v7A1.5 1.5 0 002.5 11H3" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
