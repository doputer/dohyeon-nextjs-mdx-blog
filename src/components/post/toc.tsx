import type { Post } from '@/lib/MDX/types';

import { cn } from '@/utils/cn';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface TOCProps {
  toc: Post['toc'];
}

const TOC = ({ toc }: TOCProps) => {
  if (toc.length === 0) return null;

  return (
    <details className="group rounded border border-line bg-surface/60 px-4 py-3">
      <summary className="flex list-none items-center justify-between font-medium text-muted select-none [&::-webkit-details-marker]:hidden">
        목차
        <ChevronDownIcon className="size-4 text-soft group-open:rotate-180" aria-hidden />
      </summary>

      <ul className="mt-3 space-y-1 border-t border-line pt-3 text-sm">
        {toc.map(({ id, text, depth }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={cn(
                'block rounded py-1 break-keep text-soft transition-colors duration-150 ease-out hover:text-accent',
                depth === 3 && 'pl-4'
              )}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
};

export default TOC;
