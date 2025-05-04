import api from "../config/axios";
import { handleApiError } from "../utils/errorHandler";
import { authService } from "./auth";

export interface UserData {
  firstName: string;
  lastName: string;
  companyName: string;
  telephone: string;
  email: string;
  password: string;
  lastRole: "buyer" | "seller";
  profile?: string | null;
}

export const userService = {
  async createUser(userData: UserData) {
    try {
      const response = await api.post("/user/create", userData);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  },

  async switchRole(userId: string, newRole: "buyer" | "seller") {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No access token found");
      }

      console.log(`Switching role for user ${userId} to ${newRole}`);

      // Update role in the backend
      const roleResponse = await api.patch(
        `/user/switch-role/${userId}`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("Role switch response:", roleResponse.data);

      // Refresh JWT token to reflect the new role
      const newAccessToken = await authService.refreshToken();
      console.log("New access token after role switch:", newAccessToken);

      // Verify localStorage update
      const storedToken = localStorage.getItem("accessToken");
      console.log("Stored access token in localStorage:", storedToken);

      return { message: "Role switched successfully", lastRole: newRole };
    } catch (error: any) {
      console.error("Error switching role:", error);
      throw handleApiError(error);
    }
  },
};
