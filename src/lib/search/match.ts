import {
  isSyllable,
  splitJongsung,
  toChosungIndex,
  toChosungPattern,
  toComposingPattern,
} from '@/lib/search/hangul';

type Range = [start: number, end: number];

type MatchKind = 'exact' | 'partial';

interface Match {
  index: number;
  length: number;
  kind: MatchKind;
}

export interface TokenPattern {
  token: string;
  regex: RegExp;
}

const REGEXP_SYNTAX = /[.*+?^${}()|[\]\\]/;

export const tokenize = (query: string): string[] =>
  query.toLowerCase().normalize('NFC').split(/\s+/).filter(Boolean);

const toCharacterPattern = (token: string, offset: number): string => {
  const character = token[offset];
  const code = token.charCodeAt(offset);
  const isLast = offset === token.length - 1;

  if (isLast && isSyllable(code)) return toComposingPattern(code);

  const chosungIndex = toChosungIndex(character);

  if (chosungIndex !== -1) return toChosungPattern(chosungIndex);

  return character.replace(REGEXP_SYNTAX, '\\$&');
};

export const compile = (token: string): TokenPattern => {
  const characterPatterns = Array.from({ length: token.length }, (_, offset) =>
    toCharacterPattern(token, offset)
  );

  const whole = characterPatterns.join('');
  const carriedJongsung = splitJongsung(token.charCodeAt(token.length - 1));

  if (!carriedJongsung) return { token, regex: new RegExp(whole, 'g') };

  const head = characterPatterns.slice(0, -1).join('');
  const carried = head + carriedJongsung.base + toChosungPattern(carriedJongsung.chosungIndex);

  return { token, regex: new RegExp(`(?:${whole}|${carried})`, 'g') };
};

function* findMatches(text: string, pattern: TokenPattern): Generator<Match> {
  const { token, regex } = pattern;

  if (token === '') return;

  regex.lastIndex = 0;

  let found: RegExpExecArray | null;

  while ((found = regex.exec(text)) !== null) {
    yield {
      index: found.index,
      length: found[0].length,
      kind: found[0] === token ? 'exact' : 'partial',
    };
  }
}

export const findFirstMatch = (text: string, pattern: TokenPattern): Match | null => {
  for (const match of findMatches(text, pattern)) return match;

  return null;
};

const mergeRanges = (ranges: Range[]): Range[] => {
  const merged: Range[] = [];

  for (const [start, end] of ranges.toSorted((a, b) => a[0] - b[0] || a[1] - b[1])) {
    const last = merged.at(-1);

    if (last && start <= last[1]) last[1] = Math.max(last[1], end);
    else merged.push([start, end]);
  }

  return merged;
};

export const findRanges = (text: string, tokens: string[]): Range[] => {
  const lowerText = text.toLowerCase();
  const ranges: Range[] = [];

  for (const token of tokens)
    for (const { index, length } of findMatches(lowerText, compile(token)))
      ranges.push([index, index + length]);

  return mergeRanges(ranges);
};

export const snippet = (body: string, tokens: string[], alreadyShown = '', radius = 60): string => {
  const lowerBody = body.toLowerCase();
  const lowerShown = alreadyShown.toLowerCase();

  const patterns = tokens.map(compile);
  const hidden = patterns.filter((pattern) => findFirstMatch(lowerShown, pattern) === null);
  const targets = hidden.length > 0 ? hidden : patterns;

  const indexes = targets
    .map((pattern) => findFirstMatch(lowerBody, pattern)?.index)
    .filter((index) => index !== undefined);

  if (indexes.length === 0) return '';

  const anchor = Math.min(...indexes);
  const width = radius * 2;
  const start = Math.max(0, Math.min(anchor - radius, body.length - width));
  const end = Math.min(body.length, start + width);

  const leading = start > 0 ? '…' : '';
  const trailing = end < body.length ? '…' : '';

  return leading + body.slice(start, end).trim() + trailing;
};
