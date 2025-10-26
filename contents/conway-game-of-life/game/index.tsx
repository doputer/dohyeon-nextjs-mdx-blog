'use client';

import useEngine from '#/conway-game-of-life/engine/use-engine';
import Grid from '#/conway-game-of-life/game/grid';

import type { Pattern } from '#/conway-game-of-life/engine/seed';

interface Props {
  pattern: Pattern;
}

const Game = ({ pattern }: Props) => {
  const { cell, next } = useEngine(pattern);

  return (
    <section
      className="flex cursor-pointer flex-col items-center justify-center gap-2 select-none"
      onClick={next}
    >
      <Grid grid={cell} />
      <span className="text-sm text-soft">{pattern}</span>
    </section>
  );
};

export default Game;
