import { Level } from '../interfaces/level';
import { createFloor as f, createWall as w } from '../utils/cell-utils.js';

export const level02: Level = {
  depth: 2,
  entrance: {
    x: 5,
    y: 6,
    angle: 180
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
    }
  ],
  data: [
    [w(1), w(1), w(1), w(1), w(1), w(1), w(1), w(1), w(1), w(1)],
    [w(1), f(0), f(0), f(0), w(1), f(0), f(0), f(0), f(0), w(1)],
    [w(1), f(0), f(0), f(0), w(1), f(0), w(1), w(1), f(0), w(1)],
    [w(1), f(0), f(0), f(0), w(1), f(0), w(1), w(1), f(0), w(1)],
    [w(1), w(1), f(0), w(1), w(1), f(0), w(1), w(1), f(0), w(1)],
    [w(1), f(0), f(0), f(0), w(1), f(0), f(0), w(1), f(0), w(1)],
    [w(1), f(0), f(0), f(0), w(1), w(1), w(1), w(1), f(0), w(1)],
    [w(1), f(0), f(0), f(0), f(0), f(0), f(0), f(0), f(0), w(1)],
    [w(1), f(0), f(0), f(0), w(1), f(0), f(0), f(0), f(0), w(1)],
    [w(1), w(1), w(1), w(1), w(1), w(1), w(1), w(1), w(1), w(1)]
  ],
  textures: []
};
