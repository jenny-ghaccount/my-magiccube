'use client';

import { Box, Typography, Paper, Button, Alert, CircularProgress } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useCube } from '@/lib/CubeContext';
import { NOTATION_LEGEND } from '@/lib/solver';
import { useState } from 'react';

export default function SolutionDisplay() {
  const { solution, error, isLoading, resetCube, setCurrentStep } = useCube();
  const [copied, setCopied] = useState(false);

  const moves = solution ? solution.split(' ').filter((m) => m) : [];

  const handleCopy = async () => {
    if (solution) {
      await navigator.clipboard.writeText(solution);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSolveAnother = () => {
    resetCube();
    setCurrentStep(0);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          py: 4,
        }}
      >
        <CircularProgress size={60} sx={{ color: 'primary.main' }} />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          🧩 Solving your cube...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This usually takes just a moment!
        </Typography>
      </Box>
    );
  }

  if (error && !solution) {
    return (
      <Box sx={{ py: 2 }}>
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Oops! Something went wrong
          </Typography>
          <Typography variant="body2">{error}</Typography>
        </Alert>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<RefreshIcon />}
          onClick={handleSolveAnother}
          fullWidth
        >
          Try Again
        </Button>
      </Box>
    );
  }

  // Show solution even if empty (already solved case)
  return (
    <Box sx={{ py: 2 }}>
      {/* Success message */}
      <Alert
        severity="success"
        sx={{
          mb: 3,
          borderRadius: 2,
          '& .MuiAlert-message': { width: '100%' },
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          🎉 {moves.length === 0 ? 'Cube Already Solved!' : 'Solution Found!'}
        </Typography>
        <Typography variant="body2">
          {moves.length === 0 
            ? 'Your cube is already in the solved state!'
            : `Follow the ${moves.length} moves below to solve your cube.`}
        </Typography>
      </Alert>

      {/* Solution moves */}
      {moves.length > 0 && (
        <>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
            📋 Solution Steps:
          </Typography>
          <Paper
            sx={{
              p: 3,
              mb: 3,
              backgroundColor: '#1A1A1A',
              color: '#FFFFFF',
              borderRadius: 2,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '2px',
                wordBreak: 'break-word',
                lineHeight: 1.8,
              }}
            >
              {solution}
            </Typography>
          </Paper>

          {/* Individual moves */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Step by step:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {moves.map((move, index) => (
                <Paper
                  key={index}
                  sx={{
                    px: 2,
                    py: 1,
                    backgroundColor: 'primary.main',
                    color: 'white',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    borderRadius: 1,
                  }}
                >
                  {index + 1}. {move}
                </Paper>
              ))}
            </Box>
          </Box>

          {/* Move count */}
          <Typography
            variant="body1"
            sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}
          >
            Total moves: <strong>{moves.length}</strong>
          </Typography>

          {/* Action buttons */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<ContentCopyIcon />}
              onClick={handleCopy}
              sx={{ flex: 1, minWidth: 150 }}
            >
              {copied ? 'Copied! ✓' : 'Copy Solution'}
            </Button>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleSolveAnother}
              sx={{ flex: 1, minWidth: 150 }}
            >
              Solve Another
            </Button>
          </Box>
        </>
      )}

      {moves.length === 0 && (
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={handleSolveAnother}
          fullWidth
          sx={{ mb: 3 }}
        >
          Solve Another Cube
        </Button>
      )}

      {/* Notation legend */}
      <Paper sx={{ mt: 2, p: 2, backgroundColor: 'background.default' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
          📖 Notation Guide
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 1,
          }}
        >
          {Object.entries(NOTATION_LEGEND).map(([key, description]) => (
            <Typography key={key} variant="body2" color="text.secondary">
              <strong>{key}</strong>: {description}
            </Typography>
          ))}
        </Box>
      </Paper>
    </Box>
  );
}
