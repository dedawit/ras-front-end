import api from "../config/axios";
import { LoginCredentials } from "../types/auth";
import { handleApiError } from "../utils/errorHandler";

export const authService = {
  async login(credentials: LoginCredentials) {
    try {
      const { data } = await api.post("/auth/login", credentials);
      localStorage.setItem("token", data.token);
      return data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post("/auth/logout");
      localStorage.removeItem("token");
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
