import { useState, useCallback } from "react";
import { extractBackendMessage } from "../../utils/extractBackendMessage";

export function useApiAction() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const run = useCallback(async (apiCall: () => Promise<any>) => {
    setLoading(true);
    setMessage(null);
    setIsError(false);

    try {
      const response = await apiCall();
      setMessage(extractBackendMessage(response));
      setIsError(false);
      return response;
    } catch (err: any) {
      setMessage(extractBackendMessage(err));
      setIsError(true);
      throw err; // por si el componente quiere reaccionar
    } finally {
      setLoading(false);
    }
  }, []);

  return { run, loading, message, isError };
}
