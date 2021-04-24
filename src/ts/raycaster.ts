import { Point } from './interfaces/point';
import { Entity } from './interfaces/entity';
import { Level } from './interfaces/level';

import { degreesToRadians } from './utils/math.js';
import { canvasWidth, canvasHeight } from './config.js';

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

export function render(context: CanvasRenderingContext2D, entity: Entity, level: Level): void {
  // First we calculate the angle of the first, leftmost of the player, ray to cast.
  let rayAngle = entity.angle - halfFieldOfView;

  // We then iterate over and render each vertical scan line of the view port, incrementing the angle by ( FOV / width )
  for (let column = 0; column < columns; column++) {
    // The ray starts from the entities current cell.
    let mapX: number = Math.floor(entity.x);
    let mapY: number = Math.floor(entity.y);

    // The X and Y direction of the Ray
    const rayDirX = Math.sin(degreesToRadians(rayAngle));
    const rayDirY = Math.cos(degreesToRadians(rayAngle));

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
      sideDistX = (entity.x - mapX) * deltaDistX;
    } else {
      stepX = 1;
      sideDistX = (mapX + 1.0 - entity.x) * deltaDistX;
    }

    // Calculate the initial step for the Y axis
    if (rayDirY < 0) {
      stepY = -1;
      sideDistY = (entity.y - mapY) * deltaDistY;
    } else {
      stepY = 1;
      sideDistY = (mapY + 1.0 - entity.y) * deltaDistY;
    }

    // Tracks if the wall the ray hits was on the X or the Y axis.
    let side: number = 0;

    // Use DDA to step through each cell the ray hits to see if it is a wall or not.
    while (true) {
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
      if (level.data[mapX][mapY] > 0) break;
    }

    let distance: number;

    //Calculate distance projected on camera direction (Euclidean distance will give fisheye effect!)
    if (side == 0) {
      distance = (mapX - entity.x + (1 - stepX) / 2) / rayDirX;
    } else {
      distance = (mapY - entity.y + (1 - stepY) / 2) / rayDirY;
    }

    // Fish eye fix
    distance = distance * Math.cos(degreesToRadians(rayAngle - entity.angle));

    // Now work out how high the wall should be...
    const wallHeight = Math.floor(height / distance);

    // And now we can draw the scanline...
    const start: Point = { x: column, y: 0 };
    const wallStart: Point = { x: column, y: -wallHeight / 2 + halfHeight };
    const wallEnd: Point = { x: column, y: wallHeight / 2 + halfHeight };
    const end: Point = { x: column, y: height };

    // 1. Draw the Ceiling..
    drawLine(context, start, wallStart, 'black');

    // 2. Draw the Wall...
    drawLine(context, wallStart, wallEnd, 'red');

    // 3. Apply some shading based on distance from player...
    drawLine(context, wallStart, wallEnd, `rgba(0,0,0,${0.08 * distance})`);

    // 4. Draw the floor
    drawLine(context, wallEnd, end, 'gray');

    // Increment the angle ready to cast the next ray.
    rayAngle += increment;
  }
}
