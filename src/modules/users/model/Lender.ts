export interface Lender {
  id: string;
  rfid?: string;
  names: string;
  surnames: string;
  email: string;
  phone?: string;
  active: boolean;
}

export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next?: string;
  previous?: string;
}