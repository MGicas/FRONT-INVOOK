export interface LoanLender {
  id: string;
  rfid: string;
  names: string;
  surnames: string;
  email: string;
  phone: string;
  active: boolean;
}

export interface LoanMonitorProfile {
  rfid: string;
  names: string;
  surnames: string;
  phone: string;
  document_id: string;
}

export interface LoanMonitor {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  state: string;
  role: string;
  profile: LoanMonitorProfile | null;
}

export interface LoanHardware {
  serial: string;
  name: string;
  description: string;
  comment: string;
  hardware_type: string;
  state: string;
  available: string;
  hardware_type_name: string;
  active: boolean;
}

export interface LoanHardwareItem {
  hardware: LoanHardware;
  returned_at: string | null;
  return_state: string | null;
  returned_by: string | null;
}

export interface Loan {
  id: string;
  id_lender: LoanLender;
  id_monitor: LoanMonitor;
  status: string;
  loan_date: string;
  return_date: string | null;
  hardwares: LoanHardwareItem[];
}

export type LoanStatus = 'ABIERTO' | 'CERRADO';
export type HardwareState = 'BUENO' | 'MALO' | 'FUNCIONAL' | 'DAÑADO' | 'EN_REPARACION';

export interface CreateLoanRequest {
  action: "create";
  id_lender: string;
  id_monitor: string;
  serials_hardware: string[];
}

export interface CreateLoanResponse {
  message: string;
  loan: Loan;
}

export interface AddHardwareRequest {
  action: "add_hardware";
  serials_hardware: string[];
}

export interface AddHardwareResponse {
  message: string;
  loan: Loan;
}

export interface HardwareReturn {
  serial: string;
  state: HardwareState;
}

export interface ReturnHardwareRequest {
  action: "return_hardware";
  monitor_id: string;
  serials_hardware: HardwareReturn[];
}

export interface ReturnHardwareResponse {
  message: string;
  loan: Loan;
}

export interface CloseLoanRequest {
  action: "close_loan";
}

export interface CloseLoanResponse {
  message: string;
  loan: Loan;
}

export type LoanActionRequest = 
  | CreateLoanRequest 
  | AddHardwareRequest 
  | ReturnHardwareRequest 
  | CloseLoanRequest;

export type LoanActionResponse = 
  | CreateLoanResponse 
  | AddHardwareResponse 
  | ReturnHardwareResponse 
  | CloseLoanResponse;
