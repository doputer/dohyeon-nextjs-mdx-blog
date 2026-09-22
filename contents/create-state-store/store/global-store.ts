import { useSyncExternalStore } from 'react';

type Store<T> = {
  getState: () => T;
  setState: (value: T | ((value: T) => T)) => void;
  subscribe: (listener: () => void) => () => void;
};

type StateCreator<T> = (set: Store<T>['setState'], get: Store<T>['getState']) => T;

type Selector<T, U = T> = (value: T) => U;

const createStore = <T>(createState: StateCreator<T>) => {
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

  let state = createState(setState, getState);

  return { getState, setState, subscribe };
};

const useStore = <T, U = T>(
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

export const create = <T>(createState: StateCreator<T>) => {
  const store = createStore(createState);

  const useBoundStore = <U = T>(selector?: Selector<T, U>) => useStore(store, selector);

  Object.assign(useBoundStore, store);

  return useBoundStore as typeof useBoundStore & typeof store;
};
