import apiService from "../../../../shared/modules/instances/AxiosInstance";

export const deleteSupply = async (code: string): Promise<void> => {
  await apiService.put<void>(`inventory/supply/${code}/`, {});
};

export default deleteSupply;