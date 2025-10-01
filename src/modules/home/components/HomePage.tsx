import { Box, Typography, Container, Paper} from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';
import { StatsCards } from './StatsCards';

const HomePage = () => {

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <HomeIcon sx={{ fontSize: 60, color: '#2e7d32', mb: 2 }} />
          <Typography variant="h3" component="h1" sx={{ color: '#2e7d32', mb: 2, fontWeight: 'bold' }}>
            Bienvenido a INVOOK
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Sistema integral de gestión de inventario y préstamos de equipos
          </Typography>
        </Box>
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, 
            gap: 3, 
            mb: 4 
          }}
        >
        <StatsCards/>
        </Box>
        <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: 'rgba(46, 125, 50, 0.05)' }}>
          <Typography variant="h5" sx={{ mb: 2, color: '#2e7d32' }}>
            ¿Qué deseas hacer hoy?
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Utiliza la barra de navegación superior para acceder a las diferentes secciones del sistema.
            Puedes gestionar el inventario, usuarios, préstamos y mucho más.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default HomePage;