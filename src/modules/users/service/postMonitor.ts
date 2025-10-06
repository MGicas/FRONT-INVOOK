import apiService from "../../../shared/modules/instances/AxiosInstance";
import type { Monitor } from "../model/Monitor";

export interface CreateMonitorRequest {
  username: string;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
  rfid: string;
  names: string;
  surnames: string;
  phone: string;
  document_id: string;
  role: string;
}

export interface UpdateMonitorRequest {
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  rfid?: string;
  names?: string;
  surnames?: string;
  phone?: string;
  document_id?: string;
  role?: string;
  state?: string;
}

export const createMonitor = async (data: CreateMonitorRequest): Promise<Monitor> => {
  const response = await apiService.post<Monitor>("users/admins/", data);
  return response;
};

export const updateMonitor = async (id: number, data: UpdateMonitorRequest): Promise<Monitor> => {
  const response = await apiService.put<Monitor>(`users/admins/${id}/`, data);
  return response;
};

export const deleteMonitor = async (id: number): Promise<void> => {
  await apiService.delete(`users/admins/${id}/`);
};

export default {
  create: createMonitor,
  update: updateMonitor,
  delete: deleteMonitor,
};