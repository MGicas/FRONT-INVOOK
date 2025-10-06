import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  CircularProgress,
  Alert,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Edit as EditIcon,
  Inventory as InventoryIcon,
} from "@mui/icons-material";
import { useState, useCallback, useEffect } from "react";
import { useUpdateSupply } from "../../hooks/supply/useUpdateSupply";
import type { UpdateSupplyRequest } from "../../service/supply/updateSupply";
import type { Supply } from "../../model/Supply";

interface SupplyEditDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (updatedSupply: Supply) => void;
  supply: Supply | null;
}

const SUPPLY_TYPES = [
  "Resistencia",
  "Capacitor",
  "Transistor",
  "Diodo",
  "Circuito Integrado",
  "Cable",
  "Conector",
  "Herramienta",
  "Equipo",
  "Material",
  "Consumible",
  "Otro",
];

export const SupplyEditDialog = ({ open, onClose, onSuccess, supply }: SupplyEditDialogProps) => {
  const { loading, error, updateSupply, clearError } = useUpdateSupply();
  
  const [formData, setFormData] = useState<UpdateSupplyRequest>({
    name: "",
    description: "",
    supply_type: "",
    count: 0,
    stock: 0,
    quantity: 0,
  });

  useEffect(() => {
    if (supply && open) {
      setFormData({
        name: supply.name || "",
        description: supply.description || "",
        supply_type: supply.supply_type || "",
        count: typeof supply.count === 'number' ? supply.count : Number(supply.count) || 0,
        stock: typeof supply.stock === 'number' ? supply.stock : Number(supply.stock) || 0,
        quantity: typeof supply.quantity === 'number' ? supply.quantity : Number(supply.quantity) || 0,
      });
    }
  }, [supply, open]);

  const handleInputChange = useCallback((field: keyof UpdateSupplyRequest) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: unknown } }) => {
      const value = event.target.value;
      setFormData(prev => ({
        ...prev,
        [field]: field === 'count' || field === 'stock' || field === 'quantity' 
          ? Number(value) || 0
          : value,
      }));
    }, []
  );

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!supply) return;

    const result = await updateSupply(supply.code, formData);
    
    if (result) {
      onSuccess(result);
      onClose();
    }
  }, [formData, supply, updateSupply, onSuccess, onClose]);

  const handleClose = useCallback(() => {
    clearError();
    onClose();
  }, [clearError, onClose]);

  if (!supply) return null;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: 2 }
        }
      }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 2, pb: 2 }}>
        <InventoryIcon color="primary" />
        <Typography variant="h6" component="div">
          Editar Suministro
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ py: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              label="Código"
              value={supply.code}
              fullWidth
              disabled
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& input": { color: "#666", fontFamily: "monospace" }
                }
              }}
            />
            <TextField
              label="Nombre del Suministro"
              value={formData.name}
              onChange={handleInputChange("name")}
              fullWidth
              required
              disabled={loading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& input": { color: "#000" }
                }
              }}
            />
            <TextField
              label="Descripción"
              value={formData.description}
              onChange={handleInputChange("description")}
              fullWidth
              multiline
              rows={3}
              required
              disabled={loading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& textarea": { color: "#000" }
                }
              }}
            />
            <FormControl fullWidth required disabled={loading}>
              <InputLabel>Tipo de Suministro</InputLabel>
              <Select
                value={formData.supply_type}
                label="Tipo de Suministro"
                onChange={handleInputChange("supply_type")}
                sx={{ color: "#000" }}
              >
                {SUPPLY_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Conteo (Stock Actual)"
                type="number"
                value={formData.count}
                onChange={handleInputChange("count")}
                fullWidth
                required
                disabled={loading}
                slotProps={{
                  htmlInput: { min: 0 }
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& input": { color: "#000" }
                  }
                }}
              />
              <TextField
                label="Stock"
                type="number"
                value={formData.stock}
                onChange={handleInputChange("stock")}
                fullWidth
                required
                disabled={loading}
                slotProps={{
                  htmlInput: { min: 0 }
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& input": { color: "#000" }
                  }
                }}
              />
              <TextField
                label="Cantidad (Stock Total)"
                type="number"
                value={formData.quantity}
                onChange={handleInputChange("quantity")}
                fullWidth
                required
                disabled={loading}
                slotProps={{
                  htmlInput: { min: 1 }
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& input": { color: "#000" }
                  }
                }}
              />
            </Box>
            <Alert severity="info">
              <Typography variant="body2">
                <strong>Conteo:</strong> Cantidad actual en inventario<br />
                <strong>Stock:</strong> Cantidad disponible para uso<br />
                <strong>Cantidad:</strong> Capacidad total de almacenamiento
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
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <EditIcon />}
            sx={{ borderRadius: 2 }}
          >
            {loading ? "Actualizando..." : "Actualizar Suministro"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SupplyEditDialog;