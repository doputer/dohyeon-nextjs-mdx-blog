import type { Cell } from '@/components/conway/automaton';
import { cn } from '@/utils/cn';

interface Props {
  grid: Cell[][];
}

const Grid = ({ grid }: Props) => {
  return (
    <div
      className="grid content-center justify-center gap-0.5"
      style={{
        gridTemplateColumns: `repeat(${grid[0].length}, 10px)`,
        gridTemplateRows: `repeat(${grid.length}, 10px)`,
      }}
    >
      {grid.map((row, y) =>
        row.map((col, x) => (
          <div
            key={`${x}-${y}`}
            className={cn(
              'size-2.5 rounded-xs transition-colors duration-150',
              col ? 'bg-mute' : 'bg-surface'
            )}
          />
        ))
      )}
    </div>
  );
};

export default Grid;
