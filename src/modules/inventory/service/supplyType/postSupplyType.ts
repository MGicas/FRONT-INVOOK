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

export const createSupplyType = async (
  data: CreateSupplyTypeRequest
): Promise<SupplyTypeResponse> => {
  const response = await apiService.post<SupplyTypeResponse>(
    "inventory/supply-types/",
    data
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