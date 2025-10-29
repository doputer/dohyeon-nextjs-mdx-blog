'use client';

import useRender from '#/create-state-store/hook/use-render';
import { createStore, useStore } from '#/create-state-store/store/basic-store';

const store = createStore(0);

const Counter = () => {
  const ref = useRender();

  const value = useStore(store);

  const increase = () => {
    store.setState((prev) => prev + 1);
  };

  return (
    <div ref={ref}>
      <div>Value: {value}</div>
      <button onClick={increase}>Increase Button</button>
    </div>
  );
};

const Example1 = () => {
  return (
    <section className="space-y-4 rounded border border-line bg-background p-4">
      <Counter />
    </section>
  );
};

export default Example1;
