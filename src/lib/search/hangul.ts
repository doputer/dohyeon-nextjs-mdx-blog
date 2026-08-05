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

/** 초성이 주어진 자음인 음절을 가린다. 같은 초성의 음절 588개는 코드포인트가 붙어 있어 범위로 판정된다. */
export const toChosungTest = (chosungIndex: number) => {
  const first = SYLLABLE_START + chosungIndex * BLOCK;

  return (code: number) => code >= first && code < first + BLOCK;
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

  for (let candidate = 0; candidate < BLOCK; candidate++)
    if (toJamo(first + candidate).startsWith(jamo)) allowed[candidate] = 1;

  return (target: number) => allowed[target - first] === 1;
};

/**
 * 각 음절을 초성 한 글자로 치환한다. 완성형 음절(U+AC00–U+D7A3)만 1:1로 바꾸므로
 * 결과 문자열의 길이와 인덱스가 원문과 정확히 일치한다 — 하이라이트 위치 계산에 이 성질을 쓴다.
 */
export const toChosung = (value: string) =>
  value.replace(
    /[가-힣]/g,
    (syllable) => CHOSUNG[Math.floor((syllable.charCodeAt(0) - SYLLABLE_START) / BLOCK)]
  );

/** 호환 자모 자음(ㄱ–ㅎ)이 섞여 있으면 초성 검색을 시도한다. */
export const hasJamo = (value: string) => /[ㄱ-ㅎ]/.test(value);
