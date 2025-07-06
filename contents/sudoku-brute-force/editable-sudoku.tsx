'use client';

import { useCallback, useRef, useState } from 'react';

import { PauseIcon, PlayIcon, StopIcon } from '@heroicons/react/24/solid';

import { cn } from '@/utils/cn';

import { cloneBoard, sleep, solve } from './solver';

const emptyBoard = Array.from({ length: 9 }, () => Array(9).fill(0));

const EditableSudoku = () => {
  const [board, setBoard] = useState(emptyBoard);
  const [speed, setSpeed] = useState(1);
  const [paused, setPaused] = useState(true);
  const [solving, setSolving] = useState(false);

  const boardRef = useRef<number[][]>(null);
  const speedRef = useRef(speed);
  const pauseRef = useRef(paused);
  const solvingRef = useRef(solving);
  const cancelRef = useRef(false);

  const handleSolve = useCallback(() => {
    if (solvingRef.current) return;

    cancelRef.current = false;
    boardRef.current = cloneBoard(board);
    solvingRef.current = true;
    pauseRef.current = false;

    setSolving(solvingRef.current);
    setPaused(pauseRef.current);

    const animate = async () => {
      const generator = solve(board);

      for (const nextBoard of generator) {
        if (cancelRef.current) return;
        while (pauseRef.current) await sleep();
        setBoard(cloneBoard(nextBoard));
        await sleep(200 / speedRef.current);
      }

      setTimeout(() => {
        setBoard(cloneBoard(boardRef.current ?? emptyBoard));
        animate();
      }, 1500);
    };

    animate();
  }, [board]);

  const increaseSpeed = useCallback(() => {
    speedRef.current = (speedRef.current * 2) % 2 ** 5 || 1;
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

  const clearBoard = useCallback(() => {
    cancelRef.current = true;
    boardRef.current = cloneBoard(emptyBoard);
    speedRef.current = 1;
    pauseRef.current = true;
    solvingRef.current = false;

    setBoard(boardRef.current);
    setSpeed(speedRef.current);
    setPaused(pauseRef.current);
    setSolving(solvingRef.current);
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
                solvingRef.current && boardRef.current?.[i][j] === 0 && 'text-link'
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
                className="size-full bg-transparent text-center outline-none"
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
          x{speed}
        </button>
        <button className="rounded px-2 select-none hover:bg-surface" onClick={togglePause}>
          {paused ? <PlayIcon className="size-5" /> : <PauseIcon className="size-5" />}
        </button>
        <button className="rounded px-2 select-none hover:bg-surface" onClick={clearBoard}>
          <StopIcon className="size-5" />
        </button>
      </div>
    </section>
  );
};

export default EditableSudoku;
