export interface Product {
  id: string;
  title: string;
  category: string;
  image: string;
  imageUri?: string;
  description: string;
  detail?: string;
  createdById: string;
  createdAt: string;
  deletedAt?: string | null;
}

export interface ProductData {
  title: string;
  category: string;
  image: File | string | undefined | null;
  detail?: string;
}
