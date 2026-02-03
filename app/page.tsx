import FaceByFaceEntry from '@/components/FaceByFaceEntry';
import Header from '@/components/Header';
import { Box, Container, Typography } from '@mui/material';

export default function Home() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #FFF9E6 0%, #FFE4B5 100%)',
      }}
    >
      <Header />
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <FaceByFaceEntry />
        </Box>
        
        {/* Footer */}
        <Box
          component="footer"
          sx={{
            textAlign: 'center',
            py: 3,
            borderTop: '2px solid',
            borderColor: 'divider',
            mt: 4,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            🧩 MagicCube Solver — Built with ❤️ using Next.js, MUI & cubing.js
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            All processing happens in your browser. Your cube state is never sent to any server.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
