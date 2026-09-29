'use client';

import { createContext, type PropsWithChildren, useContext, useState } from 'react';

import Frame, { Control } from '#/context-api-misconceptions/example/frame';
import useRender from '#/context-api-misconceptions/hook/use-render';

type Type1 = {
  value1: number;
  setValue1: React.Dispatch<React.SetStateAction<number>>;
};

type Type2 = {
  value2: number;
  setValue2: React.Dispatch<React.SetStateAction<number>>;
};

const Context1 = createContext<Type1 | null>(null);
const Context2 = createContext<Type2 | null>(null);

const Provider1 = ({ children }: PropsWithChildren) => {
  const [value1, setValue1] = useState(0);

  return <Context1.Provider value={{ value1, setValue1 }}>{children}</Context1.Provider>;
};

const Provider2 = ({ children }: PropsWithChildren) => {
  const [value2, setValue2] = useState(0);

  return <Context2.Provider value={{ value2, setValue2 }}>{children}</Context2.Provider>;
};

const Foo = () => {
  const ref = useRender();

  return (
    <Provider1>
      <Provider2>
        <div ref={ref}>Foo</div>
        <Bar />
        <Baz />
      </Provider2>
    </Provider1>
  );
};

const Bar = () => {
  const ref = useRender();

  useContext(Context1);

  return <div ref={ref}>Bar</div>;
};

const Baz = () => {
  const ref1 = useRender();

  const context = useContext(Context2);
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

const Solve2 = () => {
  return (
    <Frame>
      <Foo />
    </Frame>
  );
};

export default Solve2;
