import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Container,
  IconButton,
  TextField,
  Typography,
  Paper,
  Stack,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import SupplyService, { type SupplyPayload } from "../../service/SupplyService";
import SupplyFormDialog from "./SupplyFormDialog";

type Supply = SupplyPayload & { stock?: number };

const SupplyPage = () => {
  const [items, setItems] = useState<Supply[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Supply | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<Supply | null>(null);

  const title = useMemo(() => "Consumibles", []);

  const loadAll = async (pageArg = page) => {
    setIsLoading(true);
    setError("");
    try {
      const data = await SupplyService.list({ page: pageArg, page_size: pageSize });
      if (data && typeof data === "object" && "results" in data) {
        const pag = data as { results: Supply[]; count: number };
        setItems(pag.results);
        setTotalCount(pag.count);
      } else if (Array.isArray(data)) {
        setItems(data);
        setTotalCount(data.length);
      } else {
        setItems([]);
        setTotalCount(0);
      }
    } catch (e: any) {
      setError(e?.message ?? "Error cargando consumibles");
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
    setError("");
    try {
      // 1) Buscar por código exacto
      try {
        const byCode = await SupplyService.get(query.trim());
        if (byCode) {
          setItems([byCode]);
          setTotalCount(1);
          return;
        }
      } catch (_) {
        // ignora y continúa al filtro por nombre
      }

      // 2) Filtro por nombre en backend
      const data = await SupplyService.list({ name: query.trim(), page: 1, page_size: pageSize });
      if (data && typeof data === 'object' && 'results' in data) {
        const pag = data as { results: Supply[]; count: number };
        setItems(pag.results);
        setTotalCount(pag.count);
      } else if (Array.isArray(data)) {
        setItems(data);
        setTotalCount(data.length);
      } else {
        setItems([]);
        setTotalCount(0);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskDelete = (supply: Supply) => setDeleteTarget(supply);
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await SupplyService.remove(deleteTarget.code);
      setDeleteTarget(null);
      await loadAll();
    } catch (e: any) {
      setError(e?.message ?? 'Error eliminando consumible');
    }
  };
  const handleCancelDelete = () => setDeleteTarget(null);

  const handleEdit = (supply: Supply) => {
    setEditing(supply);
    setOpenForm(true);
  };

  const handleAdd = () => {
    setEditing(null);
    setOpenForm(true);
  };

  // Guardado se gestiona dentro del modal y luego se refresca la lista vía onSave

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
              placeholder="Busca consumible por código o nombre"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={handleAdd}>
              Agregar consumible
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
              {items.map((supply) => (
                <ListItem key={supply.code} sx={{ bgcolor: '#eeeeee', mb: 2 }}>
                  <ListItemText
                    primary={supply.name}
                    secondary={`Cantidad: ${supply.count ?? '-'} | Stock: ${supply.stock ?? '-'}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => handleEdit(supply)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleAskDelete(supply)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>

            {!items.length && !error && (
              <Typography color="text.secondary" sx={{ textAlign: 'center', py: 6 }}>
                No hay consumibles para mostrar
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

        <SupplyFormDialog
          open={openForm}
          onClose={() => setOpenForm(false)}
          supply={editing}
          onSave={async () => { setOpenForm(false); await loadAll(); }}
        />
      </Box>
      <Dialog open={!!deleteTarget} onClose={handleCancelDelete}>
        <DialogTitle>Eliminar consumible</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Seguro que deseas eliminar el consumible {deleteTarget?.code}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={handleConfirmDelete}>Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SupplyPage;
