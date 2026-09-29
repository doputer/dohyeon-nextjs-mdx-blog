'use client';

import Frame, { Control } from '#/create-state-store/example/frame';
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

const Example3 = () => {
  return (
    <Frame>
      <Name />
      <Age />
    </Frame>
  );
};

export default Example3;
