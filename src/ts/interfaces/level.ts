import { Portal } from './portal';
import { Asset } from './asset';
import { Texture } from './texture';
import { Cell } from './cell';
import { Enemy } from '../objects/enemy';
import { Sprite } from './sprite';

export interface Level {
  depth: number;
  name?: string;
  entrance: Portal;
  exit: Portal;
  assets: Asset[];
  data: Cell[][];
  textures: Texture[];
  objects: Sprite[];
  enemies: Enemy[];
  floor?: number;
  loot?: number;
  ceiling?: number;
  skybox?: number;
}
