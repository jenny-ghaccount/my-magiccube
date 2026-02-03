'use client';

import { useState } from 'react';
import { Box, Typography, Paper, Button, LinearProgress } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface VisualSolutionProps {
  solution: string;
  onReset: () => void;
}

// Face info with user-friendly names and colors
const FACE_INFO: Record<string, { name: string; color: string; bgColor: string; position: string }> = {
  R: { name: 'RIGHT', color: '#fff', bgColor: '#B71234', position: 'The side on your RIGHT' },
  L: { name: 'LEFT', color: '#fff', bgColor: '#FF5800', position: 'The side on your LEFT' },
  U: { name: 'TOP', color: '#333', bgColor: '#FFFFFF', position: 'The side facing UP' },
  D: { name: 'BOTTOM', color: '#333', bgColor: '#FFD500', position: 'The side facing DOWN' },
  F: { name: 'FRONT', color: '#fff', bgColor: '#009B48', position: 'The side facing YOU' },
  B: { name: 'BACK', color: '#fff', bgColor: '#0046AD', position: 'The side facing AWAY from you' },
};

interface ParsedMove {
  face: string;
  direction: 'clockwise' | 'counterclockwise' | 'twice';
  notation: string;
}

function parseMoves(solution: string): ParsedMove[] {
  if (!solution || solution.includes('Already solved')) return [];
  
  const moveStrings = solution.trim().split(/\s+/).filter(m => m);
  
  return moveStrings.map(notation => {
    const face = notation[0].toUpperCase();
    let direction: 'clockwise' | 'counterclockwise' | 'twice' = 'clockwise';
    
    if (notation.includes("'") || notation.includes("'") || notation.includes("`")) {
      direction = 'counterclockwise';
    } else if (notation.includes('2')) {
      direction = 'twice';
    }
    
    return { face, direction, notation };
  });
}

function getDirectionText(direction: 'clockwise' | 'counterclockwise' | 'twice'): string {
  switch (direction) {
    case 'clockwise': return 'CLOCKWISE';
    case 'counterclockwise': return 'COUNTER-CLOCKWISE';
    case 'twice': return 'TWICE (180°)';
  }
}

function getDirectionEmoji(direction: 'clockwise' | 'counterclockwise' | 'twice'): string {
  switch (direction) {
    case 'clockwise': return '↻';
    case 'counterclockwise': return '↺';
    case 'twice': return '🔄';
  }
}

// Mini 3D-ish cube diagram showing which face to turn
function CubeDiagram({ face, direction }: { face: string; direction: 'clockwise' | 'counterclockwise' | 'twice' }) {
  const highlightFace = face.toUpperCase();
  
  // Colors for each face (dimmed unless highlighted)
  const getColor = (f: string) => {
    const isHighlighted = f === highlightFace;
    const baseColors: Record<string, string> = {
      U: '#FFFFFF',
      F: '#009B48', 
      R: '#B71234',
      L: '#FF5800',
      B: '#0046AD',
      D: '#FFD500',
    };
    return isHighlighted ? baseColors[f] : '#e0e0e0';
  };

  return (
    <Box sx={{ position: 'relative', width: 140, height: 140, mx: 'auto', my: 2 }}>
      {/* Isometric cube representation */}
      <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
        {/* Top face (U) */}
        <polygon
          points="50,15 85,32 50,50 15,32"
          fill={getColor('U')}
          stroke="#333"
          strokeWidth="2"
        />
        {/* Front face (F) */}
        <polygon
          points="15,32 50,50 50,85 15,67"
          fill={getColor('F')}
          stroke="#333"
          strokeWidth="2"
        />
        {/* Right face (R) */}
        <polygon
          points="50,50 85,32 85,67 50,85"
          fill={getColor('R')}
          stroke="#333"
          strokeWidth="2"
        />
        
        {/* Highlight arrow for the face being turned */}
        {highlightFace === 'U' && (
          <text x="50" y="38" textAnchor="middle" fontSize="14" fill="#333">
            {getDirectionEmoji(direction)}
          </text>
        )}
        {highlightFace === 'F' && (
          <text x="32" y="62" textAnchor="middle" fontSize="14" fill="#fff">
            {getDirectionEmoji(direction)}
          </text>
        )}
        {highlightFace === 'R' && (
          <text x="68" y="62" textAnchor="middle" fontSize="14" fill="#fff">
            {getDirectionEmoji(direction)}
          </text>
        )}
        {highlightFace === 'L' && (
          <>
            <polygon points="5,25 5,60 12,65 12,30" fill={getColor('L')} stroke="#333" strokeWidth="1" />
            <text x="8" y="48" textAnchor="middle" fontSize="8" fill="#fff">{getDirectionEmoji(direction)}</text>
          </>
        )}
        {highlightFace === 'B' && (
          <>
            <polygon points="88,25 95,22 95,57 88,60" fill={getColor('B')} stroke="#333" strokeWidth="1" />
            <text x="92" y="43" textAnchor="middle" fontSize="8" fill="#fff">{getDirectionEmoji(direction)}</text>
          </>
        )}
        {highlightFace === 'D' && (
          <>
            <polygon points="15,72 50,90 85,72 50,55" fill={getColor('D')} stroke="#333" strokeWidth="1" opacity="0.7" />
            <text x="50" y="78" textAnchor="middle" fontSize="10" fill="#333">{getDirectionEmoji(direction)}</text>
          </>
        )}
      </svg>
    </Box>
  );
}

export default function VisualSolution({ solution, onReset }: VisualSolutionProps) {
  const moves = parseMoves(solution);
  const [currentStep, setCurrentStep] = useState(0);

  if (moves.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
          🎉 Your cube is already solved!
        </Typography>
        <Button variant="contained" onClick={onReset} size="large">
          Solve Another Cube
        </Button>
      </Box>
    );
  }

  const currentMove = moves[currentStep];
  const faceInfo = FACE_INFO[currentMove.face] || FACE_INFO.F;
  const progress = ((currentStep + 1) / moves.length) * 100;
  const isLastStep = currentStep === moves.length - 1;

  return (
    <Box>
      {/* Header */}
      <Typography variant="h5" sx={{ fontWeight: 800, textAlign: 'center', mb: 1 }}>
        🧩 Follow These Steps
      </Typography>
      
      {/* Progress */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Step {currentStep + 1} of {moves.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {Math.round(progress)}% complete
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ height: 10, borderRadius: 5 }}
        />
      </Box>

      {/* Main instruction card */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          backgroundColor: faceInfo.bgColor,
          color: faceInfo.color,
          borderRadius: 3,
          border: '4px solid #1a1a1a',
        }}
      >
        {/* Step number badge */}
        <Box
          sx={{
            display: 'inline-block',
            backgroundColor: 'rgba(0,0,0,0.3)',
            color: '#fff',
            px: 2,
            py: 0.5,
            borderRadius: 2,
            mb: 2,
            fontWeight: 800,
          }}
        >
          STEP {currentStep + 1}
        </Box>

        {/* Main instruction */}
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Turn the {faceInfo.name} side
        </Typography>
        
        <Typography variant="h5" sx={{ mb: 2, opacity: 0.9 }}>
          {getDirectionEmoji(currentMove.direction)} {getDirectionText(currentMove.direction)}
        </Typography>

        {/* Position hint */}
        <Paper sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            📍 {faceInfo.position}
          </Typography>
        </Paper>
      </Paper>

      {/* Visual cube diagram */}
      <Paper sx={{ p: 2, mb: 3, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
        <Typography variant="subtitle2" sx={{ textAlign: 'center', mb: 1, color: 'text.secondary' }}>
          Which side to turn:
        </Typography>
        <CubeDiagram face={currentMove.face} direction={currentMove.direction} />
        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: 'text.secondary' }}>
          The colored face is the one you need to turn
        </Typography>
      </Paper>

      {/* Direction explanation */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2, border: '2px solid #e0e0e0' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
          💡 How to turn:
        </Typography>
        {currentMove.direction === 'clockwise' && (
          <Typography variant="body2">
            Hold the cube steady and turn the <strong>{faceInfo.name}</strong> side 
            <strong> clockwise</strong> (like turning a doorknob to the right) — one quarter turn (90°).
          </Typography>
        )}
        {currentMove.direction === 'counterclockwise' && (
          <Typography variant="body2">
            Hold the cube steady and turn the <strong>{faceInfo.name}</strong> side 
            <strong> counter-clockwise</strong> (like turning a doorknob to the left) — one quarter turn (90°).
          </Typography>
        )}
        {currentMove.direction === 'twice' && (
          <Typography variant="body2">
            Hold the cube steady and turn the <strong>{faceInfo.name}</strong> side 
            <strong> twice</strong> — two quarter turns, or one half turn (180°). Direction doesn't matter!
          </Typography>
        )}
      </Paper>

      {/* Navigation */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button
          variant="outlined"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          startIcon={<ArrowBackIcon />}
          sx={{ flex: 1 }}
        >
          Previous
        </Button>
        
        {isLastStep ? (
          <Button
            variant="contained"
            color="success"
            onClick={onReset}
            startIcon={<CheckCircleIcon />}
            sx={{ flex: 2 }}
          >
            🎉 Done! Solve Another
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={() => setCurrentStep(Math.min(moves.length - 1, currentStep + 1))}
            endIcon={<ArrowForwardIcon />}
            sx={{ flex: 2 }}
          >
            Next Step
          </Button>
        )}
      </Box>

      {/* Quick jump */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
          Jump to step:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
          {moves.map((move, idx) => (
            <Box
              key={idx}
              onClick={() => setCurrentStep(idx)}
              sx={{
                width: 28,
                height: 28,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: idx === currentStep 
                  ? FACE_INFO[move.face]?.bgColor || '#666'
                  : idx < currentStep ? '#4caf50' : '#e0e0e0',
                color: idx === currentStep 
                  ? FACE_INFO[move.face]?.color || '#fff'
                  : idx < currentStep ? '#fff' : '#666',
                border: idx === currentStep ? '2px solid #1a1a1a' : 'none',
                '&:hover': { transform: 'scale(1.1)' },
                transition: 'all 0.15s',
              }}
            >
              {idx + 1}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Legend */}
      <Paper sx={{ p: 2, mt: 3, backgroundColor: '#fafafa', borderRadius: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
          📖 Quick Reference - Cube Sides:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {Object.entries(FACE_INFO).map(([key, info]) => (
            <Box
              key={key}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                backgroundColor: info.bgColor,
                color: info.color,
                fontSize: '12px',
                fontWeight: 600,
                border: '2px solid #333',
              }}
            >
              {info.name}
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
}
