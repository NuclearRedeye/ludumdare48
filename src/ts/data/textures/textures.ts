import { Texture } from '../../interfaces/texture';

import { createTextureAnimated, createTextureBasic } from '../../utils/texture-utils.js';

// Stores all the Textures that are used in the game.
export const textures: Texture[] = [
  createTextureBasic(1, 'assets/wall.mud.01.png', 16, 16),
  createTextureBasic(2, 'assets/exit.mud.01.png', 16, 16),
  createTextureBasic(3, 'assets/floor.grass.01.png', 16, 16),
  createTextureBasic(4, 'assets/exit.grass.02.png', 16, 16),
  createTextureBasic(5, 'assets/exit.mud.01.png', 16, 16),
  createTextureAnimated(6, 'assets/floor.water.01.png', 16, 16, 8)
];
