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
import { useAddHardware } from "../../hook/useAddHardware";
import type { Loan } from "../../model/Loan";

interface AddHardwareDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  loan: Loan | null;
}

const AddHardwareDialog = ({ open, onClose, onSuccess, loan }: AddHardwareDialogProps) => {
  const { addHardwareMutation, loading, error } = useAddHardware();
  const [serials, setSerials] = useState<string[]>([]);
  const [newSerial, setNewSerial] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loan || serials.length === 0) return;

    try {
      await addHardwareMutation(loan.id, serials);
      onSuccess();
      onClose();
      handleReset();
    } catch (error) {
      console.error("Error adding hardware:", error);
    }
  };

  const handleReset = () => {
    setSerials([]);
    setNewSerial("");
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const addSerial = () => {
    if (newSerial.trim() && !serials.includes(newSerial.trim())) {
      setSerials(prev => [...prev, newSerial.trim()]);
      setNewSerial("");
    }
  };

  const removeSerial = (serialToRemove: string) => {
    setSerials(prev => prev.filter(serial => serial !== serialToRemove));
  };

  const isFormValid = serials.length > 0;

  if (!loan) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6">Agregar Hardware al Préstamo</Typography>
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
            {/* Información del préstamo */}
            <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Información del Préstamo
              </Typography>
              <Typography variant="body2">
                <strong>ID:</strong> {loan.id}
              </Typography>
              <Typography variant="body2">
                <strong>Prestamista:</strong> {loan.id_lender.names} {loan.id_lender.surnames}
              </Typography>
              <Typography variant="body2">
                <strong>Estado:</strong> {loan.status}
              </Typography>
            </Box>

            {/* Hardware actual */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Hardware Actual en el Préstamo ({loan.hardwares.length})
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {loan.hardwares.map((item) => (
                  <Chip
                    key={item.hardware.serial}
                    label={`${item.hardware.serial} - ${item.hardware.name}`}
                    color="info"
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>
            </Box>

            {/* Agregar nuevo hardware */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Agregar Nuevo Hardware *
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
                  placeholder="Ej: HW-2001"
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

              {serials.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {serials.map((serial) => (
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

              {serials.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  Agregue al menos un serial de hardware para añadir al préstamo
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
            {loading ? "Agregando..." : "Agregar Hardware"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddHardwareDialog;