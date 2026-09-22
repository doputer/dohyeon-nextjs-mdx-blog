'use client';

import useRender from '#/create-state-store/hook/use-render';
import { createStore, useStore } from '#/create-state-store/store/selective-store';

const store = createStore({
  name: '김도현',
  age: 0,
});

const Name = () => {
  const ref = useRender();

  const name = useStore(store, (state) => state.name);

  return <div ref={ref}>Name: {name}</div>;
};

const Age = () => {
  const ref = useRender();

  const age = useStore(store, (state) => state.age);

  const increase = () => {
    store.setState((prev) => ({ ...prev, age: prev.age + 1 }));
  };

  return (
    <div ref={ref}>
      <div>Age: {age}</div>
      <button onClick={increase}>Increase Button</button>
    </div>
  );
};

const Example3 = () => {
  return (
    <section className="space-y-4 rounded border border-line bg-background p-4">
      <Name />
      <Age />
    </section>
  );
};

export default Example3;
