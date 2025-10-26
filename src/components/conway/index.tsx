'use client';

import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';

import Automaton, { type Cell } from '@/components/conway/automaton';
import Grid from '@/components/conway/grid';
import { OSCILLATORS } from '@/components/conway/seed';

interface Props {
  index: number;
}

const Conway = forwardRef(({ index }: Props, ref) => {
  const [choice] = useState(OSCILLATORS[index % OSCILLATORS.length]);
  const [grid, setGrid] = useState<Cell[][]>(choice.seed);

  const automaton = useRef(new Automaton(choice.seed));

  useImperativeHandle(ref, () => ({
    next() {
      automaton.current.next();
      setGrid(automaton.current.view());
    },
  }));

  return (
    <section className="flex flex-col items-center justify-center gap-2">
      <Grid grid={grid} />
      <span className="text-xs text-soft">{choice.name}</span>
    </section>
  );
});

Conway.displayName = 'Conway';

export default Conway;
