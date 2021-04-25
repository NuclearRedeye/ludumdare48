import { Level } from '../interfaces/level';

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
    [1, 1, 3, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 2, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 2, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 2, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 2, 0, 4],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ],
  textures: []
};
