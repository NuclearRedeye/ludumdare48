import { Point } from './point';
import { Asset } from './asset';
import { Texture } from './texture';

export interface Level {
  entrance: Point;
  exit: Point;
  assets: Asset[];
  data: number[][];
  textures: Texture[];
}
