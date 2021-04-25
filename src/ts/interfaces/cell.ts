import { CellType } from '../enums';
import { Activator } from './activator';

export interface Cell {
  type: CellType;
  textureId: number;
  solid: boolean;
  activators: Activator[];
}
