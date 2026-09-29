'use client';

import Frame, { Control } from '#/create-state-store/demo/frame';
import { createStore, useStore } from '#/create-state-store/demo/selective-store';
import useRender from '#/create-state-store/demo/use-render';

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
          className="border border-main px-2 py-0.5 text-sm text-main select-none"
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
