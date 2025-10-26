'use client';

import { use, useCallback } from 'react';

import useEmoji from '@/hooks/use-emoji';
import useLike from '@/hooks/use-like';
import { launch } from '@/utils/particle';

interface Props {
  initial: Promise<number>;
  slug: string;
}

const Reaction = ({ initial, slug }: Props) => {
  const Emoji = useEmoji('❤️');
  const { like, addLike } = useLike(use(initial));

  const playReaction = useCallback((button: HTMLButtonElement) => {
    const rect = button.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    launch({ x, y });
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playReaction(e.currentTarget);
    addLike(slug);
  };

  return (
    <section className="mx-auto">
      <button
        className="group flex items-center justify-between gap-2 rounded border border-line px-2 py-1 transition-colors duration-300 ease-out select-none"
        onClick={handleClick}
      >
        <span className="size-5 transition-transform duration-300 ease-out group-hover:scale-150">
          {Emoji}
        </span>
        <span className="text-sm tabular-nums">{like ?? 0}</span>
      </button>
    </section>
  );
};

export default Reaction;
