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

const JUNGSUNG = [
  'ㅏ',
  'ㅐ',
  'ㅑ',
  'ㅒ',
  'ㅓ',
  'ㅔ',
  'ㅕ',
  'ㅖ',
  'ㅗ',
  'ㅗㅏ',
  'ㅗㅐ',
  'ㅗㅣ',
  'ㅛ',
  'ㅜ',
  'ㅜㅓ',
  'ㅜㅔ',
  'ㅜㅣ',
  'ㅠ',
  'ㅡ',
  'ㅡㅣ',
  'ㅣ',
];

const JONGSUNG = [
  '',
  'ㄱ',
  'ㄲ',
  'ㄱㅅ',
  'ㄴ',
  'ㄴㅈ',
  'ㄴㅎ',
  'ㄷ',
  'ㄹ',
  'ㄹㄱ',
  'ㄹㅁ',
  'ㄹㅂ',
  'ㄹㅅ',
  'ㄹㅌ',
  'ㄹㅍ',
  'ㄹㅎ',
  'ㅁ',
  'ㅂ',
  'ㅂㅅ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
];

const SYLLABLE_START = 0xac00;
const SYLLABLE_END = 0xd7a3;

const SYLLABLES_PER_CHOSUNG = JUNGSUNG.length * JONGSUNG.length;

export const isSyllable = (code: number) => code >= SYLLABLE_START && code <= SYLLABLE_END;

export const toChosungIndex = (character: string) => CHOSUNG.indexOf(character);

const toJamoIndexes = (code: number) => {
  const offset = code - SYLLABLE_START;

  return {
    chosung: Math.floor(offset / SYLLABLES_PER_CHOSUNG),
    jungsung: Math.floor(offset / JONGSUNG.length) % JUNGSUNG.length,
    jongsung: offset % JONGSUNG.length,
  };
};

const toFirstSyllable = (chosungIndex: number) =>
  SYLLABLE_START + chosungIndex * SYLLABLES_PER_CHOSUNG;

const toJamoSequence = (code: number) => {
  const { chosung, jungsung, jongsung } = toJamoIndexes(code);

  return CHOSUNG[chosung] + JUNGSUNG[jungsung] + JONGSUNG[jongsung];
};

const toCharacterClassBody = (codes: number[]) => {
  const ranges: [start: number, end: number][] = [];

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

export const splitJongsung = (code: number) => {
  if (!isSyllable(code)) return null;

  const { jongsung } = toJamoIndexes(code);

  if (jongsung === 0) return null;

  const jamo = JONGSUNG[jongsung];
  const moved = jamo[jamo.length - 1];
  const remaining = JONGSUNG.indexOf(jamo.slice(0, -1));

  return {
    base: String.fromCharCode(code - jongsung + remaining),
    chosungIndex: toChosungIndex(moved),
  };
};

export const toChosungPattern = (chosungIndex: number) => {
  const first = toFirstSyllable(chosungIndex);
  const last = first + SYLLABLES_PER_CHOSUNG - 1;

  return `[${CHOSUNG[chosungIndex]}${String.fromCharCode(first)}-${String.fromCharCode(last)}]`;
};

export const toComposingPattern = (code: number) => {
  const jamo = toJamoSequence(code);
  const first = toFirstSyllable(toJamoIndexes(code).chosung);
  const candidates: number[] = [];

  for (let candidate = first; candidate < first + SYLLABLES_PER_CHOSUNG; candidate++) {
    if (toJamoSequence(candidate).startsWith(jamo)) candidates.push(candidate);
  }

  if (candidates.length === 1) return String.fromCharCode(candidates[0]);

  return `[${toCharacterClassBody(candidates)}]`;
};
