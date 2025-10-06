export type UserStatus = 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';
export type UserRole = 'ADMIN' | 'MONITOR' | 'USUARIO' | 'TECNICO' | 'OPERARIO';
export type MonitorType = 'SUPERVISOR' | 'COORDINADOR' | 'JEFE_AREA' | 'AUDITOR';

export interface BaseUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Monitor extends BaseUser {
  monitorType: MonitorType;
  department: string;
  employeeId: string;
  supervisedAreas: string[];
  isActive: boolean;
}

export interface User extends BaseUser {
  role: UserRole;
  department: string;
  employeeId: string;
  position: string;
  supervisorId?: string;
  lastLogin?: string;
}

export interface UserFilters {
  search?: string;
  status?: UserStatus;
  role?: UserRole;
  department?: string;
}

export interface MonitorFilters {
  search?: string;
  status?: UserStatus;
  monitorType?: MonitorType;
  department?: string;
}

export interface PaginatedUserResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  suspendedUsers: number;
  totalMonitors: number;
  activeMonitors: number;
  usersByRole: Record<UserRole, number>;
  monitorsByType: Record<MonitorType, number>;
}