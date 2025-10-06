import { useState, useEffect, useCallback } from "react";
import { getLenders } from "../service/getLender";
import type { Lender } from "../model/Lender";

interface UseGetLendersReturn {
  lenders: Lender[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
  searchTerm: string;
  refetch: () => Promise<void>;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  searchLenders: (searchTerm: string) => void;
  clearFilters: () => void;
  loadAllPages: () => void;
}

export const useGetLenders = (): UseGetLendersReturn => {
  const [allLenders, setAllLenders] = useState<Lender[]>([]);
  const [lenders, setLenders] = useState<Lender[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const ITEMS_PER_PAGE = 20; 

  const applyPagination = useCallback((data: Lender[], page: number, search: string = "") => {
    let filteredData = data;
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filteredData = data.filter(lender =>
        lender.names.toLowerCase().includes(searchLower) ||
        lender.surnames.toLowerCase().includes(searchLower) ||
        lender.email.toLowerCase().includes(searchLower) ||
        lender.id.toLowerCase().includes(searchLower) ||
        lender.phone?.toLowerCase().includes(searchLower)
      );
    }

    const totalItems = filteredData.length;
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    setLenders(paginatedData);
    setTotalCount(totalItems);
    setCurrentPage(page);
    setHasNext(endIndex < totalItems);
    setHasPrevious(page > 1);
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLenders();
      setAllLenders(data);
      applyPagination(data, 1, "");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al cargar prestamistas";
      setError(errorMessage);
      console.error("Error fetching lenders:", err);
    } finally {
      setLoading(false);
    }
  }, [applyPagination]);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLenders();
      setAllLenders(data);
      applyPagination(data, currentPage, searchTerm);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al cargar prestamistas";
      setError(errorMessage);
      console.error("Error fetching lenders:", err);
    } finally {
      setLoading(false);
    }
  }, [applyPagination, currentPage, searchTerm]);

  const goToPage = useCallback((page: number) => {
    applyPagination(allLenders, page, searchTerm);
  }, [applyPagination, allLenders, searchTerm]);

  const nextPage = useCallback(() => {
    if (hasNext) {
      applyPagination(allLenders, currentPage + 1, searchTerm);
    }
  }, [applyPagination, allLenders, currentPage, hasNext, searchTerm]);

  const previousPage = useCallback(() => {
    if (hasPrevious) {
      applyPagination(allLenders, currentPage - 1, searchTerm);
    }
  }, [applyPagination, allLenders, currentPage, hasPrevious, searchTerm]);

  const searchLenders = useCallback((newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
    applyPagination(allLenders, 1, newSearchTerm);
  }, [applyPagination, allLenders]);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    applyPagination(allLenders, 1, "");
  }, [applyPagination, allLenders]);

  const loadAllPages = useCallback(() => {
    setSearchTerm("");
    applyPagination(allLenders, 1, "");
  }, [applyPagination, allLenders]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    lenders,
    loading,
    error,
    totalCount,
    currentPage,
    hasNext,
    hasPrevious,
    searchTerm,
    refetch,
    goToPage,
    nextPage,
    previousPage,
    searchLenders,
    clearFilters,
    loadAllPages,
  };
};

export default useGetLenders;