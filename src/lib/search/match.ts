import type { PreparedDocument, SearchDocument, SearchResult } from '@/lib/search/types';

import { isSyllable, toChosungIndex, toChosungTest, toPrefixTest } from '@/lib/search/hangul';

/*
 * 질의와 대상을 글자 대 글자로 맞춰 본다. 질의 한 글자가 대상 한 글자를 받으므로 매치 구간의 길이가
 * 언제나 질의 길이와 같고, 매치 위치가 원문 위치와 그대로 일치한다 — 경계 판정과 하이라이트가 이 성질에 기댄다.
 * 인덱스는 빌드 시점에 NFC로 정규화되므로 런타임에서는 소문자화만 한다.
 */

type Range = [start: number, end: number];

/** 질의를 글자 그대로 맞혔는지, 초성·조합 중 글자로 느슨하게 맞혔는지. */
type MatchKind = 'exact' | 'partial';

interface Match {
  index: number;
  kind: MatchKind;
}

type CharTest = (code: number) => boolean;

interface TokenPattern {
  token: string;
  tests: CharTest[];
  /** 앞에서부터 정확 일치만으로 이루어진 구간. indexOf로 후보 자리를 좁히는 데 쓴다. */
  anchor: string;
  /** 완성된 음절이 없어 초성 매칭에만 의존하는 토큰. 본문에서는 정확 일치만 인정한다. */
  chosungOnly: boolean;
}

interface FieldSpec {
  weight: number;
  allowsChosung: boolean;
  read: (document: SearchDocument) => string;
}

/**
 * 필드별 가중치와 초성 매칭 허용 여부. 제목에서 맞으면 본문에서 맞은 것보다 10배 무겁다.
 *
 * 본문만 초성 매칭을 막는다 — 글 40개로 재보니 자모 3글자 질의가 본문 16개에 걸려 AND 조건이
 * 사실상 아무것도 걸러내지 못했다. 같은 질의가 짧은 필드에서는 1개만 맞는다. 단 이 제약은
 * `ㄱㅅㅇ`처럼 자모만으로 된 토큰에만 걸린다. `한ㄱ`처럼 완성된 음절이 섞인 토큰은 그 자체로
 * 충분히 구체적이라 본문에서도 허용한다.
 */
const FIELDS: FieldSpec[] = [
  { weight: 10, allowsChosung: true, read: (document) => document.title },
  // 배열 필드는 줄바꿈으로 이어 붙인다. \n 은 단어 경계로도 취급되므로 항목이 섞이지 않는다.
  { weight: 5, allowsChosung: true, read: (document) => document.tags.join('\n') },
  { weight: 3, allowsChosung: true, read: (document) => document.headings.join('\n') },
  { weight: 2, allowsChosung: true, read: (document) => document.description },
  { weight: 1, allowsChosung: false, read: (document) => document.body },
];

/** 글자 그대로 맞은 쪽이 느슨하게 맞은 쪽보다, 단어 시작이 중간 일치보다 높다. */
const MULTIPLIER = {
  exact: { boundary: 2.5, inside: 1.5 },
  partial: { boundary: 1.5, inside: 1 },
};

const BOUNDARY = /[\s\-_/.,()[\]{}:;!?'"`~]/;

const isBoundary = (text: string, index: number) => index === 0 || BOUNDARY.test(text[index - 1]);

/**
 * 질의 한 글자를 받아 줄 대상 글자의 판정 함수. `exact`는 이 글자가 느슨함 없이 그대로만 맞는다는 뜻으로,
 * indexOf로 후보를 좁힐 수 있는 구간을 가려내는 데 쓴다.
 */
const toCharTest = (token: string, offset: number) => {
  const code = token.charCodeAt(offset);

  // 마지막 글자만 접두사로 느슨하게 본다. 앞 글자는 사용자가 이미 확정한 입력이고,
  // IME는 조합 중인 글자를 언제나 맨 뒤에 둔다 — '한국'은 한 → 한ㄱ → 한구 → 한국으로 자란다.
  if (offset === token.length - 1 && isSyllable(code))
    return { exact: false, test: toPrefixTest(code) };

  const chosungIndex = toChosungIndex(token[offset]);

  if (chosungIndex !== -1) {
    const hasChosung = toChosungTest(chosungIndex);

    return { exact: false, test: (target: number) => target === code || hasChosung(target) };
  }

  return { exact: true, test: (target: number) => target === code };
};

const hasSyllable = (token: string) =>
  [...token].some((character) => isSyllable(character.charCodeAt(0)));

const hasChosungJamo = (token: string) =>
  [...token].some((character) => toChosungIndex(character) !== -1);

/** 토큰을 글자별 판정 함수로 미리 풀어 둔다. 초성 후보를 모으는 비용을 질의당 한 번으로 묶는다. */
const compile = (token: string): TokenPattern => {
  const tests: CharTest[] = [];
  let anchorLength = 0;
  let anchored = true;

  for (let offset = 0; offset < token.length; offset++) {
    const { exact, test } = toCharTest(token, offset);

    tests.push(test);

    if (anchored && exact) anchorLength = offset + 1;
    else anchored = false;
  }

  return {
    token,
    tests,
    anchor: token.slice(0, anchorLength),
    chosungOnly: hasChosungJamo(token) && !hasSyllable(token),
  };
};

const testsPass = (text: string, tests: CharTest[], index: number) => {
  for (let offset = 0; offset < tests.length; offset++)
    if (!tests[offset](text.charCodeAt(index + offset))) return false;

  return true;
};

function* eachExactOccurrence(text: string, token: string): Generator<Match> {
  let index = text.indexOf(token);

  while (index !== -1) {
    yield { index, kind: 'exact' };
    index = text.indexOf(token, index + token.length);
  }
}

/**
 * 토큰이 맞는 자리를 전부 훑는 유일한 매칭 지점. 점수·하이라이트·목차 필터·스니펫이 모두 여기서 갈라진다.
 * 먼저 나온 자리를 우선으로 삼는 소비자가 많으므로 위치 순서대로 낸다.
 */
function* findMatches(
  text: string,
  pattern: TokenPattern,
  allowsChosung: boolean
): Generator<Match> {
  const { token, tests, anchor, chosungOnly } = pattern;

  if (token.length === 0) return;

  // 느슨하게 볼 글자가 없으면 네이티브 indexOf로 끝낸다. 영문 질의와 본문의 자모 질의가 여기로 온다.
  if (anchor.length === token.length || (chosungOnly && !allowsChosung)) {
    yield* eachExactOccurrence(text, token);
    return;
  }

  const lastStart = text.length - token.length;
  const kindAt = (index: number): MatchKind =>
    text.startsWith(token, index) ? 'exact' : 'partial';

  if (anchor.length === 0) {
    for (let index = 0; index <= lastStart; index++)
      if (testsPass(text, tests, index)) {
        yield { index, kind: kindAt(index) };
        index += token.length - 1;
      }

    return;
  }

  // 정확 구간으로 후보 자리를 좁힌 뒤 나머지 글자만 판정한다.
  let index = text.indexOf(anchor);

  while (index !== -1 && index <= lastStart) {
    const matched = testsPass(text, tests, index);

    if (matched) yield { index, kind: kindAt(index) };

    index = text.indexOf(anchor, index + (matched ? token.length : 1));
  }
}

const findFirstMatch = (text: string, pattern: TokenPattern, allowsChosung: boolean) => {
  for (const match of findMatches(text, pattern, allowsChosung)) return match;

  return null;
};

export const tokenize = (query: string) =>
  query.normalize('NFC').toLowerCase().split(/\s+/).filter(Boolean);

export const prepare = (documents: SearchDocument[]): PreparedDocument[] =>
  documents.map((document) => ({
    document,
    fields: FIELDS.map(({ weight, allowsChosung, read }) => ({
      weight,
      allowsChosung,
      lower: read(document).toLowerCase(),
    })),
  }));

/** 한 필드에서 토큰이 얻는 점수. 0이면 미매치. */
const scoreField = (field: PreparedDocument['fields'][number], pattern: TokenPattern) => {
  const match = findFirstMatch(field.lower, pattern, field.allowsChosung);

  if (!match) return 0;

  const position = isBoundary(field.lower, match.index) ? 'boundary' : 'inside';

  return field.weight * MULTIPLIER[match.kind][position];
};

/** 토큰 전부가 텍스트에 있는지. 순위가 필요 없는 곳(목차 필터)에서 쓴다. */
export const matches = (text: string, tokens: string[]) => {
  const lower = text.toLowerCase();

  return tokens.every((token) => findFirstMatch(lower, compile(token), true) !== null);
};

/** 모든 토큰이 어딘가에서 맞아야 한다(AND). 토큰별 최고 점수를 더해 순위를 낸다. */
export const search = (index: PreparedDocument[], tokens: string[], limit: number) => {
  if (tokens.length === 0) return [];

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

const mergeRanges = (ranges: Range[]) => {
  const merged: Range[] = [];

  for (const [start, end] of ranges.toSorted((a, b) => a[0] - b[0] || a[1] - b[1])) {
    const last = merged.at(-1);

    if (last && start <= last[1]) last[1] = Math.max(last[1], end);
    else merged.push([start, end]);
  }

  return merged;
};

/** 하이라이트할 구간. 매치 길이가 언제나 토큰 길이와 같으므로 위치만 알면 구간이 정해진다. */
export const findRanges = (text: string, tokens: string[]) => {
  const lower = text.toLowerCase();
  const ranges: Range[] = [];

  for (const token of tokens)
    for (const { index } of findMatches(lower, compile(token), true))
      ranges.push([index, index + token.length]);

  return mergeRanges(ranges);
};

/**
 * 본문에서 매치 주변만 잘라 미리보기로 쓴다.
 * `covered`(제목 등)에 이미 드러난 토큰은 기준에서 빼야, 이미 보이는 단어가 아니라
 * 정작 궁금한 토큰의 문맥이 스니펫에 잡힌다.
 *
 * 본문 필드와 같은 초성 정책을 쓴다 — 자모만으로 된 질의가 엉뚱한 자리를 스니펫으로 집어
 * 무관한 세 글자에 하이라이트가 걸리는 일을 막는다. 잡을 자리가 없으면 호출부가 설명글로 되돌린다.
 */
export const snippet = (body: string, tokens: string[], covered = '', radius = 60) => {
  const lower = body.toLowerCase();
  const coveredLower = covered.toLowerCase();

  const patterns = tokens.map(compile);
  const uncovered = patterns.filter(
    (pattern) => findFirstMatch(coveredLower, pattern, true) === null
  );
  const targets = uncovered.length > 0 ? uncovered : patterns;

  let matchIndex = -1;

  for (const pattern of targets) {
    const match = findFirstMatch(lower, pattern, false);

    if (match && (matchIndex === -1 || match.index < matchIndex)) matchIndex = match.index;
  }

  if (matchIndex === -1) return '';

  const start = Math.max(0, matchIndex - radius);
  const end = Math.min(body.length, matchIndex + radius);

  return [start > 0 ? '…' : '', body.slice(start, end).trim(), end < body.length ? '…' : ''].join(
    ''
  );
};
