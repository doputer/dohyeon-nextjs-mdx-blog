import { useRef } from 'react';

const equal = <T>(value1: T, value2: T) => {
  if (JSON.stringify(value1) === JSON.stringify(value2)) return true;

  return false;
};

type Selector<T, U = T> = (state: T) => U;

export const useShallow = <T, U = T>(selector: Selector<T, U>) => {
  const prev = useRef<U>(null);

  return (state: T) => {
    const next = selector(state);

    return equal(prev.current, next) ? (prev.current as U) : (prev.current = next);
  };
};
