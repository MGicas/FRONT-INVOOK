export interface Supply {
  code: string;           
  name: string;        
  supply_type: string;   
  description: string;      
  count: string;          
  stock: number;      
  quantity: number;        
}

export const SUPPLY_SORT_OPTIONS = [
  'codigo',
  'nombre',
  'cuenta',
  'existencia',
  'cantidad',
] as const;

export type SupplySortField = typeof SUPPLY_SORT_OPTIONS[number];

export interface SupplyFilters {
  search?: string;
  supply_type?: string;
}