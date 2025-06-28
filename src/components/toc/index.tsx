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
      <ul className="sticky top-32 flex w-fit list-inside flex-col gap-2 xl:ml-8 xl:text-nowrap">
        {toc.map(({ id, text, depth }) => (
          <li key={id} className="list-disc xl:list-none">
            <button
              className={cn(
                'xl:text-subtle xl:hover:text-subtle/70 transition-colors duration-300 ease-out',
                id === activeId && 'xl:text-primary xl:hover:text-primary xl:font-medium',
                depth === 3 && 'pl-4'
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
