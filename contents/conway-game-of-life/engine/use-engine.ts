import { useCallback, useRef, useState } from 'react';

import Automaton from '#/conway-game-of-life/engine/automaton';
import { Pattern, SEED } from '#/conway-game-of-life/engine/seed';

const useEngine = (pattern: Pattern) => {
  const [seed] = useState(SEED[pattern]);
  const ref = useRef(new Automaton(seed));
  const [cell, setCell] = useState(seed);

  const next = useCallback(() => {
    ref.current.next();
    setCell(ref.current.view());
  }, []);

  return { cell, next };
};

export default useEngine;
