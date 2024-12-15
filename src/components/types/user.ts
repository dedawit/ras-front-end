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
