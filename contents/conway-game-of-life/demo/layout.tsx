'use client';

import { createContext, type PropsWithChildren, useEffect, useState } from 'react';

export const GenerationContext = createContext(0);

const INTERVAL = 250;

const Layout = ({ children }: PropsWithChildren) => {
  const [generation, setGeneration] = useState(0);
  const [runId, setRunId] = useState(0);
  const [paused, setPaused] = useState(true);

  useEffect(() => {
    if (paused) return;

    const id = setInterval(() => setGeneration((value) => value + 1), INTERVAL);
    return () => clearInterval(id);
  }, [paused]);

  const reset = () => {
    setGeneration(0);
    setRunId((id) => id + 1);
  };

  return (
    <section className="space-y-2.5">
      <div
        key={runId}
        className="@container flex flex-wrap items-end justify-center gap-8 border-2 border-line p-4 select-none"
      >
        <GenerationContext.Provider value={generation}>{children}</GenerationContext.Provider>
      </div>

      <div className="-mt-1 flex flex-wrap items-center justify-end gap-x-3 gap-y-1 px-0.5 text-xs text-muted select-none">
        <span className="flex items-center gap-1.5">
          <i className="inline-block size-2.5 bg-accent/70" />
          살아 있는 칸
        </span>
        <span className="font-mono">{generation}세대</span>
      </div>
      <fieldset aria-label="조작">
        <div className="flex items-center gap-1.5">
          <button
            className="border border-line px-2 py-0.5 text-sm text-main select-none"
            onClick={reset}
          >
            초기화
          </button>
          <button
            className="border border-line px-2 py-0.5 text-sm text-main select-none"
            onClick={() => setGeneration((value) => value + 1)}
          >
            다음
          </button>
          <button
            className="border border-main px-2 py-0.5 text-sm text-main select-none"
            onClick={() => setPaused((value) => !value)}
          >
            {paused ? '재생' : '정지'}
          </button>
        </div>
      </fieldset>
    </section>
  );
};

export default Layout;
