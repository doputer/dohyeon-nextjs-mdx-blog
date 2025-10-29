import { useSyncExternalStore } from 'react';

type Store<T> = {
  getState: () => T;
  setState: (value: T | ((value: T) => T)) => void;
  subscribe: (listener: () => void) => () => void;
};

export const createStore = <T>(initialState: T) => {
  let state = initialState;
  const listeners = new Set<() => void>();

  const getState: Store<T>['getState'] = () => {
    return state;
  };

  const setState: Store<T>['setState'] = (value) => {
    const nextState = typeof value === 'function' ? (value as (state: T) => T)(state) : value;

    if (Object.is(nextState, state)) return;

    state = nextState;

    listeners.forEach((listener) => listener());
  };

  const subscribe: Store<T>['subscribe'] = (listener) => {
    listeners.add(listener);

    return () => listeners.delete(listener);
  };

  return { getState, setState, subscribe };
};

type Selector<T, U = T> = (state: T) => U;

export const useStore = <T, U = T>(
  store: Store<T>,
  selector: Selector<T, U> = (state) => state as unknown as U
) => {
  const slice = useSyncExternalStore(
    store.subscribe,
    () => selector(store.getState()),
    () => selector(store.getState())
  );

  return slice;
};
