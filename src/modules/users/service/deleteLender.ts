import apiService from "../../../shared/modules/instances/AxiosInstance";
import type { Lender } from "../model/Lender";

export const deleteLender = async (id: string): Promise<Lender> => {
  const response = await apiService.put<Lender>(`users/lenders/${id}/`, {});
  return response;
};
