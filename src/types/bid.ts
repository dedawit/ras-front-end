import { RFQ } from "./rfq";
import { FullUser, User } from "./user";

export interface BidItem {
  id?: string; // Optional for sending, provided by backend on creation
  item: string;
  quantity: number | string; // Flexible for API response (string) and input (number)
  unit: string;
  singlePrice: number | string;
  transportFee?: number | string | null;
  taxes?: number | string | null;
  totalPrice: number | string;
}

// Unified Interface for Bid (used for both sent and received data)
export interface Bid {
  id?: string; // Optional for sending, provided by backend
  rfqId?: string;
  rfq: RFQ; // Required for all operations
  createdBy?: FullUser; // Optional for sending, set by backend
  files?: File | string | null; // File for sending, string URL for receiving
  totalPrice: number | string; // Required, flexible type
  bidItems: BidItem[]; // Required for creation, returned with IDs
  createdAt?: any; // Optional for sending, returned by backend
  deletedAt?: string | null; // Optional for sending, returned for soft delete
  bidFilesUrl?: string; // Optional for sending, returned by backend
  state: string;
  transactions?: any[]; // Optional for sending, returned by backend
}

// Optional: FormFieldProps for form components
export interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
}
