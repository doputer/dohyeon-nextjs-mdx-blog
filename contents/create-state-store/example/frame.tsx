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
      <div className="space-y-2 rounded border-2 border-line bg-surface p-4 select-none *:space-y-1 *:rounded-xs *:border *:border-line *:bg-background *:px-2.5 *:py-1.5 *:font-mono *:text-xs *:text-main">
        <TargetContext.Provider value={target}>{children}</TargetContext.Provider>
      </div>

      <div className="flex items-center justify-between rounded border border-line bg-surface py-1 pr-1.5 pl-3.5">
        <div className="flex items-center gap-3 text-xs text-muted select-none">
          <span className="flex items-center gap-1.5">
            <i className="inline-block size-2.5 rounded-xs border-2 border-accent" />
            렌더링
          </span>
        </div>

        <div ref={setTarget} className="flex items-center" />
      </div>
    </section>
  );
};

export default Frame;
