import { Entity } from '../interfaces/entity';
import { Level } from '../interfaces/level';

import { levels } from '../levels/index.js';
import { setCurrentLevel } from '../state.js';
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

  move(amount: number, level: Level): void {
    const playerCos = Math.cos(degreesToRadians(this.angle)) * amount;
    const playerSin = Math.sin(degreesToRadians(this.angle)) * amount;
    const newX = this.x + playerSin;
    const newY = this.y + playerCos;

    // Collision test
    if (level.data[Math.floor(newX)][Math.floor(newY)] == 0) {
      this.x = newX;
      this.y = newY;
    }
  }

  interact(level: Level): void {
    // const targetCell = level.data[Math.floor(this.x)][Math.floor(this.y)];

    // The ray starts from the entities current cell.
    let mapX: number = Math.floor(this.x);
    let mapY: number = Math.floor(this.y);

    // The X and Y direction of the Ray
    const rayDirX = Math.sin(degreesToRadians(this.angle));
    const rayDirY = Math.cos(degreesToRadians(this.angle));

    // The distance from the ray's starting position to the first wall on both the x and y directions.
    let sideDistX: number;
    let sideDistY: number;

    // The distance from the first wall, to the next wall in both the x and y directions
    const deltaDistX = Math.abs(1 / rayDirX);
    const deltaDistY = Math.abs(1 / rayDirY);

    // What direction to increment next
    let stepX: number;
    let stepY: number;

    // Calculate the initial step for the X axis
    if (rayDirX < 0) {
      stepX = -1;
      sideDistX = (this.x - mapX) * deltaDistX;
    } else {
      stepX = 1;
      sideDistX = (mapX + 1.0 - this.x) * deltaDistX;
    }

    // Calculate the initial step for the Y axis
    if (rayDirY < 0) {
      stepY = -1;
      sideDistY = (this.y - mapY) * deltaDistY;
    } else {
      stepY = 1;
      sideDistY = (mapY + 1.0 - this.y) * deltaDistY;
    }

    if (sideDistX < sideDistY) {
      sideDistX += deltaDistX;
      mapX += stepX;
    } else {
      sideDistY += deltaDistY;
      mapY += stepY;
    }

    // Check if the cell is a wall or not.
    //const target = level.data[mapX][mapY];

    // Target is an entrance...
    if (mapX === level.entrance.x && mapY === level.entrance.y) {
      // FIXME: This is a temporary hack as this needs to be called outside of the animation loop.
      setTimeout(() => {
        const newLevel = level.entrance.destination ? levels[level.entrance.destination] : levels[level.depth - 1];
        setCurrentLevel(newLevel, newLevel.exit);
      }, 0);
    }

    // Target is an exit...
    if (mapX === level.exit.x && mapY === level.exit.y) {
      // FIXME: This is a temporary hack as this needs to be called outside of the animation loop.
      setTimeout(() => {
        const newLevel = level.exit.destination ? levels[level.exit.destination] : levels[level.depth + 1];
        setCurrentLevel(newLevel, newLevel.entrance);
      }, 0);
    }

    //console.log(`Player: X = ${this.x}, Y = ${this.y}, angle = ${this.angle}`);
    //console.log(`Target: X = ${mapX}, Y = ${mapY}, type = ${target}`);
  }
}
