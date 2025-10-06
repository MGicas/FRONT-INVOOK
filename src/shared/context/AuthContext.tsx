import { createContext, useState, useMemo, useEffect, type ReactNode } from 'react';
import { AuthService } from '../../modules/login/service/AuthService';
import { NavigationService } from '../services/NavigationService';
import type { User } from '../domain/Auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; user?: User }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: Readonly<AuthProviderProps>) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const authService = useMemo(() => AuthService(), []);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        if (authService.isAuthenticated()) {
          const currentUser = authService.getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Error al inicializar autenticación:', error);
        authService.clearAuthData();
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [authService]); 

  const isAuthenticated = user !== null && authService.isAuthenticated();

  const login = useMemo(() => async (username: string, password: string): Promise<{ success: boolean; user?: User }> => {
    setIsLoading(true);
    try {
      const response = await authService.login({ username, password });
      
      if (response.user) {
        if (!NavigationService.isAuthorizedRole(response.user)) {
          return { 
            success: false, 
            user: response.user 
          };
        }
        
        setUser(response.user);
        return { success: true, user: response.user };
      }
      
      return { success: false };
    } catch (error) {
      console.error('AuthContext: Error en login:', error);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, [authService]);

  const logout = useMemo(() => () => {
    try {
      authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Error en logout:', error);
    }
  }, [authService]);

  const value = useMemo<AuthContextType>(() => ({
    user,
    isAuthenticated,
    login,
    logout,
    isLoading: isLoading || !isInitialized,
  }), [user, isAuthenticated, login, logout, isLoading, isInitialized]);

  if (!isInitialized) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Cargando...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}