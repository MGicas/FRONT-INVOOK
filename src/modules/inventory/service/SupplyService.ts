import apiService from '../../../shared/modules/instances/AxiosInstance';

export type SupplyPayload = {
  code: string;
  name: string;
  description?: string;
  supply_type?: string;
  count?: number;   // cantidad actual
  quantity?: number; // unidad (si aplica)
  stock?: number;   // stock total o disponible
};

const BASE_PATH = 'inventory/supply/';

const SupplyService = {
  list: async (params?: { page?: number; page_size?: number; name?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.page_size) query.set('page_size', String(params.page_size));
    if (params?.name) query.set('name', params.name);
    const url = query.toString() ? `${BASE_PATH}?${query.toString()}` : BASE_PATH;
    return await apiService.get<any>(url);
  },
  get: async (code: string) => {
    return await apiService.get<SupplyPayload>(`${BASE_PATH}${encodeURIComponent(code)}/`);
  },
  create: async (data: SupplyPayload) => {
    return await apiService.post<SupplyPayload>(BASE_PATH, data);
  },
  update: async (code: string, data: Partial<SupplyPayload>) => {
    return await apiService.patch<SupplyPayload>(`${BASE_PATH}${encodeURIComponent(code)}/`, data);
  },
  remove: async (code: string) => {
    return await apiService.delete<void>(`${BASE_PATH}${encodeURIComponent(code)}/`);
  },
  restock: async (code: string, body: { count: number; quantity: number }) => {
    return await apiService.post(`${BASE_PATH}${encodeURIComponent(code)}/restock/`, body);
  },
};

export default SupplyService;
