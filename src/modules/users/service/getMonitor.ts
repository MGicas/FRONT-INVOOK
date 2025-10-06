import apiService from "../../../shared/modules/instances/AxiosInstance";
import type { Monitor } from "../model/Monitor";

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface MonitorsPaginatedData {
  monitors: Monitor[];
  totalCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
  nextPage: number | null;
  previousPage: number | null;
}

export const getMonitors = async (page: number = 1): Promise<MonitorsPaginatedData> => {
  const response = await apiService.get<PaginatedResponse<Monitor>>(
    `users/admins/?page=${page}`
  );
  
  const nextPage = response.next ? extractPageFromUrl(response.next) : null;
  const previousPage = response.previous ? extractPageFromUrl(response.previous) : null;
  
  return {
    monitors: response.results,
    totalCount: response.count,
    hasNext: !!response.next,
    hasPrevious: !!response.previous,
    nextPage,
    previousPage,
  };
};

export const getAllMonitors = async (): Promise<Monitor[]> => {
  let allMonitors: Monitor[] = [];
  let currentPage = 1;
  let hasNext = true;

  while (hasNext) {
    const response = await apiService.get<PaginatedResponse<Monitor>>(
      `users/admins/?page=${currentPage}`
    );
    
    allMonitors = [...allMonitors, ...response.results];
    hasNext = !!response.next;
    currentPage++;
  }

  return allMonitors;
};

export const searchMonitors = async (
  searchTerm: string,
  page: number = 1
): Promise<MonitorsPaginatedData> => {
  if (!searchTerm.trim()) {
    return getMonitors(page);
  }

  const response = await apiService.get<PaginatedResponse<Monitor>>(
    `users/admins/?names=${encodeURIComponent(searchTerm)}&page=${page}`
  );
  
  const nextPage = response.next ? extractPageFromUrl(response.next) : null;
  const previousPage = response.previous ? extractPageFromUrl(response.previous) : null;
  
  return {
    monitors: response.results,
    totalCount: response.count,
    hasNext: !!response.next,
    hasPrevious: !!response.previous,
    nextPage,
    previousPage,
  };
};

const extractPageFromUrl = (url: string): number | null => {
  const regex = /[?&]page=(\d+)/;
  const match = regex.exec(url);
  return match ? parseInt(match[1], 10) : null;
};

export default {
  getAll: getMonitors,
  search: searchMonitors,
};
