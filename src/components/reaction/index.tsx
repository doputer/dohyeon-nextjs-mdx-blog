'use client';

import { useCallback, useRef } from 'react';

import Button from '@/components/reaction/button';
import party from '@/static/lottie/party-popper.json';
import partying from '@/static/lottie/partying-face.json';
import rocket from '@/static/lottie/rocket.json';
import particle from '@/utils/particle';

const themes = [
  { emoji: partying, colors: ['#ff4d6d', '#ff758f', '#ffb3c1', '#ffe0e9', '#f08080'] },
  { emoji: party, colors: ['#ffc300', '#ffd60a', '#ffe066', '#ffd6a5', '#ffa94d'] },
  { emoji: rocket, colors: ['#4dabf7', '#74c0fc', '#a5d8ff', '#d0ebff', '#9775fa'] },
];

const Reaction = () => {
  const ref = useRef<(HTMLButtonElement | null)[]>([]);

  const handleClick = useCallback((index: number) => {
    const button = ref.current[index];
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    particle(themes[index].colors, { x, y });
  }, []);

  return (
    <div className="mx-auto grid auto-cols-fr grid-flow-col gap-2">
      {themes.map((theme, index) => (
        <Button
          key={index}
          ref={(element) => void (ref.current[index] = element)}
          emoji={theme.emoji}
          onClick={() => handleClick(index)}
        />
      ))}
    </div>
  );
};

export default Reaction;
