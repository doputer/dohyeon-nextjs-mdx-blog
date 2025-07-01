'use client';

import type { PropsWithChildren } from 'react';

import useEmoji from '@/hooks/use-emoji';

interface Props {
  emoji: string;
}

const Item = ({ emoji, children }: PropsWithChildren<Props>) => {
  const { View, play, stop } = useEmoji(emoji);

  return (
    <div className="group flex items-center gap-6 md:gap-8" onMouseEnter={play} onMouseLeave={stop}>
      <div className="flex size-full max-h-12 max-w-12 items-center justify-center text-4xl transition-transform duration-300 ease-out group-hover:scale-150 md:max-h-14 md:max-w-14 md:text-5xl">
        {View}
      </div>
      {children}
    </div>
  );
};

export default Item;
