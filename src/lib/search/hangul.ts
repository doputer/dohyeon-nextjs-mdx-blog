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

/**
 * 초성이 주어진 자음인 음절을 받는다. 같은 초성의 음절 588개는 코드포인트가 붙어 있어
 * 범위 비교 두 번으로 끝난다 — `toPrefixTest`처럼 후보를 모아 둘 필요가 없다.
 */
export const toChosungTest = (chosungIndex: number) => {
  const first = SYLLABLE_START + chosungIndex * BLOCK;

  return (code: number) => code >= first && code < first + BLOCK;
};

/** 완성형 음절을 초성·중성·종성 자모 나열로 펼친다. */
const toJamo = (code: number) => {
  const offset = code - SYLLABLE_START;

  return (
    CHOSUNG[Math.floor(offset / BLOCK)] +
    JUNGSUNG[Math.floor(offset / JONGSUNG.length) % JUNGSUNG.length] +
    JONGSUNG[offset % JONGSUNG.length]
  );
};

/**
 * 종성의 마지막 자음을 떼어 다음 글자 초성으로 넘긴다 — '국' → 구 + ㄱ, '늚' → 늘 + ㅁ, '값' → 갑 + ㅅ.
 * 종성 자리에 임시로 붙어 있던 자음이 다음 모음을 만나 제 글자로 떨어져 나가는 순간을 흉내낸다.
 *
 * 종성이 없으면 넘길 게 없으므로 null. 겹종성은 펼쳐 두었으므로 마지막 자음만 떼면
 * 남은 쪽이 그대로 또 다른 종성이 된다 — 'ㄹㅁ'에서 ㅁ을 떼면 'ㄹ'이 남는 식이고, 하나뿐이면 종성이 없어진다.
 * 떼어낸 자음은 27가지 종성의 끝 자음이 모두 초성으로도 쓰이는 자음이라 언제나 초성 순번을 얻는다.
 */
export const splitJongsung = (code: number) => {
  const jongsungIndex = (code - SYLLABLE_START) % JONGSUNG.length;

  if (jongsungIndex === 0) return null;

  const jamo = JONGSUNG[jongsungIndex];
  const moved = jamo[jamo.length - 1];

  return {
    base: code - jongsungIndex + JONGSUNG.indexOf(jamo.slice(0, -1)),
    chosungIndex: CHOSUNG.indexOf(moved),
  };
};

/**
 * 조합 중인 글자를 완성 글자의 접두사로 보고 가린다 — '구'가 '국'을, '갑'이 '값'을, '고'가 '과'를 받는다.
 * 후보는 같은 초성 블록 안에만 있으므로 588개만 훑으면 되고, 질의 한 글자당 한 번만 만든다.
 *
 * 후보를 블록 안 순번으로 눕힌 비트맵에 담는다. 블록 밖 글자는 첨자가 범위를 벗어나 undefined가 되므로
 * 범위 검사를 따로 두지 않아도 걸러진다 — 본문 전체를 훑는 경로에서 이 판정이 글자마다 돌아간다.
 */
export const toPrefixTest = (code: number) => {
  const jamo = toJamo(code);
  const first = SYLLABLE_START + Math.floor((code - SYLLABLE_START) / BLOCK) * BLOCK;
  const allowed = new Uint8Array(BLOCK);

  for (let candidate = 0; candidate < BLOCK; candidate++) {
    if (toJamo(first + candidate).startsWith(jamo)) allowed[candidate] = 1;
  }

  return (target: number) => allowed[target - first] === 1;
};
