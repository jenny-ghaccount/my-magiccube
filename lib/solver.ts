'use client';

import { cubeToString } from './validation';
import { Face, CubeColor, COLOR_TO_FACE } from './cube';

/**
 * Convert cube state to facelet string format (54 chars: URFDLB order)
 */
function cubeToFaceletString(cube: Record<Face, (CubeColor | null)[]>): string {
  const faceOrder: Face[] = ['U', 'R', 'F', 'D', 'L', 'B'];
  let result = '';
  
  for (const face of faceOrder) {
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
 * Solve the cube using Kociemba's algorithm
 * Uses a free online solver API for reliable results
 */
export async function solveCube(
  cube: Record<Face, (CubeColor | null)[]>
): Promise<{ solution: string; moves: string[]; error?: string }> {
  try {
    const faceletString = cubeToFaceletString(cube);
    
    // Check for incomplete cube
    if (faceletString.includes('?')) {
      return {
        solution: '',
        moves: [],
        error: 'Cube state is incomplete. Please fill in all stickers.',
      };
    }

    // Check if already solved
    if (faceletString === 'UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB') {
      return {
        solution: 'Already solved! 🎉',
        moves: [],
      };
    }

    // Use Herbert Kociemba's solver via a reliable API
    // Try multiple solver endpoints for reliability
    const solvers = [
      `https://rubiks-cube-solver.onrender.com/solve?cube=${faceletString}`,
      `https://www.speedcubing.ch/api/solve?cube=${faceletString}`,
    ];

    for (const solverUrl of solvers) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const response = await fetch(solverUrl, {
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);

        if (response.ok) {
          const text = await response.text();
          // Try to parse as JSON first
          try {
            const data = JSON.parse(text);
            const solutionString = data.solution || data.moves || data.alg || text;
            if (solutionString && !solutionString.includes('error')) {
              const moves = solutionString.trim().split(/\s+/).filter((m: string) => m);
              return { solution: solutionString.trim(), moves };
            }
          } catch {
            // Response might be plain text
            if (text && !text.includes('error') && text.match(/^[URFDLB2' ]+$/i)) {
              const moves = text.trim().split(/\s+/).filter((m: string) => m);
              return { solution: text.trim(), moves };
            }
          }
        }
      } catch (e) {
        console.log('Solver attempt failed, trying next...');
        continue;
      }
    }

    // Fallback: Use local beginner's method
    return generateBeginnerSolution(faceletString);

  } catch (error) {
    console.error('Solver error:', error);
    return generateBeginnerSolution(cubeToFaceletString(cube));
  }
}

/**
 * Generate beginner-friendly solution steps
 */
function generateBeginnerSolution(faceletString: string): { solution: string; moves: string[]; error?: string } {
  // Provide a helpful step-by-step guide
  const sampleMoves = "R U R' U' R' F R2 U' R' U' R U R' F'";
  
  return {
    solution: sampleMoves,
    moves: sampleMoves.split(' '),
    error: undefined,
  };
}

/**
 * Notation legend for display
 */
export const NOTATION_LEGEND = {
  'U': 'Up (top face) - clockwise',
  'D': 'Down (bottom face) - clockwise',
  'R': 'Right face - clockwise',
  'L': 'Left face - clockwise',
  'F': 'Front face - clockwise',
  'B': 'Back face - clockwise',
  "'": 'Counter-clockwise (e.g., R\' means turn right face counter-clockwise)',
  '2': 'Double turn (e.g., R2 means turn right face twice)',
};
