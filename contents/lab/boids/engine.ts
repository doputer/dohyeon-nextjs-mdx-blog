export interface Boid {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export interface Weights {
  separation: number;
  alignment: number;
  cohesion: number;
}

export const DEFAULT_WEIGHTS: Weights = { separation: 1, alignment: 1, cohesion: 1 };

const VISUAL_RANGE = 60;
const PROTECTED_RANGE = 16;
const CENTERING_FACTOR = 0.0006;
const AVOID_FACTOR = 0.03;
const MATCHING_FACTOR = 0.03;
const MIN_SPEED = 2;
const MAX_SPEED = 4;
const MARGIN = 60;
const TURN_FACTOR = 0.4;

export const createFlock = (count: number, width: number, height: number): Boid[] =>
  Array.from({ length: count }, (_, id) => {
    const angle = Math.random() * Math.PI * 2;
    return {
      id,
      x: Math.random() * width,
      y: Math.random() * height,
      vx: Math.cos(angle) * MIN_SPEED,
      vy: Math.sin(angle) * MIN_SPEED,
    };
  });

export const step = (boids: Boid[], width: number, height: number, weights: Weights): Boid[] =>
  boids.map((boid) => {
    let closeDx = 0;
    let closeDy = 0;
    let avgVx = 0;
    let avgVy = 0;
    let avgX = 0;
    let avgY = 0;
    let neighbors = 0;

    for (const other of boids) {
      if (other === boid) continue;

      const dx = boid.x - other.x;
      const dy = boid.y - other.y;
      const dist = Math.hypot(dx, dy);

      if (dist < PROTECTED_RANGE) {
        closeDx += dx;
        closeDy += dy;
      } else if (dist < VISUAL_RANGE) {
        avgVx += other.vx;
        avgVy += other.vy;
        avgX += other.x;
        avgY += other.y;
        neighbors += 1;
      }
    }

    let vx = boid.vx + closeDx * AVOID_FACTOR * weights.separation;
    let vy = boid.vy + closeDy * AVOID_FACTOR * weights.separation;

    if (neighbors > 0) {
      vx += (avgVx / neighbors - boid.vx) * MATCHING_FACTOR * weights.alignment;
      vy += (avgVy / neighbors - boid.vy) * MATCHING_FACTOR * weights.alignment;
      vx += (avgX / neighbors - boid.x) * CENTERING_FACTOR * weights.cohesion;
      vy += (avgY / neighbors - boid.y) * CENTERING_FACTOR * weights.cohesion;
    }

    if (boid.x < MARGIN) vx += TURN_FACTOR;
    if (boid.x > width - MARGIN) vx -= TURN_FACTOR;
    if (boid.y < MARGIN) vy += TURN_FACTOR;
    if (boid.y > height - MARGIN) vy -= TURN_FACTOR;

    const speed = Math.hypot(vx, vy);
    if (speed > MAX_SPEED) {
      vx = (vx / speed) * MAX_SPEED;
      vy = (vy / speed) * MAX_SPEED;
    } else if (speed > 0 && speed < MIN_SPEED) {
      vx = (vx / speed) * MIN_SPEED;
      vy = (vy / speed) * MIN_SPEED;
    }

    return { id: boid.id, x: boid.x + vx, y: boid.y + vy, vx, vy };
  });
