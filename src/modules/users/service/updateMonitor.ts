import apiService from "../../../shared/modules/instances/AxiosInstance";
import type { Monitor } from "../model/Monitor";

export interface UpdateMonitorRequest {
  phone?: string;
  rfid?: string;
  names?: string;
  surnames?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  username?: string;
  state?: string;
}

export const updateMonitor = async (id: number, data: UpdateMonitorRequest): Promise<Monitor> => {
  const response = await apiService.patch<Monitor>(`users/admins/profile/${id}`, data);
  return response;
};

export default {
  update: updateMonitor,
};