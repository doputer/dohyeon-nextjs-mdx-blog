'use client';

import { ArrowUpIcon, ChatBubbleOvalLeftIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

import ThemeSwitch from '@/components/theme-switch';
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
        <ul className="border-line flex flex-col border-l pl-4 text-sm text-nowrap">
          <li className="py-1 font-medium">On this page</li>
          {toc.map(({ id, text, depth }) => (
            <li
              key={id}
              className={clsx('cursor-pointer py-1 font-light', {
                'text-link': id === activeId,
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
            <ChatBubbleOvalLeftIcon className="text-subtle hover:text-link size-5" />
          </button>
          <button onClick={() => scrollToTarget({ page: 'top' })} aria-label="Scroll Top Button">
            <ArrowUpIcon className="text-subtle hover:text-link size-5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default TOC;
