'use client';

import { useEffect, useRef, useState } from 'react';

import { type LottieOptions, useLottie } from 'lottie-react';

import { loadLottie, type LottieKey } from '@/utils/lottie';

const toCodePoint = (emoji: string): LottieKey | null => {
  const code = emoji.codePointAt(0);

  return code ? (('u' + code.toString(16)) as LottieKey) : null;
};

const useEmoji = (emoji: string) => {
  const ref = useRef<HTMLDivElement>(null);
  const codePoint = toCodePoint(emoji);
  const [animationData, setAnimationData] = useState<object | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const target = ref.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || !codePoint) return;

    loadLottie(codePoint)
      .then((data) => setAnimationData(data))
      .catch(() => setAnimationData(null));
  }, [isVisible, codePoint]);

  const options: LottieOptions<'svg'> = {
    animationData: animationData ?? {},
    loop: true,
    autoplay: false,
  };

  const { View: LottieView, play, stop } = useLottie(options);

  const View = (
    <div ref={ref}>{!codePoint || animationData === null ? <span>{emoji}</span> : LottieView}</div>
  );

  return { View, play, stop };
};

export default useEmoji;
