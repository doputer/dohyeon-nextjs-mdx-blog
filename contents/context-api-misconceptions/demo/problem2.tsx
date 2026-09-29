'use client';

import { createContext, type PropsWithChildren, useContext, useState } from 'react';

import Frame, { Control } from '#/context-api-misconceptions/demo/frame';
import useRender from '#/context-api-misconceptions/demo/use-render';

type Type = {
  value1: number;
  setValue1: React.Dispatch<React.SetStateAction<number>>;
  value2: number;
  setValue2: React.Dispatch<React.SetStateAction<number>>;
};

const Context = createContext<Type | null>(null);

const Provider = ({ children }: PropsWithChildren) => {
  const [value1, setValue1] = useState(0);
  const [value2, setValue2] = useState(0);

  return (
    <Context.Provider value={{ value1, setValue1, value2, setValue2 }}>{children}</Context.Provider>
  );
};

const Foo = () => {
  const ref = useRender();

  return (
    <Provider>
      <div ref={ref}>Foo</div>
      <Bar />
      <Baz />
    </Provider>
  );
};

const Bar = () => {
  const ref = useRender();

  useContext(Context);

  return <div ref={ref}>Bar</div>;
};

const Baz = () => {
  const ref1 = useRender();

  const context = useContext(Context);
  if (!context) throw new Error();

  const { value2, setValue2 } = context;

  return (
    <>
      <div ref={ref1}>Baz</div>
      <Control>
        <button
          onClick={() => setValue2(value2 + 1)}
          className="flex items-center justify-center rounded bg-main px-1.5 py-0.5 text-xs font-medium text-background select-none hover:opacity-85"
        >
          Button
        </button>
      </Control>
    </>
  );
};

const Problem2 = () => {
  return (
    <Frame>
      <Foo />
    </Frame>
  );
};

export default Problem2;
