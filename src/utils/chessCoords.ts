import { Square } from 'chess.js';

export const TILE_SIZE = 1.1; // Comfortable spacing for chibi character bases
export const BOARD_ELEVATION = 0.4; // Height of stone square top surface

export function squareToCoords(square: Square): [number, number, number] {
  const file = square.charCodeAt(0) - 97; // 'a' -> 0, 'h' -> 7
  const rank = parseInt(square[1], 10) - 1; // '1' -> 0, '8' -> 7

  const x = (file - 3.5) * TILE_SIZE;
  const z = (3.5 - rank) * TILE_SIZE;
  const y = BOARD_ELEVATION;

  return [x, y, z];
}

export function coordsToSquare(x: number, z: number): Square | null {
  const file = Math.round(x / TILE_SIZE + 3.5);
  const rank = Math.round(3.5 - z / TILE_SIZE);

  if (file < 0 || file > 7 || rank < 0 || rank > 7) {
    return null;
  }

  const fileChar = String.fromCharCode(97 + file);
  const rankChar = String(rank + 1);
  return `${fileChar}${rankChar}` as Square;
}

export function isLightSquare(square: Square): boolean {
  const file = square.charCodeAt(0) - 97;
  const rank = parseInt(square[1], 10) - 1;
  return (file + rank) % 2 !== 0;
}
