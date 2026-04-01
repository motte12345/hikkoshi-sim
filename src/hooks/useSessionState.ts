import { useState, useCallback } from 'react';

export function useSessionState<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const storageKey = `hikkoshi_${key}`;

  const [state, setStateRaw] = useState<T>(() => {
    try {
      const stored = sessionStorage.getItem(storageKey);
      if (stored !== null) {
        return JSON.parse(stored) as T;
      }
    } catch {
      // parse error — use initial value
    }
    return initialValue;
  });

  const setState = useCallback((value: T | ((prev: T) => T)) => {
    setStateRaw(prev => {
      const next = typeof value === 'function' ? (value as (prev: T) => T)(prev) : value;
      try {
        sessionStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // storage full — silently ignore
      }
      return next;
    });
  }, [storageKey]);

  return [state, setState];
}
