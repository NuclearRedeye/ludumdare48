import { Level } from './level';

export interface Entity {
  x: number; // The X position of the Entity
  y: number; // The Y position of the Entity
  dx: number;
  dy: number;
  cx: number;
  cy: number;
  rotate(amount: number): void;
  move(amount: number, level: Level): void;
}
