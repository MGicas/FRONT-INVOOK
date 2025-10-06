import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import {
  Warning as WarningIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useCallback } from "react";
import { useDeleteSupply } from "../../hooks/supply/useDeleteSupply";
import type { Supply } from "../../model/Supply";

interface SupplyDeleteDialogProps {
  open: boolean;
  supply: Supply | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const SupplyDeleteDialog = ({
  open,
  supply,
  onClose,
  onSuccess,
}: SupplyDeleteDialogProps) => {
  const { loading, error, deleteSupply, clearError } = useDeleteSupply();

  const handleConfirm = useCallback(async () => {
    if (!supply?.code) {
      return;
    }

    const result = await deleteSupply(supply.code);

    if (result) {
      onSuccess();
      onClose();
    }
  }, [supply, deleteSupply, onSuccess, onClose]);

  const handleClose = useCallback(() => {
    clearError();
    onClose();
  }, [clearError, onClose]);

  if (!supply) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: 2 },
        },
      }}
    >
      <DialogTitle
        sx={{ display: "flex", alignItems: "center", gap: 2, pb: 2 }}
      >
        <WarningIcon color="warning" />
        <Typography variant="h6" component="div">
          Confirmar Eliminación
        </Typography>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="body1" sx={{ color: "#000" }}>
            ¿Está seguro que desea eliminar el siguiente suministro?
          </Typography>

          <Box
            sx={{
              p: 2,
              bgcolor: "grey.50",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "grey.200",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: "bold", mb: 1, color: "#000" }}
            >
              Información del Suministro:
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography variant="body2" sx={{ color: "#000" }}>
                <strong>Código:</strong> {supply.code}
              </Typography>
              <Typography variant="body2" sx={{ color: "#000" }}>
                <strong>Nombre:</strong> {supply.name}
              </Typography>
              <Typography variant="body2" sx={{ color: "#000" }}>
                <strong>Descripción:</strong> {supply.description}
              </Typography>
              <Typography variant="body2" sx={{ color: "#000" }}>
                <strong>Stock:</strong> {supply.stock}
              </Typography>
              <Typography variant="body2" sx={{ color: "#000" }}>
                <strong>Cantidad:</strong> {supply.quantity}
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                <Chip
                  label={supply.supply_type}
                  size="small"
                  variant="outlined"
                  sx={{ borderRadius: 1 }}
                />
                <Chip
                  label={supply.count}
                  size="small"
                  color="primary"
                  sx={{ borderRadius: 1 }}
                />
              </Box>
            </Box>
          </Box>

          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Advertencia:</strong> Esta acción eliminará el suministro
              del sistema. Asegúrese de que realmente desea proceder con esta
              operación.
            </Typography>
          </Alert>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          sx={{ borderRadius: 2 }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="warning"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <DeleteIcon />}
          sx={{ borderRadius: 2 }}
        >
          {loading ? "Eliminando..." : "Eliminar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SupplyDeleteDialog;