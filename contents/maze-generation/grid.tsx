import { edgeKey, key, type Point, type Step } from '#/maze-generation/engine';
import { cn } from '@/utils/cn';

type Kind = 'current' | 'visited' | 'unvisited';

const KIND_CLASS: Record<Kind, string> = {
  current: 'bg-accent/30',
  visited: 'bg-teal/15',
  unvisited: '',
};

interface Props {
  rows: number;
  cols: number;
  step: Step | null;
}

const Grid = ({ rows, cols, step }: Props) => {
  const visited = step?.visited ?? new Set<string>();
  const open = step?.open ?? new Set<string>();
  const current = step && step.status !== 'done' ? key(step.current) : null;

  const kindOf = (p: Point): Kind => {
    const k = key(p);

    if (k === current) return 'current';
    if (visited.has(k)) return 'visited';
    return 'unvisited';
  };

  return (
    <div
      className="grid aspect-video overflow-hidden rounded border-2 border-line bg-surface select-none"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => {
          const p = { row, col };
          const hasRightWall = col < cols - 1 && !open.has(edgeKey(p, { row, col: col + 1 }));
          const hasBottomWall = row < rows - 1 && !open.has(edgeKey(p, { row: row + 1, col }));

          return (
            <div
              key={key(p)}
              className={cn(
                KIND_CLASS[kindOf(p)],
                hasRightWall && 'border-r-2 border-line',
                hasBottomWall && 'border-b-2 border-line'
              )}
            />
          );
        })
      )}
    </div>
  );
};

export default Grid;
