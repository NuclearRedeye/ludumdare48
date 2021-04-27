import { Level } from './interfaces/level';
import { Portal } from './interfaces/portal';

import { Player } from './objects/player.js';
import { createTexture } from './resources.js';
import { sleep } from './utils/fps-utils.js';
import { fillLevelWithLoot, getCell } from './utils/level-utils.js';
import { degreesToRadians } from './utils/math-utils.js';
import { CellType } from './enums.js';

export enum states {
  STARTING,
  LOADING,
  LOADED
}

let currentLevel: Level;
let player: Player;
let currentState: number = states.STARTING;

export function getCurrentState(): number {
  return currentState;
}

export function setCurrentState(state: number): void {
  if (state !== currentState) {
    currentState = state;
  }
}

export async function setCurrentLevel(level: Level, start: Portal): Promise<void> {
  setCurrentState(states.LOADING);

  // Free the current levels resources
  if (currentLevel) {
    currentLevel.textures = new Array(currentLevel.assets.length);
  }

  // Update the current level
  currentLevel = level;

  // Load Assets
  for (let i = 0; i < level.assets.length; i++) {
    const asset = level.assets[i];
    const texture = await createTexture(asset.url, asset.width, asset.height);
    level.textures[i] = texture;
  }

  // Initialise and position Player
  let playerX = start.x;
  let playerY = start.y;

  // FIXME: If the spawn point is already OK, then no need to do this.
  for (let x = -1; x < 1; x++) {
    for (let y = -1; y < 1; y++) {
      const cell = getCell(level, playerX + x, playerY + y);
      if (cell !== undefined && cell.type === CellType.FLOOR && cell.solid === false) {
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
  setCurrentState(states.LOADED);
}

export function getPlayer(): Player {
  return player;
}

export function getCurrentLevel(): Level {
  return currentLevel;
}
