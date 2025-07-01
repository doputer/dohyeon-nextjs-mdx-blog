'use client';

import Image from 'next/image';

import { useCallback, useEffect, useRef, useState } from 'react';

import { type LottieOptions, useLottie } from 'lottie-react';

import { loadLottie } from '@/utils/lottie';

const toCodePoint = (emoji: string) => {
  const code = emoji.codePointAt(0);
  return code ? 'u' + code.toString(16) : null;
};

const useEmoji = (emoji: string) => {
  const ref = useRef<HTMLDivElement>(null);
  const lottieKey = toCodePoint(emoji);
  const svgSrc = lottieKey ? `/lotties/${lottieKey}.svg` : null;

  const [animationData, setAnimationData] = useState<object | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  const options: LottieOptions<'svg'> = {
    animationData: animationData ?? {},
    loop: true,
    autoplay: false,
  };

  const { View: LottieView, animationLoaded, play, stop } = useLottie(options);

  const handlePlay = useCallback(() => {
    if (animationLoaded) return play();
    if (lottieKey && !shouldLoad) setShouldLoad(true);
  }, [animationLoaded, lottieKey, shouldLoad, play]);

  useEffect(() => {
    if (!shouldLoad || !lottieKey) return;

    loadLottie(lottieKey)
      .then((data) => {
        setAnimationData(data);
        play();
      })
      .catch(() => setAnimationData(null));
  }, [shouldLoad, lottieKey, play]);

  const View = (
    <div ref={ref} className="contents">
      {!shouldLoad && svgSrc && (
        <Image src={svgSrc} alt={emoji} width={0} height={0} className="size-full" loading="lazy" />
      )}
      {shouldLoad && animationData && LottieView}
    </div>
  );

  return { View, play: handlePlay, stop };
};

export default useEmoji;
