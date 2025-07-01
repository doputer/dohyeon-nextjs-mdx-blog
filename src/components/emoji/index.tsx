'use client';

import { useEffect, useState } from 'react';

import { type LottieOptions, useLottie } from 'lottie-react';

import { loadLottie } from '@/utils/lottie';

interface Props {
  emoji: string;
}

const toCodePoint = (emoji: string) => {
  const code = emoji.codePointAt(0);

  return code ? 'u' + code.toString(16) : null;
};

const Emoji = ({ emoji }: Props) => {
  const codePoint = toCodePoint(emoji);
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    if (!codePoint) return;

    loadLottie(codePoint)
      .then((data) => setAnimationData(data))
      .catch(() => setAnimationData(null));
  }, [codePoint]);

  const options: LottieOptions = { animationData: animationData ?? {}, loop: true };
  const { View } = useLottie(options);

  if (!codePoint || animationData === null) return emoji;
  return View;
};

export default Emoji;
