import apiService from '../../../shared/modules/instances/AxiosInstance';

export type ConsumPayload = {
  id?: number | string;
  code?: string;
  name: string;
  description?: string;
  count?: number; // cantidad actual
  quantity?: number; // unidad (si aplica)
  stock?: number; // stock total o disponible
};

// Ruta del backend
const BASE_PATH = 'consum/';

const ConsumService = {
  list: async (params?: { page?: number; page_size?: number; name?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.page_size) query.set('page_size', String(params.page_size));
    if (params?.name) query.set('name', params.name);
    const url = query.toString() ? `${BASE_PATH}?${query.toString()}` : BASE_PATH;
    return await apiService.get<any>(url);
  },
  get: async (idOrCode: string | number) => {
    return await apiService.get<ConsumPayload>(`${BASE_PATH}${encodeURIComponent(String(idOrCode))}/`);
  },
  create: async (data: ConsumPayload) => {
    return await apiService.post<ConsumPayload>(BASE_PATH, data);
  },
  update: async (idOrCode: string | number, data: Partial<ConsumPayload>) => {
    return await apiService.patch<ConsumPayload>(`${BASE_PATH}${encodeURIComponent(String(idOrCode))}/`, data);
  },
  remove: async (idOrCode: string | number) => {
    return await apiService.delete<void>(`${BASE_PATH}${encodeURIComponent(String(idOrCode))}/`);
  },
  restock: async (idOrCode: string | number, body: { count: number; quantity: number }) => {
    return await apiService.post(`${BASE_PATH}${encodeURIComponent(String(idOrCode))}/restock/`, body);
  },
};

export default ConsumService;
