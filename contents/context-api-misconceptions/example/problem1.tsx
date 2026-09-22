'use client';

import { createContext, useContext, useState } from 'react';

import useRender from '#/context-api-misconceptions/hook/use-render';

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
  const ref2 = useRender();

  const context = useContext(Context);
  if (!context) throw new Error();

  const { value, setValue } = context;

  return (
    <>
      <div ref={ref1}>Baz</div>
      <button ref={ref2} onClick={() => setValue(value + 1)}>
        Button
      </button>
    </>
  );
};

const Problem1 = () => {
  return (
    <section className="space-y-4 rounded border border-line bg-background p-4">
      <Foo />
    </section>
  );
};

export default Problem1;
