import { Level } from '../interfaces/level';

export const level00: Level = {
  depth: 0,
  name: 'Surface',
  entrance: {
    x: 1,
    y: 2,
    angle: 90,
    destination: 0
  },
  exit: {
    x: 8,
    y: 10,
    angle: 180,
    destination: 2
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
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ],
  textures: []
};
