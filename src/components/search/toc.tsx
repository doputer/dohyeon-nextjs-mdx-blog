'use client';

import Highlight from '@/components/search/highlight';
import { cn } from '@/utils/cn';

export interface Heading {
  id: string;
  text: string;
  depth: number;
  current: boolean;
}

const HEADING_SCROLL_MARGIN = 48;
const SUBPIXEL_TOLERANCE = 1;
const ANCHOR_LINE = HEADING_SCROLL_MARGIN + SUBPIXEL_TOLERANCE;

const toHeadingText = (heading: HTMLHeadingElement) =>
  [...heading.childNodes]
    .filter((node) => node.nodeName !== 'A')
    .map((node) => node.textContent)
    .join('')
    .trim();

export const readHeadings = (): Heading[] => {
  const headings = [
    ...document.querySelectorAll<HTMLHeadingElement>('article h2, article h3'),
  ].filter((heading) => heading.id);

  let currentIndex = -1;

  headings.forEach((heading, index) => {
    if (heading.getBoundingClientRect().top <= ANCHOR_LINE) currentIndex = index;
  });

  return headings.map((heading, index) => ({
    id: heading.id,
    text: toHeadingText(heading),
    depth: Number(heading.tagName[1]),
    current: index === currentIndex,
  }));
};

interface TOCProps {
  headings: Heading[];
  tokens: string[];
  activeIndex: number;
  onActivate: (order: number) => void;
  onSelect: (order: number) => void;
}

const TOC = ({ headings, tokens, activeIndex, onActivate, onSelect }: TOCProps) => (
  <ul className="space-y-1 p-2">
    {headings.map(({ id, text, depth, current }, order) => (
      <li key={id}>
        <button
          data-active={order === activeIndex}
          className={cn(
            'relative block w-full rounded py-1.5 pr-2 text-left break-keep transition-colors duration-150 ease-out',
            depth === 3 ? 'pl-5.5' : 'pl-2',
            order === activeIndex ? 'bg-surface' : 'hover:bg-surface/60',
            current ? 'font-medium text-accent' : 'text-soft'
          )}
          onClick={() => onSelect(order)}
          onMouseMove={() => onActivate(order)}
        >
          <Highlight text={text} tokens={tokens} />
        </button>
      </li>
    ))}
  </ul>
);

export default TOC;
