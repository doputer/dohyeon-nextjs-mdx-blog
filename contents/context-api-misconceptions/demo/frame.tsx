'use client';

import { createContext, type PropsWithChildren, useContext, useState } from 'react';
import { createPortal } from 'react-dom';

const TargetContext = createContext<HTMLElement | null>(null);

export const Control = ({ children }: PropsWithChildren) => {
  const target = useContext(TargetContext);

  return target ? createPortal(children, target) : null;
};

const Frame = ({ children }: PropsWithChildren) => {
  const [target, setTarget] = useState<HTMLDivElement | null>(null);

  return (
    <section className="space-y-2.5">
      <div className="space-y-2 border-2 border-line p-4 select-none *:space-y-1 *:border *:border-line *:bg-surface *:px-2.5 *:py-1.5 *:font-mono *:text-xs *:text-main">
        <TargetContext.Provider value={target}>{children}</TargetContext.Provider>
      </div>

      <div className="-mt-1 flex flex-wrap items-center justify-end gap-x-3 gap-y-1 px-0.5 text-xs text-muted select-none">
        <span className="flex items-center gap-1.5">
          <i className="inline-block size-2.5 border-2 border-accent" />
          렌더링
        </span>
      </div>
      <fieldset aria-label="조작">
        <div ref={setTarget} className="flex items-center gap-1.5" />
      </fieldset>
    </section>
  );
};

export default Frame;
