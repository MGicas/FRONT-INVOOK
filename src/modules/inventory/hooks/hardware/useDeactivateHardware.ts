import { useState, useCallback } from "react";
import {
  deactivateHardwareWithValidation,
  type DeactivateHardwareResponse,
} from "../../service/hardware/deactiveHardware";

interface UseDeactivateHardwareReturn {
  loading: boolean;
  error: string | null;
  deactivateHardware: (serial: string) => Promise<DeactivateHardwareResponse | null>;
  clearError: () => void;
}

export const useDeactivateHardware = (): UseDeactivateHardwareReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleDeactivateHardware = useCallback(async (
    serial: string
  ): Promise<DeactivateHardwareResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      const result = await deactivateHardwareWithValidation(serial);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error desconocido al eliminar hardware";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    deactivateHardware: handleDeactivateHardware,
    clearError,
  };
};

export default useDeactivateHardware;