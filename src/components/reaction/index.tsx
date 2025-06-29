'use client';

import { useCallback, useRef, useState } from 'react';

import Button from '@/components/reaction/button';
import { postReaction } from '@/lib/supabase/reaction.client';
import type { Reaction } from '@/lib/supabase/reaction.server';
import party from '@/static/lottie/party-popper.json';
import partying from '@/static/lottie/partying-face.json';
import rocket from '@/static/lottie/rocket.json';
import particle from '@/utils/particle';

interface Props {
  data: Reaction;
  slug: string;
}

const themes = [
  {
    type: 'partying-face' as const,
    emoji: partying,
    colors: ['#ff4d6d', '#ff758f', '#ffb3c1', '#ffe0e9', '#f08080'],
  },
  {
    type: 'party-popper' as const,
    emoji: party,
    colors: ['#ffc300', '#ffd60a', '#ffe066', '#ffd6a5', '#ffa94d'],
  },
  {
    type: 'rocket' as const,
    emoji: rocket,
    colors: ['#4dabf7', '#74c0fc', '#a5d8ff', '#d0ebff', '#9775fa'],
  },
];

const Reaction = ({ data, slug }: Props) => {
  const ref = useRef<(HTMLButtonElement | null)[]>([]);
  const [reaction, setReaction] = useState(data);

  const handleClick = useCallback(
    async (index: number) => {
      const button = ref.current[index];
      if (!button) return;

      const { type, colors } = themes[index];

      const rect = button.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;

      particle(colors, { x, y });

      try {
        await postReaction(slug, type);

        setReaction((prev) => ({ ...prev, [type]: prev[type] + 1 }));
      } catch (error) {
        throw error;
      }
    },
    [slug]
  );

  return (
    <div className="mx-auto grid auto-cols-min grid-flow-col gap-2">
      {themes.map((theme, index) => (
        <Button
          key={theme.type}
          ref={(element) => void (ref.current[index] = element)}
          emoji={theme.emoji}
          onClick={() => handleClick(index)}
        >
          {reaction[theme.type]}
        </Button>
      ))}
    </div>
  );
};

export default Reaction;
