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

const generateRandomId = (): string => {
  try {
    const globalCrypto: any = (typeof globalThis !== "undefined" ? (globalThis as any).crypto : undefined);
    if (globalCrypto && typeof globalCrypto.randomUUID === "function") {
      return globalCrypto.randomUUID();
    }
  } catch (_) {
    // ignore and use fallback
  }
  // Fallback: timestamp + random segment
  return `ht_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
};

export const createHardwareType = async (
  data: CreateHardwareTypeRequest
): Promise<HardwareTypeResponse> => {
  // Matches API: /api/v1/invook/inventory/hardware-types/
  const payload = { id: generateRandomId(), ...data };
  const response = await apiService.post<HardwareTypeResponse>(
    "inventory/hardware-types/",
    payload
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
