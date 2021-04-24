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
const precision = 64; // The dimensions of each square in the grid.
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
    // The ray starts from the players current grid position.
    const ray: Point = { x: entity.x, y: entity.y };

    // These are the X and Y amounts that we need to add to check for hits against walls.
    const rayCos = Math.cos(degreesToRadians(rayAngle)) / precision;
    const raySin = Math.sin(degreesToRadians(rayAngle)) / precision;

    // We start from the assumption that we're not already in a wall!
    let wall = 0;

    // Then, whilst we haven't hit a wall
    while (wall == 0) {
      ray.x += rayCos;
      ray.y += raySin;
      wall = level.data[Math.floor(ray.y)][Math.floor(ray.x)];
    }

    // We should now have the coordinates of the wall, hence we can work out the distance the wall is from the player by
    // using Pythagoras's theorem.
    let distance = Math.sqrt(Math.pow(entity.x - ray.x, 2) + Math.pow(entity.y - ray.y, 2));

    // Fish eye fix
    distance = distance * Math.cos(degreesToRadians(rayAngle - entity.angle));

    // Now work out how high the wall should be...
    const wallHeight = Math.floor(halfHeight / distance);

    // And now we can draw the scanline...
    const start: Point = { x: column, y: 0 };
    const wallStart: Point = { x: column, y: halfHeight - wallHeight };
    const wallEnd: Point = { x: column, y: halfHeight + wallHeight };
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
