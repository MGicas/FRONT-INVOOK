
import { useState, useEffect, useCallback } from "react";
import { getConsums } from "../service/consum/getConsums";
import type { Consum } from "../model/Consum";

interface UseGetConsumDataReturn {
  data: Consum[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  searchTerm: string;
  refetch: () => Promise<void>;
  searchConsums: (searchTerm: string) => void;
  clearSearch: () => void;
}

export const useGetConsumData = (): UseGetConsumDataReturn => {
  const [allData, setAllData] = useState<Consum[]>([]);
  const [data, setData] = useState<Consum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const applySearch = useCallback((consums: Consum[], search: string = "") => {
    let filteredData = consums;
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filteredData = consums.filter(consum =>
        consum.id.toLowerCase().includes(searchLower) ||
        consum.id_lender.toLowerCase().includes(searchLower) ||
        consum.id_monitor.toLowerCase().includes(searchLower)
      );
    }

    setData(filteredData);
    setTotalCount(filteredData.length);
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const consums = await getConsums();
      setAllData(consums);
      applySearch(consums, searchTerm);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al cargar consumos";
      setError(errorMessage);
      console.error("Error fetching consums:", err);
    } finally {
      setLoading(false);
    }
  }, [applySearch, searchTerm]);

  const searchConsums = useCallback((search: string) => {
    setSearchTerm(search);
    applySearch(allData, search);
  }, [applySearch, allData]);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    applySearch(allData, "");
  }, [applySearch, allData]);

  const refetch = useCallback(async () => {
    await loadData();
  }, [loadData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    loading,
    error,
    totalCount,
    searchTerm,
    refetch,
    searchConsums,
    clearSearch,
  };
};