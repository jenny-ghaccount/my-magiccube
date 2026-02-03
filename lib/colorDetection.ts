'use client';

import { CUBE_COLORS, CubeColor, Face } from './cube';

/**
 * Cube color RGB values for matching
 */
const CUBE_COLOR_RGB: Record<CubeColor, [number, number, number]> = {
  W: [255, 255, 255],   // White
  Y: [255, 213, 0],     // Yellow  
  R: [183, 18, 52],     // Red
  O: [255, 88, 0],      // Orange
  G: [0, 155, 72],      // Green
  B: [0, 70, 173],      // Blue
};

/**
 * Convert RGB to HSL for better color matching
 */
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return [h * 360, s * 100, l * 100];
}

/**
 * Detect cube color from RGB using HSL color space
 */
export function detectCubeColor(r: number, g: number, b: number): CubeColor {
  const [h, s, l] = rgbToHsl(r, g, b);

  // White: low saturation, high lightness
  if (s < 20 && l > 70) return 'W';

  // Yellow: hue around 45-65, high saturation
  if (h >= 40 && h <= 70 && s > 50) return 'Y';

  // Orange: hue around 15-45
  if (h >= 10 && h <= 45 && s > 50) return 'O';

  // Red: hue around 0-15 or 345-360
  if ((h >= 0 && h <= 15) || h >= 340) return 'R';

  // Green: hue around 100-160
  if (h >= 80 && h <= 170 && s > 30) return 'G';

  // Blue: hue around 200-260
  if (h >= 180 && h <= 270 && s > 30) return 'B';

  // Fallback: use RGB distance
  return rgbToNearestColor(r, g, b);
}

/**
 * Fallback: RGB distance matching
 */
function rgbToNearestColor(r: number, g: number, b: number): CubeColor {
  let closest: CubeColor = 'W';
  let minDist = Infinity;

  for (const [color, [cr, cg, cb]] of Object.entries(CUBE_COLOR_RGB)) {
    const dist = Math.sqrt(
      Math.pow(r - cr, 2) + Math.pow(g - cg, 2) + Math.pow(b - cb, 2)
    );
    if (dist < minDist) {
      minDist = dist;
      closest = color as CubeColor;
    }
  }

  return closest;
}

/**
 * Sample average color from an image region
 */
export function sampleRegion(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
): { r: number; g: number; b: number } {
  // Sample from center region (avoid edges)
  const margin = Math.min(width, height) * 0.2;
  const sampleX = Math.round(x + margin);
  const sampleY = Math.round(y + margin);
  const sampleW = Math.round(width - margin * 2);
  const sampleH = Math.round(height - margin * 2);

  const imageData = ctx.getImageData(sampleX, sampleY, sampleW, sampleH);
  const data = imageData.data;

  let r = 0, g = 0, b = 0, count = 0;

  for (let i = 0; i < data.length; i += 4) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    count++;
  }

  return {
    r: Math.round(r / count),
    g: Math.round(g / count),
    b: Math.round(b / count),
  };
}

/**
 * Grid positions for sampling a face (3x3)
 * Returns relative positions (0-1) for each of the 9 stickers
 */
function getFaceGridPositions(): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      positions.push({
        x: (col + 0.5) / 3,
        y: (row + 0.5) / 3,
      });
    }
  }
  return positions;
}

/**
 * Detect colors from a face region in an image
 */
export function detectFaceColors(
  ctx: CanvasRenderingContext2D,
  faceRect: { x: number; y: number; width: number; height: number }
): CubeColor[] {
  const positions = getFaceGridPositions();
  const stickerW = faceRect.width / 3;
  const stickerH = faceRect.height / 3;

  return positions.map((pos) => {
    const x = faceRect.x + pos.x * faceRect.width - stickerW / 2;
    const y = faceRect.y + pos.y * faceRect.height - stickerH / 2;
    
    const { r, g, b } = sampleRegion(ctx, x, y, stickerW, stickerH);
    return detectCubeColor(r, g, b);
  });
}

/**
 * Auto-detect cube from image
 * Assumes cube is centered and fills most of the image
 * For corner photos, we detect 3 faces at specific regions
 */
export interface DetectedFaces {
  faces: Partial<Record<Face, CubeColor[]>>;
  confidence: number;
}

/**
 * Detect faces from Corner 1 photo (U + F + R visible)
 * Assumes specific layout based on typical corner photo
 */
export function detectCorner1(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): Partial<Record<Face, CubeColor[]>> {
  // For a corner photo showing U+F+R:
  // U (top) is in upper portion, slightly tilted
  // F (front-left) is in lower-left
  // R (front-right) is in lower-right
  
  const centerX = width / 2;
  const centerY = height / 2;
  const faceSize = Math.min(width, height) * 0.28;

  // Approximate positions for each face in a corner view
  const faces: Partial<Record<Face, CubeColor[]>> = {};

  // Top face (U) - upper center area
  faces.U = detectFaceColors(ctx, {
    x: centerX - faceSize * 0.9,
    y: height * 0.08,
    width: faceSize * 1.8,
    height: faceSize * 0.9,
  });

  // Front face (F) - lower left
  faces.F = detectFaceColors(ctx, {
    x: width * 0.1,
    y: height * 0.4,
    width: faceSize * 1.2,
    height: faceSize * 1.4,
  });

  // Right face (R) - lower right
  faces.R = detectFaceColors(ctx, {
    x: width * 0.52,
    y: height * 0.4,
    width: faceSize * 1.2,
    height: faceSize * 1.4,
  });

  return faces;
}

/**
 * Detect faces from Corner 2 photo (D + B + L visible)
 */
export function detectCorner2(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): Partial<Record<Face, CubeColor[]>> {
  const centerX = width / 2;
  const centerY = height / 2;
  const faceSize = Math.min(width, height) * 0.28;

  const faces: Partial<Record<Face, CubeColor[]>> = {};

  // Bottom face (D) - lower center area
  faces.D = detectFaceColors(ctx, {
    x: centerX - faceSize * 0.9,
    y: height * 0.55,
    width: faceSize * 1.8,
    height: faceSize * 0.9,
  });

  // Back face (B) - upper right
  faces.B = detectFaceColors(ctx, {
    x: width * 0.52,
    y: height * 0.1,
    width: faceSize * 1.2,
    height: faceSize * 1.4,
  });

  // Left face (L) - upper left
  faces.L = detectFaceColors(ctx, {
    x: width * 0.1,
    y: height * 0.1,
    width: faceSize * 1.2,
    height: faceSize * 1.4,
  });

  return faces;
}

/**
 * Load image and get canvas context
 */
export function loadImageToCanvas(
  imageUrl: string
): Promise<{ ctx: CanvasRenderingContext2D; width: number; height: number; canvas: HTMLCanvasElement }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const maxSize = 800; // Resize for performance
      
      let width = img.width;
      let height = img.height;
      
      if (width > maxSize || height > maxSize) {
        if (width > height) {
          height = (maxSize / width) * height;
          width = maxSize;
        } else {
          width = (maxSize / height) * width;
          height = maxSize;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      resolve({ ctx, width, height, canvas });
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageUrl;
  });
}

/**
 * Full auto-detection from two corner images
 */
export async function autoDetectCube(
  corner1Url: string,
  corner2Url: string
): Promise<Record<Face, CubeColor[]>> {
  const [img1, img2] = await Promise.all([
    loadImageToCanvas(corner1Url),
    loadImageToCanvas(corner2Url),
  ]);

  const corner1Faces = detectCorner1(img1.ctx, img1.width, img1.height);
  const corner2Faces = detectCorner2(img2.ctx, img2.width, img2.height);

  // Merge detected faces
  const result: Record<Face, CubeColor[]> = {
    U: corner1Faces.U || Array(9).fill('W'),
    R: corner1Faces.R || Array(9).fill('R'),
    F: corner1Faces.F || Array(9).fill('G'),
    D: corner2Faces.D || Array(9).fill('Y'),
    L: corner2Faces.L || Array(9).fill('O'),
    B: corner2Faces.B || Array(9).fill('B'),
  };

  // Set center stickers to standard colors (they never move)
  result.U[4] = 'W';
  result.D[4] = 'Y';
  result.F[4] = 'G';
  result.B[4] = 'B';
  result.R[4] = 'R';
  result.L[4] = 'O';

  return result;
}
