interface SupplyDetail {
    supply_code: string;
    supply: string;
    quantity: number;
}

interface SupplyCreate {
    supply_name: string;
    quantity: number;
}

export interface Consum {
    id: string;
    id_lender: string;
    id_monitor: string;
    supplies_detail?: SupplyDetail[];
}

export interface ConsumCreateRequest {
    id_lender: string;
    id_monitor: string;
    supplies: SupplyCreate[];
}

export interface ConsumCreateResponse {
    id: string;
    id_lender: string;
    id_monitor: string;
    supplies_detail: SupplyDetail[];
}