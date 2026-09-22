'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import Controller from '#/astar/controller';
import { key, type Point, search, sleep, type Step } from '#/astar/engine';
import Grid from '#/astar/grid';

const ROWS = 12;
const COLS = 21;
const START: Point = { row: Math.floor(ROWS / 2), col: 1 };
const END: Point = { row: Math.floor(ROWS / 2), col: COLS - 2 };

const Astar = () => {
  const [walls, setWalls] = useState<Set<string>>(() => new Set());
  const [step, setStep] = useState<Step | null>(null);
  const [speed, setSpeed] = useState(1);
  const [paused, setPaused] = useState(false);

  const speedRef = useRef(speed);
  const pauseRef = useRef(false);
  const paintingRef = useRef<boolean | null>(null);

  const togglePause = useCallback(() => {
    pauseRef.current = !pauseRef.current;
    setPaused(pauseRef.current);
  }, []);

  const increaseSpeed = useCallback(() => {
    speedRef.current = (speedRef.current * 2) % 2 ** 4 || 1;
    setSpeed(speedRef.current);
  }, []);

  const reset = useCallback(() => setWalls(new Set()), []);

  useEffect(() => {
    let cancelled = false;
    const timeoutId = setTimeout(() => {
      const animate = async () => {
        setStep(null);

        const generator = search(walls, ROWS, COLS, START, END);

        for (const s of generator) {
          while (pauseRef.current) {
            if (cancelled) return;
            await sleep();
          }
          if (cancelled) return;

          setStep(s);
          await sleep(80 / speedRef.current);
        }
      };

      void animate();
    }, 150);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [walls]);

  const paintCell = useCallback((p: Point, next: boolean) => {
    if (key(p) === key(START) || key(p) === key(END)) return;

    setWalls((prev) => {
      const draft = new Set(prev);
      if (next) draft.add(key(p));
      else draft.delete(key(p));
      return draft;
    });
  }, []);

  const onPointerDown = useCallback(
    (p: Point) => {
      if (key(p) === key(START) || key(p) === key(END)) return;

      const next = !walls.has(key(p));
      paintingRef.current = next;
      paintCell(p, next);
    },
    [walls, paintCell]
  );

  const onPointerEnter = useCallback(
    (p: Point) => {
      if (paintingRef.current === null) return;
      paintCell(p, paintingRef.current);
    },
    [paintCell]
  );

  useEffect(() => {
    const onPointerUp = () => {
      paintingRef.current = null;
    };

    window.addEventListener('pointerup', onPointerUp);
    return () => window.removeEventListener('pointerup', onPointerUp);
  }, []);

  return (
    <section className="space-y-2.5">
      <Grid
        rows={ROWS}
        cols={COLS}
        start={START}
        end={END}
        walls={walls}
        step={step}
        onPointerDown={onPointerDown}
        onPointerEnter={onPointerEnter}
      />
      <Controller state={{ speed, paused }} control={{ increaseSpeed, togglePause, reset }} />
    </section>
  );
};

export default Astar;
