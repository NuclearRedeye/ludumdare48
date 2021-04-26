import { Level } from '../interfaces/level';

import { createFloor as f, createWall as w, createExit as g } from '../utils/cell-utils.js';

export const level00: Level = {
  depth: 0,
  name: 'Surface',
  entrance: {
    x: 1,
    y: 1,
    angle: 90
  },
  exit: {
    x: 8,
    y: 8,
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
    }
  ],
  floor: 3,
  data: [
    [w(1), w(1), w(1), w(1), w(1), w(1), w(1), w(1), w(1), w(1)],
    [w(1), f(3), f(3), f(3), f(3), f(3), f(3), f(3), f(3), w(1)],
    [w(1), f(3), f(3), f(3), f(3), f(3), f(3), f(3), f(3), w(1)],
    [w(1), f(3), f(3), f(3), f(3), f(3), f(3), f(3), f(3), w(1)],
    [w(1), f(3), f(3), f(3), f(3), f(3), f(3), f(3), f(3), w(1)],
    [w(1), f(3), f(3), f(3), f(3), f(3), f(3), f(3), f(3), w(1)],
    [w(1), f(3), f(3), f(3), f(3), f(3), f(3), f(3), f(3), w(1)],
    [w(1), f(3), f(3), f(3), f(3), f(3), f(3), f(3), f(3), w(1)],
    [w(1), f(3), f(3), f(3), f(3), f(3), f(3), f(3), f(4), w(1)],
    [w(1), w(1), w(1), w(1), w(1), w(1), w(1), w(1), g(2), w(1)]
  ],
  objects: [],
  enemies: [],
  textures: []
};
