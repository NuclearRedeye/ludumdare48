import { Entity } from '../interfaces/entity';

export function checkEntityCollision(a: Entity, b: Entity): boolean {
  let retVal = false;
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < a.radius + b.radius) {
    retVal = true;
  }
  return retVal;
}
