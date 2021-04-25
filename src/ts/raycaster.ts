import { Point } from './interfaces/point';
import { Entity } from './interfaces/entity';
import { Level } from './interfaces/level';
import { Texture } from './interfaces/texture';
import { CastResult } from './interfaces/raycaster';

import { degreesToRadians } from './utils/math-utils.js';
import { canvasWidth, canvasHeight } from './config.js';
import { isSolid } from './utils/cell-utils.js';
import { getCell, getTextureForCell } from './utils/level-utils.js';

const width = canvasWidth; // The width, in pixels, of the screen.
const height = canvasHeight; // The height, in pixels, of the screen.
const halfHeight = height / 2; // Half the height of the screen, in pixels.
const columns = width; // The number of columns in the viewport, or basically the number or Rays to cast.
const fieldOfView = 60; // The field of view, in degrees, of the camera.
const halfFieldOfView = fieldOfView / 2; // Half the field of view.
const increment = fieldOfView / columns; // The step to add for each ray cast.

// Draw a line of the specified colour on the target canvas.
function drawLine(context: CanvasRenderingContext2D, start: Point, end: Point, colour: string): void {
  context.strokeStyle = colour;
  context.beginPath();
  context.moveTo(start.x, start.y);
  context.lineTo(end.x, end.y);
  context.stroke();
}

// Function that renders a texture using the drawImage function.
function drawTexture(context: CanvasRenderingContext2D, start: Point, end: Point, texturePositionX: number, texture: Texture): void {
  context.drawImage(texture.canvas, texturePositionX, 0, 1, texture.height, start.x, start.y, 1, end.y - start.y);
}

// Renders the specified texture as a parallax skybox.
function drawSkybox(context: CanvasRenderingContext2D, start: Point, end: Point, texturePositionX: number, texture: Texture): void {
  const wallHeight = end.y - start.y;
  context.drawImage(texture.canvas, texturePositionX, 0, 1, (wallHeight / height) * texture.height, start.x, start.y, 1, wallHeight);
}

// Casts a ray from the specified point at the specified angle and returns the first Wall the ray impacts
export function castRay(point: Point, angle: number, level: Level, max: number = 50): CastResult | undefined {
  // The ray starts from the entities current cell.
  let mapX: number = Math.floor(point.x);
  let mapY: number = Math.floor(point.y);

  // The X and Y direction of the Ray
  const rayDirX = Math.sin(degreesToRadians(angle));
  const rayDirY = Math.cos(degreesToRadians(angle));

  // The distance from the ray's starting position to the first wall on both the x and y directions.
  let sideDistX: number;
  let sideDistY: number;

  // The distance from the first wall, to the next wall in both the x and y directions
  const deltaDistX = Math.abs(1 / rayDirX);
  const deltaDistY = Math.abs(1 / rayDirY);

  // What direction to increment next
  let stepX: number;
  let stepY: number;

  // Calculate the initial step for the X axis
  if (rayDirX < 0) {
    stepX = -1;
    sideDistX = (point.x - mapX) * deltaDistX;
  } else {
    stepX = 1;
    sideDistX = (mapX + 1.0 - point.x) * deltaDistX;
  }

  // Calculate the initial step for the Y axis
  if (rayDirY < 0) {
    stepY = -1;
    sideDistY = (point.y - mapY) * deltaDistY;
  } else {
    stepY = 1;
    sideDistY = (mapY + 1.0 - point.y) * deltaDistY;
  }

  // Tracks if the wall the ray hits was on the X or the Y axis.
  let side: number = 0;

  // Use DDA to step through each cell the ray hits to see if it is a wall or not.
  let step = 0;
  while (step++ < max) {
    // Find the next cell in either X or Y direction.
    if (sideDistX < sideDistY) {
      sideDistX += deltaDistX;
      mapX += stepX;
      side = 0;
    } else {
      sideDistY += deltaDistY;
      mapY += stepY;
      side = 1;
    }

    // Check if the cell is a wall or not.
    const cell = getCell(level, mapX, mapY);
    if (isSolid(cell)) {
      const retVal: CastResult = {
        x: mapX,
        y: mapY,
        cell,
        side,
        distance: 0,
        wall: 0
      };

      // Calculate the distance from the start to the point of impact
      if (side === 0) {
        retVal.distance = (mapX - point.x + (1 - stepX) / 2) / rayDirX;
      } else {
        retVal.distance = (mapY - point.y + (1 - stepY) / 2) / rayDirY;
      }

      // Calculate the specific coordinate on the wall where the ray hit
      retVal.wall = side === 0 ? point.y + retVal.distance * rayDirY : point.x + retVal.distance * rayDirX;
      retVal.wall -= Math.floor(retVal.wall);

      return retVal;
    }
  }

  return undefined;
}

export function render(context: CanvasRenderingContext2D, entity: Entity, level: Level): void {
  // First we calculate the angle of the first, leftmost of the player, ray to cast.
  let rayAngle = entity.angle - halfFieldOfView;
  const start: Point = {
    x: entity.x,
    y: entity.y
  };

  const zBuffer = new Array(columns);

  // We then iterate over and render each vertical scan line of the view port, incrementing the angle by ( FOV / width )
  for (let column = 0; column < columns; column++) {
    const result = castRay(start, rayAngle, level);

    if (result !== undefined) {
      // Store the distance, before we correct it, as it is used for sprite rendering later.
      zBuffer[column] = result.distance;

      // Fish eye fix
      result.distance = result.distance * Math.cos(degreesToRadians(rayAngle - entity.angle));

      // Now work out how high the wall should be...
      const wallHeight = Math.floor(height / result.distance);

      // Get the ID of the Texture for the wall
      const texture = getTextureForCell(level, result.cell);

      const rayDirX = Math.sin(degreesToRadians(rayAngle));
      const rayDirY = Math.cos(degreesToRadians(rayAngle));

      // Calculate the X coordinate of the texture to use
      let texX = Math.floor(result.wall * texture.width);

      // Calculate if the texture needs to be rendered flipped.
      if ((result.side === 0 && rayDirX > 0) || (result.side === 1 && rayDirY < 0)) {
        texX = texture.width - texX - 1;
      }

      // And now we can draw the scanline...
      const start: Point = { x: column, y: 0 };
      const wallStart: Point = { x: column, y: -wallHeight / 2 + halfHeight };
      const wallEnd: Point = { x: column, y: wallHeight / 2 + halfHeight };
      const end: Point = { x: column, y: height };

      // 1. Draw the Ceiling..
      if (wallStart.y > 0) {
        if (level.skybox) {
          drawSkybox(context, start, wallStart, Math.abs(rayAngle % 360), level.textures[level.textures.length - 1]);
        } else {
          drawLine(context, start, wallStart, 'black');
        }
      }

      // 2. Draw the Wall...
      drawTexture(context, wallStart, wallEnd, texX, texture);

      // 3. Apply some shading based on distance from player...
      drawLine(context, wallStart, wallEnd, `rgba(0,0,0,${0.08 * result.distance})`);

      // 4. Draw the floor
      if (wallEnd.y < end.y) {
        drawLine(context, wallEnd, end, 'gray');
      }
    }
    // Increment the angle ready to cast the next ray.
    rayAngle += increment;
  }
}
