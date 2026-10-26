import { useEffect, useState } from 'react';

/**
 * Keeps a piece of React state in sync with localStorage, so it survives a page reload (FR12).
 * If storage is blocked or the saved data is corrupt, it falls back to `initialValue` (NFR23).
 *
 * Usage: const [tasks, setTasks] = useLocalStorage('vibetracker.tasks', []);
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw != null) return JSON.parse(raw);
    } catch {
      /* blocked or corrupt storage: use the initial value instead */
    }
    return typeof initialValue === 'function' ? initialValue() : initialValue;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage full or blocked (e.g. private mode): keep working in memory */
    }
  }, [key, value]);

  return [value, setValue];
}
