import { Level } from '../interfaces/level';
import { createFloor as f, createWall as w } from '../utils/cell-utils.js';

export const level06: Level = {
  depth: 6,
  name: 'The Trap',
  entrance: {
    x: 3,
    y: 4,
    angle: 0
  },
  exit: {
    x: 4,
    y: 2,
    angle: 180
  },
  assets: [
    {
      url: 'assets/wall.mud.01.png',
      width: 16,
      height: 16
    },
    {
      url: 'assets/entrance.mud.01.png',
      width: 16,
      height: 16
    },
    {
      url: 'assets/exit.mud.01.png',
      width: 16,
      height: 16
    },
    {
      url: 'assets/floor.mud.01.png',
      width: 16,
      height: 16
    },
    {
      url: 'assets/object.coin.01.png',
      width: 128,
      height: 16
    },
    {
      url: 'assets/wall.stone.02.png',
      width: 16,
      height: 16
    }
  ],
  floor: 4,
  loot: 5,
  data: [
    [w(1), w(1), w(1), w(1), w(1), w(1)],
    [w(1), f(4), f(4), f(4), f(4), w(1)],
    [w(1), f(4), f(4), f(4), f(4), w(1)],
    [w(1), f(4), f(4), f(4), f(4), w(1)],
    [w(1), f(4), f(4), f(4), f(4), w(1)],
    [w(1), f(4), f(4), f(4), f(4), w(1)],
    [w(1), f(4), f(4), f(4), f(4), w(1)],
    [w(1), f(4), f(4), f(4), f(4), w(1)],
    [w(1), f(4), f(4), f(4), f(4), w(1)],
    [w(1), f(4), f(4), f(4), f(4), w(1)],
    [w(1), w(1), w(1), w(1), w(1), w(1)]
  ],
  objects: [],
  sprites: [],
  enemies: [],
  textures: []
};
