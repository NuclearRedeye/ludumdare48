import { Level } from '../../interfaces/level';

import { createFloor as f, createSimpleWall as sw, createWall as w, createInvisibleWall as i } from '../../utils/cell-utils.js';

export const level00: Level = {
  depth: 0,
  name: 'Debug',
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
  floor: 2,
  data: [
    [i(2), i(2), sw(5), i(2), i(2), i(2), i(2), i(2), i(2), i(2)],
    [i(2), f(2), f(2), f(2), f(2), f(2), f(2), f(2), f(2), i(2)],
    [i(2), f(2), f(2), f(5), f(5), f(2), f(2), f(2), f(2), i(2)],
    [i(2), f(2), f(2), f(5), f(5), f(2), f(2), f(2), f(2), i(2)],
    [i(2), f(2), f(2), f(2), f(2), f(2), f(2), f(2), f(2), i(2)],
    [sw(2), f(2), f(2), f(2), f(2), f(2), f(2), f(2), f(2), sw(2)],
    [sw(2), f(2), f(2), f(2), f(2), f(2), f(2), w([2, 5, 2, 5, 2, 2]), f(2), sw(2)],
    [sw(2), f(2), f(2), f(2), f(2), f(2), f(2), f(2), f(2), sw(2)],
    [sw(2), f(2), f(2), f(2), f(2), f(2), f(2), f(2), f(2), sw(2)],
    [sw(1), sw(1), sw(5), sw(1), sw(1), sw(2), sw(2), sw(2), sw(2), sw(2)]
  ],
  objects: [],
  sprites: [],
  enemies: []
};
