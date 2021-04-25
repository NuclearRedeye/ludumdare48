import { createTextElement } from './utils/utils.js';
import { Mark, getCurrentFramesPerSecond, getDelta, getElapsed } from './utils/frametimer.js';
import { canvasWidth, canvasHeight } from './config.js';
import { levels } from './levels/index.js';
import { render } from './raycaster.js';
import { getCurrentLevel, getCurrentState, getPlayer, setCurrentLevel, states } from './state.js';

// Globals
let canvas: HTMLCanvasElement;
let context: CanvasRenderingContext2D;

// States
let pause: boolean = false;
let debug: boolean = false;

// TODO: Clean this up.
let rotateLeft = false;
let rotateRight = false;
let moveForwards = false;
let moveBackwards = false;
let interact = false;

function update(elapsed: number): void {
  if (moveForwards) getPlayer().move(3.0 / elapsed, getCurrentLevel());
  if (moveBackwards) getPlayer().move(-1.0 / elapsed, getCurrentLevel());
  if (rotateLeft) getPlayer().rotate(-70 / elapsed);
  if (rotateRight) getPlayer().rotate(70 / elapsed);
  if (interact) getPlayer().interact(getCurrentLevel());
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
        render(context, getPlayer(), getCurrentLevel());
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

    case 'Space':
      interact = true;
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

    case 'Space':
      interact = false;
      break;

    // TODO: Delete before publish
    case 'Digit0':
      setCurrentLevel(levels[0], levels[0].entrance);
      break;

    // TODO: Delete before publish
    case 'Digit1':
      setCurrentLevel(levels[1], levels[1].entrance);
      break;

    // TODO: Delete before publish
    case 'Digit2':
      setCurrentLevel(levels[2], levels[2].entrance);
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
  setCurrentLevel(levels[0], levels[0].entrance);
};
