import apiService from "../../../../shared/modules/instances/AxiosInstance";
import type { Hardware } from "../../model/Hardware";

export type DeactivateHardwareResponse = Hardware;

export const deactivateHardware = async (
  serial: string
): Promise<DeactivateHardwareResponse> => {
  if (!serial?.trim()) {
    throw new Error("El serial del hardware es requerido");
  }

  const response = await apiService.put<DeactivateHardwareResponse>(
    `inventory/hardware/${encodeURIComponent(serial)}/`,
    {}
  );

  return response;
};

export const validateSerial = (serial: string): boolean => {
  if (!serial || typeof serial !== "string") {
    throw new Error("El serial debe ser una cadena de texto válida");
  }

  if (!serial.trim()) {
    throw new Error("El serial no puede estar vacío");
  }

  return true;
};

export const deactivateHardwareWithValidation = async (
  serial: string
): Promise<DeactivateHardwareResponse> => {
  validateSerial(serial);
  return deactivateHardware(serial);
};

export default {
  deactivate: deactivateHardware,
  deactivateWithValidation: deactivateHardwareWithValidation,
  validateSerial,
};
