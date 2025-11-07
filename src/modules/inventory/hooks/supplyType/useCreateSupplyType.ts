import { useState, useCallback } from 'react';
import { createSupplyTypeWithValidation, type CreateSupplyTypeRequest } from '../../service/supplyType/postSupplyType';

export interface SupplyType {
  id: string;
  name: string;
  description: string;
}

interface UseCreateSupplyTypeReturn {
  createSupplyType: (data: CreateSupplyTypeRequest) => Promise<SupplyType | null>;
  loading: boolean;
  error: string | null;
  success: boolean;
  clearState: () => void;
}

export const useCreateSupplyType = (): UseCreateSupplyTypeReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const createSupplyType = useCallback(async (data: CreateSupplyTypeRequest): Promise<SupplyType | null> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      const response = await createSupplyTypeWithValidation(data);
      setSuccess(true);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al crear tipo de suministro';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearState = useCallback(() => {
    setError(null);
    setSuccess(false);
    setLoading(false);
  }, []);

  return {
    createSupplyType,
    loading,
    error,
    success,
    clearState,
  };
};

export default useCreateSupplyType;