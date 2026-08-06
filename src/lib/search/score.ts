import type { TokenPattern } from '@/lib/search/match';
import type { PreparedDocument, SearchDocument, SearchResult } from '@/lib/search/types';

import { compile, findFirstMatch } from '@/lib/search/match';

/*
 * 문서에 점수를 매겨 순위를 낸다. 맞는 자리를 찾는 일은 match.ts 가 하고,
 * 여기서는 어느 필드에서 맞았나와 단어 시작인가만 보고 무게를 매긴다.
 */

interface FieldSpec {
  weight: number;
  read: (document: SearchDocument) => string;
}

/** 필드별 가중치. 제목에서 맞으면 본문에서 맞은 것보다 10배 무겁다. */
const FIELDS: FieldSpec[] = [
  { weight: 10, read: (document) => document.title },
  // 배열 필드는 줄바꿈으로 이어 붙인다. \n 은 단어 경계로도 취급되므로 항목이 섞이지 않는다.
  { weight: 3, read: (document) => document.headings.join('\n') },
  { weight: 1, read: (document) => document.body },
];

/** 글자 그대로 맞은 쪽이 느슨하게 맞은 쪽보다, 단어 시작이 중간 일치보다 높다. */
const MULTIPLIER = {
  exact: { boundary: 2.5, inside: 1.5 },
  partial: { boundary: 1.5, inside: 1 },
};

const BOUNDARY = /[\s\-_/.,()[\]{}:;!?'"`~]/;

const isBoundary = (text: string, index: number) => index === 0 || BOUNDARY.test(text[index - 1]);

/** 문서마다 검색 대상 필드를 소문자로 펼쳐 둔다. 반복 소문자화를 인덱스 적재 시 한 번으로 묶는다. */
export const prepare = (documents: SearchDocument[]): PreparedDocument[] =>
  documents.map((document) => ({
    document,
    fields: FIELDS.map(({ weight, read }) => ({ weight, lower: read(document).toLowerCase() })),
  }));

/** 한 필드에서 토큰이 얻는 점수. 0이면 미매치. */
const scoreField = (field: PreparedDocument['fields'][number], pattern: TokenPattern) => {
  const match = findFirstMatch(field.lower, pattern);

  if (!match) return 0;

  const position = isBoundary(field.lower, match.index) ? 'boundary' : 'inside';

  return field.weight * MULTIPLIER[match.kind][position];
};

/** 모든 토큰이 어딘가에서 맞아야 한다(AND). 토큰별 최고 점수를 더해 순위를 낸다. */
export const search = (
  index: PreparedDocument[],
  tokens: string[],
  limit: number
): SearchResult[] => {
  if (tokens.length === 0) return [];

  // 토큰당 한 번만 컴파일한다. 문서마다 다시 만들면 정규식을 문서 수만큼 짓는다.
  const patterns = tokens.map(compile);
  const matched: SearchResult[] = [];

  for (const { document, fields } of index) {
    let score = 0;
    let missed = false;

    for (const pattern of patterns) {
      let best = 0;
      for (const field of fields) best = Math.max(best, scoreField(field, pattern));

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
