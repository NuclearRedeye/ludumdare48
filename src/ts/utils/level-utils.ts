import { Cell } from '../interfaces/cell';
import { Level } from '../interfaces/level';
import { Texture } from '../interfaces/texture';

export function getCell(level: Level, x: number, y: number): Cell {
  return level.data[x][y];
}

export function getTextureForCell(level: Level, cell: Cell): Texture {
  // FIXME: Textures should be Indexed properly!
  return level.textures[cell.textureId - 1];
}
