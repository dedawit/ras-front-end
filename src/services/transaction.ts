import api from "../config/axios";
import { handleApiError } from "../utils/errorHandler";

export interface TransactionData {
  transactionId: string;
  bidId: string;
}

export const transactionService = {
  async createTransaction(buyerId: string, transactionData: TransactionData) {
    try {
      console.log(transactionData, "passed");

      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const response = await api.post(
        `/transaction/${buyerId}/create`,
        transactionData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.log(transactionData, "passed");
      console.log("hi");

      console.error("Error creating transaction:", error, transactionData);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
      throw handleApiError(error);
    }
  },
};
