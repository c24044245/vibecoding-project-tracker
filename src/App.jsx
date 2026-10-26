import { useState } from 'react';
import Board from './components/Board';
import Header from './components/Header';
import Modal from './components/Modal';
import TaskCard from './components/TaskCard';
import TaskForm from './components/TaskForm';
import { useLocalStorage } from './hooks/useLocalStorage';
import { STORAGE_KEYS } from './lib/constants';
import { SEED_MEMBERS, createSeedTasks } from './lib/seed';
import { createTask } from './lib/tasks';
import { nowISO } from './lib/utils';

export default function App() {
  // Tasks and members are saved in the browser and loaded again on reload (FR12).
  const [tasks, setTasks] = useLocalStorage(STORAGE_KEYS.tasks, createSeedTasks);
  const [members] = useLocalStorage(STORAGE_KEYS.members, SEED_MEMBERS);

  // Which modal is open: null (none), { mode: 'add' } or { mode: 'edit', taskId }.
  const [modal, setModal] = useState(null);
  const closeModal = () => setModal(null);

  const editingTask = modal?.mode === 'edit' ? tasks.find((t) => t.id === modal.taskId) : null;

  function handleSave(fields) {
    if (editingTask) {
      setTasks((current) =>
        current.map((t) => (t.id === editingTask.id ? { ...t, ...fields, updatedAt: nowISO() } : t)),
      );
    } else {
      setTasks((current) => [...current, createTask(fields)]);
    }
    closeModal();
  }

  function handleDelete(task) {
    setTasks((current) => current.filter((t) => t.id !== task.id));
    closeModal();
  }

  return (
    <div className="min-h-screen">
      <Header>
        <button
          type="button"
          onClick={() => setModal({ mode: 'add' })}
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
            <TaskCard
              task={task}
              assignee={members.find((m) => m.id === task.assigneeId)}
              onOpen={() => setModal({ mode: 'edit', taskId: task.id })}
            />
          )}
        />
      </main>

      <Modal open={modal !== null} onClose={closeModal} title={editingTask ? 'Edit task' : 'New task'}>
        {/* key resets the form whenever a different task is opened */}
        <TaskForm
          key={editingTask?.id ?? 'new'}
          task={editingTask}
          members={members}
          onSave={handleSave}
          onCancel={closeModal}
          onDelete={handleDelete}
        />
      </Modal>
    </div>
  );
}
