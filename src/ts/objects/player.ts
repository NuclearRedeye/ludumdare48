import { Entity } from '../interfaces/entity';
import { Level } from '../interfaces/level';

import { CellType } from '../enums.js';
import { levels } from '../levels/index.js';
import { castRay } from '../raycaster.js';
import { setCurrentLevel } from '../state.js';
import { isSolid } from '../utils/cell-utils.js';
import { getCell } from '../utils/level-utils.js';
import { canvasWidth } from '../config.js';

export class Player implements Entity {
  x: number;
  y: number;
  dx: number;
  dy: number;
  cx: number;
  cy: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.dx = 1.0;
    this.dy = 0.0;
    this.cx = 0.0;
    this.cy = 0.66;
  }

  rotate(amount: number): void {
    // Rotate Player
    const dx = this.dx;
    this.dx = this.dx * Math.cos(amount) - this.dy * Math.sin(amount);
    this.dy = dx * Math.sin(amount) + this.dy * Math.cos(amount);

    // Rotate Camera
    const cx = this.cx;
    this.cx = this.cx * Math.cos(amount) - this.cy * Math.sin(amount);
    this.cy = cx * Math.sin(amount) + this.cy * Math.cos(amount);
  }

  move(amount: number, level: Level): void {
    const newX = this.x + this.dx * amount;
    const newY = this.y + this.dy * amount;

    // Check for a collision on the X Axis
    const xCell = getCell(level, Math.floor(newX), Math.floor(this.y));
    if (isSolid(xCell) === false) {
      this.x = newX;
    }
    // Check for a collision on the Y Axis
    const yCell = getCell(level, Math.floor(this.x), Math.floor(newY));
    if (isSolid(yCell) === false) {
      this.y = newY;
    }
  }

  interact(level: Level): void {
    const result = castRay(canvasWidth / 2, this, level);
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
