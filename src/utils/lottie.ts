export const lottieMap = {
  u23f0: 'alarm-clock',
  u1f697: 'automobile',
  u2696: 'balance-scale',
  u1f37e: 'bottle-with-popping-cork',
  u26d3: 'broken-chain',
  u1fae7: 'bubbles',
  u1f3c1: 'chequered-flag',
  u1f6a7: 'construction',
  u274c: 'cross-mark',
  u1f3af: 'direct-hit',
  u1f4a7: 'droplet',
  u26a1: 'electricity',
  u1f441: 'eye',
  u1f440: 'eyes',
  u1f525: 'fire',
  u26f3: 'flag-in-hole',
  u2699: 'gear',
  u1f608: 'imp-smile',
  u1f6ae: 'litter',
  u1f512: 'locked',
  u1faa4: 'mouse-trap',
  u1f195: 'new',
  u1f389: 'party-popper',
  u270f: 'pencil',
  u1f331: 'plant',
  u2795: 'plus-sign',
  u1faf5: 'pointing',
  u1f916: 'robot',
  u1f680: 'rocket',
  u1f40d: 'snake',
  u1fadf: 'splatter',
  u1f914: 'thinking-face',
  u1f32a: 'tornado',
  u1fa84: 'wand',
  u1f381: 'wrapped-gift',
} as const;

export type LottieKey = keyof typeof lottieMap;

const lottieCache = new Map<LottieKey, object>();

export const loadLottie = async (key: LottieKey) => {
  if (lottieCache.has(key)) return lottieCache.get(key)!;

  const res = await fetch(`/lotties/${lottieMap[key]}.json`);
  if (!res.ok) throw new Error('Failed to load lottie: ' + lottieMap[key]);
  const data = await res.json();

  lottieCache.set(key, data);
  return data;
};

export const preloadLotties = async (keys: LottieKey[]) => {
  const promises = keys.map((key) => loadLottie(key));

  await Promise.all(promises);
};

export const preloadAllLotties = async () => {
  const allKeys = Object.keys(lottieMap) as LottieKey[];

  await preloadLotties(allKeys);
};
