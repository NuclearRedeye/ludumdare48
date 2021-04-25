import { Level } from './interfaces/level';
import { Portal } from './interfaces/portal';

import { Player } from './objects/player.js';
import { createTexture } from './resources.js';

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
    currentLevel.textures = [];
  }

  // Update the current level
  currentLevel = level;

  // Load Assets
  for (const asset of level.assets) {
    level.textures.push(await createTexture(asset.url, asset.width, asset.height));
  }

  // Load Skybox Asset
  if (level.skybox) {
    level.textures.push(await createTexture(level.skybox.url, level.skybox.width, level.skybox.height));
  }

  // Position Player
  player = new Player(start.x + 0.5, start.y + 0.5, start.angle);

  // Update Game State
  setCurrentState(states.LOADED);
}

export function getPlayer(): Player {
  return player;
}

export function getCurrentLevel(): Level {
  return currentLevel;
}
