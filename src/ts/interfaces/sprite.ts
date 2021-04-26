import { Entity } from './entity';

export interface Sprite extends Entity {
  scale: number;
  textureId: number;
  distance?: number;
}
