export type Cell = 1 | 0;

export const createSeed = (width: number): Cell[] => {
  const row = Array.from<Cell>({ length: width }).fill(0);
  row[Math.floor(width / 2)] = 1;
  return row;
};

class Automaton {
  private row: Cell[];
  private rule: number;

  constructor(seed: Cell[], rule: number) {
    this.row = seed;
    this.rule = rule;
  }

  private get(x: number) {
    if (x < 0 || x >= this.row.length) return 0;
    return this.row[x];
  }

  next() {
    const width = this.row.length;
    const nextRow: Cell[] = Array.from({ length: width });

    for (let x = 0; x < width; x++) {
      const index = this.get(x - 1) * 4 + this.get(x) * 2 + this.get(x + 1);
      nextRow[x] = ((this.rule >> index) & 1) as Cell;
    }

    this.row = nextRow;
  }

  view() {
    return this.row;
  }
}

export default Automaton;
