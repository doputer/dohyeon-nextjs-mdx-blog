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

const RIDGE = [3, 1, 2, 0, 2, 1].map((row, col) => [px(col), py(row)] as const);

const PEAK = RIDGE.reduce((lowest, point) => (point[1] < lowest[1] ? point : lowest));

const toSmoothPath = (points: typeof RIDGE) =>
  points
    .map(([x, y], i) => {
      if (i === 0) return `M${x} ${y}`;

      const [prevX, prevY] = points[i - 1];
      const midX = (prevX + x) / 2;

      return `C${midX} ${prevY} ${midX} ${y} ${x} ${y}`;
    })
    .join(' ');

const Thumbnail = () => {
  return (
    <svg viewBox="0 0 220 124" fill="none" className="h-full w-full" aria-hidden>
      <g className="fill-line">
        {DOTS.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={2} />
        ))}
      </g>

      <path
        d={toSmoothPath(RIDGE)}
        strokeWidth={2}
        strokeLinecap="round"
        className="stroke-accent"
      />

      <g className="fill-main">
        {RIDGE.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={3} />
        ))}
      </g>

      <circle cx={PEAK[0]} cy={PEAK[1]} r={4} className="fill-accent" />
    </svg>
  );
};

export default Thumbnail;
