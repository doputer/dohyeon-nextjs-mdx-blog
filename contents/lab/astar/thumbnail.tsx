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
  [0, 4],
  [0, 2],
  [2, 2],
  [2, 1],
  [4, 1],
  [4, 0],
  [5, 0],
] as const;

const CLOSED = [
  [0, 4],
  [1, 4],
  [0, 3],
  [1, 3],
  [2, 3],
  [0, 2],
  [1, 2],
  [2, 2],
  [3, 2],
  [1, 1],
  [2, 1],
  [3, 1],
  [4, 1],
  [2, 0],
  [3, 0],
  [4, 0],
  [5, 0],
] as const;

const OPEN = [
  [2, 4],
  [3, 3],
  [4, 2],
  [5, 1],
] as const;

const START = PATH[0];
const END = PATH[PATH.length - 1];

const Cell = ({ col, row }: { col: number; row: number }) => (
  <rect x={px(col) - PITCH_X / 2} y={py(row) - PITCH_Y / 2} width={PITCH_X} height={PITCH_Y} />
);

const Thumbnail = () => {
  return (
    <svg viewBox="0 0 220 124" fill="none" className="h-full w-full" aria-hidden>
      <g className="fill-teal/10">
        {OPEN.map(([col, row]) => (
          <Cell key={`${col}-${row}`} col={col} row={row} />
        ))}
      </g>

      <g className="fill-teal/20">
        {CLOSED.map(([col, row]) => (
          <Cell key={`${col}-${row}`} col={col} row={row} />
        ))}
      </g>

      <g className="fill-line">
        {DOTS.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={2} />
        ))}
      </g>

      <polyline
        points={PATH.map(([col, row]) => `${px(col)},${py(row)}`).join(' ')}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-accent"
      />

      <circle cx={px(START[0])} cy={py(START[1])} r={4} className="fill-main" />
      <circle cx={px(END[0])} cy={py(END[1])} r={4} className="fill-accent" />
    </svg>
  );
};

export default Thumbnail;
