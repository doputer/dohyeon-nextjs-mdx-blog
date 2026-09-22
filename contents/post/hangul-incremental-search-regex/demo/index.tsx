'use client';

import { type ReactNode } from 'react';

import { compile, findRanges, tokenize } from '#/hangul-incremental-search-regex/engine/match';
import useTyping from '#/hangul-incremental-search-regex/hook/use-typing';
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
    <section className="my-8 rounded border border-line">
      <div className="p-4">
        <input
          ref={ref}
          type="text"
          placeholder="한글을 입력해보세요"
          aria-label="검색어"
          onChange={onChange}
          className="min-h-6 w-full border-b border-line bg-transparent pb-2 text-main outline-none placeholder:text-muted"
        />

        <p className="mt-3 font-mono text-sm break-all whitespace-pre-line text-muted">
          {sources.length > 0 ? sources.join(' ') : '\n'}
        </p>
      </div>

      <ul className="space-y-1.5 border-t border-line bg-surface p-4">
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
    </section>
  );
};

export default Demo;
