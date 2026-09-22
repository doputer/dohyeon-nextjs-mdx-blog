'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import {
  type Board,
  cloneBoard,
  isBoardValid,
  sleep,
  solve,
  type Step,
} from '#/sudoku-backtracking/engine/solver';
import Controller from '#/sudoku-backtracking/visualizer/controller';
import Grid, { makeLockedMask, type Mask } from '#/sudoku-backtracking/visualizer/grid';

const emptyBoard: Board = Array.from({ length: 9 }, () => Array(9).fill(0));

const EditableSudoku = () => {
  const [board, setBoard] = useState<Board>(emptyBoard);
  const [speed, setSpeed] = useState(1);
  const [paused, setPaused] = useState(true);
  const [solving, setSolving] = useState(false);
  const [message, setMessage] = useState<string>();
  const [currentStep, setCurrentStep] = useState<Step>();
  const [lockedMask, setLockedMask] = useState<Mask | undefined>(undefined);

  const boardRef = useRef<Board | null>(null);
  const speedRef = useRef(speed);
  const pauseRef = useRef(paused);
  const solvingRef = useRef(solving);
  const runIdRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const stopSolving = useCallback(() => {
    runIdRef.current += 1;
    clearTimeout(timeoutRef.current);

    solvingRef.current = false;
    pauseRef.current = true;

    setSolving(false);
    setPaused(true);
    setCurrentStep(undefined);
    setLockedMask(undefined);
    setBoard(cloneBoard(boardRef.current ?? emptyBoard));
  }, []);

  const handleSolve = useCallback(() => {
    if (solvingRef.current) return;

    if (!isBoardValid(board)) {
      setMessage('규칙에 어긋나는 숫자가 있어 풀이를 시작할 수 없습니다.');
      return;
    }

    const runId = ++runIdRef.current;

    boardRef.current = cloneBoard(board);
    solvingRef.current = true;
    pauseRef.current = false;

    setMessage(undefined);
    setLockedMask(makeLockedMask(boardRef.current));
    setSolving(true);
    setPaused(false);

    const animate = async () => {
      const generator = solve(boardRef.current ?? emptyBoard);
      let solved = false;

      for (const step of generator) {
        while (pauseRef.current) {
          if (runIdRef.current !== runId) return;
          await sleep();
        }
        if (runIdRef.current !== runId) return;

        setCurrentStep(step);
        setBoard(step.board);
        if (step.status === 'done') solved = true;
        await sleep(500 / speedRef.current);
      }

      if (!solved) {
        stopSolving();
        setMessage('해가 없는 배치입니다. 숫자를 수정한 뒤 다시 시도해보세요.');
        return;
      }

      timeoutRef.current = setTimeout(() => {
        setBoard(cloneBoard(boardRef.current ?? emptyBoard));
        animate();
      }, 1500);
    };

    animate();
  }, [board, stopSolving]);

  const increaseSpeed = useCallback(() => {
    speedRef.current = (speedRef.current * 2) % 2 ** 4 || 1;
    setSpeed(speedRef.current);
  }, []);

  const togglePause = useCallback(() => {
    if (!solvingRef.current) {
      handleSolve();
      return;
    }

    pauseRef.current = !pauseRef.current;
    setPaused(pauseRef.current);
  }, [handleSolve]);

  const reset = useCallback(() => {
    stopSolving();
    setMessage(undefined);
  }, [stopSolving]);

  useEffect(() => {
    return () => {
      runIdRef.current += 1;
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleChange = useCallback(
    (row: number, col: number, n: number) => {
      if (solvingRef.current) return;

      const next = cloneBoard(board);
      next[row][col] = n;
      setBoard(next);
      setMessage(undefined);
    },
    [board]
  );

  return (
    <section className="mx-auto w-full max-w-xs space-y-2.5">
      <Grid
        board={board}
        currentStep={currentStep}
        lockedMask={lockedMask}
        onChange={handleChange}
        readOnly={solving}
      />
      <Controller state={{ speed, paused }} control={{ increaseSpeed, togglePause, reset }} />
      {message && <p className="text-center text-xs font-medium text-main">{message}</p>}
    </section>
  );
};

export default EditableSudoku;
