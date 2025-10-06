import apiService from '../../../shared/modules/instances/AxiosInstance';
import type { LoginCredentials, LoginResponse } from '../model/Login';
import type { User } from '../../../shared/domain/Auth';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user';

export function AuthService() {

  async function login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const USE_MOCK = false;
      if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockResponse: LoginResponse = {
          access: 'mock_access_token_' + Date.now(),
          refresh: 'mock_refresh_token_' + Date.now(),
          user: {
            id: '1',
            username: credentials.username,
            role: 'admin',
            state: 'active'
          }
        };
        sessionStorage.setItem(ACCESS_TOKEN_KEY, mockResponse.access);
        sessionStorage.setItem(REFRESH_TOKEN_KEY, mockResponse.refresh);
        localStorage.setItem(USER_KEY, JSON.stringify(mockResponse.user));
        
        return mockResponse;
      }
      const response = await apiService.post<LoginResponse>(
        'auth/login/',
        credentials
      );
      if (response.access) {
        sessionStorage.setItem(ACCESS_TOKEN_KEY, response.access);
      }
      if (response.refresh) {
        sessionStorage.setItem(REFRESH_TOKEN_KEY, response.refresh);
      }
      if (response.user) {
        localStorage.setItem(USER_KEY, JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      console.error('Error during login:', error);
      throw new Error('Credenciales inválidas');
    }
  }

  async function refreshToken(refreshToken: string): Promise<{ access: string }> {
    try {
      const response = await apiService.post<{ access: string }>(
        'auth/refresh/',
        { refresh: refreshToken }
      );
      if (response.access) {
        sessionStorage.setItem(ACCESS_TOKEN_KEY, response.access);
      }
      
      return response;
    } catch (error) {
      console.error('Error al refrescar token:', error);
      clearAuthData();
      throw new Error('No se pudo refrescar el token');
    }
  }

  function isAuthenticated(): boolean {
    const token = sessionStorage.getItem(ACCESS_TOKEN_KEY);
    const user = getCurrentUser();
    return !!(token && user);
  }

  function getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem(USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return null;
    }
  }

  function logout(): void {
    clearAuthData();
  }

  function clearAuthData(): void {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  function getAccessToken(): string | null {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
  }

  function getRefreshToken(): string | null {
    return sessionStorage.getItem(REFRESH_TOKEN_KEY);
  }

  return {
    login,
    refreshToken,
    isAuthenticated,
    getCurrentUser,
    logout,
    getAccessToken,
    getRefreshToken,
    clearAuthData
  };
}