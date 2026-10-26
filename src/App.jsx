import { useLocalStorage } from './hooks/useLocalStorage';
import { STORAGE_KEYS } from './lib/constants';
import { SEED_MEMBERS, createSeedTasks } from './lib/seed';

export default function App() {
  // Tasks and members are saved in the browser and loaded again on reload (FR12).
  const [tasks, setTasks] = useLocalStorage(STORAGE_KEYS.tasks, createSeedTasks);
  const [members] = useLocalStorage(STORAGE_KEYS.members, SEED_MEMBERS);

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold">Vibecoding Project Tracker</h1>
      <p className="text-ink-muted">
        {tasks.length} tasks · {members.length} team members loaded
      </p>
    </div>
  );
}
