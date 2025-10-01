export type MonitorState = 'ACTIVO' | 'INACTIVO';

export interface Monitor {
  id: number;
  rfid?: string;
  name: string;
  surname: string;
  document: string;
  phone?: string;
  email?: string;
  state: MonitorState;
  role?: 'Admin' | 'Monitores';
}

