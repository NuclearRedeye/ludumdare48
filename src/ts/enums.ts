export enum CellType {
  FLOOR,
  WALL,
  ENTRANCE,
  EXIT
}

export enum Face {
  NORTH,
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

export enum TextureProperty {
  NONE = 0,
  ANIMATED = 1
}

export enum CellProperty {
  NONE = 1,
  SOLID = 2
}
