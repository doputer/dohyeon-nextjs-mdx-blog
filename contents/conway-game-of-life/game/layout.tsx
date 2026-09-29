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
        className="@container flex flex-wrap items-end justify-center gap-8 rounded border-2 border-line bg-surface p-4 select-none"
      >
        <GenerationContext.Provider value={generation}>{children}</GenerationContext.Provider>
      </div>

      <div className="flex items-center justify-between rounded border border-line bg-surface py-1 pr-1.5 pl-3.5">
        <div className="flex items-center gap-3 text-xs text-muted select-none">
          <span className="flex items-center gap-1.5">
            <i className="inline-block size-2.5 rounded-xs bg-accent/70" />
            살아 있는 칸
          </span>
          <span className="font-mono">{generation}세대</span>
        </div>

        <div className="flex items-center">
          <button
            className="flex min-w-7 items-center justify-center rounded px-1.5 py-0.5 text-xs font-medium text-muted select-none hover:bg-background hover:text-main"
            onClick={reset}
          >
            초기화
          </button>
          <button
            className="flex min-w-7 items-center justify-center rounded px-1.5 py-0.5 text-xs font-medium text-muted select-none hover:bg-background hover:text-main"
            onClick={() => setGeneration((value) => value + 1)}
          >
            다음
          </button>
          <button
            className="ml-2.5 flex items-center justify-center rounded bg-main px-1.5 py-0.5 text-xs font-medium text-background select-none hover:opacity-85"
            onClick={() => setPaused((value) => !value)}
          >
            {paused ? '재생' : '정지'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Layout;
