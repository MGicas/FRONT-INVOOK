import apiService from "../../../../shared/modules/instances/AxiosInstance";
import type { Hardware } from "../../model/Hardware";

export const getHardware = async (): Promise<Hardware[]> => {
  const response = await apiService.get<Hardware[]>("inventory/hardware/");
  return response;
};

export const getHardwareByType = async (type: string): Promise<Hardware[]> => {
  const lowerCaseType = type.toLowerCase();
  const response = await apiService.get<Hardware[]>(`inventory/hardware/?hardware_type=${encodeURIComponent(lowerCaseType)}`);
  return response;
};

export const searchHardwareByType = async (searchTerm: string): Promise<Hardware[]> => {
  if (!searchTerm.trim()) {
    return getHardware();
  }
  
  const lowerCaseSearchTerm = searchTerm.toLowerCase();
  const response = await apiService.get<Hardware[]>(`inventory/hardware/?hardware_type=${encodeURIComponent(lowerCaseSearchTerm)}`);
  return response;
};

export default {
  getAll: getHardware,
  getByType: getHardwareByType,
  searchByType: searchHardwareByType,
};
