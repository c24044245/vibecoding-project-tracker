import { CONTEXT_TEMPLATE } from './constants';
import { createId, nowISO } from './utils';

// Builds a complete Task object (DR3) with sensible defaults for anything not supplied.
export function createTask(fields = {}) {
  const now = nowISO();
  return {
    id: createId(),
    title: '',
    description: '',
    type: 'feature',
    status: 'todo',
    assigneeId: null,
    dueDate: null,
    createdAt: now,
    updatedAt: now,
    createdBy: null, // id of the signed-in user who created it
    context: {
      body: CONTEXT_TEMPLATE,
      tool: null,
      updatedAt: null,
    },
    ...fields,
  };
}
