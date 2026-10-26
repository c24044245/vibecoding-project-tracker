// Shared constants. Use these everywhere instead of typing the strings again.

// The four board columns, in display order (FR5).
export const STAGES = [
  { id: 'todo', label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Done' },
];

// Task types (FR13). Each has a text label as well as a colour, so colour is never the only signal.
export const TASK_TYPES = {
  feature: { id: 'feature', label: 'Feature' },
  bug: { id: 'bug', label: 'Bug' },
};

// AI tools offered in the Context section (FR17).
export const AI_TOOLS = ['Claude', 'ChatGPT', 'Cursor', 'Lovable', 'Replit', 'Other'];

// Template that pre-fills the Context field on new tasks (FR17).
export const CONTEXT_TEMPLATE = `## Background

## Constraints

## Tried so far

## Pick up
`;

// localStorage keys (FR12).
export const STORAGE_KEYS = {
  tasks: 'vibetracker.tasks',
  members: 'vibetracker.members',
};
