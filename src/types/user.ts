export interface CreateAccountFormData {
  email: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  firstName: string;
  lastName: string;
  telephone: string;
  lastRole: "buyer" | "seller";
}

export type FormErrors = Partial<Record<keyof CreateAccountFormData, string>>;

export interface FormState {
  formData: CreateAccountFormData;
  errors: FormErrors;
  isLoading: boolean;
  successMessage: string | null;
  errorMessage: string | null;
}

export interface User {
  name: string;
  avatar: string;
}

export interface FullUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  telephone: string;
  isActive: boolean;
  lastRole: "buyer" | "seller";
  password?: string;
  refreshToken?: string;
  tokenVersion?: number;
  profile?: any;
  createdAt: string;
  deletedAt: string | null;
}

export type UserMode = "buyer" | "seller";
