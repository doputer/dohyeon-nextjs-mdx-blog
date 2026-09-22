export interface Point {
  row: number;
  col: number;
}

export type Step =
  | { status: 'searching'; current: Point; open: Point[]; closed: Point[] }
  | { status: 'found'; path: Point[]; closed: Point[] }
  | { status: 'not-found'; closed: Point[] };

export const key = (p: Point) => `${p.row},${p.col}`;

const pointFromKey = (k: string): Point => {
  const [row, col] = k.split(',').map(Number);
  return { row, col };
};

const heuristic = (a: Point, b: Point) => Math.abs(a.row - b.row) + Math.abs(a.col - b.col);

const neighbors = (p: Point, rows: number, cols: number): Point[] =>
  [
    { row: p.row - 1, col: p.col },
    { row: p.row + 1, col: p.col },
    { row: p.row, col: p.col - 1 },
    { row: p.row, col: p.col + 1 },
  ].filter((n) => n.row >= 0 && n.row < rows && n.col >= 0 && n.col < cols);

export function* search(
  walls: Set<string>,
  rows: number,
  cols: number,
  start: Point,
  end: Point
): Generator<Step> {
  const open = new Map<string, Point>([[key(start), start]]);
  const cameFrom = new Map<string, string>();
  const gScore = new Map<string, number>([[key(start), 0]]);
  const fScore = new Map<string, number>([[key(start), heuristic(start, end)]]);
  const closed = new Set<string>();

  while (open.size > 0) {
    let currentKey: string | null = null;
    let bestF = Infinity;

    for (const [k] of open) {
      const f = fScore.get(k) ?? Infinity;
      if (f < bestF) {
        bestF = f;
        currentKey = k;
      }
    }

    if (currentKey === null) break;

    const current = open.get(currentKey)!;

    if (currentKey === key(end)) {
      const path = [current];
      let k = currentKey;

      while (cameFrom.has(k)) {
        k = cameFrom.get(k)!;
        path.unshift(pointFromKey(k));
      }

      yield { status: 'found', path, closed: [...closed].map(pointFromKey) };

      return;
    }

    open.delete(currentKey);
    closed.add(currentKey);

    yield {
      status: 'searching',
      current,
      open: [...open.values()],
      closed: [...closed].map(pointFromKey),
    };

    for (const n of neighbors(current, rows, cols)) {
      const nk = key(n);
      if (walls.has(nk) || closed.has(nk)) continue;

      const tentativeG = (gScore.get(currentKey) ?? Infinity) + 1;
      if (tentativeG >= (gScore.get(nk) ?? Infinity)) continue;

      cameFrom.set(nk, currentKey);
      gScore.set(nk, tentativeG);
      fScore.set(nk, tentativeG + heuristic(n, end));
      if (!open.has(nk)) open.set(nk, n);
    }
  }

  yield { status: 'not-found', closed: [...closed].map(pointFromKey) };
}

export const sleep = (ms = 50) => new Promise((resolve) => setTimeout(resolve, ms));
