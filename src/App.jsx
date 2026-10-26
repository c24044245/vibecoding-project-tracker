import { useState } from 'react';
import Board from './components/Board';
import Header from './components/Header';
import Modal from './components/Modal';
import TaskCard from './components/TaskCard';
import TaskForm from './components/TaskForm.jsx';
import { useLocalStorage } from './hooks/useLocalStorage';
import { STORAGE_KEYS } from './lib/constants';
import { SEED_MEMBERS, createSeedTasks } from './lib/seed';
import { createTask } from './lib/tasks';

export default function App() {
  // Tasks and members are saved in the browser and loaded again on reload (FR12).
  const [tasks, setTasks] = useLocalStorage(STORAGE_KEYS.tasks, createSeedTasks);
  const [members] = useLocalStorage(STORAGE_KEYS.members, SEED_MEMBERS);

  // Whether the add-task modal is open.
  const [isAdding, setIsAdding] = useState(false);

  function handleAdd(fields) {
    setTasks((current) => [...current, createTask(fields)]);
    setIsAdding(false);
  }

  return (
    <div className="min-h-screen">
      <Header>
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="flex min-h-[44px] items-center gap-2 rounded-md bg-white px-4 font-bold text-brand hover:bg-brand-soft"
        >
          <span aria-hidden="true" className="text-xl leading-none">+</span>
          New task
        </button>
      </Header>

      <main id="board" tabIndex={-1} className="mx-auto max-w-screen-2xl px-4 py-6 focus:outline-none sm:px-6">
        <h1 className="mb-4 text-2xl font-bold">Project board</h1>

        <Board
          tasks={tasks}
          renderTask={(task) => (
            <TaskCard task={task} assignee={members.find((m) => m.id === task.assigneeId)} />
          )}
        />
      </main>

      <Modal open={isAdding} onClose={() => setIsAdding(false)} title="New task">
        <TaskForm members={members} onSave={handleAdd} onCancel={() => setIsAdding(false)} />
      </Modal>
    </div>
  );
}
