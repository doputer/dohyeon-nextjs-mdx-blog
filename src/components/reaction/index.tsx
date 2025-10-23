'use client';

import { use, useCallback, useRef, useState } from 'react';

import Button from '@/components/reaction/button';
import useAction from '@/hooks/use-action';
import { postReaction } from '@/lib/supabase/client/reaction';
import type { Reaction } from '@/lib/supabase/server/reaction';
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
    colors: ['#facc15', '#fde047', '#fcd34d', '#fbbf24', '#f59e0b'],
  },
  {
    type: 'reaction2',
    emoji: '🔥',
    colors: ['#dc2626', '#ea580c', '#f97316', '#fb923c', '#facc15'],
  },
  {
    type: 'reaction3',
    emoji: '🚀',
    colors: ['#3b0764', '#6b21a8', '#9333ea', '#4f46e5', '#22d3ee'],
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
