import { Entity } from './interfaces/entity';
import { Sprite } from './interfaces/sprite';
import { Level } from './interfaces/level';
import { Rectangle } from './interfaces/rectangle';
import { CastResult } from './interfaces/raycaster';

import { canvasWidth, canvasHeight } from './config.js';
import { drawGradient, drawTexture, drawTint } from './utils/canvas-utils.js';
import { isSolid, isWall } from './utils/cell-utils.js';
import { getCell, getTextureById, getTextureForCell } from './utils/level-utils.js';
import { getAnimationFrame } from './utils/time-utils.js';

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
    if (cell !== undefined && isSolid(cell) && isWall(cell)) {
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
  if (level.ceiling === undefined) {
    drawGradient(context, { x: 0, y: 0 }, { x: width, y: halfHeight }, 'grey', 'black');
  }

  // Draw the Floor
  if (level.floor === undefined) {
    drawGradient(context, { x: 0, y: halfHeight - 1 }, { x: width, y: height }, 'black', 'grey');
  } else {
    // Create a buffer for storing the floor data. This can then be copied to the framebuffer in a single draw operation.
    const floor: ImageData = context.createImageData(width, halfHeight);

    // For each horizonal line from the horizon to the bottom of the screen.
    for (let y = halfHeight - 1; y < height; y++) {
      // rayDir for leftmost ray (x = 0) and rightmost ray (x = w)
      const rayDirX0 = entity.dx - entity.cx;
      const rayDirY0 = entity.dy - entity.cy;
      const rayDirX1 = entity.dx + entity.cx;
      const rayDirY1 = entity.dy + entity.cy;

      // Current y position compared to the center of the screen (the horizon)
      const p = y - halfHeight;

      // Vertical position of the camera.
      const posZ = 0.5 * height;

      // Horizontal distance from the camera to the floor for the current row.
      // 0.5 is the z position exactly in the middle between floor and ceiling.
      const rowDistance = posZ / p;

      // calculate the real world step vector we have to add for each x (parallel to camera plane)
      // adding step by step avoids multiplications with a weight in the inner loop
      const floorStepX = (rowDistance * (rayDirX1 - rayDirX0)) / width;
      const floorStepY = (rowDistance * (rayDirY1 - rayDirY0)) / width;

      // real world coordinates of the leftmost column. This will be updated as we step to the right.
      let floorX = entity.x + rowDistance * rayDirX0;
      let floorY = entity.y + rowDistance * rayDirY0;

      // For each pixel in the horizontal line.
      for (let x = 0; x < width; x++) {
        // the cell coord is simply got from the integer parts of floorX and floorY
        const cellX = Math.floor(floorX);
        const cellY = Math.floor(floorY);

        // FIXME: This works, but not sure it is correct.
        let texture = getTextureById(level, level.floor);
        if (!Number.isNaN(cellX) || !Number.isNaN(cellY) || isFinite(cellX) || isFinite(cellY)) {
          const cell = getCell(level, cellX, cellY);
          if (cell !== undefined) {
            texture = getTextureById(level, cell.textureId);
          }
        }

        // get the texture coordinate from the fractional part
        const tx = Math.floor(texture.height * (floorX - cellX)) & (texture.height - 1);
        const ty = Math.floor(texture.height * (floorY - cellY)) & (texture.height - 1);

        floorX += floorStepX;
        floorY += floorStepY;

        // If the texture is animated, then calculate the offset for the frame within the texture.
        let texXAnimationOffset = 0;
        if (texture.width > texture.height) {
          const frame = getAnimationFrame();
          texXAnimationOffset = frame * texture.height;
        }

        // Get the RGBA values directly from the decoded texture.
        const sourceOffset = 4 * (texXAnimationOffset + tx + ty * texture.width);
        const pixel = {
          r: texture.buffer[sourceOffset],
          g: texture.buffer[sourceOffset + 1],
          b: texture.buffer[sourceOffset + 2],
          a: texture.buffer[sourceOffset + 3]
        };

        // Write that data into the correct location in the buffer.
        const offset = 4 * (Math.floor(x) + Math.floor(y - halfHeight - 1) * width);
        floor.data[offset] = pixel.r;
        floor.data[offset + 1] = pixel.g;
        floor.data[offset + 2] = pixel.b;
        floor.data[offset + 3] = pixel.a;
      }
    }

    // Copy the data from the buffer to the framebuffer.
    context.putImageData(floor, 0, halfHeight - 1);

    // FIXME: This is a lazy way to add some shading to the floor, would be better to do this when setting the pixel data in the buffer.
    drawGradient(context, { x: 0, y: halfHeight - 1 }, { x: width, y: height }, 'rgba(0,0,0,180)', 'transparent');
  }

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

  // Prepare the sprites...
  const sprites: Sprite[] = [...level.objects, ...level.enemies, ...level.sprites];
  for (const sprite of sprites) {
    sprite.distance = (entity.x - sprite.x) * (entity.x - sprite.x) + (entity.y - sprite.y) * (entity.y - sprite.y);
  }

  // Sort sprites from far to close
  sprites.sort((a, b) => {
    // FIXME: Possivly undefined
    return (b.distance || 0) - (a.distance || 0);
  });

  //after sorting the sprites, do the projection and draw them
  for (let i = 0; i < sprites.length; i++) {
    // For ease...
    const sprite = sprites[i];

    // Don't bother on non-active sprites.
    if (sprite.active === false) {
      continue;
    }

    // Get the texture for the sprite
    const texture = getTextureById(level, sprite.textureId);

    // Calculate the sprites position
    const spriteX = sprite.x - entity.x;
    const spriteY = sprite.y - entity.y;

    // Calculate some magic which I don't really understand myself, but it works.
    const invDet = 1.0 / (entity.cx * entity.dy - entity.dx * entity.cy);
    const transformX = invDet * (entity.dy * spriteX - entity.dx * spriteY);
    const transformY = invDet * (-entity.cy * spriteX + entity.cx * spriteY);

    // The X position of the sprite
    const spriteScreenX = Math.floor((width / 2) * (1 + transformX / transformY));

    // Calculate the height of the sprite.
    const spriteHeight = Math.abs(Math.floor(height / transformY)) * sprite.scale;

    // Calculate where to start drawing the sprite on the Y Axis.
    let drawStartY = Math.floor(-spriteHeight / 2 + height / 2);
    if (drawStartY < 0) {
      drawStartY = 0;
    }

    // Calculate where to start drawing the sprite on the X Axis. Aka the column of the screen to start at.
    let drawStartX = Math.floor(-spriteHeight / 2 + spriteScreenX);
    if (drawStartX < 0) {
      drawStartX = 0;
    }

    // Calculate where to stop drawing the sprite on the X Axis. Aka the column of the screen to end at.
    let drawEndX = Math.floor(spriteHeight / 2 + spriteScreenX);
    if (drawEndX >= width) {
      drawEndX = width - 1;
    }

    // Calculate the X offset within the texture to start drawing from.
    let texX = 0;
    if (drawStartX < 0) {
      texX = -drawStartX;
    }

    // Then, for each column draw a vertical strip of the sprite.
    for (let column = drawStartX; column < drawEndX; column++) {
      // Only draw the sprite if..
      // - It's in front of camera.
      // - It's not off the left edge of the viewport.
      // - It's not off the right edge of the viewport.
      // - It's not too far away or hidden behind another solid that has already been rendered.
      if (transformY > 0 && column > 0 && column < width && transformY < zBuffer[column]) {
        // FIXME: This is supposed to make sure that when the texture is partially offscreen, we adjust the x offset for the texture acordingly.
        const texXOffset = Math.floor(((column - drawStartX) * texture.height) / spriteHeight);

        // If the object is animated, then calculate the offset for the frame within the texture.
        let texXAnimationOffset = 0;
        if (texture.width > texture.height) {
          const frame = getAnimationFrame();
          texXAnimationOffset = frame * texture.height;
        }

        // Make sure the sprite sits on the floor, rather than floating in the air.
        const drawStartYOffset = Math.floor(256 / transformY) - spriteHeight / 2;

        // The slice of the texture that we want to render to the framebuffer.
        const sourceRectangle: Rectangle = {
          x: texX + texXOffset + texXAnimationOffset,
          y: 0,
          width: 1,
          height: texture.height
        };

        // The location to render that texture to in the framebuffer.
        const destinationRectange: Rectangle = {
          x: column,
          y: drawStartY + drawStartYOffset,
          width: 1,
          height: spriteHeight
        };

        // Draw the sprite to the screen.
        drawTexture(context, texture, sourceRectangle, destinationRectange);
      }
    }
  }
}
