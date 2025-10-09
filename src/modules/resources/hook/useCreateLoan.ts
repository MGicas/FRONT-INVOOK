import { useState } from 'react';
import { createLoan } from '../service/loan/createLoan';
import type { CreateLoanRequest, CreateLoanResponse } from '../model/Loan';

interface UseCreateLoanReturn {
  createLoanMutation: (data: Omit<CreateLoanRequest, 'action'>) => Promise<CreateLoanResponse>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export const useCreateLoan = (): UseCreateLoanReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createLoanMutation = async (data: Omit<CreateLoanRequest, 'action'>): Promise<CreateLoanResponse> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      const result = await createLoan(data);
      setSuccess(true);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear el préstamo';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createLoanMutation,
    loading,
    error,
    success,
  };
};