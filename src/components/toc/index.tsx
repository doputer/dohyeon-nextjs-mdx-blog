import type { Post } from '@/lib/mdx/types';
import { cn } from '@/utils/cn';

interface TOCProps {
  toc: Post['toc'];
}

const TOC = ({ toc }: TOCProps) => {
  if (toc.length === 0) return null;

  return (
    <nav aria-label="목차">
      <details className="group">
        <summary className="cursor-pointer font-medium text-muted transition-colors duration-200 ease-out group-open:text-main hover:text-main">
          목차
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
