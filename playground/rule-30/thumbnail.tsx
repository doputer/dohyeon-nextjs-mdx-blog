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

const RULE = 30;
const CELL_X = PITCH_X / 2;
const CELL_Y = PITCH_Y / 2;
const CELL_COLS = (COLS - 1) * 2;
const CELL_ROWS = (ROWS - 1) * 2;
const BUFFER = CELL_COLS + CELL_ROWS * 2;
const OFFSET = CELL_ROWS;

const generate = () => {
  let row = Array.from<0 | 1>({ length: BUFFER }).fill(0);
  row[Math.floor(BUFFER / 2)] = 1;
  const rows = [row];

  for (let r = 1; r < CELL_ROWS; r++) {
    const next = Array.from<0 | 1>({ length: BUFFER }).fill(0);

    for (let x = 0; x < BUFFER; x++) {
      const left = row[x - 1] ?? 0;
      const center = row[x];
      const right = row[x + 1] ?? 0;
      const index = left * 4 + center * 2 + right;

      next[x] = ((RULE >> index) & 1) as 0 | 1;
    }

    rows.push(next);
    row = next;
  }

  return rows.map((cells) => cells.slice(OFFSET, OFFSET + CELL_COLS));
};

const CELLS = generate();

const Thumbnail = () => {
  return (
    <svg viewBox="0 0 220 124" fill="none" className="h-full w-full" aria-hidden>
      <g className="fill-line">
        {DOTS.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={2} />
        ))}
      </g>

      {CELLS.map((row, y) =>
        row.map((cell, x) =>
          cell === 1 ? (
            <rect
              key={`${x}-${y}`}
              x={ORIGIN_X + x * CELL_X + 2}
              y={ORIGIN_Y + y * CELL_Y + 2}
              width={CELL_X - 4}
              height={CELL_Y - 4}
              className={y === 0 ? 'fill-accent' : 'fill-muted'}
            />
          ) : null
        )
      )}
    </svg>
  );
};

export default Thumbnail;
