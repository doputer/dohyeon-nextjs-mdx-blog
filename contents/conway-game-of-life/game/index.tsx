'use client';

import { useContext, useEffect } from 'react';

import type { Pattern } from '#/conway-game-of-life/engine/seed';
import useEngine from '#/conway-game-of-life/engine/use-engine';
import Grid from '#/conway-game-of-life/game/grid';
import { GenerationContext } from '#/conway-game-of-life/game/layout';

interface Props {
  pattern: Pattern;
}

const Game = ({ pattern }: Props) => {
  const generation = useContext(GenerationContext);
  const { cell, next } = useEngine(pattern);

  useEffect(() => {
    if (generation > 0) next();
  }, [generation, next]);

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <Grid grid={cell} />
      <span className="font-mono text-xs text-muted">{pattern}</span>
    </div>
  );
};

export default Game;
