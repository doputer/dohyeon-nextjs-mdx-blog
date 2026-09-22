'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import Controller from '#/perlin-noise-terrain/controller';
import { fbm, PerlinNoise } from '#/perlin-noise-terrain/engine';

const WIDTH = 400;
const HEIGHT = 225;
const ROWS = 7;
const TOP_PAD = 34;
const BOTTOM_PAD = 14;
const ROW_GAP = (HEIGHT - TOP_PAD - BOTTOM_PAD) / (ROWS - 1);
const AMPLITUDE = ROW_GAP * 1.3;
const ROW_NOISE_STEP = 0.55;
const POINTS = 64;
const FREQUENCY = 2.4;
const SCROLL_SPEED = 0.00012;
const TRANSITION_MS = 900;

const SKY_DOTS = Array.from({ length: 12 }, (_, col) =>
  Array.from({ length: 3 }, (_, row) => [16 + col * 32, 6 + row * 8] as const)
).flat();

const lerp = (a: number, b: number, t: number) => a + t * (b - a);
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

const strokeClass = (row: number) => {
  if (row === ROWS - 1) return 'stroke-accent';
  if (row === ROWS - 2) return 'stroke-main';
  return 'stroke-line';
};

export interface Terrain {
  octaves: number;
  amplitude: number;
}

export const DEFAULT_TERRAIN: Terrain = { octaves: 4, amplitude: 1 };

interface Transition {
  from: PerlinNoise;
  to: PerlinNoise;
  start: number;
}

interface Row {
  points: { x: number; y: number }[];
}

const heightAt = (noise: PerlinNoise, xNorm: number, row: number, time: number, octaves: number) =>
  fbm(noise, xNorm * FREQUENCY + time, row * ROW_NOISE_STEP, octaves);

const sampleHeight = (
  noise: PerlinNoise,
  transition: Transition | null,
  blend: number,
  time: number,
  xNorm: number,
  row: number,
  octaves: number
) => {
  if (!transition) return heightAt(noise, xNorm, row, time, octaves);

  const from = heightAt(transition.from, xNorm, row, time, octaves);
  const to = heightAt(transition.to, xNorm, row, time, octaves);
  return lerp(from, to, easeInOutCubic(blend));
};

const buildRows = (
  noise: PerlinNoise,
  transition: Transition | null,
  blend: number,
  time: number,
  terrain: Terrain
): Row[] =>
  Array.from({ length: ROWS }, (_, row) => {
    const baseline = TOP_PAD + row * ROW_GAP;
    const points = Array.from({ length: POINTS + 1 }, (_, i) => {
      const xNorm = i / POINTS;
      const h = sampleHeight(noise, transition, blend, time, xNorm, row, terrain.octaves);
      return { x: xNorm * WIDTH, y: baseline - (h * 0.5 + 0.5) * AMPLITUDE * terrain.amplitude };
    });
    return { points };
  });

const PerlinNoiseTerrain = () => {
  const [speed, setSpeed] = useState(1);
  const [paused, setPaused] = useState(false);
  const [terrain, setTerrain] = useState<Terrain>(DEFAULT_TERRAIN);
  const [rows, setRows] = useState(() =>
    buildRows(new PerlinNoise(1), null, 0, 0, DEFAULT_TERRAIN)
  );

  const speedRef = useRef(speed);
  const pauseRef = useRef(false);
  const timeRef = useRef(0);
  const noiseRef = useRef(new PerlinNoise(1));
  const transitionRef = useRef<Transition | null>(null);
  const blendRef = useRef(0);
  const terrainRef = useRef(terrain);

  const togglePause = useCallback(() => {
    pauseRef.current = !pauseRef.current;
    setPaused(pauseRef.current);
  }, []);

  const increaseSpeed = useCallback(() => {
    speedRef.current = (speedRef.current * 2) % 2 ** 4 || 1;
    setSpeed(speedRef.current);
  }, []);

  const regenerate = useCallback(() => {
    transitionRef.current = {
      from: noiseRef.current,
      to: new PerlinNoise(Math.floor(Math.random() * 1e9)),
      start: performance.now(),
    };
  }, []);

  const setTerrainValue = useCallback((key: keyof Terrain, value: number) => {
    terrainRef.current = { ...terrainRef.current, [key]: value };
    setTerrain(terrainRef.current);
  }, []);

  useEffect(() => {
    let frameId: number;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = now - last;
      last = now;

      if (!pauseRef.current) {
        timeRef.current += dt * SCROLL_SPEED * speedRef.current;
      }

      const transition = transitionRef.current;
      if (transition) {
        blendRef.current = Math.min(1, (now - transition.start) / TRANSITION_MS);
        if (blendRef.current >= 1) {
          noiseRef.current = transition.to;
          transitionRef.current = null;
        }
      }

      setRows(
        buildRows(
          noiseRef.current,
          transitionRef.current,
          blendRef.current,
          timeRef.current,
          terrainRef.current
        )
      );
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <section className="space-y-2.5">
      <div className="aspect-video overflow-hidden rounded border border-line bg-background">
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-full w-full" fill="none" aria-hidden>
          <g className="fill-line">
            {SKY_DOTS.map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r={1.5} />
            ))}
          </g>
          {rows.map((row, i) => {
            const ridge = row.points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L');

            return (
              <g key={i}>
                <path
                  d={`M0,${HEIGHT} L${ridge} L${WIDTH},${HEIGHT} Z`}
                  className="fill-background"
                />
                <polyline
                  points={row.points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}
                  strokeWidth={i === ROWS - 1 ? 2 : 1.25}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={strokeClass(i)}
                />
              </g>
            );
          })}
        </svg>
      </div>
      <Controller
        state={{ speed, paused, terrain }}
        control={{ increaseSpeed, togglePause, regenerate, setTerrainValue }}
      />
    </section>
  );
};

export default PerlinNoiseTerrain;
