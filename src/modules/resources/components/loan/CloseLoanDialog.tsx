import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  IconButton,
  Chip,
} from "@mui/material";
import { Close, Warning } from "@mui/icons-material";
import { useCloseLoan } from "../../hook/useCloseLoan";
import type { Loan } from "../../model/Loan";

interface CloseLoanDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  loan: Loan | null;
}

const CloseLoanDialog = ({ open, onClose, onSuccess, loan }: CloseLoanDialogProps) => {
  const { closeLoanMutation, loading, error } = useCloseLoan();

  const handleSubmit = async () => {
    if (!loan) return;

    try {
      await closeLoanMutation(loan.id);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error closing loan:", error);
    }
  };

  if (!loan) return null;

  const pendingHardware = loan.hardwares.filter(item => !item.returned_at);
  const returnedHardware = loan.hardwares.filter(item => item.returned_at);
  const canClose = loan.status === 'ABIERTO';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6">Cerrar Préstamo</Typography>
        <IconButton onClick={onClose} disabled={loading}>
          <Close />
        </IconButton>
      </DialogTitle>

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
              <strong>Estado Actual:</strong> 
              <Chip 
                label={loan.status} 
                color={loan.status === 'ABIERTO' ? 'warning' : 'success'} 
                size="small" 
                sx={{ ml: 1 }}
              />
            </Typography>
            <Typography variant="body2">
              <strong>Fecha Préstamo:</strong> {new Date(loan.loan_date).toLocaleDateString('es-ES')}
            </Typography>
            {loan.return_date && (
              <Typography variant="body2">
                <strong>Fecha Devolución:</strong> {new Date(loan.return_date).toLocaleDateString('es-ES')}
              </Typography>
            )}
          </Box>

          {/* Estado del hardware */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Estado del Hardware
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="success.main" gutterBottom>
                Hardware Devuelto ({returnedHardware.length})
              </Typography>
              {returnedHardware.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {returnedHardware.map((item) => (
                    <Chip
                      key={item.hardware.serial}
                      label={`${item.hardware.serial} - ${item.hardware.name}`}
                      color="success"
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No hay hardware devuelto
                </Typography>
              )}
            </Box>

            <Box>
              <Typography variant="body2" color="error.main" gutterBottom>
                Hardware Pendiente ({pendingHardware.length})
              </Typography>
              {pendingHardware.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {pendingHardware.map((item) => (
                    <Chip
                      key={item.hardware.serial}
                      label={`${item.hardware.serial} - ${item.hardware.name}`}
                      color="error"
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Todo el hardware ha sido devuelto
                </Typography>
              )}
            </Box>
          </Box>

          {/* Advertencias */}
          {!canClose && (
            <Alert severity="info" icon={<Warning />}>
              Este préstamo ya está cerrado y no puede ser modificado.
            </Alert>
          )}

          {canClose && pendingHardware.length > 0 && (
            <Alert severity="warning" icon={<Warning />}>
              <Typography variant="body2">
                <strong>Advertencia:</strong> Aún hay {pendingHardware.length} hardware(s) pendiente(s) de devolución. 
                Al cerrar el préstamo, estos equipos quedarán marcados como no devueltos.
              </Typography>
            </Alert>
          )}

          {canClose && pendingHardware.length === 0 && (
            <Alert severity="success">
              <Typography variant="body2">
                Todo el hardware ha sido devuelto correctamente. El préstamo está listo para ser cerrado.
              </Typography>
            </Alert>
          )}

          {/* Confirmación */}
          {canClose && (
            <Box sx={{ bgcolor: 'warning.50', p: 2, borderRadius: 1, border: 1, borderColor: 'warning.main' }}>
              <Typography variant="body2" color="warning.dark">
                <strong>Confirmación:</strong> Al cerrar este préstamo, no podrá ser modificado posteriormente. 
                Esta acción es permanente.
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color={pendingHardware.length > 0 ? "warning" : "primary"}
          disabled={!canClose || loading}
        >
          {loading ? "Cerrando..." : "Cerrar Préstamo"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CloseLoanDialog;