'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import Controller from '~/boids/controller';
import { type Boid, createFlock, DEFAULT_WEIGHTS, step, type Weights } from '~/boids/engine';

const WIDTH = 800;
const HEIGHT = 450;
const COUNT = 30;
const DOT_SPACING = 40;

const DOT_COLS = Math.floor(WIDTH / DOT_SPACING);
const DOT_ROWS = Math.floor(HEIGHT / DOT_SPACING);
const DOTS = Array.from({ length: DOT_COLS }, (_, col) => col).flatMap((col) =>
  Array.from({ length: DOT_ROWS }, (_, row) => row).map(
    (row) => [DOT_SPACING / 2 + col * DOT_SPACING, DOT_SPACING / 2 + row * DOT_SPACING] as const
  )
);

const BoidShape = ({ x, y, vx, vy, id }: Boid) => (
  <polygon
    points="14,0 -9,6 -9,-6"
    transform={`translate(${x} ${y}) rotate(${(Math.atan2(vy, vx) * 180) / Math.PI})`}
    className={id % 8 === 0 ? 'fill-accent' : 'fill-muted'}
  />
);

const Boids = () => {
  const [boids, setBoids] = useState<Boid[]>(() => createFlock(COUNT, WIDTH, HEIGHT));
  const [speed, setSpeed] = useState(1);
  const [paused, setPaused] = useState(false);
  const [weights, setWeights] = useState<Weights>(DEFAULT_WEIGHTS);

  const speedRef = useRef(speed);
  const pauseRef = useRef(paused);
  const weightsRef = useRef(weights);

  const togglePause = useCallback(() => {
    pauseRef.current = !pauseRef.current;
    setPaused(pauseRef.current);
  }, []);

  const increaseSpeed = useCallback(() => {
    speedRef.current = (speedRef.current * 2) % 2 ** 4 || 1;
    setSpeed(speedRef.current);
  }, []);

  const reset = useCallback(() => setBoids(createFlock(COUNT, WIDTH, HEIGHT)), []);

  const setWeight = useCallback((key: keyof Weights, value: number) => {
    weightsRef.current = { ...weightsRef.current, [key]: value };
    setWeights(weightsRef.current);
  }, []);

  useEffect(() => {
    let frameId: number;

    const tick = () => {
      if (!pauseRef.current) {
        setBoids((prev) => {
          let next = prev;
          for (let i = 0; i < speedRef.current; i++) {
            next = step(next, WIDTH, HEIGHT, weightsRef.current);
          }
          return next;
        });
      }
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <section className="space-y-2.5">
      <div className="aspect-video overflow-hidden rounded border-2 border-line bg-surface">
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-full w-full">
          <g className="fill-line">
            {DOTS.map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r={1.5} />
            ))}
          </g>
          {boids.map((boid) => (
            <BoidShape key={boid.id} {...boid} />
          ))}
        </svg>
      </div>
      <Controller
        state={{ speed, paused, weights }}
        control={{ increaseSpeed, togglePause, reset, setWeight }}
      />
    </section>
  );
};

export default Boids;
