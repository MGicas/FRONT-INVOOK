import { axiosInstance } from "../../../../shared/modules/instances/AxiosInstance";
import type { ReturnHardwareRequest, ReturnHardwareResponse, HardwareReturn } from "../../model/Loan";

export const returnHardware = async (
  loanId: string, 
  monitor_id: string,
  serials_hardware: HardwareReturn[]
): Promise<ReturnHardwareResponse> => {
  try {
    const request: ReturnHardwareRequest = {
      action: "return_hardware",
      monitor_id,
      serials_hardware
    };

    const response = await axiosInstance.post<ReturnHardwareResponse>(`/loan/${loanId}/`, request);
    return response.data;
  } catch (error) {
    console.error('Error returning hardware:', error);
    throw new Error('Error al devolver el hardware');
  }
};