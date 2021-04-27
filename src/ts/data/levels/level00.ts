import { Level } from '../../interfaces/level';

import { createFloor as f, createExit as g, createInvisibleWall as i } from '../../utils/cell-utils.js';

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
  floor: 6,
  data: [
    [i(6), i(3), i(3), i(3), i(3), i(3), i(3), i(3), i(3), i(6)],
    [i(3), i(3), f(3), f(3), f(3), f(3), f(3), f(3), i(3), i(3)],
    [i(3), f(3), f(3), f(3), f(3), f(3), f(3), f(3), f(3), i(3)],
    [i(3), f(3), f(3), f(3), f(3), f(3), f(3), f(3), f(3), i(3)],
    [i(3), f(3), f(3), f(3), f(3), f(3), f(3), f(3), f(3), i(3)],
    [i(3), f(3), f(3), f(3), f(3), g(4), f(3), f(3), f(3), i(3)],
    [i(3), f(3), f(3), f(3), f(3), f(3), f(3), f(3), f(3), i(3)],
    [i(3), f(3), f(3), f(3), f(3), f(3), f(3), f(3), f(3), i(3)],
    [i(3), i(3), f(3), f(3), f(3), f(3), f(3), f(3), i(3), i(3)],
    [i(6), i(3), i(3), i(3), i(3), i(3), i(3), i(3), i(3), i(6)]
  ],
  objects: [],
  sprites: [],
  enemies: []
};
