import type Confetti from 'canvas-confetti';

type ConfettiFunction = (options?: Confetti.Options) => Promise<undefined> | null;
type Origin = Record<'x' | 'y', number>;

const colors = ['#CF5417', '#E06A2B', '#F08C4B', '#F7B580', '#8F8C84'];
const count = 300;

let confettiPromise: Promise<ConfettiFunction> | null = null;

const loadConfetti = (): Promise<ConfettiFunction> =>
  (confettiPromise ??= import('canvas-confetti').then(
    (module) => (module as unknown as { default: ConfettiFunction }).default
  ));

export const warmup = () => void loadConfetti();

export const launch = async (origin: Origin) => {
  const confetti = await loadConfetti();

  const fire = (options: Confetti.Options, ratio: number) => {
    confetti({
      ...options,
      colors,
      origin,
      particleCount: Math.floor(count * ratio),
      disableForReducedMotion: true,
    });
  };

  fire({ spread: 26, startVelocity: 55 }, 0.25);
  fire({ spread: 60 }, 0.2);
  fire({ spread: 100, decay: 0.91, scalar: 0.8 }, 0.35);
  fire({ spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 }, 0.1);
  fire({ spread: 120, startVelocity: 45 }, 0.1);
};
