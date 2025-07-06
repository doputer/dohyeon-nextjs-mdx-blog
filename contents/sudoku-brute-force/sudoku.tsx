'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { PauseIcon, PlayIcon } from '@heroicons/react/24/solid';

import { cn } from '@/utils/cn';

import { sleep, solve, type Step } from './solver';

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

  useEffect(() => {
    const animate = async () => {
      const generator = solve(initialBoard);

      for (const step of generator) {
        while (pauseRef.current) await sleep();
        setCurrentStep(step);
        setBoard(step.board);
        await sleep(500 / speedRef.current);
      }

      setTimeout(animate, 1500);
    };

    animate();
  }, []);

  return (
    <section className="flex flex-col items-center space-y-2">
      <div className="grid aspect-square size-full max-w-100 grid-cols-9 grid-rows-9">
        {board.map((row, i) =>
          row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              className={cn(
                'relative flex items-center justify-center border-line',
                i % 3 === 0 ? 'border-t-4' : 'border-t-2',
                j % 3 === 0 ? 'border-l-4' : 'border-l-2',
                i === 8 && 'border-b-4',
                j === 8 && 'border-r-4'
              )}
            >
              <span
                className={cn(
                  'relative z-10',
                  initialBoard[i][j] === 0 && 'text-blue dark:text-green'
                )}
              >
                {cell || ''}
              </span>
              <div
                className={cn(
                  'absolute inset-0',
                  currentStep?.row === i &&
                    currentStep?.col === j &&
                    currentStep.status === 'try' &&
                    'bg-surface',
                  currentStep?.row === i &&
                    currentStep?.col === j &&
                    currentStep.status === 'back' &&
                    'bg-red/30'
                )}
              />
            </div>
          ))
        )}
      </div>
      <div className="flex h-8 gap-1">
        <button
          className="rounded px-2 text-lg font-medium select-none hover:bg-surface"
          onClick={increaseSpeed}
        >
          X{speed}
        </button>
        <button className="rounded px-2 select-none hover:bg-surface" onClick={togglePause}>
          {paused ? <PlayIcon className="size-5" /> : <PauseIcon className="size-5" />}
        </button>
      </div>
    </section>
  );
};

export default Sudoku;
