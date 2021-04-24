import { createTextElement } from './utils/utils.js';
import { Mark, getCurrentFramesPerSecond, getDelta, getElapsed } from './utils/frametimer.js';
import { canvasWidth, canvasHeight } from './config.js';
import { Player } from './objects/player.js';
import { level01 } from './levels/level01.js';
import { render } from './raycaster.js';

// Globals
let canvas: HTMLCanvasElement;
let context: CanvasRenderingContext2D;

// States
let pause: boolean = false;
let debug: boolean = false;

// TODO: Clean this up.
const player = new Player(3.5, 3.5, 0);
let rotateLeft = false;
let rotateRight = false;
let moveForwards = false;
let moveBackwards = false;

function update(elapsed: number): void {
  if (moveForwards) player.move(3.0 / elapsed);
  if (moveBackwards) player.move(-1.0 / elapsed);
  if (rotateLeft) player.rotate(-70 / elapsed);
  if (rotateRight) player.rotate(70 / elapsed);
}

// Main Loop
function onTick(timestamp: number): void {
  if (!pause) {
    // Mark the timer
    Mark(timestamp);

    // Clear the Canvas, although no real need.
    context.clearRect(0, 0, canvasWidth, canvasHeight);

    // Update
    update(getDelta());

    // Render
    render(context, player, level01);

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

    default:
      break;
  }
};

window.onload = function (): void {
  canvas = document.createElement('canvas') as HTMLCanvasElement;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  context = canvas.getContext('2d', { alpha: false }) as CanvasRenderingContext2D;
  document.body.appendChild(canvas);
  document.body.appendChild(createTextElement('Created by NuclearRedeye'));
  window.requestAnimationFrame(onTick);
};
