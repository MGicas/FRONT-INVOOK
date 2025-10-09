import { useState, useEffect, useCallback } from "react";
import { getLoans } from "../service/loan/getLoans";
import type { Loan } from "../model/Loan";

interface UseGetLoanDataReturn {
  data: Loan[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  totalCount: number;
  refetch: () => Promise<void>;
  searchLoans: (term: string) => void;
  clearSearch: () => void;
}

export const useGetLoanData = (): UseGetLoanDataReturn => {
  const [data, setData] = useState<Loan[]>([]);
  const [allData, setAllData] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const loans = await getLoans();
      setAllData(loans);
      setData(loans);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  const searchLoans = useCallback((term: string) => {
    setSearchTerm(term);
    if (!term) {
      setData(allData);
      return;
    }

    const filtered = allData.filter((loan) =>
      applySearch(loan, term.toLowerCase())
    );
    setData(filtered);
  }, [allData]);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    setData(allData);
  }, [allData]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    searchTerm,
    totalCount: allData.length,
    refetch,
    searchLoans,
    clearSearch,
  };
};

const applySearch = (loan: Loan, searchTerm: string): boolean => {
  if (loan.id.toLowerCase().includes(searchTerm)) {
    return true;
  }

  const lenderName = `${loan.id_lender.names} ${loan.id_lender.surnames}`.toLowerCase();
  if (lenderName.includes(searchTerm)) {
    return true;
  }

  if (loan.id_lender.email.toLowerCase().includes(searchTerm)) {
    return true;
  }

  const hasHardwareMatch = loan.hardwares.some(item => 
    item.hardware.name.toLowerCase().includes(searchTerm) ||
    item.hardware.serial.toLowerCase().includes(searchTerm) ||
    item.hardware.hardware_type.toLowerCase().includes(searchTerm)
  );
  if (hasHardwareMatch) {
    return true;
  }

  if (loan.status.toLowerCase().includes(searchTerm)) {
    return true;
  }

  return false;
};