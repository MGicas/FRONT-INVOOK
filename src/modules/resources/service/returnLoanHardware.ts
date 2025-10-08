import apiService from '../../../shared/modules/instances/AxiosInstance';
import { ENDPOINTS } from '../../../shared/service/Endpoints';
import type { Loan } from '../model/Loan';

export type ReturnHardwareItem = { serial: string; state: string };

export interface ReturnLoanHardwareRequest {
  action: 'return_hardware';
  id_monitor: string | number;
  serials_hardware: ReturnHardwareItem[];
}

export type ReturnLoanHardwareResponse = Loan | Loan[];

export async function returnLoanHardware(payload: ReturnLoanHardwareRequest): Promise<ReturnLoanHardwareResponse> {
  // POST to loan endpoint with action per backend contract
  return await apiService.post<ReturnLoanHardwareResponse>(ENDPOINTS.PRESTAMOS, payload);
}

export function pickLoanFromResponse(resp: ReturnLoanHardwareResponse, currentLoanId?: string): Loan | null {
  if (!resp) return null;
  if (Array.isArray(resp)) {
    if (currentLoanId) {
      const found = resp.find(l => l.id === currentLoanId);
      return found ?? (resp.length > 0 ? resp[0] : null);
    }
    return resp.length > 0 ? resp[0] : null;
  }
  return resp;
}
