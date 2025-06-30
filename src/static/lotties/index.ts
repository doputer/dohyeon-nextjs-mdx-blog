import u23f0 from './alarm-clock.json';
import u1f697 from './automobile.json';
import u2696 from './balance-scale.json';
import u1f37e from './bottle-with-popping-cork.json';
import u26d3 from './broken-chain.json';
import u1fae7 from './bubbles.json';
import u1f3c1 from './chequered-flag.json';
import u1f6a7 from './construction.json';
import u274c from './cross-mark.json';
import u1f3af from './direct-hit.json';
import u1f4a7 from './droplet.json';
import u26a1 from './electricity.json';
import u1f441 from './eye.json';
import u1f440 from './eyes.json';
import u1f525 from './fire.json';
import u26f3 from './flag-in-hole.json';
import u2699 from './gear.json';
import u1f608 from './imp-smile.json';
import u1f6ae from './litter.json';
import u1f512 from './locked.json';
import u1faa4 from './mouse-trap.json';
import u1f195 from './new.json';
import u1f389 from './party-popper.json';
import u270f from './pencil.json';
import u1f331 from './plant.json';
import u2795 from './plus-sign.json';
import u1faf5 from './pointing.json';
import u1f916 from './robot.json';
import u1f680 from './rocket.json';
import u1f40d from './snake.json';
import u1fadf from './splatter.json';
import u1f914 from './thinking-face.json';
import u1f32a from './tornado.json';
import u1fa84 from './wand.json';
import u1f381 from './wrapped-gift.json';

export const lotties = {
  u23f0,
  u1f697,
  u2696,
  u1f37e,
  u26d3,
  u1fae7,
  u1f3c1,
  u1f6a7,
  u274c,
  u1f3af,
  u1f4a7,
  u26a1,
  u1f441,
  u1f440,
  u1f525,
  u26f3,
  u2699,
  u1f608,
  u1f6ae,
  u1f512,
  u1faa4,
  u1f195,
  u1f389,
  u270f,
  u1f331,
  u2795,
  u1faf5,
  u1f916,
  u1f680,
  u1f40d,
  u1fadf,
  u1f914,
  u1f32a,
  u1fa84,
  u1f381,
} as const;

export type Lottie = keyof typeof lotties;
