import Highlight from '@/components/search/highlight';
import { snippet } from '@/lib/search/match';
import type { SearchResult } from '@/lib/search/types';
import { cn } from '@/utils/cn';
import { toYearMonth } from '@/utils/date';

interface ResultsProps {
  results: SearchResult[];
  tokens: string[];
  activeIndex: number;
  onActivate: (order: number) => void;
  onSelect: (order: number) => void;
}

const Results = ({ results, tokens, activeIndex, onActivate, onSelect }: ResultsProps) => (
  <ul className="space-y-1 p-2">
    {results.map(({ document }, order) => {
      const excerpt =
        tokens.length > 0
          ? snippet(document.body, tokens, document.title) || document.description
          : document.description;

      return (
        <li key={document.slug}>
          <button
            type="button"
            data-active={order === activeIndex}
            className={cn(
              'block w-full rounded px-2 py-2 text-left transition-colors duration-150 ease-out',
              order === activeIndex ? 'bg-surface' : 'hover:bg-surface'
            )}
            onClick={() => onSelect(order)}
            onMouseMove={() => onActivate(order)}
          >
            <span className="flex items-start gap-2">
              <span className="flex-1 font-medium break-keep">
                <Highlight text={document.title} tokens={tokens} />
              </span>
              <time dateTime={document.date} className="shrink-0 text-sm/6 text-muted tabular-nums">
                {toYearMonth(document.date)}
              </time>
            </span>

            {excerpt && (
              <span className="mt-1 line-clamp-2 text-sm leading-6 break-keep text-muted">
                <Highlight text={excerpt} tokens={tokens} />
              </span>
            )}
          </button>
        </li>
      );
    })}
  </ul>
);

export default Results;
