import { useCallback, useRef } from 'react';

export const useDebounce = () => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debounce = useCallback((callback: () => void, delay: number) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(callback, delay);
  }, []);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return { debounce, cancel };
};

export default useDebounce;