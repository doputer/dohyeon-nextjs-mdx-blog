import {
  isSyllable,
  splitJongsung,
  toChosungIndex,
  toChosungPattern,
  toComposingPattern,
} from '#/hangul-incremental-search-regex/engine/hangul';

type Range = [start: number, end: number];

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

export const compile = (token: string): RegExp => {
  const characterPatterns = Array.from({ length: token.length }, (_, offset) =>
    toCharacterPattern(token, offset)
  );

  const whole = characterPatterns.join('');
  const carriedJongsung = splitJongsung(token.charCodeAt(token.length - 1));

  if (!carriedJongsung) return new RegExp(whole, 'g');

  const head = characterPatterns.slice(0, -1).join('');
  const carried = head + carriedJongsung.base + toChosungPattern(carriedJongsung.chosungIndex);

  return new RegExp(`(?:${whole}|${carried})`, 'g');
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

  for (const token of tokens) {
    const regex = compile(token);
    let found: RegExpExecArray | null;

    while ((found = regex.exec(lowerText)) !== null)
      ranges.push([found.index, found.index + found[0].length]);
  }

  return mergeRanges(ranges);
};
