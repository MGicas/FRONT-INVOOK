import { useCallback, useEffect, useState } from 'react';
import { getSupplyTypes, type SupplyTypeDTO } from '../../service/supplyType/getSupplyType';

interface UseGetSupplyTypesReturn {
  types: SupplyTypeDTO[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useGetSupplyTypes = (): UseGetSupplyTypesReturn => {
  const [types, setTypes] = useState<SupplyTypeDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTypes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getSupplyTypes();
      setTypes(response);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al obtener tipos de suministro';
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

export default useGetSupplyTypes;