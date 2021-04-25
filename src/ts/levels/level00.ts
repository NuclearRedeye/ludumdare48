import { Level } from '../interfaces/level';
import { createFloor as f, createWall as w, createExit as g } from '../utils/cell-utils.js';

export const level00: Level = {
  depth: 0,
  name: 'Surface',
  entrance: {
    x: 1,
    y: 2,
    angle: 90
  },
  exit: {
    x: 8,
    y: 8,
    angle: 270
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
      url: 'assets/portal.debug.02.png',
      width: 16,
      height: 16
    }
  ],
  skybox: {
    url: 'assets/skybox.debug.01.png',
    width: 360,
    height: 60
  },
  data: [
    [w(1), w(1), w(1), w(1), w(1), w(1), w(1), w(1), w(1), w(1)],
    [w(1), f(0), f(0), f(0), f(0), f(0), f(0), f(0), f(0), w(1)],
    [w(1), f(0), f(0), f(0), f(0), f(0), f(0), f(0), f(0), w(1)],
    [w(1), f(0), f(0), f(0), f(0), f(0), f(0), f(0), f(0), w(1)],
    [w(1), f(0), f(0), f(0), f(0), f(0), f(0), f(0), f(0), w(1)],
    [w(1), f(0), f(0), f(0), f(0), f(0), f(0), f(0), f(0), w(1)],
    [w(1), f(0), f(0), f(0), f(0), f(0), f(0), f(0), f(0), w(1)],
    [w(1), f(0), f(0), f(0), f(0), f(0), f(0), f(0), f(0), w(1)],
    [w(1), f(0), f(0), f(0), f(0), f(0), f(0), f(0), f(0), w(1)],
    [w(1), w(1), w(1), w(1), w(1), w(1), w(1), w(1), g(3), w(1)]
  ],
  textures: []
};
