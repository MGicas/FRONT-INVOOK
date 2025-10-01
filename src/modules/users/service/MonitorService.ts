import apiService from '../../../shared/modules/instances/AxiosInstance';
import type { PaginatedResponse } from '../../../shared/modules/instances/AxiosInstance';
import type { Monitor } from '../model/Monitor';

const BASE_PATH = 'users/admins/';

const MonitorService = {
  list: async (params?: { page?: number; page_size?: number; name?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.page_size) query.set('page_size', String(params.page_size));
    if (params?.name) query.set('name', params.name);
    const url = query.toString() ? `${BASE_PATH}?${query.toString()}` : BASE_PATH;
    return await apiService.get<PaginatedResponse<Monitor>>(url);
  },
  get: async (id: string | number) => {
    return await apiService.get<Monitor>(`${BASE_PATH}${encodeURIComponent(String(id))}/`);
  },
  create: async (data: Partial<Monitor>) => {
    return await apiService.post<Monitor>(BASE_PATH, data);
  },
  update: async (id: string | number, data: Partial<Monitor>) => {
    return await apiService.patch<Monitor>(`${BASE_PATH}${encodeURIComponent(String(id))}/`, data);
  },
  remove: async (id: string | number) => {
    return await apiService.delete<void>(`${BASE_PATH}${encodeURIComponent(String(id))}/`);
  },
  updateProfile: async (id: string | number, data: Partial<Monitor>) => {
    return await apiService.put<Monitor>(
      `${BASE_PATH}${encodeURIComponent(String(id))}/profile/`,
      data,
    );
  },
  changeState: async (id: string | number, state: string) => {
    return await apiService.post<Monitor>(
      `${BASE_PATH}${encodeURIComponent(String(id))}/state/`,
      { state },
    );
  },
  setRole: async (id: string | number, role: string) => {
    return await apiService.post<Monitor>(
      `${BASE_PATH}${encodeURIComponent(String(id))}/role/`,
      { role },
    );
  },
};

export default MonitorService;
