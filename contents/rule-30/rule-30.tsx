'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import Controller from '#/rule-30/controller';
import Automaton, { type Cell, createSeed } from '#/rule-30/engine';

const WIDTH = 141;
const MAX_ROWS = 79;
const DEFAULT_RULE = 30;
const TICK_MS = 80;

const Rule30 = () => {
  const [rule, setRule] = useState(DEFAULT_RULE);
  const [rows, setRows] = useState<Cell[][]>(() => [createSeed(WIDTH)]);
  const [speed, setSpeed] = useState(1);
  const [paused, setPaused] = useState(false);

  const speedRef = useRef(speed);
  const pauseRef = useRef(false);
  const ruleRef = useRef(rule);
  const countRef = useRef(1);
  const automatonRef = useRef(new Automaton(createSeed(WIDTH), rule));

  const togglePause = useCallback(() => {
    pauseRef.current = !pauseRef.current;
    setPaused(pauseRef.current);
  }, []);

  const increaseSpeed = useCallback(() => {
    speedRef.current = (speedRef.current * 2) % 2 ** 4 || 1;
    setSpeed(speedRef.current);
  }, []);

  const restart = useCallback(() => {
    automatonRef.current = new Automaton(createSeed(WIDTH), ruleRef.current);
    countRef.current = 1;
    setRows([createSeed(WIDTH)]);
  }, []);

  const setRuleValue = useCallback((value: number) => {
    ruleRef.current = value;
    setRule(value);
    automatonRef.current = new Automaton(createSeed(WIDTH), value);
    countRef.current = 1;
    setRows([createSeed(WIDTH)]);
  }, []);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (!pauseRef.current) {
        if (countRef.current >= MAX_ROWS) {
          automatonRef.current = new Automaton(createSeed(WIDTH), ruleRef.current);
          countRef.current = 1;
          setRows([createSeed(WIDTH)]);
        } else {
          automatonRef.current.next();
          countRef.current += 1;
          setRows((prev) => [...prev, automatonRef.current.view()]);
        }
      }
      timeoutId = setTimeout(tick, TICK_MS / speedRef.current);
    };

    timeoutId = setTimeout(tick, TICK_MS / speedRef.current);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <section className="space-y-2.5">
      <div className="aspect-video overflow-hidden rounded border-2 border-line bg-surface">
        <svg viewBox={`0 0 ${WIDTH} ${MAX_ROWS}`} className="h-full w-full" aria-hidden>
          {rows.map((row, y) =>
            row.map((cell, x) =>
              cell === 1 ? (
                <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} className="fill-main" />
              ) : null
            )
          )}
        </svg>
      </div>
      <Controller
        state={{ speed, paused, rule }}
        control={{ increaseSpeed, togglePause, restart, setRule: setRuleValue }}
      />
    </section>
  );
};

export default Rule30;
