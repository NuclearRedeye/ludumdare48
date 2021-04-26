import { Cell } from '../interfaces/cell';
import { Level } from '../interfaces/level';
import { Texture } from '../interfaces/texture';

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
