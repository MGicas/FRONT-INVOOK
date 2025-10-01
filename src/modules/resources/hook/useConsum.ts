import { useEffect, useState } from 'react';
import ConsumService, { type ConsumPayload } from '../service/ConsumService';

export const useConsum = () => {
  const [items, setItems] = useState<ConsumPayload[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [nameFilter, setNameFilter] = useState('');

  const loadAll = async (pageArg = page) => {
    setIsLoading(true);
    setError('');
    try {
      const data = await ConsumService.list({ page: pageArg, page_size: pageSize, name: nameFilter || undefined });
      if (data && typeof data === 'object' && 'results' in data) {
        const pag = data as { results: ConsumPayload[]; count: number };
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
      setError(e?.message ?? 'Error cargando consumos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAll(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, nameFilter]);

  return {
    items,
    isLoading,
    error,
    page,
    pageSize,
    totalCount,
    setPage,
    nameFilter,
    setNameFilter,
    reload: () => loadAll(1),
  };
};

export default useConsum;
