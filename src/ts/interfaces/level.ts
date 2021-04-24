import { Point } from './point';
import { Entrance } from './entrance';
import { Asset } from './asset';
import { Texture } from './texture';

export interface Level {
  entrance: Entrance;
  exit: Point;
  assets: Asset[];
  data: number[][];
  textures: Texture[];
}
