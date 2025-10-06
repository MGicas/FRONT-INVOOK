import apiService from "../../../../shared/modules/instances/AxiosInstance";
import type { Supply } from "../../model/Supply";

export interface RestockSupplyRequest {
  count: number;
  quantity: number;
}

export const restockSupply = async (
  id: string,
  restockData: RestockSupplyRequest
): Promise<Supply> => {
  const response = await apiService.post<Supply>(
    `inventory/supply/${id}/restock/`,
    restockData
  );
  
  return response;
};

export default restockSupply;