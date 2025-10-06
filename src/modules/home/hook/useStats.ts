import { useState, useEffect } from 'react';
import StatsService from '../service/StatsService';
import type { Stats } from '../model/Stats';


interface UseStatsState {
  stats: Stats | null;
  isLoading: boolean;
  error: string;
}

export const useStats = () => {
  const [state, setState] = useState<UseStatsState>({
    stats: null,
    isLoading: false,
    error: '',
  });

  const fetchStats = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: '' }));
    
    try {
      const statsData = await StatsService.getStats();
      setState({
        stats: statsData,
        isLoading: false,
        error: '',
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al cargar estadísticas',
        isLoading: false,
      }));
    }
  };

  const refreshStats = () => {
    fetchStats();
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: '' }));
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats: state.stats,
    isLoading: state.isLoading,
    error: state.error,
    refreshStats,
    clearError,
  };
};