import { Activator } from './activator';
import { CellProperty, CellType } from '../enums';

export interface Cell {
  type: CellType;
  textureIds: number[];
  activators: Activator[];
  properties: CellProperty; // Flags to store any special properties of the cell.
}
