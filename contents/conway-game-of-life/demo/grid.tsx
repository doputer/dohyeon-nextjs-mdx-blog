import type { CSSProperties } from 'react';

import type { Cell } from '#/conway-game-of-life/demo/automaton';
import { cn } from '@/utils/cn';

interface Props {
  grid: Cell[][];
}

const Grid = ({ grid }: Props) => {
  return (
    <div
      className="grid content-center justify-center gap-0.5"
      style={
        {
          '--cell': `min(16px, (100cqw - ${grid[0].length - 1} * 2px) / ${grid[0].length})`,
          gridTemplateColumns: `repeat(${grid[0].length}, var(--cell))`,
          gridTemplateRows: `repeat(${grid.length}, var(--cell))`,
        } as CSSProperties
      }
    >
      {grid.map((row, y) =>
        row.map((col, x) => (
          <div
            key={`${x}-${y}`}
            className={cn(
              'rounded-xs transition-colors duration-150',
              col ? 'bg-accent/70' : 'bg-background'
            )}
          />
        ))
      )}
    </div>
  );
};

export default Grid;
