'use client';

import { createContext, useContext, useState } from 'react';

import Frame, { Control } from '#/context-api-misconceptions/demo/frame';
import useRender from '#/context-api-misconceptions/demo/use-render';

type Type = {
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
};

const Context = createContext<Type | null>(null);

const Foo = () => {
  const ref = useRender();

  const [value, setValue] = useState(0);

  return (
    <Context.Provider value={{ value, setValue }}>
      <div ref={ref}>Foo</div>
      <Bar />
    </Context.Provider>
  );
};

const Bar = () => {
  const ref = useRender();

  return (
    <>
      <div ref={ref}>Bar</div>
      <Baz />
    </>
  );
};

const Baz = () => {
  const ref1 = useRender();

  const context = useContext(Context);
  if (!context) throw new Error();

  const { value, setValue } = context;

  return (
    <>
      <div ref={ref1}>Baz</div>
      <Control>
        <button
          onClick={() => setValue(value + 1)}
          className="border border-main px-2 py-0.5 text-sm text-main select-none"
        >
          Button
        </button>
      </Control>
    </>
  );
};

const Problem1 = () => {
  return (
    <Frame>
      <Foo />
    </Frame>
  );
};

export default Problem1;
