let start: number;
let current: number;
let previous: number;

export function Mark(timestamp: number): void {
  if (start === undefined) {
    start = timestamp;
  }
  previous = current;
  current = timestamp - start;
}

export function getElapsed(): number {
  return current;
}

export function getDelta(): number {
  return current - previous;
}

export function getCurrentFramesPerSecond(): number {
  return 1000 / (current - previous);
}

export function getAnimationFrame(): number {
  return Math.floor(((current / 1000) * 4) % 8);
}
