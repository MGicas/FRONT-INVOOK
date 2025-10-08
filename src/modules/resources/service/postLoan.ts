import apiService from '../../../shared/modules/instances/AxiosInstance';
import { ENDPOINTS } from '../../../shared/service/Endpoints';
import type { Loan } from '../model/Loan';

export type CreateLoanDTO = {
  borrower: string;
  item: string;
  startDate: string; // ISO date
  endDate?: string;  // ISO date
  notes?: string;
};

export async function postLoan(payload: CreateLoanDTO): Promise<Loan> {
  // If backend uses snake_case keys, map here accordingly.
  return await apiService.post<Loan>(ENDPOINTS.PRESTAMOS, payload);
}

