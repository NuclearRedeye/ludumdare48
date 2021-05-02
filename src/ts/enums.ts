export enum CellType {
  FLOOR,
  WALL,
  ENTRANCE,
  EXIT
}

export enum Face {
  NORTH = 0,
  EAST,
  SOUTH,
  WEST,
  TOP,
  BOTTOM
}

export enum TextureState {
  UNLOADED = 0,
  LOADING = 1,
  LOADED = 2,
  ERROR = 4
}

export enum TextureProperties {
  NONE = 0,
  ANIMATED = 1,
  STATEFUL = 2
}

export enum CellProperties {
  NONE = 0,
  SOLID = 1,
  BLOCKED = 2,
  INTERACTIVE = 4
}
