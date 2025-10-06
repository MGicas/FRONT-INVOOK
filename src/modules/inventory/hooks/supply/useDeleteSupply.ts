import { useState, useCallback } from "react";
import { deleteSupply } from "../../service/supply/deleteSupply";

interface UseDeleteSupplyReturn {
  loading: boolean;
  error: string | null;
  deleteSupply: (code: string) => Promise<boolean>;
  clearError: () => void;
}

export const useDeleteSupply = (): UseDeleteSupplyReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleDeleteSupply = useCallback(async (code: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await deleteSupply(code);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al eliminar suministro";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    deleteSupply: handleDeleteSupply,
    clearError,
  };
};

export default useDeleteSupply;