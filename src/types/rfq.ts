export interface RFQ {
  id: string;
  title: string;
  projectName: string;
  purchaseNumber: string;
  quantity: number | string;
  category: string;
  detail?: string;
  auctionDoc?: File | string | null;
  guidelineDoc?: File | string | null;
  deadline: string | null;
  createdAt?: any;
  state?: string;
  autionDocUrl?: string;
  guidelineDocUrl?: string;
}

export interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
}
