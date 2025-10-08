import { useCallback, useEffect, useState } from 'react';
import type { Loan } from '../../model/Loan';
import { getLoans } from '../../service/getResources';

export interface UseGetLoansReturn {
  loans: Loan[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number; // zero-based for MUI TablePagination
  pageSize: number;
  goToPage: (page: number) => void;
  searchLoans: (term: string) => void;
  clearFilters: () => void;
  refetch: () => void;
}

const PAGE_SIZE = 10;

export const useGetLoans = (): UseGetLoansReturn => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0); // zero-based
  const [query, setQuery] = useState<string>('');

  const load = useCallback(async (page = 0, term = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await getLoans({
        page: page + 1, // backend 1-based
        page_size: PAGE_SIZE,
        search: term || undefined,
      });
      setLoans(response.results);
      setTotalCount(response.count);
      setCurrentPage(page);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar préstamos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(0, query);
  }, [load]);

  const goToPage = (page: number) => {
    load(page, query);
  };

  const searchLoans = (term: string) => {
    setQuery(term);
    load(0, term);
  };

  const clearFilters = () => {
    setQuery('');
    load(0, '');
  };

  const refetch = () => load(currentPage, query);

  return {
    loans,
    loading,
    error,
    totalCount,
    currentPage,
    pageSize: PAGE_SIZE,
    goToPage,
    searchLoans,
    clearFilters,
    refetch,
  };
};
