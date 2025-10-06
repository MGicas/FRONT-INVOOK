import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  CircularProgress,
  Alert,
  Typography,
} from '@mui/material';
import {
  Edit as EditIcon,
} from '@mui/icons-material';
import { useState, useEffect, useCallback } from 'react';
import { useUpdateHardware } from '../../hooks/hardware/useUpdateHardware';
import { STATE_OPTIONS, AVAILABILITY_OPTIONS, type Hardware } from '../../model/Hardware';
import type { UpdateHardwareRequest } from '../../service/hardware/updateHardware';

interface HardwareEditDialogProps {
  open: boolean;
  hardware: Hardware | null;
  onClose: () => void;
  onSuccess: (updatedHardware: Hardware) => void;
}

export const HardwareEditDialog = ({ 
  open, 
  hardware, 
  onClose, 
  onSuccess 
}: HardwareEditDialogProps) => {
  const { loading, error, updateHardware, clearError } = useUpdateHardware();
  
  const [formData, setFormData] = useState<UpdateHardwareRequest>({
    name: '',
    description: '',
    comment: '',
    state: '',
    available: '',
  });
  useEffect(() => {
    if (hardware && open) {
      setFormData({
        name: hardware.name || '',
        description: hardware.description || '',
        comment: hardware.comment || '',
        state: hardware.state || '',
        available: hardware.available || '',
      });
      clearError();
    }
  }, [hardware, open, clearError]);

  const handleInputChange = useCallback((field: keyof UpdateHardwareRequest) => 
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: string } }) => {
      const value = event.target.value;
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }, []
  );

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!hardware?.serial) {
      return;
    }
    const changedFields: UpdateHardwareRequest = {};
    
    if (formData.name !== hardware.name) {
      changedFields.name = formData.name;
    }
    if (formData.description !== hardware.description) {
      changedFields.description = formData.description;
    }
    if (formData.comment !== hardware.comment) {
      changedFields.comment = formData.comment;
    }
    if (formData.state !== hardware.state) {
      changedFields.state = formData.state;
    }
    if (formData.available !== hardware.available) {
      changedFields.available = formData.available;
    }

    if (Object.keys(changedFields).length === 0) {
      onClose();
      return;
    }

    const result = await updateHardware(hardware.serial, changedFields);
    
    if (result) {
      onSuccess(result);
      onClose();
    }
  }, [hardware, formData, updateHardware, onSuccess, onClose]);

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
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: 2 }
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2, pb: 2 }}>
        <EditIcon color="primary" />
        <Box>
          <Typography variant="h6" component="div">
            Editar Hardware
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Serial: {hardware.serial}
          </Typography>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ py: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Nombre */}
            <TextField
              label="Nombre del Equipo"
              value={formData.name}
              onChange={handleInputChange('name')}
              fullWidth
              required
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& input': { color: '#000' }
                }
              }}
            />

            {/* Descripción */}
            <TextField
              label="Descripción"
              value={formData.description}
              onChange={handleInputChange('description')}
              fullWidth
              multiline
              rows={3}
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& textarea': { color: '#000' }
                }
              }}
            />

            {/* Comentario */}
            <TextField
              label="Comentario"
              value={formData.comment}
              onChange={handleInputChange('comment')}
              fullWidth
              multiline
              rows={2}
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& textarea': { color: '#000' }
                }
              }}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              {/* Estado */}
              <FormControl fullWidth disabled={loading}>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={formData.state}
                  label="Estado"
                  onChange={handleInputChange('state')}
                  sx={{ color: '#000' }}
                >
                  {STATE_OPTIONS.map((state) => (
                    <MenuItem key={state} value={state}>
                      {state.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Disponibilidad */}
              <FormControl fullWidth disabled={loading}>
                <InputLabel>Disponibilidad</InputLabel>
                <Select
                  value={formData.available}
                  label="Disponibilidad"
                  onChange={handleInputChange('available')}
                  sx={{ color: '#000' }}
                >
                  {AVAILABILITY_OPTIONS.map((availability) => (
                    <MenuItem key={availability} value={availability}>
                      {availability.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
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
            startIcon={loading ? <CircularProgress size={20} /> : <EditIcon />}
            sx={{ borderRadius: 2 }}
          >
            {loading ? 'Actualizando...' : 'Actualizar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default HardwareEditDialog;