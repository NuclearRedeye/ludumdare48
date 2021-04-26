import { Entity } from './interfaces/entity';
import { Level } from './interfaces/level';
import { Rectangle } from './interfaces/rectangle';
import { CastResult } from './interfaces/raycaster';

import { canvasWidth, canvasHeight } from './config.js';
import { drawGradient, drawTexture, drawTint } from './utils/canvas-utils.js';
import { isSolid } from './utils/cell-utils.js';
import { getCell, getTextureForCell } from './utils/level-utils.js';

// FIXME: These should be in a config object or similar
const width = canvasWidth; // The width, in pixels, of the screen.
const height = canvasHeight; // The height, in pixels, of the screen.
const halfHeight = height / 2; // Half the height of the screen, in pixels.
const columns = width; // The number of columns in the viewport, or basically the number or Rays to cast.

// Derived from https://lodev.org/cgtutor/raycasting.html.
// Casts a ray from the specified point at the specified angle and returns the first Wall the ray impacts.
export function castRay(column: number, entity: Entity, level: Level, maxDepth: number = 50): CastResult | undefined {
  const camera = (2 * column) / width - 1;
  const rayDirectionX = entity.dx + entity.cx * camera;
  const rayDirectionY = entity.dy + entity.cy * camera;

  // Calculate the current Cell of the map that we are in.
  let mapX = Math.floor(entity.x);
  let mapY = Math.floor(entity.y);

  // Flags to track if the next check should be in the X or Y direction when using DDA.
  let stepX;
  let stepY;

  // Calculate the distance from one cell boundry to the next boundry in the X or Y direction.
  const deltaDistanceX = Math.abs(1 / rayDirectionX);
  const deltaDistanceY = Math.abs(1 / rayDirectionY);

  // Calculate the distance from the entity's origin to the first boundry in the X or Y direction.
  let sideDistanceX;
  let sideDistanceY;

  // Calculate the distance to the first side based on the ray's direction on the X Axis.
  if (rayDirectionX < 0) {
    stepX = -1;
    sideDistanceX = (entity.x - mapX) * deltaDistanceX;
  } else {
    stepX = 1;
    sideDistanceX = (mapX + 1 - entity.x) * deltaDistanceX;
  }

  // Calculate the distance to the first side based on the ray's direction on the Y Axis.
  if (rayDirectionY < 0) {
    stepY = -1;
    sideDistanceY = (entity.y - mapY) * deltaDistanceY;
  } else {
    stepY = 1;
    sideDistanceY = (mapY + 1 - entity.y) * deltaDistanceY;
  }

  // Count the number of DDA steps executed, so that we can break if the maximum depth is reached.
  let count = 0;

  // Tracks if the DDA step was in the X or the Y axis.
  let side;

  // Use DDA to step through all the cell boundries the ray touches.
  while (count++ < maxDepth) {
    // Step in either the X or the Y direction, moving the X and Y position to the next cell boundry.
    if (sideDistanceX < sideDistanceY) {
      sideDistanceX += deltaDistanceX;
      mapX += stepX;
      side = 0;
    } else {
      sideDistanceY += deltaDistanceY;
      mapY += stepY;
      side = 1;
    }

    // Get the Cell that the ray has hit.
    const cell = getCell(level, mapX, mapY);

    // Check if the Cell is solid.
    if (isSolid(cell)) {
      // Calculate the distance from the ray's origin to the solid that was hit.
      const distance = side === 0 ? Math.abs((mapX - entity.x + (1 - stepX) / 2) / rayDirectionX) : Math.abs((mapY - entity.y + (1 - stepY) / 2) / rayDirectionY);

      // Calculate the point on the wall that the ray hit
      let wall = side === 0 ? entity.y + ((mapX - entity.x + (1 - stepX) / 2) / rayDirectionX) * rayDirectionY : entity.x + ((mapY - entity.y + (1 - stepY) / 2) / rayDirectionY) * rayDirectionX;
      wall -= Math.floor(wall);

      return {
        x: mapX,
        y: mapY,
        cell,
        side,
        wall,
        distance: distance
      };
    }
  }
  return undefined;
}

// Function to render the specified level, from the perspective of the specified entity to the target canvas
export function render(context: CanvasRenderingContext2D, entity: Entity, level: Level): void {
  const zBuffer = new Array(columns);

  // Draw the Ceiling
  drawGradient(context, { x: 0, y: 0 }, { x: width, y: halfHeight }, 'grey', 'black');

  // Draw the Floor
  drawGradient(context, { x: 0, y: halfHeight }, { x: width, y: height }, 'black', 'green');

  // Draw the Walls
  for (let column = 0; column < width; column++) {
    // Get the first solid cell this ray hits.
    const result = castRay(column, entity, level);

    // FIXME: Should draw something when no solid is found within the maximum range.
    if (result !== undefined) {
      // Stick the distance into the Depth Buffer
      zBuffer[column] = result.distance;

      // Calculate the height the wall should be rendered at from the distance from the entity.
      const wallHeight = Math.abs(Math.floor(height / result.distance));

      // Calculate the position on the Y axis of the viewport to start drawing the wall from.
      const wallY = -wallHeight / 2 + height / 2;

      // Get the texture for the solid cell.
      const texture = getTextureForCell(level, result.cell);

      // Calculate the X offset in the Texture for the slice that needs to be rendered.
      const wallX = Math.floor(result.wall * texture.width);

      // FIXME: Any South or West facing texture is falling into a trap here.
      /*if (result.side === 0 && entity.dy < 0) {
        wallX = texture.width - wallX - 1;
      }
      if (result.side === 1 && entity.dx > 0) {
        wallX = texture.width - wallX - 1;
      }*/

      // The slice of the texture that we want to render to the framebuffer.
      const sourceRectangle: Rectangle = {
        x: wallX,
        y: 0,
        width: 1,
        height: texture.height
      };

      // The location to render that texture to in the framebuffer.
      const destinationRectange: Rectangle = {
        x: column,
        y: wallY,
        width: 1,
        height: wallHeight
      };

      // Draw the wall to the framebuffer.
      drawTexture(context, texture, sourceRectangle, destinationRectange);

      // Apply a darkened tint to the wall, based on its distance from the entity.
      drawTint(context, destinationRectange, (wallHeight * 1.6) / height);
    }
  }
}
