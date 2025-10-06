import apiService from "../../../shared/modules/instances/AxiosInstance";
import type { Lender } from "../model/Lender";

export const getLenders = async (): Promise<Lender[]> => {
  const response = await apiService.get<Lender[]>(`users/lenders/`);
  return response;
};

export const getLenderById = async (id: string): Promise<Lender> => {
  const response = await apiService.get<Lender>(`users/lenders/${id}`);
  return response;
};