import apiService from "../../../../shared/modules/instances/AxiosInstance";

export interface CreateSupplyTypeRequest {
  name: string;
  description: string;
}

export interface SupplyTypeResponse {
  id: string;
  name: string;
  description: string;
}

// Simple ID generator using Web Crypto when available, with a fallback
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
  return `st_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
};

export const createSupplyType = async (
  data: CreateSupplyTypeRequest
): Promise<SupplyTypeResponse> => {
  const payload = { id: generateRandomId(), ...data };
  const response = await apiService.post<SupplyTypeResponse>(
    "inventory/supply-types/",
    payload
  );
  return response;
};

export const validateSupplyTypeData = (
  data: CreateSupplyTypeRequest
): string[] => {
  const errors: string[] = [];
  if (!data.name?.trim()) errors.push("El nombre es requerido");
  if (!data.description?.trim()) errors.push("La descripción es requerida");
  return errors;
};

export const createSupplyTypeWithValidation = async (
  data: CreateSupplyTypeRequest
): Promise<SupplyTypeResponse> => {
  const validationErrors = validateSupplyTypeData(data);
  if (validationErrors.length > 0) {
    throw new Error(`Datos inválidos: ${validationErrors.join(", ")}`);
  }
  return await createSupplyType(data);
};

export const SupplyTypeCreateService = {
  create: createSupplyType,
  createWithValidation: createSupplyTypeWithValidation,
  validate: validateSupplyTypeData,
};

export default SupplyTypeCreateService;