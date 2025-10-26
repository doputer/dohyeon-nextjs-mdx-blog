import confetti from 'canvas-confetti';

const colors = ['#B91C1C', '#E11D48', '#FF4D6D', '#FB7185', '#FF6B6B'];
const count = 300;

const fire = (options: confetti.Options, ratio: number) => {
  confetti({ ...options, colors, particleCount: Math.floor(count * ratio) });
};

export const launch = (origin: Record<'x' | 'y', number>) => {
  fire({ spread: 26, startVelocity: 55, origin }, 0.25);
  fire({ spread: 60, origin }, 0.2);
  fire({ spread: 100, decay: 0.91, scalar: 0.8, origin }, 0.35);
  fire({ spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2, origin }, 0.1);
  fire({ spread: 120, startVelocity: 45, origin }, 0.1);
};
