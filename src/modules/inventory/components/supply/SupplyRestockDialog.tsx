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
  TextField,
  Chip,
} from "@mui/material";
import {
  Inventory as InventoryIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useCallback, useState, useEffect } from "react";
import { useRestockSupply } from "../../hooks/supply/useRestockSupply";
import type { Supply } from "../../model/Supply";

interface SupplyRestockDialogProps {
  open: boolean;
  supply: Supply | null;
  onClose: () => void;
  onSuccess: (updatedSupply: Supply) => void;
}

export const SupplyRestockDialog = ({
  open,
  supply,
  onClose,
  onSuccess,
}: SupplyRestockDialogProps) => {
  const { loading, error, restockSupply, clearError } = useRestockSupply();
  const [count, setCount] = useState<number | string>(0);
  const [quantity, setQuantity] = useState<number | string>(0);

  useEffect(() => {
    if (open && supply) {
      setCount("");
      setQuantity("");
      clearError();
    }
  }, [open, supply, clearError]);

  const handleConfirm = useCallback(async () => {
    if (!supply?.code || Number(count) <= 0 || Number(quantity) <= 0) {
      return;
    }

    const result = await restockSupply(supply.code, {
      count: Number(count),
      quantity: Number(quantity),
    });

    if (result) {
      onSuccess(result);
      onClose();
    }
  }, [supply, count, quantity, restockSupply, onSuccess, onClose]);

  const handleClose = useCallback(() => {
    clearError();
    onClose();
  }, [clearError, onClose]);

  const isFormValid = Number(count) > 0 && Number(quantity) > 0;

  if (!supply) {
    return null;
  }
  const stockPercentage = supply.quantity > 0 ? (supply.stock / supply.quantity) * 100 : 0;
  const isLowStock = stockPercentage < 20;
  const isMediumStock = stockPercentage >= 20 && stockPercentage < 50;

  const getStockChipColor = () => {
    if (isLowStock) return "error";
    if (isMediumStock) return "warning";
    return "success";
  };

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
        <InventoryIcon color="primary" />
        <Typography variant="h6" component="div">
          Reabastecer Suministro
        </Typography>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
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
                <strong>Stock Actual:</strong> {supply.stock}
              </Typography>
              <Typography variant="body2" sx={{ color: "#000" }}>
                <strong>Cantidad Total:</strong> {supply.quantity}
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                <Chip
                  label={supply.supply_type}
                  size="small"
                  variant="outlined"
                  sx={{ borderRadius: 1 }}
                />
                <Chip
                  label={`${stockPercentage.toFixed(1)}% Stock`}
                  size="small"
                  color={getStockChipColor()}
                  sx={{ borderRadius: 1 }}
                />
              </Box>
            </Box>
          </Box>
          {isLowStock && (
            <Alert severity="error">
              <Typography variant="body2">
                <strong>Stock Crítico:</strong> Este suministro tiene menos del 20% de stock disponible.
              </Typography>
            </Alert>
          )}

          {isMediumStock && (
            <Alert severity="warning">
              <Typography variant="body2">
                <strong>Stock Bajo:</strong> Este suministro tiene menos del 50% de stock disponible.
              </Typography>
            </Alert>
          )}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#000" }}>
              Cantidades a Agregar:
            </Typography>

            <TextField
              label="Cajas"
              type="number"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              disabled={loading}
              slotProps={{ htmlInput: { min: 1 } }}
              helperText="Número de cajas a solicitar"
              fullWidth
            />

            <TextField
              label="Unidades"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              disabled={loading}
              slotProps={{ htmlInput: { min: 1 } }}
              helperText="Cantidad total a agregar al stock"
              fullWidth
            />

            {Number(count) > 0 && Number(quantity) > 0 && (
              <Box
                sx={{
                  p: 2,
                  bgcolor: "primary.50",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "primary.200",
                }}
              >
                <Typography variant="body2" sx={{ color: "primary.800", fontWeight: "medium" }}>
                  <strong>Nuevo Stock:</strong> {supply.stock + Number(quantity)} unidades
                </Typography>
                <Typography variant="body2" sx={{ color: "primary.700" }}>
                  <strong>Nueva Cantidad Total:</strong> {supply.quantity + Number(quantity)} unidades
                </Typography>
              </Box>
            )}
          </Box>
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
          color="primary"
          disabled={loading || !isFormValid}
          startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
          sx={{ borderRadius: 2 }}
        >
          {loading ? "Reabasteciendo..." : "Reabastecer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SupplyRestockDialog;