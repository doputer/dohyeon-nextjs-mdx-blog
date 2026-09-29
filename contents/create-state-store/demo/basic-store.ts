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

export const useStore = <T>(store: Store<T>) => {
  const slice = useSyncExternalStore(store.subscribe, store.getState, store.getState);

  return slice;
};
