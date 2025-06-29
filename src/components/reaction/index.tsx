'use client';

import { usePathname } from 'next/navigation';

import { useCallback, useEffect, useRef, useState } from 'react';

import Button from '@/components/reaction/button';
import { getReactionBySlug, postReaction, Type } from '@/lib/supabase/reaction';
import party from '@/static/lottie/party-popper.json';
import partying from '@/static/lottie/partying-face.json';
import rocket from '@/static/lottie/rocket.json';
import particle from '@/utils/particle';

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

const defaultReaction: Record<Type, number> = {
  'partying-face': 0,
  'party-popper': 0,
  rocket: 0,
};

const Reaction = () => {
  const ref = useRef<(HTMLButtonElement | null)[]>([]);
  const pathname = usePathname();
  const slug = pathname.slice(1);

  const [reaction, setReaction] = useState(defaultReaction);

  const handleClick = useCallback(
    async (index: number) => {
      const button = ref.current[index];
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;

      particle(themes[index].colors, { x, y });

      const type = themes[index].type;

      try {
        await postReaction(slug, type);

        setReaction((prev) => ({ ...prev, [type]: prev[type] + 1 }));
      } catch (e) {
        console.error('💥 리액션 저장 실패', e);
      }
    },
    [slug]
  );

  useEffect(() => {
    const fetch = async () => {
      const datas = await getReactionBySlug(slug);

      setReaction((prev) => {
        const next = { ...prev };

        datas.forEach((data) => (next[data.reaction_type] = data.count));

        return next;
      });
    };

    fetch();
  }, [slug]);

  return (
    <div className="mx-auto grid auto-cols-fr grid-flow-col gap-2">
      {themes.map((theme, index) => (
        <Button
          key={theme.type}
          ref={(element) => void (ref.current[index] = element)}
          type={theme.type}
          emoji={theme.emoji}
          count={reaction[theme.type]}
          onClick={() => handleClick(index)}
        />
      ))}
    </div>
  );
};

export default Reaction;
