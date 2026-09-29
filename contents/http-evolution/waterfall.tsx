'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import useInView from '#/http-evolution/hook/use-in-view';
import { cn } from '@/utils/cn';

type SegKind = 'setup' | 'transfer' | 'stall';

interface Segment {
  kind: SegKind;
  start: number;
  duration: number;
}

interface Row {
  label: string;
  segments: Segment[];
}

const RESOURCES = [
  { label: 'index.html', size: 2 },
  { label: 'style.css', size: 3 },
  { label: 'app.js', size: 6 },
  { label: 'hero.webp', size: 8 },
  { label: 'icon.svg', size: 1 },
  { label: 'font.woff2', size: 4 },
];

const SETUP = 4;
const STALL = 4;
const LOSS_AT = 0.5;

const endOf = (rows: Row[]) =>
  Math.max(...rows.flatMap((row) => row.segments.map((seg) => seg.start + seg.duration)));

const buildLaneSchedule = (reuseConnection: boolean): Row[] => {
  const laneEnd = [0, 0];
  const laneUsed = [false, false];

  return RESOURCES.map(({ label, size }, i) => {
    const lane = i % 2;
    const start = laneEnd[lane];
    const segments: Segment[] = [];
    let transferStart = start;
    if (!reuseConnection || !laneUsed[lane]) {
      segments.push({ kind: 'setup', start, duration: SETUP });
      transferStart = start + SETUP;
      laneUsed[lane] = true;
    }
    segments.push({ kind: 'transfer', start: transferStart, duration: size });
    laneEnd[lane] = transferStart + size;
    return { label, segments };
  });
};

const buildSchedule = (version: Version, loss: boolean): Row[] => {
  if (version === 'http1.0') return buildLaneSchedule(false);
  if (version === 'http1.1') return buildLaneSchedule(true);

  const setupCost = version === 'http3' ? SETUP / 2 : SETUP;
  const transferStart = setupCost;
  const lossAt = transferStart + LOSS_AT;

  return RESOURCES.map(({ label, size }, i) => {
    const segments: Segment[] = [];
    if (i === 0) segments.push({ kind: 'setup', start: 0, duration: setupCost });

    const blocked = loss && (version === 'http2' || i === 2);

    if (blocked) {
      segments.push({ kind: 'transfer', start: transferStart, duration: LOSS_AT });
      segments.push({ kind: 'stall', start: lossAt, duration: STALL });
      segments.push({ kind: 'transfer', start: lossAt + STALL, duration: size - LOSS_AT });
    } else {
      segments.push({ kind: 'transfer', start: transferStart, duration: size });
    }
    return { label, segments };
  });
};

const GLOBAL_MAX = endOf(buildSchedule('http1.0', false));

const UNIT_SEC = 0.1;

const SEG_STYLE: Record<SegKind, string> = {
  setup: 'bg-main/40',
  transfer: 'bg-main',
  stall: 'bg-main/10 border border-dashed border-main/40',
};

type Version = 'http1.0' | 'http1.1' | 'http2' | 'http3';

const LABELS: Record<Version, string> = {
  'http1.0': 'HTTP/1.0',
  'http1.1': 'HTTP/1.1',
  http2: 'HTTP/2',
  http3: 'HTTP/3',
};

const MAX_FRAME_SEC = 0.1;

const useElapsed = (total: number, inView: boolean) => {
  const [elapsed, setElapsed] = useState(0);
  const inViewRef = useRef(inView);

  useEffect(() => {
    inViewRef.current = inView;
  }, [inView]);

  useEffect(() => {
    let frameId: number;
    let last: number | null = null;

    const tick = (now: number) => {
      const delta = last === null ? 0 : Math.min(MAX_FRAME_SEC, (now - last) / 1000);
      last = now;
      if (inViewRef.current) setElapsed((prev) => Math.min(total, prev + delta / UNIT_SEC));
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [total]);

  const reset = useCallback(() => setElapsed(0), []);

  return { elapsed, reset };
};

interface BarsProps {
  rows: Row[];
  elapsed: number;
}

const Bars = ({ rows, elapsed }: BarsProps) => (
  <div className="flex flex-col gap-2">
    {rows.map((row) => (
      <div key={row.label} className="flex items-center gap-3">
        <span className="w-20 shrink-0 truncate font-mono text-xs text-muted lg:w-32">
          {row.label}
        </span>
        <div className="relative h-3 flex-1 rounded bg-background">
          {row.segments.map((seg, i) => (
            <div
              key={i}
              className={cn(
                'absolute top-0 h-full',
                SEG_STYLE[seg.kind],
                i === 0 && 'rounded-l',
                i === row.segments.length - 1 && 'rounded-r'
              )}
              style={{
                left: `${(seg.start / GLOBAL_MAX) * 100}%`,
                width: `${(Math.min(seg.duration, Math.max(0, elapsed - seg.start)) / GLOBAL_MAX) * 100}%`,
              }}
            />
          ))}
        </div>
      </div>
    ))}
  </div>
);

interface Props {
  version: Version;
  loss?: boolean;
}

const Waterfall = ({ version, loss: initialLoss = false }: Props) => {
  const [loss, setLoss] = useState(initialLoss);

  const { ref: sectionRef, inView } = useInView();

  const supportsLoss = version === 'http2' || version === 'http3';
  const rows = buildSchedule(version, supportsLoss && loss);
  const total = endOf(rows);

  const { elapsed, reset } = useElapsed(total, inView);

  const toggleLoss = (checked: boolean) => {
    setLoss(checked);
    reset();
  };

  return (
    <section ref={sectionRef} className="space-y-2.5">
      <div className="space-y-4 rounded border-2 border-line bg-surface p-4 select-none">
        <div className="flex items-center justify-between gap-4 font-mono text-xs text-muted">
          <span className="text-main">{LABELS[version]}</span>
          <span>{(elapsed * UNIT_SEC).toFixed(1)}초</span>
        </div>

        <Bars rows={rows} elapsed={elapsed} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-y-1 rounded border border-line bg-surface py-1 pr-1.5 pl-3.5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted select-none">
          <span className="flex items-center gap-1.5">
            <i className="inline-block size-2.5 rounded-xs bg-main/40" />
            연결 수립
          </span>
          <span className="flex items-center gap-1.5">
            <i className="inline-block size-2.5 rounded-xs bg-main" />
            전송
          </span>
          {supportsLoss && (
            <span className="flex items-center gap-1.5">
              <i className="inline-block size-2.5 rounded-xs border border-dashed border-main/40 bg-main/10" />
              재전송 대기
            </span>
          )}
        </div>

        <div className="flex items-center">
          {supportsLoss && (
            <button
              type="button"
              aria-pressed={loss}
              onClick={() => toggleLoss(!loss)}
              className="flex min-w-7 items-center justify-center gap-1.5 rounded px-1.5 py-0.5 text-xs font-medium text-muted select-none hover:bg-background hover:text-main"
            >
              <i
                className={cn(
                  'inline-block size-2.5 rounded-xs border border-main',
                  loss && 'bg-main'
                )}
              />
              패킷 유실
            </button>
          )}
          <button
            type="button"
            onClick={reset}
            className="ml-2.5 flex items-center justify-center rounded bg-main px-1.5 py-0.5 text-xs font-medium text-background select-none hover:opacity-85"
          >
            요청
          </button>
        </div>
      </div>
    </section>
  );
};

export default Waterfall;
