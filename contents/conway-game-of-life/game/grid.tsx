import { cn } from '@/utils/cn';

import type { Cell } from '#/conway-game-of-life/engine/automaton';

interface Props {
  grid: Cell[][];
}

const Grid = ({ grid }: Props) => {
  return (
    <div
      className="grid content-center justify-center gap-0.5"
      style={{
        gridTemplateColumns: `repeat(${grid[0].length}, 16px)`,
        gridTemplateRows: `repeat(${grid.length}, 16px)`,
      }}
    >
      {grid.map((row, y) =>
        row.map((col, x) => (
          <div
            key={`${x}-${y}`}
            className={cn(
              'size-4 rounded-xs transition-colors duration-150',
              col ? 'bg-mute' : 'bg-surface'
            )}
          />
        ))
      )}
    </div>
  );
};

export default Grid;
