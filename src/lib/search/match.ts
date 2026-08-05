import { isSyllable, toPrefixTest } from '@/lib/search/hangul';

/*
 * 쿼리와 대상을 글자 대 글자로 맞춰 본다. 쿼리 한 글자가 대상 한 글자를 받으므로 매치 구간의 길이가
 * 언제나 쿼리 길이와 같고, 매치 위치가 원문 위치와 그대로 일치한다 — 경계 판정과 하이라이트가 이 성질에 기댄다.
 * 인덱스는 빌드 시점에 NFC로 정규화되므로 런타임에서는 소문자화만 한다.
 *
 * 문자열만 다룬다. 문서·필드·가중치는 score.ts 가 맡는다.
 *
 * 느슨하게 보는 건 조합 중인 마지막 글자 하나뿐이다. 초성 검색(`ㄱㅅ` → 검색)은 빼 두었다 —
 * 본문은 자모 3글자 쿼리가 너무 흔해서 허용하면 AND 조건이 무력해졌다. 되돌린다면 `toCharTest`에
 * 위치와 무관한 분기를 더하고, 필드마다 허용 여부를 정하는 정책이 다시 필요해진다.
 */

type Range = [start: number, end: number];

/** 글자 그대로 맞혔는지, 조합 중 글자로 느슨하게 맞혔는지. */
type MatchKind = 'exact' | 'partial';

interface Match {
  index: number;
  kind: MatchKind;
}

type CharTest = (code: number) => boolean;

export interface TokenPattern {
  token: string;
  tests: CharTest[];
  /** 앞에서부터 정확 일치만으로 이루어진 구간. indexOf로 후보 자리를 좁히는 데 쓴다. */
  anchor: string;
}

/** 인덱스가 NFC 조합형·소문자이므로 쿼리도 같은 형태로 맞춘다. */
export const tokenize = (query: string): string[] => {
  return query.toLowerCase().normalize('NFC').split(/\s+/).filter(Boolean);
};

/**
 * 쿼리 한 글자를 받아 줄 대상 글자의 판정 함수. `exact`는 느슨함이 없다는 뜻으로 anchor를 정하는 데 쓴다.
 *
 * 마지막 글자만 접두사로 느슨하게 본다. 앞 글자는 사용자가 이미 확정한 입력이고,
 * IME는 조합 중인 글자를 언제나 맨 뒤에 둔다 — '한국'은 한 → 한ㄱ → 한구 → 한국으로 자란다.
 *
 * `toPrefixTest`는 588칸 비트맵을 짓는다. 돌려주는 함수 안에서 부르면 대상 글자마다 새로 짓는다.
 */
export const toCharTest = (token: string, offset: number): { exact: boolean; test: CharTest } => {
  const code = token.charCodeAt(offset);

  if (offset === token.length - 1 && isSyllable(code)) {
    return {
      exact: false,
      test: toPrefixTest(code),
    };
  }

  return {
    exact: true,
    test: (target) => target === code,
  };
};

/**
 * 토큰을 글자별 판정 함수로 미리 풀어 둔다. 접두사 비트맵을 짓는 비용을 쿼리당 한 번으로 묶는다.
 *
 * `anchor`는 앞에서부터 `exact`가 이어진 구간 — '검색어' → '검색', 'abc' → 'abc', '한' → ''.
 * 끊김을 따로 추적하지 않아도 되는 건 `toCharTest`가 마지막 글자에서만 느슨해지기 때문이다.
 * 위치와 무관하게 느슨해지는 분기를 더하면 이 가정이 깨져 anchor가 매치 시작보다 뒤를 가리킨다.
 */
export const compile = (token: string): TokenPattern => {
  const tests: CharTest[] = [];
  let anchor = '';

  for (let offset = 0; offset < token.length; offset++) {
    const { exact, test } = toCharTest(token, offset);

    tests.push(test);

    if (exact) anchor += token[offset];
  }

  return {
    token,
    tests,
    anchor,
  };
};

/** 텍스트 끝을 넘어가는 건 막지 않는다 — `charCodeAt`이 NaN을 주고 판정 함수들이 false를 낸다. */
const testsPass = (text: string, tests: CharTest[], index: number): boolean => {
  for (let k = 0; k < tests.length; k++) {
    if (!tests[k](text.charCodeAt(index + k))) return false;
  }

  return true;
};

/**
 * 토큰이 맞는 자리를 전부 훑는 유일한 매칭 지점. 점수·하이라이트·목차 필터·스니펫이 모두 여기서 갈라진다.
 * 먼저 나온 자리를 우선으로 삼는 소비자가 많으므로 위치 순서대로 낸다.
 *
 * 매치를 하나 내면 토큰 길이만큼 건너뛴다 — 구간이 겹치면 하이라이트가 어긋난다.
 * anchor로 후보를 좁히는 세 경로로 갈리고, 어느 경로든 결과는 같다.
 */
export function* findMatches(text: string, pattern: TokenPattern): Generator<Match> {
  const { token, tests, anchor } = pattern;

  if (token === '') return;

  // 느슨하게 볼 글자가 없다. 영문 쿼리가 여기로 온다.
  if (anchor.length === token.length) {
    let index = text.indexOf(token);

    while (index !== -1) {
      yield { index, kind: 'exact' };
      index = text.indexOf(token, index + token.length);
    }

    return;
  }

  const lastStart = text.length - token.length;
  const kindAt = (index: number): MatchKind =>
    text.startsWith(token, index) ? 'exact' : 'partial';

  // 첫 글자부터 느슨해 좁힐 실마리가 없다. 한 글자 한글 쿼리가 여기로 온다.
  if (anchor === '') {
    let index = 0;

    while (index <= lastStart) {
      if (testsPass(text, tests, index)) {
        yield { index, kind: kindAt(index) };
        index += token.length;
      } else {
        index += 1;
      }
    }

    return;
  }

  // anchor가 있는 자리만 후보로 삼는다. 한글 쿼리 대부분이 여기로 온다.
  let index = text.indexOf(anchor);

  while (index !== -1 && index <= lastStart) {
    const matched = testsPass(text, tests, index);

    if (matched) yield { index, kind: kindAt(index) };

    index = text.indexOf(anchor, index + (matched ? token.length : 1));
  }
}

/** 제너레이터라 찾은 즉시 멈춘다 — 첫 매치만 필요한 곳에서 나머지 텍스트를 훑지 않는다. */
export const findFirstMatch = (text: string, pattern: TokenPattern): Match | null => {
  for (const match of findMatches(text, pattern)) return match;

  return null;
};

/** 토큰 전부가 텍스트에 있는지. 순위가 필요 없는 곳(목차 필터)에서 쓴다. */
export const matches = (text: string, tokens: string[]): boolean => {
  const lower = text.toLowerCase();

  return tokens.every((token) => findFirstMatch(lower, compile(token)) !== null);
};

/** 겹치거나 맞닿은 구간을 합친다 — `<mark>`가 중첩되면 안 되므로. */
const mergeRanges = (ranges: Range[]): Range[] => {
  const merged: Range[] = [];

  for (const [start, end] of ranges.toSorted((a, b) => a[0] - b[0] || a[1] - b[1])) {
    const last = merged.at(-1);

    if (last && start <= last[1]) last[1] = Math.max(last[1], end);
    else merged.push([start, end]);
  }

  return merged;
};

/** 하이라이트할 구간. 매치 길이가 토큰 길이와 같으므로 위치만 알면 구간이 정해진다. */
export const findRanges = (text: string, tokens: string[]): Range[] => {
  const lower = text.toLowerCase();
  const ranges: Range[] = [];

  for (const token of tokens)
    for (const { index } of findMatches(lower, compile(token)))
      ranges.push([index, index + token.length]);

  return mergeRanges(ranges);
};

/**
 * 본문에서 매치 주변만 잘라 미리보기로 쓴다.
 * `covered`(제목 등)에 이미 드러난 토큰은 기준에서 빼야, 이미 보이는 단어가 아니라
 * 정작 궁금한 토큰의 문맥이 잡힌다. 잡을 자리가 없으면 호출부가 설명글로 되돌린다.
 */
export const snippet = (body: string, tokens: string[], covered = '', radius = 60): string => {
  const lower = body.toLowerCase();
  const coveredLower = covered.toLowerCase();

  const patterns = tokens.map(compile);
  const uncovered = patterns.filter((pattern) => findFirstMatch(coveredLower, pattern) === null);

  // 전부 드러났으면 뺄 게 없으므로 원래 토큰 전체를 기준으로 삼는다.
  const targets = uncovered.length > 0 ? uncovered : patterns;

  let matchIndex = -1;

  for (const pattern of targets) {
    const match = findFirstMatch(lower, pattern);

    if (match && (matchIndex === -1 || match.index < matchIndex)) matchIndex = match.index;
  }

  if (matchIndex === -1) return '';

  const start = Math.max(0, matchIndex - radius);
  const end = Math.min(body.length, matchIndex + radius);

  return [start > 0 ? '…' : '', body.slice(start, end).trim(), end < body.length ? '…' : ''].join(
    ''
  );
};
