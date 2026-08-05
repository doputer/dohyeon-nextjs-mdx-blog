'use client';

import Highlight from '@/components/search/highlight';
import { cn } from '@/utils/cn';

export interface Heading {
  id: string;
  text: string;
  depth: number;
  current: boolean;
}

/**
 * 헤딩의 `scroll-mt-12`(48px)와 같은 기준선. 이 선까지 올라온 마지막 헤딩을 지금 읽는 섹션으로 본다.
 * 목차로 이동한 직후의 헤딩이 서브픽셀 오차(48.4px 등)로 빠지지 않게 1px 여유를 둔다.
 */
const ANCHOR = 49;

/** 헤딩 끝에는 `<Anchor />`가 '#'을 덧붙이므로 텍스트를 모을 때 링크 자식은 뺀다. */
const toText = (heading: HTMLHeadingElement) =>
  [...heading.childNodes]
    .filter((node) => node.nodeName !== 'A')
    .map((node) => node.textContent)
    .join('')
    .trim();

/**
 * 현재 글의 목차를 여는 시점의 DOM에서 읽는다.
 * `<article>`은 글 페이지에만 있으므로 목록·태그 페이지에서는 빈 배열이 된다.
 */
export const readHeadings = (): Heading[] => {
  const headings = [
    ...document.querySelectorAll<HTMLHeadingElement>('article h2, article h3'),
  ].filter((heading) => heading.id);

  let current = -1;
  headings.forEach((heading, index) => {
    if (heading.getBoundingClientRect().top <= ANCHOR) current = index;
  });

  return headings.map((heading, index) => ({
    id: heading.id,
    text: toText(heading),
    depth: Number(heading.tagName[1]),
    current: index === current,
  }));
};

interface TOCProps {
  headings: Heading[];
  tokens: string[];
  active: number;
  onActivate: (order: number) => void;
  onSelect: (order: number) => void;
}

const TOC = ({ headings, tokens, active, onActivate, onSelect }: TOCProps) => (
  <ul className="p-2">
    {headings.map(({ id, text, depth, current }, order) => (
      <li key={id}>
        <button
          data-active={order === active}
          className={cn(
            'relative w-full rounded py-1.5 pr-2 text-left break-keep transition-colors duration-150 ease-out',
            depth === 3 ? 'pl-5.5' : 'pl-2',
            order === active ? 'bg-surface' : 'hover:bg-surface/60',
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
