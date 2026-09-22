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

const PATH = [
  [2, 0],
  [3, 1],
  [2, 2],
  [3, 3],
  [2, 4],
] as const;

const ABANDONED = [
  [2, 0, 1, 1],
  [3, 1, 4, 2],
  [2, 2, 1, 3],
  [3, 3, 4, 4],
] as const;

const ROOT = PATH[0];
const SOLUTION = PATH[PATH.length - 1];

const Thumbnail = () => {
  return (
    <svg viewBox="0 0 220 124" fill="none" className="h-full w-full" aria-hidden>
      <g className="fill-line">
        {DOTS.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={2} />
        ))}
      </g>

      <g className="stroke-soft/60" strokeWidth={2} strokeLinecap="round" strokeDasharray="3 4">
        {ABANDONED.map(([c1, r1, c2, r2]) => (
          <line key={`${c1}-${r1}-${c2}-${r2}`} x1={px(c1)} y1={py(r1)} x2={px(c2)} y2={py(r2)} />
        ))}
      </g>

      <polyline
        points={PATH.map(([col, row]) => `${px(col)},${py(row)}`).join(' ')}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-accent"
      />

      <circle cx={px(ROOT[0])} cy={py(ROOT[1])} r={4} className="fill-main" />
      <circle cx={px(SOLUTION[0])} cy={py(SOLUTION[1])} r={4} className="fill-accent" />
    </svg>
  );
};

export default Thumbnail;
