'use client';

import { useCallback, useRef, useState } from 'react';

import { PauseIcon, PlayIcon } from '@heroicons/react/24/solid';

import { cn } from '@/utils/cn';

import { cloneBoard, sleep, solve, type Step } from './solver';

const emptyBoard = Array.from({ length: 9 }, () => Array(9).fill(0));

const EditableSudoku = () => {
  const [board, setBoard] = useState(emptyBoard);
  const [speed, setSpeed] = useState(1);
  const [paused, setPaused] = useState(true);
  const [solving, setSolving] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>();

  const boardRef = useRef<number[][]>(null);
  const speedRef = useRef(speed);
  const pauseRef = useRef(paused);
  const solvingRef = useRef(solving);

  const handleSolve = useCallback(() => {
    if (solvingRef.current) return;

    boardRef.current = cloneBoard(board);
    solvingRef.current = true;
    pauseRef.current = false;

    setSolving(solvingRef.current);
    setPaused(pauseRef.current);

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
    (row: number, col: number, value: string) => {
      const n = value === '' ? 0 : parseInt(value, 10);
      if (Number.isNaN(n) || n < 0 || n > 9) return;

      const nextBoard = cloneBoard(board);
      nextBoard[row][col] = n;
      setBoard(nextBoard);
    },
    [board]
  );

  return (
    <section className="mx-auto space-y-2 sm:max-w-3/4">
      <div className="grid aspect-square grid-cols-9 grid-rows-9">
        {board.map((row, i) =>
          row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              className={cn(
                'relative flex items-center justify-center border-line text-lg',
                i % 3 === 0 ? 'border-t-4' : 'border-t-2',
                j % 3 === 0 ? 'border-l-4' : 'border-l-2',
                i === 8 && 'border-b-4',
                j === 8 && 'border-r-4',
                solvingRef.current && boardRef.current?.[i][j] === 0 && 'text-blue dark:text-green'
              )}
            >
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]"
                maxLength={1}
                disabled={solving}
                value={cell || ''}
                onChange={(e) => handleChange(i, j, e.target.value)}
                className="relative z-10 size-full bg-transparent text-center outline-none"
              />
              <div
                className={cn(
                  'absolute inset-0',
                  currentStep?.row === i &&
                    currentStep?.col === j &&
                    currentStep.status === 'try' &&
                    'bg-surface',
                  currentStep?.row === i &&
                    currentStep?.col === j &&
                    currentStep.status === 'backtrack' &&
                    'bg-red/30'
                )}
              />
            </div>
          ))
        )}
      </div>

      <div className="flex h-8 justify-end gap-1">
        <button
          className="rounded px-2 text-lg font-medium select-none hover:bg-surface"
          onClick={increaseSpeed}
        >
          x{speed}
        </button>
        <button className="rounded px-2 select-none hover:bg-surface" onClick={togglePause}>
          {paused ? <PlayIcon className="size-5" /> : <PauseIcon className="size-5" />}
        </button>
      </div>
    </section>
  );
};

export default EditableSudoku;
