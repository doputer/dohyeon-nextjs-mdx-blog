'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

import Results from '@/components/search/results';
import { tokenize } from '@/lib/search/match';
import { prepareIndex, search } from '@/lib/search/score';
import type { PreparedDocument, SearchDocument, SearchResult } from '@/lib/search/types';

const RECENT_POST_COUNT = 5;
const RESULT_LIMIT = 8;
const PRELOAD_DELAY = 120;

type PanelState = 'failed' | 'loading' | 'empty' | 'recent' | 'matched';

const PANEL_MESSAGE: Partial<Record<PanelState, string>> = {
  failed: '검색 인덱스를 불러오지 못했습니다.',
  loading: '불러오는 중…',
  empty: '결과가 없습니다.',
};

const Search = () => {
  const router = useRouter();

  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const loadRequested = useRef(false);
  const preloadTimer = useRef(0);

  const [searchIndex, setSearchIndex] = useState<PreparedDocument[] | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const load = useCallback(async () => {
    if (loadRequested.current) return;
    loadRequested.current = true;

    try {
      const response = await fetch('/api/search');

      if (!response.ok) throw new Error(String(response.status));

      const documents: SearchDocument[] = await response.json();

      setSearchIndex(prepareIndex(documents));
    } catch {
      loadRequested.current = false;
      setLoadFailed(true);
    }
  }, []);

  const cancelPreload = useCallback(() => {
    window.clearTimeout(preloadTimer.current);
    preloadTimer.current = 0;
  }, []);

  const schedulePreload = useCallback(
    (event: React.PointerEvent) => {
      if (event.pointerType !== 'mouse' || loadRequested.current) return;

      cancelPreload();
      preloadTimer.current = window.setTimeout(() => void load(), PRELOAD_DELAY);
    },
    [cancelPreload, load]
  );

  useEffect(() => cancelPreload, [cancelPreload]);

  const open = useCallback(() => {
    cancelPreload();
    setLoadFailed(false);
    dialogRef.current?.showModal();
    inputRef.current?.focus();
    void load();
  }, [cancelPreload, load]);

  const close = useCallback(() => dialogRef.current?.close(), []);

  const goToPost = useCallback(
    (slug: string) => {
      close();
      router.push(`/${slug}`);
    },
    [close, router]
  );

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'k' || !(event.metaKey || event.ctrlKey)) return;

      event.preventDefault();

      if (dialogRef.current?.open) close();
      else open();
    };

    document.addEventListener('keydown', handleShortcut);

    return () => document.removeEventListener('keydown', handleShortcut);
  }, [open, close]);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    const handleClose = () => {
      setQuery('');
      setActiveIndex(0);
    };

    dialog.addEventListener('close', handleClose);

    return () => dialog.removeEventListener('close', handleClose);
  }, []);

  const tokens = useMemo(() => tokenize(query), [query]);

  const results = useMemo<SearchResult[]>(() => {
    if (!searchIndex) return [];
    if (tokens.length === 0)
      return searchIndex
        .slice(0, RECENT_POST_COUNT)
        .map((prepared) => ({ document: prepared.document, score: 0 }));

    return search(searchIndex, tokens, RESULT_LIMIT);
  }, [searchIndex, tokens]);

  const panelState = useMemo<PanelState>(() => {
    if (loadFailed) return 'failed';
    if (!searchIndex) return 'loading';
    if (results.length === 0) return 'empty';

    return tokens.length === 0 ? 'recent' : 'matched';
  }, [loadFailed, searchIndex, tokens, results]);

  const panelMessage = PANEL_MESSAGE[panelState];

  const select = useCallback(
    (order: number) => {
      const result = results[order];
      if (result) goToPost(result.document.slug);
    },
    [results, goToPost]
  );

  const changeQuery = (value: string) => {
    setQuery(value);
    setActiveIndex(0);
  };

  useEffect(() => {
    if (results.length === 0) return;

    panelRef.current
      ?.querySelector(`[data-order="${activeIndex}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, results]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (results.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((previous) => (previous + 1) % results.length);
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((previous) => (previous - 1 + results.length) % results.length);
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      select(activeIndex);
    }
  };

  return (
    <>
      <button
        type="button"
        aria-label="검색"
        aria-keyshortcuts="Meta+K Control+K"
        className="text-muted transition-colors duration-200 ease-out hover:text-main"
        onClick={open}
        onPointerEnter={schedulePreload}
        onPointerLeave={cancelPreload}
        onFocus={() => void load()}
      >
        검색
      </button>

      <dialog
        ref={dialogRef}
        aria-label="글 검색"
        className="mx-auto mt-[12vh] mb-auto w-[calc(100vw-2rem)] max-w-140 overflow-hidden rounded border border-line bg-background p-0 text-main shadow-lg backdrop:bg-(--overlay) open:animate-panel-in motion-reduce:animate-none"
        onClick={(event) => {
          if (event.target === dialogRef.current) close();
        }}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <MagnifyingGlassIcon className="size-4 shrink-0 text-soft" aria-hidden />
          <input
            ref={inputRef}
            type="text"
            aria-label="검색어"
            autoComplete="off"
            spellCheck={false}
            className="h-12 w-full bg-transparent outline-none placeholder:text-muted"
            placeholder="제목·본문 검색"
            value={query}
            onChange={(event) => changeQuery(event.target.value)}
          />
          <kbd className="hidden shrink-0 rounded border border-line px-1.5 py-0.5 text-xs text-muted select-none sm:block">
            ESC
          </kbd>
        </div>

        <div
          ref={panelRef}
          className="scrollbar-none max-h-[60vh] overflow-y-auto overscroll-contain"
        >
          {panelMessage ? (
            <p className="px-4 py-10 text-center text-sm text-muted">{panelMessage}</p>
          ) : (
            <>
              <p className="px-4 pt-3 text-xs font-medium text-muted select-none">
                {panelState === 'recent' ? '최근 글' : `${results.length}개 결과`}
              </p>
              <Results
                results={results}
                tokens={tokens}
                activeIndex={activeIndex}
                onActivate={setActiveIndex}
                onSelect={select}
              />
            </>
          )}
        </div>
      </dialog>
    </>
  );
};

export default Search;
