export interface RFQ {
  id: string;
  productName: string;
  quantity: number | string;
  date?: string;
  category: string;
  detail?: string;
  file?: File | null;
  deadline?: string | null;
  createdAt?: any;
  state?: boolean;
  fileUrl?: string;
}

export interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
}
