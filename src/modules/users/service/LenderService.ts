import apiService from '../../../shared/modules/instances/AxiosInstance';
import type { PaginatedResponse } from '../../../shared/modules/instances/AxiosInstance';
import type { Lender } from '../model/Lender';

const BASE_PATH = 'users/lenders/';

const LenderService = {
  list: async (params?: { page?: number; page_size?: number; name?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.page_size) query.set('page_size', String(params.page_size));
    if (params?.name) query.set('name', params.name);
    const url = query.toString() ? `${BASE_PATH}?${query.toString()}` : BASE_PATH;
    return await apiService.get<PaginatedResponse<Lender>>(url);
  },
  get: async (id: string | number) => {
    return await apiService.get<Lender>(`${BASE_PATH}${encodeURIComponent(String(id))}/`);
  },
  create: async (data: Partial<Lender>) => {
    return await apiService.post<Lender>(BASE_PATH, data);
  },
  update: async (id: string | number, data: Partial<Lender>) => {
    return await apiService.patch<Lender>(`${BASE_PATH}${encodeURIComponent(String(id))}/`, data);
  },
  remove: async (id: string | number) => {
    return await apiService.delete<void>(`${BASE_PATH}${encodeURIComponent(String(id))}/`);
  },
};

export default LenderService;
