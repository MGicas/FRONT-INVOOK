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
import type { CreateLenderRequest } from '../../service/postLender';

interface LenderFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const LenderFormDialog = ({ open, onClose, onSuccess }: LenderFormDialogProps) => {
  const { createLenderLoading, createLenderError, handleCreateLender } = useLenderMutations();
  
  const [formData, setFormData] = useState<CreateLenderRequest>({
    id: '',
    rfid: '',
    names: '',
    surnames: '',
    email: '',
    phone: '',
  });

  const resetForm = useCallback(() => {
    setFormData({
      id: '',
      rfid: '',
      names: '',
      surnames: '',
      email: '',
      phone: '',
    });
  }, []);

  const handleInputChange = useCallback((field: keyof CreateLenderRequest) => 
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData(prev => ({
        ...prev,
        [field]: event.target.value
      }));
    }, []
  );

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await handleCreateLender(formData);
    
    if (success) {
      resetForm();
      onClose();
      onSuccess?.();
    }
  }, [formData, handleCreateLender, resetForm, onClose, onSuccess]);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open, resetForm]);

  const isFormValid = formData.id && formData.names && formData.surnames && formData.email;

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
          Crear Nuevo Prestamista
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 2 }}>
          {createLenderError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {createLenderError}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: '#000', mb: 1 }}>
              Información Personal
            </Typography>
            
            <TextField
              label="Número de Documento"
              value={formData.id}
              onChange={handleInputChange('id')}
              fullWidth
              required
              placeholder="Ej: 1034567890"
              sx={{
                '& .MuiInputLabel-root': { color: '#000' },
                '& .MuiOutlinedInput-input': { color: '#000' }
              }}
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <TextField
                label="Nombres"
                value={formData.names}
                onChange={handleInputChange('names')}
                fullWidth
                required
                placeholder="Ej: Juan Carlos"
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
                placeholder="Ej: Pérez Gómez"
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
              placeholder="Ej: juan.perez@correo.com"
              sx={{
                '& .MuiInputLabel-root': { color: '#000' },
                '& .MuiOutlinedInput-input': { color: '#000' }
              }}
            />
            <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: '#000', mb: 1, mt: 2 }}>
              Información Adicional
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <TextField
                label="RFID"
                value={formData.rfid}
                onChange={handleInputChange('rfid')}
                fullWidth
                placeholder="Ej: RFID-12345"
                sx={{
                  '& .MuiInputLabel-root': { color: '#000' },
                  '& .MuiOutlinedInput-input': { color: '#000' }
                }}
              />
              <TextField
                label="Teléfono (Opcional)"
                value={formData.phone}
                onChange={handleInputChange('phone')}
                fullWidth
                placeholder="Ej: 3214567890"
                sx={{
                  '& .MuiInputLabel-root': { color: '#000' },
                  '& .MuiOutlinedInput-input': { color: '#000' }
                }}
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            disabled={createLenderLoading}
            sx={{ mr: 1 }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={createLenderLoading || !isFormValid}
            startIcon={createLenderLoading ? <CircularProgress size={16} /> : <SaveIcon />}
            sx={{ borderRadius: 2 }}
          >
            {createLenderLoading ? 'Creando...' : 'Crear Prestamista'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default LenderFormDialog;