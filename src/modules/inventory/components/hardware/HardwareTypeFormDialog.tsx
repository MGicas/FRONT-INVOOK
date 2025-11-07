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
import { useCreateHardwareType } from '../../hooks/hardwareType/useCreateHardwareType';

interface HardwareTypeFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (data: { id: string; name: string; description: string }) => void;
}

export const HardwareTypeFormDialog = ({ open, onClose, onSuccess }: HardwareTypeFormDialogProps) => {
  const { createHardwareType, loading, error, clearState } = useCreateHardwareType();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const resetForm = useCallback(() => {
    setFormData({name: '', description: '' });
    clearState();
  }, [clearState]);

  const handleInputChange = useCallback(
    (field: keyof typeof formData) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData(prev => ({ ...prev, [field]: event.target.value }));
    },
    []
  );

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createHardwareType(formData);
    if (result && onSuccess) {
      onSuccess(result);
    }
    if (result) {
      resetForm();
      onClose();
    }
  }, [formData, createHardwareType, onSuccess, resetForm, onClose]);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  useEffect(() => {
    if (open) {
      clearState();
    }
  }, [open, clearState]);

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: { sx: { borderRadius: 2 } }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6" sx={{ color: '#000', fontWeight: 'bold' }}>
          Crear Tipo de Hardware
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Nombre"
              value={formData.name}
              onChange={handleInputChange('name')}
              fullWidth
              required
              placeholder="Ej: Cables"
              sx={{
                '& .MuiInputLabel-root': { color: '#000' },
                '& .MuiOutlinedInput-input': { color: '#000' }
              }}
            />
            <TextField
              label="Descripción"
              value={formData.description}
              onChange={handleInputChange('description')}
              fullWidth
              required
              multiline
              rows={3}
              placeholder="Ej: Cables para multímetro"
              sx={{
                '& .MuiInputLabel-root': { color: '#000' },
                '& .MuiOutlinedInput-input': { color: '#000' }
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button onClick={handleClose} variant="outlined" disabled={loading} sx={{ mr: 1 }}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={loading} startIcon={loading ? <CircularProgress size={16} /> : <SaveIcon />} sx={{ borderRadius: 2 }}>
            {loading ? 'Creando...' : 'Crear Tipo'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default HardwareTypeFormDialog;
