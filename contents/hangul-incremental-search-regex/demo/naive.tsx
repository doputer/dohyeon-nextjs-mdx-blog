'use client';

import { type ReactNode } from 'react';

import useTyping from '#/hangul-incremental-search-regex/demo/use-typing';

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
    <section className="space-y-2.5">
      <div className="border-2 border-line p-4">
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

      <fieldset aria-label="검색어" className="flex flex-col gap-2">
        <input
          ref={ref}
          type="text"
          placeholder="검색어를 입력해보세요"
          aria-label="검색어"
          onChange={onChange}
          className="min-w-0 flex-1 border border-line bg-background px-2.5 py-1.5 text-sm text-main outline-none placeholder:text-soft focus:border-muted"
        />

        <p className="min-h-4 font-mono text-xs text-muted">
          {query === '' ? '' : `includes("${query}")`}
        </p>
      </fieldset>
    </section>
  );
};

export default Naive;
