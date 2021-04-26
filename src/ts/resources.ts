import { Texture } from './interfaces/texture';

// Loads the specified image, decodes and copys it to an offscreen canvas and encapsulates it in a Texture object.
export async function createTexture(src: string, width: number, height: number): Promise<Texture> {
  const image: HTMLImageElement = document.createElement('img');
  const canvas: HTMLCanvasElement = document.createElement('canvas');

  // Initialise the offscreen canvas
  canvas.width = width;
  canvas.height = height;

  // Load and wait for the image to be decoded
  image.src = src;
  await image.decode();

  // Blit the image to the offscreen buffer
  const context = canvas.getContext('2d', { alpha: false }) as CanvasRenderingContext2D;
  context.fillStyle = 'white';
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height, 0, 0, width, height);

  // Store the raw pixel data
  const buffer = context.getImageData(0, 0, width, height).data;

  return {
    src,
    width,
    height,
    image,
    canvas,
    buffer
  };
}
