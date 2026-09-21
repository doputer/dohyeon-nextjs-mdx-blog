const DOTS = [0, 1, 2, 3, 4, 5].flatMap((col) =>
  [0, 1, 2, 3, 4].map((row) => [30 + col * 30, 20 + row * 21] as const)
);

const CELL = 16;
const GRID_X = 128;
const GRID_Y = 22;

const ALIVE = [
  { col: 2, row: 1, accent: true },
  { col: 3, row: 2, accent: false },
  { col: 1, row: 3, accent: false },
  { col: 2, row: 3, accent: false },
  { col: 3, row: 3, accent: false },
] as const;

const Thumbnail = () => {
  return (
    <svg viewBox="0 0 220 124" fill="none" className="h-full w-full" aria-hidden>
      <g className="fill-line">
        {DOTS.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={2} />
        ))}
      </g>

      {ALIVE.map(({ col, row, accent }) => (
        <rect
          key={`${col}-${row}`}
          x={GRID_X + col * CELL}
          y={GRID_Y + row * CELL}
          width={CELL - 2}
          height={CELL - 2}
          className={accent ? 'fill-accent' : 'fill-main'}
        />
      ))}
    </svg>
  );
};

export default Thumbnail;
