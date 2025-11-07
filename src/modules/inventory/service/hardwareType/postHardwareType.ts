import apiService from "../../../../shared/modules/instances/AxiosInstance";

export interface CreateHardwareTypeRequest {
  name: string;
  description: string;
}

export interface HardwareTypeResponse {
  id: string;
  name: string;
  description: string;
}

export const createHardwareType = async (
  data: CreateHardwareTypeRequest
): Promise<HardwareTypeResponse> => {
  // Matches API: /api/v1/invook/inventory/hardware-types/
  const response = await apiService.post<HardwareTypeResponse>(
    "inventory/hardware-types/",
    data
  );
  return response;
};

export const validateHardwareTypeData = (
  data: CreateHardwareTypeRequest
): string[] => {
  const errors: string[] = [];
  if (!data.name?.trim()) errors.push("El nombre es requerido");
  if (!data.description?.trim()) errors.push("La descripción es requerida");
  return errors;
};

export const createHardwareTypeWithValidation = async (
  data: CreateHardwareTypeRequest
): Promise<HardwareTypeResponse> => {
  const validationErrors = validateHardwareTypeData(data);
  if (validationErrors.length > 0) {
    throw new Error(`Datos inválidos: ${validationErrors.join(", ")}`);
  }
  return await createHardwareType(data);
};

export const HardwareTypeCreateService = {
  create: createHardwareType,
  createWithValidation: createHardwareTypeWithValidation,
  validate: validateHardwareTypeData,
};

export default HardwareTypeCreateService;
