import { useContext } from 'react';
import { AuthContext } from '../../../shared/context/AuthContext';

export const usePermissions = () => {
  const authContext = useContext(AuthContext);
  
  if (!authContext) {
    throw new Error('usePermissions debe ser usado dentro de un AuthProvider');
  }

  const { user } = authContext;

  const isAdmin = user?.role === 'ADMIN';
  const canCreateMonitor = isAdmin;
  const canEditMonitor = isAdmin;
  const canDeleteMonitor = isAdmin;

  return {
    user,
    isAdmin,
    canCreateMonitor,
    canEditMonitor,
    canDeleteMonitor,
  };
};

export default usePermissions;