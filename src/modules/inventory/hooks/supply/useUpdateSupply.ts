import { useState, useCallback } from "react";
import { updateSupply } from "../../service/supply/updateSupply";
import type { UpdateSupplyRequest } from "../../service/supply/updateSupply";
import type { Supply } from "../../model/Supply";

interface UseUpdateSupplyReturn {
  loading: boolean;
  error: string | null;
  updateSupply: (id: string, updateData: UpdateSupplyRequest) => Promise<Supply | null>;
  clearError: () => void;
}

export const useUpdateSupply = (): UseUpdateSupplyReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleUpdateSupply = useCallback(async (
    id: string,
    updateData: UpdateSupplyRequest
  ): Promise<Supply | null> => {
    try {
      setLoading(true);
      setError(null);

      const updatedSupply = await updateSupply(id, updateData);
      return updatedSupply;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al actualizar suministro";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    updateSupply: handleUpdateSupply,
    clearError,
  };
};

export default useUpdateSupply;