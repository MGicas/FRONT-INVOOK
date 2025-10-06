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
import { useMonitorMutations } from '../../hook/useMonitorMutations';
import type { UpdateMonitorRequest } from '../../service/updateMonitor';
import type { Monitor } from '../../model/Monitor';

interface MonitorEditDialogProps {
  open: boolean;
  monitor: Monitor | null;
  onClose: () => void;
  onSuccess?: (monitor: Monitor) => void;
}

const STATE_OPTIONS = ['ACTIVO', 'INACTIVO', 'SUSPENDIDO'];

export const MonitorEditDialog = ({ open, monitor, onClose, onSuccess }: MonitorEditDialogProps) => {
  const { updateMonitor, updating, error, clearError } = useMonitorMutations();
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    names: '',
    surnames: '',
    email: '',
    username: '',
    phone: '',
    rfid: '',
    state: 'ACTIVO',
  });

  useEffect(() => {
    if (monitor && open) {
      setFormData({
        first_name: monitor.first_name || '',
        last_name: monitor.last_name || '',
        names: monitor.first_name || '', 
        surnames: monitor.last_name || '', 
        email: monitor.email || '',
        username: monitor.username || '',
        phone: monitor.phone || '',
        rfid: monitor.rfid || '',
        state: monitor.state || 'ACTIVO',
      });
    }
  }, [monitor, open]);

  const resetForm = useCallback(() => {
    if (monitor) {
      setFormData({
        first_name: monitor.first_name || '',
        last_name: monitor.last_name || '',
        names: monitor.first_name || '',
        surnames: monitor.last_name || '',
        email: monitor.email || '',
        username: monitor.username || '',
        phone: monitor.phone || '',
        rfid: monitor.rfid || '',
        state: monitor.state || 'ACTIVO',
      });
    }
    clearError();
  }, [monitor, clearError]);

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
    
    if (!monitor) return;

    const updatedFields: UpdateMonitorRequest = {};
    
    if (formData.first_name !== (monitor.first_name || '')) {
      updatedFields.first_name = formData.first_name;
    }
    if (formData.last_name !== (monitor.last_name || '')) {
      updatedFields.last_name = formData.last_name;
    }
    if (formData.names !== (monitor.first_name || '')) {
      updatedFields.names = formData.names;
    }
    if (formData.surnames !== (monitor.last_name || '')) {
      updatedFields.surnames = formData.surnames;
    }
    if (formData.email !== (monitor.email || '')) {
      updatedFields.email = formData.email;
    }
    if (formData.username !== (monitor.username || '')) {
      updatedFields.username = formData.username;
    }
    if (formData.phone !== (monitor.phone || '')) {
      updatedFields.phone = formData.phone;
    }
    if (formData.rfid !== (monitor.rfid || '')) {
      updatedFields.rfid = formData.rfid;
    }
    if (formData.state !== (monitor.state || 'ACTIVO')) {
      updatedFields.state = formData.state;
    }

    if (Object.keys(updatedFields).length === 0) {
      onClose();
      return;
    }

    const result = await updateMonitor(monitor.id, updatedFields);
    
    if (result && onSuccess) {
      onSuccess(result);
      onClose();
    }
  }, [formData, monitor, updateMonitor, onSuccess, onClose]);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  useEffect(() => {
    if (open) {
      clearError();
    }
  }, [open, clearError]);

  if (!monitor) return null;

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
          Editar Monitor: {monitor.username}
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
            {/* Información de cuenta */}
            <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: '#000', mb: 1 }}>
              Información de Cuenta
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <TextField
                label="Nombre de Usuario"
                value={formData.username}
                onChange={handleInputChange('username')}
                fullWidth
                placeholder="Ej: pedro_admin"
                sx={{
                  '& .MuiInputLabel-root': { color: '#000' },
                  '& .MuiOutlinedInput-input': { color: '#000' }
                }}
              />
              <TextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                fullWidth
                placeholder="Ej: pedro.admin@empresa.com"
                sx={{
                  '& .MuiInputLabel-root': { color: '#000' },
                  '& .MuiOutlinedInput-input': { color: '#000' }
                }}
              />
            </Box>

            {/* Información personal */}
            <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: '#000', mb: 1, mt: 2 }}>
              Información Personal
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <TextField
                label="Primer Nombre"
                value={formData.first_name}
                onChange={handleInputChange('first_name')}
                fullWidth
                placeholder="Ej: Pedro"
                sx={{
                  '& .MuiInputLabel-root': { color: '#000' },
                  '& .MuiOutlinedInput-input': { color: '#000' }
                }}
              />
              <TextField
                label="Apellido"
                value={formData.last_name}
                onChange={handleInputChange('last_name')}
                fullWidth
                placeholder="Ej: López"
                sx={{
                  '& .MuiInputLabel-root': { color: '#000' },
                  '& .MuiOutlinedInput-input': { color: '#000' }
                }}
              />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <TextField
                label="Nombres Completos"
                value={formData.names}
                onChange={handleInputChange('names')}
                fullWidth
                placeholder="Ej: Pedro Andrés"
                sx={{
                  '& .MuiInputLabel-root': { color: '#000' },
                  '& .MuiOutlinedInput-input': { color: '#000' }
                }}
              />
              <TextField
                label="Apellidos Completos"
                value={formData.surnames}
                onChange={handleInputChange('surnames')}
                fullWidth
                placeholder="Ej: López García"
                sx={{
                  '& .MuiInputLabel-root': { color: '#000' },
                  '& .MuiOutlinedInput-input': { color: '#000' }
                }}
              />
            </Box>

            {/* Información adicional */}
            <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: '#000', mb: 1, mt: 2 }}>
              Información de Contacto y Estado
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <TextField
                label="RFID"
                value={formData.rfid}
                onChange={handleInputChange('rfid')}
                fullWidth
                placeholder="Ej: RF98765"
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
                placeholder="Ej: 3007654321"
                sx={{
                  '& .MuiInputLabel-root': { color: '#000' },
                  '& .MuiOutlinedInput-input': { color: '#000' }
                }}
              />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#000' }}>Estado</InputLabel>
                <Select
                  value={formData.state}
                  onChange={(e) => handleSelectChange('state', e.target.value)}
                  label="Estado"
                  sx={{
                    '& .MuiSelect-select': { color: '#000' }
                  }}
                >
                  {STATE_OPTIONS.map((state) => (
                    <MenuItem key={state} value={state}>
                      {state}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* Columna vacía para mantener el grid */}
              <Box />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            disabled={updating}
            sx={{ mr: 1 }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={updating}
            startIcon={updating ? <CircularProgress size={16} /> : <SaveIcon />}
            sx={{ borderRadius: 2 }}
          >
            {updating ? 'Actualizando...' : 'Actualizar Monitor'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default MonitorEditDialog;