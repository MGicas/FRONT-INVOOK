import apiService from "../../../../shared/modules/instances/AxiosInstance";
import type { Hardware } from "../../model/Hardware";

export interface UpdateHardwareRequest {
  name?: string;
  description?: string;
  comment?: string;
  hardware_type?: string;
  state?: string;
  available?: string;
}

export type UpdateHardwareResponse = Hardware;

export const updateHardware = async (
  serial: string,
  updateData: UpdateHardwareRequest
): Promise<UpdateHardwareResponse> => {
  if (!serial?.trim()) {
    throw new Error("El serial del hardware es requerido");
  }

  if (!updateData || Object.keys(updateData).length === 0) {
    throw new Error("Debe proporcionar al menos un campo para actualizar");
  }

  const response = await apiService.patch<UpdateHardwareResponse>(
    `inventory/hardware/${encodeURIComponent(serial)}/`,
    updateData
  );

  return response;
};

export const updateHardwareState = async (
  serial: string,
  state: string
): Promise<UpdateHardwareResponse> => {
  return updateHardware(serial, { state });
};

export const updateHardwareAvailability = async (
  serial: string,
  available: string
): Promise<UpdateHardwareResponse> => {
  return updateHardware(serial, { available });
};

export const updateHardwareBasicInfo = async (
  serial: string,
  basicInfo: Pick<UpdateHardwareRequest, "name" | "description" | "comment">
): Promise<UpdateHardwareResponse> => {
  return updateHardware(serial, basicInfo);
};

export const validateUpdateData = (
  updateData: UpdateHardwareRequest
): boolean => {
  if (!updateData || Object.keys(updateData).length === 0) {
    throw new Error("Debe proporcionar al menos un campo para actualizar");
  }

  if (updateData.name !== undefined && typeof updateData.name !== "string") {
    throw new Error("El nombre debe ser una cadena de texto");
  }

  if (
    updateData.description !== undefined &&
    typeof updateData.description !== "string"
  ) {
    throw new Error("La descripción debe ser una cadena de texto");
  }

  if (
    updateData.comment !== undefined &&
    typeof updateData.comment !== "string"
  ) {
    throw new Error("El comentario debe ser una cadena de texto");
  }

  if (
    updateData.hardware_type !== undefined &&
    typeof updateData.hardware_type !== "string"
  ) {
    throw new Error("El tipo de hardware debe ser una cadena de texto");
  }

  if (updateData.state !== undefined && typeof updateData.state !== "string") {
    throw new Error("El estado debe ser una cadena de texto");
  }

  if (
    updateData.available !== undefined &&
    typeof updateData.available !== "string"
  ) {
    throw new Error("La disponibilidad debe ser una cadena de texto");
  }

  return true;
};

export const updateHardwareWithValidation = async (
  serial: string,
  updateData: UpdateHardwareRequest
): Promise<UpdateHardwareResponse> => {
  validateUpdateData(updateData);
  return updateHardware(serial, updateData);
};

export default {
  update: updateHardware,
  updateState: updateHardwareState,
  updateAvailability: updateHardwareAvailability,
  updateBasicInfo: updateHardwareBasicInfo,
  updateWithValidation: updateHardwareWithValidation,
  validate: validateUpdateData,
};
