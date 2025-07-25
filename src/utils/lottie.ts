const lottieCache = new Map<string, object>();

export const loadLottie = async (key: string) => {
  if (lottieCache.has(key)) return lottieCache.get(key)!;

  const res = await fetch(`/lotties/${key}.json`);
  if (!res.ok) throw new Error('Failed to load lottie: ' + key);
  const data = await res.json();

  lottieCache.set(key, data);
  return data;
};

export const toCodePoint = (emoji: string) => {
  const code = emoji.codePointAt(0);
  return code ? 'u' + code.toString(16) : null;
};
