'use client';

import { useEffect, useRef, useState } from 'react';

import { PauseIcon, PlayIcon } from '@heroicons/react/24/solid';

import { cn } from '@/utils/cn';

import { cloneBoard, sleep, solve } from './solver';

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
  const [speed, setSpeed] = useState(2);
  const [paused, setPaused] = useState(false);

  const speedRef = useRef(speed);
  const pauseRef = useRef(paused);

  const increaseSpeed = () => {
    speedRef.current = (speedRef.current * 2) % 16 || 1;
    setSpeed(speedRef.current);
  };

  const togglePause = () => {
    pauseRef.current = !pauseRef.current;
    setPaused(pauseRef.current);
  };

  useEffect(() => {
    const animate = async () => {
      const generator = solve(initialBoard);

      for (const nextBoard of generator) {
        while (pauseRef.current) await sleep();
        setBoard(cloneBoard(nextBoard));
        await sleep(100 / speedRef.current);
      }

      setTimeout(animate, 1500);
    };

    animate();
  }, []);

  return (
    <section className="flex flex-col items-center space-y-2">
      <div className="relative grid aspect-square size-full h-auto max-w-100 grid-cols-9 grid-rows-9">
        {board.map((row, i) =>
          row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              className={cn(
                'flex items-center justify-center border-line text-lg font-medium',
                i % 3 === 0 ? 'border-t-4' : 'border-t-2',
                j % 3 === 0 ? 'border-l-4' : 'border-l-2',
                i === 8 && 'border-b-4',
                j === 8 && 'border-r-4',
                initialBoard[i][j] === 0 && 'text-link'
              )}
            >
              {cell || ''}
            </div>
          ))
        )}
      </div>
      <div className="flex items-center gap-1">
        <button
          className="box-content flex size-6 items-center justify-center rounded p-1 text-lg font-medium select-none hover:bg-surface"
          onClick={increaseSpeed}
        >
          X{speed}
        </button>
        <button
          className="box-content flex size-6 items-center justify-center rounded p-1 select-none hover:bg-surface"
          onClick={togglePause}
        >
          {paused ? <PlayIcon className="size-5" /> : <PauseIcon className="size-5" />}
        </button>
      </div>
    </section>
  );
};

export default Sudoku;
