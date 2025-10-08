 import apiService, { type PaginatedResponse } from '../../../shared/modules/instances/AxiosInstance';
 import { ENDPOINTS } from '../../../shared/service/Endpoints';
 import type { Consum } from '../model/Consum';

 export interface ConsumQuery {
   page?: number;       // 1-based page
   page_size?: number;  // items per page
   search?: string;     // free text search
 }

 export async function getConsum(params: ConsumQuery = {}): Promise<PaginatedResponse<Consum>> {
   const query = new URLSearchParams();
   if (params.page) query.set('page', String(params.page));
   if (params.page_size) query.set('page_size', String(params.page_size));
   if (params.search) query.set('search', params.search);
   const url = `${ENDPOINTS.CONSUMOS}?${query.toString()}`;
   return await apiService.get<PaginatedResponse<Consum>>(url);
 }

