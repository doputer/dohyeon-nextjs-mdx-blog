'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { PreparedDocument, SearchDocument, SearchResult } from '@/lib/search/types';

import Results, { LISTBOX_ID, optionId } from '@/components/search/results';
import { tokenize } from '@/lib/search/match';
import { prepareIndex, search } from '@/lib/search/score';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const RECENT_POST_COUNT = 5;
const RESULT_LIMIT = 8;

type PanelState = 'failed' | 'loading' | 'empty' | 'recent' | 'matched';

const PANEL_MESSAGE: Partial<Record<PanelState, string>> = {
  failed: '검색 인덱스를 불러오지 못했습니다.',
  loading: '불러오는 중…',
  empty: '결과가 없습니다.',
};

const MESSAGE_CLASS = `px-4 py-10 text-center text-sm text-soft`;
const SECTION_LABEL_CLASS = `px-4 pt-3 text-sm font-medium tracking-wide text-soft uppercase select-none`;

const Search = () => {
  const router = useRouter();

  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const loadRequested = useRef(false);

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

  const open = useCallback(() => {
    setLoadFailed(false);
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

  const statusMessage = useMemo<string>(() => {
    switch (panelState) {
      case 'failed':
        return '검색 인덱스를 불러오지 못했습니다.';
      case 'loading':
        return '검색 인덱스를 불러오는 중입니다.';
      case 'empty':
        return '결과가 없습니다.';
      case 'recent':
        return `최근 글 ${results.length}개`;
      case 'matched':
        return `${results.length}개 결과`;
    }
  }, [panelState, results.length]);

  const panelMessage = PANEL_MESSAGE[panelState];

  const select = useCallback(
    (order: number) => {
      const result = results[order];
      if (result) goToPost(result.document.slug);
    },
    [results, goToPost]
  );

  useEffect(() => setActiveIndex(0), [query]);

  useEffect(() => {
    panelRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' });
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
        className="flex size-7 items-center justify-center transition-colors duration-300 ease-out hover:text-accent"
        onClick={open}
      >
        <MagnifyingGlassIcon />
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
            role="combobox"
            aria-label="검색어"
            aria-autocomplete="list"
            aria-controls={LISTBOX_ID}
            aria-expanded={results.length > 0}
            aria-activedescendant={results.length > 0 ? optionId(activeIndex) : undefined}
            autoComplete="off"
            spellCheck={false}
            className="h-12 w-full bg-transparent outline-none placeholder:text-soft"
            placeholder="제목·본문 검색"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <kbd className="hidden shrink-0 rounded border border-line px-1.5 py-0.5 text-xs text-soft select-none sm:block">
            ESC
          </kbd>
        </div>

        <p role="status" className="sr-only">
          {statusMessage}
        </p>

        <div
          ref={panelRef}
          className="scrollbar-none max-h-[60vh] overflow-y-auto overscroll-contain"
        >
          {panelMessage ? (
            <p className={MESSAGE_CLASS}>{panelMessage}</p>
          ) : (
            <>
              <p className={SECTION_LABEL_CLASS} aria-hidden>
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
