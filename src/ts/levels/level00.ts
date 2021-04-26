import { Level } from '../interfaces/level';

import { createFloor as f, createWall as w, createExit as g } from '../utils/cell-utils.js';
import { Object } from '../objects/object.js';

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
    },
    {
      url: 'assets/floor.grass.01.png',
      width: 16,
      height: 16
    },
    {
      url: 'assets/skybox.debug.01.png',
      width: 360,
      height: 60
    },
    {
      url: 'assets/entity.debug.01.png',
      width: 16,
      height: 16
    },
    {
      url: 'assets/entity.debug.02.png',
      width: 16,
      height: 16
    }
  ],
  floor: 4,
  skybox: 5,
  data: [
    [w(1), w(1), w(1), w(1), w(1), w(1), w(1), w(1), w(1), w(1)],
    [w(1), f(4), f(4), f(4), f(4), f(4), f(4), f(4), f(4), w(1)],
    [w(1), f(4), f(4), f(4), f(4), f(4), f(4), f(4), f(4), w(1)],
    [w(1), f(4), f(4), f(4), f(4), f(4), f(4), f(4), f(4), w(1)],
    [w(1), f(4), f(4), f(4), f(4), f(4), f(4), f(4), f(4), w(1)],
    [w(1), f(4), f(4), f(4), f(4), f(4), f(4), f(4), f(4), w(1)],
    [w(1), f(4), f(4), f(4), f(4), f(4), f(4), f(4), f(4), w(1)],
    [w(1), f(4), f(4), f(4), f(4), f(4), f(4), f(4), f(4), w(1)],
    [w(1), f(4), f(4), f(4), f(4), f(4), f(4), f(4), f(4), w(1)],
    [w(1), w(1), w(1), w(1), w(1), w(1), w(1), w(1), g(3), w(1)]
  ],
  objects: [new Object(6.5, 6.5, 6, 0.2), new Object(7.5, 7.5, 7, 0.2)],
  enemies: [],
  textures: []
};
