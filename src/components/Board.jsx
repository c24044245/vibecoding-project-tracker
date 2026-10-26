import Column from './Column';
import { STAGES } from '../lib/constants';

// The Kanban board: four columns side by side on wide screens, stacked on narrow ones (FR5, NFR8).
export default function Board({ tasks, renderTask }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {STAGES.map((stage) => (
        <Column
          key={stage.id}
          stage={stage}
          tasks={tasks.filter((task) => task.status === stage.id)}
          renderTask={renderTask}
        />
      ))}
    </div>
  );
}
