import { useState, useEffect, useCallback } from 'react';
import { getHardware, getHardwareByType, searchHardwareByType } from '../../service/hardware/getHardware';
import type { Hardware } from '../../model/Hardware';

interface UseGetHardwareReturn {
  hardware: Hardware[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  filterByType: (type: string) => Promise<void>;
  searchByType: (searchTerm: string) => Promise<void>;
  clearFilters: () => Promise<void>;
}

export const useGetHardware = (): UseGetHardwareReturn => {
  const [hardware, setHardware] = useState<Hardware[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadAllHardware = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getHardware();
      setHardware(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido al cargar hardware');
    } finally {
      setLoading(false);
    }
  }, []);

  const filterByType = useCallback(async (type: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getHardwareByType(type);
      setHardware(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al filtrar hardware');
    } finally {
      setLoading(false);
    }
  }, []);

  const searchByType = useCallback(async (searchTerm: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await searchHardwareByType(searchTerm);
      setHardware(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al buscar hardware');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearFilters = useCallback(async () => {
    await loadAllHardware();
  }, [loadAllHardware]);
  useEffect(() => {
    loadAllHardware();
  }, [loadAllHardware]);

  return {
    hardware,
    loading,
    error,
    refetch: loadAllHardware,
    filterByType,
    searchByType,
    clearFilters,
  };
};

export default useGetHardware;