'use client';

import Frame, { Control } from '#/create-state-store/demo/frame';
import { createStore, useStore } from '#/create-state-store/demo/selective-store';
import useRender from '#/create-state-store/demo/use-render';
import { useShallow } from '#/create-state-store/demo/use-shallow';

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
      <Control>
        <button
          onClick={increase}
          className="flex items-center justify-center rounded bg-main px-1.5 py-0.5 text-xs font-medium text-background select-none hover:opacity-85"
        >
          Increase Button
        </button>
      </Control>
    </div>
  );
};

const Example4 = () => {
  return (
    <Frame>
      <Person />
    </Frame>
  );
};

export default Example4;
