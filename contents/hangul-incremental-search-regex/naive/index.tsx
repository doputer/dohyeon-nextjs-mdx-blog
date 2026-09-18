'use client';

import { type ReactNode } from 'react';

import useTyping from '#/hangul-incremental-search-regex/hook/use-typing';

const SAMPLES = [
  '미나리 재배 일지',
  '검색어 강조 알고리즘 개발기',
  '한글 입력기와 조합 중인 글자',
  '정규식으로 문서 찾기',
  '유니코드 한글 음절 배열',
  '고양이와 과일 가게',
];

const highlight = (text: string, query: string): ReactNode => {
  const parts = text.split(query);

  if (parts.length === 1) return text;

  return parts.flatMap((part, index) =>
    index === 0
      ? [part]
      : [
          <mark key={index} className="bg-transparent text-accent">
            {query}
          </mark>,
          part,
        ]
  );
};

const Naive = () => {
  const { ref, query, onChange } = useTyping();

  const matched = query === '' ? [] : SAMPLES.filter((sample) => sample.includes(query));

  return (
    <section className="my-8 rounded border border-line">
      <div className="p-4">
        <input
          ref={ref}
          type="text"
          placeholder="검색어를 입력해보세요"
          aria-label="검색어"
          onChange={onChange}
          className="min-h-6 w-full border-b border-line bg-transparent pb-2 text-main outline-none placeholder:text-muted"
        />

        <p className="mt-3 font-mono text-xs whitespace-pre-line text-muted">
          {query === '' ? '\n' : `includes("${query}")`}
        </p>
      </div>

      <div className="border-t border-line bg-surface p-4">
        {matched.length > 0 ? (
          <ul className="space-y-1.5">
            {matched.map((sample) => (
              <li key={sample} className="text-sm break-keep text-main">
                {highlight(sample, query)}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">결과 없음</p>
        )}
      </div>
    </section>
  );
};

export default Naive;
