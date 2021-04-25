import { Portal } from './portal';
import { Asset } from './asset';
import { Texture } from './texture';
import { Cell } from './cell';

export interface Level {
  depth: number;
  name?: string;
  entrance: Portal;
  exit: Portal;
  assets: Asset[];
  data: Cell[][];
  textures: Texture[];
  skybox?: Asset;
}
