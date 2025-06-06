import api from "../config/axios";
import { handleApiError } from "../utils/errorHandler";

// Interface for RFQ data (matching the provided RFQ interface)
export interface RFQ {
  id: string;
  title: string;
  projectName: string;
  purchaseNumber: string;
  quantity: number | string;
  category: string;
  detail?: string;
  auctionDoc?: File | string | null;
  guidelineDoc?: File | string | null;
  deadline: string | null;
  createdAt?: any;
  state?: string;
  autionDocUrl?: string;
  guidelineDocUrl?: string;
  rfqId?: string;
  winningBidPrice?: number;
  transactionId?: string;
}

// Interface for RFQ Summary
export interface RFQSummary {
  name: string;
  value: number;
}
export interface BidStateCount {
  id?: string;
  title?: string;
  projectName?: string;
  quantity?: number | string;
  category?: string;
  deadline?: string | null;
  bidPrice?: number;
  state: string;
  count?: number;
}

export const rfqReportService = {
  /**
   * Fetches RFQ history for a specific buyer
   * @param buyerId - The ID of the buyer
   * @returns Array of RFQ objects
   */
  async getRFQHistory(buyerId: string): Promise<RFQ[]> {
    try {
      const response = await api.get(`/rfq/detail/${buyerId}/history`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching RFQ history:", error);
      throw handleApiError(error);
    }
  },

  /**
   * Fetches RFQ summary for a specific buyer
   * @param buyerId - The ID of the buyer
   * @returns Array of RFQSummary objects
   */
  async getRFQSummary(buyerId: string): Promise<RFQSummary[]> {
    try {
      const response = await api.get(`/rfq/dashboard/summary/${buyerId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching RFQ summary:", error);
      throw handleApiError(error);
    }
  },

  async getBidStateCounts(sellerId: string): Promise<BidStateCount[]> {
    try {
      const response = await api.get(`/bid/state-count/${sellerId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching bid state counts:", error);
      throw handleApiError(error);
    }
  },
};
