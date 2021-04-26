import { Sprite } from '../interfaces/sprite';

export class Object implements Sprite {
  x: number;
  y: number;
  dx: number;
  dy: number;
  cx: number;
  cy: number;
  textureId: number;
  scale: number;

  constructor(x: number, y: number, textureId: number, scale: number = 1.0) {
    this.x = x;
    this.y = y;
    this.dx = 1.0;
    this.dy = 0.0;
    this.cx = 0.0;
    this.cy = 0.66;
    this.textureId = textureId;
    this.scale = scale;
  }

  // eslint-disable-next-line
  update(elapsed: number): void {
  }
}
