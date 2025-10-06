export interface BaseInventoryItem {
  id: string;
  name: string;
  description?: string;
  category: string;
  status: 'active' | 'inactive' | 'maintenance' | 'retired';
}

export interface Equipment extends BaseInventoryItem {
  serialNumber: string;
  brand: string;
  model: string;
  purchaseDate?: string;
  warrantyExpiration?: string;
  value?: number;
  specifications?: Record<string, string>;
  isLoanable: boolean; 
}

export interface Supply extends BaseInventoryItem {
  brand?: string;
  unitOfMeasure: string;
  currentStock: number;
  minimumStock: number;
  maximumStock?: number;
  unitCost?: number;
  supplier?: string;
  lastRestockDate?: string;
  expirationDate?: string;
}

export type InventoryStatus = 'active' | 'inactive' | 'maintenance' | 'retired';

export interface InventoryFilters {
  status?: InventoryStatus[];
  category?: string[];
  location?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  searchTerm?: string;
}

export interface PaginatedInventoryResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface InventoryStats {
  total: number;
  byStatus: Record<InventoryStatus, number>;
  byCategory: Record<string, number>;
  lowStockSupplies?: number;
  expiringSoon?: number;
  onLoan?: number;
}