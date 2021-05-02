import { Activator } from '../interfaces/activator';
import { Cell } from '../interfaces/cell';

import { CellProperty, CellType, Face } from '../enums.js';
import { getTextureById } from './texture-utils.js';
import { Texture } from '../interfaces/texture.js';

// Generic function to create a Cell.
function createCell(type: CellType, textureIds: number[], properties: number = 0): Cell {
  return {
    type,
    textureIds,
    properties,
    activators: []
  };
}

// Checks if the specified cell has the specified property.
function cellHasProperty(cell: Cell, property: CellProperty): number {
  return cell.properties & property;
}

// Utility function to determine if the specified cell is solid.
export function isSolid(cell: Cell): number {
  return cellHasProperty(cell, CellProperty.SOLID);
}

// Utility function to get the texture ID for the specific face in the specified cell.
export function getTexture(cell: Cell, face: Face = Face.NORTH): Texture {
  return getTextureById(cell.textureIds[face]);
}

// Utility function to create a FLOOR Cell.
export function createFloor(textureId: number): Cell {
  const textureIds = new Array(6).fill(textureId);
  return createCell(CellType.FLOOR, textureIds);
}

// Utility function to create a WALL Cell.
export function createWall(textureIds: number[]): Cell {
  return createCell(CellType.WALL, textureIds, CellProperty.SOLID);
}

// Utility function to create a simple WALL Cell with all faces the same texture.
export function createSimpleWall(textureId: number): Cell {
  const textureIds = new Array(6).fill(textureId);
  return createWall(textureIds);
}

// Utility function to create an Invisible WALL Cell.
export function createInvisibleWall(textureId: number): Cell {
  const textureIds = new Array(6).fill(textureId);
  return createCell(CellType.FLOOR, textureIds, CellProperty.SOLID);
}

// Utility function to create an ENTRANCE Cell.
export function createEntrance(textureId: number): Cell {
  const textureIds = new Array(6).fill(textureId);
  return createCell(CellType.ENTRANCE, textureIds, CellProperty.SOLID);
}

// Utility function to create an EXIT Cell.
export function createExit(textureId: number): Cell {
  const textureIds = new Array(6).fill(textureId);
  return createCell(CellType.EXIT, textureIds);
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
