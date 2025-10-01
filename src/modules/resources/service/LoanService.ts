import apiService from '../../../shared/modules/instances/AxiosInstance';

export type LoanPayload = {
  id?: number | string;
  borrower?: string; // usuario/prestatario
  item_serial?: string; // equipo prestado
  start_date?: string; // ISO
  end_date?: string | null; // ISO o null si activo
  status?: 'ACTIVO' | 'DEVUELTO' | 'CANCELADO' | string;
  notes?: string;
};

// Ruta del backend
const BASE_PATH = 'loan/';

const LoanService = {
  list: async (params?: { page?: number; page_size?: number; status?: string; borrower?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.page_size) query.set('page_size', String(params.page_size));
    if (params?.status) query.set('status', params.status);
    if (params?.borrower) query.set('borrower', params.borrower);
    const url = query.toString() ? `${BASE_PATH}?${query.toString()}` : BASE_PATH;
    return await apiService.get<any>(url);
  },
  get: async (id: number | string) => {
    return await apiService.get<LoanPayload>(`${BASE_PATH}${encodeURIComponent(String(id))}/`);
  },
  create: async (data: LoanPayload) => {
    return await apiService.post<LoanPayload>(BASE_PATH, data);
  },
  update: async (id: number | string, data: Partial<LoanPayload>) => {
    return await apiService.patch<LoanPayload>(`${BASE_PATH}${encodeURIComponent(String(id))}/`, data);
  },
  remove: async (id: number | string) => {
    return await apiService.delete<void>(`${BASE_PATH}${encodeURIComponent(String(id))}/`);
  },
  close: async (id: number | string, body?: Record<string, any>) => {
    return await apiService.post(`${BASE_PATH}${encodeURIComponent(String(id))}/close/`, body ?? {});
  },
};

export default LoanService;
