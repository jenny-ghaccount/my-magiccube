'use client';

import { createTheme } from '@mui/material/styles';

// LEGO-inspired theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#E3000B',      // LEGO red
      light: '#FF3D3D',
      dark: '#B00008',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#0055BF',      // LEGO blue
      light: '#3D7DD4',
      dark: '#003D8F',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#00852B',      // LEGO green
      light: '#00A83A',
      dark: '#006620',
    },
    warning: {
      main: '#FF6D00',      // Vibrant orange
      light: '#FF9E40',
      dark: '#C55000',
    },
    error: {
      main: '#E3000B',
      light: '#FF3D3D',
      dark: '#B00008',
    },
    background: {
      default: '#FFF9E6',   // Warm cream - like LEGO instruction booklet
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#5C5C5C',
    },
  },
  typography: {
    fontFamily: '"Nunito", "Poppins", "Roboto", sans-serif',
    h1: {
      fontWeight: 800,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 700,
      letterSpacing: '0.5px',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'uppercase',
          fontWeight: 700,
          padding: '12px 24px',
          boxShadow: '0 4px 0 rgba(0,0,0,0.2)',
          transition: 'all 0.15s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 0 rgba(0,0,0,0.2)',
          },
          '&:active': {
            transform: 'translateY(2px)',
            boxShadow: '0 2px 0 rgba(0,0,0,0.2)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(180deg, #E3000B 0%, #C00000 100%)',
          boxShadow: '0 4px 0 #8B0000',
          '&:hover': {
            background: 'linear-gradient(180deg, #FF1A1A 0%, #E3000B 100%)',
            boxShadow: '0 6px 0 #8B0000',
          },
          '&:active': {
            boxShadow: '0 2px 0 #8B0000',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(180deg, #0055BF 0%, #003D8F 100%)',
          boxShadow: '0 4px 0 #002855',
          '&:hover': {
            background: 'linear-gradient(180deg, #1A6FD4 0%, #0055BF 100%)',
            boxShadow: '0 6px 0 #002855',
          },
          '&:active': {
            boxShadow: '0 2px 0 #002855',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 0 rgba(0,0,0,0.1), 0 8px 24px rgba(0,0,0,0.1)',
          border: '3px solid #1A1A1A',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiStepper: {
      styleOverrides: {
        root: {
          padding: '16px 0',
        },
      },
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          fontSize: '2rem',
          '&.Mui-completed': {
            color: '#00852B',
          },
          '&.Mui-active': {
            color: '#E3000B',
          },
        },
      },
    },
  },
});

export default theme;
