'use client';

import { useCallback, useRef, useState } from 'react';

import Automaton, { type Cell } from '@/components/conway/automaton';
import Grid from '@/components/conway/grid';
import { CONWAY_SEEDS } from '@/components/conway/seed';

const Conway = () => {
  const [choice] = useState(() => CONWAY_SEEDS[Math.floor(Math.random() * CONWAY_SEEDS.length)]);
  const [grid, setGrid] = useState<Cell[][]>(choice.seed);

  const automaton = useRef(new Automaton(choice.seed));

  const handler = useCallback(() => {
    automaton.current.next();
    setGrid(automaton.current.view());
  }, []);

  return (
    <section className="flex flex-col items-center justify-center gap-2">
      <button onClick={handler}>NEXT</button>
      <Grid grid={grid} />
      <span className="text-xs text-soft">{choice.name}</span>
    </section>
  );
};

export default Conway;
