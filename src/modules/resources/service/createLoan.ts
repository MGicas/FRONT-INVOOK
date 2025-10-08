import apiService from '../../../shared/modules/instances/AxiosInstance';
import { ENDPOINTS } from '../../../shared/service/Endpoints';
import type { Loan } from '../model/Loan';

export interface CreateLoanRequest {
  action: 'create';
  id_lender: string; // cedula prestamista
  id_monitor: string; // id monitor
  serials_hardware: string[]; // seriales de hardware
}

export type CreateLoanResponse = Loan | Loan[];

export async function createLoan(payload: CreateLoanRequest): Promise<CreateLoanResponse> {
  return await apiService.post<CreateLoanResponse>(ENDPOINTS.PRESTAMOS, payload);
}

export function pickLoanFromCreateResponse(resp: CreateLoanResponse): Loan | null {
  if (!resp) return null;
  if (Array.isArray(resp)) return resp[0] ?? null;
  return resp;
}
