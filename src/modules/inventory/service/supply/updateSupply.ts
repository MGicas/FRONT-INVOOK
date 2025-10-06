import apiService from "../../../../shared/modules/instances/AxiosInstance";
import type { Supply } from "../../model/Supply";

export interface UpdateSupplyRequest {
  name?: string;
  description?: string;
  supply_type?: string;
  count?: number;
  stock?: number;
  quantity?: number;
}

export const updateSupply = async (
  id: string,
  updateData: UpdateSupplyRequest
): Promise<Supply> => {
  const response = await apiService.patch<Supply>(
    `inventory/supply/${id}/`,
    updateData
  );
  
  return response;
};

export default updateSupply;