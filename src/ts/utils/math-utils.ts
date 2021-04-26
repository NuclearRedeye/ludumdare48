import { Point } from '../interfaces/point';

// Converts a value from Degrees to Radians.
export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// TODO: Convert Point to Vector
export function angleToVector(degrees: number): Point {
  const angle = degreesToRadians(degrees);
  return {
    x: Math.cos(angle),
    y: Math.sin(angle)
  };
}
