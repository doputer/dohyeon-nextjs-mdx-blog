'use client';

import { createContext, type PropsWithChildren, useContext, useState } from 'react';

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
  const ref2 = useRender();

  const context = useContext(Context2);
  if (!context) throw new Error();

  const { value2, setValue2 } = context;

  return (
    <>
      <div ref={ref1}>Baz</div>
      <button ref={ref2} onClick={() => setValue2(value2 + 1)}>
        Button
      </button>
    </>
  );
};

const Solve2 = () => {
  return (
    <section className="space-y-4 rounded border border-line bg-background p-4">
      <Foo />
    </section>
  );
};

export default Solve2;
