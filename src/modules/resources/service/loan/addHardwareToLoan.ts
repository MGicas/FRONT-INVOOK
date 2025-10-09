import { axiosInstance } from "../../../../shared/modules/instances/AxiosInstance";
import type { AddHardwareRequest, AddHardwareResponse } from "../../model/Loan";

export const addHardwareToLoan = async (
  loanId: string, 
  serials_hardware: string[]
): Promise<AddHardwareResponse> => {
  try {
    const request: AddHardwareRequest = {
      action: "add_hardware",
      serials_hardware
    };

    const response = await axiosInstance.post<AddHardwareResponse>(`/loan/${loanId}/`, request);
    return response.data;
  } catch (error) {
    console.error('Error adding hardware to loan:', error);
    throw new Error('Error al agregar hardware al préstamo');
  }
};