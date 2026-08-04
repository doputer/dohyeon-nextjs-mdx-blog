'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { PreparedDocument, SearchDocument, SearchResult } from '@/lib/search/types';

import Highlight from '@/components/search/highlight';
import { prepare, search, snippet, tokenize } from '@/lib/search/match';
import { cn } from '@/utils/cn';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

// 질의가 비었을 때 보여줄 최근 글 수
const RECENT = 5;
const LIMIT = 8;

const Search = () => {
  const router = useRouter();

  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const requested = useRef(false);

  const [index, setIndex] = useState<PreparedDocument[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const load = useCallback(async () => {
    if (requested.current) return;
    requested.current = true;

    try {
      const response = await fetch('/api/search');

      if (!response.ok) throw new Error(String(response.status));

      const documents: SearchDocument[] = await response.json();

      setIndex(prepare(documents));
    } catch {
      requested.current = false;
      setFailed(true);
    }
  }, []);

  const open = useCallback(() => {
    setFailed(false);
    dialogRef.current?.showModal();
    inputRef.current?.focus();
    load();
  }, [load]);

  const close = useCallback(() => dialogRef.current?.close(), []);

  const go = useCallback(
    (slug: string) => {
      close();
      router.push(`/${slug}`);
    },
    [close, router]
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

  const tokens = useMemo(() => tokenize(query), [query]);

  const results = useMemo<SearchResult[]>(() => {
    if (!index) return [];
    if (tokens.length === 0)
      return index.slice(0, RECENT).map((document) => ({ document: document.document, score: 0 }));

    return search(index, tokens, LIMIT);
  }, [index, tokens]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [active, results]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (results.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((prev) => (prev + 1) % results.length);
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((prev) => (prev - 1 + results.length) % results.length);
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      const result = results[active];
      if (result) go(result.document.slug);
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
            placeholder="제목·태그·본문 검색, 초성도 가능"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <kbd className="hidden shrink-0 rounded border border-line px-1.5 py-0.5 text-[11px] text-soft select-none sm:block">
            ESC
          </kbd>
        </div>

        <div className="scrollbar-none max-h-[60vh] overflow-y-auto">
          {failed && (
            <p className="px-4 py-10 text-center text-sm text-soft">
              검색 인덱스를 불러오지 못했습니다.
            </p>
          )}

          {!failed && !index && (
            <p className="px-4 py-10 text-center text-sm text-soft">불러오는 중…</p>
          )}

          {index && results.length === 0 && (
            <p className="px-4 py-10 text-center text-sm text-soft">결과가 없습니다.</p>
          )}

          {results.length > 0 && (
            <>
              <p className="px-4 pt-3 text-xs font-medium tracking-wide text-soft uppercase select-none">
                {tokens.length === 0 ? '최근 글' : `${results.length}개 결과`}
              </p>
              <ul ref={listRef} className="p-2">
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
                          'w-full rounded px-2 py-2.5 text-left transition-colors duration-150 ease-out',
                          order === active ? 'bg-surface' : 'hover:bg-surface/60'
                        )}
                        onClick={() => go(document.slug)}
                        onMouseMove={() => setActive(order)}
                      >
                        <span className="flex items-baseline gap-2">
                          <span aria-hidden className="shrink-0 text-sm">
                            {document.emoji}
                          </span>
                          <span className="flex-1 font-medium break-keep">
                            <Highlight text={document.title} tokens={tokens} />
                          </span>
                          <time
                            dateTime={document.date}
                            className="shrink-0 text-xs text-soft tabular-nums"
                          >
                            {format(document.date, 'yyyy.MM')}
                          </time>
                        </span>

                        {excerpt && (
                          <span className="mt-1 line-clamp-2 pl-6 text-[13px] leading-6 break-keep text-soft">
                            <Highlight text={excerpt} tokens={tokens} />
                          </span>
                        )}

                        {document.tags.length > 0 && (
                          <span className="mt-1 flex flex-wrap gap-x-2 pl-6 text-[11px] text-soft">
                            {document.tags.map((tag) => (
                              <span key={tag}>
                                <span aria-hidden>#</span>
                                <Highlight text={tag} tokens={tokens} />
                              </span>
                            ))}
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
