import apiService from "../../../shared/modules/instances/AxiosInstance";
import type { Loan } from "../model/Loan";

/**
 * Obtiene un préstamo por su ID (UUID).
 * @param id UUID del préstamo
 * @returns Loan
 */
export const getLoan = async (id: string): Promise<Loan> => {
  const response = await apiService.get<Loan>(`loan/${id}/`);
  return response;
};

export default {
  getById: getLoan,
};