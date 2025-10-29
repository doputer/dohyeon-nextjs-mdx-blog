'use client';

import useRender from '#/create-state-store/hook/use-render';
import { useShallow } from '#/create-state-store/hook/use-shallow';
import { createStore, useStore } from '#/create-state-store/store/selective-store';

const store = createStore({
  name: '김도현',
  age: 0,
});

const Person = () => {
  const ref = useRender();

  const { name, age } = useStore(
    store,
    useShallow((state) => ({ name: state.name, age: state.age }))
  );

  const increase = () => {
    store.setState((prev) => ({ ...prev, age: prev.age + 1 }));
  };

  return (
    <div ref={ref}>
      <div>Name: {name}</div>
      <div>Age: {age}</div>
      <button onClick={increase}>Increase Button</button>
    </div>
  );
};

const Example4 = () => {
  return (
    <section className="space-y-4 rounded border border-line bg-background p-4">
      <Person />
    </section>
  );
};

export default Example4;
