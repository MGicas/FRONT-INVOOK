import { Box, Container, Paper, useTheme, useMediaQuery } from '@mui/material';
import type { ReactNode } from 'react';

interface LoginLayoutProps {
  children: ReactNode;
}

export const LoginLayout = ({ children }: Readonly<LoginLayoutProps>) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 50%, #a5d6a7 100%)',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            backgroundColor: 'rgba(46, 125, 50, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box
            sx={{
              p: isMobile ? 3 : 6,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minHeight: isMobile ? '70vh' : '60vh',
              justifyContent: 'center',
            }}
          >
            {children}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginLayout;