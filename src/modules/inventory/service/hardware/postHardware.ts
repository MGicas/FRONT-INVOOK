import apiService from "../../../../shared/modules/instances/AxiosInstance";
import type { Hardware } from "../../model/Hardware";

export interface CreateHardwareRequest {
  serial: string;
  name: string;
  description: string;
  comment: string;
  hardware_type: string;
  state: string;
  available: string;
}

export const createHardware = async (
  hardwareData: CreateHardwareRequest
): Promise<Hardware> => {
  const response = await apiService.post<Hardware>("inventory/hardware/", hardwareData);

  return response;
};

export const validateHardwareData = (data: CreateHardwareRequest): string[] => {
  const errors: string[] = [];

  if (!data.serial?.trim()) {
    errors.push("El serial es requerido");
  }

  if (!data.name?.trim()) {
    errors.push("El nombre es requerido");
  }

  if (!data.description?.trim()) {
    errors.push("La descripción es requerida");
  }

  if (!data.hardware_type?.trim()) {
    errors.push("El tipo de hardware es requerido");
  }

  if (!data.state?.trim()) {
    errors.push("El estado es requerido");
  }

  if (!data.available?.trim()) {
    errors.push("La disponibilidad es requerida");
  }

  return errors;
};
export const createHardwareWithValidation = async (
  hardwareData: CreateHardwareRequest
): Promise<Hardware> => {
  const validationErrors = validateHardwareData(hardwareData);

  if (validationErrors.length > 0) {
    throw new Error(`Datos inválidos: ${validationErrors.join(", ")}`);
  }

  return await createHardware(hardwareData);
};
export const HardwareCreateService = {
  create: createHardware,
  createWithValidation: createHardwareWithValidation,
  validate: validateHardwareData,
};

export default HardwareCreateService;
