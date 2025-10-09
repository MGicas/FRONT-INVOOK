import { useState } from 'react';
import { closeLoan } from '../service/loan/closeLoan';
import type { CloseLoanResponse } from '../model/Loan';

interface UseCloseLoanReturn {
  closeLoanMutation: (loanId: string) => Promise<CloseLoanResponse>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export const useCloseLoan = (): UseCloseLoanReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const closeLoanMutation = async (loanId: string): Promise<CloseLoanResponse> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      const result = await closeLoan(loanId);
      setSuccess(true);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cerrar el préstamo';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    closeLoanMutation,
    loading,
    error,
    success,
  };
};