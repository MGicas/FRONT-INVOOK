import apiService from "../../../../shared/modules/instances/AxiosInstance";

export interface HardwareTypeDTO {
  id: string;
  name: string;
  description: string;
}

export const getHardwareTypes = async (): Promise<HardwareTypeDTO[]> => {
  const response = await apiService.get<HardwareTypeDTO[]>("inventory/hardware-types/");
  return response;
};

export default {
  getHardwareTypes,
};
