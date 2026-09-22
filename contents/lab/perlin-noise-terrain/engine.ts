const grad = (hash: number, x: number, y: number) => {
  switch (hash & 3) {
    case 0:
      return x + y;
    case 1:
      return -x + y;
    case 2:
      return x - y;
    default:
      return -x - y;
  }
};

const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (a: number, b: number, t: number) => a + t * (b - a);

const mulberry32 = (seed: number) => {
  let state = seed;

  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export class PerlinNoise {
  private perm = new Uint8Array(512);

  constructor(seed: number) {
    const random = mulberry32(seed);
    const table = Uint8Array.from({ length: 256 }, (_, i) => i);

    for (let i = 255; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [table[i], table[j]] = [table[j], table[i]];
    }

    for (let i = 0; i < 512; i++) this.perm[i] = table[i & 255];
  }

  noise2D(x: number, y: number) {
    const xi = Math.floor(x) & 255;
    const yi = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);

    const topRight = this.perm[this.perm[xi + 1] + yi + 1];
    const topLeft = this.perm[this.perm[xi] + yi + 1];
    const bottomRight = this.perm[this.perm[xi + 1] + yi];
    const bottomLeft = this.perm[this.perm[xi] + yi];

    const u = fade(xf);
    const v = fade(yf);

    const top = lerp(grad(topLeft, xf, yf - 1), grad(topRight, xf - 1, yf - 1), u);
    const bottom = lerp(grad(bottomLeft, xf, yf), grad(bottomRight, xf - 1, yf), u);

    return lerp(bottom, top, v);
  }
}

export const fbm = (noise: PerlinNoise, x: number, y: number, octaves = 4) => {
  let amplitude = 1;
  let frequency = 1;
  let sum = 0;
  let range = 0;

  for (let i = 0; i < octaves; i++) {
    sum += noise.noise2D(x * frequency, y * frequency) * amplitude;
    range += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return sum / range;
};
