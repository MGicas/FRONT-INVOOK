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
import { useDeactivateHardware } from "../../hooks/hardware/useDeactivateHardware";
import type { Hardware } from "../../model/Hardware";

interface HardwareDeactivateDialogProps {
  open: boolean;
  hardware: Hardware | null;
  onClose: () => void;
  onSuccess: (deactivatedHardware: Hardware) => void;
}

export const HardwareDeactivateDialog = ({
  open,
  hardware,
  onClose,
  onSuccess,
}: HardwareDeactivateDialogProps) => {
  const { loading, error, deactivateHardware, clearError } =
    useDeactivateHardware();

  const handleConfirm = useCallback(async () => {
    if (!hardware?.serial) {
      return;
    }

    const result = await deactivateHardware(hardware.serial);

    if (result) {
      onSuccess(result);
      onClose();
    }
  }, [hardware, deactivateHardware, onSuccess, onClose]);

  const handleClose = useCallback(() => {
    clearError();
    onClose();
  }, [clearError, onClose]);

  if (!hardware) {
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
          Confirmar Desactivación
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
            ¿Está seguro que desea eliminar el siguiente hardware?
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
              Información del Hardware:
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography variant="body2" sx={{ color: "#000" }}>
                <strong>Serial:</strong> {hardware.serial}
              </Typography>
              <Typography variant="body2" sx={{ color: "#000" }}>
                <strong>Nombre:</strong> {hardware.name}
              </Typography>
              <Typography variant="body2" sx={{ color: "#000" }}>
                <strong>Descripción:</strong> {hardware.description}
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                <Chip
                  label={hardware.hardware_type_name || hardware.hardware_type}
                  size="small"
                  variant="outlined"
                  sx={{ borderRadius: 1 }}
                />
                <Chip
                  label={hardware.state}
                  size="small"
                  color={hardware.state === "BUENO" ? "success" : "warning"}
                  sx={{ borderRadius: 1 }}
                />
              </Box>
            </Box>
          </Box>

          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Advertencia:</strong> Esta acción eliminará el hardware
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
          {loading ? "Desactivando..." : "Desactivar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HardwareDeactivateDialog;
