import { useState, useCallback } from 'react';
import { createLender, type CreateLenderRequest } from '../service/postLender';
import { updateLender, type UpdateLenderRequest } from '../service/updateLenders';
import { deleteLender } from '../service/deleteLender';

interface UseLenderMutationsReturn {
  createLenderLoading: boolean;
  createLenderError: string | null;
  updateLenderLoading: boolean;
  updateLenderError: string | null;
  deleteLenderLoading: boolean;
  deleteLenderError: string | null;
  handleCreateLender: (lenderData: CreateLenderRequest) => Promise<boolean>;
  handleUpdateLender: (id: string, lenderData: UpdateLenderRequest) => Promise<boolean>;
  handleDeleteLender: (id: string) => Promise<boolean>;
}

export const useLenderMutations = (): UseLenderMutationsReturn => {
  const [createLenderLoading, setCreateLenderLoading] = useState(false);
  const [createLenderError, setCreateLenderError] = useState<string | null>(null);
  const [updateLenderLoading, setUpdateLenderLoading] = useState(false);
  const [updateLenderError, setUpdateLenderError] = useState<string | null>(null);
  const [deleteLenderLoading, setDeleteLenderLoading] = useState(false);
  const [deleteLenderError, setDeleteLenderError] = useState<string | null>(null);

  const handleCreateLender = useCallback(async (lenderData: CreateLenderRequest): Promise<boolean> => {
    try {
      setCreateLenderLoading(true);
      setCreateLenderError(null);
      
      await createLender(lenderData);
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear prestamista';
      setCreateLenderError(errorMessage);
      console.error('Error creating lender:', error);
      return false;
    } finally {
      setCreateLenderLoading(false);
    }
  }, []);

  const handleUpdateLender = useCallback(async (id: string, lenderData: UpdateLenderRequest): Promise<boolean> => {
    try {
      setUpdateLenderLoading(true);
      setUpdateLenderError(null);
      
      await updateLender(id, lenderData);
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar prestamista';
      setUpdateLenderError(errorMessage);
      console.error('Error updating lender:', error);
      return false;
    } finally {
      setUpdateLenderLoading(false);
    }
  }, []);

  const handleDeleteLender = useCallback(async (id: string): Promise<boolean> => {
    try {
      setDeleteLenderLoading(true);
      setDeleteLenderError(null);
      
      await deleteLender(id);
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar prestamista';
      setDeleteLenderError(errorMessage);
      console.error('Error deleting lender:', error);
      return false;
    } finally {
      setDeleteLenderLoading(false);
    }
  }, []);

  return {
    createLenderLoading,
    createLenderError,
    updateLenderLoading,
    updateLenderError,
    deleteLenderLoading,
    deleteLenderError,
    handleCreateLender,
    handleUpdateLender,
    handleDeleteLender,
  };
};

export default useLenderMutations;