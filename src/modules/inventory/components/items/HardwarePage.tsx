import { Box, Container, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Stack,
  Chip,
  IconButton,
  Divider,
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { HardwareService, type HardwarePayload } from '../../service/HardwareService';
import HardwareFormDialog from './HardwareFormDialog';
import Pagination from '@mui/material/Pagination';

type HardwareItem = HardwarePayload;

const HardwarePage = () => {
  const [items, setItems] = useState<HardwareItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [query, setQuery] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<HardwareItem | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const loadAll = async (pageArg = page) => {
    setIsLoading(true);
    setError('');
    try {
      const data = await HardwareService.getAll({ page: pageArg, page_size: pageSize });
      if (data && typeof data === 'object' && 'results' in data) {
        const pag = data as { results: HardwareItem[]; count: number };
        setItems(pag.results);
        setTotalCount(pag.count);
      } else if (Array.isArray(data)) {
        // fallback si API no pagina
        setItems(data);
        setTotalCount(data.length);
      } else {
        setItems([]);
        setTotalCount(0);
      }
    } catch (e: any) {
      setError(e?.message ?? 'Error cargando equipos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAll(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSearch = async () => {
    if (!query.trim()) return loadAll();
    setIsLoading(true);
    setError('');
    try {
      const data = await HardwareService.getBySerial(query.trim());
      const asArray = Array.isArray(data) ? data : data ? [data] : [];
      setItems(asArray);
      setTotalCount(asArray.length);
    } catch (e: any) {
      setError(e?.message ?? 'No se encontró el equipo');
      setItems([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (serial: string) => {
    if (!confirm(`¿Eliminar el equipo con serial ${serial}?`)) return;
    try {
      await HardwareService.delete(serial);
      // refrescar la página actual
      loadAll();
    } catch (e: any) {
      setError(e?.message ?? 'Error eliminando equipo');
    }
  };

  const handleEdit = (serial: string) => {
    const item = items.find(i => i.serial === serial) || null;
    setEditing(item);
    setOpenForm(true);
  };

  const title = useMemo(() => 'Equipos', []);

  const handleCreateOpen = () => {
    setEditing(null);
    setOpenForm(true);
  };

  const handleSubmitForm = async (values: HardwarePayload, mode: 'create' | 'edit') => {
    try {
      if (mode === 'create') {
        await HardwareService.create(values);
      } else {
        await HardwareService.update(values.serial, values);
      }
      await loadAll();
    } catch (e: any) {
      setError(e?.message ?? 'Error guardando equipo');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
            {title}
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="center">
            <TextField
              size="small"
              placeholder="Busca producto por serial"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{ endAdornment: <IconButton onClick={handleSearch} aria-label="buscar"><SearchIcon /></IconButton> }}
            />
            <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={handleCreateOpen} sx={{ color: '#fff' }}>
              Agregar equipo
            </Button>
            <Button variant="contained" color="success" startIcon={<AddIcon />} sx={{ color: '#fff' }} onClick={() => console.log('Agregar tipo')}>
              Agregar tipo
            </Button>
          </Stack>
        </Stack>

        {error && (
          <Paper sx={{ p: 2, mb: 2, borderLeft: '4px solid #d32f2f', background: '#ffebee' }}>
            <Typography color="error">{error}</Typography>
          </Paper>
        )}

        {isLoading ? (
          <Stack alignItems="center" sx={{ py: 6 }}>
            <CircularProgress />
          </Stack>
        ) : (
          <Stack spacing={2}>
            {items.map((item, idx) => (
              <Paper key={item.serial ?? idx} sx={{ p: 2, bgcolor: '#eeeeee' }}>
                <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2}>
                  <Typography sx={{ minWidth: 180, fontWeight: 600 }}>
                    {item.name || `Producto ${idx + 1}`}
                  </Typography>

                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography sx={{ color: 'text.secondary' }}>Estado</Typography>
                    <Chip label={String(item.state ?? '-')} size="small" />
                    <Typography sx={{ color: 'text.secondary', ml: 2 }}>Disponibilidad</Typography>
                    <Chip
                      label={String(item.available ?? '-')}
                      size="small"
                      color={item.available === 'DISPONIBLE' ? 'success' : item.available === 'NO_DISPONIBLE' ? 'warning' : 'default'}
                    />
                  </Stack>

                  <Divider flexItem orientation="vertical" sx={{ display: { xs: 'none', md: 'block' } }} />

                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 600 }}>Tipo {item.hardware_type || '—'}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Serial {item.serial}
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={1}>
                    <Button variant="outlined" startIcon={<EditIcon />} onClick={() => handleEdit(item.serial)}>
                      Editar
                    </Button>
                    <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(item.serial)}>
                      Eliminar
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            ))}

            {!items.length && !error && (
              <Typography color="text.secondary" sx={{ textAlign: 'center', py: 6 }}>
                No hay equipos para mostrar
              </Typography>
            )}

            {!!totalCount && (
              <Stack alignItems="center" sx={{ py: 1 }}>
                <Pagination
                  count={Math.max(1, Math.ceil(totalCount / pageSize))}
                  page={page}
                  onChange={(_, p) => setPage(p)}
                  color="primary"
                />
              </Stack>
            )}
          </Stack>
        )}

        <HardwareFormDialog
          open={openForm}
          initialValues={editing || undefined}
          onClose={() => setOpenForm(false)}
          onSubmit={handleSubmitForm}
        />
      </Box>
    </Container>
  );
};

export default HardwarePage;

