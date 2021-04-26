import { Cell } from '../interfaces/cell';
import { Level } from '../interfaces/level';
import { Texture } from '../interfaces/texture';
import { Object } from '../objects/object.js';

function getRandomInt(minimum: number, maximum: number): number {
  return Math.floor(Math.random() * (maximum - minimum + 1) + minimum);
}

export function getCell(level: Level, x: number, y: number): Cell | undefined {
  if (x < 0 || y < 0 || x >= 10 || y >= 10) {
    return undefined;
  }
  return level.data[y][x];
}

export function getTextureForCell(level: Level, cell: Cell): Texture {
  // FIXME: Textures should be Indexed properly!
  return level.textures[cell.textureId - 1];
}

export function getTextureById(level: Level, id: number): Texture {
  return level.textures[id - 1];
}

export function getLevelName(level: Level): string {
  return level.name ? level.name : `Level ${level.depth}`;
}

export function fillLevelWithLoot(level: Level): void {
  if (level.loot !== undefined) {
    let ammount = getRandomInt(1, Math.floor(level.data.length + level.data[0].length * 0.3));
    while (ammount > 0) {
      const x = getRandomInt(1, level.data[0].length - 2);
      const y = getRandomInt(1, level.data.length - 2);

      const cell = getCell(level, x, y);
      if (cell !== undefined && cell.solid === false) {
        level.objects.push(new Object(x + 0.5, y + 0.5, level.loot, 0.2));
        ammount -= 1;
      }
    }
  }
}
