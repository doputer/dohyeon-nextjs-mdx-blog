'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { Heading } from '@/components/search/toc';
import type { PreparedDocument, SearchDocument, SearchResult } from '@/lib/search/types';

import Highlight from '@/components/search/highlight';
import TOC, { readHeadings } from '@/components/search/toc';
import useScroll from '@/hooks/use-scroll';
import { matchesAll, snippet, tokenize } from '@/lib/search/match';
import { prepareIndex, search } from '@/lib/search/score';
import { cn } from '@/utils/cn';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

// 질의가 비었을 때 보여줄 최근 글 수
const RECENT_COUNT = 5;
const RESULT_LIMIT = 8;

const Search = () => {
  const router = useRouter();

  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const loadRequested = useRef(false);

  const [index, setIndex] = useState<PreparedDocument[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [headings, setHeadings] = useState<Heading[]>([]);

  const scrollToTarget = useScroll();

  const load = useCallback(async () => {
    if (loadRequested.current) return;
    loadRequested.current = true;

    try {
      const response = await fetch('/api/search');

      if (!response.ok) throw new Error(String(response.status));

      const documents: SearchDocument[] = await response.json();

      setIndex(prepareIndex(documents));
    } catch {
      loadRequested.current = false;
      setFailed(true);
    }
  }, []);

  // 목차는 열 때마다 DOM에서 다시 읽는다. 글을 옮겨 다녀도 현재 글과 읽던 위치가 반영된다.
  const open = useCallback(() => {
    setFailed(false);
    setHeadings(readHeadings());
    dialogRef.current?.showModal();
    inputRef.current?.focus();
    load();
  }, [load]);

  const close = useCallback(() => dialogRef.current?.close(), []);

  const goToPost = useCallback(
    (slug: string) => {
      close();
      router.push(`/${slug}`);
    },
    [close, router]
  );

  const jumpToHeading = useCallback(
    (id: string) => {
      close();
      scrollToTarget(id);
    },
    [close, scrollToTarget]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'k' || !(event.metaKey || event.ctrlKey)) return;

      event.preventDefault();

      if (dialogRef.current?.open) close();
      else open();
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, close]);

  // ESC·backdrop 등 어떤 경로로 닫혀도 상태를 되돌린다.
  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    const handleClose = () => {
      setQuery('');
      setActive(0);
    };

    dialog.addEventListener('close', handleClose);

    return () => dialog.removeEventListener('close', handleClose);
  }, []);

  // '#'으로 시작하면 글 전체를 뒤지지 않고 지금 읽는 글의 목차만 좁혀 나간다.
  const scoped = query.startsWith('#');
  const tokens = useMemo(() => tokenize(scoped ? query.slice(1) : query), [query, scoped]);

  const results = useMemo<SearchResult[]>(() => {
    if (!index || scoped) return [];
    if (tokens.length === 0)
      return index
        .slice(0, RECENT_COUNT)
        .map((prepared) => ({ document: prepared.document, score: 0 }));

    return search(index, tokens, RESULT_LIMIT);
  }, [index, scoped, tokens]);

  const filtered = useMemo(
    () => (scoped ? headings.filter(({ text }) => matchesAll(text, tokens)) : headings),
    [scoped, headings, tokens]
  );

  // 글 페이지에서 질의가 비어 있으면 최근 글 대신 목차를 띄우고, '#'이면 계속 목차에 머문다.
  const showTOC = (scoped || tokens.length === 0) && headings.length > 0;

  // 두 목록은 동시에 뜨지 않으므로 active 인덱스와 방향키 처리를 그대로 공유한다.
  const count = showTOC ? filtered.length : results.length;

  const select = useCallback(
    (order: number) => {
      if (showTOC) {
        const heading = filtered[order];
        if (heading) jumpToHeading(heading.id);
        return;
      }

      const result = results[order];
      if (result) goToPost(result.document.slug);
    },
    [showTOC, filtered, results, jumpToHeading, goToPost]
  );

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    panelRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [active, results, filtered]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (count === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((prev) => (prev + 1) % count);
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((prev) => (prev - 1 + count) % count);
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      select(active);
    }
  };

  return (
    <>
      <button
        aria-label="검색"
        aria-keyshortcuts="Meta+K Control+K"
        className="flex size-8 items-center justify-center transition-colors duration-300 ease-out hover:text-accent"
        onClick={open}
      >
        <MagnifyingGlassIcon className="size-6" />
      </button>

      <dialog
        ref={dialogRef}
        aria-label="글 검색"
        className={cn(
          'mx-auto mt-[12vh] mb-auto w-[calc(100vw-2rem)] max-w-140 p-0',
          'rounded border border-line bg-background text-main shadow-lg',
          'backdrop:bg-(--overlay) open:animate-panel-in motion-reduce:animate-none'
        )}
        onClick={(event) => {
          if (event.target === dialogRef.current) close();
        }}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <MagnifyingGlassIcon className="size-4 shrink-0 text-soft" aria-hidden />
          <input
            ref={inputRef}
            aria-label="검색어"
            className="h-12 w-full bg-transparent outline-none placeholder:text-soft"
            placeholder="제목·목차·본문 검색"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <kbd className="hidden shrink-0 rounded border border-line px-1.5 py-0.5 text-xs text-soft select-none sm:block">
            ESC
          </kbd>
        </div>

        <div ref={panelRef} className="scrollbar-none max-h-[60vh] overflow-y-auto">
          {showTOC && (
            <>
              <p className="flex items-center justify-between px-4 pt-3 text-sm font-medium tracking-wide text-soft uppercase select-none">
                목차
                {!scoped && <span className="font-normal">#으로 목차 검색</span>}
              </p>

              {filtered.length === 0 ? (
                <p className="px-4 py-10 text-center text-sm text-soft">
                  일치하는 섹션이 없습니다.
                </p>
              ) : (
                <TOC
                  headings={filtered}
                  tokens={tokens}
                  active={active}
                  onActivate={setActive}
                  onSelect={select}
                />
              )}
            </>
          )}

          {!showTOC && failed && (
            <p className="px-4 py-10 text-center text-sm text-soft">
              검색 인덱스를 불러오지 못했습니다.
            </p>
          )}

          {!showTOC && !failed && !index && (
            <p className="px-4 py-10 text-center text-sm text-soft">불러오는 중…</p>
          )}

          {!showTOC && index && results.length === 0 && (
            <p className="px-4 py-10 text-center text-sm text-soft">
              {/* 목록 페이지거나 헤딩 없는 글이면 좁힐 목차가 아예 없다. */}
              {scoped ? '검색할 목차가 없습니다.' : '결과가 없습니다.'}
            </p>
          )}

          {!showTOC && results.length > 0 && (
            <>
              <p className="px-4 pt-3 text-sm font-medium tracking-wide text-soft uppercase select-none">
                {tokens.length === 0 ? '최근 글' : `${results.length}개 결과`}
              </p>
              <ul className="p-2">
                {results.map(({ document }, order) => {
                  const excerpt =
                    tokens.length > 0
                      ? snippet(document.body, tokens, document.title) || document.description
                      : document.description;

                  return (
                    <li key={document.slug}>
                      <button
                        data-active={order === active}
                        className={cn(
                          'w-full rounded px-2 py-2 text-left transition-colors duration-150 ease-out',
                          order === active ? 'bg-surface' : 'hover:bg-surface/60'
                        )}
                        onClick={() => goToPost(document.slug)}
                        onMouseMove={() => setActive(order)}
                      >
                        <span className="flex items-baseline gap-2">
                          <span className="flex-1 font-medium break-keep">
                            <Highlight text={document.title} tokens={tokens} />
                          </span>
                          <time
                            dateTime={document.date}
                            className="shrink-0 text-sm text-soft tabular-nums"
                          >
                            {format(document.date, 'yyyy.MM')}
                          </time>
                        </span>

                        {excerpt && (
                          <span className="mt-1 line-clamp-2 text-sm leading-6 break-keep text-soft">
                            <Highlight text={excerpt} tokens={tokens} />
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      </dialog>
    </>
  );
};

export default Search;
