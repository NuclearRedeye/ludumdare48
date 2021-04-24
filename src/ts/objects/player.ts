import { Entity } from '../interfaces/entity';
import { degreesToRadians } from '../utils/math.js';

export class Player implements Entity {
  x: number;
  y: number;
  angle: number;

  constructor(x: number, y: number, angle: number) {
    this.x = x;
    this.y = y;
    this.angle = angle;
  }

  rotate(amount: number): void {
    this.angle += amount;
    this.angle %= 360;
  }

  move(amount: number): void {
    const playerCos = Math.cos(degreesToRadians(this.angle)) * amount;
    const playerSin = Math.sin(degreesToRadians(this.angle)) * amount;
    const newX = this.x + playerSin;
    const newY = this.y + playerCos;
    this.x = newX;
    this.y = newY;

    // TODO: Need to add collision detection
  }
}
