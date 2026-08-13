'use client';

import { useCallback, useEffect, useRef } from 'react';

import useLike from '@/hooks/use-like';
import { launch, warmup } from '@/utils/particle';

interface Props {
  slug: string;
}

const MAX_TILT = 15;
const SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const lean = (offset: number, half: number) => {
  const ratio = clamp(offset / half, -1, 1);
  return Math.sign(ratio) * Math.sqrt(Math.abs(ratio)) * MAX_TILT;
};

const Reaction = ({ slug }: Props) => {
  const { like, liked, addLike } = useLike(slug);

  const btnRef = useRef<HTMLButtonElement>(null);
  const tilt = useRef({ rx: 0, ry: 0, hover: 1, press: 1 });
  const rect = useRef<DOMRect | null>(null);
  const frame = useRef(0);

  const apply = useCallback(() => {
    frame.current = 0;

    const el = btnRef.current;
    if (!el) return;

    const { rx, ry, hover, press } = tilt.current;
    const lift = hover > 1 ? 14 : 0;

    el.style.transform = `perspective(450px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(${lift}px) scale(${hover * press})`;
  }, []);

  const schedule = useCallback(() => {
    if (frame.current) return;
    frame.current = requestAnimationFrame(apply);
  }, [apply]);

  const setTransition = useCallback((transform: string) => {
    const el = btnRef.current;
    if (el)
      el.style.transition = `${transform}, background-color 200ms ease, border-color 200ms ease, box-shadow 200ms ease`;
  }, []);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const setPress = useCallback(
    (down: boolean) => {
      if (prefersReduced()) return;

      tilt.current.press = down ? 0.85 : 1;
      setTransition(down ? 'transform 90ms ease-out' : `transform 420ms ${SPRING}`);
      schedule();
    },
    [schedule, setTransition]
  );

  const handleKey = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, down: boolean) => {
      if (e.repeat || (e.key !== ' ' && e.key !== 'Enter')) return;
      setPress(down);
    },
    [setPress]
  );

  const handleEnter = useCallback(() => {
    if (prefersReduced()) return;

    warmup();

    rect.current = null;
    setTransition('transform 100ms ease-out');
  }, [setTransition]);

  const handleMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType !== 'mouse' || prefersReduced()) return;

      const box = (rect.current ??= e.currentTarget.getBoundingClientRect());

      tilt.current.rx = -lean(e.clientY - (box.top + box.height / 2), box.height / 2);
      tilt.current.ry = lean(e.clientX - (box.left + box.width / 2), box.width / 2);
      tilt.current.hover = 1.05;

      schedule();
    },
    [schedule]
  );

  const handleLeave = useCallback(() => {
    rect.current = null;

    tilt.current.rx = 0;
    tilt.current.ry = 0;
    tilt.current.hover = 1;
    tilt.current.press = 1;

    setTransition(`transform 400ms ${SPRING}`);
    schedule();
  }, [schedule, setTransition]);

  const playParticles = useCallback((button: HTMLButtonElement) => {
    const box = button.getBoundingClientRect();
    const x = (box.left + box.width / 2) / window.innerWidth;
    const y = (box.top + box.height / 2) / window.innerHeight;

    void launch({ x, y });
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    addLike();

    if (prefersReduced()) return;

    playParticles(e.currentTarget);
  };

  return (
    <section className="flex flex-col items-center gap-8">
      <div aria-hidden className="flex gap-3 text-muted select-none">
        <span>·</span>
        <span>·</span>
        <span>·</span>
      </div>
      <div
        className="group -my-10 w-full py-10"
        onPointerEnter={handleEnter}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
      >
        <button
          ref={btnRef}
          type="button"
          aria-label={`좋아요 ${like ?? 0}개`}
          aria-pressed={liked}
          onClick={handleClick}
          onPointerDown={() => setPress(true)}
          onPointerUp={() => setPress(false)}
          onPointerCancel={() => setPress(false)}
          onKeyDown={(e) => handleKey(e, true)}
          onKeyUp={(e) => handleKey(e, false)}
          className="mx-auto flex items-center gap-2 rounded-full border border-line bg-background px-5 py-2.5 text-main shadow-sm transition-[transform,background-color,border-color,box-shadow] duration-200 ease-out will-change-transform select-none group-hover:border-main/40 group-hover:bg-surface group-hover:shadow-lg group-hover:shadow-main/10 motion-reduce:transition-none"
        >
          <span className="text-base leading-none" aria-hidden>
            ♥
          </span>
          <span className="text-sm font-medium tabular-nums">{like ?? 0}</span>
        </button>
      </div>
    </section>
  );
};

export default Reaction;
