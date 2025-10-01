import { Box, Container, Typography, Paper, Stack, TextField, CircularProgress, List, ListItem, ListItemText, Button, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem } from '@mui/material';
import { useState, useMemo } from 'react';
import Pagination from '@mui/material/Pagination';
import { useConsum } from '../../hook/useConsum';

const ConsumPage = () => {
  const { items, isLoading, error, page, pageSize, totalCount, setPage, nameFilter, setNameFilter } = useConsum();
  const [deliverOpen, setDeliverOpen] = useState(false);
  const [cardId, setCardId] = useState('');
  const [docId, setDocId] = useState('');
  const [selectedCode, setSelectedCode] = useState('');
  const quantityOptions = useMemo(() => Array.from({ length: 20 }).map((_, i) => i + 1), []);
  const [qty, setQty] = useState<number>(1);

  // Detalle consumible
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<any | null>(null);
  const openDetail = (c: any) => {
    setDetailItem(c);
    setDetailOpen(true);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
            Consumos
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField
              size="small"
              placeholder="Buscar por nombre"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
            />
            <Button variant="contained" color="success" sx={{ color: '#fff' }} onClick={() => setDeliverOpen(true)}>
              Entregar consumible
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
          <>
            <List>
              {items.map((c) => (
                <Stack key={(c.id ?? c.code ?? Math.random()).toString()} direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <ListItem sx={{ bgcolor: '#eeeeee', flex: 1, borderRadius: 1 }}>
                    <ListItemText
                      primary={c.name}
                      secondary={`Monitor: ${(c as any).monitor ?? '-'} | Prestamista: ${(c as any).borrower ?? '-'}`}
                    />
                  </ListItem>
                  <Button variant="outlined" onClick={() => openDetail(c)}>
                    Ver detalle
                  </Button>
                </Stack>
              ))}
            </List>

            {!items.length && !error && (
              <Typography color="text.secondary" sx={{ textAlign: 'center', py: 6 }}>
                No hay consumos para mostrar
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
          </>
        )}

        {/* Modal Entregar consumible */}
        <Dialog open={deliverOpen} onClose={() => setDeliverOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h4" sx={{ textTransform: 'uppercase', fontWeight: 'bold', textAlign: 'center', borderBottom: '4px solid #757575', display: 'inline-block', px: 2 }}>
              Entregar consumible
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                placeholder="Carnet universitario"
                value={cardId}
                onChange={(e) => setCardId(e.target.value)}
                sx={{ bgcolor: '#fff', '& .MuiInputBase-input': { textAlign: 'center', fontWeight: 700 } }}
              />
              <TextField
                fullWidth
                placeholder="Documento de identidad"
                value={docId}
                onChange={(e) => setDocId(e.target.value)}
                sx={{ bgcolor: '#fff', '& .MuiInputBase-input': { textAlign: 'center', fontWeight: 700 } }}
              />
              <TextField
                select
                fullWidth
                placeholder="Consumible"
                value={selectedCode}
                onChange={(e) => setSelectedCode(e.target.value)}
                sx={{ bgcolor: '#fff', '& .MuiInputBase-input': { textAlign: 'center', fontWeight: 700 } }}
              >
                {items.map((c) => (
                  <MenuItem key={(c.id ?? c.code ?? Math.random()).toString()} value={(c.code ?? c.id ?? '').toString()}>
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>

              <Stack direction="row" spacing={1} alignItems="center">
                <TextField
                  fullWidth
                  placeholder="Cantidad"
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value) || 1)}
                  sx={{ bgcolor: '#fff', '& .MuiInputBase-input': { textAlign: 'center', fontWeight: 700 } }}
                />
                <TextField select value={qty} onChange={(e) => setQty(Number(e.target.value) || 1)} sx={{ minWidth: 120 }}>
                  {quantityOptions.map((n) => (
                    <MenuItem key={n} value={n}>{n}</MenuItem>
                  ))}
                </TextField>
              </Stack>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
            <Button variant="contained" color="success" sx={{ color: '#fff' }} onClick={() => { /* TODO: enviar al backend */ setDeliverOpen(false); }}>
              Agregar consumible
            </Button>
          </DialogActions>
        </Dialog>

        {/* Modal Ver detalle consumible */}
        <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h4" sx={{ textTransform: 'uppercase', fontWeight: 'bold', textAlign: 'center', borderBottom: '4px solid #757575', display: 'inline-block', px: 2 }}>
              Detalle consumible
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Typography sx={{ fontWeight: 700 }}>{detailItem?.name ?? '—'}</Typography>
              <Typography color="text.secondary">
                Código: {(detailItem?.code ?? detailItem?.id ?? '—').toString()}
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Typography>Monitor: {(detailItem as any)?.monitor ?? '—'}</Typography>
                <Typography>Prestamista: {(detailItem as any)?.borrower ?? '—'}</Typography>
              </Stack>
              {detailItem?.description && (
                <Typography color="text.secondary">{detailItem.description}</Typography>
              )}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailOpen(false)}>Cerrar</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default ConsumPage;
