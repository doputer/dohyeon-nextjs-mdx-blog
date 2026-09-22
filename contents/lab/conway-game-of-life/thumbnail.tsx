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

const ALIVE = [
  [2, 0],
  [3, 1],
  [1, 2],
  [2, 2],
  [3, 2],
] as const;

const BORN = [
  [1, 1],
  [2, 3],
] as const;

const Thumbnail = () => {
  return (
    <svg viewBox="0 0 220 124" fill="none" className="h-full w-full" aria-hidden>
      <g className="fill-line">
        {DOTS.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={2} />
        ))}
      </g>

      <g className="fill-main">
        {ALIVE.map(([col, row]) => (
          <circle key={`${col}-${row}`} cx={px(col)} cy={py(row)} r={6} />
        ))}
      </g>

      <g className="stroke-accent" strokeWidth={2}>
        {BORN.map(([col, row]) => (
          <circle key={`${col}-${row}`} cx={px(col)} cy={py(row)} r={6} />
        ))}
      </g>
    </svg>
  );
};

export default Thumbnail;
