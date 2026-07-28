'use client';

import { useEffect, useRef, useState } from 'react';

import type { TOCProps } from '@/components/toc';

import useObserver from '@/hooks/use-observer';
import useScroll from '@/hooks/use-scroll';
import { cn } from '@/utils/cn';

const Fab = ({ toc }: TOCProps) => {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  const activeId = useObserver();
  const scrollToTarget = useScroll();

  useEffect(() => {
    const handleScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(window.scrollY / max, 1) : 0);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);

    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open]);

  return (
    <div ref={wrapRef} className="fixed right-6 bottom-6 z-10 lg:hidden">
      <nav
        className={cn(
          'absolute right-0 bottom-14 w-56 origin-bottom-right rounded-xl border border-line bg-background p-4 shadow-lg',
          'transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.34,1.3,0.64,1)] motion-reduce:transition-none',
          open ? 'opacity-100' : 'pointer-events-none translate-y-2 scale-95 opacity-0'
        )}
      >
        <p className="mb-2 text-[11px] font-semibold tracking-[0.14em] text-soft uppercase">
          On this page
        </p>
        <ul className="flex max-h-64 flex-col gap-2 overflow-y-auto text-sm">
          {toc.map(({ id, text, depth }) => (
            <li key={id} className={cn(depth === 3 && 'pl-4')}>
              <button
                className={cn(
                  'text-left text-soft transition-colors duration-300 ease-out',
                  id === activeId && 'font-medium text-accent'
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
        className="block size-12 rounded-full p-[3px] shadow-md transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:transition-none"
        style={{
          background: `conic-gradient(var(--color-accent) ${progress * 360}deg, var(--color-line) 0)`,
        }}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="flex size-full items-center justify-center rounded-full bg-background text-accent">
          ☰
        </span>
      </button>
    </div>
  );
};

export default Fab;
