'use client';

import { ArrowUpIcon, ChatBubbleOvalLeftIcon, TagIcon, XMarkIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

import ThemeSwitch from '@/components/ThemeSwitch';
import useMenu from '@/hooks/useMenu';
import useScroll from '@/hooks/useScroll';
import type { Post } from '@/lib/MDX/types';

interface FloatingProps {
  toc: Post['toc'];
}

const Floating = ({ toc }: FloatingProps) => {
  const scrollToTarget = useScroll();
  const [open, toggleMenu] = useMenu();

  return (
    <div className="fixed right-4 bottom-4 space-y-2 xl:hidden">
      <div className="relative">
        <button
          className="border-line text-muted rounded-full border bg-white p-2 dark:bg-black"
          onClick={toggleMenu}
          aria-label="Open TOC Button"
        >
          <TagIcon className="text-muted size-5" />
        </button>

        {open && (
          <div className="pointer-events-auto fixed top-0 left-0 z-10 h-full w-full bg-black/40 backdrop-blur-xs" />
        )}

        {open && (
          <button
            className="border-line absolute right-0 bottom-0 z-20 rounded-full border bg-white p-2 dark:bg-black"
            onClick={toggleMenu}
            aria-label="Close TOC Button"
          >
            <XMarkIcon className="text-muted size-5" />
          </button>
        )}

        {open && (
          <div className="border-line bg-background absolute right-0 bottom-full z-20 mb-2 rounded-lg border py-2">
            {toc.length > 0 && (
              <ul className="max-h-96 overflow-y-scroll text-sm text-nowrap">
                <li className="px-6 py-2 font-medium">On this page</li>
                {toc.map(({ id, text, depth }) => (
                  <li
                    key={id}
                    className={clsx('cursor-pointer px-6 py-2 font-light', {
                      'pl-10': depth === 3,
                    })}
                    onClick={() => scrollToTarget({ id })}
                  >
                    {text}
                  </li>
                ))}
              </ul>
            )}
            <div className="flex justify-end gap-4 px-6 py-2">
              <ThemeSwitch position="floating" />
              <button
                onClick={() => scrollToTarget({ page: 'bottom' })}
                aria-label="Scroll Bottom Button"
              >
                <ChatBubbleOvalLeftIcon className="text-muted size-5" />
              </button>
              <button
                onClick={() => scrollToTarget({ page: 'top' })}
                aria-label="Scroll Top Button"
              >
                <ArrowUpIcon className="text-muted size-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Floating;
