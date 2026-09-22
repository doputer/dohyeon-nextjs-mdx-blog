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

const FLOCK = [
  { col: 1, row: 4, heading: -30, accent: false },
  { col: 2, row: 3, heading: -38, accent: false },
  { col: 2, row: 2, heading: -33, accent: false },
  { col: 3, row: 2, heading: -40, accent: false },
  { col: 3, row: 1, heading: -35, accent: false },
  { col: 4, row: 0, heading: -35, accent: true },
] as const;

const Boid = ({ col, row, heading, accent }: (typeof FLOCK)[number]) => (
  <polygon
    points="9,0 -6,4 -6,-4"
    transform={`translate(${px(col)} ${py(row)}) rotate(${heading})`}
    className={accent ? 'fill-accent' : 'fill-muted'}
  />
);

const Thumbnail = () => {
  return (
    <svg viewBox="0 0 220 124" fill="none" className="h-full w-full" aria-hidden>
      <g className="fill-line">
        {DOTS.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={2} />
        ))}
      </g>
      {FLOCK.map((boid) => (
        <Boid key={`${boid.col}-${boid.row}`} {...boid} />
      ))}
    </svg>
  );
};

export default Thumbnail;
