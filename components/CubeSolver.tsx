'use client';

import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useCube } from '@/lib/CubeContext';
import { validateCube } from '@/lib/validation';
import { solveCube } from '@/lib/solver';
import ColorPalette from './ColorPalette';
import CubeNet from './CubeNet';
import SolutionDisplay from './SolutionDisplay';
import PhotoSampler from './PhotoSampler';

const steps = ['Welcome', 'Enter Colors', 'Solution'];

export default function CubeSolver() {
  const {
    cube,
    currentStep,
    setCurrentStep,
    setSolution,
    setIsLoading,
    setError,
    resetCube,
    error,
    isLoading,
  } = useCube();

  const validation = validateCube(cube);

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSolve = async () => {
    setIsLoading(true);
    setError(null);
    setSolution(null);

    try {
      const result = await solveCube(cube);
      if (result.error) {
        setError(result.error);
        setSolution(null);
      } else {
        setSolution(result.solution);
        setError(null);
      }
      setCurrentStep(2);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setCurrentStep(2);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Stepper */}
      <Stepper activeStep={currentStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Step Content */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 4 }}>
          {/* Step 0: Welcome */}
          {currentStep === 0 && (
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: 800, mb: 2, color: 'primary.main' }}
              >
                🧩 Let&apos;s Fix Your Cube!
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Enter the colors of your scrambled Rubik&apos;s Cube, and we&apos;ll
                give you the exact steps to solve it.
              </Typography>
              <Box
                component="img"
                src="/cube-preview.png"
                alt="Rubik's Cube"
                sx={{
                  width: 150,
                  height: 150,
                  objectFit: 'contain',
                  mb: 3,
                  opacity: 0.8,
                  display: 'none', // Hide until we have an image
                }}
              />
              <Typography variant="body2" color="text.secondary">
                <strong>Tip:</strong> Hold your cube with the{' '}
                <strong>white center facing up</strong> and the{' '}
                <strong>green center facing you</strong>.
              </Typography>
            </Box>
          )}

          {/* Step 1: Enter Colors */}
          {currentStep === 1 && (
            <Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, mb: 1, textAlign: 'center' }}
              >
                🎨 Enter Your Cube Colors
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 3, textAlign: 'center' }}
              >
                <strong>Step 1:</strong> Upload photos as reference (optional) →{' '}
                <strong>Step 2:</strong> Select a color below →{' '}
                <strong>Step 3:</strong> Tap stickers to paint them →{' '}
                <strong>Step 4:</strong> Click &quot;Solve My Cube!&quot;
              </Typography>

              {/* Photo Sampler - Auto-detect colors */}
              <PhotoSampler />

              {/* Manual color entry */}
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, mt: 2, mb: 1, textAlign: 'center', color: 'primary.main' }}
              >
                ✏️ Or enter colors manually:
              </Typography>

              {/* Color Palette */}
              <ColorPalette />

              {/* Cube Net */}
              <CubeNet />

              {/* Validation feedback */}
              {!validation.isValid && validation.errors.length > 0 && (
                <Alert severity="warning" sx={{ mt: 3, borderRadius: 2 }}>
                  {validation.errors.map((err, i) => (
                    <Typography key={i} variant="body2">
                      {err}
                    </Typography>
                  ))}
                </Alert>
              )}

              {validation.isValid && (
                <Alert severity="success" sx={{ mt: 3, borderRadius: 2 }}>
                  <Typography variant="body2">
                    ✓ All colors look good! Ready to solve.
                  </Typography>
                </Alert>
              )}
            </Box>
          )}

          {/* Step 2: Solution */}
          {currentStep === 2 && <SolutionDisplay />}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        {currentStep > 0 && currentStep < 2 && (
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
          >
            Back
          </Button>
        )}

        {currentStep === 0 && (
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={handleNext}
            fullWidth
            size="large"
          >
            Let&apos;s Go!
          </Button>
        )}

        {currentStep === 1 && (
          <Box sx={{ display: 'flex', gap: 2, ml: 'auto' }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={resetCube}
            >
              Reset
            </Button>
            <Button
              variant="contained"
              startIcon={<AutoFixHighIcon />}
              onClick={handleSolve}
              disabled={!validation.isValid}
              size="large"
            >
              Solve My Cube!
            </Button>
          </Box>
        )}

        {currentStep === 2 && (
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={() => {
              resetCube();
              setCurrentStep(0);
            }}
            fullWidth
            size="large"
          >
            Solve Another Cube
          </Button>
        )}
      </Box>
    </Box>
  );
}
