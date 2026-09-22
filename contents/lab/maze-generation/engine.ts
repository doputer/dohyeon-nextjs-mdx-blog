export interface Point {
  row: number;
  col: number;
}

export type Step =
  | { status: 'carving'; current: Point; visited: Set<string>; open: Set<string> }
  | { status: 'backtracking'; current: Point; visited: Set<string>; open: Set<string> }
  | { status: 'done'; visited: Set<string>; open: Set<string> };

export const key = (p: Point) => `${p.row},${p.col}`;

export const edgeKey = (a: Point, b: Point) => [key(a), key(b)].toSorted().join('|');

const neighbors = (p: Point, rows: number, cols: number): Point[] =>
  [
    { row: p.row - 1, col: p.col },
    { row: p.row + 1, col: p.col },
    { row: p.row, col: p.col - 1 },
    { row: p.row, col: p.col + 1 },
  ].filter((n) => n.row >= 0 && n.row < rows && n.col >= 0 && n.col < cols);

const pickRandom = <T>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

export function* generate(rows: number, cols: number, start: Point): Generator<Step> {
  const visited = new Set<string>([key(start)]);
  const open = new Set<string>();
  const stack: Point[] = [start];

  yield { status: 'carving', current: start, visited: new Set(visited), open: new Set(open) };

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const unvisited = neighbors(current, rows, cols).filter((n) => !visited.has(key(n)));

    if (unvisited.length === 0) {
      stack.pop();

      const back = stack[stack.length - 1];
      if (back) {
        yield {
          status: 'backtracking',
          current: back,
          visited: new Set(visited),
          open: new Set(open),
        };
      }

      continue;
    }

    const next = pickRandom(unvisited);

    open.add(edgeKey(current, next));
    visited.add(key(next));
    stack.push(next);

    yield { status: 'carving', current: next, visited: new Set(visited), open: new Set(open) };
  }

  yield { status: 'done', visited: new Set(visited), open: new Set(open) };
}

export const sleep = (ms = 50) => new Promise((resolve) => setTimeout(resolve, ms));
