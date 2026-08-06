import {
  isSyllable,
  splitJongsung,
  toChosungIndex,
  toChosungPattern,
  toPrefixPattern,
} from '@/lib/search/hangul';

/*
 * 토큰을 정규식으로 컴파일해 맞춰 본다. 느슨한 글자는 문자 클래스로, 종성이 넘어간 해석은
 * alternation으로 편다 — '늚' → `(?:늚|늘[ㅁ마-밓])`. 후보 좁히기·건너뛰기는 정규식 엔진이 맡는다.
 * 인덱스는 빌드 시점에 NFC로 정규화되므로 런타임에서는 소문자화만 한다.
 *
 * 문자열만 다룬다. 문서·필드·가중치는 score.ts 가 맡는다.
 *
 * 느슨하게 보는 건 세 가지다.
 *   - 초성 — `ㄱㅅ`이 검색을. 위치를 가리지 않는다.
 *   - 조합 중인 마지막 글자 — `한구`가 한국을, `매`가 맨을. 종성 자리가 아직 열려 있다.
 *   - 넘어간 종성 — `늚`이 늘면을. 종성이 다음 글자 초성으로 떨어져 나간 상태다.
 * 앞의 둘은 글자 수가 그대로지만, 마지막 하나는 글자를 더 먹으므로 구간은 `Match.length`가 답이다.
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

export interface TokenPattern {
  token: string;
  regex: RegExp;
}

/** 인덱스가 NFC 조합형·소문자이므로 쿼리도 같은 형태로 맞춘다. */
export const tokenize = (query: string): string[] => {
  return query.toLowerCase().normalize('NFC').split(/\s+/).filter(Boolean);
};

/** 쿼리에 섞인 정규식 문법 글자를 글자 그대로로 되돌린다. */
const escape = (character: string) => character.replace(/[.*+?^${}()|[\]\\]/, '\\$&');

/**
 * 쿼리 한 글자를 받아 줄 대상의 부분 패턴.
 *
 * 접두사로 느슨하게 보는 건 마지막 글자뿐이다. 앞 글자는 사용자가 이미 확정한 입력이고,
 * IME는 조합 중인 글자를 언제나 맨 뒤에 둔다 — '한국'은 한 → 한ㄱ → 한구 → 한국으로 자란다.
 * 반면 초성은 위치를 가리지 않는다 — `ㄱㅅ`도 `한ㄱ`도 자모가 놓인 자리에서 초성으로 맞는다.
 */
const toCharPattern = (token: string, offset: number): string => {
  const code = token.charCodeAt(offset);

  if (offset === token.length - 1 && isSyllable(code)) return toPrefixPattern(code);

  const chosungIndex = toChosungIndex(token[offset]);

  if (chosungIndex !== -1) return toChosungPattern(chosungIndex);

  return escape(token[offset]);
};

/**
 * 마지막 글자의 종성이 다음 글자 초성으로 넘어간 해석 — '늚'은 '늘면'을, '값'은 '갑상'을 받는다.
 * IME가 종성 자리에 임시로 붙여 둔 자음이라, 다음 모음이 오면 제 글자로 떨어져 나간다.
 *
 * 넘긴 뒤 남은 모양은 그대로여야 하므로 마지막 글자는 정확 일치로 본다 — '늚'의 ㄹ은 '늘'의
 * 종성으로 이미 확정된 입력이다. 접두사로 느슨하게 보면 '늙면' 같은 자리까지 걸린다.
 */
const toCarriedPattern = (token: string, head: string): string | null => {
  const split = splitJongsung(token.charCodeAt(token.length - 1));

  if (!split) return null;

  return head + split.base + toChosungPattern(split.chosungIndex);
};

/**
 * 토큰을 정규식 하나로 미리 컴파일해 둔다. 원래 해석과 종성이 넘어간 해석은 한 자리에서
 * 동시에 맞을 수 없으므로 (한 글자가 종성을 가진 모양이면서 동시에 떼어낸 모양일 수는 없다)
 * alternation 순서는 결과를 바꾸지 않는다.
 */
export const compile = (token: string): TokenPattern => {
  const parts = [...token].map((_, offset) => toCharPattern(token, offset));
  const head = parts.slice(0, -1).join('');
  const carried = toCarriedPattern(token, head);
  const whole = parts.join('');

  return {
    token,
    regex: new RegExp(carried ? `(?:${whole}|${carried})` : whole, 'g'),
  };
};

/**
 * 토큰이 맞는 자리를 전부 훑는 유일한 매칭 지점. 점수·하이라이트·목차 필터·스니펫이 모두 여기서 갈라진다.
 * 먼저 나온 자리를 우선으로 삼는 소비자가 많으므로 위치 순서대로 낸다. `g` 플래그의 exec가
 * 매치 끝에서 이어 찾으므로 구간은 겹치지 않는다 — 겹치면 하이라이트가 어긋난다.
 *
 * 정규식 상태(lastIndex)를 패턴이 들고 있으므로, 같은 패턴의 순회 두 개를 겹쳐 돌리면 안 된다.
 * 지금 소비자는 모두 한 순회를 끝내거나 버린 뒤 다음을 시작한다.
 */
export function* findMatches(text: string, pattern: TokenPattern): Generator<Match> {
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
