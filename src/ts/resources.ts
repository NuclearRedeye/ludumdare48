import { Texture } from './interfaces/texture';

// Loads the specified image, decodes and copys it to an offscreen canvas and encapsulates it in a Texture object.
export async function createTexture(src: string, width: number, height: number): Promise<Texture> {
  const texture: Texture = {
    src,
    width,
    height,
    image: document.createElement('img') as HTMLImageElement,
    canvas: document.createElement('canvas') as HTMLCanvasElement
  };

  // Initialise the offscreen canvas
  texture.canvas.width = width;
  texture.canvas.height = height;

  // Load and wait for the image to be decoded
  texture.image.src = src;
  await texture.image.decode();

  // Blit the image to the offscreen buffer
  const context = texture.canvas.getContext('2d', { alpha: false }) as CanvasRenderingContext2D;
  context.fillStyle = 'white';
  context.fillRect(0, 0, width, height);
  context.drawImage(texture.image, 0, 0, width, height, 0, 0, width, height);

  return texture;
}
