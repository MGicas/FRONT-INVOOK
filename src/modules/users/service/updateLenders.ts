import apiService from "../../../shared/modules/instances/AxiosInstance";
import type { Lender } from "../model/Lender";

export interface UpdateLenderRequest {
  names?: string;
  surnames?: string;
  email?: string;
  phone?: string;
}

export const updateLender = async (id: string, lenderData: UpdateLenderRequest): Promise<Lender> => {
  const response = await apiService.patch<Lender>(`users/lenders/${id}/`, lenderData);
  return response;
};
