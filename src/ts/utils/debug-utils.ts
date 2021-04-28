import { CastResult } from '../interfaces/raycaster';

import { Face } from '../enums.js';

// Function to dump a CastResult to the console
export function dumpCastResult(result: CastResult): void {
  let face = '';
  switch (result.side) {
    case Face.NORTH:
      face = 'North';
      break;
    case Face.SOUTH:
      face = 'South';
      break;
    case Face.EAST:
      face = 'East';
      break;
    case Face.WEST:
      face = 'West';
      break;
  }

  console.log(`CastResult:`);
  console.log(`- Cell = (${result.x}, ${result.y})`);
  console.log(`- Face = ${face}`);
  console.log(`- Distance = ${result.distance}`);
}
