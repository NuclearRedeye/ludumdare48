import { Level } from '../interfaces/level';

import { createFloor as f, createExit as g, createInvisibleWall as i } from '../utils/cell-utils.js';

export const level00: Level = {
  depth: 0,
  name: 'Surface',
  entrance: {
    x: 5,
    y: 1,
    angle: 90
  },
  exit: {
    x: 5,
    y: 5,
    angle: 270
  },
  assets: [
    {
      url: 'assets/wall.mud.01.png',
      width: 16,
      height: 16
    },
    {
      url: 'assets/exit.mud.01.png',
      width: 16,
      height: 16
    },
    {
      url: 'assets/floor.grass.01.png',
      width: 16,
      height: 16
    },
    {
      url: 'assets/exit.grass.02.png',
      width: 16,
      height: 16
    },
    {
      url: 'assets/floor.water.01.png',
      width: 128,
      height: 16
    }
  ],
  floor: 5,
  data: [
    [i(5), i(3), i(3), i(3), i(3), i(3), i(3), i(3), i(3), i(5)],
    [i(3), i(3), f(3), f(3), f(3), f(3), f(3), f(3), i(3), i(3)],
    [i(3), f(3), f(3), f(3), f(3), f(3), f(3), f(3), f(3), i(3)],
    [i(3), f(3), f(3), f(3), f(3), f(3), f(3), f(3), f(3), i(3)],
    [i(3), f(3), f(3), f(3), f(3), f(3), f(3), f(3), f(3), i(3)],
    [i(3), f(3), f(3), f(3), f(3), g(4), f(3), f(3), f(3), i(3)],
    [i(3), f(3), f(3), f(3), f(3), f(3), f(3), f(3), f(3), i(3)],
    [i(3), f(3), f(3), f(3), f(3), f(3), f(3), f(3), f(3), i(3)],
    [i(3), i(3), f(3), f(3), f(3), f(3), f(3), f(3), i(3), i(3)],
    [i(5), i(3), i(3), i(3), i(3), i(3), i(3), i(3), i(3), i(5)]
  ],
  objects: [],
  sprites: [],
  enemies: [],
  textures: []
};
