'use client';

import { useCallback, useState } from 'react';

import useLike from '@/hooks/use-like';
import { cn } from '@/utils/cn';
import { launch } from '@/utils/particle';

interface Props {
  slug: string;
}

const Reaction = ({ slug }: Props) => {
  const { like, addLike } = useLike(slug);
  const [pressed, setPressed] = useState(false);

  const playReaction = useCallback((button: HTMLButtonElement) => {
    const rect = button.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    launch({ x, y });
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playReaction(e.currentTarget);
    addLike(slug);
    setPressed(true);
  };

  return (
    <section className="flex flex-col items-center gap-8">
      <div aria-hidden className="flex gap-3 text-accent select-none">
        <span>·</span>
        <span>·</span>
        <span>·</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <button
          aria-label="좋아요"
          className={cn(
            'flex size-14 -rotate-3 items-center justify-center rounded-[10px] select-none',
            'border-[1.5px] border-accent bg-accent/5 text-xl text-accent',
            'transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
            'hover:-translate-y-0.5 hover:rotate-0 hover:bg-accent/10',
            'motion-reduce:animate-none motion-reduce:transition-none',
            pressed && 'animate-seal-press'
          )}
          onAnimationEnd={() => setPressed(false)}
          onClick={handleClick}
        >
          ♥
        </button>
        <span className="text-[13px] font-semibold text-accent tabular-nums">{like ?? 0}</span>
      </div>
    </section>
  );
};

export default Reaction;
