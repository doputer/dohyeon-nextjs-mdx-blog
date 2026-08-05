const CHOSUNG = [...'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'];

const SYLLABLE_START = 0xac00;
// 중성 21 × 종성 28 — 초성 하나가 담당하는 음절 수
const BLOCK = 21 * 28;

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
