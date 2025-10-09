import { useState } from "react";
import { postConsum } from "../service/consum/postConsum";
import type { ConsumCreateRequest, ConsumCreateResponse } from "../model/Consum";

interface UsePostConsumReturn {
  createConsum: (data: ConsumCreateRequest) => Promise<ConsumCreateResponse | null>;
  loading: boolean;
  error: string | null;
  success: boolean;
  clearState: () => void;
}

export const usePostConsum = (): UsePostConsumReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createConsum = async (data: ConsumCreateRequest): Promise<ConsumCreateResponse | null> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await postConsum(data);
      setSuccess(true);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al crear el consumo";
      setError(errorMessage);
      console.error("Error creating consum:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearState = () => {
    setError(null);
    setSuccess(false);
  };

  return {
    createConsum,
    loading,
    error,
    success,
    clearState,
  };
};