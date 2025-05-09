import api from "../config/axios";
import { LoginCredentials } from "../types/auth";
import { handleApiError } from "../utils/errorHandler";

export const authService = {
  async login(credentials: LoginCredentials) {
    try {
      const { data } = await api.post("/auth/login", credentials);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      return data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  },

  async refreshToken(): Promise<string> {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }
      const { data } = await api.post("/auth/refresh-token", { refreshToken });
      localStorage.setItem("accessToken", data.accessToken);
      return data.accessToken;
    } catch (error: any) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      throw handleApiError(error);
    }
  },
  async logout(): Promise<void> {
    try {
      const token = localStorage.getItem("accessToken");
      await api.post(
        "/auth/logout",
        {}, // No body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
