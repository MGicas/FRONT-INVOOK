import { useState } from 'react';
import { Box, Container, Typography, Paper, Stack, TextField, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableHead, TableRow, TableCell, TableBody, Checkbox, Chip } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import { useLoan } from '../../hook/useLoan';
import LoanService from '../../service/LoanService';

const LoanPage = () => {
  const { items, isLoading, error, page, pageSize, totalCount, setPage, filters, setFilters, reload } = useLoan();

  const handleClose = async (id?: number | string) => {
    if (id == null) return;
    if (!confirm('¿Cerrar este préstamo?')) return;
    try {
      await LoanService.close(id);
      await reload();
    } catch (e) {
      // noop; errores se gestionarán en el servicio/global
    }
  };

  // Estado para el diálogo de detalle
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoan, setDetailLoan] = useState<any | null>(null);
  const [returnMap, setReturnMap] = useState<Record<string, boolean>>({});

  const openDetail = async (id?: number | string) => {
    if (id == null) return;
    try {
      const data = await LoanService.get(id);
      setDetailLoan(data);
      // Inicializa checks como false
      const items = (data as any)?.items ?? [];
      const map: Record<string, boolean> = {};
      items.forEach((it: any, idx: number) => {
        const key = String(it?.id ?? it?.serial ?? idx);
        map[key] = Boolean(it?.returned);
      });
      setReturnMap(map);
      setDetailOpen(true);
    } catch (_) {
      // si falla, abre al menos con datos mínimos del listado
      setDetailLoan(items.find(l => (l.id ?? '') === id) ?? null);
      setDetailOpen(true);
    }
  };

  const toggleReturn = (key: string) => {
    setReturnMap(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const submitReturns = async () => {
    if (!detailLoan?.id) return setDetailOpen(false);
    const selectedKeys = Object.entries(returnMap).filter(([, v]) => v).map(([k]) => k);
    try {
      // Enviar selección al backend si aplica
      await LoanService.close(detailLoan.id, { items: selectedKeys });
      setDetailOpen(false);
      await reload();
    } catch (_) {
      setDetailOpen(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
            Préstamos
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="center" sx={{ width: { xs: '100%', sm: 'auto' } }}>
            <TextField
              size="small"
              placeholder="Busca"
              value={filters.borrower ?? ''}
              onChange={(e) => setFilters((f) => ({ ...f, borrower: e.target.value || undefined }))}
            />
            <TextField
              size="small"
              label="Estado"
              select
              value={filters.status ?? ''}
              onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value || undefined }))}
              SelectProps={{ native: true }}
              sx={{ minWidth: 150 }}
            >
              <option value="">Todos</option>
              <option value="ACTIVO">ACTIVO</option>
              <option value="DEVUELTO">DEVUELTO</option>
              <option value="VENCIDO">VENCIDO</option>
            </TextField>
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
          <Stack spacing={3}>
            {items.map((loan, idx) => (
              <Paper key={(loan.id ?? idx).toString()} sx={{ p: 2, bgcolor: '#eeeeee' }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }}>
                  {/* Columna 1: Prestamista */}
                  <Typography sx={{ minWidth: 180, fontWeight: 700 }}>
                    {loan.borrower || 'PRESTAMISTA'}
                  </Typography>

                  {/* Columna 2: Monitor */}
                  <Typography sx={{ minWidth: 140, fontWeight: 700 }}>
                    {(loan as any)?.monitor ?? 'MONITOR'}
                  </Typography>

                  {/* Columna 3: Fechas */}
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 700 }}>
                      Fecha préstamo {loan.start_date ?? '—'}
                    </Typography>
                    <Typography sx={{ fontWeight: 700 }}>
                      Fecha devolución {loan.end_date ?? '—'}
                    </Typography>
                  </Box>

                  {/* Columna 3.1: Estado */}
                  <Box sx={{ minWidth: 140, display: 'flex', justifyContent: 'flex-start' }}>
                    <Chip
                      label={loan.status ?? '—'}
                      color={loan.status === 'ACTIVO' ? 'success' : loan.status === 'CANCELADO' ? 'warning' : 'default'}
                      size="small"
                    />
                  </Box>

                  {/* Columna 4: Botones */}
                  <Stack direction={{ xs: 'row' }} spacing={1} sx={{ ml: { md: 'auto' } }}>
                    <Button variant="outlined" onClick={() => openDetail(loan.id)}>Ver detalle</Button>
                    <Button variant="contained" color="success" onClick={() => handleClose(loan.id)} sx={{ color: '#fff' }}>
                      Cerrar
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            ))}

            {!items.length && !error && (
              <Typography color="text.secondary" sx={{ textAlign: 'center', py: 6 }}>
                No hay préstamos para mostrar
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
      </Box>

      {/* Detalle de préstamo */}
      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h4" sx={{ textTransform: 'uppercase', fontWeight: 'bold', textAlign: 'center', borderBottom: '4px solid #757575', display: 'inline-block', px: 2 }}>
            Detalle préstamo
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} sx={{ mb: 3 }}>
            <Stack spacing={1} sx={{ minWidth: 240 }}>
              <Typography sx={{ fontWeight: 700 }}>Prestamista</Typography>
              <Typography>{detailLoan?.borrower ?? '—'}</Typography>
              <Typography sx={{ fontWeight: 700, mt: 2 }}>Monitor</Typography>
              <Typography>{(detailLoan as any)?.monitor ?? '—'}</Typography>
            </Stack>
            <Stack spacing={1} sx={{ minWidth: 280 }}>
              <Typography sx={{ fontWeight: 700 }}>Fecha préstamo</Typography>
              <Typography>{detailLoan?.start_date ?? '—'}</Typography>
              <Typography sx={{ fontWeight: 700, mt: 2 }}>Fecha devolución</Typography>
              <Typography>{detailLoan?.end_date ?? '—'}</Typography>
            </Stack>
          </Stack>

          <Paper variant="outlined" sx={{ mb: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#eeeeee' }}>
                  <TableCell sx={{ fontWeight: 700 }}>Devolución</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Equipo</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {((detailLoan as any)?.items ?? []).map((it: any, idx: number) => {
                  const key = String(it?.id ?? it?.serial ?? idx);
                  return (
                    <TableRow key={key}>
                      <TableCell width={120}>
                        <Checkbox checked={!!returnMap[key]} onChange={() => toggleReturn(key)} />
                      </TableCell>
                      <TableCell>{it?.name ?? it?.serial ?? `Equipo ${idx + 1}`}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setDetailOpen(false)}>Cancelar</Button>
          <Button variant="contained" color="success" onClick={submitReturns}>
            Devolver equipo(s)
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LoanPage;
