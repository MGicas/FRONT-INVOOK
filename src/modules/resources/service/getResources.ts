import apiService, { type PaginatedResponse } from '../../../shared/modules/instances/AxiosInstance';
import { ENDPOINTS } from '../../../shared/service/Endpoints';
import type { Loan } from '../model/Loan';

export interface LoanQuery {
  page?: number;       // 1-based page
  page_size?: number;  // items per page
  search?: string;     // free text search
}

export async function getLoans(params: LoanQuery = {}): Promise<PaginatedResponse<Loan>> {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.page_size) query.set('page_size', String(params.page_size));
  if (params.search) query.set('search', params.search);
  const url = `${ENDPOINTS.PRESTAMOS}?${query.toString()}`;
  return await apiService.get<PaginatedResponse<Loan>>(url);
}

