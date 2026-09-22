'use client';

import { type RefObject, useCallback, useEffect, useRef, useState } from 'react';

import Chart from '#/selection-sort/chart';
import Controller from '#/selection-sort/controller';
import { selectionSort, shuffle, sleep } from '#/selection-sort/engine';

const SIZE = 24;

interface RunProps {
  speed: number;
  speedRef: RefObject<number>;
  increaseSpeed: () => void;
  restart: () => void;
}

const Run = ({ speed, speedRef, increaseSpeed, restart }: RunProps) => {
  const [array, setArray] = useState<number[]>([]);
  const [candidate, setCandidate] = useState(-1);
  const [probe, setProbe] = useState<number | null>(null);
  const [sortedTo, setSortedTo] = useState(0);
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

      for (const step of selectionSort(seed)) {
        while (pauseRef.current) {
          if (cancelled) return;
          await sleep();
        }
        if (cancelled) return;

        setArray(step.array);
        setCandidate(step.candidate);
        setProbe(step.probe);
        setSortedTo(step.sortedTo);
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
      <Chart array={array} max={SIZE} candidate={candidate} probe={probe} sortedTo={sortedTo} />
      <Controller state={{ speed, paused }} control={{ increaseSpeed, togglePause, restart }} />
    </section>
  );
};

const SelectionSort = () => {
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

export default SelectionSort;
