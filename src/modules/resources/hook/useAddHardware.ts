import { useState } from 'react';
import { addHardwareToLoan } from '../service/loan/addHardwareToLoan';
import type { AddHardwareResponse } from '../model/Loan';

interface UseAddHardwareReturn {
  addHardwareMutation: (loanId: string, serials: string[]) => Promise<AddHardwareResponse>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export const useAddHardware = (): UseAddHardwareReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const addHardwareMutation = async (loanId: string, serials: string[]): Promise<AddHardwareResponse> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      const result = await addHardwareToLoan(loanId, serials);
      setSuccess(true);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al agregar hardware';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    addHardwareMutation,
    loading,
    error,
    success,
  };
};