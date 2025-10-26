export type Cell = 1 | 0;

// prettier-ignore
const NEIGHBOR_OFFSETS = [
  [-1, -1], [0, -1], [1, -1],
  [-1,  0],          [1,  0],
  [-1,  1], [0,  1], [1,  1],
] as const;

const BIRTH = new Set([3]);
const SURVIVE = new Set([2, 3]);

class Automaton {
  private cell: Cell[][];
  private width: number;
  private height: number;

  constructor(seed: Cell[][]) {
    this.cell = seed;
    this.width = seed[0].length;
    this.height = seed.length;
  }

  private get(x: number, y: number) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return 0;
    return this.cell[y][x];
  }

  private neighbor(x: number, y: number) {
    let n = 0;

    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      n += this.get(x + dx, y + dy);
      if (n > 3) return n;
    }

    return n;
  }

  next() {
    const nextCell = this.cell.map((row) => row.slice());

    for (let y = 0; y < this.height; y++) {
      const row = this.cell[y];
      const nextRow = nextCell[y];

      for (let x = 0; x < this.width; x++) {
        const alive = row[x] === 1;
        const n = this.neighbor(x, y);

        nextRow[x] = (alive ? SURVIVE.has(n) : BIRTH.has(n)) ? 1 : 0;
      }
    }

    this.cell = nextCell;
  }

  view() {
    return this.cell;
  }
}

export default Automaton;
