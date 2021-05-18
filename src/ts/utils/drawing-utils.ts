import { Colour } from '../interfaces/colour';
import { Rectangle } from '../interfaces/rectangle';
import { Texture } from '../interfaces/texture';

const bytesPerPixel = 4;

// Draws the specified pixel at the specified location in the target buffer.
export function drawPixel(frameBuffer: ImageData, x: number, y: number, colour: Colour): void {
  // Make sure the pixel is visible.
  if (colour.alpha > 0) {
    // Calculate the offset in the buffer for the specified pixel.
    const offset = bytesPerPixel * (x + y * frameBuffer.width);

    // Set the data in the buffer to the specified RGBA values.
    frameBuffer.data[offset] = colour.red;
    frameBuffer.data[offset + 1] = colour.green;
    frameBuffer.data[offset + 2] = colour.blue;
    frameBuffer.data[offset + 3] = colour.alpha;
  }
}

// Draws the specified texture at the specified location in the target buffer.
export function drawTexture(target: ImageData, texture: Texture, source: Rectangle, destination: Rectangle): void {
  // Calculate how many pixels we need to draw, culling any that fall outside of the viewport. We should never draw more than the height of the framebuffer.
  const drawYStart = destination.y < 0 ? 0 : destination.y;
  const drawYEnd = destination.y + destination.height > target.height ? target.height : destination.y + destination.height;
  const until = drawYEnd - drawYStart;

  // Calculate the vertical offset in the Texture needed to correct for any culled pixels.
  const texYOffset = destination.y < 0 ? Math.abs(destination.y) : 0;

  // For each visible vertical pixel
  for (let y = 0; y < until; y++) {
    // How much to increase the texture coordinate per screen pixel
    const yOffset = (texture.height / destination.height) * (texYOffset + y);

    // Get the RGBA values for the specified pixel directly from the textures data buffer.
    const sourceOffset = 4 * (source.x + (source.y + Math.floor(yOffset)) * texture.imageWidth);
    const buffer = texture.buffer as Uint8ClampedArray;
    const pixel: Colour = {
      red: buffer[sourceOffset],
      green: buffer[sourceOffset + 1],
      blue: buffer[sourceOffset + 2],
      alpha: buffer[sourceOffset + 3]
    };

    // Draw the pixel data to the supplied buffer
    drawPixel(target, Math.floor(destination.x), Math.floor(drawYStart + y), pixel);
  }
}
