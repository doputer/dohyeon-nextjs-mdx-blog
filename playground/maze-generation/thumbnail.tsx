const ORIGIN_X = 30;
const ORIGIN_Y = 20;
const PITCH_X = 30;
const PITCH_Y = 21;
const COLS = 6;
const ROWS = 5;

const px = (col: number) => ORIGIN_X + col * PITCH_X;
const py = (row: number) => ORIGIN_Y + row * PITCH_Y;

const DOTS = Array.from({ length: COLS }, (_, col) =>
  Array.from({ length: ROWS }, (_, row) => [px(col), py(row)] as const)
).flat();

const BOUNDARY = [
  [0, 0, 5, 0],
  [0, 4, 5, 4],
  [0, 1, 0, 4],
  [5, 1, 5, 4],
] as const;

const WALLS = [
  [3, 0, 3, 2],
  [4, 1, 4, 3],
  [0, 1, 2, 1],
  [1, 2, 2, 2],
  [2, 2, 3, 2],
  [0, 3, 4, 3],
] as const;

const TRAIL = [
  [0, 0],
  [1, 0],
  [2, 0],
  [2, 1],
  [1, 1],
  [0, 1],
  [0, 2],
  [1, 2],
  [2, 2],
  [3, 2],
  [3, 1],
  [3, 0],
  [4, 0],
] as const;

const center = ([col, row]: readonly [number, number]) =>
  [px(col) + PITCH_X / 2, py(row) + PITCH_Y / 2] as const;

const HEAD = center(TRAIL[TRAIL.length - 1]);

const Thumbnail = () => {
  return (
    <svg viewBox="0 0 220 124" fill="none" className="h-full w-full" aria-hidden>
      <g className="fill-line">
        {DOTS.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={2} />
        ))}
      </g>

      <g className="stroke-soft/70" strokeWidth={2} strokeLinecap="round">
        {[...BOUNDARY, ...WALLS].map(([c1, r1, c2, r2]) => (
          <line key={`${c1}-${r1}-${c2}-${r2}`} x1={px(c1)} y1={py(r1)} x2={px(c2)} y2={py(r2)} />
        ))}
      </g>

      <polyline
        points={TRAIL.map((cell) => center(cell).join(',')).join(' ')}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-accent"
      />
      <circle cx={HEAD[0]} cy={HEAD[1]} r={4} className="fill-accent" />
    </svg>
  );
};

export default Thumbnail;
