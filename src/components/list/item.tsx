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
      className="flex items-center justify-between gap-4"
      onMouseEnter={play}
      onMouseLeave={stop}
    >
      {children}
      <div className="flex size-full max-h-10 max-w-10 items-center justify-center transition-transform duration-300 ease-out group-hover:scale-150 md:max-h-16 md:max-w-16">
        {View}
      </div>
    </div>
  );
};

export default Item;
