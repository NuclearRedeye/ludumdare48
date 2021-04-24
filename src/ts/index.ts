import { createTextElement } from './utils/utils.js';
import { canvasWidth, canvasHeight } from './config.js';

window.onload = function (): void {
  const canvas: HTMLCanvasElement = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  document.body.appendChild(canvas);
  document.body.appendChild(createTextElement('Created by NuclearRedeye'));
};
