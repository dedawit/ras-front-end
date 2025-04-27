import api from "../config/axios";
import { Feedback, CreateFeedbackData } from "../types/feedback";
import { handleApiError } from "../utils/errorHandler";

export const feedbackService = {
  async createFeedback(feedbackData: CreateFeedbackData): Promise<Feedback> {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const response = await api.post("/feedback/create", feedbackData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Error creating feedback:", error);
      throw handleApiError(error);
    }
  },

  async getFeedbacksByTransactionId(
    transactionId: string
  ): Promise<Feedback[]> {
    try {
      const response = await api.get(`/feedback/transaction/${transactionId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return response.data;
    } catch (error: any) {
      console.error("Error fetching feedbacks:", error);
      throw handleApiError(error);
    }
  },
};
