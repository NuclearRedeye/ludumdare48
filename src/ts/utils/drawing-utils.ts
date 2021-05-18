import { Rectangle } from '../interfaces/rectangle';
import { Texture } from '../interfaces/texture';

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
    const pixel = {
      r: buffer[sourceOffset],
      g: buffer[sourceOffset + 1],
      b: buffer[sourceOffset + 2],
      a: buffer[sourceOffset + 3]
    };

    // Only draw the pixel to the framebuffer if it is visible.
    if (pixel.a > 0) {
      // Write that RGBA data into the correct location in the temporary floor data buffer.
      const offset = 4 * (Math.floor(destination.x) + Math.floor(drawYStart + y) * target.width);
      target.data[offset] = pixel.r;
      target.data[offset + 1] = pixel.g;
      target.data[offset + 2] = pixel.b;
      target.data[offset + 3] = pixel.a;
    }
  }
}