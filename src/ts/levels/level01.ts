import { Level } from '../interfaces/level';
import { createFloor as f, createWall as w, createEntrance as e, createExit as g } from '../utils/cell-utils.js';

export const level01: Level = {
  depth: 1,
  entrance: {
    x: 1,
    y: 2,
    angle: 90
  },
  exit: {
    x: 7,
    y: 8,
    angle: 180
  },
  assets: [
    {
      url: 'assets/wall.brick.01.png',
      width: 16,
      height: 16
    },
    {
      url: 'assets/wall.brick.02.png',
      width: 16,
      height: 16
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
    }
  ],
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
  textures: []
};
