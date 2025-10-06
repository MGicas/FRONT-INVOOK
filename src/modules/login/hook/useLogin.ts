import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../shared/hooks/useAuth';
import { NavigationService } from '../../../shared/services/NavigationService';
import type { LoginFormState } from '../model/Login';

export function useLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [formState, setFormState] = useState<LoginFormState>({
    username: '',
    password: '',
    error: '',
    isLoading: false,
  });

  useEffect(() => {
    if (location.pathname !== '/login' && formState.isLoading) {
      setFormState(prev => ({ ...prev, isLoading: false }));
    }
  }, [location.pathname, formState.isLoading]);

  const updateField = useCallback((field: keyof Omit<LoginFormState, 'error' | 'isLoading'>, value: string) => {
    setFormState(prev => ({
      ...prev,
      [field]: value,
      error: '',
    }));
  }, []);

  const setLoading = (loading: boolean) => {
    setFormState(prev => ({ ...prev, isLoading: loading }));
  };

  const setError = (error: string) => {
    setFormState(prev => ({ ...prev, error, isLoading: false }));
  };

  const performLogin = useCallback(async (username: string, password: string) => {
    try {
      const result = await login(username, password);
      
      if (result.success && result.user) {
        const destinationRoute = NavigationService.getRouteForUser(result.user);
        
        setLoading(false);
        
        setTimeout(() => {
          navigate(destinationRoute, { replace: true });
        }, 100);
        return;
      }
      
      if (result.user && !NavigationService.isAuthorizedRole(result.user)) {
        setError(`Acceso denegado. El rol '${result.user?.role}' no tiene permisos para acceder al sistema.`);
        return;
      }
      
      setError('Credenciales inválidas. Por favor, verifica tu usuario y contraseña.');
      
    } catch (error) {
      console.error(error)
      setError('Error al iniciar sesión. Intenta nuevamente.');
    }
  }, [login, navigate]);

  const handleLogin = useCallback(async () => {
    const { username, password } = formState;
    
    if (!username || !password) {
      setError('Por favor, completa todos los campos');
      return;
    }

    setLoading(true);
    
    await performLogin(username, password);
  }, [formState, performLogin]);

  return {
    formState,
    updateField,
    handleLogin,
  };
}