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
  Alert,
  Chip,
  IconButton,
} from "@mui/material";
import { Close, Add, Delete } from "@mui/icons-material";
import { useCreateLoan } from "../../hook/useCreateLoan";
import type { CreateLoanRequest } from "../../model/Loan";

interface CreateLoanDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateLoanDialog = ({ open, onClose, onSuccess }: CreateLoanDialogProps) => {
  const { createLoanMutation, loading, error } = useCreateLoan();
  const [formData, setFormData] = useState<Omit<CreateLoanRequest, 'action'>>({
    id_lender: "",
    id_monitor: "",
    serials_hardware: [],
  });
  const [newSerial, setNewSerial] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createLoanMutation(formData);
      onSuccess();
      onClose();
      handleReset();
    } catch (error) {
      console.error("Error creating loan:", error);
    }
  };

  const handleReset = () => {
    setFormData({
      id_lender: "",
      id_monitor: "",
      serials_hardware: [],
    });
    setNewSerial("");
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const addSerial = () => {
    if (newSerial.trim() && !formData.serials_hardware.includes(newSerial.trim())) {
      setFormData(prev => ({
        ...prev,
        serials_hardware: [...prev.serials_hardware, newSerial.trim()]
      }));
      setNewSerial("");
    }
  };

  const removeSerial = (serialToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      serials_hardware: prev.serials_hardware.filter(serial => serial !== serialToRemove)
    }));
  };

  const isFormValid = formData.id_lender && formData.id_monitor && formData.serials_hardware.length > 0;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6">Crear Nuevo Préstamo</Typography>
        <IconButton onClick={handleClose} disabled={loading}>
          <Close />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Prestamista */}
            <TextField
              label="ID del Prestamista"
              value={formData.id_lender}
              onChange={(e) => setFormData(prev => ({ ...prev, id_lender: e.target.value }))}
              required
              fullWidth
              disabled={loading}
              placeholder="Ej: 3f21a7e2-6b45-4b92-91d3-bc9a1234abcd"
              helperText="ID del prestamista que recibirá el hardware"
            />

            {/* Monitor */}
            <TextField
              label="ID del Monitor"
              value={formData.id_monitor}
              onChange={(e) => setFormData(prev => ({ ...prev, id_monitor: e.target.value }))}
              required
              fullWidth
              disabled={loading}
              placeholder="Ej: 7c82f5e4-9c22-478a-bd83-d9c5678efghi"
              helperText="ID del monitor responsable del préstamo"
            />

            {/* Hardware */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Hardware a Prestar *
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  label="Serial del Hardware"
                  value={newSerial}
                  onChange={(e) => setNewSerial(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSerial();
                    }
                  }}
                  disabled={loading}
                  placeholder="Ej: HW-1001"
                  sx={{ flexGrow: 1 }}
                  size="small"
                />
                <Button
                  onClick={addSerial}
                  disabled={!newSerial.trim() || loading}
                  variant="outlined"
                  startIcon={<Add />}
                  size="small"
                >
                  Agregar
                </Button>
              </Box>

              {formData.serials_hardware.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.serials_hardware.map((serial) => (
                    <Chip
                      key={serial}
                      label={serial}
                      onDelete={() => removeSerial(serial)}
                      deleteIcon={<Delete />}
                      color="primary"
                      variant="outlined"
                      disabled={loading}
                    />
                  ))}
                </Box>
              )}

              {formData.serials_hardware.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  Agregue al menos un serial de hardware para el préstamo
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!isFormValid || loading}
          >
            {loading ? "Creando..." : "Crear Préstamo"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateLoanDialog;