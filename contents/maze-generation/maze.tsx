'use client';

import { type RefObject, useCallback, useEffect, useRef, useState } from 'react';

import Controller from '#/maze-generation/controller';
import { generate, type Point, sleep, type Step } from '#/maze-generation/engine';
import Grid from '#/maze-generation/grid';

const ROWS = 13;
const COLS = 23;

const randomStart = (): Point => ({
  row: Math.floor(Math.random() * ROWS),
  col: Math.floor(Math.random() * COLS),
});

interface RunProps {
  speed: number;
  speedRef: RefObject<number>;
  increaseSpeed: () => void;
  regenerate: () => void;
}

const Run = ({ speed, speedRef, increaseSpeed, regenerate }: RunProps) => {
  const [step, setStep] = useState<Step | null>(null);
  const [paused, setPaused] = useState(false);

  const pauseRef = useRef(false);

  const togglePause = useCallback(() => {
    pauseRef.current = !pauseRef.current;
    setPaused(pauseRef.current);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const animate = async () => {
      const generator = generate(ROWS, COLS, randomStart());

      for (const s of generator) {
        while (pauseRef.current) {
          if (cancelled) return;
          await sleep();
        }
        if (cancelled) return;

        setStep(s);
        await sleep(20 / speedRef.current);
      }
    };

    void animate();

    return () => {
      cancelled = true;
    };
  }, [speedRef]);

  return (
    <section className="space-y-2.5">
      <Grid rows={ROWS} cols={COLS} step={step} />
      <Controller state={{ speed, paused }} control={{ increaseSpeed, togglePause, regenerate }} />
    </section>
  );
};

const Maze = () => {
  const [speed, setSpeed] = useState(1);
  const [runId, setRunId] = useState(0);

  const speedRef = useRef(speed);

  const increaseSpeed = useCallback(() => {
    speedRef.current = (speedRef.current * 2) % 2 ** 4 || 1;
    setSpeed(speedRef.current);
  }, []);

  const regenerate = useCallback(() => setRunId((id) => id + 1), []);

  return (
    <Run
      key={runId}
      speed={speed}
      speedRef={speedRef}
      increaseSpeed={increaseSpeed}
      regenerate={regenerate}
    />
  );
};

export default Maze;
