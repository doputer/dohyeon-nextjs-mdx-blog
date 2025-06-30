'use client';

import { LottieOptions, useLottie } from 'lottie-react';

import { Lottie, lotties } from '@/static/lotties';

interface Props {
  emoji: string;
}

export const toCodePoint = (emoji: string) => 'u' + emoji.codePointAt(0)?.toString(16);

const Emoji = ({ emoji }: Props) => {
  const codePoint = (toCodePoint(emoji) as Lottie) ?? '';
  const options: LottieOptions = { animationData: lotties[codePoint], loop: true };
  const { View } = useLottie(options);

  if (!(codePoint in lotties)) return emoji;
  return View;
};

export default Emoji;
