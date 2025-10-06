import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { NavigationService } from "../../services/NavigationService";

interface ProtectedRoutesProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
  requireRole?: string; 
}

export default function ProtectedRoutes({
  isAuthenticated,
  children,
  requireRole,
}: Readonly<ProtectedRoutesProps>) {
  const location = useLocation();
  const { user, logout } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && !NavigationService.isAuthorizedRole(user)) {
    console.warn(`Acceso denegado: Rol '${user.role}' no autorizado para acceder al sistema`);
    logout();
    return <Navigate to="/login" replace />;
  }

  if (requireRole && user?.role !== requireRole) {
    console.warn(`Acceso denegado: Se requiere rol '${requireRole}', usuario tiene '${user?.role}'`);
    return <Navigate to="/home" replace />;
  }

  const restrictedRoutes = ['/admin-only', '/super-admin'];
  if (user && restrictedRoutes.some(route => location.pathname.startsWith(route))) {
    console.warn(`Acceso denegado a la ruta restringida: ${location.pathname} para el rol: ${user.role}`);
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}
