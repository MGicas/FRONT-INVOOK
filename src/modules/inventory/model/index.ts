export type {
  BaseInventoryItem,
  Equipment,
  Supply,
  InventoryStatus,
  InventoryFilters,
  PaginatedInventoryResponse,
  InventoryStats,
} from "./InventoryTypes";

export {
  getInventoryOptions,
  InventoryOptionsUtils,
  type InventoryOption,
} from "./InventoryOptions";

export {
  INVENTORY_STATUS_OPTIONS,
  EQUIPMENT_CATEGORIES,
  SUPPLY_CATEGORIES,
  UNIT_OF_MEASURE_OPTIONS,
  LOCATION_OPTIONS,
  PAGINATION_CONFIG,
  STOCK_ALERTS,
  INVENTORY_ROUTES,
  VALIDATION_MESSAGES,
} from "./InventoryConstants";

export type { InventoryStatus as StatusType } from "./InventoryTypes";
