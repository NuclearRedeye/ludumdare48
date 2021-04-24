import { createTextElement } from './utils/utils.js';
import { Mark, getCurrentFramesPerSecond, getDelta, getElapsed } from './utils/frametimer.js';
import { canvasWidth, canvasHeight } from './config.js';

// Globals
let canvas: HTMLCanvasElement;
let context: CanvasRenderingContext2D;

// States
let pause: boolean = false;
let debug: boolean = false;

function update(elapsed: number): void {
  return;
}

function render(): void {
  return;
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
    render();

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
    case 'KeyD':
      debug = !debug;
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
