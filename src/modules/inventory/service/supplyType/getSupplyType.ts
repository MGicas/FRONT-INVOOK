import apiService from "../../../../shared/modules/instances/AxiosInstance";

export interface SupplyTypeDTO {
  id: string;
  name: string;
  description: string;
}

export const getSupplyTypes = async (): Promise<SupplyTypeDTO[]> => {
  const response = await apiService.get<SupplyTypeDTO[]>("inventory/supply-types/");
  return response;
};

export default {
  getSupplyTypes,
};