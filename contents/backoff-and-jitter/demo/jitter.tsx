'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import {
  CAPACITY,
  type Client,
  CLIENT_COUNT,
  createWorld,
  doneOf,
  loadOf,
  progressOf,
  step,
  type Strategy,
  TICKS_PER_SECOND,
  type World,
} from '#/backoff-and-jitter/demo/engine';
import useInView from '#/backoff-and-jitter/demo/use-in-view';
import { cn } from '@/utils/cn';

const WIDTH = 400;
const HEIGHT = 225;
const MARGIN = 22;
const CLIENT_X = 58;
const CLIENT_R = 4;
const SERVER_X = 330;
const SERVER_Y = HEIGHT / 2;
const SERVER_R = 16;
const RING_R = 8;
const RING_LENGTH = 2 * Math.PI * RING_R;
const GAP = (HEIGHT - MARGIN * 2) / (CLIENT_COUNT - 1);

const LABELS: Record<Strategy, string> = {
  fixed: '단순 재시도',
  exponential: '지수 백오프',
  jitter: '지수 백오프 + 지터',
};

const clientY = (index: number) => MARGIN + GAP * index;

const pointAt = (index: number, t: number) => {
  const y = clientY(index);
  const dx = SERVER_X - CLIENT_X;
  const dy = SERVER_Y - y;
  const length = Math.hypot(dx, dy);
  const travel = (length - SERVER_R - CLIENT_R) * t;

  return {
    x: CLIENT_X + (dx / length) * (CLIENT_R + travel),
    y: y + (dy / length) * (CLIENT_R + travel),
  };
};

const packetAt = (index: number, client: Client) => {
  const progress = progressOf(client);
  return pointAt(index, client.phase === 'request' ? progress : 1 - progress);
};

interface Props {
  strategy: Strategy;
}

const Jitter = ({ strategy }: Props) => {
  const [world, setWorld] = useState<World>(createWorld);

  const { ref: sectionRef, inView } = useInView();

  const worldRef = useRef(world);
  const inViewRef = useRef(inView);
  const strategyRef = useRef(strategy);

  const rerun = useCallback(() => {
    worldRef.current = createWorld();
    setWorld(worldRef.current);
  }, []);

  useEffect(() => {
    inViewRef.current = inView;
    strategyRef.current = strategy;
  }, [inView, strategy]);

  useEffect(() => {
    let frameId: number;

    const tick = () => {
      const current = worldRef.current;

      if (inViewRef.current && current.finishedAt === null) {
        const next = step(current, strategyRef.current);
        worldRef.current = next;
        setWorld(next);
      }
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const load = loadOf(world);
  const elapsed = (world.finishedAt ?? world.tick) / TICKS_PER_SECOND;

  return (
    <section ref={sectionRef} className="space-y-2.5">
      <div className="border-2 border-line p-4 select-none">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-muted">
          <span className="text-main">{LABELS[strategy]}</span>
          <span className="font-mono">
            완료 {doneOf(world)}/{CLIENT_COUNT} · 시도 {world.attempts}회 · {elapsed.toFixed(1)}초
          </span>
        </div>

        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-auto w-full">
          {world.clients.map((_, i) => (
            <line
              key={i}
              x1={CLIENT_X}
              y1={clientY(i)}
              x2={SERVER_X}
              y2={SERVER_Y}
              strokeWidth={0.5}
              className="stroke-line"
            />
          ))}

          {world.clients.map((client, i) =>
            client.phase === 'waiting' && client.duration > TICKS_PER_SECOND / 4 ? (
              <circle
                key={i}
                cx={CLIENT_X}
                cy={clientY(i)}
                r={RING_R}
                strokeWidth={1.5}
                strokeDasharray={RING_LENGTH}
                strokeDashoffset={RING_LENGTH * progressOf(client)}
                transform={`rotate(-90 ${CLIENT_X} ${clientY(i)})`}
                className="fill-none stroke-soft"
              />
            ) : null
          )}

          {world.clients.map((client, i) => {
            if (client.phase !== 'request' && client.phase !== 'response') return null;

            const { x, y } = packetAt(i, client);
            const tone =
              client.phase === 'request'
                ? 'fill-main'
                : client.accepted
                  ? 'fill-accent-alt'
                  : 'fill-background stroke-main';

            return <circle key={i} cx={x} cy={y} r={3} strokeWidth={1} className={tone} />;
          })}

          {world.clients.map((client, i) => (
            <circle
              key={i}
              cx={CLIENT_X}
              cy={clientY(i)}
              r={CLIENT_R}
              strokeWidth={1}
              className={
                client.phase === 'done'
                  ? 'fill-accent-alt stroke-accent-alt'
                  : 'fill-background stroke-main'
              }
            />
          ))}

          <circle
            cx={SERVER_X}
            cy={SERVER_Y}
            r={SERVER_R}
            strokeWidth={1}
            className={cn('fill-background', load > CAPACITY ? 'stroke-accent' : 'stroke-main')}
          />
          {load > CAPACITY && (
            <circle
              cx={SERVER_X}
              cy={SERVER_Y}
              r={SERVER_R + 5}
              strokeWidth={1}
              strokeDasharray="3 3"
              className="fill-none stroke-accent"
            />
          )}
          {Array.from({ length: CAPACITY }, (_, i) => (
            <circle
              key={i}
              cx={SERVER_X}
              cy={SERVER_Y + (i - (CAPACITY - 1) / 2) * 8}
              r={2.5}
              strokeWidth={1}
              className={i < load ? 'fill-main stroke-main' : 'fill-none stroke-line'}
            />
          ))}
          <text
            x={SERVER_X}
            y={SERVER_Y + SERVER_R + 16}
            textAnchor="middle"
            className="fill-muted font-mono text-[8px]"
          >
            서버 {Math.min(load, CAPACITY)}/{CAPACITY}
          </text>
        </svg>
      </div>

      <div className="-mt-1 flex flex-wrap items-center justify-end gap-x-3 gap-y-1 px-0.5 text-xs text-muted select-none">
        <span className="flex items-center gap-1.5">
          <i className="inline-block size-2.5 rounded-full bg-main" />
          요청
        </span>
        <span className="flex items-center gap-1.5">
          <i className="inline-block size-2.5 rounded-full bg-accent-alt" />
          성공
        </span>
        <span className="flex items-center gap-1.5">
          <i className="inline-block size-2.5 rounded-full border border-main" />
          거절
        </span>
      </div>
      <fieldset aria-label="조작">
        <button
          type="button"
          onClick={rerun}
          className="border border-main px-2 py-0.5 text-sm text-main select-none"
        >
          다시 실행
        </button>
      </fieldset>
    </section>
  );
};

export default Jitter;
