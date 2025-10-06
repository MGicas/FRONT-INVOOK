import { useState, useEffect, useCallback } from "react";
import { getSupplies, searchSupplies } from "../../service/supply/getSupplies";
import type { Supply } from "../../model/Supply";

interface UseGetSuppliesReturn {
  supplies: Supply[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  searchSupplies: (searchTerm: string) => Promise<void>;
  clearFilters: () => Promise<void>;
}

export const useGetSupplies = (): UseGetSuppliesReturn => {
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadAllSupplies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSupplies();
      setSupplies(data);
    } catch (err) {
      console.error("Error al cargar suministros:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Error desconocido al cargar suministros"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearchSupplies = useCallback(async (searchTerm: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await searchSupplies(searchTerm);
      setSupplies(data);
    } catch (err) {
      console.error("Error al buscar suministros:", err);
      setError(
        err instanceof Error ? err.message : "Error al buscar suministros"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const clearFilters = useCallback(async () => {
    await loadAllSupplies();
  }, [loadAllSupplies]);

  useEffect(() => {
    loadAllSupplies();
  }, [loadAllSupplies]);

  return {
    supplies,
    loading,
    error,
    refetch: loadAllSupplies,
    searchSupplies: handleSearchSupplies,
    clearFilters,
  };
};

export default useGetSupplies;
