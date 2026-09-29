'use client';

import { createContext, type PropsWithChildren, useContext, useState } from 'react';

import Frame, { Control } from '#/context-api-misconceptions/demo/frame';
import useRender from '#/context-api-misconceptions/demo/use-render';

type Type = {
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
};

const Context = createContext<Type | null>(null);

const Provider = ({ children }: PropsWithChildren) => {
  const [value, setValue] = useState(0);

  return <Context.Provider value={{ value, setValue }}>{children}</Context.Provider>;
};

const Foo = () => {
  const ref = useRender();

  return (
    <Provider>
      <div ref={ref}>Foo</div>
      <Bar />
    </Provider>
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
          className="flex items-center justify-center rounded bg-main px-1.5 py-0.5 text-xs font-medium text-background select-none hover:opacity-85"
        >
          Button
        </button>
      </Control>
    </>
  );
};

const Solve1 = () => {
  return (
    <Frame>
      <Foo />
    </Frame>
  );
};

export default Solve1;
