import { CubeColor, COLOR_TO_FACE, Face, FACES, COLOR_NAMES } from './cube';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  colorCounts: Record<CubeColor, number>;
}

/**
 * Validate the cube state
 * - Each color must appear exactly 9 times
 * - All 54 stickers must be filled
 */
export function validateCube(
  cube: Record<Face, (CubeColor | null)[]>
): ValidationResult {
  const errors: string[] = [];
  const colorCounts: Record<CubeColor, number> = {
    W: 0,
    Y: 0,
    R: 0,
    O: 0,
    G: 0,
    B: 0,
  };

  // Count colors across all faces
  let nullCount = 0;
  for (const face of FACES) {
    for (const sticker of cube[face]) {
      if (sticker === null) {
        nullCount++;
      } else {
        colorCounts[sticker]++;
      }
    }
  }

  // Check for empty stickers
  if (nullCount > 0) {
    errors.push(`${nullCount} sticker${nullCount > 1 ? 's' : ''} not filled in yet.`);
  }

  // Check color counts
  const incorrectColors: string[] = [];
  for (const [color, count] of Object.entries(colorCounts)) {
    if (count !== 9) {
      incorrectColors.push(`${COLOR_NAMES[color as CubeColor]}: ${count}`);
    }
  }

  if (incorrectColors.length > 0) {
    errors.push(`Each color should appear exactly 9 times. Current counts: ${incorrectColors.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    colorCounts,
  };
}

/**
 * Convert cube state to the 54-character string format for the solver
 * Order: U (9) + R (9) + F (9) + D (9) + L (9) + B (9)
 */
export function cubeToString(cube: Record<Face, (CubeColor | null)[]>): string {
  let result = '';
  for (const face of FACES) {
    for (const sticker of cube[face]) {
      if (sticker === null) {
        result += '?';
      } else {
        result += COLOR_TO_FACE[sticker];
      }
    }
  }
  return result;
}

/**
 * Parse solution string into individual moves
 */
export function parseSolution(solution: string): string[] {
  if (!solution || solution.trim() === '') {
    return [];
  }
  return solution.trim().split(/\s+/);
}
