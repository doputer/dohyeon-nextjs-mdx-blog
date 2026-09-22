import { key, type Point, type Step } from '#/astar/engine';
import { cn } from '@/utils/cn';

type Kind = 'start' | 'end' | 'wall' | 'path' | 'current' | 'open' | 'closed' | 'empty';

const KIND_CLASS: Record<Kind, string> = {
  start: 'bg-main',
  end: 'bg-accent',
  wall: 'bg-muted/50',
  path: 'bg-accent/70',
  current: 'bg-accent/30',
  open: 'bg-teal/25',
  closed: 'bg-teal/10',
  empty: '',
};

interface Props {
  rows: number;
  cols: number;
  start: Point;
  end: Point;
  walls: Set<string>;
  step: Step | null;
  onPointerDown: (p: Point) => void;
  onPointerEnter: (p: Point) => void;
}

const Grid = ({ rows, cols, start, end, walls, step, onPointerDown, onPointerEnter }: Props) => {
  const closed = new Set((step?.closed ?? []).map(key));
  const open = new Set(step?.status === 'searching' ? step.open.map(key) : []);
  const path = new Set(step?.status === 'found' ? step.path.map(key) : []);
  const current = step?.status === 'searching' ? key(step.current) : null;

  const kindOf = (p: Point): Kind => {
    const k = key(p);

    if (k === key(start)) return 'start';
    if (k === key(end)) return 'end';
    if (walls.has(k)) return 'wall';
    if (path.has(k)) return 'path';
    if (k === current) return 'current';
    if (open.has(k)) return 'open';
    if (closed.has(k)) return 'closed';
    return 'empty';
  };

  return (
    <div
      className="grid aspect-video touch-none overflow-hidden rounded border-2 border-line bg-surface select-none"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => {
          const p = { row, col };

          return (
            <div
              key={key(p)}
              onPointerDown={() => onPointerDown(p)}
              onPointerEnter={() => onPointerEnter(p)}
              className={cn(
                'border-t border-l border-line',
                col === 0 && 'border-l-0',
                row === 0 && 'border-t-0',
                KIND_CLASS[kindOf(p)]
              )}
            />
          );
        })
      )}
    </div>
  );
};

export default Grid;
