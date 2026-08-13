import type { ReactNode } from 'react';

import { findRanges } from '@/lib/search/match';

interface HighlightProps {
  text: string;
  tokens: string[];
}

const Highlight = ({ text, tokens }: HighlightProps) => {
  if (tokens.length === 0) return text;

  const ranges = findRanges(text, tokens);

  if (ranges.length === 0) return text;

  const nodes: ReactNode[] = [];
  let cursor = 0;

  for (const [start, end] of ranges) {
    if (start > cursor) nodes.push(text.slice(cursor, start));

    nodes.push(
      <mark key={start} className="bg-transparent font-bold text-accent">
        {text.slice(start, end)}
      </mark>
    );

    cursor = end;
  }

  if (cursor < text.length) nodes.push(text.slice(cursor));

  return <>{nodes}</>;
};

export default Highlight;
