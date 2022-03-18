import { Colour } from './interfaces/colour';
import { Entity } from './interfaces/entity';
import { Sprite } from './interfaces/sprite';
import { Level } from './interfaces/level';
import { Rectangle } from './interfaces/rectangle';
import { CastResult } from './interfaces/raycaster';

import { Face } from './enums.js';
import { drawPixel, drawTexture } from './utils/drawing-utils.js';
import { getTexture, isSolid } from './utils/cell-utils.js';
import { getCell } from './utils/level-utils.js';
import { getAnimationFrame } from './utils/time-utils.js';
import { getTextureById, isTextureAnimated, isTextureStateful } from './utils/texture-utils.js';
import { isSpriteAlignedBottom, isSpriteAlignedTop, isSpriteStatic } from './utils/sprite-utils.js';
import { radiansToDegrees } from './utils/math-utils.js';
import { applyShade } from './utils/colour-utils.js';

// Derived from https://lodev.org/cgtutor/raycasting.html.
// Casts a ray from the specified point at the specified angle and returns the first Wall the ray impacts.
export function castRay(width: number, column: number, entity: Entity, level: Level, maxDepth: number = 50): CastResult | undefined {
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
      side = stepX < 0 ? Face.EAST : Face.WEST;
    } else {
      sideDistanceY += deltaDistanceY;
      mapY += stepY;
      side = stepY > 0 ? Face.NORTH : Face.SOUTH;
    }

    // Get the Cell that the ray has hit.
    const cell = getCell(level, mapX, mapY);

    // Check if the Cell is solid.
    if (cell !== undefined && isSolid(cell)) {
      // Calculate the distance from the ray's origin to the solid that was hit, and the specific point on the wall the ray hit.
      let distance = 0;
      let wall = 0;
      switch (side) {
        case Face.EAST:
        case Face.WEST:
          distance = Math.abs((mapX - entity.x + (1 - stepX) / 2) / rayDirectionX);
          wall = entity.y + ((mapX - entity.x + (1 - stepX) / 2) / rayDirectionX) * rayDirectionY;
          break;

        case Face.NORTH:
        case Face.SOUTH:
          distance = Math.abs((mapY - entity.y + (1 - stepY) / 2) / rayDirectionY);
          wall = entity.x + ((mapY - entity.y + (1 - stepY) / 2) / rayDirectionY) * rayDirectionX;
          break;
      }

      // TODO: Why is this essential?
      wall -= Math.floor(wall);

      return {
        x: mapX,
        y: mapY,
        cell,
        face: side,
        wall,
        distance: distance
      };
    }
  }
  return undefined;
}

// Function to render the specifed sprite, from the perspective of the specified entity, to the specified canvas.
export function renderSprite(frameBuffer: ImageData, entity: Entity, depthBuffer: number[], sprite: Sprite): void {
  // Get the texture for the sprite
  const texture = getTextureById(sprite.textureId);

  // Calculate the sprites position
  const spriteX = sprite.x - entity.x;
  const spriteY = sprite.y - entity.y;

  // Calculate some magic which I don't really understand myself, but it works.
  const invDet = 1.0 / (entity.cx * entity.dy - entity.dx * entity.cy);
  const transformX = invDet * (entity.dy * spriteX - entity.dx * spriteY);
  const transformY = invDet * (-entity.cy * spriteX + entity.cx * spriteY);

  // The X position of the sprite
  const spriteScreenX = Math.floor((frameBuffer.width / 2) * (1 + transformX / transformY));

  // Calculate the height of the sprite.
  const spriteHeight = Math.abs(Math.round(Math.floor(frameBuffer.height / transformY) * sprite.scale));

  // Calculate the width of the sprite.
  const spriteWidth = Math.abs(Math.round(Math.floor(frameBuffer.height / transformY) * sprite.scale));

  // Calculate where to start drawing the sprite on the Y Axis.
  let drawStartY = Math.floor(-spriteHeight / 2 + frameBuffer.height / 2);
  if (drawStartY < 0) {
    drawStartY = 0;
  }

  // Calculate where to stop drawing the sprite on the Y Axis.
  let drawEndY = Math.floor(spriteHeight / 2 + frameBuffer.height / 2);
  if (drawEndY >= frameBuffer.height) {
    drawEndY = frameBuffer.height;
  }

  // Calculate where to start drawing the sprite on the X Axis. Aka the column of the screen to start at.
  let drawStartX = Math.floor(-spriteHeight / 2 + spriteScreenX);
  if (drawStartX < 0) {
    drawStartX = 0;
  }

  // Calculate where to stop drawing the sprite on the X Axis. Aka the column of the screen to end at.
  let drawEndX = Math.floor(spriteHeight / 2 + spriteScreenX);
  if (drawEndX >= frameBuffer.width) {
    drawEndX = frameBuffer.width;
  }

  // Calculate the Y offset within the texture to start drawing from.
  const texStartYD = drawStartY * 256 - frameBuffer.height * 128 + spriteHeight * 128;
  const texStartY = Math.round((texStartYD * texture.height) / spriteHeight / 256);

  // Calculate the Y offset withing the texture to stop drawing from.
  const texEndYD = (drawEndY - 1) * 256 - frameBuffer.height * 128 + spriteHeight * 128;
  const texEndY = Math.round((texEndYD * texture.height) / spriteHeight / 256);

  // Calculate the vertical offset which enables vertical alignment of the sprite to the floor or ceiling.
  // FIXME: This isn't working correctly at other resolutions.
  let drawStartYOffset = 0;
  if (isSpriteAlignedTop(sprite)) {
    drawStartYOffset = -Math.floor(256 / transformY) + Math.round(spriteHeight / 2);
  } else if (isSpriteAlignedBottom(sprite)) {
    drawStartYOffset = Math.floor(256 / transformY) - Math.round(spriteHeight / 2);
  }

  // Then, for each column draw a vertical strip of the sprite.
  for (let column = drawStartX; column < drawEndX; column++) {
    // Only draw the sprite if..
    // - It's in front of camera.
    // - It's not off the left edge of the viewport.
    // - It's not off the right edge of the viewport.
    // - It's not too far away or hidden behind another solid that has already been rendered.
    if (transformY > 0 && column >= 0 && column < frameBuffer.width && transformY < depthBuffer[column]) {
      // Calculate the X offset within the texture to start drawing from.
      let texX = Math.floor((256 * (column - (-spriteWidth / 2 + spriteScreenX)) * texture.width) / spriteWidth / 256);

      // FIXME: This works around a rounding error that can occur above.
      if (texX < 0) {
        texX = 0;
      }

      // If the object is animated, then calculate the offset for the frame within the texture.
      let texXAnimationOffset = 0;
      if (isTextureAnimated(texture)) {
        const frame = getAnimationFrame();
        texXAnimationOffset = frame * texture.width;
      }

      // If the sprite is static, then calculate which frame to render
      if (isSpriteStatic(sprite)) {
        const radians = Math.atan2(sprite.y - entity.y, sprite.x - entity.x);

        // FIXME: Do I even need to convert this back to degrees?
        let degrees = radiansToDegrees(radians);

        // FIXME: This slightly offsets the sprite by 1/2 a frame in degrees, but could probably handle this by applying a rotation to the sprite.
        degrees += 360 / texture.frames / 2;
        if (degrees < 0) {
          degrees += 360;
        }
        if (degrees >= 360) {
          degrees -= 360;
        }

        // Calculate the specific frame to display
        const frame = Math.floor((texture.frames / 360) * degrees);
        texXAnimationOffset = frame * texture.width;
      }

      // The slice of the texture that we want to render to the framebuffer.
      const sourceRectangle: Rectangle = {
        x: texX + texXAnimationOffset,
        y: texStartY,
        width: 1,
        height: texEndY - texStartY
      };

      // The location to render that texture to in the framebuffer.
      const destinationRectange: Rectangle = {
        x: column,
        y: drawStartY + drawStartYOffset,
        width: 1,
        height: spriteHeight
      };

      // Draw the sprite to the screen.
      drawTexture(frameBuffer, texture, sourceRectangle, destinationRectange, sprite.distance as number);
    }
  }
}

// Function to render the specified level, from the perspective of the specified entity to the target canvas
export function render(frameBuffer: ImageData, entity: Entity, level: Level): void {
  const halfHeight = frameBuffer.height / 2;
  const depthBuffer = new Array(frameBuffer.width).fill(50);

  // Draw the Ceiling
  //if (level.ceiling === undefined) {
  //  drawGradient(context, { x: 0, y: 0 }, { x: width, y: halfHeight }, 'grey', 'black');
  //}

  // Draw the Floor

  // Calculate the X and Y positions for the leftmost ray, where x = 0, and the rightmost ray, where x = width.
  const rayDirX0 = entity.dx - entity.cx;
  const rayDirY0 = entity.dy - entity.cy;
  const rayDirX1 = entity.dx + entity.cx;
  const rayDirY1 = entity.dy + entity.cy;

  // For each row from the horizon to the bottom of the screen.
  for (let y = 1; y < halfHeight; y++) {
    // Calculate the distance from the camera to the floor for the current row.
    const rowDistance = halfHeight / y;

    // Calculate the real world step vector we have to add for each x (parallel to camera plane)
    // adding step by step avoids multiplications with a weight in the inner loop
    const floorStepX = (rowDistance * (rayDirX1 - rayDirX0)) / frameBuffer.width;
    const floorStepY = (rowDistance * (rayDirY1 - rayDirY0)) / frameBuffer.width;

    // Calculate the X and Y coordinates of the leftmost column.
    let floorX = entity.x + rowDistance * rayDirX0;
    let floorY = entity.y + rowDistance * rayDirY0;

    // For each pixel in the row.
    for (let x = 0; x < frameBuffer.width; x++) {
      // Calculate the X and Y coordinates of the specific cell.
      const cellX = Math.floor(floorX);
      const cellY = Math.floor(floorY);

      // Get the specific floor texture for the target cell.
      let texture;
      const cell = getCell(level, cellX, cellY);
      if (cell !== undefined) {
        texture = getTexture(cell, Face.BOTTOM);
      } else {
        // If the cell is undefined, then it's outside of the range of the map hence fallback to the level's floor textureId if present.
        if (level.floor !== undefined) {
          texture = getTextureById(level.floor);
        } else {
          floorX += floorStepX;
          floorY += floorStepY;
          continue;
        }
      }

      // Calculate the specific X and Y pixel of the texture coordinate for this pixel.
      const tx = Math.floor(texture.width * (floorX - cellX)) & (texture.width - 1);
      const ty = Math.floor(texture.height * (floorY - cellY)) & (texture.height - 1);

      // Increment the X and Y coordinates ready for the next pixel.
      floorX += floorStepX;
      floorY += floorStepY;

      // If the texture is animated, then calculate the offset for the frame within the texture.
      let texXAnimationOffset = 0;
      if (isTextureAnimated(texture)) {
        const frame = getAnimationFrame();
        texXAnimationOffset = frame * texture.width;
      }

      // Get the RGBA values for the specified pixel directly from the textures data buffer.
      const sourceOffset = 4 * (texXAnimationOffset + tx + ty * texture.imageWidth);
      const buffer = texture.buffer as Uint8ClampedArray;
      let pixel: Colour = {
        red: buffer[sourceOffset],
        green: buffer[sourceOffset + 1],
        blue: buffer[sourceOffset + 2],
        alpha: buffer[sourceOffset + 3]
      };

      pixel = applyShade(pixel, rowDistance);

      drawPixel(frameBuffer, Math.floor(x), Math.floor(y + halfHeight), pixel);
    }
  }

  // Draw the Walls
  for (let column = 0; column < frameBuffer.width; column++) {
    // Get the first solid cell this ray hits.
    const result = castRay(frameBuffer.width, column, entity, level);

    // FIXME: Should draw something when no solid is found within the maximum range.
    if (result !== undefined) {
      // Stick the distance into the Depth Buffer
      depthBuffer[column] = result.distance;

      // Calculate the height the wall should be rendered at from the distance from the entity.
      const wallHeight = Math.abs(Math.floor(frameBuffer.height / result.distance));

      // Calculate the position on the Y axis of the viewport to start drawing the wall from.
      // FIXME: When support for Ceiling Casting is added, this extra + 1 might be the cause of a slight offset issue.
      const wallY = -wallHeight / 2 + frameBuffer.height / 2 + 1;

      // Get the texture for the solid cell.
      const texture = getTexture(result.cell, result.face);

      // Calculate the X offset in the Texture for the slice that needs to be rendered.
      let wallX = Math.floor(result.wall * texture.width);

      // If the texture is animated, then calculate the X offset for the frame within the texture.
      let textureAnimationOffset = 0;
      if (isTextureAnimated(texture)) {
        const frame = getAnimationFrame();
        textureAnimationOffset = frame * texture.width;
      }

      // If the texture is stateful, then calculate the Y offset for the frame within the texture.
      let textureStateOffset = 0;
      if (isTextureStateful(texture)) {
        textureStateOffset = (result.cell.state % texture.states) * texture.height;
      }

      // If the face of the wall is North or East then need to invert the X offset.
      if (result.face === Face.NORTH || result.face === Face.EAST) {
        wallX = texture.width - wallX - 1;
      }

      // The slice of the texture that we want to render to the framebuffer.
      const sourceRectangle: Rectangle = {
        x: textureAnimationOffset + wallX,
        y: textureStateOffset,
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
      drawTexture(frameBuffer, texture, sourceRectangle, destinationRectange, result.distance);
    }
  }

  // Prepare the sprites...
  const sprites: Sprite[] = [...level.sprites];
  for (const sprite of sprites) {
    sprite.distance = Math.sqrt((entity.x - sprite.x) * (entity.x - sprite.x) + (entity.y - sprite.y) * (entity.y - sprite.y));
  }

  // Sort sprites from far to close
  sprites.sort((a, b) => {
    return (b.distance ?? 0) - (a.distance ?? 0);
  });

  //after sorting the sprites, do the projection and draw them
  for (let i = 0; i < sprites.length; i++) {
    // For ease...
    const sprite = sprites[i];

    // Don't bother on non-active sprites.
    if (sprite.active === false) {
      continue;
    }

    renderSprite(frameBuffer, entity, depthBuffer, sprite);
  }
}
