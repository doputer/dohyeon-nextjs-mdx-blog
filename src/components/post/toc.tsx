import { ChevronDownIcon } from '@heroicons/react/24/outline';

import type { Post } from '@/lib/MDX/types';
import { cn } from '@/utils/cn';

interface TOCProps {
  toc: Post['toc'];
}

const TOC = ({ toc }: TOCProps) => {
  if (toc.length === 0) return null;

  return (
    <nav aria-label="목차">
      <details className="group open:border-b open:border-line open:pb-3">
        <summary className="flex cursor-pointer list-none items-center justify-between border-b border-line pb-2 text-xs font-medium tracking-[0.08em] text-muted transition-colors duration-200 ease-out select-none hover:text-main [&::-webkit-details-marker]:hidden">
          목차
          <ChevronDownIcon
            className="size-3.5 transition-transform duration-200 ease-out group-open:rotate-180"
            aria-hidden
          />
        </summary>

        <ul className="mt-3 space-y-0.5 text-sm">
          {toc.map(({ id, text, depth }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={cn(
                  'block py-1 break-keep text-muted transition-colors duration-150 ease-out hover:text-main',
                  depth === 3 && 'pl-4'
                )}
              >
                {text}
              </a>
            </li>
          ))}
        </ul>
      </details>
    </nav>
  );
};

export default TOC;
