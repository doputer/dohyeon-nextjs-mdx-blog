import type { SearchResult } from '@/lib/search/types';

import Highlight from '@/components/search/highlight';
import { snippet } from '@/lib/search/match';
import { cn } from '@/utils/cn';
import { format } from 'date-fns';

interface ResultsProps {
  results: SearchResult[];
  tokens: string[];
  activeIndex: number;
  onActivate: (order: number) => void;
  onSelect: (order: number) => void;
}

export const LISTBOX_ID = 'search-results';
export const optionId = (order: number) => `search-result-${order}`;

const Results = ({ results, tokens, activeIndex, onActivate, onSelect }: ResultsProps) => (
  <ul id={LISTBOX_ID} role="listbox" aria-label="검색 결과" className="space-y-1 p-2">
    {results.map(({ document }, order) => {
      const excerpt =
        tokens.length > 0
          ? snippet(document.body, tokens, document.title) || document.description
          : document.description;

      return (
        <li
          key={document.slug}
          id={optionId(order)}
          role="option"
          aria-selected={order === activeIndex}
          data-active={order === activeIndex}
          className={cn(
            'cursor-pointer rounded px-2 py-2 text-left transition-colors duration-150 ease-out',
            order === activeIndex ? 'bg-surface' : 'hover:bg-surface/60'
          )}
          onClick={() => onSelect(order)}
          onMouseMove={() => onActivate(order)}
        >
          <span className="flex items-start gap-2">
            <span className="flex-1 font-medium break-keep">
              <Highlight text={document.title} tokens={tokens} />
            </span>
            <time dateTime={document.date} className="shrink-0 text-sm/6 text-soft tabular-nums">
              {format(document.date, 'yyyy.MM')}
            </time>
          </span>

          {excerpt && (
            <span className="mt-1 line-clamp-2 text-sm leading-6 break-keep text-soft">
              <Highlight text={excerpt} tokens={tokens} />
            </span>
          )}
        </li>
      );
    })}
  </ul>
);

export default Results;
