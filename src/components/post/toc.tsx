import { ChevronDownIcon } from '@heroicons/react/16/solid';

import type { Post } from '@/lib/MDX/types';
import { cn } from '@/utils/cn';

interface TOCProps {
  toc: Post['toc'];
}

const TOC = ({ toc }: TOCProps) => {
  if (toc.length === 0) return null;

  return (
    <nav aria-label="목차">
      <details className="group">
        <summary className="flex w-fit cursor-pointer list-none items-center gap-1 font-medium text-muted transition-colors duration-200 ease-out select-none hover:text-main [&::-webkit-details-marker]:hidden">
          목차
          <ChevronDownIcon
            className="size-4 transition-transform duration-200 ease-out group-open:rotate-180"
            aria-hidden
          />
        </summary>

        <ul className="mt-2">
          {toc.map(({ id, text, depth }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={cn(
                  'block w-fit py-1 break-keep text-muted transition-colors duration-200 ease-out hover:text-main',
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
