'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

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

const Sudoku = () => {
  const [board, setBoard] = useState(initialBoard);
  const [speed, setSpeed] = useState(1);
  const [paused, setPaused] = useState(false);
  const [runId, setRunId] = useState(0);
  const [currentStep, setCurrentStep] = useState<Step>();

  const speedRef = useRef(speed);
  const pauseRef = useRef(paused);

  const increaseSpeed = useCallback(() => {
    speedRef.current = (speedRef.current * 2) % 2 ** 4 || 1;
    setSpeed(speedRef.current);
  }, []);

  const togglePause = useCallback(() => {
    pauseRef.current = !pauseRef.current;
    setPaused(pauseRef.current);
  }, []);

  const reset = useCallback(() => {
    pauseRef.current = false;
    setPaused(false);
    setBoard(initialBoard);
    setCurrentStep(undefined);
    setRunId((id) => id + 1);
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

    animate();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [runId]);

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

export default Sudoku;
