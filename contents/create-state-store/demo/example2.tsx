'use client';

import { createStore, useStore } from '#/create-state-store/demo/basic-store';
import Frame, { Control } from '#/create-state-store/demo/frame';
import useRender from '#/create-state-store/demo/use-render';

const store = createStore({
  name: '김도현',
  age: 0,
});

const Name = () => {
  const ref = useRender();

  const { name } = useStore(store);

  return <div ref={ref}>Name: {name}</div>;
};

const Age = () => {
  const ref = useRender();

  const { age } = useStore(store);

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

const Example2 = () => {
  return (
    <Frame>
      <Name />
      <Age />
    </Frame>
  );
};

export default Example2;
