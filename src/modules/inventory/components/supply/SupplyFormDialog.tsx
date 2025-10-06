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
  Add as AddIcon,
  Inventory as InventoryIcon,
} from "@mui/icons-material";
import { useState, useCallback } from "react";
import { useCreateSupply } from "../../hooks/supply/useCreateSupply";
import type { CreateSupplyRequest } from "../../service/supply/postSupply";
import type { Supply } from "../../model/Supply";

interface SupplyFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (newSupply: Supply) => void;
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

export const SupplyFormDialog = ({ open, onClose, onSuccess }: SupplyFormDialogProps) => {
  const { loading, error, createSupply, clearError } = useCreateSupply();
  
  const [formData, setFormData] = useState<CreateSupplyRequest>({
    code: "",
    name: "",
    description: "",
    supply_type: "",
    count: "",
    quantity: "",
  });

  const handleInputChange = useCallback((field: keyof CreateSupplyRequest) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: unknown } }) => {
      const value = event.target.value;
      setFormData(prev => ({
        ...prev,
        [field]: field === 'count' || field === 'quantity' 
          ? Number(value)
          : value,
      }));
    }, []
  );

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    const result = await createSupply(formData);
    
    if (result) {
      onSuccess(result);
      onClose();
      setFormData({
        code: "",
        name: "",
        description: "",
        supply_type: "",
        count: "",
        quantity: "",
      });
    }
  }, [formData, createSupply, onSuccess, onClose]);

  const handleClose = useCallback(() => {
    clearError();
    setFormData({
      code: "",
      name: "",
      description: "",
      supply_type: "",
      count: "",
      quantity: "",
    });
    onClose();
  }, [clearError, onClose]);

  const generateCode = useCallback(() => {
    const timestamp = Date.now().toString();
    const paddedCode = `SUP${timestamp.padStart(30, '0')}`;
    setFormData(prev => ({ ...prev, code: paddedCode }));
  }, []);

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
          Crear Nuevo Suministro
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
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <TextField
                label="Código"
                value={formData.code}
                onChange={handleInputChange("code")}
                fullWidth
                required
                disabled={loading}
                placeholder="SUP000000000000000000000000000001"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& input": { color: "#000", fontFamily: "monospace" }
                  }
                }}
              />
              <Button
                variant="outlined"
                size="small"
                onClick={generateCode}
                disabled={loading}
                sx={{ borderRadius: 2, minWidth: 120 }}
              >
                Generar
              </Button>
            </Box>
            <TextField
              label="Nombre del Suministro"
              value={formData.name}
              onChange={handleInputChange("name")}
              fullWidth
              required
              disabled={loading}
              placeholder="Resistencia 100 Ohm"
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
              placeholder="Resistencia para circuitos electrónicos de 100 Ohm."
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
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& input": { color: "#000" }
                  }
                }}
              />
            </Box>
            <Alert severity="info">
              <Typography variant="body2">
                <strong>Conteo:</strong> Cantidad actual en stock<br />
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
            startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
            sx={{ borderRadius: 2 }}
          >
            {loading ? "Creando..." : "Crear Suministro"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SupplyFormDialog;