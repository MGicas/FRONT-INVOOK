import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../service/AuthService';
import { setAuth } from '../../../shared/utils/ClientData';
import type { LoginCredentials, LoginFormState } from '../model/Login';

export const useLogin = () => {
  const [formState, setFormState] = useState<LoginFormState>({
    username: '',
    password: '',
    error: '',
    isLoading: false,
  });
  
  const navigate = useNavigate();
  const authService = AuthService();

  const updateField = (field: keyof Pick<LoginFormState, 'username' | 'password'>, value: string) => {
    setFormState(prev => ({
      ...prev,
      [field]: value,
      error: '', 
    }));
  };

  const handleLogin = async (credentials?: LoginCredentials) => {
    const loginData = credentials || {
      username: formState.username,
      password: formState.password,
    };
    
    if (!loginData.username.trim() || !loginData.password.trim()) {
      setFormState(prev => ({
        ...prev,
        error: 'Por favor, completa todos los campos',
      }));
      return;
    }

    setFormState(prev => ({ ...prev, isLoading: true, error: '' }));

    try {
      const response = await authService.login(loginData);
      setAuth(response.access, response.refresh, response.user);
      setFormState({
        username: '',
        password: '',
        error: '',
        isLoading: false,
      });
      navigate('/home');
    } catch (error) {
      setFormState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al iniciar sesión',
        isLoading: false,
      }));
    }
  };

  const clearError = () => {
    setFormState(prev => ({ ...prev, error: '' }));
  };

  const resetForm = () => {
    setFormState({
      username: '',
      password: '',
      error: '',
      isLoading: false,
    });
  };

  return {
    formState,
    updateField,
    handleLogin,
    clearError,
    resetForm,
    isAuthenticated: authService.isAuthenticated(),
    getCurrentUser: authService.getCurrentUser,
  };
};