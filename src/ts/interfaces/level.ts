import { Portal } from './portal';
import { Asset } from './asset';
import { Texture } from './texture';

export interface Level {
  depth: number;
  name?: string;
  entrance: Portal;
  exit: Portal;
  assets: Asset[];
  data: number[][];
  textures: Texture[];
}
