export interface SupplyType {
  id: string;
  name: string;
  description: string;
}

export interface CreateSupplyTypeRequest {
  name: string;
  description: string;
}

export interface UpdateSupplyTypeRequest extends Partial<CreateSupplyTypeRequest> {
  id: string;
}