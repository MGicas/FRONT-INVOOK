export const USER_ROUTES = {
  MAIN: '/users',
  MONITORS: '/users/monitors',
  USERS: '/users/usuarios',
  MONITOR_DETAIL: '/users/monitors/:id',
  USER_DETAIL: '/users/usuarios/:id',
  MONITOR_NEW: '/users/monitors/nuevo',
  USER_NEW: '/users/usuarios/nuevo',
  REPORTS: '/users/reportes',
} as const;

export const USER_STATUS_OPTIONS = [
  'ACTIVO',
  'INACTIVO',
  'SUSPENDIDO',
] as const;

export const USER_ROLES = [
  'ADMIN',
  'MONITOR',
  'USUARIO',
  'TECNICO',
  'OPERARIO',
] as const;

export const MONITOR_TYPES = [
  'SUPERVISOR',
  'COORDINADOR',
  'JEFE_AREA',
  'AUDITOR',
] as const;

export const VALIDATION_MESSAGES = {
  REQUIRED_FIELD: 'Este campo es requerido',
  INVALID_EMAIL: 'Formato de email inválido',
  INVALID_PHONE: 'Formato de teléfono inválido',
  MIN_PASSWORD_LENGTH: 'La contraseña debe tener al menos 8 caracteres',
  PASSWORDS_NOT_MATCH: 'Las contraseñas no coinciden',
  USER_EXISTS: 'El usuario ya existe',
  MONITOR_EXISTS: 'El monitor ya existe',
} as const;