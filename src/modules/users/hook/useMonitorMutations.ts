import { useState, useCallback } from "react";
import { 
  createMonitor, 
  deleteMonitor,
  type CreateMonitorRequest,
} from "../service/postMonitor";
import { 
  updateMonitor,
  type UpdateMonitorRequest 
} from "../service/updateMonitor";
import {
  changeMonitorState,
  deactivateMonitor,
  activateMonitor,
  suspendMonitor,
} from "../service/changeStateMonitor";
import type { Monitor } from "../model/Monitor";

interface UseMonitorMutationsReturn {
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  changingState: boolean;
  error: string | null;
  createMonitor: (data: CreateMonitorRequest) => Promise<Monitor | null>;
  updateMonitor: (id: number, data: UpdateMonitorRequest) => Promise<Monitor | null>;
  deleteMonitor: (id: number) => Promise<boolean>;
  changeMonitorState: (id: number, newState: 'ACTIVO' | 'INACTIVO') => Promise<Monitor | null>;
  deactivateMonitor: (id: number) => Promise<Monitor | null>;
  activateMonitor: (id: number) => Promise<Monitor | null>;
  suspendMonitor: (id: number) => Promise<Monitor | null>;
  clearError: () => void;
}

export const useMonitorMutations = (): UseMonitorMutationsReturn => {
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [changingState, setChangingState] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateMonitor = useCallback(async (data: CreateMonitorRequest): Promise<Monitor | null> => {
    try {
      setCreating(true);
      setError(null);
      const newMonitor = await createMonitor(data);
      return newMonitor;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al crear monitor";
      setError(errorMessage);
      console.error("Error creating monitor:", err);
      return null;
    } finally {
      setCreating(false);
    }
  }, []);

  const handleUpdateMonitor = useCallback(async (id: number, data: UpdateMonitorRequest): Promise<Monitor | null> => {
    try {
      setUpdating(true);
      setError(null);
      const updatedMonitor = await updateMonitor(id, data);
      return updatedMonitor;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al actualizar monitor";
      setError(errorMessage);
      console.error("Error updating monitor:", err);
      return null;
    } finally {
      setUpdating(false);
    }
  }, []);

  const handleDeleteMonitor = useCallback(async (id: number): Promise<boolean> => {
    try {
      setDeleting(true);
      setError(null);
      await deleteMonitor(id);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al eliminar monitor";
      setError(errorMessage);
      console.error("Error deleting monitor:", err);
      return false;
    } finally {
      setDeleting(false);
    }
  }, []);

  const handleChangeMonitorState = useCallback(async (id: number, newState: 'ACTIVO' | 'INACTIVO'): Promise<Monitor | null> => {
    try {
      setChangingState(true);
      setError(null);
      const updatedMonitor = await changeMonitorState(id, newState);
      return updatedMonitor;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al cambiar estado del monitor";
      setError(errorMessage);
      console.error("Error changing monitor state:", err);
      return null;
    } finally {
      setChangingState(false);
    }
  }, []);

  const handleDeactivateMonitor = useCallback(async (id: number): Promise<Monitor | null> => {
    try {
      setChangingState(true);
      setError(null);
      const updatedMonitor = await deactivateMonitor(id);
      return updatedMonitor;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al desactivar monitor";
      setError(errorMessage);
      console.error("Error deactivating monitor:", err);
      return null;
    } finally {
      setChangingState(false);
    }
  }, []);

  const handleActivateMonitor = useCallback(async (id: number): Promise<Monitor | null> => {
    try {
      setChangingState(true);
      setError(null);
      const updatedMonitor = await activateMonitor(id);
      return updatedMonitor;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al activar monitor";
      setError(errorMessage);
      console.error("Error activating monitor:", err);
      return null;
    } finally {
      setChangingState(false);
    }
  }, []);

  const handleSuspendMonitor = useCallback(async (id: number): Promise<Monitor | null> => {
    try {
      setChangingState(true);
      setError(null);
      const updatedMonitor = await suspendMonitor(id);
      return updatedMonitor;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al suspender monitor";
      setError(errorMessage);
      console.error("Error suspending monitor:", err);
      return null;
    } finally {
      setChangingState(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    creating,
    updating,
    deleting,
    changingState,
    error,
    createMonitor: handleCreateMonitor,
    updateMonitor: handleUpdateMonitor,
    deleteMonitor: handleDeleteMonitor,
    changeMonitorState: handleChangeMonitorState,
    deactivateMonitor: handleDeactivateMonitor,
    activateMonitor: handleActivateMonitor,
    suspendMonitor: handleSuspendMonitor,
    clearError,
  };
};

export default useMonitorMutations;