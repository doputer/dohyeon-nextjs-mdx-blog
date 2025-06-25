'use client';

import useObserver from '@/hooks/useObserver';
import useScroll from '@/hooks/useScroll';
import type { Post } from '@/lib/MDX/types';
import { cn } from '@/utils/cn';

interface TOCProps {
  toc: Post['toc'];
}

const TOC = ({ toc }: TOCProps) => {
  const activeId = useObserver();
  const scrollToTarget = useScroll();

  return (
    <aside className="static left-full h-full xl:absolute">
      <div className="border-line sticky top-32 mb-4 w-fit rounded-lg border p-4 text-sm md:mb-8 xl:mb-0 xl:ml-8 xl:border-0 xl:p-0 xl:text-base">
        <ul className="flex flex-col gap-2 xl:text-nowrap">
          {toc.map(({ id, text, depth }) => (
            <li
              key={id}
              className={cn(
                'xl:text-subtle cursor-pointer',
                id === activeId && 'xl:text-primary xl:font-medium',
                depth === 3 && 'pl-4'
              )}
              onClick={() => scrollToTarget({ id })}
            >
              {text}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default TOC;
