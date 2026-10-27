import { useRef, useState } from 'react';
import Board from './components/Board';
import Deliverables from './components/Deliverables';
import FilterBar, { NO_FILTERS, applyFilters } from './components/FilterBar';
import Header from './components/Header';
import Modal from './components/Modal';
import SignIn from './components/SignIn';
import TaskCard from './components/TaskCard';
import TeamPanel from './components/TeamPanel';
import TaskForm from './components/TaskForm';
import Toast from './components/Toast';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useToast } from './hooks/useToast';
import { DELIVERABLES, STORAGE_KEYS } from './lib/constants';
import { SEED_MEMBERS, createSeedTasks } from './lib/seed';
import { createTask } from './lib/tasks';
import { createId, getInitials, nowISO } from './lib/utils';

export default function App() {
  // Tasks and members are saved in the browser and loaded again on reload (FR12).
  const [tasks, setTasks] = useLocalStorage(STORAGE_KEYS.tasks, createSeedTasks);
  const [members, setMembers] = useLocalStorage(STORAGE_KEYS.members, SEED_MEMBERS);
  const [deliverables, setDeliverables] = useLocalStorage(STORAGE_KEYS.deliverables, DELIVERABLES);

  // Who is signed in (FR1). Only the user's id is stored; their details live in `members`.
  const [session, setSession] = useLocalStorage(STORAGE_KEYS.session, { currentUserId: null });
  const currentUser = members.find((m) => m.id === session.currentUserId) ?? null;

  // Signing in with an email that is already in the team reuses that member; otherwise it adds one.
  function handleSignIn({ name, email, role }) {
    const existing = members.find((m) => m.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setSession({ currentUserId: existing.id });
      return;
    }
    const member = { id: createId(), name, email, role, createdAt: nowISO() };
    setMembers((current) => [...current, member]);
    setSession({ currentUserId: member.id });
  }

  // Signing out keeps all board data; it just returns to the sign-in screen (FR2).
  function handleSignOut() {
    setSession({ currentUserId: null });
    setModal(null);
  }

  // Which modal is open: null (none), { mode: 'add' }, { mode: 'edit', taskId } or { mode: 'team' }.
  const [modal, setModal] = useState(null);
  const closeModal = () => setModal(null);

  // Confirmation messages, announced to screen readers too.
  const [toast, showToast] = useToast();

  // Board filters (FR21). Kept in memory only, so every visit starts by showing everything.
  const [filters, setFilters] = useState(NO_FILTERS);
  const visibleTasks = applyFilters(tasks, filters);

  const editingTask = modal?.mode === 'edit' ? tasks.find((t) => t.id === modal.taskId) : null;

  function handleSave(fields) {
    if (editingTask) {
      setTasks((current) =>
        current.map((t) => (t.id === editingTask.id ? { ...t, ...fields, updatedAt: nowISO() } : t)),
      );
      showToast('Changes saved');
    } else {
      setTasks((current) => [...current, createTask({ ...fields, createdBy: currentUser.id })]);
      showToast(`Task "${fields.title}" added`);
    }
    closeModal();
  }

  // Reassign a task from the card dropdown, then confirm it visually and out loud (FR14).
  const [highlightId, setHighlightId] = useState(null);
  const highlightTimer = useRef(null);

  function handleHandOff(task, memberId) {
    setTasks((current) =>
      current.map((t) => (t.id === task.id ? { ...t, assigneeId: memberId, updatedAt: nowISO() } : t)),
    );
    const member = members.find((m) => m.id === memberId);
    showToast(member ? `"${task.title}" handed off to ${member.name}` : `"${task.title}" is now unassigned`);

    setHighlightId(task.id);
    clearTimeout(highlightTimer.current);
    highlightTimer.current = setTimeout(() => setHighlightId(null), 2000);
  }

  function handleDeliverableChange(id, changes) {
    setDeliverables((current) => current.map((d) => (d.id === id ? { ...d, ...changes } : d)));
    const label = deliverables.find((d) => d.id === id)?.label;
    showToast(changes.url ? `${label} link saved` : `${label} link removed`);
  }

  // Team members (FR3).
  function handleAddMember(values) {
    setMembers((current) => [...current, { id: createId(), ...values, createdAt: nowISO() }]);
  }

  function handleUpdateMember(id, values) {
    setMembers((current) => current.map((m) => (m.id === id ? { ...m, ...values } : m)));
  }

  // Removing someone unassigns their tasks rather than deleting them (FR4).
  function handleRemoveMember(member) {
    setMembers((current) => current.filter((m) => m.id !== member.id));
    setTasks((current) => current.map((t) => (t.assigneeId === member.id ? { ...t, assigneeId: null } : t)));
  }

  function handleDelete(task) {
    setTasks((current) => current.filter((t) => t.id !== task.id));
    closeModal();
    showToast(`Task "${task.title}" deleted`);
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen">
        <Header />
        <main id="board" tabIndex={-1} className="focus:outline-none">
          <SignIn members={members} onSignIn={handleSignIn} />
        </main>
      </div>
    );
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

        <button
          type="button"
          onClick={() => setModal({ mode: 'team' })}
          className="flex min-h-[44px] items-center gap-2 rounded-md border border-white/60 px-4 font-bold hover:bg-white/10"
        >
          Team
          <span className="rounded-full bg-white px-2 text-sm text-brand">
            {members.length}
            <span className="sr-only"> members</span>
          </span>
        </button>

        <div className="flex items-center gap-2 rounded-md border border-white/40 py-1 pl-1 pr-1">
          <span
            aria-hidden="true"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-bold text-brand"
          >
            {getInitials(currentUser.name)}
          </span>
          <span className="text-sm">
            <span className="sr-only">Signed in as </span>
            <span className="font-bold">{currentUser.name}</span>
          </span>
          <button
            type="button"
            onClick={handleSignOut}
            className="min-h-[36px] rounded-md px-3 text-sm font-bold underline-offset-4 hover:bg-white/10 hover:underline"
          >
            Sign out
          </button>
        </div>
      </Header>

      <main id="board" tabIndex={-1} className="mx-auto max-w-screen-2xl px-4 py-6 focus:outline-none sm:px-6">
        <h1 className="sr-only">Vibe Tracker project</h1>

        <Deliverables deliverables={deliverables} onChange={handleDeliverableChange} />

        <h2 className="mb-3 text-xl font-bold">Task board</h2>

        <FilterBar
          filters={filters}
          onChange={setFilters}
          members={members}
          currentUserId={currentUser.id}
          shown={visibleTasks.length}
          total={tasks.length}
        />

        <Board
          tasks={visibleTasks}
          renderTask={(task) => (
            <TaskCard
              task={task}
              assignee={members.find((m) => m.id === task.assigneeId)}
              members={members}
              highlighted={highlightId === task.id}
              onOpen={() => setModal({ mode: 'edit', taskId: task.id })}
              onHandOff={handleHandOff}
            />
          )}
        />
      </main>

      <Modal
        open={modal !== null}
        onClose={closeModal}
        title={modal?.mode === 'team' ? 'Team members' : editingTask ? 'Edit task' : 'New task'}
      >
        {modal?.mode === 'team' ? (
          <TeamPanel
            members={members}
            currentUserId={currentUser.id}
            onAdd={handleAddMember}
            onUpdate={handleUpdateMember}
            onRemove={handleRemoveMember}
          />
        ) : (
          /* key resets the form whenever a different task is opened */
          <TaskForm
            key={editingTask?.id ?? 'new'}
            task={editingTask}
            members={members}
            onSave={handleSave}
            onCancel={closeModal}
            onDelete={handleDelete}
          />
        )}
      </Modal>

      <Toast toast={toast} />
    </div>
  );
}
