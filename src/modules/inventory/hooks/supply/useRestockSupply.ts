import { useState, useCallback } from "react";
import { restockSupply, type RestockSupplyRequest } from "../../service/supply/restockSupply";
import type { Supply } from "../../model/Supply";

interface UseRestockSupplyReturn {
  loading: boolean;
  error: string | null;
  restockSupply: (id: string, restockData: RestockSupplyRequest) => Promise<Supply | null>;
  clearError: () => void;
}

export const useRestockSupply = (): UseRestockSupplyReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleRestockSupply = useCallback(async (
    id: string,
    restockData: RestockSupplyRequest
  ): Promise<Supply | null> => {
    try {
      setLoading(true);
      setError(null);

      const updatedSupply = await restockSupply(id, restockData);
      return updatedSupply;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al hacer restock del suministro";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    restockSupply: handleRestockSupply,
    clearError,
  };
};

export default useRestockSupply;