import apiService from "../../../shared/modules/instances/AxiosInstance";
import type { Lender } from "../model/Lender";

export interface CreateLenderRequest {
  id: string;
  rfid: string;
  names: string;
  surnames: string;
  email: string;
  phone: string;
}

export const createLender = async (lenderData: CreateLenderRequest): Promise<Lender> => {
  const response = await apiService.post<Lender>(`users/lenders/`, lenderData);
  return response;
};
