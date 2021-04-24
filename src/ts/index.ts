import { createTextElement } from './utils/utils.js';
import { Mark, getCurrentFramesPerSecond, getDelta, getElapsed } from './utils/frametimer.js';
import { canvasWidth, canvasHeight } from './config.js';
import { Player } from './objects/player.js';
import { levels } from './levels/index.js';
import { render } from './raycaster.js';
import { Level } from './interfaces/level.js';
import { createTexture } from './resources.js';
import { getCurrentState, setCurrentState, states } from './state.js';

// Globals
let canvas: HTMLCanvasElement;
let context: CanvasRenderingContext2D;

// States
let pause: boolean = false;
let debug: boolean = false;

// TODO: Clean this up.
let player: Player;
let rotateLeft = false;
let rotateRight = false;
let moveForwards = false;
let moveBackwards = false;

function update(elapsed: number): void {
  if (moveForwards) player.move(3.0 / elapsed, currentLevel);
  if (moveBackwards) player.move(-1.0 / elapsed, currentLevel);
  if (rotateLeft) player.rotate(-70 / elapsed);
  if (rotateRight) player.rotate(70 / elapsed);
}

let currentLevel: Level;

async function setCurrentLevel(level: Level): Promise<void> {
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

  // Position Player
  player = new Player(level.entrance.x + 0.5, level.entrance.y + 0.5, level.entrance.angle);

  // Update Game State
  setCurrentState(states.LOADED);
}

// Main Loop
function onTick(timestamp: number): void {
  if (!pause) {
    // Mark the timer
    Mark(timestamp);

    // Clear the Canvas, although no real need.
    context.clearRect(0, 0, canvasWidth, canvasHeight);

    switch (getCurrentState()) {
      case states.LOADING:
        context.fillStyle = 'white';
        context.fillText(`Loading`, canvasWidth / 2 - 30, canvasHeight / 2);
        break;

      case states.LOADED:
        update(getDelta());
        render(context, player, currentLevel);
        break;
    }

    // If 'debug' is enabled, print various stats.
    if (debug) {
      context.fillStyle = 'white';
      context.fillText(`Current FPS: ${getCurrentFramesPerSecond().toFixed(2)}`, 10, 10);
      context.fillText(`Previous FT: ${getDelta().toFixed(2)}`, 10, 30);
      context.fillText(`Runtime: ${getElapsed().toFixed(2)} seconds`, 10, 50);
    }
  }

  window.requestAnimationFrame(onTick);
}

window.onkeydown = (event: KeyboardEvent): void => {
  switch (event.code) {
    case 'KeyW':
      moveForwards = true;
      break;

    case 'KeyA':
      rotateLeft = true;
      break;

    case 'KeyS':
      moveBackwards = true;
      break;

    case 'KeyD':
      rotateRight = true;
      break;

    default:
      break;
  }
};

window.onkeyup = (event: KeyboardEvent): void => {
  switch (event.code) {
    // Toogle pausing the mainloop
    case 'KeyP':
      pause = !pause;
      break;

    // Toggle debug on or off
    case 'KeyI':
      debug = !debug;
      break;

    case 'KeyW':
      moveForwards = false;
      break;

    case 'KeyA':
      rotateLeft = false;
      break;

    case 'KeyS':
      moveBackwards = false;
      break;

    case 'KeyD':
      rotateRight = false;
      break;

    // TODO: Delete before publish
    case 'Digit0':
      setCurrentLevel(levels[0]);
      break;

    // TODO: Delete before publish
    case 'Digit1':
      setCurrentLevel(levels[1]);
      break;

    // TODO: Delete before publish
    case 'Digit2':
      setCurrentLevel(levels[2]);
      break;

    default:
      break;
  }
};

window.onload = function (): void {
  canvas = document.createElement('canvas') as HTMLCanvasElement;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  context = canvas.getContext('2d', { alpha: false }) as CanvasRenderingContext2D;
  context.imageSmoothingEnabled = false;
  document.body.appendChild(canvas);
  document.body.appendChild(createTextElement('Created by NuclearRedeye'));
  window.requestAnimationFrame(onTick);
  setCurrentLevel(levels[0]);
};
