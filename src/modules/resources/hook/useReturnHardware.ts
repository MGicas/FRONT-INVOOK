import { useState } from 'react';
import { returnHardware } from '../service/loan/returnHardware';
import type { ReturnHardwareResponse, HardwareReturn } from '../model/Loan';

interface UseReturnHardwareReturn {
  returnHardwareMutation: (loanId: string, monitor_id: string, hardware: HardwareReturn[]) => Promise<ReturnHardwareResponse>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export const useReturnHardware = (): UseReturnHardwareReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const returnHardwareMutation = async (
    loanId: string, 
    monitor_id: string, 
    hardware: HardwareReturn[]
  ): Promise<ReturnHardwareResponse> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      const result = await returnHardware(loanId, monitor_id, hardware);
      setSuccess(true);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al devolver hardware';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    returnHardwareMutation,
    loading,
    error,
    success,
  };
};