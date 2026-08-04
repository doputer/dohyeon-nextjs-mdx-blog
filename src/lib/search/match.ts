import type { PreparedDocument, SearchDocument, SearchResult } from '@/lib/search/types';

import { hasJamo, toChosung, toLower } from '@/lib/search/hangul';

type Range = [start: number, end: number];

// 필드별 가중치. 제목에서 맞으면 본문에서 맞은 것보다 10배 무겁다.
const WEIGHT = { title: 10, tags: 5, headings: 3, description: 2, body: 1 };

// 배열 필드는 줄바꿈으로 이어 붙인다. \n 은 단어 경계로도 취급되므로 항목이 섞이지 않는다.
const JOIN = '\n';

const BOUNDARY = /[\s\-_/.,()[\]{}:;!?'"`~]/;

const isBoundary = (text: string, index: number) => index === 0 || BOUNDARY.test(text[index - 1]);

export const tokenize = (query: string) =>
  query.normalize('NFC').toLowerCase().split(/\s+/).filter(Boolean);

export const prepare = (documents: SearchDocument[]): PreparedDocument[] =>
  documents.map((document) => ({
    document,
    fields: [
      { weight: WEIGHT.title, text: document.title },
      { weight: WEIGHT.tags, text: document.tags.join(JOIN) },
      { weight: WEIGHT.headings, text: document.headings.join(JOIN) },
      { weight: WEIGHT.description, text: document.description },
      { weight: WEIGHT.body, text: document.body },
    ].map(({ weight, text }) => {
      const lower = toLower(text);

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
  const lower = toLower(text);
  const chosung = toChosung(lower);
  const ranges: Range[] = [];

  for (const token of tokens) {
    for (const target of hasJamo(token) ? [lower, chosung] : [lower]) {
      let from = 0;

      while (from <= target.length - token.length) {
        const index = target.indexOf(token, from);

        if (index === -1) break;

        ranges.push([index, index + token.length]);
        from = index + token.length;
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
  const lower = toLower(body);
  const chosung = toChosung(lower);

  const coveredLower = toLower(covered);
  const coveredChosung = toChosung(coveredLower);
  const isCovered = (token: string) =>
    coveredLower.includes(token) || (hasJamo(token) && coveredChosung.includes(token));

  const uncovered = tokens.filter((token) => !isCovered(token));
  const targets = uncovered.length > 0 ? uncovered : tokens;

  let at = -1;

  for (const token of targets) {
    const direct = lower.indexOf(token);
    const found = direct !== -1 ? direct : hasJamo(token) ? chosung.indexOf(token) : -1;

    if (found !== -1 && (at === -1 || found < at)) at = found;
  }

  if (at === -1) return '';

  const start = Math.max(0, at - radius);
  const end = Math.min(body.length, at + radius);

  return [start > 0 ? '…' : '', body.slice(start, end).trim(), end < body.length ? '…' : ''].join(
    ''
  );
};
