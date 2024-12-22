// userService.ts
import api from "../config/axios";
import { handleApiError } from "../utils/errorHandler";

export interface UserData {
  firstName: string;
  lastName: string;
  companyName: string;
  telephone: string;
  email: string;
  password: string;
  lastRole: "buyer" | "seller";
  profile?: string;
}

// Function to create a user
export const userService = {
  async createUser(userData: UserData) {
    try {
      const response = await api.post("/user/create", userData);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  },
};
