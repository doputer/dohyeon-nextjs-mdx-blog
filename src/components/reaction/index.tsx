'use client';

import { useCallback, useRef, useState } from 'react';

import Button from '@/components/reaction/button';
import useActions from '@/hooks/use-actions';
import { postReaction } from '@/lib/supabase/reaction.client';
import fire from '@/static/lotties/fire.json';
import party from '@/static/lotties/party-popper.json';
import rocket from '@/static/lotties/rocket.json';
import { getItem } from '@/utils/local-storage';
import { launch } from '@/utils/particle';

interface Props {
  data: Record<string, number>;
  slug: string;
}

const themes = [
  {
    type: 'reaction1',
    emoji: fire,
    colors: ['#ff4d6d', '#ff758f', '#ffb3c1', '#ffe0e9', '#f08080'],
  },
  {
    type: 'reaction2',
    emoji: party,
    colors: ['#ffc300', '#ffd60a', '#ffe066', '#ffd6a5', '#ffa94d'],
  },
  {
    type: 'reaction3',
    emoji: rocket,
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
        <Button
          key={index}
          ref={(element) => void (ref.current[index] = element)}
          emoji={theme.emoji}
          onClick={() => handleClick(index)}
        >
          {reaction[theme.type] ?? 0}
        </Button>
      ))}
    </div>
  );
};

export default Reaction;
