import {
  Box,
  TextField,
  Button,
  Alert,
  Typography,
  Paper,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, Person, Lock } from '@mui/icons-material';
import { useState } from 'react';
import { InvookLogo } from '../../../shared/components';
import { useLogin } from '../hook/useLogin';

interface LoginFormProps {
  onSubmit?: () => void;
}

export const LoginForm = ({ onSubmit }: Readonly<LoginFormProps>) => {
  const { formState, updateField, handleLogin } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin();
    onSubmit?.();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        width: '100%',
        maxWidth: 400,
        borderRadius: 3,
        boxShadow: 3,
      }}
    >
      <Box sx={{ mb: 2 }}>
        <InvookLogo height={60} />
      </Box>
      <Typography
        variant="h4"
        component="h1"
        sx={{
          color: 'primary.main',
          fontWeight: 'bold',
          textAlign: 'center',
          mb: 2,
        }}
      >
        Iniciar Sesión
      </Typography>
      {formState.error && (
        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
          {formState.error}
        </Alert>
      )}
      <TextField
        fullWidth
        label="Nombre de usuario"
        variant="outlined"
        value={formState.username}
        onChange={(e) => updateField('username', e.target.value)}
        disabled={formState.isLoading}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Person color="primary" />
              </InputAdornment>
            ),
          },
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: 'primary.main',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'primary.main',
            },
          },
        }}
        required
      />

      <TextField
        fullWidth
        label="Contraseña"
        type={showPassword ? 'text' : 'password'}
        variant="outlined"
        value={formState.password}
        onChange={(e) => updateField('password', e.target.value)}
        disabled={formState.isLoading}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Lock color="primary" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={togglePasswordVisibility}
                  edge="end"
                  disabled={formState.isLoading}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: 'primary.main',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'primary.main',
            },
          },
        }}
        required
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={formState.isLoading}
        sx={{
          mt: 2,
          py: 1.5,
          backgroundColor: 'secondary.main',
          color: 'secondary.contrastText',
          '&:hover': {
            backgroundColor: 'secondary.dark',
          },
          '&.Mui-disabled': {
            backgroundColor: 'grey.300',
          },
        }}
      >
        {formState.isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Ingresar'
        )}
      </Button>
      
      <Typography variant="body2" color="rgba(255,255,255,0.8)" sx={{ mt: 2, textAlign: 'center' }}>
        Acceso exclusivo para administradores y monitores
      </Typography>
    </Paper>
  );
};

export default LoginForm;