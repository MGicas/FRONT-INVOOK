import apiService from "../../../../shared/modules/instances/AxiosInstance";
import type { Supply } from "../../model/Supply";

export const getSupplies = async (): Promise<Supply[]> => {
  try {
    const response = await apiService.get<Supply[]>("inventory/supply/");
    return response;
  } catch (error) {
    console.error("Error al obtener suministros:", error);
    throw error;
  }
};

export const searchSupplies = async (searchTerm: string): Promise<Supply[]> => {
  if (!searchTerm.trim()) {
    return getSupplies();
  }

  try {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const response = await apiService.get<Supply[]>(
      `inventory/supply/?supply_type=${encodeURIComponent(lowerCaseSearchTerm)}`
    );
    return response;
  } catch (error) {
    console.error("Error al buscar suministros:", error);
    throw error;
  }
};



export default {
  getAll: getSupplies,
  search: searchSupplies,
};