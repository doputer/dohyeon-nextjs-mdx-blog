const CHOSUNG = [
  'ㄱ',
  'ㄲ',
  'ㄴ',
  'ㄷ',
  'ㄸ',
  'ㄹ',
  'ㅁ',
  'ㅂ',
  'ㅃ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅉ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
];

const SYLLABLE_START = 0xac00;
// 중성 21 × 종성 28 — 초성 하나가 담당하는 음절 수
const BLOCK = 21 * 28;

/**
 * 인덱스는 빌드 시점에 NFC로 정규화되므로 런타임에서는 소문자화만 한다.
 * `toLowerCase`는 한글·ASCII에서 길이를 보존하기 때문에 매치 인덱스를 원문에 그대로 쓸 수 있다.
 */
export const toLower = (value: string) => value.toLowerCase();

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
