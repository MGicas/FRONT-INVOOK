// inventory/hook/useHardware.ts
import { useEffect, useState } from "react";
import { HardwareService } from "../service/HardwareService";

export interface Hardware {
  serial: string;
  name: string;
  description: string;
  comment: string;
  state: string;
  hardware_type: string;
  available: string;
}

export const useHardware = () => {
  const [hardware, setHardware] = useState<Hardware[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchHardware = async () => {
    setLoading(true);
    try {
      const data = await HardwareService.getAll();
      setHardware(data);
    } catch (err) {
      setError("Error al cargar hardware");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHardware();
  }, []);

  return { hardware, loading, error, refresh: fetchHardware };
};
