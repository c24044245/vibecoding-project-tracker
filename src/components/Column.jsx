import { useState } from 'react';

// One board column: a heading with its task count, then the list of tasks (FR5).
// It is also a drop zone: drag a card here to move it into this column (FR24).
export default function Column({ stage, tasks, renderTask, onDropTask }) {
  const headingId = `column-${stage.id}`;
  const [isOver, setIsOver] = useState(false);

  return (
    <section
      aria-labelledby={headingId}
      onDragOver={(event) => {
        event.preventDefault(); // allows dropping here
        event.dataTransfer.dropEffect = 'move';
        setIsOver(true);
      }}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsOver(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        setIsOver(false);
        const taskId = event.dataTransfer.getData('text/plain');
        if (taskId) onDropTask(taskId, stage.id);
      }}
      className={`flex min-h-[12rem] flex-col rounded-xl p-3 transition-colors ${
        isOver ? 'bg-brand-soft ring-4 ring-brand/50' : 'bg-surface-column'
      }`}
    >
      <h3 id={headingId} className="mb-3 flex items-center justify-between px-1 text-base font-bold">
        {stage.label}
        <span className="rounded-full bg-white px-2.5 py-0.5 text-sm font-bold text-ink-muted">
          {tasks.length}
          <span className="sr-only"> {tasks.length === 1 ? 'task' : 'tasks'}</span>
        </span>
      </h3>

      {tasks.length === 0 ? (
        <p className="rounded-lg border-2 border-dashed border-slate-400 p-4 text-center text-sm text-ink-muted">
          No tasks here yet
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {tasks.map((task) => (
            <li key={task.id}>{renderTask(task)}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
