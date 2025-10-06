import apiService from "../../../shared/modules/instances/AxiosInstance";
import type { Monitor } from "../model/Monitor";

export interface ChangeStateMonitorRequest {
  state: 'ACTIVO' | 'INACTIVO';
}

export const changeMonitorState = async (id: number, newState: 'ACTIVO' | 'INACTIVO'): Promise<Monitor> => {
  const data: ChangeStateMonitorRequest = {
    state: newState
  };
  
  const response = await apiService.post<Monitor>(`users/admins/${id}/state/`, data);
  return response;
};

export const deactivateMonitor = async (id: number): Promise<Monitor> => {
  return changeMonitorState(id, 'INACTIVO');
};

export const activateMonitor = async (id: number): Promise<Monitor> => {
  return changeMonitorState(id, 'ACTIVO');
};

export const suspendMonitor = async (id: number): Promise<Monitor> => {
  return changeMonitorState(id, 'INACTIVO');
};

export default {
  changeState: changeMonitorState,
  deactivate: deactivateMonitor,
  activate: activateMonitor,
  suspend: suspendMonitor,
};