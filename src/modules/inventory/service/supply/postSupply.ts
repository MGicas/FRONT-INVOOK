import apiService from "../../../../shared/modules/instances/AxiosInstance";
import type { Supply } from "../../model/Supply";

export interface CreateSupplyRequest {
  code: string;
  name: string;
  description: string;
  supply_type: string;
  count: number | string;
  quantity: number | string;
}

export type CreateSupplyResponse = Supply;

export const createSupply = async (
  supplyData: CreateSupplyRequest
): Promise<CreateSupplyResponse> => {
  try {
    const response = await apiService.post<CreateSupplyResponse>(
      "inventory/supply/",
      supplyData
    );
    
    return response;
  } catch (error) {
    console.error("Error al crear suministro:", error);
    throw error;
  }
};

export const validateSupplyData = (supplyData: CreateSupplyRequest): boolean => {
  if (!supplyData.code?.trim()) {
    throw new Error("El código del suministro es requerido");
  }

  if (!supplyData.name?.trim()) {
    throw new Error("El nombre del suministro es requerido");
  }

  if (!supplyData.description?.trim()) {
    throw new Error("La descripción del suministro es requerida");
  }

  if (!supplyData.supply_type?.trim()) {
    throw new Error("El tipo de suministro es requerido");
  }

  if (typeof supplyData.count !== "number" || supplyData.count < 0) {
    throw new Error("El conteo debe ser un número válido mayor o igual a 0");
  }

  if (typeof supplyData.quantity !== "number" || supplyData.quantity <= 0) {
    throw new Error("La cantidad debe ser un número válido mayor a 0");
  }

  if (supplyData.count > supplyData.quantity) {
    throw new Error("El conteo no puede ser mayor que la cantidad total");
  }

  return true;
};

export const createSupplyWithValidation = async (
  supplyData: CreateSupplyRequest
): Promise<CreateSupplyResponse> => {
  validateSupplyData(supplyData);
  return createSupply(supplyData);
};

export const createSupplyWithDefaults = async (
  partialData: Partial<CreateSupplyRequest> & { name: string }
): Promise<CreateSupplyResponse> => {
  const defaultSupplyData: CreateSupplyRequest = {
    code: partialData.code || `SUP${Date.now()}`,
    name: partialData.name,
    description: partialData.description || "",
    supply_type: partialData.supply_type || "GENERAL",
    count: partialData.count || 0,
    quantity: partialData.quantity || 1,
  };

  return createSupplyWithValidation(defaultSupplyData);
};

export default {
  create: createSupply,
  createWithValidation: createSupplyWithValidation,
  createWithDefaults: createSupplyWithDefaults,
  validate: validateSupplyData,
};
