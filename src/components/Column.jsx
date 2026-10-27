// One board column: a heading with its task count, then the list of tasks (FR5).
export default function Column({ stage, tasks, renderTask }) {
  const headingId = `column-${stage.id}`;

  return (
    <section
      aria-labelledby={headingId}
      className="flex min-h-[12rem] flex-col rounded-xl bg-surface-column p-3"
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
