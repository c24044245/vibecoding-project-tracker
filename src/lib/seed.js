import { createTask } from './tasks';
import { dateFromToday, nowISO } from './utils';

// Example team so the board is not empty on first visit (FR6).
// Fixed IDs so the example tasks can point at these members.
export const SEED_MEMBERS = [
  { id: 'a1f4c2e8-5b7d-4c3a-9e21-0d6f8b4a7c11', name: 'Priya Shah', email: 'priya@example.com', role: 'Senior developer' },
  { id: 'b2e5d3f9-6c8e-4d4b-8f32-1e7a9c5b8d22', name: 'Tom Evans', email: 'tom@example.com', role: 'UX designer' },
  { id: 'c3f6e4a1-7d9f-4e5c-9a43-2f8b1d6c9e33', name: 'Sam Okafor', email: 'sam@example.com', role: 'Junior developer' },
];

const [priya, tom, sam] = SEED_MEMBERS;

// Dates are relative to today, so the due-date colours always have something to show.
export function createSeedTasks() {
  return [
    createTask({
      title: 'Write hero copy',
      description: 'Short headline and intro line for the landing page.',
      type: 'feature',
      status: 'todo',
      assigneeId: tom.id,
      dueDate: dateFromToday(5),
    }),
    createTask({
      title: 'Fix nav on mobile',
      description: 'Menu overlaps the hero below 400px wide.',
      type: 'bug',
      status: 'in-progress',
      assigneeId: sam.id,
      dueDate: dateFromToday(0),
      context: {
        body: `## Background
Nav is a flex row with the logo and five links.

## Constraints
Tailwind only, no extra libraries. Must work by keyboard.

## Tried so far
flex-wrap: links wrap but push the logo off-centre.

## Pick up
Try a menu button that shows the links below 640px.`,
        tool: 'Claude',
        updatedAt: nowISO(),
      },
    }),
    createTask({
      title: 'About page layout',
      description: 'Two-column layout with photo and bio.',
      type: 'feature',
      status: 'review',
      assigneeId: priya.id,
      dueDate: dateFromToday(-1),
    }),
    createTask({
      title: 'Set up repo and deploy',
      description: 'Fork the starter, connect to Vercel.',
      type: 'feature',
      status: 'done',
      assigneeId: priya.id,
      dueDate: dateFromToday(-3),
    }),
  ];
}
