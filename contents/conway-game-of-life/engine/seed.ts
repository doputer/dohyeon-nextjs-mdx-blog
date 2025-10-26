import type { Cell } from '#/conway-game-of-life/engine/automaton';

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

  // Spaceships
  | 'Glider'

  // Methuselah
  | 'R-Pentomino';

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

  // Methuselah
  'R-Pentomino': [
    [0, 0, 0, 0, 0],
    [0, 0, 1, 1, 0],
    [0, 1, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0],
  ],
};
