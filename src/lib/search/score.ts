import type { TokenPattern } from '@/lib/search/match';
import { compile, findFirstMatch } from '@/lib/search/match';
import type { PreparedDocument, SearchDocument, SearchResult } from '@/lib/search/types';

interface FieldSpec {
  weight: number;
  read: (document: SearchDocument) => string;
}

const FIELDS: FieldSpec[] = [
  { weight: 10, read: (document) => document.title },
  { weight: 3, read: (document) => document.headings.join('\n') },
  { weight: 1, read: (document) => document.body },
];

const MULTIPLIER = {
  exact: { boundary: 2.5, inside: 1.5 },
  partial: { boundary: 1.5, inside: 1 },
};

const BOUNDARY_CHARACTER = /[\s\-_/.,()[\]{}:;!?'"`~]/;

export const prepareIndex = (documents: SearchDocument[]): PreparedDocument[] =>
  documents.map((document) => ({
    document,
    fields: FIELDS.map(({ weight, read }) => ({ weight, lower: read(document).toLowerCase() })),
  }));

const scoreField = (field: PreparedDocument['fields'][number], pattern: TokenPattern) => {
  const match = findFirstMatch(field.lower, pattern);

  if (!match) return 0;

  const isWordStart = match.index === 0 || BOUNDARY_CHARACTER.test(field.lower[match.index - 1]);

  return field.weight * MULTIPLIER[match.kind][isWordStart ? 'boundary' : 'inside'];
};

const scoreDocument = (fields: PreparedDocument['fields'], patterns: TokenPattern[]) => {
  let total = 0;

  for (const pattern of patterns) {
    let best = 0;

    for (const field of fields) best = Math.max(best, scoreField(field, pattern));

    if (best === 0) return 0;

    total += best;
  }

  return total;
};

export const search = (
  index: PreparedDocument[],
  tokens: string[],
  limit: number
): SearchResult[] => {
  if (tokens.length === 0) return [];

  const patterns = tokens.map(compile);

  return index
    .map(({ document, fields }) => ({ document, score: scoreDocument(fields, patterns) }))
    .filter(({ score }) => score > 0)
    .toSorted(
      (a, b) =>
        b.score - a.score ||
        new Date(b.document.date).getTime() - new Date(a.document.date).getTime()
    )
    .slice(0, limit);
};
