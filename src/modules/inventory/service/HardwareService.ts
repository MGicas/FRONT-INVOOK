// inventory/service/HardwareService.ts
import apiService from '../../../shared/modules/instances/AxiosInstance';

const BASE_PATH = 'inventory/hardware/';

export type HardwarePayload = {
  serial: string;
  name: string;
  description?: string;
  comment?: string;
  hardware_type?: string;
  state?: string; // BUENO | FUNCIONAL | DAÑO_LEVE | NO_FUNCIONA | PERDIDO
  available?: 'DISPONIBLE' | 'NO_DISPONIBLE';
};

export interface Paginated<T> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
}

export const HardwareService = {
  // Intenta server-side pagination; si la API no pagina, retorna array simple
  getAll: async (params?: { page?: number; page_size?: number }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.page_size) query.set('page_size', String(params.page_size));
    const url = query.toString() ? `${BASE_PATH}?${query.toString()}` : BASE_PATH;
    // Retorno como any para permitir tanto respuesta paginada como arreglo
    return await apiService.get<any>(url);
  },
  getBySerial: async (serial: string) => {
    return await apiService.get<HardwarePayload>(`${BASE_PATH}${encodeURIComponent(serial)}/`);
  },
  create: async (data: HardwarePayload) => {
    return await apiService.post<HardwarePayload>(BASE_PATH, data);
  },
  update: async (serial: string, data: Partial<HardwarePayload>) => {
    return await apiService.patch<HardwarePayload>(`${BASE_PATH}${encodeURIComponent(serial)}/`, data);
  },
  delete: async (serial: string) => {
    return await apiService.delete<void>(`${BASE_PATH}${encodeURIComponent(serial)}/`);
  },
};
