'use client';

import { useCallback, useRef, useState } from 'react';

import { cloneBoard, sleep, solve, type Step } from '#/sudoku-backtracking/engine/solver';
import Controller from '#/sudoku-backtracking/visualizer/controller';
import Grid, { type Board, makeLockedMask, type Mask } from '#/sudoku-backtracking/visualizer/grid';

const emptyBoard: Board = Array.from({ length: 9 }, () => Array(9).fill(0));

const EditableSudoku = () => {
  const [board, setBoard] = useState<Board>(emptyBoard);
  const [speed, setSpeed] = useState(1);
  const [paused, setPaused] = useState(true);
  const [solving, setSolving] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>();
  const [lockedMask, setLockedMask] = useState<Mask | undefined>(undefined);

  const boardRef = useRef<Board | null>(null);
  const speedRef = useRef(speed);
  const pauseRef = useRef(paused);
  const solvingRef = useRef(solving);

  const handleSolve = useCallback(() => {
    if (solvingRef.current) return;

    boardRef.current = cloneBoard(board);
    solvingRef.current = true;
    pauseRef.current = false;

    setLockedMask(makeLockedMask(boardRef.current));
    setSolving(true);
    setPaused(false);

    const animate = async () => {
      const generator = solve(board);

      for (const step of generator) {
        while (pauseRef.current) await sleep();
        setCurrentStep(step);
        setBoard(step.board);
        await sleep(500 / speedRef.current);
      }

      setTimeout(() => {
        setBoard(cloneBoard(boardRef.current ?? emptyBoard));
        animate();
      }, 1500);
    };

    animate();
  }, [board]);

  const increaseSpeed = useCallback(() => {
    speedRef.current = (speedRef.current * 2) % 2 ** 4 || 1;
    setSpeed(speedRef.current);
  }, []);

  const togglePause = useCallback(() => {
    pauseRef.current = !pauseRef.current;
    setPaused(pauseRef.current);

    if (!pauseRef.current && !solvingRef.current) handleSolve();
  }, [handleSolve]);

  const handleChange = useCallback(
    (row: number, col: number, n: number) => {
      const next = cloneBoard(board);
      next[row][col] = n;
      setBoard(next);
    },
    [board]
  );

  return (
    <section className="mx-auto w-full max-w-sm space-y-2">
      <Grid
        board={board}
        currentStep={currentStep}
        lockedMask={lockedMask}
        onChange={handleChange}
      />
      <Controller state={{ speed, paused }} control={{ increaseSpeed, togglePause }} />
    </section>
  );
};

export default EditableSudoku;
