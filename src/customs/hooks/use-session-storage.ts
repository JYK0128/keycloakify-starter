import { safeParse } from '#/customs/helpers';
import { Dispatch, SetStateAction, useRef, useSyncExternalStore } from 'react';

export function useSessionStorage<T>(key: string): [Nullish<T>, Dispatch<SetStateAction<T>>] {
  const previousValueRef = useRef<Nullish<string>>();

  const subscribe = (callback: () => void) => {
    const handler = () => {
      callback();
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  };

  const getSnapshot = () => {
    const item = sessionStorage.getItem(key);
    const parsedItem = safeParse(item);

    if (JSON.stringify(parsedItem) === JSON.stringify(previousValueRef.current)) {
      return previousValueRef.current;
    }
    else {
      previousValueRef.current = parsedItem;
      return parsedItem;
    }
  };

  const value = useSyncExternalStore(subscribe, getSnapshot);

  const setValue: Dispatch<SetStateAction<T>> = (valueOrUpdater) => {
    const item = sessionStorage.getItem(key);
    const parsedItem = safeParse(item);

    const nextValue = typeof valueOrUpdater === 'function'
      ? (valueOrUpdater as (prev: T) => T)(parsedItem)
      : valueOrUpdater;

    if (!nextValue) {
      sessionStorage.removeItem(key);
    }
    else {
      sessionStorage.setItem(key, JSON.stringify(nextValue));
    }
    window.dispatchEvent(new Event('storage'));
  };

  return [value, setValue];
}
