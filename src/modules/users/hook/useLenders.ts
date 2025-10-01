import { useEffect, useState } from 'react';
import LenderService from '../service/LenderService';
import type { Lender } from '../model/Lender';

export const useLenders = () => {
  const [lenders, setLenders] = useState<Lender[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLenders = async (params?: { page?: number; page_size?: number; name?: string }) => {
    try {
      setLoading(true);
      const res = await LenderService.list(params);
      const results = (res as any)?.results ?? (res as any);
      setLenders(results as Lender[]);
      setError(null);
    } catch (e) {
      setError('Error al cargar prestamistas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLenders();
  }, []);

  return { lenders, loading, error, fetchLenders };
};
