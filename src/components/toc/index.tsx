'use client';

import useObserver from '@/hooks/use-observer';
import useScroll from '@/hooks/use-scroll';
import type { Post } from '@/lib/MDX/types';
import { cn } from '@/utils/cn';

interface TOCProps {
  toc: Post['toc'];
}

const TOC = ({ toc }: TOCProps) => {
  const activeId = useObserver();
  const scrollToTarget = useScroll();

  return (
    <aside className="left-full h-full lg:absolute">
      <ul className="sticky top-32 flex w-fit list-inside flex-col gap-2 text-nowrap lg:ml-8">
        {toc.map(({ id, text, depth }) => (
          <li key={id} className={cn('list-disc lg:list-none', depth === 3 && 'pl-4')}>
            <button
              className={cn(
                'transition-colors duration-300 ease-out lg:text-subtle lg:hover:text-subtle/70',
                id === activeId && 'lg:font-medium lg:text-primary lg:hover:text-primary'
              )}
              onClick={() => scrollToTarget({ id })}
            >
              {text}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default TOC;
