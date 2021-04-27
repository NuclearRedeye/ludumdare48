import { Texture } from '../../interfaces/texture';

import { createTextureAnimated, createTextureBasic } from '../../utils/texture-utils.js';

// Stores all the Textures that are used in the game.
export const textures: Texture[] = [
  createTextureBasic(1, 'assets/debug.wall.01.png', 16, 16),
  createTextureBasic(2, 'assets/debug.floor.01.png', 16, 16),
  createTextureBasic(3, 'assets/debug.ceiling.01.png', 16, 16),
  createTextureBasic(4, 'assets/debug.toggle.01.png', 16, 16, 2),
  createTextureAnimated(5, 'assets/debug.animated.01.png', 16, 16, 8)
];
