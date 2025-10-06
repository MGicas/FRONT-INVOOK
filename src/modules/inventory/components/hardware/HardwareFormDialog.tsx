import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
import { useCreateHardware } from '../../hooks/hardware/useCreateHardware';
import { STATE_OPTIONS, AVAILABILITY_OPTIONS, type Hardware } from '../../model/Hardware';
import type { CreateHardwareRequest } from '../../service/hardware/postHardware';

interface HardwareFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (hardware: Hardware) => void;
}

export const HardwareFormDialog = ({ open, onClose, onSuccess }: HardwareFormDialogProps) => {
  const { createHardware, loading, error, clearState } = useCreateHardware();
  
  const [formData, setFormData] = useState({
    serial: '',
    name: '',
    description: '',
    comment: '',
    hardware_type: '',
    state: '',
    available: '',
  });

  const resetForm = useCallback(() => {
    setFormData({
      serial: '',
      name: '',
      description: '',
      comment: '',
      hardware_type: '',
      state: '',
      available: '',
    });
    clearState();
  }, [clearState]);

  const handleInputChange = useCallback((field: keyof typeof formData) => 
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData(prev => ({
        ...prev,
        [field]: event.target.value
      }));
    }, []
  );

  const handleSelectChange = useCallback((field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    const hardwareData: CreateHardwareRequest = {
      ...formData,
    };

    const result = await createHardware(hardwareData);
    
    if (result && onSuccess) {
      onSuccess(result);
      resetForm();
      onClose();
    }
  }, [formData, createHardware, onSuccess, resetForm, onClose]);

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
          Crear Nuevo Hardware
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
              label="Serial"
              value={formData.serial}
              onChange={handleInputChange('serial')}
              fullWidth
              required
              placeholder="Ej: HW-001-2024"
              sx={{
                '& .MuiInputLabel-root': { color: '#000' },
                '& .MuiOutlinedInput-input': { color: '#000' }
              }}
            />
            <TextField
              label="Nombre"
              value={formData.name}
              onChange={handleInputChange('name')}
              fullWidth
              required
              placeholder="Ej: Laptop Dell XPS"
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
              placeholder="Ej: Portátil de alto rendimiento para área de desarrollo"
              sx={{
                '& .MuiInputLabel-root': { color: '#000' },
                '& .MuiOutlinedInput-input': { color: '#000' }
              }}
            />
            <TextField
              label="Tipo de Hardware"
              value={formData.hardware_type}
              onChange={handleInputChange('hardware_type')}
              fullWidth
              required
              placeholder="Ej: Laptop, Desktop, Router, Proyector"
              sx={{
                '& .MuiInputLabel-root': { color: '#000' },
                '& .MuiOutlinedInput-input': { color: '#000' }
              }}
            />
            <FormControl fullWidth required>
              <InputLabel sx={{ color: '#000' }}>Estado</InputLabel>
              <Select
                value={formData.state}
                onChange={(e) => handleSelectChange('state', e.target.value)}
                label="Estado *"
                sx={{
                  '& .MuiSelect-select': { color: '#000' }
                }}
              >
                {STATE_OPTIONS.map((state) => (
                  <MenuItem key={state} value={state}>
                    {state.replace('_', ' ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel sx={{ color: '#000' }}>Disponibilidad</InputLabel>
              <Select
                value={formData.available}
                onChange={(e) => handleSelectChange('available', e.target.value)}
                label="Disponibilidad"
                sx={{
                  '& .MuiSelect-select': { color: '#000' }
                }}
              >
                {AVAILABILITY_OPTIONS.map((availability) => (
                  <MenuItem key={availability} value={availability}>
                    {availability.replace('_', ' ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Comentarios"
              value={formData.comment}
              onChange={handleInputChange('comment')}
              fullWidth
              multiline
              rows={2}
              placeholder="Comentarios adicionales (opcional)"
              sx={{
                '& .MuiInputLabel-root': { color: '#000' },
                '& .MuiOutlinedInput-input': { color: '#000' }
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            disabled={loading}
            sx={{ mr: 1 }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : <SaveIcon />}
            sx={{ borderRadius: 2 }}
          >
            {loading ? 'Creando...' : 'Crear Hardware'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default HardwareFormDialog;