import { Level } from '../interfaces/level';

export const level01: Level = {
  entrance: {
    x: 1,
    y: 2,
    angle: 90
  },
  exit: {
    x: 6,
    y: 6
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
    }
  ],
  data: [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 2, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 2, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 2, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 2, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ],
  textures: []
};
