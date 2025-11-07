import { useState, useCallback } from 'react';
import { createHardwareTypeWithValidation, type CreateHardwareTypeRequest } from '../../service/hardwareType/postHardwareType';

export interface HardwareType {
  id: string;
  name: string;
  description: string;
}

interface UseCreateHardwareTypeReturn {
  createHardwareType: (data: CreateHardwareTypeRequest) => Promise<HardwareType | null>;
  loading: boolean;
  error: string | null;
  success: boolean;
  clearState: () => void;
}

export const useCreateHardwareType = (): UseCreateHardwareTypeReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const createHardwareType = useCallback(async (data: CreateHardwareTypeRequest): Promise<HardwareType | null> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      const response = await createHardwareTypeWithValidation(data);
      setSuccess(true);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al crear tipo de hardware';
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
    createHardwareType,
    loading,
    error,
    success,
    clearState,
  };
};

export default useCreateHardwareType;
