export const STATE_OPTIONS = [
  'BUENO',
  'FUNCIONAL',
  'DAÑO_LEVE',
  'NO_FUNCIONA',
  'PERDIDO',
] as const;

export const AVAILABILITY_OPTIONS = [
  'DISPONIBLE',
  'NO_DISPONIBLE',
] as const;

export interface Hardware {
   serial: string;
   name: string;
   description: string;
   comment: string;
   hardware_type: string;
   state: string;
   available: string;
   hardware_type_name?: string;
}