import { Level } from '../interfaces/level';
import { createFloor as f, createWall as w, createEntrance as e } from '../utils/cell-utils.js';

export const level02: Level = {
  depth: 2,
  entrance: {
    x: 4,
    y: 5,
    angle: 270
  },
  exit: {
    x: 0,
    y: 2,
    angle: 90
  },
  assets: [
    {
      url: 'assets/wall.brick.02.png',
      width: 16,
      height: 16
    },
    {
      url: 'assets/portal.debug.01.png',
      width: 16,
      height: 16
    }
  ],
  data: [
    [w(1), w(1), w(1), w(1), w(1), w(1), w(1), w(1), w(1), w(1)],
    [w(1), f(0), f(0), f(0), w(1), f(0), f(0), f(0), f(0), w(1)],
    [w(1), f(0), f(0), f(0), w(1), f(0), w(1), w(1), f(0), w(1)],
    [w(1), f(0), f(0), f(0), w(1), f(0), w(1), w(1), f(0), w(1)],
    [w(1), w(1), f(0), w(1), w(1), f(0), w(1), w(1), f(0), w(1)],
    [w(1), f(0), f(0), f(0), w(1), e(2), w(1), w(1), f(0), w(1)],
    [w(1), f(0), f(0), f(0), w(1), w(1), w(1), w(1), f(0), w(1)],
    [w(1), f(0), f(0), f(0), f(0), f(0), f(0), f(0), f(0), w(1)],
    [w(1), f(0), f(0), f(0), w(1), f(0), f(0), f(0), f(0), w(1)],
    [w(1), w(1), w(1), w(1), w(1), w(1), w(1), w(1), w(1), w(1)]
  ],
  textures: []
};
