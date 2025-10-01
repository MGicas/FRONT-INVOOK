import {useState,useEffect } from 'react';
import apiService from '../../../../shared/modules/instances/AxiosInstance';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useLenders } from '../../hook/useLenders';
 
type Lender = {
  id: number;
  name?: string;
  document?: string;
  phone?: string;
  email?: string;
};


export default function LenderUser() {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<Lender[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | string | null>(null);


  const {fetchLenders, lenders} = useLenders()

  const handleOpenConfirm = (id: number | string) => {
    setSelectedId(id);
    setConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setConfirmOpen(false);
    setSelectedId(null);
  };

  const handleEliminarConfirm = async () => {
    if (selectedId == null) return;
    try {
      await apiService.delete<void>(`users/lenders/${encodeURIComponent(String(selectedId))}/`);
      // refrescar lista (opción simple: filtrar localmente)
      setItems((prev) => prev.filter((m) => String(m.id) !== String(selectedId)));
    } catch (e) {
      setError('No se pudo eliminar el prestamista');
    } finally {
      setConfirmOpen(false);
      setSelectedId(null);
    }
  };

  const handleEditar = (id: number | string) => {
    console.log('Editar', id);
  };

  const handleAgregar = () => {
    console.log('Agregar prestamista');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          alignItems={{ xs: 'stretch', md: 'center' }}
          justifyContent="space-between"
          sx={{ mb: 4 }}
        >
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
            Prestamistas
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Buscar prestamista"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={handleAgregar}
              sx={{ bgcolor: '#2e7d32', '&:hover': { bgcolor: '#255f27' }, whiteSpace: 'nowrap' }}
            >
              Agregar prestamista
            </Button>
          </Stack>
        </Stack>

        {/* Listado */}
        <Stack spacing={2}>
          {lenders && lenders.map((m) => (
            <Card key={m.id} sx={{ borderRadius: 2 }}>
              <CardContent>
                <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'stretch', md: 'center' }} spacing={2}>
                  <Box sx={{ flex: 1, bgcolor: '#eeeeee', borderRadius: 1, p: 2, textAlign: 'center' }}>
                    <Typography sx={{ fontWeight: 600, letterSpacing: 1 }}>{`${m.names} ${m.surnames}`}</Typography>
                  </Box>
                  <Box sx={{ flex: 1, bgcolor: '#eeeeee', borderRadius: 1, p: 2, textAlign: 'center' }}>
                    <Typography sx={{ fontWeight: 600, letterSpacing: 1 }}>{m.id}</Typography>
                  </Box>

                  <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ minWidth: 220 }}>
                    <Button variant="outlined" onClick={() => handleEditar(m.id)}>
                      Editar
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleOpenConfirm(m.id)}
                    >
                      Dar de baja
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>

      {/* Confirmación de baja */}
        <Dialog open={confirmOpen} onClose={handleCloseConfirm}>
          <DialogTitle>Confirmar eliminación</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Seguro que deseas eliminar a este prestamista?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirm}>Cancelar</Button>
            <Button color="error" variant="contained" onClick={handleEliminarConfirm}>Eliminar</Button>
          </DialogActions>
        </Dialog>

      </Container>
    );
  }
