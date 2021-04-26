import { Level } from '../interfaces/level';
import { createFloor as f, createWall as w, createEntrance as e, createExit as g } from '../utils/cell-utils.js';

export const level02: Level = {
  depth: 2,
  entrance: {
    x: 5,
    y: 4,
    angle: 270
  },
  exit: {
    x: 2,
    y: 0,
    angle: 90
  },
  assets: [
    {
      url: 'assets/wall.stone.01.png',
      width: 16,
      height: 16
    },
    {
      url: 'assets/entrance.stone.01.png',
      width: 16,
      height: 16
    },
    {
      url: 'assets/exit.stone.01.png',
      width: 16,
      height: 16
    },
    {
      url: 'assets/floor.stone.01.png',
      width: 16,
      height: 16
    },
    {
      url: 'assets/object.coin.01.png',
      width: 128,
      height: 16
    }
  ],
  floor: 4,
  loot: 5,
  data: [
    [w(1), g(3), w(1), w(1), w(1), w(1), w(1), w(1), w(1), w(1)],
    [w(1), f(4), f(4), f(4), w(1), f(4), f(4), f(4), f(4), w(1)],
    [w(1), f(4), f(4), f(4), w(1), f(4), w(1), w(1), f(4), w(1)],
    [w(1), f(4), f(4), f(4), w(1), f(4), w(1), w(1), f(4), w(1)],
    [w(1), w(1), f(4), w(1), w(1), f(4), w(1), w(1), f(4), w(1)],
    [w(1), f(4), f(4), f(4), w(1), e(2), w(1), w(1), f(4), w(1)],
    [w(1), f(4), f(4), f(4), w(1), w(1), w(1), w(1), f(4), w(1)],
    [w(1), f(4), f(4), f(4), f(4), f(4), f(4), f(4), f(4), w(1)],
    [w(1), f(4), f(4), f(4), w(1), f(4), f(4), f(4), f(4), w(1)],
    [w(1), w(1), w(1), w(1), w(1), w(1), w(1), w(1), w(1), w(1)]
  ],
  objects: [],
  enemies: [],
  textures: []
};
