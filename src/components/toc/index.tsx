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
    <aside className="static left-full h-full xl:absolute">
      <div className="border-line sticky top-32 w-fit xl:ml-8">
        <ul className="flex list-inside flex-col gap-2 xl:text-nowrap">
          {toc.map(({ id, text, depth }) => (
            <li
              key={id}
              className={cn(
                'xl:text-subtle cursor-pointer list-disc xl:list-none',
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
