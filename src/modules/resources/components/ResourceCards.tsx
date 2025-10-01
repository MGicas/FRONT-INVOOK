import { Box, Container, Typography, Card, CardActionArea, CardContent } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const ResourceCards = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
            Recursos
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(2, 1fr)' },
            gap: 4,
            justifyItems: 'center',
          }}
        >
          <Card sx={{ width: '100%', maxWidth: 360, borderRadius: 4, backgroundColor: '#2e7d32' }}>
            <CardActionArea component={RouterLink} to="/resources/prestamos">
              <CardContent>
                <Box sx={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="h6" sx={{ color: 'white', letterSpacing: 1 }}>
                    PRÉSTAMOS
                  </Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>

          <Card sx={{ width: '100%', maxWidth: 360, borderRadius: 4, backgroundColor: '#2e7d32' }}>
            <CardActionArea component={RouterLink} to="/resources/consumos">
              <CardContent>
                <Box sx={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="h6" sx={{ color: 'white', letterSpacing: 1 }}>
                    CONSUMOS
                  </Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

export default ResourceCards;
