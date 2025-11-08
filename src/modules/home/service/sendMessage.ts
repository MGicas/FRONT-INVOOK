import apiService from "../../../shared/modules/instances/AxiosInstance";
import { ENDPOINTS } from "../../../shared/service/Endpoints";

export async function sendMessagesToLenders(): Promise<any> {
  const path = ENDPOINTS.MENSAJES;
  return await apiService.post<any>(path);
}

export default { sendMessagesToLenders };