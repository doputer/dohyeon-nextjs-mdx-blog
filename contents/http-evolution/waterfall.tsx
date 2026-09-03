'use client';

import { useEffect, useState } from 'react';

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

interface BarsProps {
  rows: Row[];
  inView: boolean;
}

const Bars = ({ rows, inView }: BarsProps) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!inView) return;
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setReady(true));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [inView]);

  const animate = ready && inView;

  return (
    <div className="flex flex-col gap-2 p-5">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center gap-3">
          <span className="w-20 shrink-0 truncate font-mono text-xs text-muted lg:w-32">
            {row.label}
          </span>
          <div className="relative h-3 flex-1 rounded bg-surface">
            {row.segments.map((seg, i) => (
              <div
                key={i}
                className={cn('absolute top-0 h-full rounded', SEG_STYLE[seg.kind])}
                style={{
                  left: `${(seg.start / GLOBAL_MAX) * 100}%`,
                  width: `${(seg.duration / GLOBAL_MAX) * 100}%`,
                  transformOrigin: 'left',
                  transform: animate ? 'scaleX(1)' : 'scaleX(0)',
                  transitionProperty: animate ? 'transform' : 'none',
                  transitionTimingFunction: 'linear',
                  transitionDuration: animate ? `${seg.duration * UNIT_SEC}s` : '0s',
                  transitionDelay: animate ? `${seg.start * UNIT_SEC}s` : '0s',
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

interface Props {
  version: Version;
  loss?: boolean;
}

const Waterfall = ({ version, loss: initialLoss = false }: Props) => {
  const [loss, setLoss] = useState(initialLoss);
  const [tick, setTick] = useState(0);

  const { ref: sectionRef, inView } = useInView();

  const supportsLoss = version === 'http2' || version === 'http3';
  const rows = buildSchedule(version, supportsLoss && loss);
  const total = endOf(rows);

  const refetch = () => setTick((t) => t + 1);

  return (
    <section ref={sectionRef} className="my-8 overflow-hidden rounded border border-line">
      <div className="flex items-center justify-between gap-3 border-b border-line bg-surface px-5 py-3">
        <span className="font-mono text-sm font-medium text-main">{LABELS[version]}</span>
        <div className="flex items-center gap-4">
          {supportsLoss && (
            <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
              <input
                type="checkbox"
                checked={loss}
                onChange={(e) => setLoss(e.target.checked)}
                className="accent-main"
              />
              패킷 유실
            </label>
          )}
          <button
            type="button"
            onClick={refetch}
            className="rounded bg-main px-3 py-1 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            요청
          </button>
        </div>
      </div>

      <Bars key={`${version}-${loss}-${tick}`} rows={rows} inView={inView} />

      <div className="flex items-center justify-between gap-4 border-t border-line px-5 py-3 text-xs text-muted">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-xs bg-main/40" /> 연결 수립
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-xs bg-main" /> 전송
          </span>
          {supportsLoss && (
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-xs border border-dashed border-main/40 bg-main/10" />{' '}
              재전송 대기
            </span>
          )}
        </div>
        <span className="shrink-0 font-mono text-muted">총 {(total * UNIT_SEC).toFixed(1)}초</span>
      </div>
    </section>
  );
};

export default Waterfall;
