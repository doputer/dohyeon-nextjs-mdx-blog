'use client';

import { createStore, useStore } from '#/create-state-store/demo/basic-store';
import Frame, { Control } from '#/create-state-store/demo/frame';
import useRender from '#/create-state-store/demo/use-render';

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

const Example1 = () => {
  return (
    <Frame>
      <Counter />
    </Frame>
  );
};

export default Example1;
