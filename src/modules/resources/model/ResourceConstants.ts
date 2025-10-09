export const RESOURCE_ROUTES = {
  MAIN: '/resources',
  CONSUM: '/resources/consumibles',
  LOAN: '/resources/prestamos',
  CONSUM_DETAIL: '/resources/consumibles/:id',
  LOAN_DETAIL: '/resources/prestamos/:id',
  CONSUM_NEW: '/resources/consumibles/nuevo',
  LOAN_NEW: '/resources/prestamos/nuevo',
  REPORTS: '/resources/reportes',
} as const;

export const RESOURCE_STATUS_OPTIONS = [
  { value: 'available', label: 'Disponible', color: '#4caf50' },
  { value: 'consumed', label: 'Consumido', color: '#9e9e9e' },
  { value: 'reserved', label: 'Reservado', color: '#ff9800' },
  { value: 'expired', label: 'Vencido', color: '#f44336' },
] as const;

export const LOAN_STATUS_OPTIONS = [
  { value: 'active', label: 'Activo', color: '#4caf50' },
  { value: 'returned', label: 'Devuelto', color: '#2196f3' },
  { value: 'overdue', label: 'Vencido', color: '#f44336' },
  { value: 'pending', label: 'Pendiente', color: '#ff9800' },
] as const;

export const VALIDATION_MESSAGES = {
  REQUIRED: 'Este campo es obligatorio',
  MIN_LENGTH: (min: number) => `Debe tener al menos ${min} caracteres`,
  MAX_LENGTH: (max: number) => `No puede exceder ${max} caracteres`,
  INVALID_EMAIL: 'Formato de email inválido',
  INVALID_NUMBER: 'Debe ser un número válido',
  MIN_VALUE: (min: number) => `Debe ser mayor o igual a ${min}`,
  MAX_VALUE: (max: number) => `Debe ser menor o igual a ${max}`,
  DUPLICATE: 'Este valor ya existe',
  INVALID_DATE: 'Fecha inválida',
  FUTURE_DATE: 'La fecha debe ser futura',
  PAST_DATE: 'La fecha debe ser pasada',
} as const;