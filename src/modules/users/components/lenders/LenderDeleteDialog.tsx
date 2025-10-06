import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  IconButton,
} from '@mui/material';
import {
  Close as CloseIcon,
  Warning as WarningIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useCallback } from 'react';
import { useLenderMutations } from '../../hook/useLenderMutations';
import type { Lender } from '../../model/Lender';

interface LenderDeleteDialogProps {
  open: boolean;
  lender: Lender | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const LenderDeleteDialog = ({ open, lender, onClose, onSuccess }: LenderDeleteDialogProps) => {
  const { deleteLenderLoading, deleteLenderError, handleDeleteLender } = useLenderMutations();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!lender) return;

    const success = await handleDeleteLender(lender.id);
    
    if (success) {
      onClose();
      onSuccess?.();
    }
  }, [lender, handleDeleteLender, onClose, onSuccess]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!lender) return null;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: 2 }
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon sx={{ color: 'warning.main' }} />
          <Typography variant="h6" sx={{ color: '#000', fontWeight: 'bold' }}>
            Eliminar Prestamista
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 2 }}>
          {deleteLenderError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {deleteLenderError}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="body1" sx={{ color: '#000' }}>
              ¿Está seguro que desea eliminar al prestamista <strong>{lender.names} {lender.surnames}</strong>?
            </Typography>
            
            <Box sx={{ 
              p: 2, 
              bgcolor: 'grey.50', 
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'grey.300'
            }}>
              <Typography variant="body2" sx={{ color: '#000', mb: 1, fontWeight: 'medium' }}>
                Información del Prestamista:
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                <strong>ID:</strong> {lender.id}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                <strong>Email:</strong> {lender.email}
              </Typography>
              {lender.phone && (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  <strong>Teléfono:</strong> {lender.phone}
                </Typography>
              )}
              {lender.rfid && (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  <strong>RFID:</strong> {lender.rfid}
                </Typography>
              )}
            </Box>

            <Alert severity="warning">
              <Typography variant="body2">
                Esta acción cambiará el estado del prestamista a inactivo. Los datos se mantendrán en el sistema pero el prestamista ya no estará disponible para nuevas operaciones.
              </Typography>
            </Alert>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            disabled={deleteLenderLoading}
            sx={{ mr: 1 }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="error"
            disabled={deleteLenderLoading}
            startIcon={deleteLenderLoading ? <CircularProgress size={16} /> : <DeleteIcon />}
            sx={{ borderRadius: 2 }}
          >
            {deleteLenderLoading ? 'Eliminando...' : 'Eliminar Prestamista'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default LenderDeleteDialog;