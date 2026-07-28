'use client';

import type { Post } from '@/lib/MDX/types';

import Fab from '@/components/toc/fab';
import useObserver from '@/hooks/use-observer';
import useScroll from '@/hooks/use-scroll';
import { cn } from '@/utils/cn';

export interface TOCProps {
  toc: Post['toc'];
}

const TOC = ({ toc }: TOCProps) => {
  const activeId = useObserver();
  const scrollToTarget = useScroll();

  return (
    <>
      <aside className="left-full hidden h-full lg:absolute lg:block">
        <nav className="sticky top-32 ml-8 border-l border-line pl-4">
          <p className="mb-2 text-[11px] font-semibold tracking-[0.14em] text-soft uppercase">
            On this page
          </p>
          <ul className="flex flex-col gap-2 text-sm text-nowrap">
            {toc.map(({ id, text, depth }) => (
              <li key={id} className={cn('relative', depth === 3 && 'pl-4')}>
                <button
                  className={cn(
                    'text-soft transition-colors duration-300 ease-out hover:text-main',
                    id === activeId && 'font-medium text-accent hover:text-accent',
                    id === activeId &&
                      'before:absolute before:top-1 before:bottom-1 before:-left-[17px] before:w-0.5 before:rounded before:bg-accent'
                  )}
                  onClick={() => scrollToTarget(id)}
                >
                  {text}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <Fab toc={toc} />
    </>
  );
};

export default TOC;
