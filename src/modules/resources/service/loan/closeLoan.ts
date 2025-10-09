import { axiosInstance } from "../../../../shared/modules/instances/AxiosInstance";
import type { CloseLoanRequest, CloseLoanResponse } from "../../model/Loan";

export const closeLoan = async (loanId: string): Promise<CloseLoanResponse> => {
  try {
    const request: CloseLoanRequest = {
      action: "close_loan"
    };

    const response = await axiosInstance.post<CloseLoanResponse>(`/loan/${loanId}/`, request);
    return response.data;
  } catch (error) {
    console.error('Error closing loan:', error);
    throw new Error('Error al cerrar el préstamo');
  }
};