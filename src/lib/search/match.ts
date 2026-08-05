import type { PreparedDocument, SearchDocument, SearchResult } from '@/lib/search/types';

import { hasJamo, toChosung } from '@/lib/search/hangul';

/*
 * 인덱스는 빌드 시점에 NFC로 정규화되므로 런타임에서는 소문자화만 한다.
 * 소문자화와 초성 치환은 한글·ASCII에서 길이를 보존하므로, 소문자·초성 문자열에서 얻은
 * 매치 인덱스를 원문에 그대로 쓸 수 있다 — 경계 판정과 하이라이트가 이 성질에 기댄다.
 */

type Range = [start: number, end: number];

// 필드별 가중치. 제목에서 맞으면 본문에서 맞은 것보다 10배 무겁다.
const WEIGHT = { title: 10, tags: 5, headings: 3, description: 2, body: 1 };

const BOUNDARY = /[\s\-_/.,()[\]{}:;!?'"`~]/;

const isBoundary = (text: string, index: number) => index === 0 || BOUNDARY.test(text[index - 1]);

/** 직접·초성 일치의 공통 규칙 — 원문에 있거나, 자음 토큰이면 초성 문자열에 있으면 된다. */
const containsToken = (lower: string, chosung: string, token: string) =>
  lower.includes(token) || (hasJamo(token) && chosung.includes(token));

export const tokenize = (query: string) =>
  query.normalize('NFC').toLowerCase().split(/\s+/).filter(Boolean);

export const prepare = (documents: SearchDocument[]): PreparedDocument[] =>
  documents.map((document) => ({
    document,
    fields: [
      { weight: WEIGHT.title, text: document.title },
      // 배열 필드는 줄바꿈으로 이어 붙인다. \n 은 단어 경계로도 취급되므로 항목이 섞이지 않는다.
      { weight: WEIGHT.tags, text: document.tags.join('\n') },
      { weight: WEIGHT.headings, text: document.headings.join('\n') },
      { weight: WEIGHT.description, text: document.description },
      { weight: WEIGHT.body, text: document.body },
    ].map(({ weight, text }) => {
      const lower = text.toLowerCase();

      return { weight, lower, chosung: toChosung(lower) };
    }),
  }));

/**
 * 한 필드에서 토큰이 얻는 점수. 0이면 미매치.
 * 직접 일치가 초성 일치보다, 단어 시작이 중간 일치보다 높다.
 */
const scoreField = (field: PreparedDocument['fields'][number], token: string) => {
  const direct = field.lower.indexOf(token);
  if (direct !== -1) return field.weight * (isBoundary(field.lower, direct) ? 2.5 : 1.5);

  if (!hasJamo(token)) return 0;

  const chosung = field.chosung.indexOf(token);
  if (chosung !== -1) return field.weight * (isBoundary(field.lower, chosung) ? 1.5 : 1);

  return 0;
};

/** 토큰 전부가 텍스트에 있는지. 순위가 필요 없는 곳(목차 필터)에서 쓴다. */
export const matches = (text: string, tokens: string[]) => {
  const lower = text.toLowerCase();
  const chosung = toChosung(lower);

  return tokens.every((token) => containsToken(lower, chosung, token));
};

/** 모든 토큰이 어딘가에서 맞아야 한다(AND). 토큰별 최고 점수를 더해 순위를 낸다. */
export const search = (index: PreparedDocument[], tokens: string[], limit: number) => {
  if (tokens.length === 0) return [];

  const matched: SearchResult[] = [];

  for (const { document, fields } of index) {
    let score = 0;
    let missed = false;

    for (const token of tokens) {
      let best = 0;
      for (const field of fields) best = Math.max(best, scoreField(field, token));

      if (best === 0) {
        missed = true;
        break;
      }

      score += best;
    }

    if (!missed) matched.push({ document, score });
  }

  return matched
    .toSorted(
      (a, b) =>
        b.score - a.score ||
        new Date(b.document.date).getTime() - new Date(a.document.date).getTime()
    )
    .slice(0, limit);
};

const mergeRanges = (ranges: Range[]) => {
  const merged: Range[] = [];

  for (const [start, end] of ranges.toSorted((a, b) => a[0] - b[0] || a[1] - b[1])) {
    const last = merged.at(-1);

    if (last && start <= last[1]) last[1] = Math.max(last[1], end);
    else merged.push([start, end]);
  }

  return merged;
};

/** 하이라이트할 구간. 초성 문자열은 원문과 인덱스가 같으므로 그대로 쓸 수 있다. */
export const findRanges = (text: string, tokens: string[]) => {
  const lower = text.toLowerCase();
  const chosung = toChosung(lower);
  const ranges: Range[] = [];

  for (const token of tokens) {
    for (const target of hasJamo(token) ? [lower, chosung] : [lower]) {
      let index = target.indexOf(token);

      while (index !== -1) {
        ranges.push([index, index + token.length]);
        index = target.indexOf(token, index + token.length);
      }
    }
  }

  return mergeRanges(ranges);
};

/**
 * 본문에서 매치 주변만 잘라 미리보기로 쓴다.
 * `covered`(제목 등)에 이미 드러난 토큰은 기준에서 빼야, 이미 보이는 단어가 아니라
 * 정작 궁금한 토큰의 문맥이 스니펫에 잡힌다.
 */
export const snippet = (body: string, tokens: string[], covered = '', radius = 60) => {
  const lower = body.toLowerCase();
  const chosung = toChosung(lower);

  const coveredLower = covered.toLowerCase();
  const coveredChosung = toChosung(coveredLower);

  const uncovered = tokens.filter((token) => !containsToken(coveredLower, coveredChosung, token));
  const targets = uncovered.length > 0 ? uncovered : tokens;

  let matchIndex = -1;

  for (const token of targets) {
    const direct = lower.indexOf(token);
    const found = direct !== -1 ? direct : hasJamo(token) ? chosung.indexOf(token) : -1;

    if (found !== -1 && (matchIndex === -1 || found < matchIndex)) matchIndex = found;
  }

  if (matchIndex === -1) return '';

  const start = Math.max(0, matchIndex - radius);
  const end = Math.min(body.length, matchIndex + radius);

  return [start > 0 ? '…' : '', body.slice(start, end).trim(), end < body.length ? '…' : ''].join(
    ''
  );
};
