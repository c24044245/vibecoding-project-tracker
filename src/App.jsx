import Header from './components/Header';
import { useLocalStorage } from './hooks/useLocalStorage';
import { STORAGE_KEYS } from './lib/constants';
import { SEED_MEMBERS, createSeedTasks } from './lib/seed';

export default function App() {
  // Tasks and members are saved in the browser and loaded again on reload (FR12).
  const [tasks, setTasks] = useLocalStorage(STORAGE_KEYS.tasks, createSeedTasks);
  const [members] = useLocalStorage(STORAGE_KEYS.members, SEED_MEMBERS);

  return (
    <div className="min-h-screen">
      <Header />

      <main id="board" tabIndex={-1} className="focus:outline-none mx-auto max-w-screen-2xl px-4 py-6 sm:px-6">
        <h1 className="text-2xl font-bold">Project board</h1>
        <p className="text-ink-muted">
          {tasks.length} tasks · {members.length} team members loaded
        </p>
      </main>
    </div>
  );
}
