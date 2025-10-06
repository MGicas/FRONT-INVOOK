import { useState, useEffect, useCallback } from "react";
import { getMonitors, searchMonitors, getAllMonitors, type MonitorsPaginatedData } from "../service/getMonitor";
import type { Monitor } from "../model/Monitor";

interface UseGetMonitorsReturn {
  monitors: Monitor[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
  searchMonitors: (searchTerm: string) => Promise<void>;
  clearFilters: () => Promise<void>;
  refetch: () => Promise<void>;
  goToPage: (page: number) => Promise<void>;
  nextPage: () => Promise<void>;
  previousPage: () => Promise<void>;
  loadAllPages: () => Promise<void>;
}

export const useGetMonitors = (): UseGetMonitorsReturn => {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSearch, setCurrentSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [hasPrevious, setHasPrevious] = useState<boolean>(false);

  const fetchMonitors = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const data: MonitorsPaginatedData = await getMonitors(page);
      
      setMonitors(data.monitors);
      setTotalCount(data.totalCount);
      setHasNext(data.hasNext);
      setHasPrevious(data.hasPrevious);
      setCurrentPage(page);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al cargar monitores";
      setError(errorMessage);
      console.error("Error fetching monitors:", err);
      setMonitors([]);
      setTotalCount(0);
      setHasNext(false);
      setHasPrevious(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = useCallback(async (searchTerm: string, page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      setCurrentSearch(searchTerm);
      
      const data: MonitorsPaginatedData = await searchMonitors(searchTerm, page);
      
      setMonitors(data.monitors);
      setTotalCount(data.totalCount);
      setHasNext(data.hasNext);
      setHasPrevious(data.hasPrevious);
      setCurrentPage(page);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al buscar monitores";
      setError(errorMessage);
      console.error("Error searching monitors:", err);
      setMonitors([]);
      setTotalCount(0);
      setHasNext(false);
      setHasPrevious(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearFilters = useCallback(async () => {
    setCurrentSearch("");
    setCurrentPage(1);
    await fetchMonitors(1);
  }, [fetchMonitors]);

  const refetch = useCallback(async () => {
    if (currentSearch) {
      await handleSearch(currentSearch, currentPage);
    } else {
      await fetchMonitors(currentPage);
    }
  }, [currentSearch, currentPage, handleSearch, fetchMonitors]);

  const goToPage = useCallback(async (page: number) => {
    if (currentSearch) {
      await handleSearch(currentSearch, page);
    } else {
      await fetchMonitors(page);
    }
  }, [currentSearch, handleSearch, fetchMonitors]);

  const nextPage = useCallback(async () => {
    if (hasNext) {
      await goToPage(currentPage + 1);
    }
  }, [hasNext, currentPage, goToPage]);

  const previousPage = useCallback(async () => {
    if (hasPrevious) {
      await goToPage(currentPage - 1);
    }
  }, [hasPrevious, currentPage, goToPage]);

  const loadAllPages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const allMonitors = await getAllMonitors();
      setMonitors(allMonitors);
      setTotalCount(allMonitors.length);
      setCurrentPage(1);
      setHasNext(false);
      setHasPrevious(false);
      setCurrentSearch("");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al cargar todos los monitores";
      setError(errorMessage);
      console.error("Error loading all monitors:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMonitors(1);
  }, [fetchMonitors]);

  return {
    monitors,
    loading,
    error,
    totalCount,
    currentPage,
    hasNext,
    hasPrevious,
    searchMonitors: (searchTerm: string) => handleSearch(searchTerm, 1),
    clearFilters,
    refetch,
    goToPage,
    nextPage,
    previousPage,
    loadAllPages,
  };
};

export default useGetMonitors;