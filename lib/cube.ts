// Cube sticker colors - matching real Rubik's cube
export const CUBE_COLORS = {
  W: '#FFFFFF',  // White
  Y: '#FFD500',  // Yellow
  R: '#B71234',  // Red
  O: '#FF5800',  // Orange
  G: '#009B48',  // Green
  B: '#0046AD',  // Blue
} as const;

export type CubeColor = keyof typeof CUBE_COLORS;

// Face labels
export const FACES = ['U', 'R', 'F', 'D', 'L', 'B'] as const;
export type Face = typeof FACES[number];

// Color to Face mapping for the solver
// W → U (white top), Y → D (yellow bottom), etc.
export const COLOR_TO_FACE: Record<CubeColor, Face> = {
  W: 'U',
  Y: 'D',
  R: 'R',
  O: 'L',
  G: 'F',
  B: 'B',
};

// Face to Color mapping (reverse)
export const FACE_TO_COLOR: Record<Face, CubeColor> = {
  U: 'W',
  D: 'Y',
  R: 'R',
  L: 'O',
  F: 'G',
  B: 'B',
};

// Color names for UI
export const COLOR_NAMES: Record<CubeColor, string> = {
  W: 'White',
  Y: 'Yellow',
  R: 'Red',
  O: 'Orange',
  G: 'Green',
  B: 'Blue',
};

// Initial solved cube state (each face has 9 stickers of same color)
export const createSolvedCube = (): Record<Face, CubeColor[]> => ({
  U: Array(9).fill('W'),
  R: Array(9).fill('R'),
  F: Array(9).fill('G'),
  D: Array(9).fill('Y'),
  L: Array(9).fill('O'),
  B: Array(9).fill('B'),
});

// Create empty cube (all stickers undefined/null)
export const createEmptyCube = (): Record<Face, (CubeColor | null)[]> => ({
  U: Array(9).fill(null),
  R: Array(9).fill(null),
  F: Array(9).fill(null),
  D: Array(9).fill(null),
  L: Array(9).fill(null),
  B: Array(9).fill(null),
});

// Create cube with center stickers set (as they don't move)
export const createCubeWithCenters = (): Record<Face, (CubeColor | null)[]> => ({
  U: [null, null, null, null, 'W', null, null, null, null],
  R: [null, null, null, null, 'R', null, null, null, null],
  F: [null, null, null, null, 'G', null, null, null, null],
  D: [null, null, null, null, 'Y', null, null, null, null],
  L: [null, null, null, null, 'O', null, null, null, null],
  B: [null, null, null, null, 'B', null, null, null, null],
});
