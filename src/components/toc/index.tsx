'use client';

import { useEffect, useRef, useState } from 'react';

import type { Post } from '@/lib/MDX/types';

import useObserver from '@/hooks/use-observer';
import useScroll from '@/hooks/use-scroll';
import { cn } from '@/utils/cn';

export interface TOCProps {
  toc: Post['toc'];
}

const TOC = ({ toc }: TOCProps) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const activeId = useObserver();
  const scrollToTarget = useScroll();

  const activeIndex = toc.findIndex(({ id }) => id === activeId);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);

    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open]);

  return (
    <div ref={wrapRef} className="fixed right-3 bottom-3 z-10 lg:right-6 lg:bottom-6">
      <nav
        className={cn(
          'absolute right-0 bottom-[calc(100%+4px)] w-64 origin-bottom-right rounded-xl border border-line bg-background p-4 shadow-lg lg:w-72 lg:p-5',
          open
            ? 'animate-panel-in motion-reduce:animate-none'
            : 'pointer-events-none opacity-0 transition-opacity duration-150 ease-out motion-reduce:transition-none'
        )}
      >
        <ul className="scrollbar-none flex max-h-72 flex-col gap-2 overflow-y-auto text-sm lg:max-h-96 lg:gap-2.5 lg:text-[15px]">
          {toc.map(({ id, text, depth }) => (
            <li key={id} className={cn('relative', depth === 3 && 'pl-3.5')}>
              <button
                className={cn(
                  'text-left text-soft transition-colors duration-300 ease-out hover:text-main',
                  id === activeId && 'font-medium text-accent hover:text-accent',
                  id === activeId &&
                    'before:absolute before:top-1 before:bottom-1 before:-left-2.5 before:w-0.5 before:rounded before:bg-accent'
                )}
                onClick={() => {
                  scrollToTarget(id);
                  setOpen(false);
                }}
              >
                {text}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <button
        aria-expanded={open}
        aria-label="목차 열기"
        className="group flex flex-col items-end gap-2 lg:p-3"
        onClick={() => setOpen((prev) => !prev)}
      >
        {toc.map(({ id, depth }, index) => (
          <span
            key={id}
            className={cn(
              'h-0.5 rounded-full bg-line transition-all duration-300 ease-[cubic-bezier(0.34,1.3,0.64,1)] motion-reduce:transition-none lg:h-0.75',
              depth === 3
                ? 'w-3 group-hover:w-4 lg:w-4 lg:group-hover:w-5.5'
                : 'w-5 group-hover:w-6.5 lg:w-7 lg:group-hover:w-8.5',
              index < activeIndex && 'bg-soft',
              id === activeId && 'w-7 bg-accent group-hover:w-8.5 lg:w-10 lg:group-hover:w-11.5'
            )}
          />
        ))}
      </button>
    </div>
  );
};

export default TOC;
