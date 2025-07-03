'use client';

import type { PropsWithChildren } from 'react';

import useEmoji from '@/hooks/use-emoji';

interface Props {
  emoji: string;
}

const Item = ({ emoji, children }: PropsWithChildren<Props>) => {
  const { View, play, stop } = useEmoji(emoji);

  return (
    <div
      className="flex items-center justify-between gap-8"
      onMouseEnter={play}
      onMouseLeave={stop}
      onTouchStart={play}
      onTouchEnd={stop}
    >
      {children}
      <div className="aspect-square w-full max-w-12 transition-transform duration-300 ease-out group-hover:scale-150 group-active:scale-150 sm:max-w-16">
        {View}
      </div>
    </div>
  );
};

export default Item;
