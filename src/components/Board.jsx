import Column from './Column';
import { STAGES } from '../lib/constants';

// The Kanban board (FR5). Columns are at least 17rem wide, so they sit side by side on wide screens
// and wrap onto new rows when the screen is narrow or the text size is enlarged (NFR8, FR22).
export default function Board({ tasks, renderTask, onDropTask }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,17rem),1fr))] gap-4">
      {STAGES.map((stage) => (
        <Column
          key={stage.id}
          stage={stage}
          tasks={tasks.filter((task) => task.status === stage.id)}
          renderTask={renderTask}
          onDropTask={onDropTask}
        />
      ))}
    </div>
  );
}
