'use client';

import Image from 'next/image';

import { useEffect, useRef, useState } from 'react';

import { type LottieOptions, useLottie } from 'lottie-react';

import { loadLottie, toCodePoint } from '@/utils/lottie';

const useEmoji = (emoji: string) => {
  const ref = useRef<HTMLDivElement>(null);

  const key = toCodePoint(emoji);
  const [animationData, setAnimationData] = useState<object>();

  const options: LottieOptions<'svg'> = { animationData, loop: true };
  const { View: LottieView } = useLottie(options);

  useEffect(() => {
    if (!key) return;

    loadLottie(key)
      .then((data) => setAnimationData(data))
      .catch(() => setAnimationData(undefined));
  }, [key]);

  const View = (
    <div ref={ref} className="pointer-events-none contents">
      {animationData ? (
        LottieView
      ) : (
        <Image src={`/lotties/${key}.svg`} alt={emoji} width={0} height={0} className="size-full" />
      )}
    </div>
  );

  return View;
};

export default useEmoji;
