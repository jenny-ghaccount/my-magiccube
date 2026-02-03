'use client';

import { AppBar, Toolbar, Typography, Box, IconButton, Tooltip } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ExtensionIcon from '@mui/icons-material/Extension';

export default function Header() {
  return (
    <AppBar 
      position="static" 
      sx={{ 
        background: 'linear-gradient(180deg, #E3000B 0%, #C00000 100%)',
        boxShadow: '0 4px 0 #8B0000, 0 6px 12px rgba(0,0,0,0.2)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <ExtensionIcon sx={{ fontSize: 32 }} />
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: 800,
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
          >
            MagicCube Solver
          </Typography>
        </Box>
        <Tooltip title="Help">
          <IconButton color="inherit" aria-label="help">
            <HelpOutlineIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
