import { Point } from '../interfaces/point';
import { Rectangle } from '../interfaces/rectangle';
import { Texture } from '../interfaces/texture';

import { canvasWidth, canvasHeight } from '../config.js';

// Draws a line of the specified colour on the target canvas.
export function drawLine(context: CanvasRenderingContext2D, start: Point, end: Point, colour: string): void {
  context.strokeStyle = colour;
  context.beginPath();
  context.moveTo(start.x, start.y);
  context.lineTo(end.x, end.y);
  context.stroke();
}

// Draws a rectangle of the specified tint on the target canvas.
export function drawTint(context: CanvasRenderingContext2D, destination: Rectangle, tint: number): void {
  let colour = Math.round(60 / tint);
  colour = 60 - colour;
  if (colour < 0) {
    colour = 0;
  }
  tint = 1 - tint;
  context.fillStyle = `rgba(${colour},${colour},${colour},${tint})`;
  context.fillRect(destination.x, destination.y, destination.width, destination.height);
}

// Draws a gradient of the specified colours on the target canvas.
export function drawGradient(context: CanvasRenderingContext2D, start: Point, end: Point, startColour: string, endColour: string): void {
  // FIXME: width should not be hardcoded here!
  const x = canvasWidth / 2;
  const gradient = context.createLinearGradient(x, start.y, x, end.y);
  gradient.addColorStop(0, startColour);
  gradient.addColorStop(1, endColour);
  context.fillStyle = gradient;
  context.fillRect(start.x, start.y, end.x, end.y);
}

// Draws the specified texture at the specified location on the target canvas.
export function drawTexture(context: CanvasRenderingContext2D, texture: Texture, source: Rectangle, destination: Rectangle): void {
  context.drawImage(texture.canvas as HTMLCanvasElement, source.x, source.y, source.width, source.height, destination.x, destination.y, destination.width, destination.height);
}

// Draws the specified texture at the specified location in the target buffer.
export function drawTexture2(target: ImageData, texture: Texture, source: Rectangle, destination: Rectangle): void {
  // Calculate how many pixels we need to draw, culling any that fall outside of the viewport. We should never draw more than the height of the framebuffer.
  const until = destination.height > target.height ? target.height : destination.height;

  // Calculate the addtional vertical offset in the framebuffer needed to correct for any culled pixels.
  const targetYOffset = destination.y < 0 ? 0 : destination.y;

  // Calculate the addtional vertical offset in the Texture needed to correct for any culled pixels.
  const texYOffset = destination.y < 0 ? Math.abs(destination.y) : 0;

  // For each visible vertical pixel
  for (let y = 0; y < until; y++) {
    // How much to increase the texture coordinate per screen pixel
    const yOffset = (texture.height / destination.height) * (texYOffset + y);

    // Get the RGBA values for the specified pixel directly from the textures data buffer.
    const sourceOffset = 4 * (source.x + (source.y + Math.floor(yOffset)) * texture.imageWidth);
    const buffer = texture.buffer as Uint8ClampedArray;
    const pixel = {
      r: buffer[sourceOffset],
      g: buffer[sourceOffset + 1],
      b: buffer[sourceOffset + 2],
      a: buffer[sourceOffset + 3]
    };

    // Write that RGBA data into the correct location in the temporary floor data buffer.
    const offset = 4 * (Math.floor(destination.x) + Math.floor(targetYOffset + y) * target.width);
    target.data[offset] = pixel.r;
    target.data[offset + 1] = pixel.g;
    target.data[offset + 2] = pixel.b;
    target.data[offset + 3] = pixel.a;
  }
}

// Draws the specified texture as a Skybox at the specified location on the target canvas.
export function drawSkybox(context: CanvasRenderingContext2D, start: Point, end: Point, texturePositionX: number, texture: Texture): void {
  // FIXME: height should not be hardcoded here!
  const wallHeight = end.y - start.y;
  context.drawImage(texture.canvas as HTMLCanvasElement, texturePositionX, 0, 1, (wallHeight / canvasHeight) * texture.height, start.x, start.y, 1, wallHeight);
}
