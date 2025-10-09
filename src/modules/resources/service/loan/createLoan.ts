import { axiosInstance } from "../../../../shared/modules/instances/AxiosInstance";
import type { CreateLoanRequest, CreateLoanResponse } from "../../model/Loan";

export const createLoan = async (data: Omit<CreateLoanRequest, 'action'>): Promise<CreateLoanResponse> => {
  try {
    const request: CreateLoanRequest = {
      action: "create",
      ...data
    };

    const response = await axiosInstance.post<CreateLoanResponse>('/loan/', request);
    return response.data;
  } catch (error) {
    console.error('Error creating loan:', error);
    throw new Error('Error al crear el préstamo');
  }
};