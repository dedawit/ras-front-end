export interface RFQ {
  id: string;
  title: string;
  quantity: number | string;
  date?: string;
  category: string;
  details?: string;
  file?: File | null;
  expiryDate?: string;
}

export interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
}
