export type Strategy = 'fixed' | 'exponential' | 'jitter';

export type Phase = 'waiting' | 'request' | 'response' | 'done';

export interface Client {
  phase: Phase;
  timer: number;
  duration: number;
  accepted: boolean;
  retries: number;
}

export interface World {
  clients: Client[];
  tick: number;
  attempts: number;
  rejects: number;
  arrivals: number[];
  finishedAt: number | null;
}

export const CLIENT_COUNT = 10;
export const CAPACITY = 3;
export const TICKS_PER_SECOND = 60;

const WINDOW = 24;
const TRAVEL = 30;
const BASE = 72;
const MAX_DELAY = 480;

const backoff = (strategy: Strategy, retries: number): number => {
  if (strategy === 'fixed') return BASE;

  const window = Math.min(MAX_DELAY, BASE * 2 ** (retries - 1));
  return strategy === 'jitter' ? Math.round(Math.random() * window) : window;
};

export const createWorld = (): World => ({
  clients: Array.from({ length: CLIENT_COUNT }, () => ({
    phase: 'waiting' as const,
    timer: 1,
    duration: 1,
    accepted: false,
    retries: 0,
  })),
  tick: 0,
  attempts: 0,
  rejects: 0,
  arrivals: [],
  finishedAt: null,
});

export const progressOf = (client: Client): number =>
  client.duration <= 0 ? 1 : 1 - Math.max(0, client.timer) / client.duration;

export const loadOf = (world: World): number => world.arrivals.length;

export const doneOf = (world: World): number =>
  world.clients.filter((client) => client.phase === 'done').length;

export const step = (world: World, strategy: Strategy): World => {
  const tick = world.tick + 1;
  const arrivals = world.arrivals.filter((at) => tick - at < WINDOW);

  let attempts = world.attempts;
  let rejects = world.rejects;

  const clients = world.clients.map((client) => {
    if (client.phase === 'done') return client;

    const timer = client.timer - 1;
    if (timer > 0) return { ...client, timer };

    if (client.phase === 'waiting') {
      attempts += 1;
      return { ...client, phase: 'request' as const, timer: TRAVEL, duration: TRAVEL };
    }

    if (client.phase === 'request') {
      const accepted = arrivals.length < CAPACITY;
      arrivals.push(tick);
      if (!accepted) rejects += 1;
      return { ...client, phase: 'response' as const, timer: TRAVEL, duration: TRAVEL, accepted };
    }

    if (client.accepted) return { ...client, phase: 'done' as const, timer: 0, duration: 0 };

    const retries = client.retries + 1;
    const delay = backoff(strategy, retries);
    return { ...client, phase: 'waiting' as const, timer: delay, duration: delay, retries };
  });

  const finished = clients.every((client) => client.phase === 'done');

  return {
    clients,
    tick,
    attempts,
    rejects,
    arrivals,
    finishedAt: world.finishedAt ?? (finished ? tick : null),
  };
};
