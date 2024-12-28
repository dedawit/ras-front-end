export interface LoginCredentials {
  email: string;
  password: string;
}

export type LoginErrors = Partial<Record<keyof LoginCredentials, string>>;

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}
