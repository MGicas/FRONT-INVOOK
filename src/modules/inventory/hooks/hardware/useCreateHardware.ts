import { useState, useCallback } from 'react';
import type { Hardware } from '../../model/Hardware';
import { createHardwareWithValidation, type CreateHardwareRequest } from '../../service/hardware/postHardware';

interface UseCreateHardwareReturn {
  createHardware: (data: CreateHardwareRequest) => Promise<Hardware | null>;
  loading: boolean;
  error: string | null;
  success: boolean;
  clearState: () => void;
}

export const useCreateHardware = (): UseCreateHardwareReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const createHardware = useCallback(async (data: CreateHardwareRequest): Promise<Hardware | null> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);      
      const response = await createHardwareWithValidation(data);
      setSuccess(true);
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al crear hardware';
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
    createHardware,
    loading,
    error,
    success,
    clearState,
  };
};

export default useCreateHardware;