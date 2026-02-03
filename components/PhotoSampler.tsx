'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { CUBE_COLORS, CubeColor, COLOR_NAMES, Face } from '@/lib/cube';
import { useCube } from '@/lib/CubeContext';

interface PhotoSamplerProps {
  onComplete?: () => void;
}

// Map RGB to nearest cube color
function rgbToNearestCubeColor(r: number, g: number, b: number): CubeColor {
  const cubeColorRGB: Record<CubeColor, [number, number, number]> = {
    W: [255, 255, 255],   // White
    Y: [255, 213, 0],     // Yellow
    R: [183, 18, 52],     // Red
    O: [255, 88, 0],      // Orange
    G: [0, 155, 72],      // Green
    B: [0, 70, 173],      // Blue
  };

  let closestColor: CubeColor = 'W';
  let minDistance = Infinity;

  for (const [color, [cr, cg, cb]] of Object.entries(cubeColorRGB)) {
    // Weighted Euclidean distance (human eye is more sensitive to green)
    const distance = Math.sqrt(
      2 * Math.pow(r - cr, 2) +
      4 * Math.pow(g - cg, 2) +
      3 * Math.pow(b - cb, 2)
    );

    if (distance < minDistance) {
      minDistance = distance;
      closestColor = color as CubeColor;
    }
  }

  return closestColor;
}

// Get average color from a region
function getAverageColor(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  sampleSize: number = 10
): { r: number; g: number; b: number } {
  const halfSize = Math.floor(sampleSize / 2);
  const imageData = ctx.getImageData(x - halfSize, y - halfSize, sampleSize, sampleSize);
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

interface SamplingDialogProps {
  open: boolean;
  imageUrl: string;
  corner: 'corner1' | 'corner2';
  onClose: () => void;
  onSampleComplete: (samples: { face: Face; index: number; color: CubeColor }[]) => void;
}

// Sticker positions for each corner photo
const CORNER1_STICKERS: { face: Face; index: number; label: string }[] = [
  // U face (top) - visible stickers depend on angle
  { face: 'U', index: 0, label: 'U1' },
  { face: 'U', index: 1, label: 'U2' },
  { face: 'U', index: 2, label: 'U3' },
  { face: 'U', index: 3, label: 'U4' },
  { face: 'U', index: 5, label: 'U6' },
  { face: 'U', index: 6, label: 'U7' },
  { face: 'U', index: 7, label: 'U8' },
  { face: 'U', index: 8, label: 'U9' },
  // F face (front)
  { face: 'F', index: 0, label: 'F1' },
  { face: 'F', index: 1, label: 'F2' },
  { face: 'F', index: 2, label: 'F3' },
  { face: 'F', index: 3, label: 'F4' },
  { face: 'F', index: 5, label: 'F6' },
  { face: 'F', index: 6, label: 'F7' },
  { face: 'F', index: 7, label: 'F8' },
  { face: 'F', index: 8, label: 'F9' },
  // R face (right)
  { face: 'R', index: 0, label: 'R1' },
  { face: 'R', index: 1, label: 'R2' },
  { face: 'R', index: 2, label: 'R3' },
  { face: 'R', index: 3, label: 'R4' },
  { face: 'R', index: 5, label: 'R6' },
  { face: 'R', index: 6, label: 'R7' },
  { face: 'R', index: 7, label: 'R8' },
  { face: 'R', index: 8, label: 'R9' },
];

const CORNER2_STICKERS: { face: Face; index: number; label: string }[] = [
  // D face (bottom)
  { face: 'D', index: 0, label: 'D1' },
  { face: 'D', index: 1, label: 'D2' },
  { face: 'D', index: 2, label: 'D3' },
  { face: 'D', index: 3, label: 'D4' },
  { face: 'D', index: 5, label: 'D6' },
  { face: 'D', index: 6, label: 'D7' },
  { face: 'D', index: 7, label: 'D8' },
  { face: 'D', index: 8, label: 'D9' },
  // B face (back)
  { face: 'B', index: 0, label: 'B1' },
  { face: 'B', index: 1, label: 'B2' },
  { face: 'B', index: 2, label: 'B3' },
  { face: 'B', index: 3, label: 'B4' },
  { face: 'B', index: 5, label: 'B6' },
  { face: 'B', index: 6, label: 'B7' },
  { face: 'B', index: 7, label: 'B8' },
  { face: 'B', index: 8, label: 'B9' },
  // L face (left)
  { face: 'L', index: 0, label: 'L1' },
  { face: 'L', index: 1, label: 'L2' },
  { face: 'L', index: 2, label: 'L3' },
  { face: 'L', index: 3, label: 'L4' },
  { face: 'L', index: 5, label: 'L6' },
  { face: 'L', index: 6, label: 'L7' },
  { face: 'L', index: 7, label: 'L8' },
  { face: 'L', index: 8, label: 'L9' },
];

function SamplingDialog({ open, imageUrl, corner, onClose, onSampleComplete }: SamplingDialogProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [samples, setSamples] = useState<{ face: Face; index: number; color: CubeColor }[]>([]);
  const [lastSampledColor, setLastSampledColor] = useState<CubeColor | null>(null);

  const stickers = corner === 'corner1' ? CORNER1_STICKERS : CORNER2_STICKERS;
  const currentSticker = stickers[currentIndex];

  useEffect(() => {
    if (open && imageUrl && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        // Scale image to fit canvas while maintaining aspect ratio
        const maxWidth = 500;
        const maxHeight = 400;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (maxHeight / height) * width;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
      };
      img.src = imageUrl;
    }
  }, [open, imageUrl]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.round((e.clientX - rect.left) * (canvas.width / rect.width));
    const y = Math.round((e.clientY - rect.top) * (canvas.height / rect.height));

    // Sample color
    const { r, g, b } = getAverageColor(ctx, x, y, 15);
    const detectedColor = rgbToNearestCubeColor(r, g, b);

    setLastSampledColor(detectedColor);

    // Add to samples
    const newSample = {
      face: currentSticker.face,
      index: currentSticker.index,
      color: detectedColor,
    };

    setSamples((prev) => [...prev, newSample]);

    // Move to next sticker
    if (currentIndex < stickers.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleDone = () => {
    onSampleComplete(samples);
    setSamples([]);
    setCurrentIndex(0);
    setLastSampledColor(null);
    onClose();
  };

  const handleSkip = () => {
    if (currentIndex < stickers.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const progress = Math.round((samples.length / stickers.length) * 100);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, textAlign: 'center' }}>
        📷 Tap Each Sticker - {corner === 'corner1' ? 'Corner 1 (U+F+R)' : 'Corner 2 (D+B+L)'}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2, textAlign: 'center' }}>
          Tap on sticker <strong>{currentSticker?.label}</strong> in your photo.
          Progress: {samples.length}/{stickers.length} ({progress}%)
        </Typography>

        {lastSampledColor && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 2 }}>
            <Typography variant="body2">Last detected:</Typography>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                backgroundColor: CUBE_COLORS[lastSampledColor],
                border: '2px solid #333',
              }}
            />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {COLOR_NAMES[lastSampledColor]}
            </Typography>
          </Box>
        )}

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            cursor: 'crosshair',
            border: '3px solid',
            borderColor: 'primary.main',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            style={{ maxWidth: '100%', display: 'block' }}
          />
        </Box>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
          {stickers.map((s, i) => (
            <Box
              key={`${s.face}-${s.index}`}
              sx={{
                width: 28,
                height: 28,
                borderRadius: 1,
                backgroundColor: samples[i] ? CUBE_COLORS[samples[i].color] : '#e0e0e0',
                border: i === currentIndex ? '3px solid #E3000B' : '2px solid #999',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.6rem',
                fontWeight: 600,
              }}
            >
              {s.label}
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
        <Button onClick={handleSkip} disabled={currentIndex >= stickers.length - 1}>
          Skip This Sticker
        </Button>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleDone}
          disabled={samples.length === 0}
          startIcon={<CheckCircleIcon />}
        >
          Apply {samples.length} Colors
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function PhotoSampler({ onComplete }: PhotoSamplerProps) {
  const { setSticker } = useCube();
  const [photos, setPhotos] = useState<{
    corner1: string | null;
    corner2: string | null;
  }>({ corner1: null, corner2: null });
  const [samplingCorner, setSamplingCorner] = useState<'corner1' | 'corner2' | null>(null);
  const [sampledCorners, setSampledCorners] = useState<Set<string>>(new Set());

  const fileInputRefs = {
    corner1: useRef<HTMLInputElement>(null),
    corner2: useRef<HTMLInputElement>(null),
  };

  const handleFileSelect = (corner: 'corner1' | 'corner2', file: File) => {
    const url = URL.createObjectURL(file);
    setPhotos((prev) => ({ ...prev, [corner]: url }));
    // Auto-open sampling dialog
    setTimeout(() => setSamplingCorner(corner), 100);
  };

  const handleInputChange = (corner: 'corner1' | 'corner2') => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(corner, file);
  };

  const handleSampleComplete = (samples: { face: Face; index: number; color: CubeColor }[]) => {
    // Apply sampled colors to the cube
    for (const sample of samples) {
      setSticker(sample.face, sample.index, sample.color);
    }
    if (samplingCorner) {
      setSampledCorners((prev) => {
        const newSet = new Set(prev);
        newSet.add(samplingCorner);
        return newSet;
      });
    }
    setSamplingCorner(null);
  };

  const handleClear = (corner: 'corner1' | 'corner2') => {
    if (photos[corner]) {
      URL.revokeObjectURL(photos[corner]!);
    }
    setPhotos((prev) => ({ ...prev, [corner]: null }));
    setSampledCorners((prev) => {
      const newSet = new Set(prev);
      newSet.delete(corner);
      return newSet;
    });
  };

  const corners = [
    { id: 'corner1' as const, label: 'Corner 1', faces: 'U + F + R', desc: 'Top, Front, Right' },
    { id: 'corner2' as const, label: 'Corner 2', faces: 'D + B + L', desc: 'Bottom, Back, Left' },
  ];

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, textAlign: 'center' }}>
        📷 Upload & Auto-Detect Colors from Photos
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
        Take 2 corner photos of your cube. Tap on each sticker to auto-detect its color!
      </Typography>

      <Grid container spacing={2}>
        {corners.map((corner) => (
          <Grid item xs={12} sm={6} key={corner.id}>
            <input
              ref={fileInputRefs[corner.id]}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleInputChange(corner.id)}
              style={{ display: 'none' }}
            />

            <Paper
              sx={{
                p: 2,
                borderRadius: 2,
                border: '3px solid',
                borderColor: sampledCorners.has(corner.id)
                  ? 'success.main'
                  : photos[corner.id]
                  ? 'primary.main'
                  : 'grey.300',
                textAlign: 'center',
              }}
            >
              {!photos[corner.id] ? (
                <Box
                  onClick={() => fileInputRefs[corner.id].current?.click()}
                  sx={{ cursor: 'pointer', py: 2 }}
                >
                  <CloudUploadIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {corner.label}: {corner.faces}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {corner.desc}
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Box sx={{ position: 'relative', mb: 1 }}>
                    <IconButton
                      onClick={() => handleClear(corner.id)}
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        backgroundColor: 'error.main',
                        color: 'white',
                        '&:hover': { backgroundColor: 'error.dark' },
                        zIndex: 1,
                      }}
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                    <Box
                      component="img"
                      src={photos[corner.id]!}
                      alt={corner.label}
                      sx={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 1 }}
                    />
                  </Box>

                  {sampledCorners.has(corner.id) ? (
                    <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                      ✓ Colors detected!
                    </Typography>
                  ) : (
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<TouchAppIcon />}
                      onClick={() => setSamplingCorner(corner.id)}
                      fullWidth
                    >
                      Tap to Detect Colors
                    </Button>
                  )}
                </Box>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>

      {sampledCorners.size > 0 && (
        <Typography variant="body2" color="success.main" sx={{ mt: 2, textAlign: 'center', fontWeight: 600 }}>
          ✓ {sampledCorners.size}/2 corners detected! Check the colors below and fix any mistakes.
        </Typography>
      )}

      {/* Sampling Dialog */}
      {samplingCorner && photos[samplingCorner] && (
        <SamplingDialog
          open={!!samplingCorner}
          imageUrl={photos[samplingCorner]!}
          corner={samplingCorner}
          onClose={() => setSamplingCorner(null)}
          onSampleComplete={handleSampleComplete}
        />
      )}
    </Box>
  );
}
