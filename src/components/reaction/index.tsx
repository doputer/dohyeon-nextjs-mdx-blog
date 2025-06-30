'use client';

import { useCallback, useRef, useState } from 'react';

import Emoji from '@/components/list/emoji';
import useActions from '@/hooks/use-actions';
import { postReaction } from '@/lib/supabase/reaction.client';
import { getItem } from '@/utils/local-storage';
import { launch } from '@/utils/particle';

interface Props {
  data: Record<string, number>;
  slug: string;
}

const themes = [
  {
    type: 'reaction1',
    emoji: '🔥' as const,
    colors: ['#ff4d00', '#ff6b00', '#ffa200', '#ffd700', '#ffb347'],
  },
  {
    type: 'reaction2',
    emoji: '🎉' as const,
    colors: ['#16a34a', '#22c55e', '#4ade80', '#86efac', '#bbf7d0'],
  },
  {
    type: 'reaction3',
    emoji: '🚀' as const,
    colors: ['#4dabf7', '#74c0fc', '#a5d8ff', '#d0ebff', '#9775fa'],
  },
];

const Reaction = ({ data, slug }: Props) => {
  const ref = useRef<(HTMLButtonElement | null)[]>([]);
  const [reaction, setReaction] = useState(data);
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

  return (
    <div className="mx-auto grid auto-cols-min grid-flow-col gap-2">
      {themes.map((theme, index) => (
        <button
          key={index}
          ref={(element) => void (ref.current[index] = element)}
          onClick={() => handleClick(index)}
          className="flex items-center justify-start gap-2 rounded bg-surface px-2 py-1 transition-colors duration-300 ease-out select-none hover:bg-subtle/20"
        >
          <div className="size-8">
            <Emoji emoji={theme.emoji} />
          </div>
          {reaction[theme.type] ?? 0}
        </button>
      ))}
    </div>
  );
};

export default Reaction;
