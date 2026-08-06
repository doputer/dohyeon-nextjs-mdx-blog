const CHOSUNG = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ',
  'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
]; // prettier-ignore

/**
 * 겹모음·겹받침은 구성 자모로 펼쳐 둔다. 두벌식에서 두 번 눌러 만드는 글자들이라, 펼쳐 두면
 * 조합 중인 글자가 완성 글자의 접두사가 된다 — '고'가 '과'의, '갑'이 '값'의 접두사가 되는 식.
 * 반면 ㄲ·ㅆ은 shift 한 번으로 입력되어 조합 중간 상태가 없으므로 펼치지 않는다.
 */
const JUNGSUNG = [
  'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ',
  'ㅗ', 'ㅗㅏ', 'ㅗㅐ', 'ㅗㅣ', 'ㅛ',
  'ㅜ', 'ㅜㅓ', 'ㅜㅔ', 'ㅜㅣ', 'ㅠ',
  'ㅡ', 'ㅡㅣ', 'ㅣ',
]; // prettier-ignore

const JONGSUNG = [
  '', 'ㄱ', 'ㄲ', 'ㄱㅅ', 'ㄴ', 'ㄴㅈ', 'ㄴㅎ', 'ㄷ',
  'ㄹ', 'ㄹㄱ', 'ㄹㅁ', 'ㄹㅂ', 'ㄹㅅ', 'ㄹㅌ', 'ㄹㅍ', 'ㄹㅎ',
  'ㅁ', 'ㅂ', 'ㅂㅅ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
]; // prettier-ignore

const SYLLABLE_START = 0xac00;
const SYLLABLE_END = 0xd7a3;

// 초성 하나가 담당하는 음절 수 — 중성 21 × 종성 28
const BLOCK = JUNGSUNG.length * JONGSUNG.length;

export const isSyllable = (code: number) => code >= SYLLABLE_START && code <= SYLLABLE_END;

/** 호환 자모 자음(ㄱ–ㅎ)의 초성 순번. 초성으로 쓰이지 않는 자모와 그 밖의 글자는 -1. */
export const toChosungIndex = (character: string) => CHOSUNG.indexOf(character);

/** 완성형 음절을 초성·중성·종성 자모 나열로 펼친다. */
const toJamo = (code: number) => {
  const offset = code - SYLLABLE_START;

  return (
    CHOSUNG[Math.floor(offset / BLOCK)] +
    JUNGSUNG[Math.floor(offset / JONGSUNG.length) % JUNGSUNG.length] +
    JONGSUNG[offset % JONGSUNG.length]
  );
};

/** 이어지는 코드포인트들을 정규식 문자 클래스 몸통으로 줄인다 — [44032, …, 44059] → '가-갛'. */
const toClassBody = (codes: number[]) => {
  const ranges: [number, number][] = [];

  for (const code of codes) {
    const last = ranges.at(-1);

    if (last && code === last[1] + 1) last[1] = code;
    else ranges.push([code, code]);
  }

  return ranges
    .map(([start, end]) => {
      const from = String.fromCharCode(start);

      return start === end ? from : `${from}-${String.fromCharCode(end)}`;
    })
    .join('');
};

/**
 * 종성의 마지막 자음을 떼어 다음 글자 초성으로 넘긴다 — '국' → 구 + ㄱ, '늚' → 늘 + ㅁ.
 * 음절이 아니거나 종성이 없으면 null.
 *
 * 겹종성은 펼쳐 두었으므로 마지막 자음만 떼면 남은 쪽이 그대로 또 다른 종성이 된다 —
 * 'ㄹㅁ'에서 ㅁ을 떼면 'ㄹ'이 남고, 하나뿐이면 종성이 없어진다.
 * 27가지 종성의 끝 자음은 모두 초성으로도 쓰이는 자음이라 언제나 초성 순번을 얻는다.
 */
export const splitJongsung = (code: number) => {
  if (!isSyllable(code)) return null;

  const jongsungIndex = (code - SYLLABLE_START) % JONGSUNG.length;

  if (jongsungIndex === 0) return null;

  const jamo = JONGSUNG[jongsungIndex];
  const moved = jamo[jamo.length - 1];

  return {
    base: String.fromCharCode(code - jongsungIndex + JONGSUNG.indexOf(jamo.slice(0, -1))),
    chosungIndex: CHOSUNG.indexOf(moved),
  };
};

/**
 * 초성이 주어진 자음인 글자의 문자 클래스 — ㄱ이면 '[ㄱ가-깋]'.
 * 같은 초성의 음절 588개는 코드포인트가 붙어 있어 범위 하나로 끝나고,
 * 자모가 글자 그대로 쓰인 텍스트도 있으니 자모 자신을 함께 담는다.
 */
export const toChosungPattern = (chosungIndex: number) => {
  const first = SYLLABLE_START + chosungIndex * BLOCK;
  const last = first + BLOCK - 1;

  return `[${CHOSUNG[chosungIndex]}${String.fromCharCode(first)}-${String.fromCharCode(last)}]`;
};

/**
 * 조합 중인 글자를 접두사로 갖는 완성 글자의 문자 클래스 — '구'면 '[구-귛]', '갑'이면 '[갑-값]'.
 * 후보는 같은 초성 블록 안에만 있으므로 588개만 훑으면 된다.
 *
 * 범위가 언제나 하나는 아니다 — '각'의 후보는 각(ㄱ)·갃(ㄱㅅ)인데 사이의 갂(ㄲ)이 빠진다.
 * ㄲ은 ㄱ 두 개가 아니라 별개 자모라 접두사가 아니기 때문이다. 그래서 목록을 모아 구간으로 줄인다.
 */
export const toPrefixPattern = (code: number) => {
  const jamo = toJamo(code);
  const first = SYLLABLE_START + Math.floor((code - SYLLABLE_START) / BLOCK) * BLOCK;
  const candidates: number[] = [];

  for (let candidate = first; candidate < first + BLOCK; candidate++) {
    if (toJamo(candidate).startsWith(jamo)) candidates.push(candidate);
  }

  // 후보가 자기 자신뿐이면 클래스를 두를 필요가 없다 — 종성까지 꽉 찬 글자가 여기 온다.
  if (candidates.length === 1) return String.fromCharCode(candidates[0]);

  return `[${toClassBody(candidates)}]`;
};
