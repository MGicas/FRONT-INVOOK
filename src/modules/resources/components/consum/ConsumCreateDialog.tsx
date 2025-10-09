import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Close as CloseIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Inventory as InventoryIcon,
} from "@mui/icons-material";
import { usePostConsum } from "../../hook/usePostConsum";
import type { ConsumCreateRequest } from "../../model/Consum";

interface Supply {
  id: string;
  supply_name: string;
  quantity: number;
}

interface ConsumCreateDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ConsumCreateDialog = ({ open, onClose, onSuccess }: ConsumCreateDialogProps) => {
  const [idLender, setIdLender] = useState("");
  const [idMonitor, setIdMonitor] = useState("");
  const [supplies, setSupplies] = useState<Supply[]>([{ 
    id: crypto.randomUUID(), 
    supply_name: "", 
    quantity: 1 
  }]);
  
  const { createConsum, loading, error, success, clearState } = usePostConsum();

  const handleAddSupply = () => {
    setSupplies([...supplies, { 
      id: crypto.randomUUID(), 
      supply_name: "", 
      quantity: 1 
    }]);
  };

  const handleRemoveSupply = (id: string) => {
    if (supplies.length > 1) {
      setSupplies(supplies.filter((supply) => supply.id !== id));
    }
  };

  const handleSupplyChange = (id: string, field: keyof Omit<Supply, 'id'>, value: string | number) => {
    const updatedSupplies = supplies.map((supply) =>
      supply.id === id ? { ...supply, [field]: value } : supply
    );
    setSupplies(updatedSupplies);
  };

  const handleSubmit = async () => {
    if (!idLender.trim() || !idMonitor.trim()) {
      return;
    }

    const validSupplies = supplies
      .filter(supply => supply.supply_name.trim() && supply.quantity > 0)
      .map((supply) => ({
        supply_name: supply.supply_name,
        quantity: supply.quantity
      })); // Excluir el ID local

    if (validSupplies.length === 0) {
      return;
    }

    const data: ConsumCreateRequest = {
      id_lender: idLender.trim(),
      id_monitor: idMonitor.trim(),
      supplies: validSupplies,
    };

    const result = await createConsum(data);
    if (result) {
      handleClose();
      onSuccess();
    }
  };

  const handleClose = () => {
    setIdLender("");
    setIdMonitor("");
    setSupplies([{ 
      id: crypto.randomUUID(), 
      supply_name: "", 
      quantity: 1 
    }]);
    clearState();
    onClose();
  };

  const isFormValid = 
    idLender.trim() && 
    idMonitor.trim() && 
    supplies.some(supply => supply.supply_name.trim() && supply.quantity > 0);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 2,
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          pb: 1,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <InventoryIcon color="primary" />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="div">
            Crear Nuevo Consumo
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Registra un nuevo consumo de suministros
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{ minWidth: "auto", p: 1 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Consumo creado exitosamente
          </Alert>
        )}

        {/* Información del Consumo */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Información General
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField
              label="ID Prestamista"
              value={idLender}
              onChange={(e) => setIdLender(e.target.value)}
              disabled={loading}
              fullWidth
              required
              placeholder="Ingresa el ID del prestamista"
            />
            <TextField
              label="ID Monitor"
              value={idMonitor}
              onChange={(e) => setIdMonitor(e.target.value)}
              disabled={loading}
              fullWidth
              required
              placeholder="Ingresa el ID del monitor"
            />
          </Box>
        </Box>

        {/* Suministros */}
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6">
              Suministros
            </Typography>
            <Button
              startIcon={<AddIcon />}
              onClick={handleAddSupply}
              disabled={loading}
              size="small"
              variant="outlined"
            >
              Agregar Suministro
            </Button>
          </Box>

          {supplies.map((supply) => (
            <Paper
              key={supply.id}
              variant="outlined"
              sx={{ p: 2, mb: 2, bgcolor: "grey.50" }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <TextField
                  label="Nombre del Suministro"
                  value={supply.supply_name}
                  onChange={(e) => handleSupplyChange(supply.id, "supply_name", e.target.value)}
                  disabled={loading}
                  fullWidth
                  required
                  placeholder="Ej: Cable HDMI, Proyector Epson..."
                />
                <TextField
                  label="Cantidad"
                  type="number"
                  value={supply.quantity}
                  onChange={(e) => handleSupplyChange(supply.id, "quantity", parseInt(e.target.value) || 1)}
                  disabled={loading}
                  required
                  sx={{ minWidth: "120px" }}
                  slotProps={{ 
                    htmlInput: { min: 1 } 
                  }}
                />
                {supplies.length > 1 && (
                  <IconButton
                    onClick={() => handleRemoveSupply(supply.id)}
                    disabled={loading}
                    color="error"
                    sx={{ minWidth: "auto" }}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            </Paper>
          ))}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1, gap: 2 }}>
        <Button 
          onClick={handleClose} 
          disabled={loading}
          variant="outlined"
          sx={{ minWidth: "100px" }}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={loading || !isFormValid}
          variant="contained"
          sx={{ minWidth: "100px" }}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Crear Consumo"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConsumCreateDialog;