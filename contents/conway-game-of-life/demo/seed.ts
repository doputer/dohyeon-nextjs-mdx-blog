import type { Cell } from '#/conway-game-of-life/demo/automaton';

export type Pattern =
  // Still lifes
  | 'Block'
  | 'Boat'
  | 'Tub'
  | 'Beehive'
  | 'Loaf'

  // Oscillators
  | 'Toad'
  | 'Blinker'
  | 'Beacon'
  | 'Pulsar'

  // Spaceships
  | 'Glider'
  | 'LWSS'

  // Methuselah
  | 'R-Pentomino'
  | 'Diehard';

const place = (
  cells: Cell[][],
  { width, height, x, y }: { width: number; height: number; x: number; y: number }
): Cell[][] =>
  Array.from({ length: height }, (_, row) =>
    Array.from({ length: width }, (_, col) => cells[row - y]?.[col - x] ?? 0)
  );

export const SEED: Record<Pattern, Cell[][]> = {
  // Still lifes
  Block: [
    [1, 1],
    [1, 1],
  ],
  Beehive: [
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [0, 1, 1, 0],
  ],
  Loaf: [
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [0, 1, 0, 1],
    [0, 0, 1, 0],
  ],
  Boat: [
    [1, 1, 0],
    [1, 0, 1],
    [0, 1, 0],
  ],
  Tub: [
    [0, 1, 0],
    [1, 0, 1],
    [0, 1, 0],
  ],

  // Oscillators
  Blinker: [
    [0, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  Toad: [
    [0, 0, 0, 0],
    [0, 1, 1, 1],
    [1, 1, 1, 0],
    [0, 0, 0, 0],
  ],
  Beacon: [
    [1, 1, 0, 0],
    [1, 0, 0, 0],
    [0, 0, 0, 1],
    [0, 0, 1, 1],
  ],

  Pulsar: place(
    [
      [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
      [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
      [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
    ],
    { width: 17, height: 17, x: 2, y: 2 }
  ),

  // Spaceships
  Glider: [
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],

  LWSS: place(
    [
      [1, 0, 0, 1, 0],
      [0, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [0, 1, 1, 1, 1],
    ],
    { width: 32, height: 7, x: 1, y: 1 }
  ),

  // Methuselah
  'R-Pentomino': place(
    [
      [0, 1, 1],
      [1, 1, 0],
      [0, 1, 0],
    ],
    { width: 32, height: 20, x: 15, y: 8 }
  ),
  Diehard: place(
    [
      [0, 0, 0, 0, 0, 0, 1, 0],
      [1, 1, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 1, 1, 1],
    ],
    { width: 22, height: 25, x: 8, y: 5 }
  ),
};
