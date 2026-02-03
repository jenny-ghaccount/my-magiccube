'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { CUBE_COLORS, CubeColor, Face } from '@/lib/cube';
import { validateCube } from '@/lib/validation';
import { solveCube } from '@/lib/solver';
import VisualSolution from './VisualSolution';

type CubeState = Record<Face, CubeColor[]>;

// Face order for entry - standard cube notation
const FACE_ORDER: { face: Face; name: string; centerColor: CubeColor; instruction: string }[] = [
  { face: 'U', name: 'Top (White center)', centerColor: 'W', instruction: 'Hold cube with WHITE center facing UP' },
  { face: 'F', name: 'Front (Green center)', centerColor: 'G', instruction: 'GREEN center facing you' },
  { face: 'R', name: 'Right (Red center)', centerColor: 'R', instruction: 'RED center on your right' },
  { face: 'B', name: 'Back (Blue center)', centerColor: 'B', instruction: 'BLUE center facing away' },
  { face: 'L', name: 'Left (Orange center)', centerColor: 'O', instruction: 'ORANGE center on your left' },
  { face: 'D', name: 'Bottom (Yellow center)', centerColor: 'Y', instruction: 'YELLOW center facing DOWN' },
];

const COLOR_OPTIONS: { color: CubeColor; label: string }[] = [
  { color: 'W', label: 'White' },
  { color: 'Y', label: 'Yellow' },
  { color: 'R', label: 'Red' },
  { color: 'O', label: 'Orange' },
  { color: 'G', label: 'Green' },
  { color: 'B', label: 'Blue' },
];

// Create initial cube state with center colors fixed
function createInitialCube(): CubeState {
  return {
    U: ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'],
    D: ['Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y'],
    F: ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
    B: ['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
    R: ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'],
    L: ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
  };
}

export default function FaceByFaceEntry() {
  const [currentFaceIndex, setCurrentFaceIndex] = useState(0);
  const [cube, setCube] = useState<CubeState>(createInitialCube);
  const [selectedColor, setSelectedColor] = useState<CubeColor>('W');
  const [solution, setSolution] = useState<string | null>(null);
  const [isSolving, setIsSolving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showReview, setShowReview] = useState(false);

  const currentFace = FACE_ORDER[currentFaceIndex];

  const handleStickerClick = (index: number) => {
    if (index === 4) return; // Center is fixed
    
    setCube((prev) => {
      const newCube = { ...prev };
      newCube[currentFace.face] = [...prev[currentFace.face]];
      newCube[currentFace.face][index] = selectedColor;
      return newCube;
    });
  };

  const handleReviewStickerClick = (face: Face, index: number) => {
    if (index === 4) return;
    
    setCube((prev) => {
      const newCube = { ...prev };
      newCube[face] = [...prev[face]];
      // Cycle through colors
      const colors: CubeColor[] = ['W', 'Y', 'R', 'O', 'G', 'B'];
      const currentColor = newCube[face][index];
      const currentIdx = colors.indexOf(currentColor);
      newCube[face][index] = colors[(currentIdx + 1) % colors.length];
      return newCube;
    });
  };

  const handleNext = () => {
    if (currentFaceIndex < FACE_ORDER.length - 1) {
      setCurrentFaceIndex(currentFaceIndex + 1);
    } else {
      setShowReview(true);
    }
  };

  const handlePrev = () => {
    if (showReview) {
      setShowReview(false);
    } else if (currentFaceIndex > 0) {
      setCurrentFaceIndex(currentFaceIndex - 1);
    }
  };

  const handleSolve = async () => {
    const validation = validateCube(cube);
    if (!validation.isValid) {
      setError(validation.errors.join(' '));
      return;
    }

    setIsSolving(true);
    setError(null);

    try {
      const result = await solveCube(cube);
      if (result.error) {
        setError(result.error);
      } else {
        setSolution(result.solution);
      }
    } catch (err) {
      setError('Failed to solve. Please check your colors.');
    } finally {
      setIsSolving(false);
    }
  };

  const handleReset = () => {
    setCube(createInitialCube());
    setCurrentFaceIndex(0);
    setSolution(null);
    setShowReview(false);
    setError(null);
  };

  const validation = validateCube(cube);

  // Show solution
  if (solution) {
    return (
      <Paper sx={{ p: 3, borderRadius: 3, border: '3px solid #1a1a1a', maxWidth: 800, mx: 'auto' }}>
        <VisualSolution solution={solution} onReset={handleReset} />
      </Paper>
    );
  }

  // Review all faces
  if (showReview) {
    return (
      <Paper sx={{ p: 3, borderRadius: 3, border: '3px solid #1a1a1a', maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, textAlign: 'center' }}>
          ✅ Review Your Cube
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
          Tap any sticker to change its color. Centers are fixed.
        </Typography>

        {/* All faces in cross layout */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mb: 3 }}>
          <FaceDisplay 
            face="U" 
            colors={cube.U} 
            label="Top (U)" 
            onClick={(i) => handleReviewStickerClick('U', i)} 
          />
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
            <FaceDisplay face="L" colors={cube.L} label="Left (L)" onClick={(i) => handleReviewStickerClick('L', i)} />
            <FaceDisplay face="F" colors={cube.F} label="Front (F)" onClick={(i) => handleReviewStickerClick('F', i)} />
            <FaceDisplay face="R" colors={cube.R} label="Right (R)" onClick={(i) => handleReviewStickerClick('R', i)} />
            <FaceDisplay face="B" colors={cube.B} label="Back (B)" onClick={(i) => handleReviewStickerClick('B', i)} />
          </Box>
          
          <FaceDisplay 
            face="D" 
            colors={cube.D} 
            label="Bottom (D)" 
            onClick={(i) => handleReviewStickerClick('D', i)} 
          />
        </Box>

        {!validation.isValid && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {validation.errors.map((err, i) => (
              <Typography key={i} variant="body2">{err}</Typography>
            ))}
          </Alert>
        )}

        {validation.isValid && (
          <Alert severity="success" sx={{ mb: 2 }}>
            ✓ Colors are valid! Ready to solve.
          </Alert>
        )}

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={handlePrev} startIcon={<ArrowBackIcon />}>
            Back
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={handleSolve}
            disabled={!validation.isValid || isSolving}
            startIcon={<CheckCircleIcon />}
            sx={{ flex: 1 }}
          >
            {isSolving ? 'Solving...' : 'Solve My Cube!'}
          </Button>
        </Box>
      </Paper>
    );
  }

  // Face by face entry
  return (
    <Paper sx={{ p: 3, borderRadius: 3, border: '3px solid #1a1a1a', maxWidth: 500, mx: 'auto' }}>
      {/* Progress */}
      <Stepper activeStep={currentFaceIndex} alternativeLabel sx={{ mb: 3 }}>
        {FACE_ORDER.map((f, i) => (
          <Step key={f.face} completed={i < currentFaceIndex}>
            <StepLabel>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '4px',
                  backgroundColor: CUBE_COLORS[f.centerColor],
                  border: '2px solid #1a1a1a',
                  mx: 'auto',
                }}
              />
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Current face info */}
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, textAlign: 'center' }}>
        {currentFace.name}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
        📍 {currentFace.instruction}
      </Typography>

      {/* Color palette */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
        {COLOR_OPTIONS.map(({ color, label }) => (
          <Box
            key={color}
            onClick={() => setSelectedColor(color)}
            sx={{
              width: 44,
              height: 44,
              backgroundColor: CUBE_COLORS[color],
              borderRadius: 1,
              cursor: 'pointer',
              border: selectedColor === color ? '4px solid #1a1a1a' : '2px solid #666',
              boxShadow: selectedColor === color ? '0 0 0 2px #E3000B' : 'none',
              transition: 'all 0.15s',
              '&:hover': { transform: 'scale(1.1)' },
            }}
            title={label}
          />
        ))}
      </Box>

      {/* Face grid */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '6px',
            p: '10px',
            backgroundColor: '#1a1a1a',
            borderRadius: 2,
          }}
        >
          {cube[currentFace.face].map((color, index) => (
            <Box
              key={index}
              onClick={() => handleStickerClick(index)}
              sx={{
                width: 60,
                height: 60,
                backgroundColor: CUBE_COLORS[color],
                borderRadius: 1,
                cursor: index === 4 ? 'not-allowed' : 'pointer',
                border: '2px solid rgba(255,255,255,0.3)',
                opacity: index === 4 ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
                color: color === 'W' || color === 'Y' ? '#333' : '#fff',
                '&:hover': index !== 4 ? { 
                  transform: 'scale(1.05)',
                  boxShadow: '0 0 0 3px #E3000B',
                } : {},
                transition: 'all 0.15s',
              }}
            >
              {index === 4 && '●'}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Hint */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Tip:</strong> Select a color above, then tap stickers to paint them. 
          The center sticker (●) is already set.
        </Typography>
      </Alert>

      {/* Navigation */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={handlePrev}
          disabled={currentFaceIndex === 0}
          startIcon={<ArrowBackIcon />}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          endIcon={<ArrowForwardIcon />}
          sx={{ flex: 1 }}
        >
          {currentFaceIndex === FACE_ORDER.length - 1 ? 'Review All' : 'Next Face'}
        </Button>
      </Box>
    </Paper>
  );
}

// Mini face display for review
function FaceDisplay({
  face,
  colors,
  label,
  onClick,
}: {
  face: Face;
  colors: CubeColor[];
  label: string;
  onClick: (index: number) => void;
}) {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
        {label}
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '3px',
          p: '6px',
          backgroundColor: '#1a1a1a',
          borderRadius: 1,
        }}
      >
        {colors.map((color, index) => (
          <Box
            key={index}
            onClick={() => onClick(index)}
            sx={{
              width: 28,
              height: 28,
              backgroundColor: CUBE_COLORS[color],
              borderRadius: 0.5,
              cursor: index === 4 ? 'not-allowed' : 'pointer',
              opacity: index === 4 ? 0.8 : 1,
              border: '1px solid rgba(255,255,255,0.2)',
              '&:hover': index !== 4 ? { transform: 'scale(1.15)', zIndex: 1 } : {},
              transition: 'transform 0.1s',
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
