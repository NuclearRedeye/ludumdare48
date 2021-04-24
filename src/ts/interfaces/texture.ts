export interface Texture {
  src: string; // Source image for the texture, e.g. 'image.png'.
  width: number; // The width, in pixels, of the Texture.
  height: number; // The height, in pixels, of the Texture.
  image: HTMLImageElement; // Handle to the DOM image element for this Texture.
  canvas: HTMLCanvasElement; // Handle to the Offscreen Canvas for this Texture data.
}
