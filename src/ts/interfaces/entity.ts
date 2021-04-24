export interface Entity {
  x: number; // The X position of the Entity
  y: number; // The Y position of the Entity
  angle: number; // The direction, in degrees, that the Entity is looking.
  rotate(amount: number): void;
  move(amount: number): void;
}
