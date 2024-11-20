'use client';

import { ArrowUpIcon, ChatBubbleOvalLeftIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

import ThemeSwitch from '@/components/ThemeSwitch';
import useObserver from '@/hooks/useObserver';
import useScroll from '@/hooks/useScroll';
import type { Post } from '@/lib/MDX/types';

interface TOCProps {
  toc: Post['toc'];
}

const TOC = ({ toc }: TOCProps) => {
  const activeId = useObserver();
  const scrollToTarget = useScroll();

  return (
    <aside className="absolute left-full hidden h-full xl:block">
      <div className="sticky top-32 ml-8">
        <ul className="flex flex-col text-nowrap border-l border-line pl-4 text-sm">
          <li className="py-1 font-medium">On this page</li>
          {toc.map(({ id, text, depth }) => (
            <li
              key={id}
              className={clsx('cursor-pointer py-1 font-light', {
                'text-secondary': id === activeId,
                'pl-4': depth === 3,
              })}
              onClick={() => scrollToTarget({ id })}
            >
              {text}
            </li>
          ))}
        </ul>
        <div className="flex justify-start gap-4 px-4 pt-2">
          <ThemeSwitch position="toc" />
          <button
            onClick={() => scrollToTarget({ page: 'bottom' })}
            aria-label="Scroll Bottom Button"
          >
            <ChatBubbleOvalLeftIcon className="size-5 text-muted hover:text-secondary" />
          </button>
          <button onClick={() => scrollToTarget({ page: 'top' })} aria-label="Scroll Top Button">
            <ArrowUpIcon className="size-5 text-muted hover:text-secondary" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default TOC;
