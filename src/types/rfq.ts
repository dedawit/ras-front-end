export interface RFQ {
  id: string;
  productName: string;
  quantity: number | string;
  date?: string;
  category: string;
  detail?: string;
  file?: File | null;
  expiryDate?: string;
  createdAt?: any;
}

export interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
}
