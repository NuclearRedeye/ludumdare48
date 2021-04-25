import { Entity } from '../interfaces/entity';
import { Level } from '../interfaces/level';

import { CellType } from '../enums.js';
import { levels } from '../levels/index.js';
import { castRay } from '../raycaster.js';
import { setCurrentLevel } from '../state.js';
import { isSolid } from '../utils/cell-utils.js';
import { getCell } from '../utils/level-utils.js';
import { degreesToRadians } from '../utils/math-utils.js';

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

  move(amount: number, level: Level): void {
    const playerCos = Math.cos(degreesToRadians(this.angle)) * amount;
    const playerSin = Math.sin(degreesToRadians(this.angle)) * amount;
    const newX = this.x + playerSin;
    const newY = this.y + playerCos;

    // Collision test
    const cell = getCell(level, Math.floor(newX), Math.floor(newY));
    if (isSolid(cell) === false) {
      this.x = newX;
      this.y = newY;
    }
  }

  interact(level: Level): void {
    const result = castRay({ x: this.x, y: this.y }, this.angle, level);
    if (result != undefined) {
      // Target is an entraance...
      if (result.cell.type === CellType.ENTRANCE && result.distance < 1) {
        // FIXME: This is a temporary hack as this needs to be called outside of the animation loop.
        setTimeout(() => {
          const newLevel = level.entrance.destination ? levels[level.entrance.destination] : levels[level.depth - 1];
          setCurrentLevel(newLevel, newLevel.exit);
        }, 0);
      }

      // Target is an exit...
      if (result.cell.type === CellType.EXIT && result.distance < 1) {
        // FIXME: This is a temporary hack as this needs to be called outside of the animation loop.
        setTimeout(() => {
          const newLevel = level.exit.destination ? levels[level.exit.destination] : levels[level.depth + 1];
          setCurrentLevel(newLevel, newLevel.entrance);
        }, 0);
      }
    }
  }
}
