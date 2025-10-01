import {useState, useEffect } from 'react';
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useMonitors } from '../../hook/useMonitor';
import MonitorService from '../../service/MonitorService';

export default function MonitorUser() {
  const [query, setQuery] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<{ name: string; document: string; phone?: string; email?: string; role?: 'Admin' | 'Monitores' }>({ name: '', document: '' });
  const [errors, setErrors] = useState<{ name?: string; document?: string; email?: string }>({});

  const {fetchMonitors, monitors} = useMonitors()



  const handleOpenConfirm = (id: number) => {
    setSelectedId(id);
    setConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setConfirmOpen(false);
    setSelectedId(null);
  };

  const handleDarDeBajaConfirm = async () => {
    if (selectedId == null) return;
    try {
      await MonitorService.changeState(selectedId, 'INACTIVO');
      await fetchMonitors();
    } finally {
      handleCloseConfirm();
    }
  };

  const handleReactivar = async (id: number) => {
    await MonitorService.changeState(id, 'ACTIVO');
    await fetchMonitors();
  };

  const handleEditar = (id: number | string) => {
    console.log('Editar', id);
  };

  const handleAgregar = () => {
    setEditingId(null);
    setForm({ name: '', document: '' });
    setFormOpen(true);
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
            Monitores
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Buscar monitor"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={handleAgregar}
              sx={{ bgcolor: '#2e7d32', '&:hover': { bgcolor: '#255f27' }, whiteSpace: 'nowrap' }}
            >
              Agregar monitor
            </Button>
          </Stack>
        </Stack>

        {/* Listado */}
        <Stack spacing={2}>
          {monitors && monitors.map((m) => (
            <Card key={m.id} sx={{ borderRadius: 2 }}>
              <CardContent>
                <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'stretch', md: 'center' }} spacing={2}>
                  <Box sx={{ flex: 1, bgcolor: '#eeeeee', borderRadius: 1, p: 2, textAlign: 'center' }}>
                    <Typography sx={{ fontWeight: 600, letterSpacing: 1 }}>{`${m.name} ${m.surname}`}</Typography>
                  </Box>
                  <Box sx={{ flex: 1, bgcolor: '#eeeeee', borderRadius: 1, p: 2, textAlign: 'center' }}>
                    <Typography sx={{ fontWeight: 600, letterSpacing: 1 }}>{m.document}</Typography>
                  </Box>

                  <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ minWidth: 280 }}>
                    <Button variant="outlined" onClick={() => handleEditar(m.id)}>
                      Editar
                    </Button>
                    {m.state === 'ACTIVO' ? (
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleOpenConfirm(m.id)}
                      >
                        Dar de baja
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleReactivar(m.id)}
                      >
                        Reactivar
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
    
      {/* Confirmación de baja */}
      <Dialog open={confirmOpen} onClose={handleCloseConfirm}>
        <DialogTitle>Confirmar baja</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Seguro que deseas dar de baja este monitor? Podrás reactivarlo más adelante si es necesario.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={handleDarDeBajaConfirm}>Dar de baja</Button>
        </DialogActions>
      </Dialog>

      {/* Crear/Editar Monitor */}
      <Dialog open={formOpen} onClose={() => setFormOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingId == null ? 'Agregar monitor' : 'Editar monitor'}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              label="Nombre"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              error={!!errors.name}
              helperText={errors.name}
            />
            <TextField
              label="Documento"
              value={form.document}
              onChange={(e) => setForm((f) => ({ ...f, document: e.target.value }))}
              error={!!errors.document}
              helperText={errors.document}
            />
            <TextField
              label="Teléfono"
              value={form.phone || ''}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            />
            <TextField
              label="Email"
              value={form.email || ''}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              error={!!errors.email}
              helperText={errors.email}
            />
            <FormControl fullWidth>
              <InputLabel id="role-label">Rol</InputLabel>
              <Select
                labelId="role-label"
                label="Rol"
                value={form.role || ''}
                onChange={(e) => setForm((f) => ({ ...f, role: (e.target.value as 'Admin' | 'Monitores') || undefined }))}
              >
                <MenuItem value="">Sin rol</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Monitores">Monitores</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleCloseConfirm} sx={{ bgcolor: '#2e7d32', '&:hover': { bgcolor: '#255f27' } }}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
}

