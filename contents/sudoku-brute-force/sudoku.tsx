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
    <section className="flex flex-col items-center space-y-1">
      <div className="relative mb-9 grid aspect-square size-full h-auto max-w-100 grid-cols-9 grid-rows-9">
        {board.map((row, i) =>
          row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              className={cn(
                'flex items-center justify-center border border-line text-lg font-medium',
                i % 3 === 0 && 'border-t-3',
                j % 3 === 0 && 'border-l-3',
                i === 8 && 'border-b-3',
                j === 8 && 'border-r-3',
                initialBoard[i][j] === 0 && 'text-link'
              )}
            >
              {cell !== 0 ? cell : ''}
            </div>
          ))
        )}
        <div className="absolute top-full right-0 flex translate-y-1 items-center justify-end gap-1">
          <button
            className="box-content flex size-6 items-center justify-center rounded p-1 text-lg font-medium hover:bg-surface"
            onClick={increaseSpeed}
          >
            X{speed}
          </button>
          <button
            className="box-content flex size-6 items-center justify-center rounded p-1 hover:bg-surface"
            onClick={togglePause}
          >
            {paused ? <PlayIcon className="size-5" /> : <PauseIcon className="size-5" />}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Sudoku;
