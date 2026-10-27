import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * A short confirmation message ("Task added", "Copied to clipboard") that hides itself after a few seconds.
 * Usage: const [toast, showToast] = useToast();  showToast('Task added');
 */
export function useToast(duration = 4000) {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const showToast = useCallback(
    (message) => {
      clearTimeout(timerRef.current);
      // A new id each time, so the same message twice in a row is still announced.
      setToast({ id: Date.now(), message });
      timerRef.current = setTimeout(() => setToast(null), duration);
    },
    [duration],
  );

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return [toast, showToast];
}
