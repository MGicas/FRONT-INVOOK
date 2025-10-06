import { useState, useCallback } from "react";
import {
  createSupplyWithValidation,
  createSupplyWithDefaults,
  type CreateSupplyRequest,
  type CreateSupplyResponse,
} from "../../service/supply/postSupply";

interface UseCreateSupplyReturn {
  loading: boolean;
  error: string | null;
  createSupply: (supplyData: CreateSupplyRequest) => Promise<CreateSupplyResponse | null>;
  createSupplyWithDefaults: (partialData: Partial<CreateSupplyRequest> & { name: string }) => Promise<CreateSupplyResponse | null>;
  clearError: () => void;
}

export const useCreateSupply = (): UseCreateSupplyReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleCreateSupply = useCallback(async (
    supplyData: CreateSupplyRequest
  ): Promise<CreateSupplyResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await createSupplyWithValidation(supplyData);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error desconocido al crear suministro";
      console.error("Error en creación de suministro:", err);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreateSupplyWithDefaults = useCallback(async (
    partialData: Partial<CreateSupplyRequest> & { name: string }
  ): Promise<CreateSupplyResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await createSupplyWithDefaults(partialData);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error desconocido al crear suministro";
      console.error("Error en creación de suministro con valores por defecto:", err);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createSupply: handleCreateSupply,
    createSupplyWithDefaults: handleCreateSupplyWithDefaults,
    clearError,
  };
};

export default useCreateSupply;