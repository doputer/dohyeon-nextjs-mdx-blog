'use client';

import { type ReactNode } from 'react';

import { compile, findRanges, tokenize } from '#/hangul-incremental-search-regex/demo/match';
import useTyping from '#/hangul-incremental-search-regex/demo/use-typing';
import { cn } from '@/utils/cn';

const SAMPLES = [
  '미나리 재배 일지',
  '검색어 강조 알고리즘 개발기',
  '한글 입력기와 조합 중인 글자',
  '정규식으로 문서 찾기',
  '유니코드 한글 음절 배열',
  '고양이와 과일 가게',
];

const highlight = (text: string, tokens: string[]): ReactNode => {
  const ranges = findRanges(text, tokens);

  if (ranges.length === 0) return text;

  const nodes: ReactNode[] = [];
  let cursor = 0;

  for (const [start, end] of ranges) {
    if (start > cursor) nodes.push(text.slice(cursor, start));

    nodes.push(
      <mark key={start} className="bg-transparent text-accent">
        {text.slice(start, end)}
      </mark>
    );

    cursor = end;
  }

  if (cursor < text.length) nodes.push(text.slice(cursor));

  return nodes;
};

const Demo = () => {
  const { ref, query, onChange } = useTyping();

  const tokens = tokenize(query);
  const sources = tokens.map((token) => compile(token).source);

  return (
    <section className="space-y-2.5">
      <ul className="space-y-1.5 rounded border-2 border-line bg-surface p-4">
        {SAMPLES.map((sample) => {
          const matched =
            tokens.length > 0 && tokens.every((token) => compile(token).test(sample.toLowerCase()));

          return (
            <li
              key={sample}
              className={cn('text-sm break-keep', matched ? 'text-main' : 'text-muted opacity-40')}
            >
              {matched ? highlight(sample, tokens) : sample}
            </li>
          );
        })}
      </ul>

      <div className="flex flex-col gap-2 rounded border border-line bg-surface p-3">
        <input
          ref={ref}
          type="text"
          placeholder="한글을 입력해보세요"
          aria-label="검색어"
          onChange={onChange}
          className="min-w-0 flex-1 rounded border border-line bg-background px-2.5 py-1.5 text-sm text-main outline-none placeholder:text-soft focus:border-muted"
        />

        <p className="min-h-4 font-mono text-xs break-all text-muted">{sources.join(' ')}</p>
      </div>
    </section>
  );
};

export default Demo;
