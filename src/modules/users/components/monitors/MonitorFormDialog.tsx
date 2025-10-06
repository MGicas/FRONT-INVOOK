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
import type { CreateMonitorRequest } from '../../service/postMonitor';
import type { Monitor } from '../../model/Monitor';

interface MonitorFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (monitor: Monitor) => void;
}

const ROLE_OPTIONS = ['ADMIN', 'MONITOR'];

export const MonitorFormDialog = ({ open, onClose, onSuccess }: MonitorFormDialogProps) => {
  const { createMonitor, creating, error, clearError } = useMonitorMutations();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    first_name: '',
    last_name: '',
    rfid: '',
    names: '',
    surnames: '',
    phone: '',
    document_id: '',
    role: 'ADMIN',
  });

  const resetForm = useCallback(() => {
    setFormData({
      username: '',
      password: '',
      email: '',
      first_name: '',
      last_name: '',
      rfid: '',
      names: '',
      surnames: '',
      phone: '',
      document_id: '',
      role: 'ADMIN',
    });
    clearError();
  }, [clearError]);

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
    
    const monitorData: CreateMonitorRequest = {
      ...formData,
    };

    const result = await createMonitor(monitorData);
    
    if (result && onSuccess) {
      onSuccess(result);
      resetForm();
      onClose();
    }
  }, [formData, createMonitor, onSuccess, resetForm, onClose]);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  useEffect(() => {
    if (open) {
      clearError();
    }
  }, [open, clearError]);

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
          Crear Nuevo Monitor
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
                required
                placeholder="Ej: pedro_admin"
                sx={{
                  '& .MuiInputLabel-root': { color: '#000' },
                  '& .MuiOutlinedInput-input': { color: '#000' }
                }}
              />
              <TextField
                label="Contraseña"
                type="password"
                value={formData.password}
                onChange={handleInputChange('password')}
                fullWidth
                required
                placeholder="Ej: Admin123!"
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
              placeholder="Ej: pedro.admin@empresa.com"
              sx={{
                '& .MuiInputLabel-root': { color: '#000' },
                '& .MuiOutlinedInput-input': { color: '#000' }
              }}
            />

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
                required
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
                required
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
                required
                placeholder="Ej: Pedro"
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
                required
                placeholder="Ej: López"
                sx={{
                  '& .MuiInputLabel-root': { color: '#000' },
                  '& .MuiOutlinedInput-input': { color: '#000' }
                }}
              />
            </Box>

            {/* Información adicional */}
            <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: '#000', mb: 1, mt: 2 }}>
              Información Adicional
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <TextField
                label="RFID"
                value={formData.rfid}
                onChange={handleInputChange('rfid')}
                fullWidth
                required
                placeholder="Ej: RF12345"
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
                required
                placeholder="Ej: 3001234567"
                sx={{
                  '& .MuiInputLabel-root': { color: '#000' },
                  '& .MuiOutlinedInput-input': { color: '#000' }
                }}
              />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <TextField
                label="Número de Documento"
                value={formData.document_id}
                onChange={handleInputChange('document_id')}
                fullWidth
                required
                placeholder="Ej: 100200300"
                sx={{
                  '& .MuiInputLabel-root': { color: '#000' },
                  '& .MuiOutlinedInput-input': { color: '#000' }
                }}
              />
              <FormControl fullWidth required>
                <InputLabel sx={{ color: '#000' }}>Rol</InputLabel>
                <Select
                  value={formData.role}
                  onChange={(e) => handleSelectChange('role', e.target.value)}
                  label="Rol"
                  sx={{
                    '& .MuiSelect-select': { color: '#000' }
                  }}
                >
                  {ROLE_OPTIONS.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            disabled={creating}
            sx={{ mr: 1 }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={creating}
            startIcon={creating ? <CircularProgress size={16} /> : <SaveIcon />}
            sx={{ borderRadius: 2 }}
          >
            {creating ? 'Creando...' : 'Crear Monitor'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default MonitorFormDialog;