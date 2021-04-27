import { Activator } from '../interfaces/activator';
import { Cell } from '../interfaces/cell';

import { CellType } from '../enums.js';

// Generic function to create a Cell.
function createCell(type: CellType, textureId: number, solid: boolean): Cell {
  return {
    type,
    textureId,
    solid,
    activators: []
  };
}

// Utility function to create a FLOOR Cell.
export function createFloor(textureId: number = -1): Cell {
  return createCell(CellType.FLOOR, textureId, false);
}

// Utility function to create a WALL Cell.
export function createWall(textureId: number): Cell {
  return createCell(CellType.WALL, textureId, true);
}

// Utility function to create an Invisible WALL Cell.
export function createInvisibleWall(textureId: number): Cell {
  return createCell(CellType.FLOOR, textureId, true);
}

// Utility function to create an ENTRANCE Cell.
export function createEntrance(textureId: number): Cell {
  return createCell(CellType.ENTRANCE, textureId, true);
}

// Utility function to create an EXIT Cell.
export function createExit(textureId: number): Cell {
  return createCell(CellType.EXIT, textureId, false);
}

// Utility function to determine if the specified cell is solid.
export function isSolid(cell: Cell): boolean {
  return cell.solid;
}

// Utility function to determine if the specified cell is a Wall.
export function isWall(cell: Cell): boolean {
  return cell.type === CellType.WALL || cell.type === CellType.ENTRANCE;
}

// Utility function to determine if a CELL has an Activators
export function hasActivators(cell: Cell): boolean {
  return cell.activators.length > 0;
}

// Utility function to get the Activators for the specified CELL
export function getActivators(cell: Cell): Activator[] {
  return cell.activators;
}

// Utility function to add an Activator to the specified CELL
export function addActivator(cell: Cell, activator: Activator): void {
  cell.activators.push(activator);
}
