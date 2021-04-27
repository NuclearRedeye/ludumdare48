import { Level } from '../../interfaces/level';

import { createFloor as f, createWall as w, createExit as g, createInvisibleWall as i } from '../../utils/cell-utils.js';

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
  floor: 2,
  data: [
    [i(2), i(2), i(2), i(2), i(2), i(2), i(2), i(2), i(2), i(2)],
    [i(2), f(2), f(2), f(2), f(2), f(2), f(2), f(2), f(2), i(2)],
    [i(2), f(2), f(2), f(5), f(5), f(2), f(2), f(2), f(2), i(2)],
    [i(2), f(2), f(2), f(5), f(5), f(2), f(2), f(2), f(2), i(2)],
    [i(2), f(2), f(2), f(2), f(2), f(2), f(2), f(2), f(2), i(2)],
    [w(2), f(2), f(2), f(2), f(2), f(2), f(2), f(2), f(2), w(2)],
    [w(2), f(2), f(2), f(2), f(2), f(2), f(2), f(2), f(2), w(2)],
    [w(2), f(2), f(2), f(2), f(2), f(2), f(2), f(2), f(2), w(2)],
    [w(2), f(2), f(2), f(2), f(2), f(2), f(2), f(2), f(2), w(2)],
    [w(1), w(1), w(5), w(1), w(1), w(2), w(2), w(2), w(2), w(2)]
  ],
  objects: [],
  sprites: [],
  enemies: []
};
