import { useCallback, useEffect, useState } from 'react';
import { getHardwareTypes, type HardwareTypeDTO } from '../../service/hardwareType/getHardwareTypes';

interface UseGetHardwareTypesReturn {
  types: HardwareTypeDTO[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useGetHardwareTypes = (): UseGetHardwareTypesReturn => {
  const [types, setTypes] = useState<HardwareTypeDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTypes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getHardwareTypes();
      setTypes(response);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al obtener tipos de hardware';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchTypes();
  }, [fetchTypes]);

  return { types, loading, error, refetch: fetchTypes };
};

export default useGetHardwareTypes;
