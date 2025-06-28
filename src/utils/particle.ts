import confetti from 'canvas-confetti';

const count = 300;

const fire = (options: confetti.Options, ratio: number) => {
  confetti({
    ...options,
    particleCount: Math.floor(count * ratio),
  });
};

const particle = (colors: string[], origin: Record<'x' | 'y', number>) => {
  fire({ spread: 26, startVelocity: 55, colors, origin }, 0.25);
  fire({ spread: 60, colors, origin }, 0.2);
  fire({ spread: 100, decay: 0.91, scalar: 0.8, colors, origin }, 0.35);
  fire({ spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2, colors, origin }, 0.1);
  fire({ spread: 120, startVelocity: 45, colors, origin }, 0.1);
};

export default particle;
