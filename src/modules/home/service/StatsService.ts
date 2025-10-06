import apiService from '../../../shared/modules/instances/AxiosInstance';
import { ENDPOINTS } from '../../../shared/service/Endpoints';
import type { Stats } from '../model/Stats';


export function StatsService() {

  async function getStats(): Promise<Stats> {
    const statsPath = ENDPOINTS.STATS.replace('http://127.0.0.1:8000/api/v1/invook/', '');
    return await apiService.get<Stats>(statsPath);
  }

  return {
    getStats
  };
}

export default StatsService();