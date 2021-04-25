import { Cell } from '../interfaces/cell';
import { Level } from '../interfaces/level';

export function getCell(level: Level, x: number, y: number): Cell {
  return level.data[x][y];
}
