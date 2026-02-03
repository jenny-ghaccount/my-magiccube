'use client';

import { Box, Typography, Tooltip } from '@mui/material';
import { CUBE_COLORS, CubeColor, Face, COLOR_NAMES } from '@/lib/cube';
import { useCube } from '@/lib/CubeContext';

interface FaceGridProps {
  face: Face;
  label: string;
}

const FACE_LABELS: Record<Face, string> = {
  U: 'Top (U)',
  D: 'Bottom (D)',
  F: 'Front (F)',
  B: 'Back (B)',
  L: 'Left (L)',
  R: 'Right (R)',
};

export default function FaceGrid({ face, label }: FaceGridProps) {
  const { cube, selectedColor, setSticker } = useCube();
  const faceStickers = cube[face];

  const handleStickerClick = (index: number) => {
    // Center sticker (index 4) is fixed
    if (index === 4) return;
    setSticker(face, index, selectedColor);
  };

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 700,
          mb: 1,
          color: 'text.secondary',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        {label || FACE_LABELS[face]}
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '4px',
          padding: '8px',
          backgroundColor: '#1A1A1A',
          borderRadius: '12px',
          boxShadow: '0 4px 0 #000, 0 8px 16px rgba(0,0,0,0.3)',
          width: 'fit-content',
          margin: '0 auto',
        }}
      >
        {faceStickers.map((color, index) => {
          const isCenter = index === 4;
          const stickerColor = color ? CUBE_COLORS[color] : '#666666';
          
          return (
            <Tooltip
              key={index}
              title={
                isCenter
                  ? `Center sticker (fixed: ${color ? COLOR_NAMES[color] : 'unknown'})`
                  : color
                  ? COLOR_NAMES[color]
                  : 'Click to set color'
              }
              arrow
            >
              <Box
                onClick={() => handleStickerClick(index)}
                sx={{
                  width: 44,
                  height: 44,
                  backgroundColor: stickerColor,
                  borderRadius: '6px',
                  cursor: isCenter ? 'not-allowed' : 'pointer',
                  transition: 'transform 0.1s ease',
                  border: '2px solid rgba(0,0,0,0.2)',
                  opacity: isCenter ? 0.9 : 1,
                  '&:hover': {
                    transform: isCenter ? 'none' : 'scale(1.05)',
                    zIndex: 1,
                  },
                  '&:active': {
                    transform: isCenter ? 'none' : 'scale(0.95)',
                  },
                }}
                role="button"
                aria-label={`${FACE_LABELS[face]} sticker ${index + 1}${
                  isCenter ? ' (center, fixed)' : ''
                }${color ? `, ${COLOR_NAMES[color]}` : ', empty'}`}
                tabIndex={isCenter ? -1 : 0}
                onKeyDown={(e) => {
                  if (!isCenter && (e.key === 'Enter' || e.key === ' ')) {
                    handleStickerClick(index);
                  }
                }}
              />
            </Tooltip>
          );
        })}
      </Box>
    </Box>
  );
}
