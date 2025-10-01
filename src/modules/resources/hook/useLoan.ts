import { useEffect, useState } from 'react';
import LoanService, { type LoanPayload } from '../service/LoanService';

export const useLoan = () => {
  const [items, setItems] = useState<LoanPayload[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<{ status?: string; borrower?: string }>({});

  const loadAll = async (pageArg = page) => {
    setIsLoading(true);
    setError('');
    try {
      const data = await LoanService.list({ page: pageArg, page_size: pageSize, ...filters });
      if (data && typeof data === 'object' && 'results' in data) {
        const pag = data as { results: LoanPayload[]; count: number };
        setItems(pag.results);
        setTotalCount(pag.count);
      } else if (Array.isArray(data)) {
        setItems(data);
        setTotalCount(data.length);
      } else {
        setItems([]);
        setTotalCount(0);
      }
    } catch (e: any) {
      setError(e?.message ?? 'Error cargando préstamos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAll(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters.status, filters.borrower]);

  return {
    items,
    isLoading,
    error,
    page,
    pageSize,
    totalCount,
    setPage,
    filters,
    setFilters,
    reload: () => loadAll(1),
  };
};

export default useLoan;
