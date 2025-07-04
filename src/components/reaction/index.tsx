'use client';

import { use, useCallback, useRef, useState } from 'react';

import Button from '@/components/reaction/button';
import { useAction } from '@/contexts/action/use-action';
import { postReaction, type Reaction } from '@/lib/supabase/reaction';
import { getItem } from '@/utils/local-storage';
import { launch } from '@/utils/particle';

interface Props {
  initial: Promise<Reaction>;
  slug: string;
}

const themes = [
  {
    type: 'reaction1',
    emoji: '😀',
    colors: ['#16a34a', '#22c55e', '#4ade80', '#86efac', '#bbf7d0'],
  },
  {
    type: 'reaction2',
    emoji: '🔥',
    colors: ['#ff4d00', '#ff6b00', '#ffa200', '#ffd700', '#ffb347'],
  },
  {
    type: 'reaction3',
    emoji: '🚀',
    colors: ['#4dabf7', '#74c0fc', '#a5d8ff', '#d0ebff', '#9775fa'],
  },
];

const Reaction = ({ initial, slug }: Props) => {
  const ref = useRef<(HTMLButtonElement | null)[]>([]);
  const [reaction, setReaction] = useState<Reaction>(use(initial));
  const { hasAction, setAction } = useAction();

  const handleClick = useCallback(
    async (index: number) => {
      const button = ref.current[index];
      if (!button) return;

      const { type, colors } = themes[index];

      const rect = button.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;

      launch(colors, { x, y });

      if (process.env.NODE_ENV === 'development') return;

      const id = getItem('UNIQUE_USER_ID');
      if (!id) return;
      if (hasAction(slug, type)) return;

      setReaction((state) => ({ ...state, [type]: (state[type] ?? 0) + 1 }));

      await postReaction(id, slug, type);

      setAction(slug, type);
    },
    [hasAction, setAction, slug]
  );

  return (
    <section className="mx-auto grid auto-cols-min grid-flow-col gap-3">
      {themes.map((theme, index) => (
        <Button
          key={index}
          ref={(element) => void (ref.current[index] = element)}
          emoji={theme.emoji}
          onClick={() => handleClick(index)}
        >
          {reaction[theme.type] ?? 0}
        </Button>
      ))}
    </section>
  );
};

export default Reaction;
