'use client';

import { type RefObject, useCallback, useEffect, useRef, useState } from 'react';

import { sleep, solve, type Step } from '#/sudoku-backtracking/engine/solver';
import Controller from '#/sudoku-backtracking/visualizer/controller';
import Grid, { makeLockedMask } from '#/sudoku-backtracking/visualizer/grid';

const initialBoard = [
  [0, 5, 2, 0, 0, 7, 0, 9, 8],
  [1, 0, 6, 0, 5, 8, 0, 0, 4],
  [0, 0, 0, 0, 1, 0, 7, 0, 0],
  [0, 6, 0, 0, 0, 3, 2, 1, 0],
  [0, 0, 8, 1, 0, 5, 6, 0, 0],
  [0, 1, 9, 6, 0, 0, 0, 3, 0],
  [0, 0, 3, 0, 4, 0, 0, 0, 0],
  [6, 0, 0, 2, 8, 9, 0, 0, 0],
  [9, 2, 0, 7, 0, 0, 4, 8, 0],
];

interface RunProps {
  speed: number;
  speedRef: RefObject<number>;
  increaseSpeed: () => void;
  reset: () => void;
}

const Run = ({ speed, speedRef, increaseSpeed, reset }: RunProps) => {
  const [board, setBoard] = useState(initialBoard);
  const [paused, setPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>();

  const pauseRef = useRef(false);

  const togglePause = useCallback(() => {
    pauseRef.current = !pauseRef.current;
    setPaused(pauseRef.current);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const animate = async () => {
      const generator = solve(initialBoard);

      for (const step of generator) {
        while (pauseRef.current) {
          if (cancelled) return;
          await sleep();
        }
        if (cancelled) return;

        setCurrentStep(step);
        setBoard(step.board);
        await sleep(500 / speedRef.current);
      }

      timeoutId = setTimeout(animate, 1500);
    };

    void animate();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [speedRef]);

  return (
    <section className="mx-auto w-full max-w-xs space-y-2.5">
      <Grid
        board={board}
        currentStep={currentStep}
        lockedMask={makeLockedMask(initialBoard)}
        readOnly
      />
      <Controller state={{ speed, paused }} control={{ increaseSpeed, togglePause, reset }} />
    </section>
  );
};

const Sudoku = () => {
  const [speed, setSpeed] = useState(1);
  const [runId, setRunId] = useState(0);

  const speedRef = useRef(speed);

  const increaseSpeed = useCallback(() => {
    speedRef.current = (speedRef.current * 2) % 2 ** 4 || 1;
    setSpeed(speedRef.current);
  }, []);

  const reset = useCallback(() => setRunId((id) => id + 1), []);

  return (
    <Run
      key={runId}
      speed={speed}
      speedRef={speedRef}
      increaseSpeed={increaseSpeed}
      reset={reset}
    />
  );
};

export default Sudoku;
