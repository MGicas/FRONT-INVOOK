export type ResourceStatus = 'available' | 'consumed' | 'reserved' | 'expired';
export type LoanStatus = 'active' | 'returned' | 'overdue' | 'pending';

export interface BaseResource {
  id: string;
  name: string;
  description?: string;
  category: string;
  location: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Loan extends BaseResource {
  borrowerId: string;
  borrowerName: string;
  borrowerEmail: string;
  itemId: string;
  itemName: string;
  loanDate: Date;
  expectedReturnDate: Date;
  actualReturnDate?: Date;
  status: LoanStatus;
  notes?: string;
}

export interface ResourceFormData {
  name: string;
  description?: string;
  category: string;
  location: string;
}

export interface LoanFormData {
  borrowerId: string;
  borrowerName: string;
  borrowerEmail: string;
  itemId: string;
  itemName: string;
  expectedReturnDate: Date;
  notes?: string;
}