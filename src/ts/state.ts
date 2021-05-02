import { Level } from './interfaces/level';
import { Portal } from './interfaces/portal';
import { Texture } from './interfaces/texture';

import { Player } from './objects/player.js';
import { sleep } from './utils/time-utils.js';
import { fillLevelWithLoot, getCell } from './utils/level-utils.js';
import { degreesToRadians } from './utils/math-utils.js';
import { CellType } from './enums.js';
import { getTextureById, loadTexture } from './utils/texture-utils.js';
import { isSolid } from './utils/cell-utils.js';

export enum states {
  STARTING,
  LOADING,
  LOADED
}

let currentLevel: Level;
let player: Player;
let currentState: number = states.STARTING;

export function getGameState(): number {
  return currentState;
}

export function setGameState(state: number): void {
  if (state !== currentState) {
    currentState = state;
  }
}

export async function setCurrentLevel(level: Level, start: Portal): Promise<void> {
  setGameState(states.LOADING);

  // Free the current levels resources

  // Update the current level
  currentLevel = level;

  // For each cell in the level, get the ID of the texture and then load the
  // FIXME: Should create an iterator for the level data. This will do for now.
  const promises: Promise<Texture>[] = [];
  for (let y = 0; y < level.data.length; y++) {
    for (let x = 0; x < level.data[0].length; x++) {
      const cell = level.data[y][x];
      const textureIds = [...new Set(cell.textureIds)];
      for (const textureId of textureIds) {
        const texture = getTextureById(textureId);
        promises.push(loadTexture(texture));
      }
    }
  }

  // FIXME: Need to remove this once I fix the floor logic.
  if (level.floor) {
    const texture = getTextureById(level.floor);
    promises.push(loadTexture(texture));
  }

  // Wait for all the Textures to load.
  await Promise.all(promises);

  // Initialise and position Player
  let playerX = start.x;
  let playerY = start.y;

  // FIXME: If the spawn point is already OK, then no need to do this.
  for (let x = -1; x < 1; x++) {
    for (let y = -1; y < 1; y++) {
      const cell = getCell(level, playerX + x, playerY + y);
      if (cell !== undefined && cell.type === CellType.FLOOR && !isSolid(cell)) {
        playerX += x;
        playerY += y;
        break;
      }
    }
  }

  player = new Player(playerX + 0.5, playerY + 0.5);
  player.rotate(degreesToRadians(start.angle));

  // Is it the first time we have been to the level?
  if (level.objects.length === 0) {
    fillLevelWithLoot(level);
  }

  // FIXME: Should time the load, and then sleep for the delta.
  await sleep(2000);

  // Update Game State
  setGameState(states.LOADED);
}

export function getPlayer(): Player {
  return player;
}

export function getCurrentLevel(): Level {
  return currentLevel;
}
