'use client';

import { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Grid,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RefreshIcon from '@mui/icons-material/Refresh';
import { CUBE_COLORS, CubeColor, Face, FACES } from '@/lib/cube';
import { autoDetectCube } from '@/lib/colorDetection';
import { validateCube } from '@/lib/validation';
import { solveCube } from '@/lib/solver';
import VisualSolution from './VisualSolution';

type CubeState = Record<Face, CubeColor[]>;

const steps = ['Upload Photos', 'Review Colors', 'Follow Solution'];

export default function AutoCubeSolver() {
  const [currentStep, setCurrentStep] = useState(0);
  const [photos, setPhotos] = useState<{ corner1: string | null; corner2: string | null }>({
    corner1: null,
    corner2: null,
  });
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedCube, setDetectedCube] = useState<CubeState | null>(null);
  const [solution, setSolution] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSolving, setIsSolving] = useState(false);

  const fileInputRefs = {
    corner1: useRef<HTMLInputElement>(null),
    corner2: useRef<HTMLInputElement>(null),
  };

  const handleFileSelect = (corner: 'corner1' | 'corner2') => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotos((prev) => ({ ...prev, [corner]: url }));
      setError(null);
    }
  };

  const handleClearPhoto = (corner: 'corner1' | 'corner2') => {
    if (photos[corner]) {
      URL.revokeObjectURL(photos[corner]!);
    }
    setPhotos((prev) => ({ ...prev, [corner]: null }));
    setDetectedCube(null);
  };

  const handleAutoDetect = async () => {
    if (!photos.corner1 || !photos.corner2) {
      setError('Please upload both corner photos first');
      return;
    }

    setIsDetecting(true);
    setError(null);

    try {
      const detected = await autoDetectCube(photos.corner1, photos.corner2);
      setDetectedCube(detected);
      setCurrentStep(1);
    } catch (err) {
      setError('Could not detect colors. Please try with clearer photos.');
      console.error(err);
    } finally {
      setIsDetecting(false);
    }
  };

  const handleStickerClick = (face: Face, index: number) => {
    if (!detectedCube || index === 4) return; // Can't change center

    // Cycle through colors
    const colors: CubeColor[] = ['W', 'Y', 'R', 'O', 'G', 'B'];
    const currentColor = detectedCube[face][index];
    const currentIndex = colors.indexOf(currentColor);
    const nextColor = colors[(currentIndex + 1) % colors.length];

    setDetectedCube((prev) => {
      if (!prev) return prev;
      const newCube = { ...prev };
      newCube[face] = [...prev[face]];
      newCube[face][index] = nextColor;
      return newCube;
    });
  };

  const handleSolve = async () => {
    if (!detectedCube) return;

    const validation = validateCube(detectedCube);
    if (!validation.isValid) {
      setError(validation.errors.join(' '));
      return;
    }

    setIsSolving(true);
    setError(null);

    try {
      const result = await solveCube(detectedCube);
      if (result.error) {
        setError(result.error);
      } else {
        setSolution(result.solution);
        setCurrentStep(2);
      }
    } catch (err) {
      setError('Failed to solve. Please check the colors are correct.');
    } finally {
      setIsSolving(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setPhotos({ corner1: null, corner2: null });
    setDetectedCube(null);
    setSolution(null);
    setError(null);
  };

  const validation = detectedCube ? validateCube(detectedCube) : null;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      {/* Stepper */}
      <Stepper activeStep={currentStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Step 0: Upload Photos */}
      {currentStep === 0 && (
        <Paper sx={{ p: 3, borderRadius: 3, border: '3px solid #1a1a1a' }}>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, textAlign: 'center' }}>
            📷 Upload 2 Corner Photos
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
            Take photos from opposite corners of your cube so all 6 faces are visible.
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            {(['corner1', 'corner2'] as const).map((corner, idx) => (
              <Grid item xs={12} sm={6} key={corner}>
                <input
                  ref={fileInputRefs[corner]}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileSelect(corner)}
                  style={{ display: 'none' }}
                />

                <Paper
                  onClick={() => !photos[corner] && fileInputRefs[corner].current?.click()}
                  sx={{
                    p: 2,
                    minHeight: 180,
                    border: '3px dashed',
                    borderColor: photos[corner] ? 'success.main' : 'primary.main',
                    borderRadius: 2,
                    cursor: photos[corner] ? 'default' : 'pointer',
                    backgroundColor: photos[corner] ? 'success.light' : 'rgba(227, 0, 11, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    '&:hover': photos[corner] ? {} : { backgroundColor: 'rgba(227, 0, 11, 0.1)' },
                  }}
                >
                  {photos[corner] ? (
                    <>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClearPhoto(corner);
                        }}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          backgroundColor: 'error.main',
                          color: 'white',
                          '&:hover': { backgroundColor: 'error.dark' },
                        }}
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                      <Box
                        component="img"
                        src={photos[corner]!}
                        alt={`Corner ${idx + 1}`}
                        sx={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 1 }}
                      />
                      <Typography variant="caption" sx={{ mt: 1, fontWeight: 600, color: 'success.dark' }}>
                        ✓ Photo {idx + 1} uploaded
                      </Typography>
                    </>
                  ) : (
                    <>
                      <CloudUploadIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Corner {idx + 1}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {idx === 0 ? 'U + F + R faces' : 'D + B + L faces'}
                      </Typography>
                    </>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleAutoDetect}
            disabled={!photos.corner1 || !photos.corner2 || isDetecting}
            startIcon={isDetecting ? <CircularProgress size={20} color="inherit" /> : <AutoFixHighIcon />}
          >
            {isDetecting ? 'Detecting Colors...' : 'Auto-Detect Colors'}
          </Button>
        </Paper>
      )}

      {/* Step 1: Review Colors */}
      {currentStep === 1 && detectedCube && (
        <Paper sx={{ p: 3, borderRadius: 3, border: '3px solid #1a1a1a' }}>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, textAlign: 'center' }}>
            ✅ Review Detected Colors
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
            Tap any sticker to change its color if the detection was wrong.
          </Typography>

          {/* Cube faces display */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mb: 3 }}>
            {/* Top face */}
            <FaceDisplay face="U" colors={detectedCube.U} label="Top (U)" onClick={handleStickerClick} />
            
            {/* Middle row */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
              <FaceDisplay face="L" colors={detectedCube.L} label="Left (L)" onClick={handleStickerClick} />
              <FaceDisplay face="F" colors={detectedCube.F} label="Front (F)" onClick={handleStickerClick} />
              <FaceDisplay face="R" colors={detectedCube.R} label="Right (R)" onClick={handleStickerClick} />
              <FaceDisplay face="B" colors={detectedCube.B} label="Back (B)" onClick={handleStickerClick} />
            </Box>
            
            {/* Bottom face */}
            <FaceDisplay face="D" colors={detectedCube.D} label="Bottom (D)" onClick={handleStickerClick} />
          </Box>

          {/* Validation */}
          {validation && !validation.isValid && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {validation.errors.map((err, i) => (
                <Typography key={i} variant="body2">{err}</Typography>
              ))}
            </Alert>
          )}

          {validation?.isValid && (
            <Alert severity="success" sx={{ mb: 2 }}>
              ✓ Colors look correct! Ready to solve.
            </Alert>
          )}

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="outlined" onClick={() => setCurrentStep(0)} sx={{ flex: 1 }}>
              ← Re-upload Photos
            </Button>
            <Button
              variant="contained"
              size="large"
              onClick={handleSolve}
              disabled={!validation?.isValid || isSolving}
              startIcon={isSolving ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
              sx={{ flex: 2 }}
            >
              {isSolving ? 'Solving...' : 'Solve My Cube!'}
            </Button>
          </Box>
        </Paper>
      )}

      {/* Step 2: Visual Solution */}
      {currentStep === 2 && solution && (
        <Paper sx={{ p: 3, borderRadius: 3, border: '3px solid #1a1a1a' }}>
          <VisualSolution solution={solution} onReset={handleReset} />
        </Paper>
      )}
    </Box>
  );
}

// Face display component
function FaceDisplay({
  face,
  colors,
  label,
  onClick,
}: {
  face: Face;
  colors: CubeColor[];
  label: string;
  onClick: (face: Face, index: number) => void;
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
            onClick={() => onClick(face, index)}
            sx={{
              width: 32,
              height: 32,
              backgroundColor: CUBE_COLORS[color],
              borderRadius: 0.5,
              cursor: index === 4 ? 'not-allowed' : 'pointer',
              opacity: index === 4 ? 0.8 : 1,
              border: '1px solid rgba(0,0,0,0.2)',
              '&:hover': index !== 4 ? { transform: 'scale(1.1)', zIndex: 1 } : {},
              transition: 'transform 0.1s',
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
