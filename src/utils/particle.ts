import confetti from 'canvas-confetti';

const count = 300;

const fire = (options: confetti.Options, ratio: number) => {
  confetti({ ...options, particleCount: Math.floor(count * ratio) });
};

export const launch = (colors: string[], origin: Record<'x' | 'y', number>) => {
  fire({ spread: 26, startVelocity: 55, colors, origin }, 0.25);
  fire({ spread: 60, colors, origin }, 0.2);
  fire({ spread: 100, decay: 0.91, scalar: 0.8, colors, origin }, 0.35);
  fire({ spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2, colors, origin }, 0.1);
  fire({ spread: 120, startVelocity: 45, colors, origin }, 0.1);
};

export const burst = () => {
  const end = Date.now() + 5 * 1000;
  const colors = ['#bb0000', '#facc15', '#fb923c'];

  (function frame() {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors: colors,
    });
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      colors: colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
};
