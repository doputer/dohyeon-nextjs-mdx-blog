'use client';

import { use, useState } from 'react';

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

type Theme = Record<string, { emoji: string; colors: string[] }>;

const theme: Theme = {
  reaction1: {
    emoji: '😀',
    colors: ['#facc15', '#fde047', '#fcd34d', '#fbbf24', '#f59e0b'],
  },
  reaction2: {
    emoji: '🔥',
    colors: ['#dc2626', '#ea580c', '#f97316', '#fb923c', '#facc15'],
  },
  reaction3: {
    emoji: '🚀',
    colors: ['#3b0764', '#6b21a8', '#9333ea', '#4f46e5', '#22d3ee'],
  },
};

const Reaction = ({ initial, slug }: Props) => {
  const [reaction, setReaction] = useState<Reaction>(use(initial));
  const { hasAction, setAction } = useAction();

  const playReaction = (button: HTMLButtonElement, colors: string[]) => {
    const rect = button.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    launch(colors, { x, y });
  };

  const commitReaction = async (id: string, slug: string, type: string) => {
    setReaction((state) => ({ ...state, [type]: (state[type] ?? 0) + 1 }));
    await postReaction(id, slug, type);
    setAction(slug, type);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>, type: string) => {
    const { colors } = theme[type];

    playReaction(e.currentTarget, colors);

    if (process.env.NODE_ENV === 'development') return;

    const id = getItem('UNIQUE_USER_ID');
    if (!id) return;
    if (hasAction(slug, type)) return;

    commitReaction(id, slug, type);
  };

  return (
    <section className="mx-auto grid auto-cols-min grid-flow-col gap-3">
      {Object.keys(theme).map((type) => (
        <Button key={type} emoji={theme[type].emoji} onClick={(e) => handleClick(e, type)}>
          {reaction[type] ?? 0}
        </Button>
      ))}
    </section>
  );
};

export default Reaction;
