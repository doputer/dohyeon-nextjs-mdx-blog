'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import Button from '@/components/reaction/button';
import useActions from '@/hooks/use-actions';
import { getReactionBySlug, postReaction } from '@/lib/supabase/reaction.client';
import type { Reaction } from '@/lib/supabase/reaction.client';
import { getItem } from '@/utils/local-storage';
import { launch } from '@/utils/particle';

interface Props {
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

const Reaction = ({ slug }: Props) => {
  const ref = useRef<(HTMLButtonElement | null)[]>([]);
  const [reaction, setReaction] = useState<Reaction>({});
  const { hasActions, setActions } = useActions();

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

      try {
        const user_id = getItem('UNIQUE_USER_ID');

        if (!user_id) return;
        if (hasActions(slug, type)) return;

        await postReaction(user_id, slug, type);

        setReaction((prev) => ({ ...prev, [type]: (prev[type] ?? 0) + 1 }));
        setActions(slug, type);
      } catch (error) {
        throw error;
      }
    },
    [hasActions, setActions, slug]
  );

  useEffect(() => {
    getReactionBySlug(slug).then((data) => setReaction(data));
  }, [slug]);

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
