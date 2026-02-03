'use client';

import { Box } from '@mui/material';
import FaceGrid from './FaceGrid';
import { Face } from '@/lib/cube';

export default function CubeNet() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        py: 2,
      }}
    >
      {/* Top face (U) */}
      <Box>
        <FaceGrid face="U" label="Top (U)" />
      </Box>

      {/* Middle row: L, F, R, B */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <FaceGrid face="L" label="Left (L)" />
        <FaceGrid face="F" label="Front (F)" />
        <FaceGrid face="R" label="Right (R)" />
        <FaceGrid face="B" label="Back (B)" />
      </Box>

      {/* Bottom face (D) */}
      <Box>
        <FaceGrid face="D" label="Bottom (D)" />
      </Box>
    </Box>
  );
}
