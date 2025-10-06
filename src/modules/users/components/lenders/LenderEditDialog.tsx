import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Typography,
  IconButton,
} from '@mui/material';
import {
  Close as CloseIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useState, useCallback, useEffect } from 'react';
import { useLenderMutations } from '../../hook/useLenderMutations';
import type { UpdateLenderRequest } from '../../service/updateLenders';
import type { Lender } from '../../model/Lender';

interface LenderEditDialogProps {
  open: boolean;
  lender: Lender | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const LenderEditDialog = ({ open, lender, onClose, onSuccess }: LenderEditDialogProps) => {
  const { updateLenderLoading, updateLenderError, handleUpdateLender } = useLenderMutations();
  
  const [formData, setFormData] = useState<UpdateLenderRequest>({
    names: '',
    surnames: '',
    email: '',
    phone: '',
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (open && lender) {
      const initialData = {
        names: lender.names || '',
        surnames: lender.surnames || '',
        email: lender.email || '',
        phone: lender.phone || '',
      };
      setFormData(initialData);
      setHasChanges(false);
    }
  }, [open, lender]);

  const resetForm = useCallback(() => {
    if (lender) {
      const initialData = {
        names: lender.names || '',
        surnames: lender.surnames || '',
        email: lender.email || '',
        phone: lender.phone || '',
      };
      setFormData(initialData);
      setHasChanges(false);
    }
  }, [lender]);

  const handleInputChange = useCallback((field: keyof UpdateLenderRequest) => 
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
      setHasChanges(true);
    }, []
  );

  const getChangedFields = useCallback((): UpdateLenderRequest => {
    if (!lender) return {};
    
    const changes: UpdateLenderRequest = {};
    
    if (formData.names !== lender.names) {
      changes.names = formData.names;
    }
    if (formData.surnames !== lender.surnames) {
      changes.surnames = formData.surnames;
    }
    if (formData.email !== lender.email) {
      changes.email = formData.email;
    }
    if (formData.phone !== lender.phone) {
      changes.phone = formData.phone;
    }
    
    return changes;
  }, [formData, lender]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!lender) return;
    
    const changedFields = getChangedFields();
    
    if (Object.keys(changedFields).length === 0) {
      onClose();
      return;
    }

    const success = await handleUpdateLender(lender.id, changedFields);
    
    if (success) {
      resetForm();
      onClose();
      onSuccess?.();
    }
  }, [lender, getChangedFields, handleUpdateLender, resetForm, onClose, onSuccess]);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  if (!lender) {
    return null;
  }

  const changedFields = getChangedFields();
  const isFormValid = formData.names && formData.surnames && formData.email;
  const hasValidChanges = Object.keys(changedFields).length > 0 && isFormValid;

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
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1 
      }}>
        <Typography variant="h6" sx={{ color: '#000', fontWeight: 'bold' }}>
          Editar Prestamista: {lender.names} {lender.surnames}
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 2 }}>
          {updateLenderError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {updateLenderError}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Información no editable */}
            <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: '#000', mb: 1 }}>
              Información del Sistema (No editable)
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <TextField
                label="ID del Sistema"
                value={lender.id}
                fullWidth
                disabled
                sx={{
                  '& .MuiInputLabel-root': { color: '#000' },
                  '& .MuiOutlinedInput-input': { color: '#000' }
                }}
              />
              <TextField
                label="RFID"
                value={lender.rfid || 'No asignado'}
                fullWidth
                disabled
                sx={{
                  '& .MuiInputLabel-root': { color: '#000' },
                  '& .MuiOutlinedInput-input': { color: '#000' }
                }}
              />
            </Box>

            {/* Información editable */}
            <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: '#000', mb: 1, mt: 2 }}>
              Información Personal
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <TextField
                label="Nombres"
                value={formData.names}
                onChange={handleInputChange('names')}
                fullWidth
                required
                sx={{
                  '& .MuiInputLabel-root': { color: '#000' },
                  '& .MuiOutlinedInput-input': { color: '#000' }
                }}
              />
              <TextField
                label="Apellidos"
                value={formData.surnames}
                onChange={handleInputChange('surnames')}
                fullWidth
                required
                sx={{
                  '& .MuiInputLabel-root': { color: '#000' },
                  '& .MuiOutlinedInput-input': { color: '#000' }
                }}
              />
            </Box>

            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              fullWidth
              required
              sx={{
                '& .MuiInputLabel-root': { color: '#000' },
                '& .MuiOutlinedInput-input': { color: '#000' }
              }}
            />

            <TextField
              label="Teléfono"
              value={formData.phone}
              onChange={handleInputChange('phone')}
              fullWidth
              sx={{
                '& .MuiInputLabel-root': { color: '#000' },
                '& .MuiOutlinedInput-input': { color: '#000' }
              }}
            />
            {hasChanges && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Campos modificados: {Object.keys(changedFields).join(', ')}
                </Typography>
              </Alert>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            disabled={updateLenderLoading}
            sx={{ mr: 1 }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={updateLenderLoading || !hasValidChanges}
            startIcon={updateLenderLoading ? <CircularProgress size={16} /> : <SaveIcon />}
            sx={{ borderRadius: 2 }}
          >
            {updateLenderLoading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default LenderEditDialog;