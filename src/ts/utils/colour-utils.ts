import { Colour } from '../interfaces/colour';

export function applyShade(colour: Colour, distance: number): Colour {
  if (distance < 2) {
    return colour;
  } else {
    const amount = 1 - (distance - 2) * 0.08;
    return {
      red: Math.floor(colour.red * amount),
      green: Math.floor(colour.green * amount),
      blue: Math.floor(colour.blue * amount),
      alpha: colour.alpha
    };
  }
}

export function alphaBlend(source: Colour, destination: Colour): Colour {
  return {
    red: source.red + (destination.red - source.red) * (source.alpha / 255),
    green: source.green + (destination.green - source.green) * (source.alpha / 255),
    blue: source.blue + (destination.blue - source.blue) * (source.alpha / 255),
    alpha: 255
  };
}

export function sourceOver(source: Colour, destination: Colour): Colour {
  return {
    red: source.red - destination.red * (source.alpha - 1),
    green: source.green - destination.green * (source.alpha - 1),
    blue: source.blue - destination.blue * (source.alpha - 1),
    alpha: source.alpha - destination.alpha * (source.alpha - 1)
  };
}

export function sourceAtop(source: Colour, destination: Colour): Colour {
  return {
    red: destination.red * source.alpha - source.red * (destination.alpha - 1),
    green: destination.green * source.alpha - source.green * (destination.alpha - 1),
    blue: destination.blue * source.alpha - source.blue * (destination.alpha - 1),
    alpha: source.alpha
  };
}
