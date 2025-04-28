import api from "../config/axios";
import { Transaction } from "../types/transaction";
import { handleApiError } from "../utils/errorHandler";

export interface TransactionData {
  transactionId: string;
  bidId: string;
}

export interface SingleTransaction {
  transactionId: string;
  projectName: string;
  totalPrice: number;
  quantity: number;
  date: string;
  companyName: string;
  companyNameBuyer?: string;
}

export const transactionService = {
  async createTransaction(buyerId: string, transactionData: TransactionData) {
    try {
      const token = localStorage.getItem("accessToken");
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
      console.error("Error creating transaction:", error, transactionData);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
      throw handleApiError(error);
    }
  },

  async getTransactions(buyerId: string): Promise<Transaction[]> {
    try {
      const response = await api.get(`/transaction/buyer/${buyerId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      return response.data.sort(
        (a: Transaction, b: Transaction) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw handleApiError(error);
    }
  },

  async getTransactionById(transactionId: string): Promise<SingleTransaction> {
    try {
      const response = await api.get(`/transaction/${transactionId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      const data = response.data;

      const mappedTransaction: SingleTransaction = {
        transactionId: data.transactionId,
        projectName: data.bid?.rfq?.projectName || "",
        totalPrice: data.bid?.totalPrice || 0,
        quantity: data.bid?.rfq?.quantity || 0,
        date: data.date,
        companyName: data.bid?.createdBy?.companyName || "",
        companyNameBuyer: data.bid?.rfq?.createdBy?.companyName || "",
      };

      return mappedTransaction;
    } catch (error) {
      console.error("Error fetching transaction by ID:", error);
      throw handleApiError(error);
    }
  },

  async getTransactionsSeller(sellerId: string): Promise<Transaction[]> {
    try {
      const response = await api.get(`/transaction/seller/${sellerId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      return response.data.sort(
        (a: Transaction, b: Transaction) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw handleApiError(error);
    }
  },
};
