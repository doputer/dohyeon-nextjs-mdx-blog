'use client';

import { useEffect, useState } from 'react';

import { type LottieOptions, useLottie } from 'lottie-react';

import { loadLottie, type LottieKey } from '@/utils/lottie';

const toCodePoint = (emoji: string): LottieKey | null => {
  const code = emoji.codePointAt(0);

  return code ? (('u' + code.toString(16)) as LottieKey) : null;
};

const useEmoji = (emoji: string) => {
  const codePoint = toCodePoint(emoji);
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    if (!codePoint) return;

    loadLottie(codePoint)
      .then((data) => setAnimationData(data))
      .catch(() => setAnimationData(null));
  }, [codePoint]);

  const options: LottieOptions<'svg'> = {
    animationData: animationData ?? {},
    loop: true,
    autoplay: false,
  };

  const { View: LottieView, play, stop } = useLottie(options);

  const view = !codePoint || animationData === null ? <>{emoji}</> : LottieView;

  return { view, play, stop };
};

export default useEmoji;
