import { useEffect, useState } from "react";
import MonitorService from "../service/MonitorService";
import type { Monitor } from "../model/Monitor";

export const useMonitors = () => {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMonitors = async (params?: { page?: number; page_size?: number; name?: string }) => {
    try {
      setLoading(true);
      const res = await MonitorService.list(params);
      const results = (res as any)?.results ?? (res as any);
      setMonitors(results as Monitor[]);
      setError(null);
    } catch (err) {
      setError("Error al cargar los monitores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonitors();
  }, []);

  return { monitors, loading, error, fetchMonitors };
};
