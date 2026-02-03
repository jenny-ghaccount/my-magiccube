'use client';

import { Box, Tooltip } from '@mui/material';
import { CUBE_COLORS, CubeColor, COLOR_NAMES } from '@/lib/cube';
import { useCube } from '@/lib/CubeContext';

export default function ColorPalette() {
  const { selectedColor, setSelectedColor } = useCube();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1.5,
        justifyContent: 'center',
        flexWrap: 'wrap',
        p: 2,
      }}
    >
      {(Object.keys(CUBE_COLORS) as CubeColor[]).map((color) => (
        <Tooltip key={color} title={COLOR_NAMES[color]} arrow>
          <Box
            onClick={() => setSelectedColor(color)}
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              backgroundColor: CUBE_COLORS[color],
              border: '4px solid #1A1A1A',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: '0 3px 0 rgba(0,0,0,0.3)',
              transform: selectedColor === color ? 'scale(1.15)' : 'scale(1)',
              outline: selectedColor === color ? '4px solid #FFD700' : 'none',
              outlineOffset: 2,
              '&:hover': {
                transform: 'scale(1.1)',
              },
              '&:active': {
                transform: 'scale(0.95)',
              },
            }}
            role="button"
            aria-label={`Select ${COLOR_NAMES[color]}`}
            aria-pressed={selectedColor === color}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setSelectedColor(color);
              }
            }}
          />
        </Tooltip>
      ))}
    </Box>
  );
}
