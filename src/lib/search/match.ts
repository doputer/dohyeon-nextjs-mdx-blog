import {
  isSyllable,
  splitJongsung,
  toChosungIndex,
  toChosungTest,
  toPrefixTest,
} from '@/lib/search/hangul';

/*
 * 쿼리와 대상을 글자 대 글자로 맞춰 본다. 매치 위치가 원문 위치와 그대로 일치하므로 경계 판정과
 * 하이라이트가 위치를 그대로 쓴다. 다만 길이는 쿼리 길이와 다를 수 있다 — 종성이 다음 글자로
 * 넘어간 해석은 글자 하나를 더 먹는다. 그래서 구간이 필요한 곳은 `Match.length`를 봐야 한다.
 * 인덱스는 빌드 시점에 NFC로 정규화되므로 런타임에서는 소문자화만 한다.
 *
 * 문자열만 다룬다. 문서·필드·가중치는 score.ts 가 맡는다.
 *
 * 느슨하게 보는 건 세 가지다.
 *   - 초성 — `ㄱㅅ`이 검색을. 위치를 가리지 않는다.
 *   - 조합 중인 마지막 글자 — `한구`가 한국을, `매`가 맨을. 종성 자리가 아직 열려 있다.
 *   - 넘어간 종성 — `늚`이 늘면을. 종성이 다음 글자 초성으로 떨어져 나간 상태다.
 * 앞의 둘은 글자 수가 그대로지만, 마지막 하나만 글자를 더 먹는다.
 *
 * 초성은 아직 필드를 가리지 않는다. 본문은 자모 몇 글자짜리 쿼리가 흔해서 허용하면 AND 조건이
 * 헐거워지므로, 필드마다 허용 여부를 정하는 정책이 score.ts 쪽에 필요하다.
 */

type Range = [start: number, end: number];

/** 글자 그대로 맞혔는지, 조합 중 글자로 느슨하게 맞혔는지. */
type MatchKind = 'exact' | 'partial';

interface Match {
  index: number;
  /** 대상에서 먹은 글자 수. 쿼리 길이와 같지 않을 수 있다 — 종성이 넘어간 해석은 하나 더 먹는다. */
  length: number;
  kind: MatchKind;
}

type CharTest = (code: number) => boolean;

export interface TokenPattern {
  token: string;
  tests: CharTest[];
  /** 마지막 글자의 종성을 다음 글자 초성으로 넘겨 본 해석. `tests`보다 하나 길다. 넘길 게 없으면 null. */
  carried: CharTest[] | null;
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
 * 접두사로 느슨하게 보는 건 마지막 글자뿐이다. 앞 글자는 사용자가 이미 확정한 입력이고,
 * IME는 조합 중인 글자를 언제나 맨 뒤에 둔다 — '한국'은 한 → 한ㄱ → 한구 → 한국으로 자란다.
 *
 * 반면 초성은 위치를 가리지 않는다 — `ㄱㅅ`도 `한ㄱ`도 자모가 놓인 자리에서 초성으로 맞는다.
 * 자모가 글자 그대로 쓰인 텍스트도 있으니 자기 자신도 함께 받는다.
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

  const chosungIndex = toChosungIndex(token[offset]);

  if (chosungIndex !== -1) {
    const hasChosung = toChosungTest(chosungIndex);

    return {
      exact: false,
      test: (target) => target === code || hasChosung(target),
    };
  }

  return {
    exact: true,
    test: (target) => target === code,
  };
};

/**
 * 마지막 글자의 종성이 다음 글자 초성으로 넘어간 해석 — '늚'은 '늘면'을, '값'은 '갑상'을 받는다.
 * IME가 종성 자리에 임시로 붙여 둔 자음이라, 다음 모음이 오면 제 글자로 떨어져 나간다.
 *
 * 넘긴 뒤 남은 모양은 그대로여야 하므로 마지막 글자는 정확 일치로 본다 — '늚'의 ㄹ은 '늘'의
 * 종성으로 이미 확정된 입력이다. 접두사로 느슨하게 보면 '늙면' 같은 자리까지 걸린다.
 *
 * 이 해석은 `tests`와 동시에 맞을 수 없다. 한 글자가 종성을 가진 모양('늚')이면서 동시에
 * 떼어낸 모양('늘')일 수는 없기 때문이다 — 그래서 한 자리에서 둘 중 하나만 맞는다.
 */
const toCarriedTests = (token: string, tests: CharTest[]): CharTest[] | null => {
  const code = token.charCodeAt(token.length - 1);

  if (!isSyllable(code)) return null;

  const split = splitJongsung(code);

  if (!split) return null;

  const hasChosung = toChosungTest(split.chosungIndex);

  return [...tests.slice(0, -1), (target) => target === split.base, hasChosung];
};

/**
 * 토큰을 글자별 판정 함수로 미리 풀어 둔다. 접두사 비트맵을 짓는 비용을 쿼리당 한 번으로 묶는다.
 *
 * `anchor`는 토큰 시작에서 `exact`가 이어진 구간 — '검색어' → '검색', 'abc' → 'abc', '한' → ''.
 * 느슨한 글자를 만나면 거기서 끊어야 한다. 초성은 위치를 가리지 않으므로 끊지 않으면 그 뒤의
 * 정확 일치까지 주워 담고(`ㄱ색어` → '색'), anchor가 매치 시작보다 뒤를 가리켜
 * `findMatches`가 엉뚱한 자리를 후보로 삼는다 — '검색어'의 매치를 통째로 놓친다.
 */
export const compile = (token: string): TokenPattern => {
  const tests: CharTest[] = [];
  let anchor = '';

  for (let offset = 0; offset < token.length; offset++) {
    const { exact, test } = toCharTest(token, offset);

    tests.push(test);

    if (exact && anchor.length === offset) anchor += token[offset];
  }

  return {
    token,
    tests,
    carried: toCarriedTests(token, tests),
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
 * 매치를 하나 내면 먹은 길이만큼 건너뛴다 — 구간이 겹치면 하이라이트가 어긋난다.
 * anchor로 후보를 좁히는 세 경로로 갈리고, 어느 경로든 결과는 같다.
 */
export function* findMatches(text: string, pattern: TokenPattern): Generator<Match> {
  const { token, tests, carried, anchor } = pattern;

  if (token === '') return;

  // 느슨하게 볼 글자가 없다. 영문 쿼리가 여기로 온다. 이 경로에는 넘길 종성도 없다.
  if (anchor.length === token.length) {
    let index = text.indexOf(token);

    while (index !== -1) {
      yield { index, length: token.length, kind: 'exact' };
      index = text.indexOf(token, index + token.length);
    }

    return;
  }

  /** 두 해석을 한 자리에서 시험한다. 동시에 맞을 수 없으므로 먼저 맞은 쪽이 곧 그 자리의 답이다. */
  const matchAt = (index: number): Match | null => {
    if (testsPass(text, tests, index))
      return {
        index,
        length: tests.length,
        kind: text.startsWith(token, index) ? 'exact' : 'partial',
      };

    // 종성을 넘긴 해석은 글자 하나를 더 먹으므로 토큰과 글자가 같을 수 없다 — 언제나 partial.
    if (carried && testsPass(text, carried, index))
      return { index, length: carried.length, kind: 'partial' };

    return null;
  };

  // 짧은 해석을 기준으로 잡는다. 긴 해석이 끝을 넘어가는 건 `testsPass`가 NaN으로 걸러낸다.
  const lastStart = text.length - tests.length;

  // 첫 글자부터 느슨해 좁힐 실마리가 없다. 한 글자 한글 쿼리가 여기로 온다.
  if (anchor === '') {
    let index = 0;

    while (index <= lastStart) {
      const match = matchAt(index);

      if (match) {
        yield match;
        index += match.length;
      } else {
        index += 1;
      }
    }

    return;
  }

  // anchor가 있는 자리만 후보로 삼는다. 한글 쿼리 대부분이 여기로 온다.
  let index = text.indexOf(anchor);

  while (index !== -1 && index <= lastStart) {
    const match = matchAt(index);

    if (match) yield match;

    index = text.indexOf(anchor, index + (match ? match.length : 1));
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

/** 하이라이트할 구간. 종성이 넘어간 해석은 글자 하나를 더 먹으므로 토큰 길이가 아니라 매치 길이를 쓴다. */
export const findRanges = (text: string, tokens: string[]): Range[] => {
  const lower = text.toLowerCase();
  const ranges: Range[] = [];

  for (const token of tokens)
    for (const { index, length } of findMatches(lower, compile(token)))
      ranges.push([index, index + length]);

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
