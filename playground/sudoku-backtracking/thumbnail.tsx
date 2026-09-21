const DOTS = [0, 1, 2, 3, 4, 5].flatMap((col) =>
  [0, 1, 2, 3, 4].map((row) => [30 + col * 30, 20 + row * 21] as const)
);

const CELL = 22;
const GRID_X = 124;
const GRID_Y = 17;
const SIZE = 3;

const FILLED = [
  [0, 0],
  [2, 0],
  [1, 1],
  [0, 2],
] as const;

const Thumbnail = () => {
  return (
    <svg viewBox="0 0 220 124" fill="none" className="h-full w-full" aria-hidden>
      <g className="fill-line">
        {DOTS.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={2} />
        ))}
      </g>

      <g className="stroke-line">
        {Array.from({ length: SIZE + 1 }, (_, i) => (
          <line
            key={`v-${i}`}
            x1={GRID_X + i * CELL}
            y1={GRID_Y}
            x2={GRID_X + i * CELL}
            y2={GRID_Y + SIZE * CELL}
            strokeWidth={2}
          />
        ))}
        {Array.from({ length: SIZE + 1 }, (_, i) => (
          <line
            key={`h-${i}`}
            x1={GRID_X}
            y1={GRID_Y + i * CELL}
            x2={GRID_X + SIZE * CELL}
            y2={GRID_Y + i * CELL}
            strokeWidth={2}
          />
        ))}
      </g>

      <g className="fill-muted">
        {FILLED.map(([col, row]) => (
          <circle
            key={`${col}-${row}`}
            cx={GRID_X + col * CELL + CELL / 2}
            cy={GRID_Y + row * CELL + CELL / 2}
            r={3}
          />
        ))}
      </g>

      <rect
        x={GRID_X + 2 * CELL}
        y={GRID_Y}
        width={CELL}
        height={CELL}
        className="fill-accent/30"
      />
      <rect
        x={GRID_X + CELL}
        y={GRID_Y + 2 * CELL}
        width={CELL}
        height={CELL}
        strokeWidth={1.5}
        strokeDasharray="3 3"
        className="stroke-main/40"
      />
    </svg>
  );
};

export default Thumbnail;
