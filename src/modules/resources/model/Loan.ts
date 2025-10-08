export interface Lender {
  id: string;
  rfid: string;
  names: string;
  surnames: string;
  email: string;
  phone: string;
  active: boolean;
}

export interface MonitorProfile {
  rfid: string;
  names: string;
  surnames: string;
  phone: string;
  document_id: string;
}

export interface Monitor {
  id: string | number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  state: string;
  role: string;
  profile: MonitorProfile;
}

export interface HardwareItem {
  hardware: {
    serial: string;
    name: string;
    description: string;
    comment: string;
    hardware_type: string;
    state: string;
    available: string;
    hardware_type_name: string;
    active: boolean;
  };
  returned_at: string | null;
  return_state: string | null;
  returned_by: string | null;
}

export interface Loan {
  id: string;
  id_lender: Lender;
  id_monitor: Monitor;
  status: string;
  loan_date: string;
  return_date?: string | null;
  hardwares: HardwareItem[];
}
