import { Level } from '../interfaces/level';
import { createFloor as f, createWall as w, createEntrance as e, createExit as g } from '../utils/cell-utils.js';

export const level01: Level = {
  depth: 1,
  entrance: {
    x: 2,
    y: 1,
    angle: 90
  },
  exit: {
    x: 8,
    y: 7,
    angle: 180
  },
  assets: [
    {
      url: 'assets/wall.cave.01.png',
      width: 64,
      height: 64
    },
    {
      url: 'assets/wall.cave.02.png',
      width: 64,
      height: 64
    },
    {
      url: 'assets/portal.debug.01.png',
      width: 16,
      height: 16
    },
    {
      url: 'assets/portal.debug.02.png',
      width: 16,
      height: 16
    },
    {
      url: 'assets/floor.grass.01.png',
      width: 16,
      height: 16
    }
  ],
  floor: 5,
  data: [
    [w(1), w(1), e(3), w(1), w(1), w(1), w(1), w(1), w(1), w(1)],
    [w(1), f(0), f(0), f(0), f(0), f(0), f(0), f(0), f(0), w(1)],
    [w(1), f(0), f(0), f(0), f(0), f(0), f(0), w(2), f(0), w(1)],
    [w(1), f(0), f(0), f(0), f(0), f(0), f(0), f(0), f(0), w(1)],
    [w(1), f(0), f(0), f(0), f(0), f(0), f(0), w(2), f(0), w(1)],
    [w(1), f(0), f(0), f(0), f(0), f(0), f(0), f(0), f(0), w(1)],
    [w(1), f(0), f(0), f(0), f(0), f(0), f(0), w(2), f(0), w(1)],
    [w(1), f(0), f(0), f(0), f(0), f(0), f(0), w(2), f(0), g(4)],
    [w(1), f(0), f(0), f(0), f(0), f(0), f(0), f(0), f(0), w(1)],
    [w(1), w(1), w(1), w(1), w(1), w(1), w(1), w(1), w(1), w(1)]
  ],
  objects: [],
  enemies: [],
  textures: []
};
