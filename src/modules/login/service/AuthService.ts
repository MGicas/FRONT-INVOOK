import apiService from '../../../shared/modules/instances/AxiosInstance';
import { ENDPOINTS } from '../../../shared/service/Endpoints';
import type { LoginCredentials, LoginResponse } from '../model/Login';

export function AuthService() {

  async function login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const loginPath = ENDPOINTS.LOGIN.replace('http://127.0.0.1:8000/api/v1/invook/', '');
      const response = await apiService.post<LoginResponse>(
        loginPath,
        credentials
      );
      return response;
    } catch (error) {
      console.error('Error en login:', error);
      throw new Error('Credenciales inválidas');
    }
  }

  async function refreshToken(refreshToken: string): Promise<{ access: string }> {
    try {
      const refreshPath = ENDPOINTS.REFRESH.replace('http://127.0.0.1:8000/api/v1/invook/', '');
      const response = await apiService.post<{ access: string }>(
        refreshPath,
        { refresh: refreshToken }
      );
      return response;
    } catch (error) {
      console.error('Error al refrescar token:', error);
      throw new Error('No se pudo refrescar el token');
    }
  }

  function isAuthenticated(): boolean {
    const token = sessionStorage.getItem('access_token');
    return !!token;
  }

  function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  return {
    login,
    refreshToken,
    isAuthenticated,
    getCurrentUser
  };
}