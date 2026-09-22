'use client';

import { type RefObject, useCallback, useEffect, useRef, useState } from 'react';

import Chart from '#/bubble-sort/chart';
import Controller from '#/bubble-sort/controller';
import { bubbleSort, shuffle, sleep } from '#/bubble-sort/engine';

const SIZE = 24;

interface RunProps {
  speed: number;
  speedRef: RefObject<number>;
  increaseSpeed: () => void;
  restart: () => void;
}

const Run = ({ speed, speedRef, increaseSpeed, restart }: RunProps) => {
  const [array, setArray] = useState<number[]>([]);
  const [active, setActive] = useState<number[]>([]);
  const [sortedFrom, setSortedFrom] = useState(SIZE);
  const [paused, setPaused] = useState(false);

  const pauseRef = useRef(false);

  const togglePause = useCallback(() => {
    pauseRef.current = !pauseRef.current;
    setPaused(pauseRef.current);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const animate = async () => {
      const seed = shuffle(SIZE);
      setArray(seed);
      await sleep(150);

      for (const step of bubbleSort(seed)) {
        while (pauseRef.current) {
          if (cancelled) return;
          await sleep();
        }
        if (cancelled) return;

        setArray(step.array);
        setActive(step.active);
        setSortedFrom(step.sortedFrom);
        await sleep(120 / speedRef.current);
      }
    };

    void animate();

    return () => {
      cancelled = true;
    };
  }, [speedRef]);

  return (
    <section className="space-y-2.5">
      <Chart array={array} max={SIZE} active={active} sortedFrom={sortedFrom} />
      <Controller state={{ speed, paused }} control={{ increaseSpeed, togglePause, restart }} />
    </section>
  );
};

const BubbleSort = () => {
  const [speed, setSpeed] = useState(1);
  const [runId, setRunId] = useState(0);

  const speedRef = useRef(speed);

  const increaseSpeed = useCallback(() => {
    speedRef.current = (speedRef.current * 2) % 2 ** 4 || 1;
    setSpeed(speedRef.current);
  }, []);

  const restart = useCallback(() => setRunId((id) => id + 1), []);

  return (
    <Run
      key={runId}
      speed={speed}
      speedRef={speedRef}
      increaseSpeed={increaseSpeed}
      restart={restart}
    />
  );
};

export default BubbleSort;
