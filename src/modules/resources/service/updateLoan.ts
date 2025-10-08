import apiService from "../../../shared/modules/instances/AxiosInstance";
import type { Loan } from "../model/Loan";

export interface UpdateLoanRequest {
  status?: string;
  return_date?: string | null;
  hardwares?: Loan["hardwares"]; // Permite actualizar el array de hardwares
  // Agrega aquí otros campos si tu backend lo permite
}

export type UpdateLoanResponse = Loan;

/**
 * Actualiza los datos de un préstamo por su ID.
 * @param id UUID del préstamo
 * @param updateData Campos a actualizar
 * @returns Préstamo actualizado
 */
export const updateLoan = async (
  id: string,
  updateData: UpdateLoanRequest
): Promise<UpdateLoanResponse> => {
  if (!id?.trim()) {
    throw new Error("El id del préstamo es requerido");
  }
  if (!updateData || Object.keys(updateData).length === 0) {
    throw new Error("Debe proporcionar al menos un campo para actualizar");
  }
  const response = await apiService.patch<UpdateLoanResponse>(
    `loan/${encodeURIComponent(id)}/`,
    updateData
  );
  return response;
};

/**
 * Actualiza solo el estado del préstamo.
 */
export const updateLoanStatus = async (
  id: string,
  status: string
): Promise<UpdateLoanResponse> => {
  return updateLoan(id, { status });
};

/**
 * Actualiza solo la fecha de devolución del préstamo.
 */
export const updateLoanReturnDate = async (
  id: string,
  return_date: string
): Promise<UpdateLoanResponse> => {
  return updateLoan(id, { return_date });
};

/**
 * Actualiza el array de hardwares del préstamo.
 */
export const updateLoanHardwares = async (
  id: string,
  hardwares: Loan["hardwares"]
): Promise<UpdateLoanResponse> => {
  return updateLoan(id, { hardwares });
};

/**
 * Actualiza varios campos del préstamo.
 */
export const updateLoanFields = async (
  id: string,
  fields: UpdateLoanRequest
): Promise<UpdateLoanResponse> => {
  return updateLoan(id, fields);
};

export default {
  update: updateLoan,
  updateStatus: updateLoanStatus,
  updateReturnDate: updateLoanReturnDate,
  updateHardwares: updateLoanHardwares,
  updateFields: updateLoanFields,
};